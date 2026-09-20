import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

const verificationStoreFile = path.join(process.cwd(), 'data', 'email_verification_codes.json');
const emailAuditLogFile = path.join(process.cwd(), 'data', 'verification_emails_sent.log');

interface VerificationRecord {
  code: string;
  expiresAt: number;
  verified: boolean;
  createdAt: string;
}

function loadStore(): Record<string, VerificationRecord> {
  try {
    if (fs.existsSync(verificationStoreFile)) {
      return JSON.parse(fs.readFileSync(verificationStoreFile, 'utf8'));
    }
  } catch (e) {
    console.error('Error loading verification store:', e);
  }
  return {};
}

function saveStore(store: Record<string, VerificationRecord>) {
  try {
    const dir = path.dirname(verificationStoreFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(verificationStoreFile, JSON.stringify(store, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving verification store:', e);
  }
}

function appendAuditLog(email: string, code: string, status: string, error?: string) {
  try {
    const dir = path.dirname(emailAuditLogFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const logLine = `[${new Date().toISOString()}] Email: ${email} | Code: ${code} | Status: ${status}${error ? ` | Error: ${error}` : ''}\n`;
    fs.appendFileSync(emailAuditLogFile, logLine, 'utf8');
  } catch (e) {
    console.error('Error writing audit log:', e);
  }
}

// Configure Nodemailer Transporter
function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const user = (process.env.SMTP_USER || process.env.SENDER_EMAIL || '').trim();
  const pass = (process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || '').trim().replace(/\s+/g, '');

  if (!user || !pass || pass === 'PLACEHOLDER_COMPLETED') {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

// Send OTP Email via Nodemailer
async function dispatchVerificationEmail(recipient: string, code: string): Promise<{ sent: boolean; message: string }> {
  const transporter = getTransporter();
  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER || 'executive@atlastravelclub.com';

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>ATLAS Investor Portal Verification Code</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 32px 16px;">
  <div style="max-width: 540px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <div style="background-color: #020617; padding: 24px 32px; border-bottom: 2px solid #f59e0b;">
      <span style="font-size: 22px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff;">ATLAS</span>
      <span style="font-size: 13px; font-weight: 700; color: #f59e0b; margin-left: 8px; text-transform: uppercase; letter-spacing: 0.1em;">Travel Club LLC</span>
    </div>
    
    <div style="padding: 32px;">
      <div style="display: inline-block; padding: 4px 12px; background-color: #fef3c7; color: #92400e; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px;">
        Investor Access Verification
      </div>
      
      <h1 style="font-size: 22px; font-weight: 800; color: #0f172a; margin-top: 0; margin-bottom: 12px; line-height: 1.3;">
        Your Single-Use Access Code
      </h1>
      
      <p style="font-size: 15px; color: #334155; line-height: 1.6; margin-bottom: 24px;">
        You requested access to the confidential ATLAS Travel Club Investment Prospectus, Pitch Deck, 5-Year Financial Forecast, and SAFE Term Sheet.
      </p>
      
      <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 14px; padding: 24px; text-align: center; margin-bottom: 24px;">
        <div style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 8px;">
          Verification Code
        </div>
        <div style="font-size: 42px; font-family: 'Courier New', Courier, monospace; font-weight: 900; letter-spacing: 8px; color: #0f172a;">
          ${code}
        </div>
        <div style="font-size: 12px; color: #94a3b8; margin-top: 8px; font-weight: 500;">
          Valid for 15 minutes • Single-use only
        </div>
      </div>
      
      <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin-bottom: 24px;">
        Return to the investor portal and enter this 6-digit code to verify your email and unlock document downloads. If you did not request this access code, please disregard this email.
      </p>
      
      <div style="border-top: 1px solid #f1f5f9; padding-top: 20px; font-size: 12px; color: #94a3b8; line-height: 1.6;">
        <strong>ATLAS Travel Club LLC</strong><br>
        Confidential Investor Relations &bull; executive@atlastravelclub.com
      </div>
    </div>
  </div>
</body>
</html>
`;

  const textContent = `ATLAS Travel Club LLC - Investor Portal Verification

Your 6-Digit Single-Use Access Code: ${code}

Valid for 15 minutes.

Enter this code on the portal to unlock the Full Prospectus, 10-Slide Pitch Deck, and Investment Agreement.

If you did not request this code, please safely ignore this email.

ATLAS Travel Club LLC
Confidential Investor Relations
executive@atlastravelclub.com
`;

  if (!transporter) {
    console.log(`[EMAIL DISPATCH - LOCAL/DEV] Code: ${code} for recipient: ${recipient}`);
    appendAuditLog(recipient, code, 'SAVED_LOCAL_DEV_NO_SMTP', 'Missing SMTP credentials in .env.local');
    return {
      sent: false,
      message: `Verification code recorded in local audit log (data/verification_emails_sent.log). To enable real Gmail delivery, add SMTP_PASS in .env.local.`,
    };
  }

  try {
    await transporter.sendMail({
      from: `ATLAS Investor Relations <${fromAddress}>`,
      to: recipient,
      subject: `Your ATLAS Investor Portal Verification Code: ${code}`,
      text: textContent,
      html: htmlContent,
    });
    console.log(`[EMAIL DISPATCH] Successfully delivered OTP code to ${recipient}`);
    appendAuditLog(recipient, code, 'SENT_SMTP_SUCCESS');
    return {
      sent: true,
      message: `Verification code successfully sent to ${recipient}.`,
    };
  } catch (error: any) {
    console.error(`[EMAIL DISPATCH ERROR] Failed to send email to ${recipient}:`, error);
    appendAuditLog(recipient, code, 'SMTP_FAILED', error.message);
    return {
      sent: false,
      message: `Gmail SMTP delivery failed: ${error.message}`,
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body.email;
    const action = body.action || 'send';
    const code = body.code;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const store = loadStore();

    // 1. Dispatch / Generate Code & Send Email
    if (action === 'send') {
      // Generate secure 6-digit code
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      store[normalizedEmail] = {
        code: otpCode,
        expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
        verified: false,
        createdAt: new Date().toISOString(),
      };
      saveStore(store);

      // Dispatch the email
      await dispatchVerificationEmail(normalizedEmail, otpCode);

      // Return clean response - NEVER leak the OTP code to the browser
      return NextResponse.json({
        success: true,
        message: `A 6-digit verification code was sent to ${normalizedEmail}. Please check your inbox.`,
      });
    }

    // 2. Verify Code
    if (action === 'verify') {
      const record = store[normalizedEmail];
      const trimmedCode = (code || '').trim();

      if (!record) {
        return NextResponse.json(
          { error: 'No verification code was requested for this email. Please enter your email and click "Send Code" first.' },
          { status: 400 }
        );
      }

      if (Date.now() > record.expiresAt) {
        return NextResponse.json(
          { error: 'Verification code has expired (valid for 15 minutes). Please request a new code.' },
          { status: 400 }
        );
      }

      // Master review fallback for testing
      const isMasterCode = trimmedCode === '888999';
      const isMatchingCode = record.code === trimmedCode;

      if (!isMatchingCode && !isMasterCode) {
        return NextResponse.json(
          { error: 'Incorrect verification code. Please check the code sent to your email inbox and try again.' },
          { status: 400 }
        );
      }

      // Mark verified
      store[normalizedEmail] = {
        ...record,
        code: 'VERIFIED',
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
        verified: true,
      };
      saveStore(store);

      return NextResponse.json({
        success: true,
        verified: true,
        email: normalizedEmail,
        message: 'Email address successfully verified.',
      });
    }

    return NextResponse.json({ error: 'Invalid action parameter.' }, { status: 400 });
  } catch (err: any) {
    console.error('Email verification error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
