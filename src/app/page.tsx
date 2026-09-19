'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, Lock, Download, FileText, CheckCircle2, 
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
  const [selectedCheck, setSelectedCheck] = useState<10000 | 25000 | 75000>(25000);

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

      if (res.ok && data.verified) {
        setIsEmailVerified(true);
        setDemoCodeHint(null);
        setShowNdaModal(true);
      } else {
        setVerifyError(data.error || 'Invalid or expired verification code.');
      }
    } catch (err) {
      setVerifyError('Network error during verification.');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  // Step 2: Sign Mutual NDA & Record SHA-256
  const handleSignNda = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      alert('Please enter your full legal name.');
      return;
    }
    if (!ndaAgreed) {
      alert('You must accept the terms of the Mutual Non-Disclosure Agreement.');
      return;
    }

    setIsSigning(true);
    try {
      const res = await fetch('/api/investors/sign-nda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          firmName: firmName.trim(),
          eSignConsent: true
        })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSignedData(data.signature);
        localStorage.setItem('atlas_investor_session_v2', JSON.stringify(data.signature));
        setShowNdaModal(false);
        setActiveTab('dataroom');
      } else {
        alert(data.error || 'Could not record digital signature.');
      }
    } catch (err) {
      alert('Network error recording signature.');
    } finally {
      setIsSigning(false);
    }
  };

  const handleResetSession = () => {
    if (confirm('Lock confidential data room and reset verified session?')) {
      localStorage.removeItem('atlas_investor_session_v2');
      setSignedData(null);
      setIsEmailVerified(false);
      setCodeSent(false);
      setVerificationCode('');
      setDemoCodeHint(null);
      setActiveTab('teaser');
    }
  };

  const copyHash = () => {
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
  const exitYr3 = selectedCheck * (79100000 / cap);
  const exitYr4 = selectedCheck * (537600000 / cap);
  const dividendYr3 = 13130000 * (selectedCheck / cap);

  const documents = [
    {
      id: 'deck',
      title: '10-Slide Institutional Presentation',
      category: 'Strategic Pitch Deck',
      file: '/docs/investors/ATLAS_Investor_Pitch_Deck.pdf',
      desc: 'Disintermediating the $1.4T booking duopoly, capturing 96% SaaS gross margins & 1.85% interchange, trust architecture, and the $75k SAFE angel opportunity.',
      highlights: [
        'Closed-Loop Clearinghouse: 100% wholesale net savings passed at 0% markup under Sherman Act § 1 & EU DMA safe harbors.',
        'High-Yield Segments: Affluent Families (45%), Executives & SMB Founders (30%), Remote Execs (15%), VIPs (10%).',
        'Unit Economics: $1,026 blended ARPU, $110 CAC, 38.4x LTV:CAC, Day-1 payback.',
        'The Deal: $75,000 raise on a $1.75M Post-Money SAFE (~4.3% equity at cap) targeting a 10x-15x Series Seed markup.'
      ]
    },
    {
      id: 'prospectus',
      title: 'Confidential Offering Prospectus (PPM)',
      category: 'Private Placement Memorandum',
      file: '/docs/investors/ATLAS_Confidential_Prospectus.pdf',
      desc: '10-section institutional memorandum, 5-year pro-forma income statement, zero-deposit balance sheet architecture, investor trust safeguards, and legal safe harbor brief.',
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
        'Target Financing: $75,000 USD (Min $50,000 | Max $100,000).',
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
        'Edge Compliance: Google Cloud Armor WAF mitigating bots and enforcing noindex rate parity shields.'
      ]
    },
    {
      id: 'faq',
      title: 'Investor Due Diligence FAQ & Risk Brief',
      category: 'Due Diligence & Compliance',
      desc: 'Pre-empts rate parity legal precedent (Sherman Act, EU DMA), account-sharing controls, CRS check-in parity, and operational risk.',
      file: '/docs/investors/ATLAS_Due_Diligence_FAQ.pdf',
      highlights: [
        'Rate Parity Antitrust: US Sherman Act 15 U.S.C. § 1 & EU DMA exempt closed-loop buyer syndicates.',
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
    <div className="bg-white text-slate-900 min-h-screen flex antialiased selection:bg-amber-100 selection:text-amber-900">
      
      {/* 1. COLLAPSIBLE PERMANENT SIDEBAR */}
      <aside 
        className={`bg-slate-50/70 border-r border-slate-200/80 transition-all duration-300 ease-in-out shrink-0 flex flex-col justify-between h-screen sticky top-0 z-30 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        } hidden md:flex`}
      >
        <div className="p-4 space-y-6">
          {/* Logo & Collapse Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                A
              </div>
              {!sidebarCollapsed && (
                <div className="truncate">
                  <div className="font-mono text-xs font-black tracking-tight text-slate-900">ATLAS CAPITAL</div>
                  <div className="text-[10px] text-slate-500 font-medium">Investor Portal</div>
                </div>
              )}
            </div>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
              title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {sidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {[
              { id: 'teaser', label: 'Executive Thesis', icon: Award },
              { id: 'returns', label: "What's In It For You", icon: HandCoins, highlight: true },
              { id: 'trust', label: 'Trust & Governance', icon: ShieldCheck, highlight: true },
              { id: 'arbitrage', label: 'Structural Arbitrage', icon: Layers },
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
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold tracking-tight uppercase ${
                      signedData 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200/70 space-y-3">
          {!sidebarCollapsed ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${signedData ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span className="text-[11px] font-bold text-slate-700 truncate">
                  {signedData ? `Verified: ${signedData.fullName.split(' ')[0]}` : 'NDA Pending Verification'}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 leading-tight">
                Delaware / Wyoming LLC • SEC Rule 506(c) Safe Harbor
              </div>
              {signedData && (
                <button
                  onClick={handleResetSession}
                  className="text-[10px] text-rose-600 hover:underline pt-1 block cursor-pointer"
                >
                  Lock Session
                </button>
              )}
            </div>
          ) : (
            <div className="flex justify-center">
              <span className={`w-2.5 h-2.5 rounded-full ${signedData ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            </div>
          )}
        </div>
      </aside>

      {/* 2. MAIN APPLICATION WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="h-16 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 text-xs text-slate-500">
              <span className="font-semibold text-slate-900 hidden sm:inline">ATLAS Travel Club LLC</span>
              <ChevronRight className="w-3.5 h-3.5 hidden sm:inline text-slate-300" />
              <span className="font-medium capitalize text-slate-700">{activeTab.replace('-', ' ')}</span>
            </div>
          </div>

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
              { id: 'arbitrage', label: 'Structural Arbitrage' },
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
                  <span>Confidential Angel Brief • $75,000 Pre-Seed Round • $1.75M Post-Money Cap</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.15]">
                  The Private Travel Clearinghouse Disintermediating the <span className="text-amber-600">$1.4 Trillion</span> Booking Cartel.
                </h1>

                <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-3xl">
                  Booking Holdings and Expedia Group extract an extortionate <strong>18% to 30% duopoly tax</strong> on every hotel room booked worldwide, enforcing algorithmic rate parity across public search.
                  ATLAS is the private institutional clearinghouse. By utilizing statutory private-group antitrust exemptions under the <strong>US Sherman Act</strong> and the <strong>EU Digital Markets Act</strong>, ATLAS bypasses the duopoly toll—connecting affluent travelers directly to Tier-1 B2B wholesale liquidity pools at raw net clearing rates with <strong>0% retail markup</strong>.
                </p>
              </div>

              {/* Deal Card Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-2xs space-y-1">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Target Capital</div>
                  <div className="text-2xl font-black text-slate-900">$75,000</div>
                  <div className="text-[11px] text-amber-600 font-bold">YC Post-Money SAFE</div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-2xs space-y-1">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Valuation Cap</div>
                  <div className="text-2xl font-black text-slate-900">$1.75M</div>
                  <div className="text-[11px] text-emerald-700 font-bold">~4.3% Ownership Cap</div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-2xs space-y-1">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Blended ARPU</div>
                  <div className="text-2xl font-black text-slate-900">$1,026 / yr</div>
                  <div className="text-[11px] text-slate-600 font-semibold">96% Software Gross Margin</div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-2xs space-y-1">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">LTV / CAC Ratio</div>
                  <div className="text-2xl font-black text-emerald-700">38.4x</div>
                  <div className="text-[11px] text-slate-500">Day-1 Customer Payback</div>
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
                        <span><strong>45x–307x M&A Cash Payout:</strong> Strategic buyout scenarios ($79M–$538M) return $1.1M to $7.6M on a standard $25k angel check.</span>
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
                        <span><strong>Working Production Code:</strong> Live Google Cloud Run infrastructure, automated price-drop rebooking algorithms, and bedbank integrations already built.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* The High-Asymmetry Investment Thesis */}
              <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 bg-slate-50/70 space-y-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Why This Is an Asymmetric Pre-Seed Bet</h3>
                  <p className="text-xs text-slate-500 mt-1">Understanding why retail travel models fail and why our FinTech clearinghouse scales.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-slate-600 leading-relaxed">
                  <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 font-black text-sm">1</div>
                    <div className="font-bold text-slate-900 text-sm">Negative Working Capital</div>
                    <p>
                      We hold <strong>zero inventory risk</strong> and $0 in hotel room blocks. Members pay us upfront upon booking; wholesale bedbanks are settled post-checkout via synchronous card rails. We generate cash float without balance sheet debt.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-800 font-black text-sm">2</div>
                    <div className="font-bold text-slate-900 text-sm">The 4-Engine Flywheel</div>
                    <p>
                      We monetize through high-LTV subscription software ARR ($399–$1,799/yr), 1.85% debit interchange on high-ticket card spend ($18.5k avg spend = $342 yield), a 30% performance fee on automated price-drop rebooking, and 45 bps on FX spreads.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-black text-sm">3</div>
                    <div className="font-bold text-slate-900 text-sm">Day-1 Payback & 91% Retention</div>
                    <p>
                      A member saving $1,600 on a 5-night stay in Paris or Maui covers their annual fee on their very first booking with $900+ in pure net profit. Churn is economically irrational when leaving the club means paying a 25% penalty tax to Booking.com.
                    </p>
                  </div>
                </div>
              </div>

              {/* Gated Access Callout */}
              <div className="p-6 sm:p-8 rounded-3xl border-2 border-amber-500/30 bg-amber-50/40 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 justify-center sm:justify-start">
                    <Lock className="w-4 h-4 text-amber-600" />
                    <span>Confidential Due Diligence Repository & Term Sheet</span>
                  </h3>
                  <p className="text-xs text-slate-600 max-w-xl">
                    Detailed 5-year pro-forma financials, engineering manuals, M&A exit scenarios, and YC Post-Money SAFE documents are protected behind our 2-step verification gate.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('dataroom')}
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <span>{signedData ? 'Enter Data Room' : 'Verify Email & Sign NDA'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: WHAT'S IN IT FOR YOU (INTERACTIVE RETURN CALCULATOR) */}
          {activeTab === 'returns' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200">
                  <HandCoins className="w-3.5 h-3.5 text-amber-600" />
                  <span>The Investor Economics • What&apos;s In It For You</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                  Quantifying Your Return: Equity, Multiples & Cash Yield
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  How a pre-seed angel investment in ATLAS converts into asymmetrical capital appreciation, cash dividends, and lifestyle ROI.
                </p>
              </div>

              {/* Interactive Check Size Selector */}
              <div className="p-6 rounded-3xl border border-slate-200 bg-slate-50/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Select Investment Check Size:</div>
                    <div className="text-[11px] text-slate-500">Valuation Cap: $1,750,000 USD (YC Post-Money SAFE)</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {[
                      { amt: 10000, label: '$10,000 (Min Ticket)' },
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
                    <div className="text-[10px] uppercase font-bold text-slate-500">Base Case M&A (Yr 3 @ $79M)</div>
                    <div className="text-2xl font-black text-emerald-700">${(exitYr3 / 1000000).toFixed(2)}M</div>
                    <div className="text-[10px] text-emerald-700 font-bold">~45.2x Cash Return</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Growth Case M&A (Yr 4 @ $538M)</div>
                    <div className="text-2xl font-black text-purple-700">${(exitYr4 / 1000000).toFixed(2)}M</div>
                    <div className="text-[10px] text-purple-700 font-bold">~307x Cash Return</div>
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
                      <span>Path C: Permanent Private Cash Cow</span>
                    </div>
                    <p>
                      Because our model requires zero debt and negative working capital, ATLAS can remain a high-margin private entity distributing <strong>60%+ of annual EBITDA directly to SAFE holders</strong> via Schedule K-1 partnership dividends, paying back your principal multiple times every year.
                    </p>
                  </div>
                </div>
              </div>

              {/* Investor VIP Perks */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white space-y-4">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Gift className="w-4 h-4" />
                  <span>Immediate Lifestyle ROI: Angel Investor Perks Package</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                  Beyond financial returns, all participating angel investors receive immediate high-utility travel benefits:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                    <div className="font-bold text-amber-300">Lifetime Sovereign VIP</div>
                    <div className="text-slate-300 text-[11px]">The $1,799/yr membership fee is waived permanently for life. Access 0% markup wholesale rates anytime.</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                    <div className="font-bold text-amber-300">Founder Direct Concierge</div>
                    <div className="text-slate-300 text-[11px]">Direct WhatsApp channel with the founder for personal, corporate, and family 5-star travel arrangements.</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                    <div className="font-bold text-amber-300">Global 5G Data eSIM</div>
                    <div className="text-slate-300 text-[11px]">Complimentary international roaming eSIM data packages in 140+ countries on all your trips.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TRUST & GOVERNANCE (WHY YOUR CAPITAL IS SAFE) */}
          {activeTab === 'trust' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 text-xs font-bold border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Capital Preservation & Governance</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                  The 5 Pillars of Investor Trust
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  How we protect your capital, guarantee fiduciary transparency, and de-risk early-stage execution.
                </p>
              </div>

              {/* 5 Pillars Grid */}
              <div className="space-y-4">
                {[
                  {
                    num: '1',
                    title: 'Zero Balance Sheet Liability ($0 In Trapped Deposits)',
                    desc: 'Traditional travel agencies and vacation clubs fail because they commit to expensive hotel master leases or deposit $50k–$100k in non-refundable airline IATA guarantees. ATLAS operates a negative working capital cycle: members pay upfront via credit card; we settle with the wholesale bedbank synchronously upon booking or post-checkout. Your capital is never risked on perishable hotel room commitments.',
                    badge: 'Principal Protection',
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
                    title: 'Live Production Software (Not Pitch Deck Vaporware)',
                    desc: 'Unlike founders raising on mockups or ideas, ATLAS is a functioning, tested Next.js production platform running live on Google Cloud Run. Edge rate-parity bot protection, Cloud SQL PostgreSQL v16 architecture, Gemini 2.0 AI concierge functions, and B2B bedbank schemas are already built and operating.',
                    badge: 'De-risked Technology',
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

              {/* Direct Founder Access Guarantee */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-sm">Have Specific Diligence or Governance Questions?</div>
                  <div className="text-slate-500">Schedule a 20-minute 1-on-1 diligence session directly with Founder Pål Juritzen.</div>
                </div>
                <a
                  href="mailto:executive@atlas-travel-club.com?subject=Diligence%20Call%20Request%20-%20P%C3%A5l%20Juritzen"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shrink-0 text-center"
                >
                  Schedule Founder Diligence
                </a>
              </div>
            </div>
          )}

          {/* TAB 4: WHOLESALE ARBITRAGE THESIS */}
          {activeTab === 'arbitrage' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-black text-slate-900">The $350B Wholesale Rate Arbitrage & Antitrust Safe Harbor</h2>
                <p className="text-xs text-slate-500 mt-1">How closed-loop statutory exemptions unlock institutional wholesale distribution at 0% retail markup.</p>
              </div>

              {/* Visual Side-by-Side Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed">
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-[11px]">
                    The Broken Public Channel
                  </div>
                  <h3 className="font-black text-slate-900 text-base">The Booking.com / Expedia Tollbooth</h3>
                  <div className="space-y-2.5">
                    <p>
                      <strong>1. Predatory Duopoly:</strong> Booking Holdings & Expedia Group control over 70% of global online travel. They extract 18% to 30% take-rates on every transaction.
                    </p>
                    <p>
                      <strong>2. Extortionate Rate Parity:</strong> Hotels are contractually handcuffed by "Rate Parity" agreements forbidding them from publishing lower prices on open search channels under threat of algorithmic de-ranking.
                    </p>
                    <p>
                      <strong>3. The Perishable Asset Crisis:</strong> 5-star hotels suffer from 32% average vacancy. Unsold rooms expire worthless at midnight, but hotels cannot discount publicly without destroying their brand equity and violating parity.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-slate-200 font-mono text-[11px] text-slate-700 space-y-1">
                    <div>Public Listing: $600 / night ($3,000 for 5 nights)</div>
                    <div>OTA Commission (25%): <span className="text-rose-600 font-bold">-$750 extracted</span></div>
                    <div>Hotel Net Remittance: $2,250</div>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-amber-50/50 border border-amber-200/80 space-y-4 text-amber-950">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                    The ATLAS Private Clearinghouse
                  </div>
                  <h3 className="font-black text-amber-950 text-base">Closed-Loop Wholesale Pass-Through</h3>
                  <div className="space-y-2.5">
                    <p>
                      <strong>1. Statutory Antitrust Exemption:</strong> Under the <strong>US Sherman Antitrust Act (15 U.S.C. § 1)</strong> and the <strong>EU Digital Markets Act (Regulation EU 2022/1925)</strong>, rate parity rules do NOT apply to password-gated, closed-loop private buyer syndicates.
                    </p>
                    <p>
                      <strong>2. Tier-1 Liquidity Plumbing:</strong> Hotels quietly distribute surplus inventory to B2B global bedbanks (Hotelbeds, WebBeds, Travco) at net clearing rates.
                    </p>
                    <p>
                      <strong>3. 0% Retail Markup:</strong> ATLAS surfaces raw wholesale rates directly to verified members at zero markup. The hotel fills perishable capacity without brand damage.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-amber-200 font-mono text-[11px] text-slate-900 space-y-1">
                    <div>ATLAS Member Rate: $450 / night ($2,250 for 5 nights)</div>
                    <div>Member Instant Savings: <span className="text-emerald-700 font-bold">+$750 cash kept</span></div>
                    <div>ATLAS Monetization: Annual SaaS ARR + 1.85% Interchange</div>
                  </div>
                </div>
              </div>

              {/* The Legal Moat */}
              <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-3">
                <div className="font-bold text-amber-400 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>The Defensible Regulatory Moat</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Public OTAs cannot copy ATLAS without cannibalizing their own $30B+ commission business model and breaching hotel distribution agreements. Meanwhile, hoteliers actively welcome ATLAS because it clears distressed inventory discreetly behind a verified, paying membership wall without degrading their public luxury ADR (Average Daily Rate).
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

              {/* 5-Year Pro-Forma Table */}
              <div className="space-y-3">
                <div className="font-bold text-slate-900 text-sm">5-Year Institutional Pro-Forma Model (USD Millions)</div>
                <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-900 text-white font-bold text-[11px]">
                      <tr>
                        <th className="p-3.5">METRIC</th>
                        <th className="p-3.5">YEAR 1</th>
                        <th className="p-3.5">YEAR 2</th>
                        <th className="p-3.5">YEAR 3</th>
                        <th className="p-3.5">YEAR 4</th>
                        <th className="p-3.5">YEAR 5</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-sans font-semibold text-slate-900">Ending Active Members</td>
                        <td className="p-3">1,000</td>
                        <td className="p-3">5,500</td>
                        <td className="p-3">22,000</td>
                        <td className="p-3">65,000</td>
                        <td className="p-3">140,000</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-sans font-semibold text-slate-900">Gross Travel Booked (GMV)</td>
                        <td className="p-3">$18.5M</td>
                        <td className="p-3">$101.8M</td>
                        <td className="p-3">$407.0M</td>
                        <td className="p-3">$1,202.5M</td>
                        <td className="p-3">$2,590.0M</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-sans font-semibold text-slate-900">Subscription Net ARR (96% GM)</td>
                        <td className="p-3">$0.68M</td>
                        <td className="p-3">$3.76M</td>
                        <td className="p-3">$15.05M</td>
                        <td className="p-3">$44.46M</td>
                        <td className="p-3">$95.76M</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-sans font-semibold text-slate-900">FinTech Card Interchange (1.85%)</td>
                        <td className="p-3">$0.34M</td>
                        <td className="p-3">$1.88M</td>
                        <td className="p-3">$7.53M</td>
                        <td className="p-3">$22.25M</td>
                        <td className="p-3">$47.92M</td>
                      </tr>
                      <tr className="bg-amber-50/40 font-bold text-amber-950">
                        <td className="p-3 font-sans">TOTAL NET REVENUE</td>
                        <td className="p-3">$1.03M</td>
                        <td className="p-3">$5.64M</td>
                        <td className="p-3">$22.58M</td>
                        <td className="p-3">$66.71M</td>
                        <td className="p-3">$143.68M</td>
                      </tr>
                      <tr className="hover:bg-slate-50 text-slate-500">
                        <td className="p-3 font-sans font-semibold">Total Operating Expenses</td>
                        <td className="p-3">($0.58M)</td>
                        <td className="p-3">($2.82M)</td>
                        <td className="p-3">($9.45M)</td>
                        <td className="p-3">($21.95M)</td>
                        <td className="p-3">($41.70M)</td>
                      </tr>
                      <tr className="bg-slate-900 text-white font-bold">
                        <td className="p-3 font-sans">NET PROFIT (EBITDA)</td>
                        <td className="p-3 text-emerald-400">+$0.45M</td>
                        <td className="p-3 text-emerald-400">+$2.82M</td>
                        <td className="p-3 text-emerald-400">+$13.13M</td>
                        <td className="p-3 text-emerald-400">+$44.76M</td>
                        <td className="p-3 text-emerald-400">+$101.98M</td>
                      </tr>
                      <tr className="bg-slate-800 text-slate-300 font-bold text-[10px]">
                        <td className="p-2.5 font-sans">EBITDA Margin %</td>
                        <td className="p-2.5">43.7%</td>
                        <td className="p-2.5">50.0%</td>
                        <td className="p-2.5">58.2%</td>
                        <td className="p-2.5">67.1%</td>
                        <td className="p-2.5">71.0%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: USE OF PROCEEDS ($75k BUDGET) */}
          {activeTab === 'budget' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Capital Allocation & The $75,000 SAFE Opportunity</h2>
                <p className="text-xs text-slate-500 mt-1">Lean, capital-efficient execution funding founder runway and core B2B engineering.</p>
              </div>

              <div className="p-6 rounded-3xl bg-amber-50/50 border border-amber-200 text-xs text-amber-950 space-y-2">
                <div className="font-bold text-sm text-amber-900">Why $75,000 Achieves What Competitors Waste $2M On:</div>
                <p className="leading-relaxed">
                  Most travel startups burn millions attempting to negotiate individual hotel contracts, buy upfront room blocks, and maintain legacy IATA bank guarantees.
                  ATLAS operates 100% serverless on Google Cloud Run and settles transactions synchronously via real-time card authorization with B2B bedbanks (RateHawk, Hotelbeds, Duffel). We require <strong>$0 in locked supplier deposits</strong> and zero inventory risk. Every single dollar goes directly into product automation and founder execution.
                </p>
              </div>

              <div className="divide-y divide-slate-100 text-xs border border-slate-200 rounded-2xl overflow-hidden bg-white">
                {[
                  { name: 'Founder Executive Stipend', amt: '$25,000', pct: '33.3%', note: '$2,500/mo over 10 months for full-time dedicated founder leadership.' },
                  { name: 'Contract Engineering & Tech Ops', amt: '$18,000', pct: '24.0%', note: 'Direct API pipelines for live RateHawk & Duffel on Google Cloud Run.' },
                  { name: 'Member Acquisition Engine', amt: '$16,500', pct: '22.0%', note: 'Targeted executive syndicate outreach, "Savings Audit" marketing, creator seeds.' },
                  { name: 'Legal, SoT Licensing & Entity Setup', amt: '$6,500', pct: '8.7%', note: 'Delaware/Wyoming LLC formalization and Seller of Travel (FL/CA) compliance.' },
                  { name: 'Google Cloud & Vertex AI Tokens', amt: '$3,500', pct: '4.7%', note: '12 mos Cloud Run, Cloud SQL, Cloud Armor, and Gemini 2.0 API inference.' },
                  { name: 'Contingency Operating Buffer', amt: '$3,500', pct: '4.7%', note: 'Cash reserve guaranteeing 10–12 months of operational runway.' },
                  { name: 'Minimal Operating Float', amt: '$2,000', pct: '2.7%', note: 'Working float for instant card generation ($1,200) and eSIM stock ($800).' },
                ].map((row, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between gap-4 hover:bg-slate-50">
                    <div className="font-semibold text-slate-900">{row.name}</div>
                    <div className="hidden sm:block text-slate-500 text-[11px]">{row.note}</div>
                    <div className="text-right shrink-0">
                      <span className="font-bold text-slate-900">{row.amt}</span>
                      <span className="text-[11px] text-slate-400 ml-1.5 font-mono">({row.pct})</span>
                    </div>
                  </div>
                ))}
                <div className="p-4 flex items-center justify-between font-black text-sm text-slate-900 bg-slate-50">
                  <span>TOTAL PRE-SEED CAPITAL</span>
                  <span>$75,000 (100.0%)</span>
                </div>
              </div>

              {/* The Value Inflection */}
              <div className="p-5 rounded-2xl bg-slate-900 text-white text-xs space-y-2">
                <div className="font-bold text-amber-400 text-sm">Target Milestone & 10x-15x Value Inflection:</div>
                <p className="text-slate-300 leading-relaxed">
                  Funding this $75k SAFE takes ATLAS through Phase 2 to <strong>1,000 active paying members ($1.0M+ ARR)</strong>. At this milestone, the company is cash-flow positive and positioned for a Series Seed equity round at a $15M–$20M post-money valuation—representing a 10x to 12x paper markup for angel investors in this round within 12–15 months.
                </p>
              </div>
            </div>
          )}

          {/* TAB 7: CONFIDENTIAL DATA ROOM (MANDATORY 2-STEP GATE) */}
          {activeTab === 'dataroom' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Confidential Investor Data Room</h2>
                <p className="text-xs text-slate-500 mt-1">Review verified offering materials, technical architecture manuals, and legal term sheets.</p>
              </div>

              {/* 2-STEP ACCESS GATE (IF NOT SIGNED) */}
              {!signedData && (
                <div className="p-6 sm:p-8 rounded-3xl border-2 border-amber-500/40 bg-amber-50/30 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-base">Two-Step Institutional Verification Required</h3>
                      <p className="text-xs text-slate-600 mt-0.5">Please verify your accredited investor email address and digitally execute the Mutual Non-Disclosure Agreement to unlock documents.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Step 1 */}
                    <div className={`p-6 rounded-2xl border bg-white space-y-3 shadow-2xs ${
                      isEmailVerified ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">1</span>
                          Step 1: Email Verification
                        </span>
                        {isEmailVerified && (
                          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Verified
                          </span>
                        )}
                      </div>

                      {!isEmailVerified ? (
                        !codeSent ? (
                          <form onSubmit={handleSendCode} className="space-y-2.5">
                            <input
                              type="email"
                              required
                              placeholder="partner@venturefund.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500"
                            />
                            <button
                              type="submit"
                              disabled={isSendingCode}
                              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              {isSendingCode ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
                              <span>Send Verification Code</span>
                            </button>
                          </form>
                        ) : (
                          <form onSubmit={handleVerifyCode} className="space-y-2.5">
                            <div className="text-[11px] text-slate-500 flex justify-between">
                              <span>Code sent to {email}</span>
                              <button type="button" onClick={() => setCodeSent(false)} className="text-amber-600 underline font-semibold">Change</button>
                            </div>
                            <input
                              type="text"
                              required
                              maxLength={6}
                              placeholder="Enter 6-digit code"
                              value={verificationCode}
                              onChange={(e) => setVerificationCode(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-center font-mono text-sm tracking-widest focus:outline-none focus:border-amber-500"
                            />
                            {demoCodeHint && (
                              <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 text-center">
                                Development Code: <strong>{demoCodeHint}</strong> (or test: <strong>888999</strong>)
                              </div>
                            )}
                            <button
                              type="submit"
                              disabled={isVerifyingCode}
                              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              {isVerifyingCode ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <KeyRound className="w-3.5 h-3.5" />}
                              <span>Verify Code</span>
                            </button>
                          </form>
                        )
                      ) : (
                        <p className="text-xs text-emerald-800 font-semibold">
                          Authenticated as <strong>{email}</strong>. Ready for Step 2.
                        </p>
                      )}

                      {verifyError && <p className="text-[11px] text-rose-600 font-semibold">{verifyError}</p>}
                    </div>

                    {/* Step 2 */}
                    <div className={`p-6 rounded-2xl border bg-white flex flex-col justify-between shadow-2xs ${
                      !isEmailVerified ? 'opacity-50 border-slate-200' : 'border-slate-200'
                    }`}>
                      <div className="space-y-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">2</span>
                          Step 2: Mutual NDA Signature
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Bilateral non-disclosure agreement compliant with the US E-SIGN Act (15 U.S.C. § 7001), UETA, and EU eIDAS regulation. Logs IP address, user-agent, and SHA-256 hash.
                        </p>
                      </div>

                      <button
                        onClick={() => setShowNdaModal(true)}
                        disabled={!isEmailVerified}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer shadow-xs ${
                          isEmailVerified 
                            ? 'bg-slate-900 hover:bg-slate-800 text-white' 
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-400" />
                        <span>Execute Digital NDA</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* UNLOCKED DOCUMENT CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map((doc) => (
                  <div 
                    key={doc.id}
                    className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between space-y-4 shadow-2xs"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                          <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>{doc.title}</span>
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 shrink-0">
                          {doc.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{doc.desc}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <button
                        onClick={() => setActiveDocPreview(doc)}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>Highlights</span>
                      </button>

                      {signedData ? (
                        <a
                          href={doc.file}
                          download
                          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-amber-400" />
                          <span>Download PDF</span>
                        </a>
                      ) : (
                        <button
                          onClick={() => {
                            if (!isEmailVerified) alert('Please complete Step 1: Verify Email first.');
                            else setShowNdaModal(true);
                          }}
                          className="px-4 py-2 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Locked</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* OFFICIAL SIGNATURE CERTIFICATE (RENDERED ONCE SIGNED) */}
              {signedData && (
                <div className="p-6 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="font-bold flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>E-SIGN & eIDAS Execution Certificate (15 U.S.C. § 7001)</span>
                    </div>
                    <span className="text-[11px] text-emerald-700 font-mono">{new Date(signedData.signedAt).toLocaleString()}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-1">
                    <div>Signatory: <strong>{signedData.fullName}</strong></div>
                    <div>Email: <strong>{signedData.email}</strong></div>
                    <div>Entity: <strong>{signedData.firmName || 'Individual Angel'}</strong></div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-emerald-700 pt-2 border-t border-emerald-200/60">
                    <span className="truncate">Hash: {signedData.signatureHash}</span>
                    <button onClick={copyHash} className="ml-2 underline hover:text-emerald-950 cursor-pointer shrink-0 font-bold">
                      {copiedHash ? 'Copied!' : 'Copy Hash'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 8: M&A EXITS & MULTIPLES */}
          {activeTab === 'exits' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Strategic M&A Acquirer Landscape & Returns</h2>
                <p className="text-xs text-slate-500 mt-1">3 to 6-year exit horizons across 3 tier-1 strategic buyer categories.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                  <div className="font-bold text-slate-900 text-sm">1. Tier-1 Card Issuers</div>
                  <div className="text-[11px] text-amber-700 font-bold">American Express, Capital One, Chase</div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Precedent: Capital One acquired Velocity Black for $297 Million (2023); JPMorgan Chase acquired Frosch Travel and The Infatuation. Acquiring ATLAS gives card issuers a proprietary 0% wholesale booking engine driving high interchange volume.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                  <div className="font-bold text-slate-900 text-sm">2. Public OTAs & Portals</div>
                  <div className="text-[11px] text-blue-700 font-bold">Booking Holdings, Expedia, Tripadvisor</div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    OTAs spend billions annually bidding on Google search ads for one-off transactional users. Acquiring ATLAS provides an un-cancelable, high-margin SaaS subscription recurring revenue stream retaining the top 10% of high-net-worth travelers.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                  <div className="font-bold text-slate-900 text-sm">3. FinTech Super-Apps</div>
                  <div className="text-[11px] text-purple-700 font-bold">Revolut, Mercury, Brex, Ramp</div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    FinTech neobanks have millions of cardholders looking for high-utility lifestyle perks. ATLAS integrates directly into their membership tiers without requiring separate bedbank licensing.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                <div className="font-bold text-slate-900 text-sm">Target Investor Returns on $75k SAFE (~4.3% Equity at Cap):</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-white border border-slate-200">
                    <div className="text-slate-500 text-[11px]">Base Case M&A (Year 3)</div>
                    <div className="text-lg font-black text-slate-900 mt-1">$79.1M Valuation</div>
                    <div className="text-emerald-700 font-bold mt-0.5">~45x Return ($3.4M Payout)</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-slate-200">
                    <div className="text-slate-500 text-[11px]">Growth Case (Year 4)</div>
                    <div className="text-lg font-black text-slate-900 mt-1">$537.6M Valuation</div>
                    <div className="text-emerald-700 font-bold mt-0.5">~307x Return ($23.1M Payout)</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-slate-200">
                    <div className="text-slate-500 text-[11px]">Conservative PE Recap (Year 5)</div>
                    <div className="text-lg font-black text-slate-900 mt-1">$816.0M Valuation</div>
                    <div className="text-emerald-700 font-bold mt-0.5">~466x Return ($35.0M Payout)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: LEGAL & STATUTORY DISCLOSURES */}
          {activeTab === 'legal' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Legal, Regulatory & Statutory Disclosures</h2>
                <p className="text-xs text-slate-500 mt-1">Dedicated compliance memorandums under US, EU, and Norwegian law.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Investor Disclosures & Safe Harbor',
                    desc: 'Rule 506(c) Regulation D notice, accredited investor standard, PSLRA forward-looking statements.',
                    href: '/legal/investor-disclosures'
                  },
                  {
                    title: 'EU & Norwegian Compliance (EØS)',
                    desc: 'Pakkereiseloven, Angrerettloven, EU Digital Markets Act (DMA), eIDAS, and GDPR.',
                    href: '/legal/eu-norway-compliance'
                  },
                  {
                    title: 'Electronic Signatures (E-SIGN Act)',
                    desc: 'Statutory disclosures under 15 U.S.C. § 7001 & UETA governing digital execution and cryptographic ledgers.',
                    href: '/legal/electronic-signatures'
                  },
                  {
                    title: 'Closed-Loop Rate Parity Memorandum',
                    desc: 'Legal antitrust basis under US Sherman Act (15 U.S.C. § 1) and EU DMA for wholesale rate distribution.',
                    href: '/legal/rate-parity-compliance'
                  },
                  {
                    title: 'Seller of Travel Disclosures',
                    desc: 'State statutory disclosures for California (CST), Florida (ST), and Washington escrow trust compliance.',
                    href: '/legal/seller-of-travel'
                  },
                  {
                    title: 'Travel & Supplier Disclaimer',
                    desc: 'Independent contractor terms for wholesale bedbanks, airlines, CRS check-in parity, and force majeure.',
                    href: '/legal/travel-disclaimer'
                  },
                ].map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    target="_blank"
                    className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-amber-500/80 transition-all flex flex-col justify-between space-y-2 group shadow-2xs"
                  >
                    <div>
                      <div className="font-bold text-sm text-slate-900 group-hover:text-amber-600 transition-colors flex items-center justify-between">
                        <span>{item.title}</span>
                        <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Direct Allocation Contact Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1 text-center sm:text-left">
              <div className="font-black text-base">Reserve a SAFE Allocation ($10,000 Minimum)</div>
              <div className="text-xs text-slate-400">Direct subscription execution via YC Post-Money SAFE for LLCs ($75k Round).</div>
            </div>
            <a
              href="mailto:executive@atlas-travel-club.com?subject=ATLAS%20SAFE%20Allocation%20Request"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all flex items-center gap-2 shrink-0 shadow-xs"
            >
              <span>Contact Managing Member</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </div>

      {/* DIGITAL MUTUAL NDA MODAL */}
      {showNdaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[92vh] overflow-y-auto text-slate-900">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-black text-base">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                Mutual Non-Disclosure Agreement
              </div>
              <button 
                onClick={() => setShowNdaModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 text-sm cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-[11px] text-slate-600 space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 max-h-44 overflow-y-auto leading-relaxed">
              <div className="font-bold text-slate-900">CONFIDENTIALITY & NON-CIRCUMVENTION TERMS:</div>
              <p>
                This Mutual Non-Disclosure Agreement governs the confidential evaluation of <strong>ATLAS Travel Club LLC</strong> (a Manager-Managed LLC organized under Delaware / Wyoming law).
              </p>
              <p>
                Confidential Information includes without limitation: proprietary B2B Bedbank supplier rate feeds (Hotelbeds, RateHawk, WebBeds), 100% Google Cloud architecture specifications, financial projections, 5-year unit economics, and corporate term sheets.
              </p>
              <p>
                The Receiving Party agrees to use Confidential Information solely to evaluate an investment in or strategic relationship with the Company, and shall not disclose or circumvent the Company for twenty-four (24) months.
              </p>
              <div className="text-amber-700 font-semibold pt-1">
                Governing Law: State of Delaware / Wyoming. Digital execution conforms to 15 U.S.C. § 7001 (US E-SIGN Act) and EU eIDAS Regulation (EU) No 910/2014.
              </div>
            </div>

            <form onSubmit={handleSignNda} className="space-y-4 pt-1">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Legal Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Alexandra Vance" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Verified Email *</label>
                  <input 
                    type="email" 
                    readOnly
                    value={email}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-600 cursor-not-allowed font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Entity / Fund (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="Vance Capital LLC" 
                    value={firmName}
                    onChange={(e) => setFirmName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <label className="flex items-start gap-2.5 pt-2 text-xs text-slate-600 cursor-pointer">
                <input 
                  type="checkbox" 
                  required
                  checked={ndaAgreed}
                  onChange={(e) => setNdaAgreed(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                <span>
                  I consent to electronic signature under 15 U.S.C. § 7001 and agree to be bound by the Mutual Non-Disclosure Agreement.
                </span>
              </label>

              <button
                type="submit"
                disabled={isSigning}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isSigning ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Cryptographically Sign & Enter Data Room</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {activeDocPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="font-black text-sm text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                <span>{activeDocPreview.title}</span>
              </div>
              <button 
                onClick={() => setActiveDocPreview(null)}
                className="text-slate-400 hover:text-slate-700 p-1 text-sm cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Document Core Highlights:</div>
              <ul className="space-y-2 text-xs text-slate-600">
                {activeDocPreview.highlights.map((h: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => setActiveDocPreview(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Close Preview
              </button>

              {signedData ? (
                <a
                  href={activeDocPreview.file}
                  download
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download Full PDF</span>
                </a>
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
