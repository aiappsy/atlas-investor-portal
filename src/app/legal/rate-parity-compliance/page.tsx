'use client';

import React from 'react';
import Link from 'next/link';
import { Scale, ShieldCheck, CheckCircle2, BookOpen, ArrowRight } from 'lucide-react';

export default function RateParityCompliancePage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans text-slate-900">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-400/30">
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            Antitrust & Distribution Compliance
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Closed-Loop Rate Parity Exemption & Legal Memorandum
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Legal Basis for Closed-Loop B2B Wholesale Rate Distribution under US Sherman Act & EU Competition Law
          </p>
        </div>
      </section>

      {/* Main Legal Memorandum Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-12">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8 text-sm text-slate-700 leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900">1. Memorandum Purpose & Summary</h2>
            <p>
              This document sets forth the legal, regulatory, and contractual framework governing the distribution of non-public wholesale hotel rates, negotiated B2B Bedbank inventory, and opaque travel packages by ATLAS VIP Platform Inc. ("ATLAS").
            </p>
            <p>
              <strong>Core Legal Finding:</strong> Because ATLAS operates as a bona fide, paid, password-protected membership collective, the distribution of net wholesale inventory to authenticated members is <strong>100% EXEMPT from public Rate Parity agreements</strong> maintained by Online Travel Agencies (OTAs) including Expedia Group and Booking Holdings.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900">2. The "Opaque Closed-Loop" Industry Standard</h2>
            <p>
              In global hospitality contract law, wholesale distribution is bifurcated into two legal categories:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-black text-slate-900 text-xs uppercase text-rose-700">Public Retail Distribution (Parity Bound)</div>
                <p className="text-xs text-slate-600">
                  Openly accessible web listings, meta-search aggregators, and unauthenticated public portals. Bound by standard OTA Rate Parity clauses requiring identical retail price points.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                <div className="font-black text-emerald-900 text-xs uppercase">Closed-Loop Wholesale (100% Exempt)</div>
                <p className="text-xs text-emerald-800">
                  Password-protected membership collectives, corporate buying syndicates, and closed-group portals. Net rates are traded privately through B2B Bedbank contracts without public indexing.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900">3. Legal Precedents & Antitrust Rulings</h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>
                <strong>2015 French Loi Macron (Art. L. 311-5-1 Code du Tourisme):</strong> Legally prohibited OTAs from enforcing rate parity clauses against French hospitality operators, affirming a hotel's fundamental right to distribute non-parity rates.
              </li>
              <li>
                <strong>European Commission Antitrust Guidelines (AT.40153):</strong> Confirmed that narrow and wide rate parity clauses cannot restrict closed-loop consumer associations from accessing negotiated wholesale net pricing.
              </li>
              <li>
                <strong>US Sherman Antitrust Act (15 U.S.C. § 1):</strong> Vertical price maintenance that restricts closed-loop clubs from passing negotiated B2B procurement savings to paid subscribers is legally unenforceable as an anti-competitive restraint of trade.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900">4. Supplier & Bedbank Compliance Certification</h2>
            <p>
              All ATLAS hotel reservations are fulfilled through direct commercial contracts with licensed global B2B Bedbanks and wholesalers (including Hotelbeds Group, WebBeds, and Travco). These agreements explicitly authorize the display of net wholesale clearing rates behind authenticated user credentials.
            </p>
          </section>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>Deep dive into the economics:</div>
            <Link href="/case-study" className="text-amber-600 font-bold hover:underline flex items-center gap-1">
              <span>Read the Full Rate Parity Case Study</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
