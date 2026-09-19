'use client';

import React from 'react';
import Link from 'next/link';
import { Scale, ShieldCheck, Lock, ArrowLeft } from 'lucide-react';

export default function SecCompliancePage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans text-slate-900 antialiased">
      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200/80 py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link href="/legal" className="hover:text-slate-900">Legal Directory</Link>
            <span>/</span>
            <span className="text-slate-900">SEC Compliance</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5 text-amber-600" />
            SEC Regulation D Rule 506(c) Safe Harbor
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
            Securities Offering Safe Harbor & Investor Accreditation
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Statutory disclosure memorandum governing the $75,000 USD YC Post-Money SAFE offering under SEC Rule 506(c) of Regulation D and the federal Securities Act of 1933.
          </p>

          <div className="text-xs text-slate-400 font-mono">
            Governing Statute: 15 U.S.C. § 77d(a)(2) • 17 C.F.R. § 230.506(c) • E-SIGN Act (15 U.S.C. § 7001)
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-2xs space-y-8 text-xs text-slate-700 leading-relaxed">
          
          <section className="space-y-2.5">
            <h2 className="text-base font-black text-slate-900">1. Rule 506(c) Private Placement Safe Harbor</h2>
            <p>
              The offering of Simple Agreements for Future Equity (&quot;SAFE&quot;) by ATLAS Travel Club LLC (&quot;Company&quot;) is conducted pursuant to Rule 506(c) of Regulation D promulgated under the Securities Act of 1933, as amended.
            </p>
            <p>
              Securities offered under Rule 506(c) are exempt from registration requirements. Participation is restricted exclusively to &quot;Accredited Investors&quot; as defined under Rule 501(a) of Regulation D.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-black text-slate-900">2. Accreditation Verification Standards</h2>
            <p>
              In compliance with Rule 506(c)(2)(ii), the Company undertakes reasonable verification of accredited investor status prior to issuing securities. Verification is satisfied via:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Written confirmation from a registered broker-dealer, SEC-registered investment adviser, licensed attorney, or certified public accountant (CPA).</li>
              <li>Third-party accreditation verification letter (e.g. via VerifyInvestor or Carta).</li>
              <li>Direct verification of institutional status for qualified family offices, funds, or angel syndicates.</li>
            </ul>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-black text-slate-900">3. Electronic Execution & Cryptographic Recording</h2>
            <p>
              All non-disclosure agreements, accreditation certifications, and SAFE subscription agreements are digitally signed and recorded in accordance with the federal Electronic Signatures in Global and National Commerce Act (&quot;E-SIGN Act&quot;, 15 U.S.C. § 7001 et seq.) and the Uniform Electronic Transactions Act (&quot;UETA&quot;).
            </p>
          </section>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <Link href="/legal" className="flex items-center gap-1.5 text-slate-700 font-bold hover:underline">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Legal Hub</span>
            </Link>
            <Link href="/" className="text-amber-700 font-bold hover:underline">
              Return to Deal Room →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
