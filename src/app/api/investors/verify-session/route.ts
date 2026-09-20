import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const signaturesFile = path.join(process.cwd(), 'data', 'investor_signatures.json');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const cookieHash = req.cookies.get('atlas_investor_auth')?.value;
    const bodyHash = body.signatureHash;
    const email = body.email?.trim().toLowerCase();

    const checkHash = cookieHash || bodyHash;

    if (!checkHash) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    if (!fs.existsSync(signaturesFile)) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    const records = JSON.parse(fs.readFileSync(signaturesFile, 'utf8'));
    if (!Array.isArray(records)) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    const matched = records.find((r: any) => 
      r.signatureHash === checkHash && 
      r.status === 'active' && 
      (!email || r.email === email)
    );

    if (!matched) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    const res = NextResponse.json({
      authenticated: true,
      signature: matched
    });

    // Ensure auth cookie is refreshed
    res.cookies.set('atlas_investor_auth', matched.signatureHash, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return res;
  } catch (e: any) {
    console.error('Session verify error:', e);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
