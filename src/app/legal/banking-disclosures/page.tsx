'use client';

import React from 'react';
import Link from 'next/link';
import { CreditCard, ShieldCheck, CheckCircle2, Lock, ArrowRight } from 'lucide-react';

export default function BankingDisclosuresPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans text-slate-900">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-400/30">
            <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
            FinTech & Treasury Disclosures
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Banking, Visa® Cardholder & FinTech Disclosures
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Card Issuance Terms, 0% FX Policy & Payout Settlement Protocols • Effective: August 2026
          </p>
        </div>
      </section>

      {/* Main Legal Content Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-12">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8 text-sm text-slate-700 leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900">1. Program Sponsorship & Partner Bank Disclosures</h2>
            <p>
              ATLAS VIP Platform Inc. is a financial technology platform and private travel collective, not an FDIC-insured bank.
            </p>
            <p>
              The <strong>ATLAS Obsidian / Gold Visa® Prepaid and Debit Card</strong> program is issued by licensed sponsor bank partners pursuant to a license from Visa U.S.A. Inc. and Visa International. Funds deposited into member card accounts are held by FDIC-insured or FCA-regulated partner financial institutions up to applicable legal limits.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900">2. 0% Foreign Transaction Fee (FX) Terms</h2>
            <p>
              Cardholders enjoying the 0% FX privilege will not be charged foreign exchange conversion fees or international transaction surcharges by ATLAS when purchasing goods and services worldwide in foreign currencies. Conversion rates are calculated using official wholesale mid-market Visa interbank exchange rates at the timestamp of transaction settlement.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900">3. Price-Drop Refund & Travel Vault Dividend Settlement</h2>
            <p>
              <strong>Price-Drop Refunds:</strong> Recovered funds from the automated 24/7 Pruvo Sentinel are credited to the member's designated payout account (original payment card, PayPal, bank wire, or ATLAS card) within 24 to 72 business hours following supplier confirmation.
            </p>
            <p>
              <strong>Travel Vault Dividends:</strong> Annual club profit share distributions are calculated based on verifiable member booking volume and distributed annually on December 15th to active tier members.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900">4. Lost, Stolen & Security Measures</h2>
            <p>
              Cardholders can instantly freeze or unfreeze their physical and virtual cards with 1 click in the Member Portal. Unauthorized transactions reported within 60 days are protected by Visa Zero Liability Policy.
            </p>
          </section>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>View Visa Card details:</div>
            <Link href="/membership/visa-card" className="text-emerald-600 font-bold hover:underline flex items-center gap-1">
              <span>Go to ATLAS Visa® Card Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
