'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, ShieldCheck, CheckCircle2, FileText, ArrowRight } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans text-slate-900 antialiased">
      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200/80 py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            Global Privacy & Data Governance
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
            Privacy Policy & Data Protection
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            GDPR, CCPA/CPRA & Global Sovereign Data Privacy Compliance • Last Updated: September 2026
          </p>
        </div>
      </section>

      {/* Main Legal Content Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-2xs space-y-8 text-xs text-slate-700 leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-2.5">
            <h2 className="text-base font-black text-slate-900">1. Our Core Privacy Commitment: Zero Data Selling</h2>
            <p>
              At ATLAS Travel Club LLC (&quot;ATLAS&quot;), privacy is not an afterthought; it is an architectural foundation. <strong>We do not sell, rent, monetize, or broker your personal travel data, passport information, or payment telemetry to third-party advertising networks.</strong>
            </p>
            <p>
              Public OTAs monetize consumer data through aggressive remarketing, ad retargeting, and search auction bidding. As a private, paid membership collective, ATLAS&apos;s business model is sustained entirely by member subscriptions and clean B2B software clearing.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2.5">
            <h2 className="text-base font-black text-slate-900">2. Information We Collect</h2>
            <p>We collect only the minimal data required to fulfill international travel reservations and administer club banking:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li><strong>Account Credentials:</strong> Full Name, verified Email Address, and Phone Number.</li>
              <li><strong>Traveler Itinerary Data:</strong> Passenger names, birthdates, and passport numbers (required strictly for airline ticketing and international hotel check-ins).</li>
              <li><strong>Payment & Cardholder Telemetry:</strong> Tokenized payment identifiers processed via PCI-DSS Level 1 certified partners (Stripe). ATLAS never stores raw credit card numbers on our servers.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-2.5">
            <h2 className="text-base font-black text-slate-900">3. How Your Data Is Processed & Shared</h2>
            <p>
              Your data is shared strictly with the authorized travel providers necessary to fulfill your booked itinerary:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li><strong>B2B Bedbanks & GDS Networks:</strong> Transmitting guest names to hotel front desks for voucher redemption (Hotelbeds, WebBeds, Travco).</li>
              <li><strong>Airlines & Charter Operators:</strong> Secure passport API transmission for mandatory manifest filing.</li>
              <li><strong>Licensed Banking Partners:</strong> KYC and transaction verification for ATLAS Visa® cardholders.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-2.5">
            <h2 className="text-base font-black text-slate-900">4. Your Global Rights (GDPR / CCPA / CPRA)</h2>
            <p>Regardless of your geographic location, ATLAS extends comprehensive privacy rights to all members:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li><strong>Right to Access:</strong> You may request an export of all personal data held in your member profile.</li>
              <li><strong>Right to Rectification:</strong> You may correct or update outdated contact and travel documents at any time.</li>
              <li><strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> You may request full deletion of your profile and data upon account closure.</li>
            </ul>
          </section>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>For privacy inquiries, contact <strong className="text-slate-800">privacy@atlas-travel-club.com</strong></div>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="text-amber-700 font-bold hover:underline">
                Terms of Service →
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
