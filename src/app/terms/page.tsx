'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, ShieldCheck, Scale, Lock, CheckCircle2, ArrowRight } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans text-slate-900 antialiased">
      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200/80 py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5 text-amber-600" />
            Legal & Membership Agreement
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
            Terms of Service & Membership Agreement
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Effective Date: August 2026 • Last Updated: September 2026 • Governing Entity: ATLAS Travel Club LLC
          </p>
        </div>
      </section>

      {/* Main Legal Content Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-2xs space-y-8 text-xs text-slate-700 leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-2.5">
            <h2 className="text-base font-black text-slate-900">1. Acceptance of Terms & Closed-Loop Nature</h2>
            <p>
              By accessing, browsing, registering for, or utilizing the ATLAS platform (operated by ATLAS Travel Club LLC, hereinafter referred to as &quot;ATLAS&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), you (&quot;Member&quot;, &quot;User&quot;, or &quot;Customer&quot;) agree to be bound by these Terms of Service and all incorporated policies.
            </p>
            <p>
              <strong>Closed-Loop Club Status:</strong> ATLAS operates strictly as a closed-loop, password-gated private travel and treasury collective. All wholesale rates, inventory feeds, B2B Bedbank allocations, and negotiated amenities displayed behind the member login are confidential, proprietary, and exempt from public Rate Parity obligations under the US Sherman Act and EU Digital Markets Act.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2.5">
            <h2 className="text-base font-black text-slate-900">2. Confidentiality & Non-Disclosure of Wholesale Rates</h2>
            <p>
              As a condition of membership, Members explicitly agree:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Not to publicly scrape, republish, broadcast, or display raw B2B Bedbank wholesale pricing on open websites, social media, or public review portals.</li>
              <li>Not to share member account credentials or scannable member cards with unauthorized third parties.</li>
              <li>That violation of rate confidentiality causes irreparable harm to ATLAS&apos;s supplier relationships and constitutes grounds for immediate membership revocation without refund.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-2.5">
            <h2 className="text-base font-black text-slate-900">3. Membership Tiers & Subscription Billing</h2>
            <p>
              <strong>Billing & Renewals:</strong> Membership subscriptions are billed on an annual recurring basis. Your membership automatically renews unless canceled prior to the renewal date via the Member Portal or by contacting Member Concierge.
            </p>
            <p>
              <strong>30-Day Rate Guarantee:</strong> If, within 30 days of joining, you find a lower publicly available retail rate for an identical room, dates, and cancellation terms on Expedia or Booking.com that ATLAS cannot beat at wholesale, ATLAS will refund 100% of your annual membership fee upon verification.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-2.5">
            <h2 className="text-base font-black text-slate-900">4. Booking, Fulfillment & Check-In Vouchers</h2>
            <p>
              <strong>Fulfillment:</strong> Hotel bookings, luxury villas, nomad colivings, cruises, and jet charters are fulfilled through integrated direct B2B Bedbanks, GDS feeds, and partner networks (including Hotelbeds, WebBeds, and Travco).
            </p>
            <p>
              <strong>Vouchers:</strong> Upon completed payment, an official cryptographic digital check-in voucher with a certified CRS confirmation code is issued. Presenting this voucher at the property guarantees check-in under standard hospitality industry terms.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-2.5">
            <h2 className="text-base font-black text-slate-900">5. Limitation of Liability</h2>
            <p>
              ATLAS operates as a technology aggregator and wholesale travel collective. We do not own, manage, or operate individual hotel properties, airlines, cruise ships, or private aircraft. ATLAS shall not be held liable for property damages, flight delays caused by weather, personal injury at resort facilities, or operational failures of third-party hospitality providers.
            </p>
          </section>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>Questions regarding these Terms? Contact <strong className="text-slate-800">legal@atlastravelclub.com</strong></div>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-amber-700 font-bold hover:underline">
                Privacy Policy →
              </Link>
              <Link href="/" className="text-slate-700 font-bold hover:underline">
                Back to Investor Portal →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
