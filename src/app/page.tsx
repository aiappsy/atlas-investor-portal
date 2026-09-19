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
  const [activeTab, setActiveTab] = useState<'teaser' | 'returns' | 'trust' | 'arbitrage' | 'economics' | 'budget' | 'dataroom' | 'exits' | 'legal'>('teaser');

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

  // Load Session from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('atlas_investor_session_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.signatureHash) {
          setSignedData(parsed);
          setEmail(parsed.email || '');
          setIsEmailVerified(true);
        }
      }
    } catch (e) {
      console.error('Session load error:', e);
    }
  }, []);

  // Step 1: Send Verification OTP
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setVerifyError('Please enter a valid institutional or personal email address.');
      return;
    }
    setVerifyError(null);
    setIsSendingCode(true);

    try {
      const res = await fetch('/api/investors/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), action: 'send' })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setCodeSent(true);
        if (data.demoCode) {
          setDemoCodeHint(data.demoCode);
        }
      } else {
        setVerifyError(data.error || 'Failed to dispatch verification code.');
      }
    } catch (err) {
      setVerifyError('Network error dispatching verification code.');
    } finally {
      setIsSendingCode(false);
    }
  };

  // Step 1B: Verify OTP
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError(null);
    setIsVerifyingCode(true);

    try {
      const res = await fetch('/api/investors/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), action: 'verify', code: verificationCode.trim() })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsEmailVerified(true);
        setShowNdaModal(true);
      } else {
        setVerifyError(data.error || 'Invalid 6-digit verification code. Please retry.');
      }
    } catch (err) {
      setVerifyError('Network error verifying code.');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  // Step 2: Sign Digital NDA
  const handleSignNda = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !ndaAgreed) return;

    setIsSigning(true);
    try {
      const res = await fetch('/api/investors/sign-nda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          firmName: firmName.trim(),
          agreedTerms: true,
          eSignConsent: true
        })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        const rec = data.signature || data.record;
        setSignedData(rec);
        localStorage.setItem('atlas_investor_session_v2', JSON.stringify(rec));
        setShowNdaModal(false);
      } else {
        alert(data.error || 'Failed to execute digital NDA.');
      }
    } catch (err) {
      alert('Network error executing NDA.');
    } finally {
      setIsSigning(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('atlas_investor_session_v2');
    setSignedData(null);
    setIsEmailVerified(false);
    setCodeSent(false);
    setVerificationCode('');
    setEmail('');
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
            <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Investment Brief
            </div>
          )}

          <nav className="space-y-1">
            {[
              { id: 'teaser', label: 'Executive Thesis', icon: Award },
              { id: 'returns', label: "What's In It For You", icon: HandCoins, highlight: true },
              { id: 'trust', label: 'Trust & Governance', icon: ShieldCheck, highlight: true },
              { id: 'arbitrage', label: 'The Savings Engine', icon: Sparkles },
              { id: 'economics', label: 'Unit Economics', icon: TrendingUp },
              { id: 'budget', label: '$75k Capital Plan', icon: DollarSign },
              { 
                id: 'dataroom', 
                label: 'Confidential Data Room', 
                icon: FileText, 
                badge: signedData ? 'Unlocked' : 'Locked' 
              },
              { id: 'exits', label: 'Strategic M&A Exits', icon: Building2 },
              { id: 'legal', label: 'Statutory Compliance', icon: Scale },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer group ${
                    isActive 
                      ? 'bg-slate-900 text-white shadow-xs' 
                      : item.highlight 
                        ? 'text-amber-950 bg-amber-50/60 hover:bg-amber-100/80 border border-amber-200/50' 
                        : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${
                    isActive 
                      ? 'text-amber-400' 
                      : item.highlight 
                        ? 'text-amber-600' 
                        : 'text-slate-400 group-hover:text-slate-700'
                  }`} />
                  {!sidebarCollapsed && (
                    <span className="truncate flex-1">{item.label}</span>
                  )}
                  {!sidebarCollapsed && item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      item.badge === 'Unlocked' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-slate-100 text-slate-500'
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
        <div className="p-4 border-t border-slate-100 bg-slate-50/70">
          {signedData ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {!sidebarCollapsed && (
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">
                    Institutional Access
                  </span>
                )}
              </div>
              {!sidebarCollapsed && (
                <div className="text-xs text-slate-600">
                  <div className="font-semibold text-slate-900 truncate">{signedData.fullName}</div>
                  <div className="text-[10px] text-slate-500 truncate">{signedData.email}</div>
                  <button
                    onClick={handleLogout}
                    className="text-[10px] text-rose-600 hover:underline mt-1 block cursor-pointer"
                  >
                    Clear Credentials
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                {!sidebarCollapsed && (
                  <span className="text-[11px] font-bold text-amber-900">
                    Confidential Tier
                  </span>
                )}
              </div>
              {!sidebarCollapsed && (
                <p className="text-[10px] text-slate-500 leading-tight">
                  Verify email and sign digital NDA to inspect SAFE and pro-forma documents.
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
              href="mailto:executive@atlas-travel-club.com?subject=ATLAS%20SAFE%20Investment%20Inquiry"
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
              { id: 'teaser', label: 'Executive Thesis' },
              { id: 'returns', label: "What's In It For You" },
              { id: 'trust', label: 'Trust & Governance' },
              { id: 'arbitrage', label: 'The Savings Engine' },
              { id: 'economics', label: 'Unit Economics' },
              { id: 'budget', label: '$75k Capital Plan' },
              { id: 'dataroom', label: 'Confidential Data Room' },
              { id: 'exits', label: 'Strategic M&A Exits' },
              { id: 'legal', label: 'Statutory Compliance' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                  activeTab === item.id ? 'bg-slate-900 text-white' : 'text-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* Content View Area */}
        <div className="p-6 sm:p-10 max-w-5xl w-full mx-auto space-y-10">

          {/* TAB 1: EXECUTIVE TEASER */}
          {activeTab === 'teaser' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Hero Banner */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200/80">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Confidential Angel Brief • $75,000 Pre-Seed Round • $1.75M Post-Money Cap • $5,000 Min Check</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.15]">
                  Invest in the Next-Gen Travel App Delivering <span className="text-amber-600">30% to 50%</span> Direct Wholesale Savings on Everyday Hotel Stays.
                </h1>

                <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-3xl">
                  ATLAS connects frequent travelers directly to institutional B2B hotel wholesale rates behind a verified, password-gated membership. While public booking platforms add 25% to 40% in retail markups, our members save <strong>30% to 50% on everyday 4-star and 5-star hotel stays</strong>—saving <strong>$300 to $600+ on a single trip</strong> and over <strong>$1,200+ per year</strong> at 0% markup. We monetize through predictable <strong>96% gross margin subscription software ARR</strong> and high-ticket card payment interchange.
                </p>
              </div>

              {/* Deal Card Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-2xs space-y-1">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Round & Min Check</div>
                  <div className="text-2xl font-black text-slate-900">$75,000</div>
                  <div className="text-[11px] text-amber-600 font-bold">$5,000 Min Check (YC SAFE)</div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-2xs space-y-1">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Valuation Cap</div>
                  <div className="text-2xl font-black text-slate-900">$1.75M</div>
                  <div className="text-[11px] text-emerald-700 font-bold">~4.3% Ownership Cap</div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-2xs space-y-1">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Avg. Member Savings</div>
                  <div className="text-2xl font-black text-slate-900">$1,235 / yr</div>
                  <div className="text-[11px] text-emerald-700 font-bold">30%–50% Direct Wholesale Savings</div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-2xs space-y-1">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Member Payback</div>
                  <div className="text-2xl font-black text-emerald-700">Trip #1 – #2</div>
                  <div className="text-[11px] text-slate-500">38.4x LTV:CAC • 91% Retention</div>
                </div>
              </div>

              {/* CORE HIGHLIGHT BOX: TRUST & WHAT'S IN IT FOR YOU */}
              <div className="p-6 sm:p-8 rounded-3xl border-2 border-amber-500/40 bg-linear-to-br from-amber-50/60 via-white to-slate-50 space-y-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200/60 pb-4">
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-widest text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
                      The Investor Covenant
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5">
                      Trust & What&apos;s In It For You (At a Glance)
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('returns')}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
                    >
                      <HandCoins className="w-3.5 h-3.5 text-amber-400" />
                      <span>Full Return Model</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('trust')}
                      className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Trust Framework</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed">
                  {/* Pillar 1: What's In It For You */}
                  <div className="space-y-3 bg-white p-5 rounded-2xl border border-amber-200/70 shadow-2xs">
                    <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                      <HandCoins className="w-4 h-4 text-amber-600" />
                      <span>1. What&apos;s In It For You (Your Real Return)</span>
                    </div>
                    <ul className="space-y-2 text-[11px]">
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>10x–15x Seed Markup Target:</strong> Reach 1,000 members ($1M+ ARR) in 12–15 months to price Series Seed at $15M–$20M valuation.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>34x–100x M&A Cash Payout:</strong> Strategic buyout scenarios ($60M–$175M) return $171k–$500k on a $5k min check ($857k–$2.5M on a $25k check).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Immediate Lifestyle ROI:</strong> Lifetime Sovereign VIP Club membership ($1,799/yr waived forever) saving $1,500+ on every personal vacation.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Pillar 2: Why You Can Trust Us */}
                  <div className="space-y-3 bg-white p-5 rounded-2xl border border-emerald-200/70 shadow-2xs">
                    <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>2. Why You Can Trust Us (Capital Preservation)</span>
                    </div>
                    <ul className="space-y-2 text-[11px]">
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>$0 Inventory Liabilities:</strong> Negative working capital cycle means we never prepay room blocks or lease villas. Your check cannot be burned on room vacancies.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Founder Frugality & Alignment:</strong> Founder draws a modest $2,500/mo stipend. C-Corp conversion flexibility preserves Section 1202 QSBS ($10M tax-free capital gains).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Working Production Code:</strong> Live operational booking platform, automated price-drop rebooking algorithms, and direct wholesale supplier inventory connections already built.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* The High-Asymmetry Investment Thesis */}
              <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 bg-slate-50/70 space-y-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Why This Is an Asymmetric Pre-Seed Bet</h3>
                  <p className="text-xs text-slate-500 mt-1">Why retail markups fail and why our 0% markup wholesale subscription model scales.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-slate-600 leading-relaxed">
                  <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 font-black text-sm">1</div>
                    <div className="font-bold text-slate-900 text-sm">Zero Inventory Liabilities</div>
                    <p>
                      We hold <strong>zero inventory risk</strong> and $0 in hotel room blocks. Members pay us upfront upon booking; wholesale bedbanks are settled post-checkout via synchronous card rails. We generate cash float without balance sheet debt.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-800 font-black text-sm">2</div>
                    <div className="font-bold text-slate-900 text-sm">Direct Wholesale Savings Engine</div>
                    <p>
                      By passing 100% of B2B wholesale rates directly to members at <strong>0% retail markup</strong>, members save $1,200 to $1,800+ per stay. The irresistible savings proposition creates immediate word-of-mouth, driving CAC down to $110.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-black text-sm">3</div>
                    <div className="font-bold text-slate-900 text-sm">Day-1 Payback & 91% Retention</div>
                    <p>
                      A member saving $1,400 on a 5-night stay covers their annual membership on their very first booking with $600+ in pure net profit. Churn is economically irrational when leaving the club means forfeiting thousands in annual savings.
                    </p>
                  </div>
                </div>
              </div>

              {/* WHERE WE ARE TODAY: DEVELOPMENT PHASES & TIMESCALE */}
              <div className="p-6 sm:p-8 rounded-3xl border-2 border-slate-200 bg-white space-y-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 font-bold text-[11px] uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      Current Milestone: Phase 2 Active
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                      Where We Are Today: Phases of Development &amp; Rollout Timescale
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Our commercialization trajectory from wholesale supplier connectivity to private pilot testing and continental scale.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-xs">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>Timescale: Month 4 (You Are Here)</span>
                    </div>
                  </div>
                </div>

                {/* Overall Timescale Progress Bar */}
                <div className="space-y-2 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/70">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] font-bold text-slate-700">
                    <span className="text-emerald-700">✓ Phase 1: Foundation (Months 1–3)</span>
                    <span className="text-amber-800 font-black">● Phase 2: Pilot &amp; Maturation (Month 4 • Current)</span>
                    <span className="text-slate-500">○ Phase 3: Beta (Months 5–6)</span>
                    <span className="text-slate-400">○ Phase 4: 1,000 Members (Months 7–12)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
                    <div className="h-full bg-emerald-500" style={{ width: '25%' }} title="Phase 1: 100% Completed" />
                    <div className="h-full bg-amber-500 animate-pulse" style={{ width: '15%' }} title="Phase 2: In Progress (You Are Here)" />
                    <div className="h-full bg-slate-200" style={{ width: '60%' }} />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px] text-slate-500 pt-0.5">
                    <span>Wholesale Inventory &amp; Legal Entity Setup</span>
                    <span className="font-bold text-amber-800">Platform Built • $75,000 SAFE Open</span>
                    <span>100 Founding Members &amp; Concierge</span>
                    <span>$1.03M ARR • Series Seed Target</span>
                  </div>
                </div>

                {/* 4 Phase Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Phase 1 */}
                  <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                          Phase 1 • Months 1–3
                        </span>
                        <span className="text-emerald-700 text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm">Wholesale Connectivity &amp; Foundation</h3>
                      <ul className="text-[11px] text-slate-600 space-y-1.5 pt-1">
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold shrink-0">✓</span>
                          <span>Direct supplier access established across 650,000+ global hotels.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold shrink-0">✓</span>
                          <span>Proprietary zero-markup price discovery engine finalized.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold shrink-0">✓</span>
                          <span>Manager-Managed LLC corporate governance registered.</span>
                        </li>
                      </ul>
                    </div>
                    <div className="text-[10px] font-semibold text-slate-500 pt-2 border-t border-slate-200/60">
                      Outcome: Zero inventory liability model validated.
                    </div>
                  </div>

                  {/* Phase 2 (CURRENT) */}
                  <div className="p-5 rounded-2xl bg-amber-50/40 border-2 border-amber-500/60 shadow-xs flex flex-col justify-between space-y-3 relative">
                    <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-black text-[9px] uppercase tracking-wider shadow-xs">
                      You Are Here
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded-md">
                          Phase 2 • Month 4 (Present)
                        </span>
                        <span className="text-amber-700 text-xs font-bold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" /> Active
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm">Platform Maturation &amp; Closed Pilot</h3>
                      <ul className="text-[11px] text-slate-700 space-y-1.5 pt-1">
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold shrink-0">✓</span>
                          <span>Complete member search, booking, and checkout experience operational.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold shrink-0">✓</span>
                          <span>Real-world price audits completed, proving 30%–50% actual savings.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-amber-700 font-bold shrink-0">●</span>
                          <span>$75,000 SAFE round open ($5k min ticket) for pre-launch buffer.</span>
                        </li>
                      </ul>
                    </div>
                    <div className="text-[10px] font-semibold text-amber-900 pt-2 border-t border-amber-200/70">
                      Outcome: Platform operational &amp; diligence unlocked.
                    </div>
                  </div>

                  {/* Phase 3 */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-blue-800 bg-blue-100/80 px-2 py-0.5 rounded-md">
                          Phase 3 • Months 5–6
                        </span>
                        <span className="text-slate-400 text-xs font-semibold">Upcoming</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm">Controlled Beta &amp; 100 Members</h3>
                      <ul className="text-[11px] text-slate-600 space-y-1.5 pt-1">
                        <li className="flex items-start gap-1.5">
                          <span className="text-slate-400 font-bold shrink-0">○</span>
                          <span>Invite-only onboarding of first 100 private founding members.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-slate-400 font-bold shrink-0">○</span>
                          <span>Live hotel bookings executed with dedicated VIP concierge support.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-slate-400 font-bold shrink-0">○</span>
                          <span>Activation of member referral mechanics and savings testimonials.</span>
                        </li>
                      </ul>
                    </div>
                    <div className="text-[10px] font-semibold text-slate-500 pt-2 border-t border-slate-200/60">
                      Target: 100 members • High NPS &amp; viral retention.
                    </div>
                  </div>

                  {/* Phase 4 */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-purple-800 bg-purple-100/80 px-2 py-0.5 rounded-md">
                          Phase 4 • Months 7–12
                        </span>
                        <span className="text-slate-400 text-xs font-semibold">Expansion</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm">Scale to 1,000 Members ($1M ARR)</h3>
                      <ul className="text-[11px] text-slate-600 space-y-1.5 pt-1">
                        <li className="flex items-start gap-1.5">
                          <span className="text-slate-400 font-bold shrink-0">○</span>
                          <span>Commercial rollout across key European and US business hubs.</span>
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
                    <div className="text-[10px] font-semibold text-purple-900 pt-2 border-t border-slate-200/60">
                      Target: $1.03M ARR • 10x–12x paper markup.
                    </div>
                  </div>
                </div>
              </div>

              {/* Gated Access Callout */}
              <div className="p-6 sm:p-8 rounded-3xl border-2 border-amber-500/30 bg-amber-50/40 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 justify-center sm:justify-start">
                    <FileText className="w-4 h-4 text-amber-600" />
                    <span>Confidential Due Diligence Data Room</span>
                  </h3>
                  <p className="text-xs text-slate-600 max-w-xl">
                    Detailed 10-slide Institutional Pitch Deck, YC SAFE Agreement, 5-Year Financial Model, and Legal Memorandums are available to qualified angel investors under digital NDA.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('dataroom');
                    if (!isEmailVerified) {
                      // Navigate to data room to verify email
                    } else if (!signedData) {
                      setShowNdaModal(true);
                    }
                  }}
                  className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0 shadow-xs cursor-pointer flex items-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{signedData ? 'Access Data Room' : 'Verify & Unlock Data Room'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: WHAT'S IN IT FOR YOU (RETURNS CALCULATOR) */}
          {activeTab === 'returns' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-black text-slate-900">What&apos;s In It For You: Real Financial & Lifestyle ROI</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Concrete scenarios, mathematical returns, and tangible perks for angel investors in the $75,000 SAFE round.
                </p>
              </div>

              {/* Interactive Check Return Calculator */}
              <div className="p-6 sm:p-8 rounded-3xl border-2 border-amber-500/40 bg-white space-y-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Select Investment Check Size:</div>
                    <div className="text-[11px] text-slate-500">Valuation Cap: $1,750,000 USD (YC Post-Money SAFE) • Min. Check: $5,000</div>
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
                            ? 'bg-slate-900 text-white shadow-xs' 
                            : 'bg-white hover:bg-slate-200/70 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic Return Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Implied Equity Cap</div>
                    <div className="text-2xl font-black text-slate-900">~{equityPct}%</div>
                    <div className="text-[10px] text-slate-500">Pre-dilution ownership</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Seed Round Markup (12–15 Mos)</div>
                    <div className="text-2xl font-black text-amber-600">${Math.round(seedValLow / 1000)}k–${Math.round(seedValHigh / 1000)}k</div>
                    <div className="text-[10px] text-emerald-700 font-bold">8.6x – 11.4x Paper Markup</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Mid-Market M&A (Yr 3 @ $60M)</div>
                    <div className="text-2xl font-black text-emerald-700">{exitYr3 >= 1000000 ? `$${(exitYr3 / 1000000).toFixed(2)}M` : `$${Math.round(exitYr3 / 1000)}k`}</div>
                    <div className="text-[10px] text-emerald-700 font-bold">~34.3x Cash Return</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Scale Buyout (Yr 4–5 @ $175M)</div>
                    <div className="text-2xl font-black text-purple-700">{exitYr4 >= 1000000 ? `$${(exitYr4 / 1000000).toFixed(2)}M` : `$${Math.round(exitYr4 / 1000)}k`}</div>
                    <div className="text-[10px] text-purple-700 font-bold">~100x Cash Return</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-bold">Alternative Cash Dividend Yield (Schedule K-1):</span> If retained as a high-EBITDA private cash cow, Year 3 projected EBITDA of $13.1M yields ~<strong>${Math.round(dividendYr3 / 1000)}k / year in passive cash distributions</strong> on your ${selectedCheck.toLocaleString()} check ({Math.round((dividendYr3 / selectedCheck) * 100)}% annual cash yield).
                  </div>
                </div>
              </div>

              {/* 3 Exit Scenarios Detailed */}
              <div className="space-y-4">
                <h3 className="font-black text-slate-900 text-base">The 3 Distinct Paths to Liquidity</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-slate-600 leading-relaxed">
                  <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-2xs">
                    <div className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span>Path A: Venture Institutional Seed</span>
                    </div>
                    <p>
                      At 1,000 active paying members ($1.0M+ ARR), ATLAS raises an institutional Series Seed at a <strong>$15M–$20M valuation</strong>. Angel investors in this SAFE convert into preferred shares with an immediate <strong>10x–12x paper gain</strong>, with secondary liquidity options at Series A.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-2xs">
                    <div className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-amber-600" />
                      <span>Path B: Strategic FinTech/Card M&A</span>
                    </div>
                    <p>
                      Banks and card issuers (Amex, Capital One, Chase, Revolut) pay top dollar for high-spend consumer travel volume. Capital One paid <strong>$297M for Velocity Black</strong> to capture card spend. An acquisition at $79M–$538M returns <strong>45x to 307x cash on invested capital</strong>.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-2xs">
                    <div className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                      <Landmark className="w-4 h-4 text-emerald-600" />
                      <span>Path C: Private Equity Dividend Cash Cow</span>
                    </div>
                    <p>
                      Because ATLAS holds zero inventory risk and achieves 96% gross margins, the business generates enormous positive free cash flow. In lieu of selling, ATLAS can distribute quarterly cash dividends yielding <strong>over 100% of your initial check per year</strong> by Year 4.
                    </p>
                  </div>
                </div>
              </div>

              {/* Investor Lifestyle Perks */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white space-y-4">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Gift className="w-4 h-4 text-amber-400" />
                  <span>Immediate Lifestyle Return (Investor Club Privileges)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                    <div className="font-bold text-white text-sm">Lifetime Sovereign Tier</div>
                    <p>Full annual membership ($1,799/yr) waived permanently for you and your spouse.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                    <div className="font-bold text-white text-sm">Personal VIP Desk</div>
                    <p>Direct WhatsApp access to Founder Pål Juritzen for custom hotel procurement & upgrades.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                    <div className="font-bold text-white text-sm">Annual Founder Retreat</div>
                    <p>Exclusive invitation to our annual private investor briefing at a partnered 5-star property.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TRUST & GOVERNANCE */}
          {activeTab === 'trust' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-black text-slate-900">The 5 Pillars of Investor Trust & Governance</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Why you can invest with absolute confidence: zero balance sheet risk, founder frugality, and live production code.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    num: '1',
                    title: 'Zero Perishable Inventory Liability (Zero Balance Sheet Risk)',
                    desc: 'ATLAS is a pure technology and membership platform. We never buy room blocks in advance, we never lease private jets, and we never sign minimum guarantee commitments with hotels. If 0 rooms are booked tomorrow, our financial liability is exactly $0.00. Your investment capital is never burned on unsold hotel inventory.',
                    badge: 'Zero Risk Architecture',
                    color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  },
                  {
                    num: '2',
                    title: 'Founder Frugality & Uncompromised Alignment',
                    desc: 'Founder Pål Juritzen is dedicating 100% full-time commitment and taking a modest, strictly capped stipend of only $2,500/month for 10 months. There are zero inflated executive salaries, zero corporate luxury leases, and zero frivolous spending. The YC Post-Money SAFE gives investors seniority in liquidation ahead of common units.',
                    badge: 'Fiduciary Alignment',
                    color: 'text-blue-700 bg-blue-50 border-blue-200'
                  },
                  {
                    num: '3',
                    title: 'Live Operational Platform (Not Pitch Deck Vaporware)',
                    desc: 'Unlike early-stage founders raising on conceptual wireframes or mockups, ATLAS is an operational, fully deployed digital platform. Secure member authentication, automated zero-markup hotel price discovery across global wholesale inventories, instant reservation processing, and automated rate-drop audit engines are already developed, tested, and running live today.',
                    badge: 'De-risked Product',
                    color: 'text-purple-700 bg-purple-50 border-purple-200'
                  },
                  {
                    num: '4',
                    title: 'Monthly Transparent KPI Reporting & Schedule K-1 Tax Packs',
                    desc: 'Every participating investor receives a monthly dashboard on the 1st of every month detailing ARR, active member count, blended CAC, gross margin, cash burn, and remaining runway. Full annual Schedule K-1 tax packages are provided during the LLC phase, with optional Section 1202 QSBS tax-free capital gain treatment upon corporate conversion.',
                    badge: 'Governance & Auditing',
                    color: 'text-amber-800 bg-amber-50 border-amber-200'
                  },
                  {
                    num: '5',
                    title: 'Delaware / Wyoming Legal Entity & Regulatory Fortification',
                    desc: 'Organized under Delaware and Wyoming Manager-Managed Limited Liability Company statutes. Fully compliant with SEC Rule 506(c) Regulation D, the federal E-SIGN Act (15 U.S.C. § 7001), California CST #2154890, Florida ST, and the EU Digital Markets Act / Norwegian Travel Guarantee Fund (RGF).',
                    badge: 'Regulatory Compliance',
                    color: 'text-slate-800 bg-slate-100 border-slate-200'
                  }
                ].map((pillar) => (
                  <div key={pillar.num} className="p-6 rounded-3xl border border-slate-200 bg-white shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shrink-0">
                          {pillar.num}
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">{pillar.title}</h3>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border shrink-0 ${pillar.color}`}>
                        {pillar.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pl-11">{pillar.desc}</p>
                  </div>
                ))}
              </div>

              <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-bold text-amber-950 text-sm">Have Specific Diligence or Governance Questions?</div>
                  <div className="text-xs text-amber-800">We offer direct 1-on-1 calls with founder Pål Juritzen and our legal counsel.</div>
                </div>
                <a
                  href="mailto:executive@atlas-travel-club.com?subject=ATLAS%20Investor%20Governance%20Call"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shrink-0 shadow-xs"
                >
                  Schedule Founder Diligence
                </a>
              </div>
            </div>
          )}

          {/* TAB 4: THE SAVINGS ENGINE */}
          {activeTab === 'arbitrage' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-black text-slate-900">The Wholesale Savings Engine: 0% Markup Wholesale</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Why hotels release wholesale inventory at 30%–50% discounts, and how common, everyday hotel stays save members hundreds of dollars per booking.
                </p>
              </div>

              {/* Real-World Travel Scenario Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <div>
                  <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Select Common Hotel Scenario:</div>
                  <div className="text-[11px] text-slate-500">Everyday 4-star & upscale hotels ($240–$260/night) vs. public retail travel sites.</div>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {[
                    { id: 'city', label: '🏙️ 4-Night City Break ($240/nt)' },
                    { id: 'vacation', label: '🏖️ 7-Night Family Vacation ($260/nt)' },
                    { id: 'annual', label: '✈️ Annual 3-Trip Total ($1,235 Saved)' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setExampleTrip(tab.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                        exampleTrip === tab.id 
                          ? 'bg-slate-900 text-white shadow-xs' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visual Side-by-Side Savings Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed">
                {/* Public Channel */}
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-[11px]">
                    The Public Retail Booking Channel
                  </div>
                  <h3 className="font-black text-slate-900 text-base">Inflated Markups & Zero Cash Savings</h3>
                  <div className="space-y-2.5">
                    <p>
                      <strong>1. Built-in Retail Markups:</strong> Public online travel sites add massive 25% to 40% markups on top of hotel room rates to fund multi-billion-dollar Google search bidding wars.
                    </p>
                    <p>
                      <strong>2. The Perishable Inventory Trap:</strong> Hotels experience 30%+ average vacancy on any given night. Unsold rooms expire worthless at midnight, but hotels cannot discount publicly without debasing their published brand rack rates.
                    </p>
                    <p>
                      <strong>3. Zero Traveler Return:</strong> Travelers pay full retail prices on every single vacation, leaving hundreds of dollars on the table on every trip with zero loyalty return.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-slate-200 font-mono text-[11px] text-slate-700 space-y-1.5">
                    <div className="text-[10px] uppercase font-bold text-slate-500">{activeScenario.title}</div>
                    <div className="text-[10px] text-slate-400">{activeScenario.subtitle}</div>
                    <div className="flex justify-between border-b border-slate-100 pt-1 pb-1">
                      <span>Public Retail Room Rate:</span>
                      <span className="font-bold">${activeScenario.publicNightly} / night</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                      <span>Total Retail Booking ({activeScenario.nights} Nights):</span>
                      <span className="font-bold">${activeScenario.publicTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1 text-rose-600 font-semibold">
                      <span>Retail Markup & Distribution Fees:</span>
                      <span>+${activeScenario.otaMarkup} included</span>
                    </div>
                    <div className="flex justify-between pt-1 text-slate-900 font-black">
                      <span>Traveler Net Savings:</span>
                      <span className="text-rose-600">$0.00 Saved</span>
                    </div>
                  </div>
                </div>

                {/* ATLAS Wholesale Engine */}
                <div className="p-6 rounded-3xl bg-amber-50/50 border border-amber-200/80 space-y-4 text-amber-950">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                    The ATLAS Wholesale Savings Engine
                  </div>
                  <h3 className="font-black text-amber-950 text-base">Direct 0% Markup Wholesale Pass-Through</h3>
                  <div className="space-y-2.5">
                    <p>
                      <strong>1. Raw B2B Liquidity:</strong> Hotels quietly release their surplus unbooked rooms into private B2B wholesale bedbanks at true net clearing rates—often 30% to 45% below public retail.
                    </p>
                    <p>
                      <strong>2. 100% of Savings Passed Directly:</strong> ATLAS connects members directly to these institutional wholesale pools with <strong>0% retail markup</strong>. Every single dollar of wholesale discount stays in the member&apos;s pocket.
                    </p>
                    <p>
                      <strong>3. Rapid Payback:</strong> In this common scenario, the member saves <strong>+${activeScenario.savings.toLocaleString()} in cash</strong>. {activeScenario.paybackNote}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-amber-200 font-mono text-[11px] text-slate-900 space-y-1.5">
                    <div className="text-[10px] uppercase font-bold text-amber-700">Same Stay via ATLAS Wholesale</div>
                    <div className="text-[10px] text-slate-500">{activeScenario.subtitle}</div>
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
                      <span>ATLAS Annual Club Membership:</span>
                      <span>-$799 / yr</span>
                    </div>
                    <div className="flex justify-between pt-1 text-emerald-700 font-black text-xs">
                      <span>Member ROI:</span>
                      <span>{activeScenario.paybackNote}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* The Unstoppable Flywheel Callout */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white space-y-3">
                <div className="font-bold text-amber-400 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Why Common Pricing Drives Unstoppable Retention</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  You don&apos;t need $1,000/night luxury suites to make the unit economics work. When a member saves <strong>$320 on a simple 4-day city break</strong> and <strong>$595 on their family summer holiday</strong>, they have pocketed over <strong>$1,200 in net annual cash savings</strong> on ordinary, common hotel stays. The $799 membership fee is easily recouped, churn drops to <strong>9%</strong> (91% annual retention), and word-of-mouth keeps blended customer acquisition costs at just <strong>$110</strong>. ATLAS captures high-margin recurring software ARR with zero inventory liabilities.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: UNIT ECONOMICS & MODEL */}
          {activeTab === 'economics' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Predictable Recurring Unit Economics & 5-Year Pro-Forma</h2>
                <p className="text-xs text-slate-500 mt-1">High-margin software subscriptions coupled with secondary FinTech payment interchange yield.</p>
              </div>

              {/* 4 Revenue Engines */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">1. Subscription ARR</div>
                  <div className="text-2xl font-black text-slate-900">$684 / yr</div>
                  <div className="text-[11px] text-emerald-700 font-semibold">96% Software Gross Margin</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">2. Card Interchange</div>
                  <div className="text-2xl font-black text-slate-900">$342 / yr</div>
                  <div className="text-[11px] text-slate-600 font-semibold">1.85% on $18.5k card spend</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">3. Price-Drop Arbitrage</div>
                  <div className="text-2xl font-black text-slate-900">30% Fee</div>
                  <div className="text-[11px] text-slate-600 font-semibold">Share of auto-rebooked savings</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">4. Customer Payback</div>
                  <div className="text-2xl font-black text-emerald-700">Day 1</div>
                  <div className="text-[11px] text-emerald-700 font-semibold">$110 CAC • 38.4x LTV:CAC</div>
                </div>
              </div>

              {/* 5-Year Pro-Forma Summary Table */}
              <div className="border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-2xs">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">5-Year Financial & Member Scale Model</h3>
                  <span className="text-[11px] text-slate-500 font-medium">USD in Millions except ARPU</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                        <th className="p-3.5 pl-6">Metric</th>
                        <th className="p-3.5">Year 1</th>
                        <th className="p-3.5">Year 2</th>
                        <th className="p-3.5">Year 3</th>
                        <th className="p-3.5">Year 4</th>
                        <th className="p-3.5 pr-6">Year 5</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                      <tr>
                        <td className="p-3.5 pl-6 font-semibold text-slate-900">Active Paying Members</td>
                        <td className="p-3.5 font-mono">1,004</td>
                        <td className="p-3.5 font-mono">4,850</td>
                        <td className="p-3.5 font-mono">22,000</td>
                        <td className="p-3.5 font-mono">65,000</td>
                        <td className="p-3.5 pr-6 font-mono font-bold text-slate-900">140,000</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 pl-6 font-semibold text-slate-900">Subscription ARR ($)</td>
                        <td className="p-3.5 font-mono">$687k</td>
                        <td className="p-3.5 font-mono">$3.32M</td>
                        <td className="p-3.5 font-mono">$15.05M</td>
                        <td className="p-3.5 font-mono">$44.46M</td>
                        <td className="p-3.5 pr-6 font-mono font-bold text-slate-900">$95.76M</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 pl-6 font-semibold text-slate-900">Payment Interchange Yield ($)</td>
                        <td className="p-3.5 font-mono">$343k</td>
                        <td className="p-3.5 font-mono">$1.66M</td>
                        <td className="p-3.5 font-mono">$7.53M</td>
                        <td className="p-3.5 font-mono">$22.24M</td>
                        <td className="p-3.5 pr-6 font-mono font-bold text-slate-900">$47.91M</td>
                      </tr>
                      <tr className="bg-amber-50/40 font-bold text-amber-950">
                        <td className="p-3.5 pl-6">Total Net Revenue ($)</td>
                        <td className="p-3.5 font-mono">$1.03M</td>
                        <td className="p-3.5 font-mono">$4.98M</td>
                        <td className="p-3.5 font-mono">$22.58M</td>
                        <td className="p-3.5 font-mono">$66.70M</td>
                        <td className="p-3.5 pr-6 font-mono text-base">$143.67M</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 pl-6">Gross Margin (%)</td>
                        <td className="p-3.5 font-mono">92.4%</td>
                        <td className="p-3.5 font-mono">94.8%</td>
                        <td className="p-3.5 font-mono">96.2%</td>
                        <td className="p-3.5 font-mono">96.8%</td>
                        <td className="p-3.5 pr-6 font-mono font-bold">97.1%</td>
                      </tr>
                      <tr className="bg-emerald-50/40 font-bold text-emerald-900">
                        <td className="p-3.5 pl-6">EBITDA ($)</td>
                        <td className="p-3.5 font-mono">$0.28M</td>
                        <td className="p-3.5 font-mono">$2.41M</td>
                        <td className="p-3.5 font-mono">$13.13M</td>
                        <td className="p-3.5 font-mono">$44.80M</td>
                        <td className="p-3.5 pr-6 font-mono text-base text-emerald-700">$102.40M</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: $75K CAPITAL ALLOCATION BUDGET */}
          {activeTab === 'budget' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Strict Capital Allocation: The $75,000 Runway Plan</h2>
                <p className="text-xs text-slate-500 mt-1">10-Month Lean Runway to achieve 1,000 members and $1.03M ARR milestone.</p>
              </div>

              {/* Budget Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-2xs">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">1. Founder Execution Stipend</div>
                  <div className="text-3xl font-black text-slate-900">$25,000</div>
                  <div className="text-xs text-slate-500 font-semibold">33.3% of total raise</div>
                  <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                    $2,500/month for 10 months for Founder Pål Juritzen. Frugal, transparent living stipend allowing 100% full-time commitment without corporate distraction.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-2xs">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">2. Dev Contractor Sprints</div>
                  <div className="text-3xl font-black text-slate-900">$18,000</div>
                  <div className="text-xs text-slate-500 font-semibold">24.0% of total raise</div>
                  <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                    Contract platform engineering sprints for synchronous wholesale supplier reconciliation, card payment processing, and automated reservation management engines.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-2xs">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">3. Member Acquisition & Ops</div>
                  <div className="text-3xl font-black text-slate-900">$32,000</div>
                  <div className="text-xs text-slate-500 font-semibold">42.7% of total raise</div>
                  <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                    High-converting direct executive outreach ($15k), high-availability cloud hosting & data security ($5k), corporate legal compliance & travel regulatory filings ($6k), and working capital reserve ($6k).
                  </p>
                </div>
              </div>

              {/* DETAILED 10-MONTH TIMESCALE & MILESTONE EXECUTION SCHEDULE */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 space-y-6 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Commercial Rollout Timescale &amp; Milestones</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      How the $75,000 SAFE proceeds systematically unlock each milestone from current pilot testing to cash-flow breakeven.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs">
                      Current: Month 4
                    </span>
                    <span className="px-3 py-1 rounded-full bg-slate-900 text-white font-bold text-xs">
                      Runway: 10 Months
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] bg-slate-50/80">
                        <th className="p-3.5 pl-4">Phase</th>
                        <th className="p-3.5">Timescale</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5">Core Operational Focus</th>
                        <th className="p-3.5 pr-4">Target Deliverables &amp; Milestones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr className="bg-slate-50/40">
                        <td className="p-3.5 pl-4 font-bold text-slate-900">Phase 1: Foundation</td>
                        <td className="p-3.5 font-mono text-slate-600">Months 1–3</td>
                        <td className="p-3.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            <CheckCircle2 className="w-3 h-3" /> Completed
                          </span>
                        </td>
                        <td className="p-3.5">Wholesale Supplier Rails &amp; Entity Setup</td>
                        <td className="p-3.5 pr-4 text-slate-600">650k+ hotel wholesale catalog integrated, 0% markup pricing engine verified, LLC formed.</td>
                      </tr>
                      <tr className="bg-amber-50/50 border-y-2 border-amber-500/40">
                        <td className="p-3.5 pl-4 font-black text-amber-950 flex items-center gap-2">
                          <span>Phase 2: Platform Maturation</span>
                          <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-black uppercase">You Are Here</span>
                        </td>
                        <td className="p-3.5 font-mono font-bold text-amber-900">Month 4 (Present)</td>
                        <td className="p-3.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 font-bold text-[10px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping" /> Active
                          </span>
                        </td>
                        <td className="p-3.5 font-semibold text-amber-950">Closed Pilot Testing &amp; SAFE Round</td>
                        <td className="p-3.5 pr-4 text-amber-950">Interactive booking flow finalized, rate audits completed (30%–50% savings confirmed), $75k SAFE closing.</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 pl-4 font-bold text-slate-900">Phase 3: Controlled Beta</td>
                        <td className="p-3.5 font-mono text-slate-600">Months 5–6</td>
                        <td className="p-3.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold text-[10px]">
                            Upcoming
                          </span>
                        </td>
                        <td className="p-3.5">First 100 Founding Members &amp; Concierge</td>
                        <td className="p-3.5 pr-4 text-slate-600">Private invite onboarding, live bookings fulfilled, concierge check-in desk, referral program launch.</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 pl-4 font-bold text-slate-900">Phase 4: Commercial Scale</td>
                        <td className="p-3.5 font-mono text-slate-600">Months 7–12</td>
                        <td className="p-3.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-bold text-[10px]">
                            Expansion
                          </span>
                        </td>
                        <td className="p-3.5">1,000 Paying Members &amp; $1.03M ARR</td>
                        <td className="p-3.5 pr-4 text-slate-600">Broad executive rollout, corporate partnerships, operational breakeven, Series Seed preparation ($15M–$20M).</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: CONFIDENTIAL DATA ROOM */}
          {activeTab === 'dataroom' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Confidential Due Diligence Data Room</h2>
                <p className="text-xs text-slate-500 mt-1">Official offering documents, financial models, YC SAFE agreements, and statutory compliance briefs.</p>
              </div>

              {/* Step 1 & 2 Verification Gate */}
              {!signedData ? (
                <div className="p-8 rounded-3xl border-2 border-amber-500/50 bg-white space-y-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900">Institutional Access Gate</h3>
                      <p className="text-xs text-slate-500">Access requires verified institutional email and a digitally recorded NDA.</p>
                    </div>
                  </div>

                  {!isEmailVerified ? (
                    <div className="space-y-4 max-w-md">
                      {!codeSent ? (
                        <form onSubmit={handleSendCode} className="space-y-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Institutional Email Address</label>
                            <input
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="investor@familyoffice.com"
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                            />
                          </div>
                          {verifyError && (
                            <div className="text-xs text-rose-600 font-semibold flex items-center gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>{verifyError}</span>
                            </div>
                          )}
                          <button
                            type="submit"
                            disabled={isSendingCode}
                            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                          >
                            {isSendingCode ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4 text-amber-400" />}
                            <span>Send 6-Digit Access Code</span>
                          </button>
                        </form>
                      ) : (
                        <form onSubmit={handleVerifyCode} className="space-y-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Enter 6-Digit Verification Code sent to <span className="text-amber-700">{email}</span>
                            </label>
                            <input
                              type="text"
                              required
                              maxLength={6}
                              value={verificationCode}
                              onChange={(e) => setVerificationCode(e.target.value)}
                              placeholder="654321"
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-center tracking-widest text-lg font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                            />
                            {demoCodeHint && (
                              <div className="mt-1.5 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold flex items-center justify-between">
                                <span>Demo Fast-Pass OTP: <strong>{demoCodeHint}</strong></span>
                                <button
                                  type="button"
                                  onClick={() => setVerificationCode(demoCodeHint)}
                                  className="text-[10px] underline font-bold cursor-pointer"
                                >
                                  Auto-Fill
                                </button>
                              </div>
                            )}
                          </div>
                          {verifyError && (
                            <div className="text-xs text-rose-600 font-semibold flex items-center gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>{verifyError}</span>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setCodeSent(false)}
                              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                            >
                              Back
                            </button>
                            <button
                              type="submit"
                              disabled={isVerifyingCode}
                              className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                            >
                              {isVerifyingCode ? <RefreshCw className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4 text-amber-400" />}
                              <span>Verify & Proceed to NDA</span>
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Email verified ({email}). Step 2: Review and execute the mutual confidentiality agreement.</span>
                      </div>
                      <button
                        onClick={() => setShowNdaModal(true)}
                        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center gap-2"
                      >
                        <FileCheck className="w-4 h-4" />
                        <span>Execute Digital NDA Now</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* NDA Verified Banner */
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">
                        NDA Executed by {signedData.fullName} {signedData.firmName ? `(${signedData.firmName})` : ''}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Hash: {signedData.signatureHash.slice(0, 18)}... • Recorded {signedData.signedAt.slice(0, 10)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={copySignatureHash}
                      className="px-3 py-1.5 rounded-lg bg-white border border-emerald-200 text-emerald-800 text-[11px] font-semibold hover:bg-emerald-100 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {copiedHash ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedHash ? 'Copied Hash' : 'Copy Hash'}</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 text-[11px] font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              )}

              {/* Documents Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                          {doc.category}
                        </span>
                        {signedData ? (
                          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>Authorized</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                            <Lock className="w-3 h-3 text-slate-400" />
                            <span>NDA Required</span>
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-slate-900 text-base">{doc.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{doc.desc}</p>

                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Key Provisions:</div>
                        <ul className="text-[11px] text-slate-600 space-y-1">
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
                        className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>Interactive Preview</span>
                      </button>

                      {signedData ? (
                        <div className="flex items-center gap-1.5">
                          {doc.id === 'deck' && (
                            <a
                              href="/docs/investors/ATLAS_Investor_Pitch_Deck.pptx"
                              download
                              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                              title="Download PowerPoint Presentation (.pptx)"
                            >
                              <Download className="w-3.5 h-3.5 text-slate-950" />
                              <span>PPTX</span>
                            </a>
                          )}
                          <a
                            href={doc.file}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                          >
                            <Download className="w-3.5 h-3.5 text-amber-400" />
                            <span>PDF</span>
                          </a>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          {doc.id === 'deck' && (
                            <button
                              onClick={() => {
                                if (!isEmailVerified) alert('Please verify your email address first.');
                                else setShowNdaModal(true);
                              }}
                              className="px-3 py-2 rounded-xl bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                              title="Execute NDA to download PPTX"
                            >
                              <Lock className="w-3.5 h-3.5" />
                              <span>PPTX</span>
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (!isEmailVerified) alert('Please verify your email address first.');
                              else setShowNdaModal(true);
                            }}
                            className="px-3 py-2 rounded-xl bg-slate-200 text-slate-500 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                            title="Execute NDA to download PDF"
                          >
                            <Lock className="w-3.5 h-3.5" />
                            <span>PDF</span>
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
                <p className="text-xs text-slate-500 mt-1">
                  How active subscriber scale drives predictable enterprise valuation at standard 5x–7x ARR multiples, delivering concrete cash returns to early SAFE investors.
                </p>
              </div>

              {/* 3 Grounded Valuation Horizons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Horizon 1 */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-2xs flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 font-bold text-[10px] uppercase">
                      Horizon 1 (Month 18–24)
                    </div>
                    <h3 className="font-black text-slate-900 text-base">Early Tuck-In Acquisition</h3>
                    <div className="text-2xl font-black text-blue-700">$10M – $14M</div>
                    <div className="text-[11px] font-semibold text-slate-500">Scale: 2,000 Members • $1.8M ARR (6x Multiple)</div>
                    <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                      <strong>Likely Acquirers:</strong> Boutique travel clubs, luxury concierge groups (e.g. Ten Lifestyle Group, Inspirato, Voyage Privé) acquiring our 0% markup wholesale software rails.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 space-y-1">
                    <div className="font-bold text-blue-700">Angel Cash Payout (5.7x – 8.0x):</div>
                    <div>• On $5,000 Min Check: $29k – $40k</div>
                    <div>• On $25,000 Check: $143k – $200k</div>
                  </div>
                </div>

                {/* Horizon 2 */}
                <div className="p-6 rounded-3xl bg-white border-2 border-amber-500/40 space-y-3 shadow-2xs flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] uppercase">
                      Horizon 2 (Year 3) • Recommended
                    </div>
                    <h3 className="font-black text-slate-900 text-base">Mid-Market Strategic Buyout</h3>
                    <div className="text-2xl font-black text-amber-600">$45M – $75M</div>
                    <div className="text-[11px] font-semibold text-slate-500">Scale: 10,000 Members • $9.5M ARR (6x–7x Multiple)</div>
                    <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                      <strong>Likely Acquirers:</strong> European travel platforms, corporate travel management networks, or challenger banks seeking affluent, high-retention recurring subscribers.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-mono text-slate-900 space-y-1">
                    <div className="font-bold text-amber-700">Angel Cash Payout (25x – 43x):</div>
                    <div>• On $5,000 Min Check: $129k – $214k</div>
                    <div>• On $25,000 Check: $643k – $1.07M</div>
                  </div>
                </div>

                {/* Horizon 3 */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-2xs flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[10px] uppercase">
                      Horizon 3 (Year 4–5) • Full Scale
                    </div>
                    <h3 className="font-black text-slate-900 text-base">Major Strategic / PE Buyout</h3>
                    <div className="text-2xl font-black text-emerald-700">$150M – $250M</div>
                    <div className="text-[11px] font-semibold text-slate-500">Scale: 35,000+ Members • $35M+ ARR (8x–12x EBITDA)</div>
                    <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                      <strong>Likely Acquirers:</strong> Global travel conglomerates or private equity dividend recapitalizations acquiring high-EBITDA, negative working capital cash generators.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-mono text-slate-900 space-y-1">
                    <div className="font-bold text-emerald-700">Angel Cash Payout (85x – 142x):</div>
                    <div>• On $5,000 Min Check: $429k – $714k</div>
                    <div>• On $25,000 Check: $2.14M – $3.57M</div>
                  </div>
                </div>
              </div>

              {/* Explanatory Box */}
              <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-2">
                <div className="font-bold text-amber-400 text-xs uppercase tracking-wider">
                  The M&amp;A Multiple Reality: Why Buyers Pay 5x–7x ARR
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Unlike traditional low-margin retail travel agencies that sell for 1x–2x gross profit, ATLAS is a pure software and subscription club. Strategic acquirers value ATLAS like vertical SaaS: <strong>96% software gross margins</strong>, <strong>91% subscriber retention</strong>, and <strong>zero perishable inventory liabilities</strong>. Every member acquired is an annuity that generates high-margin subscription cash flow year after year.
                </p>
              </div>
            </div>
          )}

          {/* TAB 9: STATUTORY COMPLIANCE & LEGAL MEMOS */}
          {activeTab === 'legal' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Statutory Legal Framework & Jurisdiction Protections</h2>
                <p className="text-xs text-slate-500 mt-1">Full compliance across US federal laws, EU Digital Markets Act, and Norwegian Travel Guarantee statutes.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Closed-Loop Safe Harbor Memorandum',
                    reg: 'US Sherman Act § 1 & EU Regulation 2022/1925 (DMA)',
                    desc: 'Formal legal brief confirming that password-gated, paid member syndicates fall squarely outside retail rate parity prohibitions.',
                    href: '/legal/rate-parity-compliance'
                  },
                  {
                    title: 'SEC Regulation D Rule 506(c) Compliance',
                    reg: 'Securities Act of 1933 (15 U.S.C. § 77a et seq.)',
                    desc: 'Private offering safe harbor memorandum for accredited angel investor verification and digital subscription mechanics.',
                    href: '/legal/sec-compliance'
                  },
                  {
                    title: 'Wholesale Bedbank & Merchant Master Terms',
                    reg: 'IATA / Merchant Settlement Standards',
                    desc: 'Independent contractor terms for wholesale bedbanks, airlines, CRS check-in parity, and force majeure.',
                    href: '/legal/commercial-terms'
                  },
                  {
                    title: 'Norwegian RGF & EU Package Travel Compliance',
                    reg: 'Norwegian Travel Guarantee Act & EU Directive 2015/2302',
                    desc: 'Escrow account protections, Reisegarantifondet (RGF) bonding requirements, and cross-border consumer safeguards.',
                    href: '/legal/norwegian-rgf'
                  }
                ].map((memo, idx) => (
                  <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{memo.reg}</div>
                      <h3 className="font-bold text-slate-900 text-base">{memo.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{memo.desc}</p>
                    </div>
                    <Link
                      href={memo.href}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 transition-colors pt-3 border-t border-slate-100"
                    >
                      <span>Read Legal Opinion</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                <h3 className="font-bold text-slate-900 text-base">Digital Mutual Non-Disclosure Agreement</h3>
              </div>
              <button
                onClick={() => setShowNdaModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-600 max-h-[60vh] overflow-y-auto">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] space-y-2 text-slate-700">
                <p><strong>PARTIES:</strong> ATLAS Travel Club LLC (&quot;Discloser&quot;) and the Recipient (&quot;Investor&quot;).</p>
                <p><strong>PURPOSE:</strong> Evaluation of a potential angel investment in the $75,000 USD YC Post-Money SAFE.</p>
                <p><strong>CONFIDENTIAL INFO:</strong> Includes pro-forma models, SAFE term sheets, supplier bedbank contracts, rate algorithms, and proprietary architecture.</p>
                <p><strong>TERM & STANDARD:</strong> 24 months from signature date under Delaware law. Standard reasonable care.</p>
              </div>

              <form onSubmit={handleSignNda} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Firm / Family Office (Optional)</label>
                  <input
                    type="text"
                    value={firmName}
                    onChange={(e) => setFirmName(e.target.value)}
                    placeholder="Acme Capital / Family Office"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/40"
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
                  <label htmlFor="nda-checkbox" className="text-[11px] text-slate-600 cursor-pointer">
                    I agree to the terms of this Mutual NDA and certify that I am an accredited investor evaluating ATLAS for legitimate investment purposes under E-SIGN Act standards.
                  </label>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowNdaModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSigning || !ndaAgreed || !fullName}
                    className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSigning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />}
                    <span>Sign Digitally & Unlock</span>
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
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/50">
                  {activeDocPreview.category}
                </span>
                <h3 className="font-bold text-slate-900 text-base">{activeDocPreview.title}</h3>
              </div>
              <button
                onClick={() => setActiveDocPreview(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs text-slate-600">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-xs">Document Abstract & Executive Summary</div>
                <p className="leading-relaxed">{activeDocPreview.desc}</p>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
                  Core Structural Provisions & Deliverables:
                </div>
                <div className="space-y-2">
                  {activeDocPreview.highlights.map((item: string, i: number) => (
                    <div key={i} className="p-3 rounded-xl bg-white border border-slate-200/80 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700 leading-relaxed font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {!signedData && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Full PDF download and raw annexes require digitally verified NDA credentials.</span>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => setActiveDocPreview(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer"
              >
                Close Preview
              </button>

              {signedData ? (
                <div className="flex items-center gap-2">
                  {activeDocPreview.id === 'deck' && (
                    <a
                      href="/docs/investors/ATLAS_Investor_Pitch_Deck.pptx"
                      download
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-950" />
                      <span>Download PPTX (PowerPoint)</span>
                    </a>
                  )}
                  <a
                    href={activeDocPreview.file}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
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
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
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
