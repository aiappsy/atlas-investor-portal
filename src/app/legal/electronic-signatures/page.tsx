'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, FileCheck, CheckCircle2, ArrowRight, ChevronRight, Lock, Laptop } from 'lucide-react';

export default function ElectronicSignaturesPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans text-slate-800 antialiased">
      
      {/* Top Breadcrumb & Header */}
      <section className="bg-white border-b border-slate-200/80 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/legal" className="hover:text-slate-900">Legal Hub</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900 font-semibold">Electronic Signatures & Records</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <FileCheck className="w-3.5 h-3.5 text-blue-600" />
            E-SIGN Act (15 U.S.C. § 7001) & UETA
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Electronic Signatures & Records Disclosure
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Statutory notice, consumer and investor consent terms, digital signature verification protocols, 
            and legal enforceability standards governing ATLAS Travel Club LLC transactions.
          </p>
          <div className="text-[11px] text-slate-400 font-mono">
            Standard: Federal E-SIGN Act & Uniform Electronic Transactions Act • Effective: September 2026
          </div>
        </div>
      </section>

      {/* Main Legal Content Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs space-y-8 text-sm text-slate-600 leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900">1. Consent to Electronic Records and Electronic Signatures</h2>
            <p>
              By checking the electronic signature consent checkbox on any agreement (including the Mutual Non-Disclosure Agreement, YC Post-Money SAFE for LLCs, or Membership Terms) and submitting your information through the ATLAS platform, you affirmatively consent to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
              <li>Conducting business and executing binding contracts electronically with <strong>ATLAS Travel Club LLC</strong>;</li>
              <li>Receiving all notices, disclosures, tax records (Schedule K-1 or 1099), and financial reports electronically via email or portal download;</li>
              <li>Having your electronic signature, digital cryptographic hash, and client metadata treated as an original, handwritten signature with identical legal validity and enforceability pursuant to the <strong>Electronic Signatures in Global and National Commerce Act (E-SIGN Act, 15 U.S.C. § 7001 et seq.)</strong> and the <strong>Uniform Electronic Transactions Act (UETA)</strong> as enacted across US jurisdictions.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900">2. Scope of Electronic Communications Covered</h2>
            <p>
              Your electronic consent applies to all documents and transactions related to your relationship with ATLAS Travel Club LLC, including:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900">Investor & Securities Transactions</div>
                <div className="text-slate-500 mt-1">Mutual NDAs, SAFEs, subscription agreements, capital calls, and corporate conversion notices.</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900">Travel Club Operations</div>
                <div className="text-slate-500 mt-1">Membership agreements, rate parity disclosures, hotel reservation vouchers, and refund settlement notices.</div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900">3. Cryptographic Verification & Audit Trail Standards</h2>
            <p>
              To satisfy statutory evidentiary requirements under federal and state contract law, the Company’s digital execution pipeline captures an immutable digital audit trail at the exact millisecond an electronic signature is submitted:
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs font-mono text-slate-700">
              <div>• <strong>Cryptographic Hash:</strong> SHA-256 digest generated from Signatory Name, Verified Email, Entity, and UTC timestamp.</div>
              <div>• <strong>Network Stamp:</strong> Client IP address and originating HTTP request headers.</div>
              <div>• <strong>Verification Status:</strong> Verified email token recorded in Company audit database.</div>
              <div>• <strong>Storage:</strong> Retained in tamper-evident storage for a minimum of seven (7) years following agreement termination.</div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900">4. Hardware and Software Requirements</h2>
            <p>
              To access and retain electronic records provided by ATLAS Travel Club LLC, you must have:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-700">
              <li>An internet browser supporting 256-bit TLS encryption (Google Chrome, Mozilla Firefox, Apple Safari, or Microsoft Edge);</li>
              <li>An active email address capable of receiving verification codes and PDF attachments;</li>
              <li>Software capable of opening and rendering Portable Document Format (.pdf) files (e.g., Adobe Acrobat Reader or native browser PDF viewers);</li>
              <li>Sufficient disk storage space or printing equipment to download and print copies for your records.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900">5. Right to Withdraw Consent & Request Paper Copies</h2>
            <p>
              You have the right to receive any contract or disclosure in paper form upon written request. 
              To request a physical paper copy of an executed document, or to withdraw your consent to future electronic communications, send a written request to:
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="font-bold text-slate-900">ATLAS Travel Club LLC — Legal & Compliance Office</div>
              <div>Email: <a href="mailto:legal@atlastravelclub.com" className="text-amber-600 underline">legal@atlastravelclub.com</a></div>
              <div>Subject: E-SIGN Paper Copy / Withdrawal Request</div>
              <div className="text-slate-500 text-[11px] pt-1">
                Paper copies will be provided without charge for your first set of executed agreements.
              </div>
            </div>
          </section>

          {/* Footer links */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <Link href="/legal/investor-disclosures" className="hover:text-slate-900 underline">Investor Disclosures</Link>
              <span>•</span>
              <Link href="/legal/rate-parity-compliance" className="hover:text-slate-900 underline">Rate Parity Memorandum</Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-slate-900 underline">Terms of Service</Link>
            </div>
            <Link href="/investors" className="text-amber-600 font-bold hover:underline flex items-center gap-1">
              <span>Return to Investor Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}
