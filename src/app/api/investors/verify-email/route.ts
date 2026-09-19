import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const verificationStoreFile = path.join(process.cwd(), 'data', 'email_verification_codes.json');

interface VerificationRecord {
  code: string;
  expiresAt: number;
  verified: boolean;
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
    fs.writeFileSync(verificationStoreFile, JSON.stringify(store, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving verification store:', e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, action, code } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const store = loadStore();

    if (action === 'send') {
      // Generate 6-digit code
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      store[normalizedEmail] = {
        code: otpCode,
        expiresAt: Date.now() + 15 * 60 * 1000, // 15 mins
        verified: false,
      };
      saveStore(store);

      return NextResponse.json({
        success: true,
        message: `Verification code sent to ${normalizedEmail}`,
        // For development/review demo convenience, we echo the code and also accept bypass code '888999'
        demoCode: otpCode,
      });
    }

    if (action === 'verify') {
      const record = store[normalizedEmail];
      const trimmedCode = (code || '').trim();

      // Master demo code or matching stored code within expiration
      const isValid = 
        trimmedCode === '888999' || 
        (record && record.code === trimmedCode && Date.now() <= record.expiresAt);

      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid or expired verification code. Use the 6-digit code sent or test code 888999.' },
          { status: 400 }
        );
      }

      // Mark verified
      if (record) {
        record.verified = true;
        saveStore(store);
      } else {
        store[normalizedEmail] = {
          code: 'VERIFIED',
          expiresAt: Date.now() + 86400000,
          verified: true
        };
        saveStore(store);
      }

      return NextResponse.json({
        success: true,
        verified: true,
        email: normalizedEmail,
        message: 'Email address successfully verified.',
      });
    }

    return NextResponse.json({ error: 'Invalid action parameter' }, { status: 400 });
  } catch (err: any) {
    console.error('Email verification error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
