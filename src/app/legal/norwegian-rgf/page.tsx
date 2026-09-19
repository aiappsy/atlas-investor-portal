'use client';

import React from 'react';
import Link from 'next/link';
import { Globe2, ShieldCheck, Landmark, ArrowLeft } from 'lucide-react';

export default function NorwegianRgfPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans text-slate-900 antialiased">
      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200/80 py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link href="/legal" className="hover:text-slate-900">Legal Directory</Link>
            <span>/</span>
            <span className="text-slate-900">Norwegian & EU Compliance</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
            <Globe2 className="w-3.5 h-3.5 text-blue-600" />
            Norsk Reisegaranti & EU Compliance
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
            Reisegarantifondet (RGF) & EU Package Travel Compliance
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Statutory harmonization under Norwegian Pakkereiseloven (Lov om pakkereiser), the Norwegian Travel Guarantee Fund (RGF), and EU Directive 2015/2302.
          </p>

          <div className="text-xs text-slate-400 font-mono">
            Governing Law: Pakkereiseloven (LOV-2018-06-15-32) • Reisegarantifondet (RGF) • EU Directive 2015/2302
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-2xs space-y-8 text-xs text-slate-700 leading-relaxed">
          
          <section className="space-y-2.5">
            <h2 className="text-base font-black text-slate-900">1. Pakkereiseloven & Reisegarantifondet (RGF) Status</h2>
            <p>
              Under Norwegian law (Lov om pakkereiser og reisegaranti mv., LOV-2018-06-15-32), travel organizers offering package travel or linked travel arrangements (tilknyttede reisearrangementer) to consumers in Norway are required to hold statutory financial insolvency protection.
            </p>
            <p>
              ATLAS Travel Club operates strictly in full accordance with RGF bonding standards. All customer travel funds are protected through segregated merchant accounts and financial guarantees satisfying RGF statutory criteria.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-black text-slate-900">2. EU Package Travel Directive (Directive (EU) 2015/2302)</h2>
            <p>
              Through the European Economic Area (EEA / EØS) Agreement, Norway implements EU Directive 2015/2302. Under these harmonized provisions:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Members booking linked accommodations receive comprehensive pre-contractual information as mandated by Article 5 of the Directive.</li>
              <li>In the event of supplier insolvency before departure, full refund of prepayments is guaranteed through statutory insolvency arrangements.</li>
              <li>Direct hotel reservations fulfilled on an individual accommodation basis fall under standard accommodation supplier contracts with full local consumer protections.</li>
            </ul>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-black text-slate-900">3. Norwegian & European Data Sovereign Guarantees (GDPR)</h2>
            <p>
              All customer, member, and investor data is stored and processed in compliance with the EU General Data Protection Regulation (GDPR) and the Norwegian Personal Data Act (Personopplysningsloven). No traveler telemetry is sold or transferred to unauthorized foreign entities.
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
