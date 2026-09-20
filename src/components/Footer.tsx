import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white text-xs text-slate-500 py-10 px-4 sm:px-6 lg:px-8 shrink-0 z-10">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Row: Brand & Navigation Links */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-950 flex items-center justify-center text-amber-400 font-black text-xs shadow-xs">
              A
            </div>
            <span className="font-bold text-slate-900 tracking-tight">ATLAS Travel Club LLC</span>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-2 font-medium">
            <Link href="/" className="text-amber-800 font-bold hover:underline">
              Investor Portal
            </Link>
            <Link href="/terms" className="hover:text-slate-900 hover:underline">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-slate-900 hover:underline">
              Privacy Policy
            </Link>
            <Link href="/legal" className="hover:text-slate-900 hover:underline">
              Legal Safe Harbor
            </Link>
            <Link href="/legal/investor-disclosures" className="hover:text-slate-900 hover:underline">
              Investor Disclosures
            </Link>
            <Link href="/legal/rate-parity-compliance" className="hover:text-slate-900 hover:underline">
              Rate Parity Compliance
            </Link>
            <Link href="/legal/sec-compliance" className="hover:text-slate-900 hover:underline">
              SEC Rule 506(c)
            </Link>
          </div>
        </div>

        {/* Bottom Row: Legal Disclaimer & Copyright */}
        <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p className="max-w-3xl text-center md:text-left leading-relaxed">
            This confidential portal is intended solely for prospective angel investors evaluating the ATLAS Post-Money SAFE offering. 
            Past performance and financial projections are forward-looking estimates and do not guarantee future returns.
          </p>
          <div className="whitespace-nowrap text-center md:text-right">
            © {new Date().getFullYear()} ATLAS Travel Club LLC. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
}
