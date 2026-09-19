# ATLAS Travel Club - Institutional Investor Portal & Data Room

This repository is a **standalone, dedicated institutional investor application** for ATLAS Travel Club LLC.
It is completely isolated from the consumer travel booking platform.

## Key Features
- **Modern Lightmode UI**: Clean, uncluttered, institutional Carta / AngelList / Linear aesthetic.
- **Collapsible Sidebar**: Permanent desktop navigation sidebar with smooth expand/collapse toggle.
- **2-Step Verified Access Gate**:
  1. 6-digit OTP Email Verification (`POST /api/investors/verify-email`)
  2. Digitally Signed Mutual NDA with SHA-256 cryptographic hashing and IP logging (`POST /api/investors/sign-nda`)
- **Direct PDF Data Room**: 6 verified institutional PDFs ready for instant download.
- **Legal & Regulatory Compliance Suite**: Comprehensive statutory disclosures covering US, Norwegian, and EU regulations.

## Running Locally
```bash
npm install
npm run dev
# Running on http://localhost:3010
```
