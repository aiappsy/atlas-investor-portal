'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Globe2, ShieldCheck, Scale, FileText, CheckCircle2, 
  ArrowRight, ChevronRight, Lock, Euro, AlertCircle 
} from 'lucide-react';

export default function EuNorwayCompliancePage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans text-slate-800 antialiased">
      
      {/* Top Breadcrumb & Header */}
      <section className="bg-white border-b border-slate-200/80 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/legal" className="hover:text-slate-900">Legal Hub</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900 font-semibold">EU & Norwegian Compliance</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <Globe2 className="w-3.5 h-3.5 text-blue-600" />
            EØS-Avtalen • EU Law • Norsk Lovgivning
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            EU & Norwegian Regulatory Compliance Memorandum
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Legal statutory harmonization under the European Economic Area (EEA / EØS) Agreement, 
            Norwegian consumer and travel law, EU Digital Markets Act (DMA), eIDAS digital signatures, and GDPR.
          </p>
          <div className="text-[11px] text-slate-400 font-mono">
            Governing Standards: Norsk Lov (Pakkereiseloven, Angrerettloven) & EU Directives (DMA, eIDAS, PTD) • September 2026
          </div>
        </div>
      </section>

      {/* Main Legal Content Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs space-y-8 text-sm text-slate-600 leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900">1. Regulatory Framework & EEA (EØS) Harmonization</h2>
            <p>
              <strong>ATLAS Travel Club LLC</strong> operates in full compliance with the laws of Norway and the European Union pursuant to the <strong>Agreement on the European Economic Area (EEA Agreement / EØS-avtalen)</strong>. 
            </p>
            <p>
              As an international closed-loop membership platform delivering non-public wholesale travel inventory, ATLAS complies with the harmonized European Single Market frameworks governing cross-border digital services, electronic contracts, and consumer transparency.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900">2. Rate Parity & The EU Digital Markets Act (DMA)</h2>
            <p>
              The distribution of wholesale hotel inventory at 0% markup to authenticated members is protected under European competition jurisprudence:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
              <li>
                <strong>EU Digital Markets Act (Regulation (EU) 2022/1925):</strong> The European Commission has formally designated dominant Online Travel Agencies (including Booking.com) as <strong>"Gatekeepers"</strong> under the DMA. Article 5(3) of the DMA explicitly prohibits gatekeepers from imposing wide or narrow Most Favored Nation (MFN) or Rate Parity obligations on accommodation providers. Hotels are legally entitled to supply room nights at lower rates through alternative closed-loop channels.
              </li>
              <li>
                <strong>French Loi Macron (Code du tourisme Art. L. 311-5-1):</strong> Nullified all rate parity clauses enforced by OTAs in France, establishing the statutory right of hotels to distribute wholesale clearing inventory through private buyer clubs.
              </li>
              <li>
                <strong>Articles 101 & 102 TFEU:</strong> Anticompetitive vertical price restraints that penalize closed-loop subscriber collectives are invalid and unenforceable across all 30 EEA member states.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900">3. Norwegian Travel & Consumer Law Compliance</h2>
            <div className="space-y-3 pt-1">
              
              {/* Pakkereiseloven */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="font-bold text-slate-900 text-sm">
                  A. Pakkereiseloven (Package Travel Act) & Reisegarantifondet (RGF)
                </div>
                <p>
                  Pursuant to the <strong>Norwegian Act on Package Travel and Travel Guarantees (Lov om pakkereiser og reisegaranti mv., LOV-2018-06-15-32)</strong>, transposing EU Directive (EU) 2015/2302:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li>
                    <strong>Standalone Hotel Accommodations:</strong> The booking of standalone hotel room nights, villas, or car rentals does not constitute a "package travel" (pakkereise) under Section 6 of Pakkereiseloven.
                  </li>
                  <li>
                    <strong>Linked Travel Arrangements (LTA / Sammensatte reisearrangementer):</strong> Where flights and accommodations are booked concurrently, insolvency protection and supplier confirmation guarantees are facilitated through accredited travel supplier desks adhering to statutory travel guarantee requirements (Reisegarantifondet or equivalent EEA insolvency surety).
                  </li>
                </ul>
              </div>

              {/* Angrerettloven */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="font-bold text-slate-900 text-sm">
                  B. Angrerettloven (Right of Withdrawal Act)
                </div>
                <p>
                  Under <strong>Lov om opplysningsplikt og angrerett (LOV-2014-06-20-27, Section 22 m)</strong>, transposing EU Consumer Rights Directive 2011/83/EU:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li>
                    <strong>Travel Services Exemption:</strong> Contracts for passenger transport, hotel accommodation, catering, and leisure services scheduled for a specific date or period of performance are expressly <strong>exempt from the statutory 14-day right of withdrawal</strong> once confirmed. Cancellation terms are dictated by the underlying wholesale room rate card (e.g., "Free Cancellation until 48h prior").
                  </li>
                  <li>
                    <strong>Club Membership Subscriptions:</strong> Consumers subscribing to an annual ATLAS club pass enjoy a 14-day right of withdrawal from the timestamp of purchase, unless the member has affirmatively requested immediate access to wholesale rates and executed an active reservation within that window.
                  </li>
                </ul>
              </div>

              {/* Markedsføringsloven */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="font-bold text-slate-900 text-sm">
                  C. Markedsføringsloven (Marketing Control Act) & Price Transparency
                </div>
                <p>
                  In compliance with <strong>Lov om kontroll med markedsføring og avtalevilkår mv. (LOV-2009-01-09-2)</strong> and guidance from <strong>Forbrukertilsynet</strong> (The Norwegian Consumer Authority):
                </p>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li>
                    <strong>All-Inclusive Pricing:</strong> All room prices displayed to members clearly indicate total room night costs, mandatory local taxes, and resort charges prior to final booking confirmation.
                  </li>
                  <li>
                    <strong>Verifiable Price Comparisons:</strong> Benchmark comparisons (Expedia, Hotels.com, Agoda) are derived from real-time verifiable public market rates for identical property and room categories.
                  </li>
                </ul>
              </div>

            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900">4. Electronic Signatures under EU eIDAS & Norsk Lov</h2>
            <p>
              Digital execution of Mutual Non-Disclosure Agreements and investor term sheets on the ATLAS platform is legally binding across the EU and Norway:
            </p>
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2 text-xs text-blue-950">
              <div className="font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>eIDAS Regulation (Regulation (EU) No 910/2014) & Lov om elektroniske tillitstjenester</span>
              </div>
              <p>
                Pursuant to Article 25(1) of the EU eIDAS Regulation, as incorporated into Norwegian law via <em>Lov om elektroniske tillitstjenester</em> (LOV-2018-06-15-44), electronic signatures <strong>shall not be denied legal effect and admissibility as evidence in legal proceedings</strong> solely on the grounds that they are in an electronic form.
              </p>
              <p>
                The cryptographic verification audit trail generated by ATLAS (SHA-256 digest + verified email token + IP/UTC timestamp) satisfies the legal threshold for enforceable electronic agreements across Norway and all 27 EU member states.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900">5. General Data Protection Regulation (GDPR / Personopplysningsloven)</h2>
            <p>
              All member and investor data processing strictly adheres to the <strong>General Data Protection Regulation (Regulation (EU) 2016/679)</strong> and the Norwegian <strong>Personopplysningsloven (LOV-2018-06-15-38)</strong>:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-700">
              <li>
                <strong>Data Minimization & Lawful Basis:</strong> Personal data (name, email, passport details for CRS bookings) is collected solely on the lawful basis of contractual necessity (Article 6(1)(b) GDPR) and legitimate interest (Article 6(1)(f) GDPR) for rate parity authentication.
              </li>
              <li>
                <strong>Data Subject Rights:</strong> Members and prospective investors retain all statutory rights under Chapter III GDPR—including the right of access, rectification, erasure ("Right to be Forgotten"), restriction, and data portability. Inquiries may be directed to <a href="mailto:dpo@atlas-travel-club.com" className="text-amber-600 underline font-medium">dpo@atlas-travel-club.com</a>.
              </li>
              <li>
                <strong>Google Cloud Security & Cross-Border Transfers:</strong> All cloud data is encrypted in transit and at rest within Google Cloud Platform European data centers (e.g., <code>europe-west1</code> / Belgium or <code>europe-north1</code> / Finland) under standard contractual clauses (SCCs) complying with the Schrems II judgment.
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900">6. Private Placement Exemptions (EU Prospectus Regulation)</h2>
            <p>
              For European and Norwegian angel investors reviewing the \$75,000 Pre-Seed SAFE offering:
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
              <div className="font-bold text-slate-900">EU Prospectus Regulation (Regulation (EU) 2017/1129) & Verdipapirhandelloven:</div>
              <p>
                The offering of SAFE securities by ATLAS Travel Club LLC is strictly exempt from the obligation to publish a prospectus pursuant to Article 1(4) of the EU Prospectus Regulation and the Norwegian <em>Verdipapirhandelloven</em> (Securities Trading Act, LOV-2007-06-29-75) because:
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li>The total consideration of the offering within the EEA is less than €8,000,000 (calibrated at \$75,000 USD); and</li>
                <li>The offering is directed solely at qualified investors, accredited business angels, and fewer than 150 natural or legal persons per EEA member state.</li>
              </ul>
            </div>
          </section>

          {/* Footer Navigation */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <Link href="/legal" className="hover:text-slate-900 underline font-bold">Legal Hub</Link>
              <span>•</span>
              <Link href="/legal/rate-parity-compliance" className="hover:text-slate-900 underline">Rate Parity Memorandum</Link>
              <span>•</span>
              <Link href="/legal/electronic-signatures" className="hover:text-slate-900 underline">eIDAS / E-SIGN Disclosures</Link>
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
