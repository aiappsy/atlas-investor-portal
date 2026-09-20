import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const protectedDir = path.join(process.cwd(), 'protected_docs', 'investors');
const signaturesFile = path.join(process.cwd(), 'data', 'investor_signatures.json');

// Map docId to protected filename
const documentMap: Record<string, { pdf: string; pptx?: string }> = {
  prospectus: { pdf: 'ATLAS_Confidential_Prospectus.pdf' },
  deck: { pdf: 'ATLAS_Investor_Pitch_Deck.pdf', pptx: 'ATLAS_Investor_Pitch_Deck.pptx' },
  financials: { pdf: 'ATLAS_5Year_Financial_Model.pdf' },
  safe: { pdf: 'ATLAS_SAFE_Term_Sheet_LLC.pdf' },
  faq: { pdf: 'ATLAS_Due_Diligence_FAQ.pdf' },
  exit: { pdf: 'ATLAS_Strategic_Exit_Opportunities.pdf' },
  tech: { pdf: 'ATLAS_Technical_Architecture_Google_Cloud.pdf' },
  complete: { pdf: 'ATLAS_Complete_Investor_Suite.pdf' },
  suite: { pdf: 'ATLAS_Complete_Investor_Suite.pdf' },
  bedbank: { pdf: 'ATLAS_Wholesale_Bedbank_Strategy.pdf' },
  nda: { pdf: 'ATLAS_Mutual_NDA.pdf' }
};

function isValidSignature(hash: string | null | undefined): boolean {
  if (!hash) return false;
  try {
    if (!fs.existsSync(signaturesFile)) return false;
    const records = JSON.parse(fs.readFileSync(signaturesFile, 'utf8'));
    if (!Array.isArray(records)) return false;
    return records.some((r: any) => r.signatureHash === hash && r.status === 'active');
  } catch (e) {
    console.error('Error verifying signature:', e);
    return false;
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ docId: string }> }
) {
  try {
    const { docId } = await params;
    const docEntry = documentMap[docId];

    if (!docEntry) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Check authorization: Cookie OR query parameter ?hash= OR header
    const cookieHash = req.cookies.get('atlas_investor_auth')?.value;
    const queryHash = req.nextUrl.searchParams.get('hash');
    const headerHash = req.headers.get('x-signature-hash');
    const providedHash = cookieHash || queryHash || headerHash;

    if (!isValidSignature(providedHash)) {
      return NextResponse.json(
        { 
          error: 'Access Denied: You must verify your email with a one-time code and execute the Confidentiality Agreement to access this document.',
          code: 'AUTH_REQUIRED'
        },
        { status: 403 }
      );
    }

    const format = req.nextUrl.searchParams.get('format');
    const isPptx = format === 'pptx' && !!docEntry.pptx;
    const fileName = isPptx ? docEntry.pptx! : docEntry.pdf;
    const filePath = path.join(protectedDir, fileName);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Requested file does not exist on server' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const contentType = isPptx
      ? 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      : 'application/pdf';

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'private, no-cache, no-store, must-revalidate'
      }
    });
  } catch (err: any) {
    console.error('Document download error:', err);
    return NextResponse.json({ error: 'Failed to stream document' }, { status: 500 });
  }
}
