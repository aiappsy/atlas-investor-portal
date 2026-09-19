'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, Plane, Hotel, ShieldAlert, ArrowRight, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function TravelDisclaimerPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans text-slate-800 antialiased">
      
      {/* Top Breadcrumb & Header */}
      <section className="bg-white border-b border-slate-200/80 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/legal" className="hover:text-slate-900">Legal Hub</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900 font-semibold">Travel & Supplier Disclaimers</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            Operational & Supplier Disclaimers
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Travel & Third-Party Supplier Disclaimer
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Legal terms governing third-party hospitality providers, airline carrier operations, 
            hotel voucher check-in protocols, and limitations of liability.
          </p>
          <div className="text-[11px] text-slate-400 font-mono">
            Platform: ATLAS Travel Club LLC • Standard Hospitality & Carrier Terms • September 2026
          </div>
        </div>
      </section>

      {/* Main Legal Content Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs space-y-8 text-sm text-slate-600 leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900">1. Independent Third-Party Supplier Relationship</h2>
            <p>
              ATLAS Travel Club LLC ("ATLAS") acts solely as an intermediary technology collective facilitating bookings between authenticated club members and independent third-party travel suppliers—including B2B bedbanks (Hotelbeds, RateHawk, WebBeds), commercial airlines (via Duffel NDC), private jet charter operators, luxury villa managers, and car rental agencies (each, a "Travel Supplier").
            </p>
            <p>
              <strong>Travel Suppliers are independent contractors and are NOT agents, employees, joint venturers, or partners of ATLAS.</strong> ATLAS does not own, manage, inspect, or operate any hotel, aircraft, yacht, or vehicle featured on the platform.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900">2. Hotel Voucher Check-In & CRS Honoring Protocols</h2>
            <p>
              All hotel reservations booked through ATLAS generate an instant, pre-paid B2B confirmation code settled directly into the property's Central Reservation System (CRS).
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-600">
              <div className="font-bold text-slate-900">Standard Check-In Parity:</div>
              <ul className="list-disc pl-4 space-y-1">
                <li>Wholesale room nights are pre-paid. The front desk sees a standard corporate or bedbank reservation indistinguishable from an American Express Travel or corporate booking voucher.</li>
                <li>There is no "discounted" status visible on guest check-in folios; guests receive the identical room category, amenities, and service as guests booking via public retail channels.</li>
                <li>Incidental charges (minibar, room service, resort fees, city occupancy taxes) are not included in room vouchers and must be settled by the guest at check-out using their ATLAS Visa card or personal credit card.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900">3. Limitation of Liability & Force Majeure</h2>
            <p>
              To the maximum extent permitted by applicable law, ATLAS Travel Club LLC shall not be liable for any personal injury, illness, property damage, accident, delay, irregularity, cancellation, or expense arising out of:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-700">
              <li>Any act, error, omission, negligence, insolvency, or default of any Travel Supplier, airline carrier, or villa host;</li>
              <li>Flight delays, schedule changes, overbooking, baggage loss, or airport security procedures governed by airline contracts of carriage and the Montreal Convention;</li>
              <li>Events of <strong>Force Majeure</strong>, including but not limited to acts of God, extreme weather, volcanic eruptions, natural disasters, war, civil unrest, labor strikes, government sanctions, pandemics, quarantines, or border closures.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900">4. Passports, Visas & Entry Advisory Notice</h2>
            <p>
              While ATLAS provides automated entry intelligence through its integration with border requirement APIs (Sherpa), <strong>it is the sole and ultimate responsibility of the traveler</strong> to verify and obtain all required valid passports (with at least 6 months validity prior to expiration), tourist or digital nomad visas, transit authorizations, and health certifications required by foreign immigration authorities.
            </p>
          </section>

          {/* Footer links */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <Link href="/legal/seller-of-travel" className="hover:text-slate-900 underline">Seller of Travel</Link>
              <span>•</span>
              <Link href="/legal/banking-disclosures" className="hover:text-slate-900 underline">Banking Disclosures</Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-slate-900 underline">Terms of Service</Link>
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
