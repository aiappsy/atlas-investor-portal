'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, ShieldCheck, CheckCircle2, ArrowRight, ChevronRight, Building, FileCheck } from 'lucide-react';

export default function SellerOfTravelPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans text-slate-800 antialiased">
      
      {/* Top Breadcrumb & Header */}
      <section className="bg-white border-b border-slate-200/80 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/legal" className="hover:text-slate-900">Legal Hub</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900 font-semibold">Seller of Travel Disclosures</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <Building className="w-3.5 h-3.5 text-emerald-600" />
            State Travel Regulatory Compliance
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Seller of Travel Disclosures & State Licensing
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Statutory disclosures, consumer restitution notices, and escrow trust account frameworks 
            governing closed-loop travel bookings fulfilled through ATLAS Travel Club LLC.
          </p>
          <div className="text-[11px] text-slate-400 font-mono">
            Jurisdictions: California, Florida, Washington, and US Interstate Commerce • Effective: September 2026
          </div>
        </div>
      </section>

      {/* Main Legal Content Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs space-y-8 text-sm text-slate-600 leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900">1. Nature of Services: Closed-Loop Membership Facilitator</h2>
            <p>
              <strong>ATLAS Travel Club LLC</strong> (the "Company") is a private, subscription-based membership collective and technology platform that provides authenticated members with access to wholesale travel rates procured from licensed global B2B bedbanks, airline distribution networks (IATA/NDC), and luxury charter operators.
            </p>
            <p>
              ATLAS operates on an asset-light, direct-settlement software architecture. <strong>ATLAS does not own, operate, or manage hotels, airlines, private aircraft, or cruise vessels.</strong> All reservations are confirmed and fulfilled directly through licensed independent third-party suppliers.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900">2. State Seller of Travel (SoT) Statutory Disclosures</h2>
            <p>
              Where required by applicable state law, the Company maintains registered Seller of Travel filings or operates pursuant to statutory exemptions governing private membership clubs and wholesale travel facilitators:
            </p>

            <div className="space-y-3 pt-1">
              {/* California */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="font-bold text-slate-900 text-sm">State of California (California Business & Professions Code § 17550 et seq.)</div>
                <p>
                  California law requires certain sellers of travel to have a trust account or bond. 
                  ATLAS Travel Club LLC is registered or operates pursuant to formal registration filings under the California Seller of Travel Program.
                </p>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-600 space-y-1">
                  <div className="font-semibold text-slate-800">California Travel Consumer Restitution Fund (TCRF) Notice:</div>
                  <p>
                    Transactions booked by members located outside the State of California are not eligible for restitution from the California Travel Consumer Restitution Corporation (TCRC). For eligible California residents, claims against the TCRF are governed by California Business & Professions Code Section 17550.47.
                  </p>
                </div>
              </div>

              {/* Florida */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <div className="font-bold text-slate-900 text-sm">State of Florida (Florida Statutes Chapter 559)</div>
                <p>
                  Florida law requires sellers of travel to register with the Florida Department of Agriculture and Consumer Services. 
                  ATLAS Travel Club LLC maintains active compliance and surety protections as required by Florida Seller of Travel laws.
                </p>
              </div>

              {/* Washington State */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <div className="font-bold text-slate-900 text-sm">State of Washington (RCW Chapter 19.138)</div>
                <p>
                  ATLAS Travel Club LLC maintains commercial compliance filings with the State of Washington Department of Licensing for interstate travel fulfillment.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900">3. Escrow & Consumer Trust Fund Architecture</h2>
            <p>
              To protect member capital and prevent misappropriation of travel funds:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
              <li>
                <strong>Synchronous Merchant Pass-Through:</strong> Member payments for hotel room nights and airline tickets are processed via real-time merchant authorization directly to the wholesale supplier at the timestamp of booking. ATLAS never holds member travel funds on its balance sheet for general operating expenses.
              </li>
              <li>
                <strong>Automated Refund Routing:</strong> When an active reservation is cancelled within the hotel's "Free Cancellation" window, or when an automated price-drop refund is triggered by the Price-Drop Sentinel, funds are returned directly to the member's original payment method or reloadable Visa card within 24–72 business hours.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900">4. Member Cancellation & Refund Rights</h2>
            <p>
              Each wholesale hotel stay, flight ticket, or villa reservation booked through ATLAS displays explicit cancellation policies prior to confirmation. 
              Refund terms are governed by the specific underlying bedbank voucher terms (e.g., "Non-Refundable" vs. "Free Cancellation until 48 hours prior to check-in"). ATLAS charges <strong>0% cancellation penalties or processing fees</strong> on eligible refunded reservations.
            </p>
          </section>

          {/* Footer links */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <Link href="/legal/rate-parity-compliance" className="hover:text-slate-900 underline">Rate Parity Memorandum</Link>
              <span>•</span>
              <Link href="/legal/banking-disclosures" className="hover:text-slate-900 underline">Banking Disclosures</Link>
              <span>•</span>
              <Link href="/legal/travel-disclaimer" className="hover:text-slate-900 underline">Supplier Disclaimer</Link>
            </div>
            <Link href="/" className="text-amber-600 font-bold hover:underline flex items-center gap-1">
              <span>Return to Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}
