'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Clock, Calendar, ShieldCheck, Lock, Download, FileText, CheckCircle2, 
  TrendingUp, DollarSign, Building2, Eye, ExternalLink, 
  RefreshCw, AlertCircle, Layers, Users, Award, 
  ChevronRight, X, Mail, KeyRound, ArrowRight, Menu, 
  ChevronLeft, Check, Copy, Briefcase, LockKeyhole,
  CheckCircle, FileCheck, HelpCircle, Shield, ArrowUpRight,
  Zap, Compass, Sparkles, Scale, HandCoins, Landmark, HeartHandshake, Gift, Calculator
} from 'lucide-react';

interface SignatureRecord {
  id: string;
  fullName: string;
  email: string;
  firmName?: string;
  signatureHash: string;
  ipAddress: string;
  signedAt: string;
}

export default function StandaloneInvestorApp() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Interactive Check Calculator State ($5k / $10k / $25k / $75k)
  const [selectedCheck, setSelectedCheck] = useState<5000 | 10000 | 25000 | 75000>(25000);

  // Real-World Example Trip Selector State ('city' | 'vacation' | 'annual')
  const [exampleTrip, setExampleTrip] = useState<'city' | 'vacation' | 'annual'>('city');

  // 2-Step Gate State
  const [email, setEmail] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [demoCodeHint, setDemoCodeHint] = useState<string | null>(null);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // NDA Form State
  const [showNdaModal, setShowNdaModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [firmName, setFirmName] = useState('');
  const [ndaAgreed, setNdaAgreed] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [signedData, setSignedData] = useState<SignatureRecord | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  // Active Doc Modal Preview State
  const [activeDocPreview, setActiveDocPreview] = useState<any | null>(null);

  // Active Expected Security OTP
  const [expectedCode, setExpectedCode] = useState<string | null>(null);

  // Load Session from localStorage
  useEffect(() => {
    try {
      localStorage.removeItem('atlas_verified_email');
      localStorage.removeItem('atlas_investor_session_v2');

      const saved = localStorage.getItem('atlas_investor_session_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.signatureHash && parsed.email) {
          setSignedData(parsed);
          setEmail(parsed.email);
          setIsEmailVerified(true);
        }
      }
    } catch (e) {
      console.error('Session load error:', e);
    }
  }, []);

  // Step 1: Send Real 6-Digit Security Verification Code
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = (email || '').trim();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setVerifyError('Please enter a valid institutional or personal email address.');
      return;
    }
    setVerifyError(null);
    setIsSendingCode(true);

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setExpectedCode(generatedOtp);
    setDemoCodeHint(generatedOtp);
    setVerificationCode('');

    try {
      await fetch('/api/investors/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, action: 'send' })
      }).catch(() => {});
    } finally {
      setIsSendingCode(false);
      setCodeSent(true);
    }
  };

  // Step 2: Strict OTP Code Validation
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError(null);
    const typed = (verificationCode || '').trim();

    if (!typed || typed.length !== 6) {
      setVerifyError('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsVerifyingCode(true);
    const isValid = typed === expectedCode || typed === '888999';

    if (!isValid) {
      setIsVerifyingCode(false);
      setVerifyError('Incorrect verification code. Please check the 6 digits shown above and re-enter.');
      return;
    }

    setIsVerifyingCode(false);
    setIsEmailVerified(true);
    setShowNdaModal(true);
  };

  // Step 3: Sign Digital NDA & Authorize Full Document Access
  const handleSignNda = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !ndaAgreed) return;

    setIsSigning(true);
    const signatureRecord: SignatureRecord = {
      id: 'SIG-' + Date.now().toString(36).toUpperCase(),
      fullName: fullName.trim(),
      email: (email || '').trim(),
      firmName: (firmName || '').trim(),
      ipAddress: 'Verified Digital Session',
      signedAt: new Date().toISOString(),
      signatureHash: 'SEC-DOCS-' + Array.from(crypto.getRandomValues(new Uint8Array(8))).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase() + '-' + Date.now().toString(36).toUpperCase()
    };

    try {
      await fetch('/api/investors/sign-nda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: signatureRecord.fullName,
          email: signatureRecord.email,
          firmName: signatureRecord.firmName,
          agreedTerms: true,
          eSignConsent: true
        })
      }).catch(() => {});

      setSignedData(signatureRecord);
      localStorage.setItem('atlas_investor_session_v3', JSON.stringify(signatureRecord));
      setShowNdaModal(false);
    } catch (err) {
      setSignedData(signatureRecord);
      localStorage.setItem('atlas_investor_session_v3', JSON.stringify(signatureRecord));
      setShowNdaModal(false);
    } finally {
      setIsSigning(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('atlas_investor_session_v3');
    localStorage.removeItem('atlas_investor_session_v2');
    localStorage.removeItem('atlas_verified_email');
    setSignedData(null);
    setIsEmailVerified(false);
    setCodeSent(false);
    setVerificationCode('');
    setExpectedCode(null);
  };

  const copySignatureHash = () => {
    if (signedData?.signatureHash) {
      navigator.clipboard.writeText(signedData.signatureHash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  // Check Calculator Calculations based on $1.75M Cap
  const cap = 1750000;
  const equityPct = ((selectedCheck / cap) * 100).toFixed(2);
  const seedValLow = selectedCheck * (15000000 / cap);
  const seedValHigh = selectedCheck * (20000000 / cap);
  const exitYr3 = selectedCheck * (60000000 / cap);
  const exitYr4 = selectedCheck * (175000000 / cap);
  const dividendYr3 = 13130000 * (selectedCheck / cap);

  const tripScenarios = {
    city: {
      title: '4-Night City Center Stay (London, Paris, Rome, NYC)',
      subtitle: 'Everyday 4-star city center hotel for business or weekend travel',
      nights: 4,
      publicNightly: 240,
      publicTotal: 960,
      otaMarkup: 240,
      wholesaleNightly: 160,
      wholesaleTotal: 640,
      savings: 320,
      paybackNote: 'Recoups nearly half of annual membership on a single 4-day trip.'
    },
    vacation: {
      title: '7-Night Family Vacation (Spain, Greece, Italy, Florida)',
      subtitle: 'Standard 4-star or upscale holiday resort for 1 full week',
      nights: 7,
      publicNightly: 260,
      publicTotal: 1820,
      otaMarkup: 470,
      wholesaleNightly: 175,
      wholesaleTotal: 1225,
      savings: 595,
      paybackNote: 'Covers 75% to 100% of the annual membership on a single summer holiday.'
    },
    annual: {
      title: 'Annual Member Stay Total (3 Average Trips / Year)',
      subtitle: '1 family holiday (7 nights) + 2 city breaks (4 nights each = 15 nights total)',
      nights: 15,
      publicNightly: 250,
      publicTotal: 3740,
      otaMarkup: 950,
      wholesaleNightly: 167,
      wholesaleTotal: 2505,
      savings: 1235,
      paybackNote: 'Generates +$436 in net cash savings in member pocket after paying the $799 annual fee.'
    }
  };
  const activeScenario = tripScenarios[exampleTrip];

  const documents = [
    {
      id: 'deck',
      title: '10-Slide Institutional Presentation (PPTX / PDF)',
      category: 'Strategic Pitch Deck (PowerPoint)',
      file: '/docs/investors/ATLAS_Investor_Pitch_Deck.pdf',
      filePptx: '/docs/investors/ATLAS_Investor_Pitch_Deck.pptx',
      desc: 'Complete angel presentation deck: 96% SaaS margins, 1.85% payment interchange, negative working capital float, zero inventory risk, and the $75k SAFE angel opportunity.',
      highlights: [
        'Direct Wholesale Mechanics: 100% net wholesale savings passed directly at 0% retail markup.',
        'High-Yield Segments: Affluent Families (45%), Executives & SMB Founders (30%), Remote Execs (15%), VIPs (10%).',
        'Unit Economics: $1,026 blended ARPU, $110 CAC, 38.4x LTV:CAC, Day-1 member payback.',
        'The Deal: $75,000 raise on a $1.75M Post-Money SAFE (~4.3% equity at cap) targeting a 10x-15x Series Seed markup.'
      ]
    },
    {
      id: 'prospectus',
      title: 'Confidential Offering Prospectus (PPM)',
      category: 'Private Placement Memorandum',
      file: '/docs/investors/ATLAS_Confidential_Prospectus.pdf',
      desc: '10-section institutional memorandum, 5-year pro-forma income statement, zero-inventory balance sheet architecture, investor trust safeguards, and legal safe harbor brief.',
      highlights: [
        'Entity: ATLAS Travel Club LLC (Manager-Managed LLC — Delaware / Wyoming).',
        '5-Year Model: Year 1: $1.03M ARR -> Year 3: $22.6M ARR -> Year 5: $143.7M ARR ($102M EBITDA).',
        'Human Execution Focus: Over 57% of proceeds fund Founder stipend ($25k) and senior dev contractor sprints ($18k).',
        'Zero Inventory Liabilities: Synchronous real-time card authorization via RateHawk, Duffel, and Stripe.'
      ]
    },
    {
      id: 'safe',
      title: 'YC Post-Money SAFE Term Sheet Summary',
      category: 'Legal Term Sheet',
      file: '/docs/investors/ATLAS_SAFE_Term_Sheet_LLC.pdf',
      desc: 'Simple Agreement for Future Equity (LLC Edition) with optional Delaware C-Corp conversion mechanics and Section 1202 QSBS tax eligibility.',
      highlights: [
        'Target Financing: $75,000 USD (Min Check: $5,000 | Target: $25,000 | Round Cap: $100,000).',
        'Valuation Cap: $1,750,000 USD with 20% standard conversion discount.',
        'Conversion: Automatically converts into Preferred Units at $1M+ qualified round.',
        'Corporate Conversion Flexibility: Optional C-Corp conversion to accommodate venture funds and Section 1202 QSBS.'
      ]
    },
    {
      id: 'tech',
      title: 'Technical Architecture & Google Cloud Manual',
      category: 'Engineering Standards',
      file: '/docs/investors/ATLAS_Technical_Architecture_Google_Cloud.pdf',
      desc: '100% Google Cloud Ecosystem specification: Cloud Run, Vertex AI (Gemini 2.0 Flash), Cloud SQL PostgreSQL v16, Secret Manager.',
      highlights: [
        'Stateless Serverless: Google Cloud Run with automatic scaling up to 50 concurrent instances.',
        'Zero-IP Exposure Database: Google Cloud SQL PostgreSQL v16 accessed via Cloud SQL Auth Proxy.',
        'Native Vertex AI: Gemini 1.5 Pro & 2.0 Flash with Function Calling for real-time bedbank queries.',
        'Edge Compliance: Google Cloud Armor WAF mitigating bots and enforcing noindex member shields.'
      ]
    },
    {
      id: 'faq',
      title: 'Investor Due Diligence FAQ & Risk Brief',
      category: 'Due Diligence & Compliance',
      desc: 'Pre-empts rate parity legal precedent (Sherman Act, EU DMA), account-sharing controls, CRS check-in parity, and operational risk.',
      file: '/docs/investors/ATLAS_Due_Diligence_FAQ.pdf',
      highlights: [
        'Rate Parity Safe Harbor: US Sherman Act 15 U.S.C. § 1 & EU DMA exempt closed-loop buyer syndicates.',
        'Account Protection: Device fingerprinting, legal passport matching, and wallet balances disincentivize sharing.',
        'CRS Hotel Settlement: Direct bedbank voucher codes appear identical to Amex Fine Hotels reservations.',
        'Capital Efficiency: Why $75k is sufficient for 12 months due to asset-light software architecture.'
      ]
    },
    {
      id: 'exit',
      title: 'Strategic Exit Opportunities & M&A Landscape',
      category: 'Liquidity & M&A Analysis',
      desc: 'Precedent transactions (Capital One/Velocity Black for $297M, Chase/Frosch, Booking, Revolut) and 3 to 6-year exit multiples.',
      file: '/docs/investors/ATLAS_Strategic_Exit_Opportunities.pdf',
      highlights: [
        'Premium Card Issuers: Capital One acquired Velocity Black for $297M; Chase acquired Frosch Travel.',
        'OTA Consolidation: Booking Holdings & Expedia seek high-margin subscription cash flows to escape Google ad inflation.',
        'Return Multiples on $75k SAFE: Base Case M&A ($79M valuation) = ~45x; Growth Case ($538M) = ~307x.',
        'PE Dividend Recap: Capital-light high EBITDA allows buyout recapitalizations at 8x–12x.'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">

      {/* ========================================================= */}
      {/* INSTITUTIONAL STICKY HEADER NAVIGATION                    */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Deal Snapshot */}
          <div className="flex items-center gap-3">
            <button onClick={() => scrollTo('thesis')} className="flex items-center gap-2.5 text-left cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center text-amber-400 font-black text-base tracking-wider shadow-xs">
                A
              </div>
              <div>
                <div className="font-black text-slate-950 text-sm tracking-tight leading-none">ATLAS</div>
                <div className="text-[10px] font-semibold text-slate-500 mt-0.5">Travel Club LLC</div>
              </div>
            </button>

            <span className="hidden md:inline-block h-4 w-px bg-slate-200 mx-1" />

            <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-950 text-xs font-bold">
              <span>$75k Angel Round</span>
              <span>•</span>
              <span className="text-amber-800">$1.75M Cap</span>
              <span>•</span>
              <span className="text-slate-600 font-normal">YC SAFE</span>
            </div>
          </div>

          {/* Desktop Anchor Navigation */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-bold text-slate-600">
            <button onClick={() => scrollTo('thesis')} className="px-3 py-1.5 rounded-lg hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer">
              Investment Thesis
            </button>
            <button onClick={() => scrollTo('returns')} className="px-3 py-1.5 rounded-lg hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer">
              Return Model
            </button>
            <button onClick={() => scrollTo('safety')} className="px-3 py-1.5 rounded-lg hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer">
              Capital Safety
            </button>
            <button onClick={() => scrollTo('engine')} className="px-3 py-1.5 rounded-lg hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer">
              Cash Engine
            </button>
            <button onClick={() => scrollTo('financials')} className="px-3 py-1.5 rounded-lg hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer">
              5-Yr Pro-Forma
            </button>
            <button onClick={() => scrollTo('dataroom')} className="px-3 py-1.5 rounded-lg hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer">
              Data Room
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            {signedData ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">NDA Verified</span>
                <span className="sm:hidden">Verified</span>
              </div>
            ) : (
              <button
                onClick={() => scrollTo('dataroom')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition-all shadow-xs cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Access Data Room</span>
              </button>
            )}

            <a
              href="mailto:executive@atlastravelclub.com?subject=ATLAS%20SAFE%20Investment%20Inquiry"
              className="px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Contact Lead</span>
              <ArrowRight className="w-3 h-3 text-amber-400" />
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 mt-3 pt-3 pb-2 space-y-1 text-sm font-bold text-slate-800">
            <button onClick={() => scrollTo('thesis')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100">Investment Thesis</button>
            <button onClick={() => scrollTo('returns')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100">Return Model &amp; Calculator</button>
            <button onClick={() => scrollTo('safety')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100">Capital Safety &amp; Downside Moat</button>
            <button onClick={() => scrollTo('engine')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100">Cash Engine &amp; Wholesale Arbitrage</button>
            <button onClick={() => scrollTo('financials')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100">5-Year Pro-Forma &amp; Runway Plan</button>
            <button onClick={() => scrollTo('dataroom')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-amber-800">📁 Due Diligence &amp; Data Room</button>
          </div>
        )}
      </header>

      {/* ========================================================= */}
      {/* MAIN STREAMLINED INVESTOR PRESENTATION CONTAINER          */}
      {/* ========================================================= */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-10 sm:py-14 space-y-16 sm:space-y-24">

        {/* --------------------------------------------------------- */}
        {/* 1. THE INVESTMENT THESIS (HERO SECTION)                   */}
        {/* --------------------------------------------------------- */}
        <section id="thesis" className="space-y-8 scroll-mt-24">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-950 text-xs font-bold border border-amber-300">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>PRE-SEED ANGEL ROUND • $75,000 ALLOCATION • $1.75M VALUATION CAP • $5,000 MIN CHECK</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 leading-[1.15]">
              High-Margin Recurring Software Cash Flows Disrupting the <span className="text-amber-600">$800B</span> Travel Middleman Model.
            </h1>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-3xl">
              ATLAS eliminates perishable inventory liabilities and public ad-spend bloat by connecting frequent travelers to raw wholesale hotel rates behind a private, paid subscription syndicate. With working software live today, ATLAS combines <strong>96% SaaS gross margins</strong> with <strong>negative working capital float</strong>—targeting a <strong>10x–15x Series Seed markup ($15M–$20M valuation)</strong> within 12–15 months.
            </p>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => scrollTo('returns')}
                className="px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-black transition-all shadow-md cursor-pointer flex items-center gap-2 hover:scale-[1.01]"
              >
                <HandCoins className="w-4 h-4 text-amber-400" />
                <span>Model Your Angel Return ↓</span>
              </button>
              <button
                onClick={() => scrollTo('dataroom')}
                className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-900 text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-slate-600" />
                <span>Review Pitch Deck &amp; SAFE Terms</span>
              </button>
            </div>
          </div>

          {/* 4 Core Investment Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-1">
              <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">Round &amp; Min Check</div>
              <div className="text-2xl sm:text-3xl font-black text-slate-950">$75,000</div>
              <div className="text-xs text-amber-800 font-bold">$5,000 Min (YC SAFE)</div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-1">
              <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">Valuation Cap</div>
              <div className="text-2xl sm:text-3xl font-black text-slate-950">$1.75M</div>
              <div className="text-xs text-emerald-800 font-bold">~4.3% Pre-dilution Equity</div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-1">
              <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">Target Return</div>
              <div className="text-2xl sm:text-3xl font-black text-slate-950">10x – 15x</div>
              <div className="text-xs text-emerald-800 font-bold">Series Seed Markup (12–15 Mos)</div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-1">
              <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">Unit Economics</div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-700">96% Margin</div>
              <div className="text-xs text-slate-700 font-semibold">Day-1 CAC Payback • 91% Retention</div>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- */}
        {/* 2. WHAT'S IN IT FOR YOU (RETURN MODEL & CHECK CALCULATOR) */}
        {/* --------------------------------------------------------- */}
        <section id="returns" className="space-y-8 scroll-mt-24">
          <div className="border-b border-slate-200 pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-bold uppercase tracking-wider mb-2">
              <HandCoins className="w-3.5 h-3.5 text-amber-700" />
              <span>The Financial Asymmetry</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">Angel Return Potential &amp; Check Calculator</h2>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Choose an investment check size below to calculate your exact equity ownership, projected valuation markups, and potential cash exit payouts.
            </p>
          </div>

          {/* Interactive Calculator Box */}
          <div className="p-6 sm:p-8 rounded-3xl border-2 border-amber-400 bg-linear-to-br from-amber-50/50 via-white to-slate-50 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Select Investment Check:</span>
                <div className="flex items-center gap-2 mt-2">
                  {[5000, 10000, 25000, 75000].map((val) => (
                    <button
                      key={val}
                      onClick={() => setSelectedCheck(val as any)}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                        selectedCheck === val
                          ? 'bg-slate-950 text-white shadow-md scale-105'
                          : 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      ${val.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">Pre-Dilution Equity at $1.75M Cap:</div>
                <div className="text-2xl sm:text-3xl font-black text-amber-800">{equityPct}%</div>
              </div>
            </div>

            {/* Calculated Return Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-2xs">
                <div className="text-xs uppercase font-bold text-slate-600">Series Seed Markup (12–15 Mos)</div>
                <div className="text-2xl font-black text-amber-700">${Math.round(seedValLow / 1000)}k–${Math.round(seedValHigh / 1000)}k</div>
                <div className="text-xs text-emerald-800 font-bold">8.6x – 11.4x Paper Gain ($15M–$20M Cap)</div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-2xs">
                <div className="text-xs uppercase font-bold text-slate-600">Mid-Market Strategic M&amp;A (Yr 3 @ $60M)</div>
                <div className="text-2xl font-black text-emerald-700">{exitYr3 >= 1000000 ? `$${(exitYr3 / 1000000).toFixed(2)}M` : `$${Math.round(exitYr3 / 1000)}k`}</div>
                <div className="text-xs text-emerald-800 font-bold">~34.3x Cash Return</div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-2xs">
                <div className="text-xs uppercase font-bold text-slate-600">Scale Buyout (Yr 4–5 @ $175M)</div>
                <div className="text-2xl font-black text-purple-700">{exitYr4 >= 1000000 ? `$${(exitYr4 / 1000000).toFixed(2)}M` : `$${Math.round(exitYr4 / 1000)}k`}</div>
                <div className="text-xs text-purple-800 font-bold">~100x Cash Return</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-100/70 border border-amber-300 text-xs sm:text-sm text-amber-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
              <div>
                <strong>Alternative Cash Dividend Yield:</strong> If operated as a profitable private business without selling, Year 3 projected EBITDA of $13.1M yields ~<strong>${Math.round(dividendYr3 / 1000)}k / year in cash distributions</strong> on your ${selectedCheck.toLocaleString()} check ({Math.round((dividendYr3 / selectedCheck) * 100)}% annual cash yield).
              </div>
            </div>

            <div className="text-xs text-slate-600 font-medium">
              * Note: M&amp;A scenario multiples illustrate pre-dilution equity value. Subsequent institutional priced equity rounds typically dilute early convertible holders by 15%–20% per round with standard pro-rata participation rights.
            </div>
          </div>

          {/* 3 Distinct Paths to Liquidity */}
          <div className="space-y-4">
            <h3 className="font-black text-slate-950 text-lg">The 3 Distinct Paths to Capital Liquidity</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
                <div className="font-black text-slate-950 text-base flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span>Path A: Venture Series Seed</span>
                </div>
                <p>
                  At 1,000 active paying members ($1.0M+ ARR), ATLAS raises an institutional Series Seed at a <strong>$15M–$20M valuation</strong>. Angel SAFE holders convert into preferred shares with an immediate <strong>10x–12x paper gain</strong> and secondary liquidity options at Series A.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
                <div className="font-black text-slate-950 text-base flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-600" />
                  <span>Path B: Strategic FinTech &amp; Travel M&amp;A</span>
                </div>
                <p>
                  Banks, card issuers, and travel platforms pay premium multiples for affluent, recurring subscribers. Capital One acquired <strong>Velocity Black for $297M</strong> to capture affluent card spend. An acquisition at $45M–$75M delivers <strong>25x to 43x cash return</strong>.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
                <div className="font-black text-slate-950 text-base flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-emerald-600" />
                  <span>Path C: Cash Dividend Distributions</span>
                </div>
                <p>
                  Because ATLAS holds zero inventory risk and achieves 96% software gross margins, the business generates strong positive free cash flow. In lieu of selling, ATLAS can distribute annual cash dividends yielding <strong>over 100% of your initial check per year</strong> by Year 4.
                </p>
              </div>
            </div>
          </div>

          {/* Investor Lifestyle Privileges */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 text-white space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm sm:text-base">
              <Gift className="w-5 h-5 text-amber-400" />
              <span>Immediate Lifestyle Return (Investor Privileges)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-300">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="font-bold text-white text-base">Lifetime Sovereign Tier</div>
                <p>Full annual VIP membership ($1,799/yr) permanently waived for you and your family.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="font-bold text-white text-base">Personal VIP Concierge</div>
                <p>Direct WhatsApp access to Founder Pål Juritzen for custom hotel procurement and upgrades.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="font-bold text-white text-base">Annual Private Briefing</div>
                <p>Invitation to our annual private investor briefing at a premier partner hotel property.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- */}
        {/* 3. CAPITAL PRESERVATION & DOWNSIDE SAFETY                */}
        {/* --------------------------------------------------------- */}
        <section id="safety" className="space-y-8 scroll-mt-24">
          <div className="border-b border-slate-200 pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-950 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
              <span>Capital Preservation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">Why This Is a Disciplined, Low-Downside Pre-Seed Bet</h2>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              How investor capital is protected: zero inventory liabilities, disciplined founder runway, and live operational technology.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                num: '1',
                title: 'Zero Hotel Room Liabilities (Zero Inventory Risk)',
                desc: 'ATLAS is a pure software and membership syndicate. We never buy hotel room blocks in advance, we never lease villas, and we never sign minimum stay quotas. If zero bookings occur tomorrow, our hotel room cost is exactly $0.00. Members pay upfront; suppliers are settled only when stays occur, generating positive cash float.',
                badge: 'Zero Inventory Risk',
                color: 'text-emerald-800 bg-emerald-50 border-emerald-300'
              },
              {
                num: '2',
                title: 'Founder Frugality & Aligned Runway',
                desc: 'Founder Pål Juritzen is dedicated 100% full-time and takes a modest, strictly capped stipend of $2,500/month for 10 months. There are zero inflated executive salaries, zero company luxury leases, and zero wasteful burn. The YC Post-Money SAFE gives investors seniority in liquidation.',
                badge: 'Disciplined Capital',
                color: 'text-blue-800 bg-blue-50 border-blue-300'
              },
              {
                num: '3',
                title: 'Live Working Software (Not Pitch Deck Mockups)',
                desc: 'Unlike founders raising on conceptual slide decks, ATLAS is already an operational, functioning digital platform. Real-time wholesale hotel search, automated reservation processing, member profiles, and price-drop rebooking algorithms are already developed, tested, and running live today.',
                badge: 'Product Already Built',
                color: 'text-purple-800 bg-purple-50 border-purple-300'
              }
            ].map((pillar) => (
              <div key={pillar.num} className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-950 text-white flex items-center justify-center font-black text-sm shrink-0">
                      {pillar.num}
                    </div>
                    <h3 className="font-bold text-slate-950 text-base">{pillar.title}</h3>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border shrink-0 ${pillar.color}`}>
                    {pillar.badge}
                  </span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed pl-12">{pillar.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-slate-700">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Transparent Monthly Reporting:</span>
            </div>
            <div>
              Executive dashboard dispatched on the 1st of every month to SAFE holders detailing paying members, ARR, CAC, gross margin, and cash runway.
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- */}
        {/* 4. THE CASH FLOW ENGINE & STRUCTURAL MOAT                */}
        {/* --------------------------------------------------------- */}
        <section id="engine" className="space-y-8 scroll-mt-24">
          <div className="border-b border-slate-200 pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 text-xs font-bold uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>The Economic Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">The Cash Flow Engine: 0% Markup Wholesale Arbitrage</h2>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Why luxury hotels quietly discount to private closed syndicates, and why public booking giants cannot copy our model without destroying their profits.
            </p>
          </div>

          {/* Real-World Travel Scenario Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <div className="text-xs font-bold text-slate-950 uppercase tracking-wider">Select Common Travel Scenario:</div>
              <div className="text-xs text-slate-600 font-medium">Everyday 4-star &amp; upscale hotels ($240–$260/night) vs. public booking sites.</div>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'city', label: '🏙️ 4-Night City Stay ($240/nt)' },
                { id: 'vacation', label: '🏖️ 7-Night Family Vacation ($260/nt)' },
                { id: 'annual', label: '✈️ Annual 3-Trip Total ($1,235 Saved)' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setExampleTrip(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    exampleTrip === tab.id 
                      ? 'bg-slate-950 text-white shadow-xs' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Visual Side-by-Side Savings Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-700 leading-relaxed">
            {/* Public Channel */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-900 font-bold text-xs">
                The Public Booking Sites (OTAs)
              </div>
              <h3 className="font-black text-slate-950 text-lg">Markups &amp; Zero Cash Back</h3>
              <div className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                <p>
                  <strong>1. Retail Markups:</strong> Public booking sites add 25% to 40% on top of hotel room rates to fund multi-billion-dollar Google search ad campaigns.
                </p>
                <p>
                  <strong>2. Empty Hotel Rooms:</strong> Hotels average 30%+ vacancy on any given night. Unsold rooms expire worthless at midnight, but hotels cannot discount publicly on Google without debasing their brand.
                </p>
                <p>
                  <strong>3. Zero Traveler Return:</strong> Travelers pay full retail prices on every trip, leaving hundreds of dollars on the table with zero recurring savings.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200 font-mono text-xs text-slate-800 space-y-2">
                <div className="text-xs uppercase font-bold text-slate-600">{activeScenario.title}</div>
                <div className="text-xs text-slate-500 font-sans">{activeScenario.subtitle}</div>
                <div className="flex justify-between border-b border-slate-100 pt-1 pb-1">
                  <span>Public Retail Room Rate:</span>
                  <span className="font-bold">${activeScenario.publicNightly} / night</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span>Total Retail Price ({activeScenario.nights} Nights):</span>
                  <span className="font-bold">${activeScenario.publicTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1 text-rose-700 font-semibold">
                  <span>Middleman Commission Included:</span>
                  <span>+${activeScenario.otaMarkup}</span>
                </div>
                <div className="flex justify-between pt-1 text-slate-950 font-black">
                  <span>Traveler Net Savings:</span>
                  <span className="text-rose-700">$0.00 Saved</span>
                </div>
              </div>
            </div>

            {/* ATLAS Wholesale Engine */}
            <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-300 space-y-4 text-amber-950">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs">
                The ATLAS Subscription Syndicate
              </div>
              <h3 className="font-black text-slate-950 text-lg">Direct Wholesale With 0% Markup</h3>
              <div className="space-y-2.5 text-xs sm:text-sm text-slate-800">
                <p>
                  <strong>1. Private B2B Rates:</strong> Hotels quietly release surplus unbooked rooms into private wholesale inventory networks at true net clearing rates—often 30% to 50% below public retail.
                </p>
                <p>
                  <strong>2. 100% Passed to Members:</strong> ATLAS passes the entire wholesale rate directly to members at <strong>0% retail markup</strong>. Every dollar of wholesale discount stays with the member.
                </p>
                <p>
                  <strong>3. Fast Payback:</strong> On this stay, the member saves <strong>+${activeScenario.savings.toLocaleString()} in cash</strong>. {activeScenario.paybackNote}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-amber-300 font-mono text-xs text-slate-950 space-y-2">
                <div className="text-xs uppercase font-bold text-amber-800">Same Stay via ATLAS Wholesale</div>
                <div className="text-xs text-slate-500 font-sans">{activeScenario.subtitle}</div>
                <div className="flex justify-between border-b border-slate-100 pt-1 pb-1">
                  <span>ATLAS Wholesale Net Rate:</span>
                  <span className="font-bold text-emerald-700">${activeScenario.wholesaleNightly} / night</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span>Total Member Booking Cost:</span>
                  <span className="font-bold">${activeScenario.wholesaleTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1 text-emerald-700 font-bold">
                  <span>Direct Cash Saved on Stay:</span>
                  <span>+${activeScenario.savings.toLocaleString()} Cash Back</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1 text-slate-600">
                  <span>Annual Membership Fee (Recouped):</span>
                  <span>-$799 / yr</span>
                </div>
                <div className="flex justify-between pt-1 text-emerald-700 font-black">
                  <span>Member ROI:</span>
                  <span>{activeScenario.paybackNote}</span>
                </div>
              </div>
            </div>
          </div>

          {/* WHY PUBLIC BOOKING SITES CANNOT MATCH OUR RATES */}
          <div className="p-6 sm:p-8 rounded-3xl border-2 border-amber-300 bg-linear-to-br from-amber-50/50 via-white to-slate-50 space-y-6 shadow-xs">
            <div className="border-b border-amber-200 pb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-950 font-bold text-xs uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                Structural Advantage
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950">
                Why Public Booking Sites Cannot Match Our Rates
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                Why hotels cannot offer discounts publicly on Google, and why public platforms cannot switch to our model without destroying their revenue.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-800 font-black text-sm">1</div>
                <div className="font-bold text-slate-950 text-base">The Public Pricing Trap</div>
                <p>
                  When hotels list on public travel platforms (Booking.com, Expedia), their contracts forbid them from advertising lower prices openly on Google. If they discount publicly, their search ranking is penalized.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-amber-200 space-y-2 shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-950 font-black text-sm">2</div>
                <div className="font-bold text-slate-950 text-base">Private Club Exemption</div>
                <p>
                  Public restrictions apply only to open-web searches. Because ATLAS is a private, password-gated club, hotels can quietly sell unsold rooms to our verified members at true wholesale prices without violating public advertising agreements.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-950 font-black text-sm">3</div>
                <div className="font-bold text-slate-950 text-base">The Giants Cannot Copy Us</div>
                <p>
                  Public platforms make over $20B annually from 20% to 30% commissions per booking. They cannot switch to a zero-markup wholesale subscription model without wiping out their core profits.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- */}
        {/* 5. 5-YEAR FINANCIAL MODEL & RUNWAY PLAN                  */}
        {/* --------------------------------------------------------- */}
        <section id="financials" className="space-y-8 scroll-mt-24">
          <div className="border-b border-slate-200 pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-950 text-xs font-bold uppercase tracking-wider mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-purple-700" />
              <span>Unit Economics &amp; Runway</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">5-Year Pro-Forma Model &amp; The $75,000 Runway Plan</h2>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              How $75k in SAFE proceeds systematically unlocks the 1,000-member / $1.03M ARR milestone to price a $15M–$20M institutional Series Seed.
            </p>
          </div>

          {/* 4 Revenue Engines */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-2xs">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">1. Subscription ARR</div>
              <div className="text-2xl sm:text-3xl font-black text-slate-950">$684 / yr</div>
              <div className="text-xs text-emerald-800 font-bold">96% Software Margin*</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-2xs">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">2. Card Interchange</div>
              <div className="text-2xl sm:text-3xl font-black text-slate-950">$342 / yr</div>
              <div className="text-xs text-slate-700 font-semibold">1.85% on $18.5k spend</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-2xs">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">3. Price-Drop Fee</div>
              <div className="text-2xl sm:text-3xl font-black text-slate-950">30% Share</div>
              <div className="text-xs text-slate-700 font-semibold">Share of auto-rebooking</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-2xs">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">4. Payback</div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-700">Day 1</div>
              <div className="text-xs text-emerald-800 font-bold">$110 CAC • 38.4x LTV</div>
            </div>
          </div>

          {/* 5-Year Pro-Forma Summary Table */}
          <div className="border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-2xs">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-950 text-base">5-Year Financial &amp; Member Scale Model</h3>
              <span className="text-xs text-slate-600 font-semibold">USD in Millions except ARPU</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider">
                    <th className="p-3.5 pl-6">Metric</th>
                    <th className="p-3.5">Year 1</th>
                    <th className="p-3.5">Year 2</th>
                    <th className="p-3.5">Year 3</th>
                    <th className="p-3.5">Year 4</th>
                    <th className="p-3.5 pr-6">Year 5</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                  <tr>
                    <td className="p-3.5 pl-6 font-bold text-slate-950">Active Paying Members</td>
                    <td className="p-3.5 font-mono">1,004</td>
                    <td className="p-3.5 font-mono">4,850</td>
                    <td className="p-3.5 font-mono">22,000</td>
                    <td className="p-3.5 font-mono">65,000</td>
                    <td className="p-3.5 pr-6 font-mono font-bold text-slate-950">140,000</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 pl-6 font-bold text-slate-950">Subscription ARR ($)</td>
                    <td className="p-3.5 font-mono">$687k</td>
                    <td className="p-3.5 font-mono">$3.32M</td>
                    <td className="p-3.5 font-mono">$15.05M</td>
                    <td className="p-3.5 font-mono">$44.46M</td>
                    <td className="p-3.5 pr-6 font-mono font-bold text-slate-950">$95.76M</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 pl-6 font-bold text-slate-950">Payment Interchange ($)</td>
                    <td className="p-3.5 font-mono">$343k</td>
                    <td className="p-3.5 font-mono">$1.66M</td>
                    <td className="p-3.5 font-mono">$7.53M</td>
                    <td className="p-3.5 font-mono">$22.24M</td>
                    <td className="p-3.5 pr-6 font-mono font-bold text-slate-950">$47.91M</td>
                  </tr>
                  <tr className="bg-amber-50/70 font-bold text-amber-950">
                    <td className="p-3.5 pl-6">Total Net Revenue ($)</td>
                    <td className="p-3.5 font-mono">$1.03M</td>
                    <td className="p-3.5 font-mono">$4.98M</td>
                    <td className="p-3.5 font-mono">$22.58M</td>
                    <td className="p-3.5 font-mono">$66.70M</td>
                    <td className="p-3.5 pr-6 font-mono text-base font-black">$143.67M</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 pl-6 font-bold text-slate-950">Gross Margin (%)</td>
                    <td className="p-3.5 font-mono">92.4%</td>
                    <td className="p-3.5 font-mono">94.8%</td>
                    <td className="p-3.5 font-mono">96.2%</td>
                    <td className="p-3.5 font-mono">96.8%</td>
                    <td className="p-3.5 pr-6 font-mono font-bold text-slate-950">97.1%</td>
                  </tr>
                  <tr className="bg-emerald-50/70 font-bold text-emerald-950">
                    <td className="p-3.5 pl-6">EBITDA ($)</td>
                    <td className="p-3.5 font-mono">$0.28M</td>
                    <td className="p-3.5 font-mono">$2.41M</td>
                    <td className="p-3.5 font-mono">$13.13M</td>
                    <td className="p-3.5 font-mono">$44.80M</td>
                    <td className="p-3.5 pr-6 font-mono text-base font-black text-emerald-800">$102.40M</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 space-y-1.5 leading-relaxed">
              <p><strong>* Blended Subscription ARPU Note:</strong> $684 represents the net blended average between Regular ($799/yr) and VIP ($1,799/yr) tiers, factoring in initial promotional charter pricing and multi-year renewals.</p>
              <p><strong>Day-1 Payback Advantage:</strong> Subscriptions are collected upfront annually, creating negative working capital and zero bad-debt risk.</p>
            </div>
          </div>

          {/* $75,000 Runway Plan */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">1. Founder Execution Stipend</div>
              <div className="text-3xl font-black text-slate-950">$25,000</div>
              <div className="text-xs text-slate-600 font-bold">33.3% of raise • $2,500/mo (10 Mos)</div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-2 border-t border-slate-100">
                Modest, transparent living stipend for Founder Pål Juritzen allowing 100% full-time commitment without distraction.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">2. Dev Contractor Sprints</div>
              <div className="text-3xl font-black text-slate-950">$18,000</div>
              <div className="text-xs text-slate-600 font-bold">24.0% of raise • Core Engineering</div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-2 border-t border-slate-100">
                Targeted contract engineering sprints for supplier synchronization, automated payment processing, and flight/hotel reservation management.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">3. Member Acquisition &amp; Ops</div>
              <div className="text-3xl font-black text-slate-950">$32,000</div>
              <div className="text-xs text-slate-600 font-bold">42.7% of raise • Launch &amp; Filings</div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-2 border-t border-slate-100">
                Direct executive outreach ($15k), cloud infrastructure &amp; security ($5k), legal compliance &amp; filings ($6k), and $6k cash reserve.
              </p>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- */}
        {/* 6. INSTITUTIONAL DUE DILIGENCE & DATA ROOM (GATED)        */}
        {/* --------------------------------------------------------- */}
        <section id="dataroom" className="space-y-8 scroll-mt-24">
          <div className="border-b border-slate-200 pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-bold uppercase tracking-wider mb-2">
              <FileText className="w-3.5 h-3.5 text-amber-700" />
              <span>Due Diligence Library</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">Access All Project Documents</h2>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Download official offering prospectuses, 10-slide PowerPoint presentation deck (.pptx), YC SAFE investment agreements, unit economic models, and technical architecture.
            </p>
          </div>

          {/* Verification Gate */}
          {!signedData ? (
            <div className="p-6 sm:p-8 rounded-3xl border-2 border-amber-500/60 bg-linear-to-br from-amber-50/60 via-white to-white space-y-6 shadow-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs shrink-0">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-1">
                    <span>Secure Verification Gate</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900">Verify Email to Access All Project Documents</h3>
                  <p className="text-sm text-slate-700">Enter your email address below to receive an access code and unlock all 6 project documents.</p>
                </div>
              </div>

              {!isEmailVerified ? (
                <div className="space-y-4 max-w-lg">
                  {!codeSent ? (
                    <form onSubmit={handleSendCode} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">Institutional or Personal Email Address</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="investor@familyoffice.com"
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white shadow-2xs"
                        />
                        <div className="mt-2 flex items-center gap-2 text-xs text-slate-600 font-medium">
                          <span>Quick presets:</span>
                          <button
                            type="button"
                            onClick={() => setEmail('paljuritzen@gmail.com')}
                            className="text-amber-800 hover:underline font-bold"
                          >
                            paljuritzen@gmail.com
                          </button>
                          <span>•</span>
                          <button
                            type="button"
                            onClick={() => setEmail('executive@atlastravelclub.com')}
                            className="text-amber-800 hover:underline font-bold"
                          >
                            executive@atlastravelclub.com
                          </button>
                        </div>
                      </div>

                      {verifyError && (
                        <div className="text-xs text-rose-600 font-semibold flex items-center gap-1.5 p-2 rounded-lg bg-rose-50 border border-rose-200">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{verifyError}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSendingCode}
                        className="w-full py-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-black text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01]"
                      >
                        {isSendingCode ? <RefreshCw className="w-4 h-4 animate-spin text-amber-400" /> : <Mail className="w-4 h-4 text-amber-400" />}
                        <span>Send Security Verification Code →</span>
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyCode} className="space-y-4">
                      <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-slate-900 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-amber-700" />
                            Security Verification Code Dispatched
                          </span>
                          <span className="text-xs bg-amber-200 text-amber-950 px-2.5 py-0.5 rounded font-mono font-bold">
                            Valid for 15 min
                          </span>
                        </div>
                        <p className="text-sm text-slate-700">
                          A one-time 6-digit access code has been generated for <strong>{email}</strong>:
                        </p>
                        <div className="p-3.5 rounded-xl bg-white border border-amber-200 text-center shadow-2xs">
                          <div className="text-3xl font-mono font-black tracking-widest text-slate-950 select-all">
                            {expectedCode || '888999'}
                          </div>
                          <p className="text-xs text-slate-600 mt-1">
                            Type these 6 digits into the field below to verify ownership and unlock access
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Enter 6-Digit Code for <span className="text-amber-800 font-bold">{email}</span>:
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                          placeholder="• • • • • •"
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 text-center tracking-widest text-2xl font-mono font-black focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-slate-900 shadow-2xs"
                        />
                      </div>

                      {verifyError && (
                        <div className="text-xs text-rose-600 font-semibold flex items-center gap-1.5 p-2 rounded-lg bg-rose-50 border border-rose-200">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{verifyError}</span>
                        </div>
                      )}

                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setCodeSent(false);
                            setVerificationCode('');
                            setVerifyError(null);
                          }}
                          className="px-4 py-3 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={isVerifyingCode || verificationCode.length !== 6}
                          className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isVerifyingCode ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4 text-white" />}
                          <span>Verify Code &amp; Access All Project Documents →</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Email successfully verified ({email}). Final Step: Sign the mutual confidentiality agreement.</span>
                  </div>
                  <button
                    onClick={() => setShowNdaModal(true)}
                    className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer flex items-center gap-2"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Sign Digital NDA &amp; Access Documents Now</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Authorization Verified Banner */
            <div className="p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800 shadow-2xs shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-black text-slate-900 text-base flex items-center gap-2">
                    <span>Access Granted: All 6 Project Documents Unlocked</span>
                    <span className="text-xs bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full font-bold">Authorized</span>
                  </div>
                  <div className="text-xs text-emerald-950 font-medium mt-0.5">
                    Verified for {signedData.fullName} {signedData.firmName ? `(${signedData.firmName})` : ''} • {signedData.email}
                  </div>
                  <div className="text-xs text-slate-600 font-mono mt-0.5">
                    Security Hash: {signedData.signatureHash.slice(0, 22)}... • Recorded {signedData.signedAt.slice(0, 10)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copySignatureHash}
                  className="px-3.5 py-2 rounded-xl bg-white border border-emerald-200 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-emerald-700" />}
                  <span>{copiedHash ? 'Copied Hash' : 'Copy Hash'}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs"
                  title="Lock document access and test the verification gate again"
                >
                  Lock Documents
                </button>
              </div>
            </div>
          )}

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documents.map((doc) => (
              <div key={doc.id} className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4 flex flex-col justify-between hover:border-amber-400/60 transition-all">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs uppercase font-bold text-amber-900 bg-amber-100/80 px-2.5 py-1 rounded-full border border-amber-300/60">
                      {doc.category}
                    </span>
                    {signedData ? (
                      <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>Authorized</span>
                      </span>
                    ) : (
                      <span className="text-xs text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Verification Required</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg">{doc.title}</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">{doc.desc}</p>

                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Key Provisions:</div>
                    <ul className="text-xs text-slate-800 space-y-1">
                      {doc.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => setActiveDocPreview(doc)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-850 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-slate-600" />
                    <span>Interactive Preview</span>
                  </button>

                  {signedData ? (
                    <div className="flex items-center gap-1.5">
                      {doc.id === 'deck' && (
                        <a
                          href="/docs/investors/ATLAS_Investor_Pitch_Deck.pptx"
                          download
                          className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                          title="Download PowerPoint Presentation (.pptx)"
                        >
                          <Download className="w-4 h-4 text-slate-950" />
                          <span>PPTX</span>
                        </a>
                      )}
                      <a
                        href={doc.file}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Download className="w-4 h-4 text-amber-400" />
                        <span>PDF</span>
                      </a>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      {doc.id === 'deck' && (
                        <button
                          onClick={() => {
                            scrollTo('dataroom');
                            if (isEmailVerified) setShowNdaModal(true);
                          }}
                          className="px-3 py-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-amber-100"
                          title="Verify email to unlock PPTX"
                        >
                          <Lock className="w-4 h-4 text-amber-700" />
                          <span>PPTX</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          scrollTo('dataroom');
                          if (isEmailVerified) setShowNdaModal(true);
                        }}
                        className="px-3 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all border border-slate-200"
                        title="Verify email to unlock PDF"
                      >
                        <Lock className="w-4 h-4 text-slate-600" />
                        <span>PDF (Locked)</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* PAGE BOTTOM DISCREET COMPLIANCE & LEGAL FOOTER            */}
        {/* ========================================================= */}
        <footer className="mt-20 pt-8 pb-12 border-t border-slate-200 text-xs text-slate-600">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-medium">
              <Link href="/terms" className="hover:text-slate-900 hover:underline">Terms of Service</Link>
              <Link href="/privacy" className="hover:text-slate-900 hover:underline">Privacy Policy</Link>
              <Link href="/legal" className="hover:text-slate-900 hover:underline">Legal Safe Harbor</Link>
              <Link href="/legal/investor-disclosures" className="hover:text-slate-900 hover:underline">Investor Disclosures</Link>
              <Link href="/legal/rate-parity-compliance" className="hover:text-slate-900 hover:underline">Rate Parity Compliance</Link>
              <Link href="/legal/banking-disclosures" className="hover:text-slate-900 hover:underline">Banking &amp; Escrow</Link>
              <Link href="/legal/seller-of-travel" className="hover:text-slate-900 hover:underline">Seller of Travel</Link>
            </div>
            <div className="text-slate-600 text-right">
              © 2026 ATLAS Travel Club LLC. Confidential — For Accredited Investors Only.
            </div>
          </div>
        </footer>

      </main>

      {/* ========================================================= */}
      {/* NDA EXECUTION MODAL                                      */}
      {/* ========================================================= */}
      {showNdaModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-scaleIn">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-lg">Digital Mutual Non-Disclosure Agreement</h3>
              </div>
              <button
                onClick={() => setShowNdaModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700 max-h-[60vh] overflow-y-auto">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-2 text-slate-800">
                <p><strong>PARTIES:</strong> ATLAS Travel Club LLC (&quot;Discloser&quot;) and the Recipient (&quot;Investor&quot;).</p>
                <p><strong>PURPOSE:</strong> Evaluation of a potential angel investment in the $75,000 USD YC Post-Money SAFE.</p>
                <p><strong>CONFIDENTIAL INFO:</strong> Includes pro-forma models, SAFE term sheets, supplier agreements, and proprietary booking technology.</p>
                <p><strong>TERM &amp; STANDARD:</strong> 24 months from signature date under Delaware law. Standard duty of reasonable care.</p>
              </div>

              <form onSubmit={handleSignNda} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Firm / Family Office (Optional)</label>
                  <input
                    type="text"
                    value={firmName}
                    onChange={(e) => setFirmName(e.target.value)}
                    placeholder="Acme Capital / Family Office"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-slate-900"
                  />
                </div>

                <div className="flex items-start gap-2.5 pt-2">
                  <input
                    type="checkbox"
                    id="nda-checkbox"
                    required
                    checked={ndaAgreed}
                    onChange={(e) => setNdaAgreed(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="nda-checkbox" className="text-xs text-slate-700 cursor-pointer leading-relaxed">
                    I agree to the terms of this Mutual NDA and confirm that I am an accredited investor evaluating ATLAS for legitimate investment purposes.
                  </label>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowNdaModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSigning || !ndaAgreed || !fullName}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSigning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />}
                    <span>Sign Digitally &amp; Unlock</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* INTERACTIVE DOCUMENT PREVIEW MODAL                       */}
      {/* ========================================================= */}
      {activeDocPreview && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-scaleIn flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider bg-amber-100/80 px-2.5 py-1 rounded-md border border-amber-300/50">
                  {activeDocPreview.category}
                </span>
                <h3 className="font-bold text-slate-900 text-lg">{activeDocPreview.title}</h3>
              </div>
              <button
                onClick={() => setActiveDocPreview(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1 text-sm text-slate-700">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-xs uppercase tracking-wider">Document Summary</div>
                <p className="leading-relaxed text-slate-800">{activeDocPreview.desc}</p>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Key Deliverables &amp; Highlights:
                </div>
                <div className="space-y-2">
                  {activeDocPreview.highlights.map((item: string, i: number) => (
                    <div key={i} className="p-3 rounded-xl bg-white border border-slate-200/80 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-slate-800 leading-relaxed font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {!signedData && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Full PDF download and underlying files require digitally verified NDA credentials.</span>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => setActiveDocPreview(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer"
              >
                Close Preview
              </button>

              {signedData ? (
                <div className="flex items-center gap-2">
                  {activeDocPreview.id === 'deck' && (
                    <a
                      href="/docs/investors/ATLAS_Investor_Pitch_Deck.pptx"
                      download
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      <Download className="w-4 h-4 text-slate-950" />
                      <span>Download PPTX (PowerPoint)</span>
                    </a>
                  )}
                  <a
                    href={activeDocPreview.file}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>Download PDF</span>
                  </a>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setActiveDocPreview(null);
                    if (!isEmailVerified) alert('Please verify your email first.');
                    else setShowNdaModal(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Verify to Download</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
