'use client';

import React from 'react';
import Link from 'next/link';
import { Scale, AlertTriangle, ShieldCheck, ArrowRight, FileText, CheckCircle2, ChevronRight } from 'lucide-react';

export default function InvestorDisclosuresPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans text-slate-800 antialiased">
      
      {/* Top Breadcrumb & Header */}
      <section className="bg-white border-b border-slate-200/80 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/legal" className="hover:text-slate-900">Legal Hub</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900 font-semibold">Investor & Securities Disclosures</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5 text-amber-600" />
            Securities Notice & Safe Harbor
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Investor Disclosures & Regulatory Notices
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Statutory disclaimers, Private Securities Litigation Reform Act Safe Harbor, 
            Accredited Investor qualifications, and risk factors regarding ATLAS Travel Club LLC.
          </p>
          <div className="text-[11px] text-slate-400 font-mono">
            Entity: ATLAS Travel Club LLC (Delaware / Wyoming Manager-Managed LLC) • Updated: September 2026
          </div>
        </div>
      </section>

      {/* Main Legal Content Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs space-y-8 text-sm text-slate-600 leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900">1. Not an Offer to Sell or Solicitation of an Offer to Buy</h2>
            <p>
              The information, presentations, prospectus materials, term sheet summaries, and financial projections provided on this website, within the Investor Portal, or in any accompanying documentation do <strong>NOT</strong> constitute an offer to sell or a solicitation of an offer to buy any securities of <strong>ATLAS Travel Club LLC</strong> (the "Company") in any state or jurisdiction in which such offer or solicitation would be unlawful.
            </p>
            <p>
              Any offer or sale of securities (including Simple Agreements for Future Equity / Units, or "SAFEs") will be made solely pursuant to definitive, written subscription agreements and formal offering materials complying with applicable federal and state securities laws.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900">2. Accredited Investor Verification Standard</h2>
            <p>
              Offerings of Company securities are intended exclusively for persons who qualify as <strong>"Accredited Investors"</strong> as defined in Rule 501(a) of Regulation D promulgated under the US Securities Act of 1933, as amended (the "Securities Act"), or qualified institutional buyers. 
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-600">
              <div className="font-bold text-slate-900">Accredited Investor Criteria Summary (Rule 501):</div>
              <ul className="list-disc pl-4 space-y-1">
                <li>An individual with net worth exceeding \$1,000,000 (excluding primary residence);</li>
                <li>An individual with annual income exceeding \$200,000 (or \$300,000 jointly with a spouse or partner) in each of the two most recent years with a reasonable expectation of reaching the same income level in the current year;</li>
                <li>A holder of certain professional certifications in good standing (Series 7, 65, or 82); or</li>
                <li>An entity, trust, or fund with total assets exceeding \$5,000,000 not formed for the specific purpose of acquiring the securities offered.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900">3. Safe Harbor for Forward-Looking Statements (PSLRA of 1995)</h2>
            <p>
              Certain statements contained in the Investor Portal, the 10-Slide Pitch Deck, the Confidential Prospectus, and related models constitute <strong>"forward-looking statements"</strong> within the meaning of the Private Securities Litigation Reform Act of 1995 and Section 27A of the Securities Act.
            </p>
            <p>
              These statements include, but are not limited to, projections of member growth (1,000 paid members in Year 1 to 25,000 in Year 3), annual subscription ARPU (\$850 blended), Customer Acquisition Costs (\$115 blended CAC), gross margin targets (94%), future software features (Duffel NDC flights, Stripe Issuing), and EBITDA profitability.
            </p>
            <p>
              Forward-looking statements are inherently subject to known and unknown risks, uncertainties, and assumptions. Actual future results, operational performance, and financial conditions may differ materially from those expressed or implied due to competitive, regulatory, supplier, and macroeconomic factors. The Company undertakes no obligation to publicly update or revise any forward-looking statements.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900">4. High-Risk Investment & Speculative Nature</h2>
            <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 text-rose-950 space-y-2 text-xs">
              <div className="font-bold text-rose-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Substantial Risk of Loss:</span>
              </div>
              <p>
                Investment in early-stage pre-seed technology companies involves an exceptionally high degree of financial and business risk. 
                Investors may lose all or substantially all of their invested capital. SAFEs are not debt, do not accrue interest, 
                and are not insured or guaranteed by the FDIC, SIPC, or any governmental authority.
              </p>
            </div>
            <p className="text-xs text-slate-500">
              There is no public market for the Company's securities, and none is expected to develop. 
              The securities are illiquid and subject to substantial transfer restrictions under federal and state securities laws.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900">5. No Investment, Legal, or Tax Advice</h2>
            <p>
              Nothing on this website or in the Investor Portal constitutes investment, tax, legal, or financial advice. 
              Each prospective investor must conduct their own independent due diligence and consult with their own legal counsel, 
              certified public accountant (CPA), and financial advisor regarding the economic, legal, and tax consequences of an investment in Company SAFEs or LLC membership interests (including Schedule K-1 pass-through tax implications).
            </p>
          </section>

          {/* Footer link to other policies */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <Link href="/legal/electronic-signatures" className="hover:text-slate-900 underline">E-SIGN Disclosure</Link>
              <span>•</span>
              <Link href="/legal/rate-parity-compliance" className="hover:text-slate-900 underline">Rate Parity Memorandum</Link>
              <span>•</span>
              <Link href="/legal/seller-of-travel" className="hover:text-slate-900 underline">Seller of Travel</Link>
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
