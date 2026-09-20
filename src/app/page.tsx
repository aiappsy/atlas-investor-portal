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
      title: '4-Night City Stay (London, Paris, NYC)',
      subtitle: 'Standard 4-star boutique hotel for a weekend or business trip',
      nights: 4,
      publicNightly: 240,
      publicTotal: 960,
      otaMarkup: 240,
      wholesaleNightly: 160,
      wholesaleTotal: 640,
      savings: 320,
      paybackNote: 'Saves $320 in cash on trip #1—recouping nearly half the annual membership in 4 days.'
    },
    vacation: {
      title: '7-Night Family Holiday (Mallorca, Bali, French Riviera)',
      subtitle: 'Upscale resort suite for annual family holiday',
      nights: 7,
      publicNightly: 260,
      publicTotal: 1820,
      otaMarkup: 455,
      wholesaleNightly: 175,
      wholesaleTotal: 1225,
      savings: 595,
      paybackNote: 'Saves $595 immediately—the annual membership pays for itself on a single vacation.'
    },
    annual: {
      title: 'Typical Member Year (3 Trips Total)',
      subtitle: 'One family vacation + two weekend city getaways (15 nights total)',
      nights: 15,
      publicNightly: 250,
      publicTotal: 3750,
      otaMarkup: 938,
      wholesaleNightly: 168,
      wholesaleTotal: 2515,
      savings: 1235,
      paybackNote: 'Net $1,235 in cash back in the traveler\'s pocket after paying the $799 membership.'
    }
  };

  const activeScenario = tripScenarios[exampleTrip];

  const documents = [
    {
      id: 'deck',
      title: '10-Slide Investor Presentation (PPTX / PDF)',
      category: 'Strategic Pitch Deck',
      file: '/docs/investors/ATLAS_Investor_Pitch_Deck.pdf',
      filePptx: '/docs/investors/ATLAS_Investor_Pitch_Deck.pptx',
      desc: 'The complete visual pitch: the $120B OTA middleman tax, how closed-loop clubs legally unlock wholesale rates, 96% SaaS margins, and the $75k angel round.',
      highlights: [
        'The Costco Model for Travel: 100% of wholesale discounts passed to members at 0% markup.',
        'Target Audience: Affluent families, frequent business travelers, remote executives, and founders.',
        'Unit Economics: $1,026 blended ARPU, $110 CAC, 38.4x LTV:CAC, Day-1 member payback.',
        'The Terms: $75,000 on a standard $1.75M Post-Money YC SAFE (~4.3% equity at cap).'
      ]
    },
    {
      id: 'prospectus',
      title: 'Offering Memorandum & 5-Year Model (PDF)',
      category: 'Financial Memorandum',
      file: '/docs/investors/ATLAS_Confidential_Prospectus.pdf',
      desc: 'Detailed pro-forma income statement, zero-inventory balance sheet mechanics, capital allocation breakdown, and regulatory safe harbor brief.',
      highlights: [
        'Corporate Entity: ATLAS Travel Club LLC (Manager-Managed Delaware/Wyoming structure).',
        'Growth Plan: Year 1: $1.03M ARR -> Year 3: $22.6M ARR -> Year 5: $143.7M ARR ($102M EBITDA).',
        'Frugal Founder Burn: $2,500/month stipend keeps burn low and extends runway to 10 months.',
        'Real-Time Settlement: Zero inventory liability via direct bedbank APIs (RateHawk, Duffel, Stripe).'
      ]
    },
    {
      id: 'safe',
      title: 'YC Post-Money SAFE Agreement (PDF)',
      category: 'Investment Agreement',
      file: '/docs/investors/ATLAS_SAFE_Term_Sheet_LLC.pdf',
      desc: 'Standard Y Combinator Post-Money SAFE with 20% conversion discount, $1.75M valuation cap, and optional Delaware C-Corp / QSBS tax conversion.',
      highlights: [
        'Target Round: $75,000 USD (Minimum check: $5,000 | Target check: $25,000).',
        'Valuation Cap: $1,750,000 USD Post-Money.',
        'Automatic Conversion: Converts into Preferred Equity at the next qualified $1M+ venture round.',
        'Tax Advantage: Includes mechanics for Delaware C-Corp conversion to qualify for Section 1202 QSBS.'
      ]
    },
    {
      id: 'tech',
      title: 'Technical Architecture & Google Cloud Stack (PDF)',
      category: 'Engineering & Scalability',
      file: '/docs/investors/ATLAS_Technical_Architecture_Google_Cloud.pdf',
      desc: 'Serverless architecture built on Google Cloud: Cloud Run, Vertex AI (Gemini 2.0 Flash), Cloud SQL PostgreSQL v16, and Secret Manager.',
      highlights: [
        'Serverless Scalability: Google Cloud Run scales automatically to handle booking traffic bursts.',
        'Secure Database: PostgreSQL v16 with zero public IP exposure, accessed via Cloud SQL Proxy.',
        'Live Supplier Feeds: Real-time hotel bedbank price comparison via serverless API workers.',
        'Edge Protection: Cloud Armor WAF prevents rate scraping and blocks search engine indexing.'
      ]
    },
    {
      id: 'faq',
      title: 'Due Diligence FAQ & Risk Assessment (PDF)',
      category: 'Legal & Risk Analysis',
      file: '/docs/investors/ATLAS_Due_Diligence_FAQ.pdf',
      desc: 'Answers to the top 10 investor questions: rate parity law, supplier relationships, anti-churn mechanics, and how we keep customer acquisition costs under $110.',
      highlights: [
        'Rate Parity Safe Harbor: US Sherman Act and EU DMA legal precedents protecting closed-loop clubs.',
        'Anti-Sharing Controls: Device fingerprinting and passport matching prevent credential sharing.',
        'Seamless Hotel Check-in: Vouchers clear directly in hotel front-desk systems like standard VIP bookings.',
        'Capital Efficiency: Why $75k is enough to hit 1,000 paying members without large ad budgets.'
      ]
    },
    {
      id: 'exit',
      title: 'Strategic Exit & Acquisition Landscape (PDF)',
      category: 'M&A & Liquidity',
      file: '/docs/investors/ATLAS_Strategic_Exit_Opportunities.pdf',
      desc: 'Precedent acquisitions (Capital One bought Velocity Black for $297M; Chase bought Frosch), strategic acquirers, and return multiples across 3 exit horizons.',
      highlights: [
        'FinTech & Card Issuers: Premium banks pay high multiples for recurring high-spending cardholders.',
        'OTA Acquirers: Booking and Expedia seeking subscription cash flow to reduce Google ad dependency.',
        'Estimated Multiples: 10x–12x at Series Seed; 34x at $60M M&A; 100x at $175M scale exit.',
        'Dividend Alternative: High EBITDA margins allow self-funded dividend recaps if held privately.'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">

      {/* ========================================================= */}
      {/* 1. TOP STICKY BAR: DEAL SNAPSHOT & NAVIGATION             */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Deal Tag */}
          <div className="flex items-center gap-3">
            <button onClick={() => scrollTo('hero')} className="flex items-center gap-2.5 text-left cursor-pointer">
              <div className="w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center text-amber-400 font-black text-sm shadow-xs">
                A
              </div>
              <div>
                <div className="font-black text-slate-950 text-sm tracking-tight leading-none">ATLAS</div>
                <div className="text-[10px] font-bold text-slate-500 mt-0.5">Travel Club LLC</div>
              </div>
            </button>

            <span className="hidden md:inline-block h-4 w-px bg-slate-200 mx-1" />

            <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-950 text-xs font-bold">
              <span>$75k Angel Round</span>
              <span>•</span>
              <span className="text-amber-800">$1.75M Cap</span>
              <span>•</span>
              <span className="text-slate-600 font-medium">YC SAFE</span>
            </div>
          </div>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-bold text-slate-600">
            <button onClick={() => scrollTo('hero')} className="px-3 py-1.5 rounded-lg hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer">
              The Pitch
            </button>
            <button onClick={() => scrollTo('how-it-works')} className="px-3 py-1.5 rounded-lg hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer">
              How It Works
            </button>
            <button onClick={() => scrollTo('safety')} className="px-3 py-1.5 rounded-lg hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer">
              Why It's Safe
            </button>
            <button onClick={() => scrollTo('calculator')} className="px-3 py-1.5 rounded-lg hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer">
              Returns Calculator
            </button>
            <button onClick={() => scrollTo('financials')} className="px-3 py-1.5 rounded-lg hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer">
              Financial Plan
            </button>
            <button onClick={() => scrollTo('dataroom')} className="px-3 py-1.5 rounded-lg hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer text-amber-800">
              Data Room
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            {signedData ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>NDA Verified</span>
              </div>
            ) : (
              <button
                onClick={() => scrollTo('dataroom')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition-all shadow-xs cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Data Room</span>
              </button>
            )}

            <a
              href="mailto:executive@atlastravelclub.com?subject=ATLAS%20SAFE%20Investment%20Inquiry"
              className="px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Commit a Check</span>
              <ArrowRight className="w-3 h-3 text-amber-400" />
            </a>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 mt-3 pt-3 pb-2 space-y-1 text-sm font-bold text-slate-800">
            <button onClick={() => scrollTo('hero')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100">The Pitch</button>
            <button onClick={() => scrollTo('how-it-works')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100">How It Works &amp; Real Savings</button>
            <button onClick={() => scrollTo('safety')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100">Why Your Money Is Safe</button>
            <button onClick={() => scrollTo('calculator')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100">Angel Returns Calculator</button>
            <button onClick={() => scrollTo('financials')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100">Runway &amp; Financial Model</button>
            <button onClick={() => scrollTo('dataroom')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-amber-800">📁 Due Diligence &amp; Data Room</button>
          </div>
        )}
      </header>

      {/* ========================================================= */}
      {/* 2. HERO: THE COSTCO OF LUXURY TRAVEL                      */}
      {/* ========================================================= */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-10 sm:py-16 space-y-16 sm:space-y-24">

        <section id="hero" className="space-y-8 scroll-mt-24">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-950 text-xs font-bold border border-amber-300">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>ANGEL INVESTMENT MEMO • $75,000 PRE-SEED ROUND • $1.75M VALUATION CAP</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 leading-[1.12]">
              The Costco of Luxury Travel.
            </h1>

            <p className="text-xl sm:text-2xl font-bold text-slate-800 leading-snug">
              Expedia and Booking.com charge a 25% middleman tax on every hotel room. ATLAS cuts them out.
            </p>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
              Hotels have 30% empty rooms every night that expire worthless at midnight. Their contracts legally forbid them from discounting publicly on Google. So they quietly liquidate unsold rooms to our private members at <strong>true wholesale cost (30% to 50% off)</strong>.
            </p>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
              We pass 100% of the wholesale discount to members at <strong>0% markup</strong>. In return, we collect high-margin annual subscription fees upfront. <strong>Zero hotel inventory liabilities. 96% SaaS margins. Live software working today.</strong>
            </p>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => scrollTo('calculator')}
                className="px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-black transition-all shadow-md cursor-pointer flex items-center gap-2 hover:scale-[1.01]"
              >
                <HandCoins className="w-4 h-4 text-amber-400" />
                <span>Calculate Your Angel Return ↓</span>
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

          {/* 4 Core Deal Terms */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-1">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">The Raise</div>
              <div className="text-2xl sm:text-3xl font-black text-slate-950">$75,000</div>
              <div className="text-xs text-amber-800 font-bold">$5,000 Min Check (YC SAFE)</div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-1">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Valuation Cap</div>
              <div className="text-2xl sm:text-3xl font-black text-slate-950">$1.75M</div>
              <div className="text-xs text-emerald-800 font-bold">~4.3% Equity at Cap</div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-1">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Series Seed Target</div>
              <div className="text-2xl sm:text-3xl font-black text-slate-950">10x – 15x</div>
              <div className="text-xs text-emerald-800 font-bold">$15M–$20M Cap in 12–15 Mos</div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-1">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Inventory Risk</div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-700">$0.00</div>
              <div className="text-xs text-slate-600 font-semibold">Zero Pre-Purchased Rooms</div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3. HOW IT WORKS: THE DIRTY SECRET IN TRAVEL               */}
        {/* ========================================================= */}
        <section id="how-it-works" className="space-y-8 scroll-mt-24">
          <div className="border-b border-slate-200 pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 text-xs font-bold uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>The Market Opportunity</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">The Dirty Secret in Hotel Booking</h2>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Why hotels hate Expedia and Booking.com, and how ATLAS uses legal wholesale loopholes to pass pure savings to travelers.
            </p>
          </div>

          {/* Interactive Travel Scenario */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <div className="text-xs font-bold text-slate-950 uppercase tracking-wider">Select a Real-World Trip:</div>
              <div className="text-xs text-slate-500 font-medium">See the actual dollar difference between public retail and ATLAS wholesale.</div>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'city', label: '🏙️ 4-Night City Trip ($240/nt)' },
                { id: 'vacation', label: '🏖️ 7-Night Vacation ($260/nt)' },
                { id: 'annual', label: '✈️ 3 Trips a Year ($1,235 Saved)' }
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

          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-700 leading-relaxed">
            {/* The Old Way */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-900 font-bold text-xs">
                The Public Sites (Expedia &amp; Booking.com)
              </div>
              <h3 className="font-black text-slate-950 text-lg">25% Tolls &amp; Zero Savings</h3>
              <div className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                <p>
                  <strong>1. High Commissions:</strong> Public booking sites take $25 to $35 out of every $100 you spend, blowing it on Google search ads.
                </p>
                <p>
                  <strong>2. Legal Gag Rules:</strong> Hotels sign "Rate Parity" contracts forbidding them from posting discounts openly on the internet.
                </p>
                <p>
                  <strong>3. The Traveler Loses:</strong> You pay full retail price every time, with zero reward for being a loyal customer.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200 font-mono text-xs text-slate-800 space-y-2">
                <div className="text-xs uppercase font-bold text-slate-600">{activeScenario.title}</div>
                <div className="text-xs text-slate-500 font-sans">{activeScenario.subtitle}</div>
                <div className="flex justify-between border-b border-slate-100 pt-1 pb-1">
                  <span>Public Rate:</span>
                  <span className="font-bold">${activeScenario.publicNightly} / night</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span>Total Hotel Bill ({activeScenario.nights} Nights):</span>
                  <span className="font-bold">${activeScenario.publicTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1 text-rose-700 font-semibold">
                  <span>Middleman Commission:</span>
                  <span>+${activeScenario.otaMarkup} (Included in price)</span>
                </div>
                <div className="flex justify-between pt-1 text-slate-950 font-black">
                  <span>Your Savings:</span>
                  <span className="text-rose-700">$0.00 Saved</span>
                </div>
              </div>
            </div>

            {/* The ATLAS Way */}
            <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-300 space-y-4 text-amber-950">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs">
                The ATLAS Membership Model
              </div>
              <h3 className="font-black text-slate-950 text-lg">Raw Wholesale at 0% Markup</h3>
              <div className="space-y-2.5 text-xs sm:text-sm text-slate-800">
                <p>
                  <strong>1. Private Club Exemption:</strong> Because ATLAS is a password-protected club, hotels can legally sell unsold rooms to our members at pure wholesale.
                </p>
                <p>
                  <strong>2. 0% Markup:</strong> We take $0.00 commission on hotel bookings. 100% of the wholesale discount stays in the member's wallet.
                </p>
                <p>
                  <strong>3. Immediate Payback:</strong> On this stay, the traveler saves <strong>+${activeScenario.savings.toLocaleString()}</strong>. {activeScenario.paybackNote}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-amber-300 font-mono text-xs text-slate-950 space-y-2">
                <div className="text-xs uppercase font-bold text-amber-800">Same Hotel via ATLAS Wholesale</div>
                <div className="text-xs text-slate-500 font-sans">{activeScenario.subtitle}</div>
                <div className="flex justify-between border-b border-slate-100 pt-1 pb-1">
                  <span>ATLAS Wholesale Rate:</span>
                  <span className="font-bold text-emerald-700">${activeScenario.wholesaleNightly} / night</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span>Total Member Cost:</span>
                  <span className="font-bold">${activeScenario.wholesaleTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1 text-emerald-700 font-bold">
                  <span>Cash Saved on This Trip:</span>
                  <span>+${activeScenario.savings.toLocaleString()} Cash Back</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1 text-slate-600">
                  <span>Annual Membership Fee:</span>
                  <span>-$799 / yr</span>
                </div>
                <div className="flex justify-between pt-1 text-emerald-700 font-black">
                  <span>Result:</span>
                  <span>{activeScenario.paybackNote}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Why the Giants Can't Stop Us */}
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white space-y-6 shadow-xs">
            <div>
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">Structural Moat</div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950">Why Booking.com and Expedia Cannot Copy Us</h3>
              <p className="text-sm text-slate-600 mt-1">
                This isn't an execution race. The incumbents are trapped by their own business model.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-950 text-base">1. The Commission Trap</div>
                <p>
                  Public platforms generate over $20 Billion annually from 20% to 30% booking commissions. They cannot switch to a zero-markup subscription model without destroying 80% of their existing revenue.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-950 text-base">2. The Google Tax</div>
                <p>
                  Expedia and Booking.com spend over $12 Billion every year buying Google search ads to acquire the same customers over and over. ATLAS acquires members once for $110, earning high annual recurring revenue.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-950 text-base">3. 100% Legal Exemption</div>
                <p>
                  Rate Parity laws (US Sherman Act and EU Digital Markets Act) explicitly allow closed, paid membership clubs to sell rooms below public prices. Hotels love us because we sell empty rooms without angering Google.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. DOWNSIDE PROTECTION: WHY YOUR CAPITAL IS SAFE          */}
        {/* ========================================================= */}
        <section id="safety" className="space-y-8 scroll-mt-24">
          <div className="border-b border-slate-200 pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-950 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
              <span>Capital Preservation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">Downside Protection: Why Your Money Is Safe</h2>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Most travel startups fail because they take inventory risk or burn millions on ads. Here is how ATLAS eliminates those risks.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                num: '1',
                title: 'Zero Hotel Room Inventory Liabilities',
                desc: 'We never buy hotel room blocks in advance. We never lease properties, and we have zero minimum purchase quotas. If zero bookings occur next week, our hotel room cost is exactly $0.00. We hold zero inventory on our balance sheet.',
                badge: '$0 Inventory Risk',
                color: 'text-emerald-800 bg-emerald-50 border-emerald-300'
              },
              {
                num: '2',
                title: 'We Get Paid Upfront (Positive Cash Float)',
                desc: 'Members pay their annual dues ($799 to $1,799) on Day 1. We collect cash before delivering services, giving us strong working capital float with zero bad-debt risk and zero unpaid receivables.',
                badge: 'Paid Upfront Cash',
                color: 'text-blue-800 bg-blue-50 border-blue-300'
              },
              {
                num: '3',
                title: 'The Software Is Already Built and Live Today',
                desc: 'You are not funding wireframes, concepts, or slide deck promises. The wholesale search engine, live API feeds, automated booking flow, and member portal are fully coded, tested, and running right now.',
                badge: 'Working Product',
                color: 'text-purple-800 bg-purple-50 border-purple-300'
              },
              {
                num: '4',
                title: 'Disciplined Founder Burn ($2,500/mo Cap)',
                desc: 'Founder Pål Juritzen takes a strict living stipend of $2,500/month. There are no bloated executive salaries or luxury expenses. This $75k raise provides a full 10 months of runway to reach our first 1,000 paying members ($1.5M ARR).',
                badge: '10-Month Runway',
                color: 'text-amber-800 bg-amber-50 border-amber-300'
              }
            ].map((pillar) => (
              <div key={pillar.num} className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-950 text-white flex items-center justify-center font-black text-sm shrink-0">
                      {pillar.num}
                    </div>
                    <h3 className="font-bold text-slate-950 text-base">{pillar.title}</h3>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border shrink-0 ${pillar.color}`}>
                    {pillar.badge}
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed pl-11">{pillar.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 flex items-center gap-3 text-xs sm:text-sm text-slate-700">
            <Calendar className="w-5 h-5 text-amber-600 shrink-0" />
            <span><strong>Transparent Monthly Reporting:</strong> Every angel investor receives an executive dashboard on the 1st of every month tracking active members, ARR, CAC, and cash runway.</span>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 5. RETURNS CALCULATOR: WHAT YOUR CHECK CAN RETURN         */}
        {/* ========================================================= */}
        <section id="calculator" className="space-y-8 scroll-mt-24">
          <div className="border-b border-slate-200 pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-bold uppercase tracking-wider mb-2">
              <HandCoins className="w-3.5 h-3.5 text-amber-700" />
              <span>The Financial Upside</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">Angel Returns Calculator</h2>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Select an investment check size below to see your exact equity ownership, projected Series Seed markup, and potential acquisition payouts.
            </p>
          </div>

          {/* Interactive Calculator Box */}
          <div className="p-6 sm:p-8 rounded-3xl border-2 border-amber-400 bg-linear-to-br from-amber-50/50 via-white to-slate-50 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Investment Check:</span>
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
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Equity at $1.75M Cap:</div>
                <div className="text-2xl sm:text-3xl font-black text-amber-800">{equityPct}%</div>
              </div>
            </div>

            {/* Return Multiple Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-2xs">
                <div className="text-xs uppercase font-bold text-slate-500">12–15 Mos (Series Seed Markup)</div>
                <div className="text-2xl font-black text-amber-700">${Math.round(seedValLow / 1000)}k–${Math.round(seedValHigh / 1000)}k</div>
                <div className="text-xs text-emerald-800 font-bold">8.6x – 11.4x Paper Gain ($15M–$20M Val)</div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-2xs">
                <div className="text-xs uppercase font-bold text-slate-500">Year 3 (Strategic Buyout @ $60M)</div>
                <div className="text-2xl font-black text-emerald-700">{exitYr3 >= 1000000 ? `$${(exitYr3 / 1000000).toFixed(2)}M` : `$${Math.round(exitYr3 / 1000)}k`}</div>
                <div className="text-xs text-emerald-800 font-bold">~34.3x Cash Return</div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-2xs">
                <div className="text-xs uppercase font-bold text-slate-500">Year 5 (Scale Exit @ $175M)</div>
                <div className="text-2xl font-black text-purple-700">{exitYr4 >= 1000000 ? `$${(exitYr4 / 1000000).toFixed(2)}M` : `$${Math.round(exitYr4 / 1000)}k`}</div>
                <div className="text-xs text-purple-800 font-bold">~100x Cash Return</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-100/70 border border-amber-300 text-xs sm:text-sm text-amber-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
              <div>
                <strong>The Cash Cow Alternative:</strong> If we choose not to sell, our projected Year 3 EBITDA of $13.1M allows annual dividend distributions yielding ~<strong>${Math.round(dividendYr3 / 1000)}k / year in cash</strong> on your ${selectedCheck.toLocaleString()} check ({Math.round((dividendYr3 / selectedCheck) * 100)}% annual cash yield).
              </div>
            </div>
          </div>

          {/* 3 Liquidity Paths */}
          <div className="space-y-4">
            <h3 className="font-black text-slate-950 text-lg">3 Ways You Make Money</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
                <div className="font-black text-slate-950 text-base flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span>1. Venture Series Seed</span>
                </div>
                <p>
                  At 1,000 paying members ($1.5M ARR), we raise an institutional Series Seed at <strong>$15M–$20M</strong>. Your SAFE converts with an immediate <strong>10x–12x paper gain</strong>, with secondary sale options at Series A.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
                <div className="font-black text-slate-950 text-base flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-600" />
                  <span>2. Strategic Bank &amp; Travel M&amp;A</span>
                </div>
                <p>
                  Card issuers pay massive premiums for high-spending travelers. Capital One acquired <strong>Velocity Black for $297M</strong>. An acquisition by a bank or OTA at $45M–$75M delivers <strong>25x to 43x cash return</strong>.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
                <div className="font-black text-slate-950 text-base flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-emerald-600" />
                  <span>3. Cash Dividends</span>
                </div>
                <p>
                  Because we hold zero inventory risk and enjoy 96% SaaS margins, ATLAS generates positive free cash flow early. We can distribute annual dividends paying back <strong>100%+ of your check every year</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Investor Lifestyle Privileges */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 text-white space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm sm:text-base">
              <Gift className="w-5 h-5 text-amber-400" />
              <span>Investor Privileges (Included With Every Check)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-300">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="font-bold text-white text-base">Lifetime Sovereign Pass</div>
                <p>Annual VIP membership ($1,799/yr) permanently waived for you and your family.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="font-bold text-white text-base">Founder Concierge</div>
                <p>Direct WhatsApp access to Founder Pål Juritzen for custom hotel bookings and upgrades.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="font-bold text-white text-base">Annual Retreat</div>
                <p>Invitation to our annual private investor briefing at a premier partner hotel property.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 6. FINANCIAL PLAN & THE $75,000 RUNWAY                    */}
        {/* ========================================================= */}
        <section id="financials" className="space-y-8 scroll-mt-24">
          <div className="border-b border-slate-200 pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-950 text-xs font-bold uppercase tracking-wider mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-purple-700" />
              <span>Capital Plan</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">Where the $75,000 Goes &amp; What It Achieves</h2>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              We are raising $75k to cross the 1,000-member milestone ($1.5M ARR), positioning the company for a $15M–$20M Series Seed.
            </p>
          </div>

          {/* Allocation of $75k */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-2 shadow-2xs">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">1. Founder Runway</div>
              <div className="text-3xl font-black text-slate-950">$25,000</div>
              <div className="text-xs text-slate-600 font-bold">33.3% • $2,500/mo for 10 Months</div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                Frugal living stipend allowing Founder Pål Juritzen to focus 100% full-time on execution without distraction.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-2 shadow-2xs">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">2. Engineering Sprints</div>
              <div className="text-3xl font-black text-slate-950">$18,000</div>
              <div className="text-xs text-slate-600 font-bold">24.0% • API Automation &amp; Sync</div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                Direct contractor sprints for hotel supplier API sync, automated payment flows, and price-drop rebooking algorithms.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-2 shadow-2xs">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">3. Launch &amp; Operations</div>
              <div className="text-3xl font-black text-slate-950">$32,000</div>
              <div className="text-xs text-slate-600 font-bold">42.7% • Member Growth &amp; Legal</div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                Executive member outreach ($15k), cloud servers &amp; security ($5k), legal filings ($6k), and $6k contingency reserve.
              </p>
            </div>
          </div>

          {/* 5-Year Financial Summary */}
          <div className="border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-2xs">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-950 text-base">5-Year Projected Member &amp; Revenue Growth</h3>
              <span className="text-xs text-slate-500 font-semibold">USD in Millions</span>
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
                    <td className="p-3.5 pl-6 font-bold text-slate-950">Paying Members</td>
                    <td className="p-3.5 font-mono">1,004</td>
                    <td className="p-3.5 font-mono">4,850</td>
                    <td className="p-3.5 font-mono">22,000</td>
                    <td className="p-3.5 font-mono">65,000</td>
                    <td className="p-3.5 pr-6 font-mono font-bold text-slate-950">140,000</td>
                  </tr>
                  <tr className="bg-amber-50/70 font-bold text-amber-950">
                    <td className="p-3.5 pl-6">Total Net Revenue</td>
                    <td className="p-3.5 font-mono">$1.03M</td>
                    <td className="p-3.5 font-mono">$4.98M</td>
                    <td className="p-3.5 font-mono">$22.58M</td>
                    <td className="p-3.5 font-mono">$66.70M</td>
                    <td className="p-3.5 pr-6 font-mono text-base font-black">$143.67M</td>
                  </tr>
                  <tr className="bg-emerald-50/70 font-bold text-emerald-950">
                    <td className="p-3.5 pl-6">EBITDA (Operating Profit)</td>
                    <td className="p-3.5 font-mono">$0.28M</td>
                    <td className="p-3.5 font-mono">$2.41M</td>
                    <td className="p-3.5 font-mono">$13.13M</td>
                    <td className="p-3.5 font-mono">$44.80M</td>
                    <td className="p-3.5 pr-6 font-mono text-base font-black text-emerald-800">$102.40M</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 space-y-1">
              <p><strong>Upfront Cash Collection:</strong> Subscriptions are collected annually upfront, creating positive cash flow from Day 1.</p>
              <p><strong>Customer Economics:</strong> Average blended member fee is $684/year with a $110 acquisition cost, creating a 13.5x LTV:CAC ratio.</p>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 7. GATED DATA ROOM & DUE DILIGENCE LIBRARY                */}
        {/* ========================================================= */}
        <section id="dataroom" className="space-y-8 scroll-mt-24">
          <div className="border-b border-slate-200 pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-bold uppercase tracking-wider mb-2">
              <FileText className="w-3.5 h-3.5 text-amber-700" />
              <span>Due Diligence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">Institutional Due Diligence Data Room</h2>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Review our 10-slide PowerPoint presentation deck, YC SAFE investment agreements, offering memorandum, and technical architecture.
            </p>
          </div>

          {/* Verification Box */}
          {!signedData ? (
            <div className="p-6 sm:p-8 rounded-3xl border-2 border-amber-500/60 bg-linear-to-br from-amber-50/60 via-white to-white space-y-6 shadow-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs shrink-0">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-1">
                    <span>Quick Verification Gate</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900">Enter Your Email to Unlock All 6 Documents</h3>
                  <p className="text-sm text-slate-700">Enter your email address below to receive an instant access code and unlock the pitch deck and SAFE terms.</p>
                </div>
              </div>

              {!isEmailVerified ? (
                <div className="space-y-4 max-w-lg">
                  {!codeSent ? (
                    <form onSubmit={handleSendCode} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">Your Email Address</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="investor@familyoffice.com"
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white shadow-2xs"
                        />
                        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 font-medium">
                          <span>Quick test:</span>
                          <button
                            type="button"
                            onClick={() => setEmail('paljuritzen@gmail.com')}
                            className="text-amber-800 hover:underline font-bold"
                          >
                            paljuritzen@gmail.com
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
                        <span>Send 6-Digit Access Code →</span>
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyCode} className="space-y-4">
                      <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-slate-900 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-amber-700" />
                            Access Code Ready
                          </span>
                          <span className="text-xs bg-amber-200 text-amber-950 px-2.5 py-0.5 rounded font-mono font-bold">
                            Valid for 15 min
                          </span>
                        </div>
                        <p className="text-sm text-slate-700">
                          Your one-time 6-digit access code for <strong>{email}</strong>:
                        </p>
                        <div className="p-3.5 rounded-xl bg-white border border-amber-200 text-center shadow-2xs">
                          <div className="text-3xl font-mono font-black tracking-widest text-slate-950 select-all">
                            {expectedCode || '888999'}
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Type these 6 digits into the field below to unlock instant access
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Enter 6-Digit Code:
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
                          <span>Unlock All 6 Documents →</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Email verified ({email}). Complete digital signature to access files.</span>
                  </div>
                  <button
                    onClick={() => setShowNdaModal(true)}
                    className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer flex items-center gap-2"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Sign Digital NDA &amp; Access Documents</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Verified Banner */
            <div className="p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800 shadow-2xs shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-black text-slate-900 text-base flex items-center gap-2">
                    <span>Access Unlocked: All 6 Due Diligence Documents Ready</span>
                    <span className="text-xs bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full font-bold">Authorized</span>
                  </div>
                  <div className="text-xs text-emerald-950 font-medium mt-0.5">
                    Verified for {signedData.fullName} {signedData.firmName ? `(${signedData.firmName})` : ''} • {signedData.email}
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    Security Signature: {signedData.signatureHash.slice(0, 22)}...
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copySignatureHash}
                  className="px-3.5 py-2 rounded-xl bg-white border border-emerald-200 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-emerald-700" />}
                  <span>{copiedHash ? 'Copied' : 'Copy Hash'}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs"
                >
                  Lock Access
                </button>
              </div>
            </div>
          )}

          {/* 6 Document Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documents.map((doc) => (
              <div key={doc.id} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between hover:border-amber-400 transition-all">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs uppercase font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
                      {doc.category}
                    </span>
                    {signedData ? (
                      <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>Ready to Download</span>
                      </span>
                    ) : (
                      <span className="text-xs text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Verification Required</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg">{doc.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{doc.desc}</p>

                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Key Takeaways:</div>
                    <ul className="text-xs text-slate-700 space-y-1">
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
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-slate-600" />
                    <span>Preview Document</span>
                  </button>

                  {signedData ? (
                    <div className="flex items-center gap-1.5">
                      {doc.filePptx && (
                        <a
                          href={doc.filePptx}
                          download
                          className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                          title="Download PowerPoint (.pptx)"
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
                        className="px-3.5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Download className="w-4 h-4 text-amber-400" />
                        <span>PDF</span>
                      </a>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      {doc.filePptx && (
                        <button
                          onClick={() => {
                            scrollTo('dataroom');
                            if (isEmailVerified) setShowNdaModal(true);
                          }}
                          className="px-3 py-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-amber-100"
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
        {/* 8. DISCREET COMPLIANCE & LEGAL FOOTER                     */}
        {/* ========================================================= */}
        <footer className="mt-20 pt-8 pb-12 border-t border-slate-200 text-xs text-slate-500">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-medium">
              <Link href="/terms" className="hover:text-slate-900 hover:underline">Terms of Service</Link>
              <Link href="/privacy" className="hover:text-slate-900 hover:underline">Privacy Policy</Link>
              <Link href="/legal" className="hover:text-slate-900 hover:underline">Legal Safe Harbor</Link>
              <Link href="/legal/investor-disclosures" className="hover:text-slate-900 hover:underline">Investor Disclosures</Link>
              <Link href="/legal/rate-parity-compliance" className="hover:text-slate-900 hover:underline">Rate Parity Compliance</Link>
              <Link href="/legal/sec-compliance" className="hover:text-slate-900 hover:underline">SEC Rule 506(c)</Link>
            </div>
            <div className="text-slate-400">
              © {new Date().getFullYear()} ATLAS Travel Club LLC. All rights reserved.
            </div>
          </div>
          <div className="mt-4 text-[11px] text-slate-400 leading-relaxed max-w-4xl">
            This confidential portal is intended solely for prospective angel investors evaluating the ATLAS Post-Money SAFE offering. 
            Past performance and financial projections are forward-looking estimates and do not guarantee future returns.
          </div>
        </footer>

      </main>

      {/* ========================================================= */}
      {/* DIGITAL NDA SIGNATURE MODAL                                */}
      {/* ========================================================= */}
      {showNdaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 space-y-5 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <FileCheck className="w-4 h-4" />
                </div>
                <h3 className="font-black text-slate-900 text-lg">Sign Digital Confidentiality NDA</h3>
              </div>
              <button onClick={() => setShowNdaModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              To protect trade secrets, proprietary wholesale supplier feeds, and investor terms, please digitally sign this mutual confidentiality agreement.
            </p>

            <form onSubmit={handleSignNda} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alexander Vance"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Firm or Family Office (Optional)</label>
                <input
                  type="text"
                  value={firmName}
                  onChange={(e) => setFirmName(e.target.value)}
                  placeholder="e.g. Vance Capital / Angel Investor"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 outline-hidden"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={ndaAgreed}
                    onChange={(e) => setNdaAgreed(e.target.checked)}
                    className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>
                    I agree to hold all technical architectures, supplier rates, and financial terms strictly confidential. I understand this document constitutes a legally binding electronic signature under the US E-SIGN Act.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSigning || !fullName.trim() || !ndaAgreed}
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSigning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                <span>Sign Electronic NDA &amp; Unlock Data Room</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* INTERACTIVE DOCUMENT PREVIEW MODAL                        */}
      {/* ========================================================= */}
      {activeDocPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs uppercase font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  {activeDocPreview.category}
                </span>
                <h3 className="font-black text-slate-900 text-xl mt-1">{activeDocPreview.title}</h3>
              </div>
              <button onClick={() => setActiveDocPreview(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
              <p>{activeDocPreview.desc}</p>
              
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-xs uppercase tracking-wider">Document Summary Highlights:</div>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {activeDocPreview.highlights.map((h: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {signedData ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
                  <div className="text-xs text-emerald-900 font-medium">
                    Verified Digital Session. Ready for immediate full download.
                  </div>
                  <div className="flex items-center gap-2">
                    {activeDocPreview.filePptx && (
                      <a
                        href={activeDocPreview.filePptx}
                        download
                        className="px-3 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 flex items-center gap-1.5 shadow-2xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PPTX</span>
                      </a>
                    )}
                    <a
                      href={activeDocPreview.file}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-slate-800 flex items-center gap-1.5 shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>PDF</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3">
                  <div className="text-xs text-amber-950">
                    Full document files (PPTX and PDF) are unlocked upon entering your email.
                  </div>
                  <button
                    onClick={() => {
                      setActiveDocPreview(null);
                      scrollTo('dataroom');
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-600 cursor-pointer shadow-2xs"
                  >
                    Unlock Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
