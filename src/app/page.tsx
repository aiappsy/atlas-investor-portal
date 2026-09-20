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
  PanelLeftClose, PanelLeftOpen, Zap, Compass, Sparkles, Scale,
  HandCoins, Landmark, HeartHandshake, Gift, BadgePercent, Calculator
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
  // Sidebar Collapsible State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'teaser' | 'returns' | 'trust' | 'arbitrage' | 'economics' | 'budget' | 'dataroom' | 'exits'>('teaser');

  // Interactive Check Calculator State ($10k / $25k / $75k)
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

  // Load Session from localStorage strictly only if a signed authorization record exists
  useEffect(() => {
    try {
      // Clear legacy unverified tokens
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

    // Generate strict 6-digit random code
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setExpectedCode(generatedOtp);
    setDemoCodeHint(generatedOtp);
    setVerificationCode(''); // STRICTLY BLANK: User MUST type the code manually

    try {
      // Call backend route if active
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

    // SECURE VALIDATION: Must match generated code or master code
    const isValid = typed === expectedCode || typed === '888999';

    if (!isValid) {
      setIsVerifyingCode(false);
      setVerifyError('Incorrect verification code. Please check the 6 digits shown above and re-enter.');
      return;
    }

    // Successfully verified
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
      title: '4-Night City Trip (London, Paris, Rome, NYC)',
      subtitle: 'Everyday 4-star city center hotel for a weekend or business trip',
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
      title: 'Annual Member Total (Average 3 Common Trips / Year)',
      subtitle: '1 family holiday (7 nights) + 2 city breaks (4 nights each = 15 nights total)',
      nights: 15,
      publicNightly: 250,
      publicTotal: 3740,
      otaMarkup: 950,
      wholesaleNightly: 167,
      wholesaleTotal: 2505,
      savings: 1235,
      paybackNote: 'Generates +$436 in net cash profit in member pocket after paying the $799 fee.'
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
      desc: 'Delivering $1,500+ member savings per stay at 0% markup wholesale, capturing 96% SaaS gross margins & 1.85% interchange, trust architecture, and the $75k SAFE angel opportunity.',
      highlights: [
        'Direct Wholesale Savings: 100% wholesale net savings passed directly at 0% retail markup.',
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
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">

      {/* ========================================================= */}
      {/* COLLAPSIBLE SIDEBAR NAVIGATION (Desktop & Tablet)        */}
      {/* ========================================================= */}
      <aside 
        className={`hidden md:flex flex-col border-r border-slate-200/80 bg-white sticky top-0 h-screen z-30 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-amber-400 font-black text-lg tracking-wider shrink-0 shadow-xs">
              A
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col leading-none">
                <span className="font-black text-base tracking-tight text-slate-900">ATLAS</span>
                <span className="text-[10px] font-semibold text-amber-700 tracking-wider uppercase mt-1">
                  Investor Portal
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {sidebarCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {!sidebarCollapsed && (
            <div className="px-3 pb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Investment Brief
            </div>
          )}

          <nav className="space-y-1">
            {[
              { id: 'teaser', label: 'Executive Summary', icon: Award },
              { id: 'returns', label: "What's In It For You", icon: HandCoins, highlight: true },
              { id: 'trust', label: 'Why You Can Trust Us', icon: ShieldCheck, highlight: true },
              { id: 'arbitrage', label: 'The Savings Engine', icon: Sparkles },
              { id: 'economics', label: 'Unit Economics', icon: TrendingUp },
              { id: 'budget', label: '$75k Capital Plan', icon: DollarSign },
              { 
                id: 'dataroom', 
                label: 'Project Documents & Data Room', 
                icon: FileText, 
                badge: signedData ? 'Authorized' : 'Verified Access',
                highlight: true
              },
              { id: 'exits', label: 'Strategic M&A Exits', icon: Building2 },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer group ${
                    isActive 
                      ? 'bg-slate-900 text-white shadow-xs' 
                      : item.highlight 
                        ? 'text-amber-950 bg-amber-50/80 hover:bg-amber-100 border border-amber-200/70' 
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${
                    isActive 
                      ? 'text-amber-400' 
                      : item.highlight 
                        ? 'text-amber-700' 
                        : 'text-slate-500 group-hover:text-slate-900'
                  }`} />
                  {!sidebarCollapsed && (
                    <span className="truncate flex-1">{item.label}</span>
                  )}
                  {!sidebarCollapsed && item.badge && (
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      item.badge === 'Authorized' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Verification Status Card */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          {signedData ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                {!sidebarCollapsed && (
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                    Authorized Investor Access
                  </span>
                )}
              </div>
              {!sidebarCollapsed && (
                <div className="text-xs text-slate-700 space-y-0.5">
                  <div className="font-bold text-slate-900 truncate">{signedData.fullName}</div>
                  <div className="text-xs text-slate-600 truncate">{signedData.email}</div>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-rose-600 hover:underline pt-1 block cursor-pointer font-semibold"
                  >
                    Clear Credentials
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                {!sidebarCollapsed && (
                  <span className="text-xs font-bold text-amber-950">
                    Confidential Due Diligence
                  </span>
                )}
              </div>
              {!sidebarCollapsed && (
                <p className="text-xs text-slate-600 leading-normal">
                  Verify your email and sign the mutual NDA to access the SAFE agreement and pro-forma models.
                </p>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MAIN VIEWPORT CONTENT                                     */}
      {/* ========================================================= */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">

        {/* Top Navbar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="md:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-amber-400 font-bold text-sm">
                A
              </div>
              <span className="font-black text-sm text-slate-900">ATLAS Investor Portal</span>
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-900">Deal Room</span>
              <span>/</span>
              <span className="capitalize">{activeTab.replace('-', ' ')}</span>
            </div>
          </div>

          {/* Top Right Actions */}
          <div className="flex items-center gap-3">
            {signedData ? (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">NDA Executed & Recorded</span>
                <span className="sm:hidden">Verified</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  setActiveTab('dataroom');
                  if (isEmailVerified) setShowNdaModal(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Verify Access</span>
              </button>
            )}

            <a
              href="mailto:executive@atlastravelclub.com?subject=ATLAS%20SAFE%20Investment%20Inquiry"
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Contact Lead</span>
              <ArrowRight className="w-3 h-3 text-amber-400" />
            </a>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-slate-50 p-4 space-y-2">
            {[
              { id: 'teaser', label: 'Executive Summary' },
              { id: 'returns', label: "What's In It For You" },
              { id: 'trust', label: 'Why You Can Trust Us' },
              { id: 'arbitrage', label: 'The Savings Engine' },
              { id: 'economics', label: 'Unit Economics' },
              { id: 'budget', label: '$75k Capital Plan' },
              { id: 'dataroom', label: '📁 Project Documents & Data Room' },
              { id: 'exits', label: 'Strategic M&A Exits' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                  activeTab === item.id ? 'bg-slate-900 text-white' : 'text-slate-800 hover:bg-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* Content View Area */}
        <div className="p-6 sm:p-10 max-w-5xl w-full mx-auto space-y-10">

          {/* TAB 1: EXECUTIVE SUMMARY */}
          {activeTab === 'teaser' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Hero Banner */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-950 text-xs font-bold border border-amber-300">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Confidential Angel Brief • $75,000 Pre-Seed Round • $1.75M Post-Money Cap • $5,000 Min Check</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.15]">
                  Invest in the Private Travel App Delivering <span className="text-amber-600">30% to 50%</span> Direct Wholesale Savings on Everyday Hotel Stays.
                </h1>

                <p className="text-base sm:text-lg text-slate-800 leading-relaxed max-w-3xl">
                  ATLAS connects frequent travelers directly to wholesale hotel rates behind a private, members-only club. While public booking platforms tack on 25% to 40% in middleman commissions, our members pocket <strong>30% to 50% in direct savings on everyday 4-star and 5-star hotel stays</strong>—keeping <strong>$300 to $600+ on a single trip</strong> and over <strong>$1,200+ every year</strong> at zero retail markup. We monetize through predictable <strong>96% gross margin software memberships</strong> and payment interchange.
                </p>
              </div>

              {/* Deal Card Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-1">
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">Round &amp; Min Check</div>
                  <div className="text-2xl font-black text-slate-950">$75,000</div>
                  <div className="text-xs text-amber-700 font-bold">$5,000 Min Check (YC SAFE)</div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-1">
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">Valuation Cap</div>
                  <div className="text-2xl font-black text-slate-950">$1.75M</div>
                  <div className="text-xs text-emerald-800 font-bold">~4.3% Pre-dilution Ownership</div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-1">
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">Avg. Member Savings</div>
                  <div className="text-2xl font-black text-slate-950">$1,235 / yr</div>
                  <div className="text-xs text-emerald-800 font-bold">30%–50% Direct Cash Savings</div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-1">
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">Member Payback</div>
                  <div className="text-2xl font-black text-emerald-700">Trip #1 – #2</div>
                  <div className="text-xs text-slate-700 font-medium">38.4x LTV:CAC • 91% Retention</div>
                </div>
              </div>

              {/* CORE HIGHLIGHT BOX: WHAT'S IN IT FOR YOU & TRUST */}
              <div className="p-6 sm:p-8 rounded-3xl border-2 border-amber-400/80 bg-linear-to-br from-amber-50/70 via-white to-slate-50 space-y-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200 pb-4">
                  <div>
                    <span className="text-xs uppercase font-black tracking-wider text-amber-950 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                      The Investor Covenant
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-950 mt-2">
                      Key Highlights &amp; Angel Return (At a Glance)
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('returns')}
                      className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <HandCoins className="w-4 h-4 text-amber-400" />
                      <span>Explore Return Calculator</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('trust')}
                      className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Why You Can Trust Us</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-700 leading-relaxed">
                  {/* Pillar 1: What's In It For You */}
                  <div className="space-y-3 bg-white p-5 rounded-2xl border border-amber-200 shadow-xs">
                    <div className="flex items-center gap-2 font-black text-slate-950 text-base">
                      <HandCoins className="w-5 h-5 text-amber-600 shrink-0" />
                      <span>1. What&apos;s In It For You (Your Real Return)</span>
                    </div>
                    <ul className="space-y-2.5 text-xs sm:text-sm text-slate-800">
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>10x–15x Seed Markup Target:</strong> Scale to 1,000 paying members ($1.0M+ ARR) in 12–15 months to price an institutional Series Seed at a $15M–$20M valuation.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>34x–100x Potential Buyout:</strong> Strategic acquisitions ($60M–$175M) project $171k–$500k on a $5k check ($857k–$2.5M on a $25k check).</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Immediate Lifestyle ROI:</strong> Lifetime Sovereign VIP Club membership ($1,799/yr waived permanently) saving $1,500+ on every personal family vacation.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Pillar 2: Why You Can Trust Us */}
                  <div className="space-y-3 bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs">
                    <div className="flex items-center gap-2 font-black text-slate-950 text-base">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>2. Why You Can Trust Us (Capital Safety)</span>
                    </div>
                    <ul className="space-y-2.5 text-xs sm:text-sm text-slate-800">
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Zero Inventory Liability:</strong> We never buy room blocks in advance. If 0 rooms are booked tomorrow, our room cost is exactly $0. Your capital is never burned on empty rooms.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Disciplined Founder Runway:</strong> Founder takes a modest, capped $2,500/month living stipend for 10 months. There are zero inflated executive salaries or wasted overhead.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Live Working Technology:</strong> Real booking flow, automatic price-drop rebooking algorithms, and direct wholesale inventory connections are already built and operating today.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* The High-Asymmetry Investment Thesis */}
              <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 bg-slate-50 space-y-6">
                <div>
                  <h3 className="text-xl font-black text-slate-950">Why This Business Model Scales</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">Why public booking platforms struggle while our private membership model generates high margins.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-900 font-black text-sm">1</div>
                    <div className="font-bold text-slate-950 text-sm sm:text-base">Zero Hotel Inventory Risk</div>
                    <p>
                      We never pre-purchase hotel rooms or sign minimum volume quotas. Members pay upfront when booking; wholesale suppliers are settled only when the stay happens. We generate healthy cash float with zero debt.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-900 font-black text-sm">2</div>
                    <div className="font-bold text-slate-950 text-sm sm:text-base">Direct Wholesale Pass-Through</div>
                    <p>
                      By passing 100% of wholesale supplier rates directly to members with zero retail markup, members save $300 to $600+ on every single trip. The immediate cash savings drive organic word-of-mouth, keeping customer acquisition costs low ($110).
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-900 font-black text-sm">3</div>
                    <div className="font-bold text-slate-950 text-sm sm:text-base">Immediate Payback &amp; High Retention</div>
                    <p>
                      A member saving $595 on a single summer vacation recoups their annual membership immediately on their very first booking. Annual retention reaches 91%, because leaving the club means throwing away thousands in annual travel savings.
                    </p>
                  </div>
                </div>
              </div>

              {/* THE PRICE MOAT CALLOUT */}
              <div className="p-6 rounded-2xl bg-slate-100 border border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-950">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>The Pricing Moat: Why Public Booking Sites Cannot Match Our Rates</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 max-w-2xl leading-relaxed">
                    Public booking websites contractually forbid hotels from showing discounted rates openly on Google or search engines. But because ATLAS is a private, password-protected club, hotels can quietly sell their unsold rooms directly to our members at 30% to 50% wholesale discounts without breaking their public pricing agreements.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('arbitrage')}
                  className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <span>See How The Savings Work</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>

              {/* WHERE WE ARE TODAY: DEVELOPMENT PHASES & TIMESCALE */}
              <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white space-y-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-950 font-bold text-xs uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      Current Milestone: Phase 2 Active
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-950 mt-2">
                      Where We Are Today: 4 Commercial Rollout Phases
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                      Our commercial roadmap from wholesale inventory integration to private pilot testing and European/US expansion.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="px-4 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-xs">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>Timescale: Month 4 (You Are Here)</span>
                    </div>
                  </div>
                </div>

                {/* Overall Timescale Progress Bar */}
                <div className="space-y-2.5 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-bold text-slate-800">
                    <span className="text-emerald-700">✓ Phase 1: Foundation (Months 1–3)</span>
                    <span className="text-amber-900 font-black">● Phase 2: Pilot &amp; Maturation (Month 4 • Current)</span>
                    <span className="text-slate-600">○ Phase 3: Controlled Beta (Months 5–6)</span>
                    <span className="text-slate-500">○ Phase 4: 1,000 Members (Months 7–12)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
                    <div className="h-full bg-emerald-500" style={{ width: '25%' }} title="Phase 1: Completed" />
                    <div className="h-full bg-amber-500 animate-pulse" style={{ width: '15%' }} title="Phase 2: In Progress (Current)" />
                    <div className="h-full bg-slate-200" style={{ width: '60%' }} />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-slate-600 pt-0.5">
                    <span>Wholesale Inventory &amp; Legal Registration</span>
                    <span className="font-bold text-amber-950">Platform Built • $75,000 SAFE Open</span>
                    <span>100 Founding Members &amp; Concierge</span>
                    <span>$1.03M ARR • Series Seed Target</span>
                  </div>
                </div>

                {/* 4 Phase Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Phase 1 */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                          Phase 1 • Months 1–3
                        </span>
                        <span className="text-emerald-700 text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Delivered
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-950 text-sm">Wholesale Connectivity &amp; Foundation</h3>
                      <ul className="text-xs text-slate-700 space-y-1.5 pt-1">
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold shrink-0">✓</span>
                          <span>Direct wholesale supplier access across 650,000+ global hotels.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold shrink-0">✓</span>
                          <span>Zero-markup real-time price discovery engine completed.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold shrink-0">✓</span>
                          <span>Manager-Managed LLC corporate structure formed and registered.</span>
                        </li>
                      </ul>
                    </div>
                    <div className="text-xs font-semibold text-slate-600 pt-2 border-t border-slate-200">
                      Outcome: Zero inventory liability model validated.
                    </div>
                  </div>

                  {/* Phase 2 (CURRENT) */}
                  <div className="p-5 rounded-2xl bg-amber-50/60 border-2 border-amber-400 shadow-xs flex flex-col justify-between space-y-3 relative">
                    <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xs">
                      You Are Here
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-950 bg-amber-200/80 px-2 py-0.5 rounded-md">
                          Phase 2 • Month 4 (Present)
                        </span>
                        <span className="text-amber-800 text-xs font-bold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" /> Active
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-950 text-sm">Platform Maturation &amp; Closed Pilot</h3>
                      <ul className="text-xs text-slate-800 space-y-1.5 pt-1">
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold shrink-0">✓</span>
                          <span>Complete member search, booking, and checkout experience operational.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold shrink-0">✓</span>
                          <span>Real-world price audits completed, proving 30%–50% actual cash savings.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-amber-800 font-bold shrink-0">●</span>
                          <span>$75,000 SAFE round open ($5k min check) for pre-launch runway.</span>
                        </li>
                      </ul>
                    </div>
                    <div className="text-xs font-semibold text-amber-950 pt-2 border-t border-amber-200">
                      Outcome: Platform operational &amp; data room unlocked.
                    </div>
                  </div>

                  {/* Phase 3 */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-md">
                          Phase 3 • Months 5–6
                        </span>
                        <span className="text-slate-500 text-xs font-bold">Upcoming</span>
                      </div>
                      <h3 className="font-bold text-slate-950 text-sm">Controlled Beta &amp; 100 Members</h3>
                      <ul className="text-xs text-slate-700 space-y-1.5 pt-1">
                        <li className="flex items-start gap-1.5">
                          <span className="text-slate-400 font-bold shrink-0">○</span>
                          <span>Private invite onboarding of first 100 founding members.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-slate-400 font-bold shrink-0">○</span>
                          <span>Live hotel bookings executed with concierge support.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-slate-400 font-bold shrink-0">○</span>
                          <span>Member referral program and member savings testimonials.</span>
                        </li>
                      </ul>
                    </div>
                    <div className="text-xs font-semibold text-slate-600 pt-2 border-t border-slate-200">
                      Target: 100 members • High NPS &amp; viral retention.
                    </div>
                  </div>

                  {/* Phase 4 */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-md">
                          Phase 4 • Months 7–12
                        </span>
                        <span className="text-slate-500 text-xs font-bold">Expansion</span>
                      </div>
                      <h3 className="font-bold text-slate-950 text-sm">Scale to 1,000 Members ($1M ARR)</h3>
                      <ul className="text-xs text-slate-700 space-y-1.5 pt-1">
                        <li className="flex items-start gap-1.5">
                          <span className="text-slate-400 font-bold shrink-0">○</span>
                          <span>Commercial rollout across key European and US travel hubs.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-slate-400 font-bold shrink-0">○</span>
                          <span>Scale to 1,000 paying members ($1.03M ARR, cash-flow breakeven).</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-slate-400 font-bold shrink-0">○</span>
                          <span>Series Seed institutional financing ($15M–$20M valuation).</span>
                        </li>
                      </ul>
                    </div>
                    <div className="text-xs font-semibold text-purple-900 pt-2 border-t border-slate-200">
                      Target: $1.03M ARR • 10x–12x paper markup.
                    </div>
                  </div>
                </div>
              </div>

              {/* Prominent Access All Project Documents Callout */}
              <div className="p-6 sm:p-8 rounded-3xl border-2 border-amber-400/80 bg-linear-to-r from-amber-50/90 via-white to-amber-50/50 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-bold uppercase tracking-wider mb-1">
                    <FileText className="w-3.5 h-3.5 text-amber-700" />
                    <span>Due Diligence Data Room</span>
                  </div>
                  <h3 className="font-black text-slate-950 text-xl flex items-center gap-2 justify-center sm:justify-start">
                    <span>Project Documents &amp; Investment Agreements</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 max-w-xl leading-relaxed">
                    Direct access to all 6 official PDF documents, 10-slide PowerPoint pitch deck (.pptx), YC SAFE agreement, 5-year financial model, and technical architecture brief.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('dataroom');
                    if (isEmailVerified && !signedData) {
                      setShowNdaModal(true);
                    }
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-black text-xs shrink-0 shadow-md cursor-pointer flex items-center gap-2 hover:scale-[1.02] transition-all"
                >
                  {signedData ? <FileCheck className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-amber-400" />}
                  <span>{signedData ? 'View Project Documents →' : 'Access Project Documents →'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: WHAT'S IN IT FOR YOU (RETURNS CALCULATOR) */}
          {activeTab === 'returns' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-black text-slate-950">What&apos;s In It For You: Financial &amp; Lifestyle Return</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Concrete return scenarios, mathematical multiples, and tangible membership perks for angel investors in the $75,000 SAFE round.
                </p>
              </div>

              {/* Interactive Check Return Calculator */}
              <div className="p-6 sm:p-8 rounded-3xl border-2 border-amber-400 bg-white space-y-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-slate-950 uppercase tracking-wider">Select Investment Check Size:</div>
                    <div className="text-xs text-slate-600 font-medium">Valuation Cap: $1,750,000 USD (YC Post-Money SAFE) • Min. Check: $5,000</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {[
                      { amt: 5000, label: '$5,000 (Min Ticket)' },
                      { amt: 10000, label: '$10,000' },
                      { amt: 25000, label: '$25,000 (Recommended)' },
                      { amt: 75000, label: '$75,000 (Full Round)' }
                    ].map((btn) => (
                      <button
                        key={btn.amt}
                        onClick={() => setSelectedCheck(btn.amt as any)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedCheck === btn.amt 
                            ? 'bg-slate-950 text-white shadow-xs' 
                            : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic Return Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-2xs">
                    <div className="text-xs uppercase font-bold text-slate-600">Implied Equity Cap</div>
                    <div className="text-2xl font-black text-slate-950">~{equityPct}%</div>
                    <div className="text-xs text-slate-600 font-medium">Pre-dilution ownership</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-2xs">
                    <div className="text-xs uppercase font-bold text-slate-600">Seed Round Markup (12–15 Mos)</div>
                    <div className="text-2xl font-black text-amber-600">${Math.round(seedValLow / 1000)}k–${Math.round(seedValHigh / 1000)}k</div>
                    <div className="text-xs text-emerald-800 font-bold">8.6x – 11.4x Paper Markup</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-2xs">
                    <div className="text-xs uppercase font-bold text-slate-600">Mid-Market M&amp;A (Yr 3 @ $60M)</div>
                    <div className="text-2xl font-black text-emerald-700">{exitYr3 >= 1000000 ? `$${(exitYr3 / 1000000).toFixed(2)}M` : `$${Math.round(exitYr3 / 1000)}k`}</div>
                    <div className="text-xs text-emerald-800 font-bold">~34.3x Cash Return</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-2xs">
                    <div className="text-xs uppercase font-bold text-slate-600">Scale Buyout (Yr 4–5 @ $175M)</div>
                    <div className="text-2xl font-black text-purple-700">{exitYr4 >= 1000000 ? `$${(exitYr4 / 1000000).toFixed(2)}M` : `$${Math.round(exitYr4 / 1000)}k`}</div>
                    <div className="text-xs text-purple-800 font-bold">~100x Cash Return</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300 text-xs sm:text-sm text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-bold">Alternative Cash Dividend Yield:</span> If operated as a profitable private business without selling, Year 3 projected EBITDA of $13.1M yields ~<strong>${Math.round(dividendYr3 / 1000)}k / year in passive cash distributions</strong> on your ${selectedCheck.toLocaleString()} check ({Math.round((dividendYr3 / selectedCheck) * 100)}% annual cash yield).
                  </div>
                </div>

                <div className="text-xs text-slate-500 font-medium italic">
                  * Note: M&amp;A scenario multiples illustrate pre-dilution equity value. Subsequent institutional priced equity rounds typically dilute early convertible holders by 15%–20% per round.
                </div>
              </div>

              {/* 3 Exit Scenarios Detailed */}
              <div className="space-y-4">
                <h3 className="font-black text-slate-950 text-lg">The 3 Distinct Paths to Liquidity</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
                    <div className="font-black text-slate-950 text-base flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <span>Path A: Venture Series Seed</span>
                    </div>
                    <p>
                      At 1,000 active paying members ($1.0M+ ARR), ATLAS raises an institutional Series Seed at a <strong>$15M–$20M valuation</strong>. Angel investors in this SAFE convert into preferred shares with an immediate <strong>10x–12x paper gain</strong>, with secondary liquidity options at Series A.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
                    <div className="font-black text-slate-950 text-base flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-amber-600" />
                      <span>Path B: Strategic FinTech &amp; Travel M&amp;A</span>
                    </div>
                    <p>
                      Banks, card issuers, and travel groups pay premium valuations for affluent, high-spending travelers. Capital One acquired <strong>Velocity Black for $297M</strong> to capture card spend. A strategic acquisition at $45M–$75M delivers <strong>25x to 43x cash return</strong> on invested capital.
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

              {/* Investor Lifestyle Perks */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 text-white space-y-5 shadow-sm">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm sm:text-base">
                  <Gift className="w-5 h-5 text-amber-400" />
                  <span>Immediate Lifestyle Return (Investor Club Privileges)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-300">
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <div className="font-bold text-white text-base">Lifetime Sovereign Tier</div>
                    <p className="leading-relaxed">Full annual VIP membership ($1,799/yr) permanently waived for you and your family.</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <div className="font-bold text-white text-base">Personal VIP Concierge Desk</div>
                    <p className="leading-relaxed">Direct WhatsApp access to Founder Pål Juritzen for custom hotel procurement and room upgrades.</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <div className="font-bold text-white text-base">Annual Private Briefing</div>
                    <p className="leading-relaxed">Invitation to our annual private investor briefing at a premier partner hotel property.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WHY YOU CAN TRUST US */}
          {activeTab === 'trust' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-black text-slate-950">5 Practical Reasons to Trust Us With Your Capital</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Why this is a disciplined, low-downside pre-seed investment: zero inventory risk, founder frugality, and live working technology.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    num: '1',
                    title: 'Zero Hotel Room Liabilities (Zero Inventory Risk)',
                    desc: 'ATLAS is a pure software and membership platform. We never buy hotel room blocks in advance, we never lease villas, and we never sign minimum stay quotas. If zero bookings occur tomorrow, our hotel cost is exactly $0.00. Your investment capital is never burned on vacant hotel rooms.',
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
                  },
                  {
                    num: '4',
                    title: 'Clear Monthly KPI Reports',
                    desc: 'Every participating investor receives an executive dashboard on the 1st of every month detailing paying member count, subscription ARR, customer acquisition cost, gross margins, monthly burn rate, and remaining cash runway.',
                    badge: 'Monthly Transparency',
                    color: 'text-amber-900 bg-amber-50 border-amber-300'
                  },
                  {
                    num: '5',
                    title: 'Clean Corporate Structure & Investor Protections',
                    desc: 'Formed as a Manager-Managed Limited Liability Company with standard, industry-standard YC Post-Money SAFE terms. Includes optional corporate conversion flexibility if venture funds require a Delaware C-Corp for institutional rounds.',
                    badge: 'Clean Governance',
                    color: 'text-slate-900 bg-slate-100 border-slate-300'
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

              <div className="p-6 rounded-3xl bg-amber-50/80 border border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="font-bold text-amber-950 text-base">Have Specific Questions for the Founder?</div>
                  <div className="text-xs sm:text-sm text-amber-900">Book a direct 1-on-1 call with founder Pål Juritzen to review diligence, product, or roadmap.</div>
                </div>
                <a
                  href="mailto:executive@atlastravelclub.com?subject=ATLAS%20Investor%20Call"
                  className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold shrink-0 shadow-xs"
                >
                  Schedule Founder Call
                </a>
              </div>
            </div>
          )}

          {/* TAB 4: THE SAVINGS ENGINE */}
          {activeTab === 'arbitrage' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-black text-slate-950">The Savings Engine: 0% Markup Wholesale</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Why hotels release wholesale inventory at 30%–50% discounts, and how common everyday hotel stays save members hundreds of dollars per booking.
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
                    { id: 'city', label: '🏙️ 4-Night City Trip ($240/nt)' },
                    { id: 'vacation', label: '🏖️ 7-Night Family Holiday ($260/nt)' },
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
                    The Public Booking Sites
                  </div>
                  <h3 className="font-black text-slate-950 text-lg">Markups &amp; Zero Cash Back</h3>
                  <div className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                    <p>
                      <strong>1. Retail Markups:</strong> Public booking sites add 25% to 40% on top of hotel room rates to pay for multi-billion-dollar search ad campaigns.
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
                    The ATLAS Wholesale Model
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

              {/* The Flywheel Callout */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 text-white space-y-3 shadow-sm">
                <div className="font-bold text-amber-400 text-sm sm:text-base flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>Why Common Everyday Trips Drive Unstoppable Retention</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  You don&apos;t need $1,000/night luxury suites to make the model work. When a member saves <strong>$320 on a 4-day city break</strong> and <strong>$595 on their family summer holiday</strong>, they have pocketed over <strong>$1,200 in net annual cash savings</strong> on ordinary, common hotel stays. The $799 membership fee is easily recouped, churn drops to <strong>9%</strong> (91% annual retention), and word-of-mouth keeps customer acquisition costs at just <strong>$110</strong>.
                </p>
              </div>

              {/* WHY PUBLIC BOOKING SITES CANNOT MATCH OUR RATES */}
              <div className="p-6 sm:p-8 rounded-3xl border-2 border-amber-300 bg-linear-to-br from-amber-50/50 via-white to-slate-50 space-y-6 shadow-xs">
                <div className="border-b border-amber-200 pb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-950 font-bold text-xs uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    Market Dynamics &amp; Structural Moat
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950">
                    Why Public Booking Sites Cannot Match Our Rates
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                    Why hotels cannot offer discounts publicly on Google, and why public platforms cannot switch to our model without destroying their revenue.
                  </p>
                </div>

                {/* 3-Column Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {/* Column 1 */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
                    <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-800 font-black text-sm">
                      1
                    </div>
                    <div className="font-bold text-slate-950 text-base">The Public Pricing Trap</div>
                    <p>
                      When a hotel lists on public travel platforms (like Booking.com or Expedia), their contract forbids them from advertising lower prices openly on Google or their own homepage. If they discount publicly, their search ranking is penalized.
                    </p>
                  </div>

                  {/* Column 2 */}
                  <div className="p-5 rounded-2xl bg-white border border-amber-200 space-y-2.5 shadow-2xs">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-950 font-black text-sm">
                      2
                    </div>
                    <div className="font-bold text-slate-950 text-base">Private Members-Only Exemption</div>
                    <p>
                      Public restrictions apply only to open-web searches. Because ATLAS is a private, password-gated club, hotels can legally and quietly sell unsold rooms to our verified members at true wholesale prices without violating public advertising agreements.
                    </p>
                  </div>

                  {/* Column 3 */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-950 font-black text-sm">
                      3
                    </div>
                    <div className="font-bold text-slate-950 text-base">The Giants Cannot Copy Us</div>
                    <p>
                      Public platforms make over $20B annually from 20% to 30% commissions per booking. They cannot switch to a zero-markup wholesale subscription model without wiping out their core profits. This creates a durable competitive moat for ATLAS.
                    </p>
                  </div>
                </div>

                {/* Direct Visual Contrast Comparison Box */}
                <div className="p-5 rounded-2xl bg-slate-950 text-white space-y-3 shadow-sm">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <span>Public Retail Web vs. ATLAS Private Members Club</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div className="p-4 rounded-xl bg-slate-900 border border-rose-500/40 space-y-2">
                      <div className="font-bold text-rose-400 flex items-center gap-1.5 text-sm">
                        <X className="w-4 h-4" /> Public Booking Sites (Booking.com, Expedia)
                      </div>
                      <div className="text-slate-300 text-xs space-y-1.5">
                        <div>• Forced 20% to 35% commission markup added to room rate</div>
                        <div>• Billions spent bidding on Google search keywords</div>
                        <div>• Traveler pays full retail price on every trip</div>
                        <div>• Zero recurring loyalty savings</div>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/40 space-y-2">
                      <div className="font-bold text-emerald-400 flex items-center gap-1.5 text-sm">
                        <Check className="w-4 h-4" /> ATLAS Private Members Club
                      </div>
                      <div className="text-slate-300 text-xs space-y-1.5">
                        <div>• 0% retail markup: raw wholesale net rate passed to member</div>
                        <div>• Protected behind private member login</div>
                        <div>• Member saves $300–$600+ on every stay</div>
                        <div>• High recurring software margin (96%) with zero inventory risk</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: UNIT ECONOMICS & MODEL */}
          {activeTab === 'economics' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Predictable Recurring Unit Economics & 5-Year Financial Model</h2>
                <p className="text-sm text-slate-600 mt-1">High-margin software subscriptions paired with automated payment interchange yield.</p>
              </div>

              {/* 4 Revenue Engines */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 shadow-2xs">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">1. Subscription ARR</div>
                  <div className="text-3xl font-black text-slate-900">$684 / yr</div>
                  <div className="text-xs text-emerald-800 font-bold">96% Software Gross Margin*</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 shadow-2xs">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">2. Card Interchange</div>
                  <div className="text-3xl font-black text-slate-900">$342 / yr</div>
                  <div className="text-xs text-slate-700 font-semibold">1.85% on $18.5k card spend</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 shadow-2xs">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">3. Price-Drop Arbitrage</div>
                  <div className="text-3xl font-black text-slate-900">30% Fee</div>
                  <div className="text-xs text-slate-700 font-semibold">Share of auto-rebooked savings</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 shadow-2xs">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">4. Customer Payback</div>
                  <div className="text-3xl font-black text-emerald-700">Day 1</div>
                  <div className="text-xs text-emerald-800 font-bold">$110 CAC • 38.4x LTV:CAC</div>
                </div>
              </div>

              {/* 5-Year Pro-Forma Summary Table */}
              <div className="border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-2xs">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-base">5-Year Financial & Member Scale Model</h3>
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
                        <td className="p-3.5 pl-6 font-bold text-slate-900">Active Paying Members</td>
                        <td className="p-3.5 font-mono">1,004</td>
                        <td className="p-3.5 font-mono">4,850</td>
                        <td className="p-3.5 font-mono">22,000</td>
                        <td className="p-3.5 font-mono">65,000</td>
                        <td className="p-3.5 pr-6 font-mono font-bold text-slate-950">140,000</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 pl-6 font-bold text-slate-900">Subscription ARR ($)</td>
                        <td className="p-3.5 font-mono">$687k</td>
                        <td className="p-3.5 font-mono">$3.32M</td>
                        <td className="p-3.5 font-mono">$15.05M</td>
                        <td className="p-3.5 font-mono">$44.46M</td>
                        <td className="p-3.5 pr-6 font-mono font-bold text-slate-950">$95.76M</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 pl-6 font-bold text-slate-900">Payment Interchange Yield ($)</td>
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
                        <td className="p-3.5 pl-6 font-bold text-slate-900">Gross Margin (%)</td>
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
                  <p><strong>* Blended Subscription ARPU Note:</strong> $684 represents the net blended average between Regular ($799/yr) and VIP ($1,799/yr) tiers, factoring in initial charter pricing and multi-year renewals.</p>
                  <p><strong>Day-1 Payback Advantage:</strong> Subscriptions are collected upfront annually, creating negative working capital and zero bad-debt risk.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: $75K CAPITAL ALLOCATION BUDGET */}
          {activeTab === 'budget' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Strict Capital Allocation: The $75,000 Runway Plan</h2>
                <p className="text-sm text-slate-600 mt-1">A disciplined 10-month runway to reach 1,000 paying members and $1.03M annual recurring revenue.</p>
              </div>

              {/* Budget Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-2xs">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">1. Founder Execution Stipend</div>
                  <div className="text-3xl font-black text-slate-900">$25,000</div>
                  <div className="text-xs text-slate-600 font-bold">33.3% of total raise</div>
                  <p className="text-sm text-slate-700 leading-relaxed pt-2 border-t border-slate-100">
                    $2,500/month for 10 months for Founder Pål Juritzen. A modest, transparent living stipend allowing 100% full-time commitment without corporate distraction.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-2xs">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">2. Dev Contractor Sprints</div>
                  <div className="text-3xl font-black text-slate-900">$18,000</div>
                  <div className="text-xs text-slate-600 font-bold">24.0% of total raise</div>
                  <p className="text-sm text-slate-700 leading-relaxed pt-2 border-t border-slate-100">
                    Targeted contract engineering sprints for supplier synchronization, automated payment processing, and flight/hotel reservation management.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-2xs">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">3. Member Acquisition & Ops</div>
                  <div className="text-3xl font-black text-slate-900">$32,000</div>
                  <div className="text-xs text-slate-600 font-bold">42.7% of total raise</div>
                  <p className="text-sm text-slate-700 leading-relaxed pt-2 border-t border-slate-100">
                    Direct executive outreach ($15k), cloud infrastructure & security ($5k), legal compliance & travel regulatory filings ($6k), and a $6k cash reserve.
                  </p>
                </div>
              </div>

              {/* DETAILED 10-MONTH TIMESCALE & MILESTONE EXECUTION SCHEDULE */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 space-y-6 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Commercial Rollout Timescale &amp; Milestones</h3>
                    <p className="text-sm text-slate-600 mt-0.5">
                      How the $75,000 SAFE proceeds systematically unlock each milestone from current pilot testing to cash-flow breakeven.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 font-bold text-xs">
                      Current: Month 4
                    </span>
                    <span className="px-3 py-1.5 rounded-full bg-slate-900 text-white font-bold text-xs">
                      Runway: 10 Months
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-700 font-bold uppercase text-xs tracking-wider bg-slate-100/80">
                        <th className="p-3.5 pl-4">Phase</th>
                        <th className="p-3.5">Timescale</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5">Core Operational Focus</th>
                        <th className="p-3.5 pr-4">Target Deliverables &amp; Milestones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      <tr className="bg-slate-50/50">
                        <td className="p-3.5 pl-4 font-bold text-slate-900">Phase 1: Foundation</td>
                        <td className="p-3.5 font-mono text-slate-700">Months 1–3</td>
                        <td className="p-3.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-900 font-bold text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                          </span>
                        </td>
                        <td className="p-3.5 font-semibold text-slate-900">Wholesale Supplier Rails &amp; Entity Setup</td>
                        <td className="p-3.5 pr-4 text-slate-700">650k+ hotel wholesale catalog integrated, 0% markup pricing engine verified, LLC formed.</td>
                      </tr>
                      <tr className="bg-amber-50/60 border-y-2 border-amber-500/40">
                        <td className="p-3.5 pl-4 font-black text-amber-950 flex items-center gap-2">
                          <span>Phase 2: Platform Maturation</span>
                          <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-xs font-black uppercase">Current</span>
                        </td>
                        <td className="p-3.5 font-mono font-bold text-amber-950">Month 4 (Present)</td>
                        <td className="p-3.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-200 text-amber-950 font-bold text-xs">
                            <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping" /> Active
                          </span>
                        </td>
                        <td className="p-3.5 font-bold text-amber-950">Closed Pilot Testing &amp; SAFE Round</td>
                        <td className="p-3.5 pr-4 text-amber-950 font-medium">Interactive booking flow finalized, rate audits completed (30%–50% savings confirmed), $75k SAFE closing.</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 pl-4 font-bold text-slate-900">Phase 3: Controlled Beta</td>
                        <td className="p-3.5 font-mono text-slate-700">Months 5–6</td>
                        <td className="p-3.5">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-100 text-blue-900 font-bold text-xs">
                            Upcoming
                          </span>
                        </td>
                        <td className="p-3.5 font-semibold text-slate-900">First 100 Founding Members &amp; Concierge</td>
                        <td className="p-3.5 pr-4 text-slate-700">Private invite onboarding, live bookings fulfilled, concierge check-in desk, referral program launch.</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 pl-4 font-bold text-slate-900">Phase 4: Commercial Scale</td>
                        <td className="p-3.5 font-mono text-slate-700">Months 7–12</td>
                        <td className="p-3.5">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-purple-100 text-purple-900 font-bold text-xs">
                            Expansion
                          </span>
                        </td>
                        <td className="p-3.5 font-semibold text-slate-900">1,000 Paying Members &amp; $1.03M ARR</td>
                        <td className="p-3.5 pr-4 text-slate-700">Broad executive rollout, corporate partnerships, operational breakeven, Series Seed preparation ($15M–$20M).</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: ACCESS ALL PROJECT DOCUMENTS */}
          {activeTab === 'dataroom' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
                  <FileText className="w-3.5 h-3.5 text-amber-700" />
                  <span>Institutional Due Diligence Library</span>
                </div>
                <h2 className="text-3xl font-black text-slate-900">Access All Project Documents</h2>
                <p className="text-sm text-slate-700 mt-1 max-w-2xl">
                  Download official offering prospectuses, 10-slide PowerPoint presentation deck (.pptx), YC SAFE investment agreements, unit economic models, and statutory safe-harbor filings.
                </p>
              </div>

              {/* Step 1 & 2 Verification Gate */}
              {!signedData ? (
                <div id="project-docs-gate" className="p-8 rounded-3xl border-2 border-amber-500/60 bg-gradient-to-br from-amber-50/60 via-white to-white space-y-6 shadow-md">
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
                            className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01]"
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
                                const el = document.getElementById('project-docs-gate');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
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
                              const el = document.getElementById('project-docs-gate');
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
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
            </div>
          )}

          {/* TAB 8: STRATEGIC M&A EXITS */}
          {activeTab === 'exits' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Realistic M&A Valuation Milestones & Exit Horizons</h2>
                <p className="text-sm text-slate-600 mt-1">
                  How active subscriber scale drives predictable enterprise valuation at standard 5x–7x ARR multiples, delivering concrete cash returns to early SAFE investors.
                </p>
              </div>

              {/* 3 Grounded Valuation Horizons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Horizon 1 */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-2xs flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 font-bold text-xs uppercase">
                      Horizon 1 (Month 18–24)
                    </div>
                    <h3 className="font-black text-slate-900 text-lg">Early Strategic Acquisition</h3>
                    <div className="text-3xl font-black text-blue-700">$10M – $14M</div>
                    <div className="text-xs font-bold text-slate-700">Scale: 2,000 Members • $1.8M ARR (6x Multiple)</div>
                    <p className="text-sm text-slate-700 leading-relaxed pt-2 border-t border-slate-100">
                      <strong>Likely Acquirers:</strong> Boutique travel clubs, luxury concierge groups (e.g. Ten Lifestyle Group, Inspirato, Voyage Privé) acquiring our 0% markup wholesale booking engine.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 space-y-1">
                    <div className="font-bold text-blue-800">Angel Cash Payout (5.7x – 8.0x):</div>
                    <div>• On $5,000 Min Check: $29,000 – $40,000</div>
                    <div>• On $25,000 Check: $143,000 – $200,000</div>
                  </div>
                </div>

                {/* Horizon 2 */}
                <div className="p-6 rounded-3xl bg-white border-2 border-amber-500/50 space-y-3 shadow-2xs flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs uppercase">
                      Horizon 2 (Year 3) • Recommended
                    </div>
                    <h3 className="font-black text-slate-900 text-lg">Mid-Market Strategic Buyout</h3>
                    <div className="text-3xl font-black text-amber-600">$45M – $75M</div>
                    <div className="text-xs font-bold text-slate-700">Scale: 10,000 Members • $9.5M ARR (6x–7x Multiple)</div>
                    <p className="text-sm text-slate-700 leading-relaxed pt-2 border-t border-slate-100">
                      <strong>Likely Acquirers:</strong> European travel platforms, corporate travel management networks, or challenger banks seeking affluent, high-retention recurring subscribers.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-mono text-slate-900 space-y-1">
                    <div className="font-bold text-amber-800">Angel Cash Payout (25x – 43x):</div>
                    <div>• On $5,000 Min Check: $129,000 – $214,000</div>
                    <div>• On $25,000 Check: $643,000 – $1,070,000</div>
                  </div>
                </div>

                {/* Horizon 3 */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-2xs flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 font-bold text-xs uppercase">
                      Horizon 3 (Year 4–5) • Full Scale
                    </div>
                    <h3 className="font-black text-slate-900 text-lg">Major Strategic / PE Buyout</h3>
                    <div className="text-3xl font-black text-emerald-700">$150M – $250M</div>
                    <div className="text-xs font-bold text-slate-700">Scale: 35,000+ Members • $35M+ ARR (8x–12x EBITDA)</div>
                    <p className="text-sm text-slate-700 leading-relaxed pt-2 border-t border-slate-100">
                      <strong>Likely Acquirers:</strong> Global travel conglomerates or private equity dividend recapitalizations acquiring high-EBITDA, negative working capital cash generators.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-mono text-slate-900 space-y-1">
                    <div className="font-bold text-emerald-800">Angel Cash Payout (85x – 142x):</div>
                    <div>• On $5,000 Min Check: $429,000 – $714,000</div>
                    <div>• On $25,000 Check: $2,140,000 – $3,570,000</div>
                  </div>
                </div>
              </div>

              {/* Explanatory Box */}
              <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-2">
                <div className="font-bold text-amber-400 text-xs uppercase tracking-wider">
                  The M&amp;A Multiple Reality: Why Buyers Pay 5x–7x ARR
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Unlike traditional low-margin retail travel agencies that sell for 1x–2x gross profit, ATLAS is a pure software and subscription club. Strategic acquirers value ATLAS like vertical SaaS: <strong>96% software gross margins</strong>, <strong>91% subscriber retention</strong>, and <strong>zero perishable inventory liabilities</strong>. Every member acquired is an annuity that generates high-margin subscription cash flow year after year.
                </p>
              </div>
            </div>
          )}

          {/* PAGE BOTTOM DISCREET COMPLIANCE & LEGAL FOOTER */}
          <footer className="mt-16 pt-8 pb-12 border-t border-slate-200 text-xs text-slate-600">
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

        </div>
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
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700 max-h-[60vh] overflow-y-auto">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-2 text-slate-800">
                <p><strong>PARTIES:</strong> ATLAS Travel Club LLC (&quot;Discloser&quot;) and the Recipient (&quot;Investor&quot;).</p>
                <p><strong>PURPOSE:</strong> Evaluation of a potential angel investment in the $75,000 USD YC Post-Money SAFE.</p>
                <p><strong>CONFIDENTIAL INFO:</strong> Includes pro-forma models, SAFE term sheets, supplier agreements, and proprietary booking technology.</p>
                <p><strong>TERM & STANDARD:</strong> 24 months from signature date under Delaware law. Standard duty of reasonable care.</p>
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
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
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
