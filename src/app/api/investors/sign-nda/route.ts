import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const signaturesFile = path.join(process.cwd(), 'data', 'investor_signatures.json');

interface SignatureRecord {
  id: string;
  fullName: string;
  email: string;
  firmName?: string;
  signatureHash: string;
  ipAddress: string;
  userAgent: string;
  signedAt: string;
  eSignConsent: boolean;
  jurisdiction: string;
  status: 'active' | 'revoked';
}

function loadSignatures(): SignatureRecord[] {
  try {
    if (fs.existsSync(signaturesFile)) {
      return JSON.parse(fs.readFileSync(signaturesFile, 'utf8'));
    }
  } catch (e) {
    console.error('Error reading signatures file:', e);
  }
  return [];
}

function saveSignatures(records: SignatureRecord[]) {
  try {
    fs.writeFileSync(signaturesFile, JSON.stringify(records, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving signatures file:', e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, firmName, eSignConsent } = await req.json();

    if (!fullName || !email) {
      return NextResponse.json({ error: 'Full name and email are required' }, { status: 400 });
    }

    if (!eSignConsent) {
      return NextResponse.json({ error: 'Electronic signature consent is required under 15 U.S.C. § 7001' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    const cleanFirm = (firmName || '').trim();

    // Extract client IP and user-agent
    const ipAddress = 
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1 (Local Client)';
    const userAgent = req.headers.get('user-agent') || 'Unknown User-Agent';
    const signedAt = new Date().toISOString();

    // Compute Cryptographic Verification Hash
    const payloadToHash = `${cleanName}|${normalizedEmail}|${cleanFirm}|${ipAddress}|${signedAt}`;
    const signatureHash = 'sha256:' + crypto.createHash('sha256').update(payloadToHash).digest('hex');
    const id = 'sig_' + crypto.randomBytes(8).toString('hex');

    const signatureRecord: SignatureRecord = {
      id,
      fullName: cleanName,
      email: normalizedEmail,
      firmName: cleanFirm || undefined,
      signatureHash,
      ipAddress,
      userAgent,
      signedAt,
      eSignConsent: true,
      jurisdiction: 'Delaware / Wyoming LLC',
      status: 'active'
    };

    const signatures = loadSignatures();
    // Update or append
    const existingIndex = signatures.findIndex(s => s.email === normalizedEmail);
    if (existingIndex >= 0) {
      signatures[existingIndex] = signatureRecord;
    } else {
      signatures.unshift(signatureRecord);
    }
    saveSignatures(signatures);

    return NextResponse.json({
      success: true,
      signature: signatureRecord,
      message: 'Mutual Non-Disclosure Agreement successfully executed and recorded.',
    });
  } catch (err: any) {
    console.error('Error recording NDA signature:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email parameter required' }, { status: 400 });
  }

  const signatures = loadSignatures();
  const found = signatures.find(s => s.email === email.trim().toLowerCase() && s.status === 'active');

  if (!found) {
    return NextResponse.json({ signed: false });
  }

  return NextResponse.json({
    signed: true,
    signature: found
  });
}
