'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Scale, ShieldCheck, FileCheck, Building, CreditCard, 
  AlertCircle, ArrowRight, Shield, FileText, ChevronRight, Globe2 
} from 'lucide-react';

export default function LegalHubPage() {
  const legalSections = [
    {
      category: 'Investor & Securities Compliance',
      description: 'Regulatory memorandums, securities notices, and digital execution frameworks.',
      docs: [
        {
          title: 'Investor Disclosures & Safe Harbor',
          desc: 'Rule 506(c) Regulation D notice, accredited investor standard, PSLRA forward-looking statements.',
          href: '/legal/investor-disclosures',
          badge: 'Securities Notice',
          icon: Scale
        },
        {
          title: 'Electronic Signatures (E-SIGN Act)',
          desc: 'Statutory disclosure under 15 U.S.C. § 7001 & UETA governing digital execution and cryptographic ledgers.',
          href: '/legal/electronic-signatures',
          badge: '15 U.S.C. § 7001',
          icon: FileCheck
        },
        {
          title: 'Closed-Loop Rate Parity Memorandum',
          desc: 'Legal antitrust basis under US Sherman Act (15 U.S.C. § 1) and EU Loi Macron for wholesale rate distribution.',
          href: '/legal/rate-parity-compliance',
          badge: 'Antitrust Legal Brief',
          icon: ShieldCheck
        },
        {
          title: 'EU & Norwegian Compliance Memorandum',
          desc: 'Harmonization under EØS-avtalen, Norwegian Pakkereiseloven, EU Digital Markets Act (DMA), eIDAS signatures, and GDPR.',
          href: '/legal/eu-norway-compliance',
          badge: 'EEA / Norsk Lov',
          icon: Globe2
        }
      ]
    },
    {
      category: 'Hospitality & Consumer Disclosures',
      description: 'Travel supplier operations, state registrations, and financial disclosures.',
      docs: [
        {
          title: 'Seller of Travel Disclosures',
          desc: 'State statutory disclosures for California (CST), Florida (ST), and Washington escrow trust compliance.',
          href: '/legal/seller-of-travel',
          badge: 'State Licensing',
          icon: Building
        },
        {
          title: 'Banking & Visa® Card Disclosures',
          desc: 'Cardholder terms, 0% FX interbank policies, and Travel Vault dividend distribution protocols.',
          href: '/legal/banking-disclosures',
          badge: 'Fintech & Cards',
          icon: CreditCard
        },
        {
          title: 'Travel & Supplier Disclaimer',
          desc: 'Independent contractor terms for wholesale bedbanks, airlines, CRS check-in parity, and force majeure.',
          href: '/legal/travel-disclaimer',
          badge: 'Operational Disclaimer',
          icon: AlertCircle
        },
        {
          title: 'Terms of Service',
          desc: 'General platform terms governing membership, account security, and acceptable use.',
          href: '/terms',
          badge: 'Member Agreement',
          icon: FileText
        },
        {
          title: 'Privacy Policy',
          desc: 'Data protection, GDPR compliance, cookie policy, and confidential information retention standards.',
          href: '/privacy',
          badge: 'Data Protection',
          icon: Shield
        }
      ]
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans text-slate-800 antialiased">
      
      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200/80 py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5 text-amber-600" />
            Compliance & Governance Hub
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Legal, Regulatory & Disclosure Directory
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-3xl">
            Statutory legal notices, securities disclaimers, state Seller of Travel registrations, 
            and closed-loop antitrust memorandums governing ATLAS Travel Club LLC.
          </p>

          <div className="text-xs text-slate-400 font-mono pt-1">
            Governing Entity: ATLAS Travel Club LLC (Manager-Managed LLC — Delaware / Wyoming)
          </div>
        </div>
      </section>

      {/* Directory Grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-10">
        {legalSections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">{section.category}</h2>
              <p className="text-xs text-slate-500">{section.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.docs.map((doc, dIdx) => {
                const Icon = doc.icon;
                return (
                  <Link
                    key={dIdx}
                    href={doc.href}
                    className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-400/80 hover:shadow-sm transition-all flex flex-col justify-between space-y-3 group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-amber-50 group-hover:text-amber-700 text-slate-700 flex items-center justify-center transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-amber-100 group-hover:text-amber-800 transition-colors">
                          {doc.badge}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition-colors">
                        {doc.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {doc.desc}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center gap-1 text-xs font-bold text-amber-600">
                      <span>Read Policy</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Bottom Contact & Investor Portal Link */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <div className="font-bold text-slate-900">Are you evaluating an early-stage SAFE investment?</div>
            <div className="text-slate-500">Review offering terms and download the full due diligence data room.</div>
          </div>
          <Link
            href="/investors"
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all flex items-center gap-1.5 shrink-0"
          >
            <span>Open Investor Portal</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </Link>
        </div>
      </div>

    </div>
  );
}
