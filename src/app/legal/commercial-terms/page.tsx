'use client';

import React from 'react';
import Link from 'next/link';
import { Scale, ShieldCheck, Building2, FileText, ArrowRight, ArrowLeft } from 'lucide-react';

export default function CommercialTermsPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans text-slate-900 antialiased">
      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200/80 py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link href="/legal" className="hover:text-slate-900">Legal Directory</Link>
            <span>/</span>
            <span className="text-slate-900">Commercial Terms</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-amber-600" />
            Wholesale Bedbank & Merchant Master Terms
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
            Wholesale Supplier & Commercial Settlement Terms
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Standard merchant terms governing B2B Bedbank procurement, CRS reservation reconciliation, synchronous card rails, and negative working capital settlement.
          </p>

          <div className="text-xs text-slate-400 font-mono">
            Governing Standards: IATA Distribution Standards • PCI-DSS Level 1 • Merchant Master Agreement
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-2xs space-y-8 text-xs text-slate-700 leading-relaxed">
          
          <section className="space-y-2.5">
            <h2 className="text-base font-black text-slate-900">1. Scope of Wholesale B2B Distribution</h2>
            <p>
              ATLAS Travel Club LLC (&quot;ATLAS&quot;) operates as an authorized closed-loop technology client connecting verified members directly to licensed global B2B Bedbanks and wholesale liquidity providers (including Hotelbeds Group, WebBeds, Travco, and RateHawk).
            </p>
            <p>
              All wholesale rates procured through these feeds are intended solely for authenticated, password-gated members who have executed the club covenant. Rates are never indexed, broadcast, or resold on public search engines.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-black text-slate-900">2. Real-Time CRS Parity & Voucher Redemption</h2>
            <p>
              Upon member payment authorization, ATLAS synchronously issues a reservation payload into the hotel Central Reservation System (CRS) via API.
            </p>
            <p>
              The guest voucher issued contains identical hotel reservation numbers and check-in rights as bookings made through traditional corporate travel management desks (e.g. American Express Global Business Travel, BCD Travel). Check-in and room assignment parity is guaranteed by supplier master service agreements.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-black text-slate-900">3. Synchronous Settlement & Zero Balance Sheet Risk</h2>
            <p>
              ATLAS does not prepay room blocks, lease real estate, or take speculative inventory risk. All transactions follow a negative working capital cycle:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Member funds are authorized upfront upon booking.</li>
              <li>Wholesale net amounts are remitted to bedbanks via synchronous virtual card (vCC) rails upon reservation confirmation or post-checkout according to supplier credit terms.</li>
              <li>ATLAS retains zero inventory liability in the event of room vacancy.</li>
            </ul>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-black text-slate-900">4. Relocation & Supplier Force Majeure</h2>
            <p>
              In the rare event of supplier overbooking or property operational failure, wholesale partners are contractually obligated to provide equivalent or superior 5-star accommodations within immediate proximity, with all relocation expenses absorbed by the supplier under standard wholesale SLA terms.
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
