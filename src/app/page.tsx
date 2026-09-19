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
  PanelLeftClose, PanelLeftOpen
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
  const [activeTab, setActiveTab] = useState<'teaser' | 'arbitrage' | 'economics' | 'budget' | 'dataroom' | 'exits' | 'legal'>('teaser');

  // Verification & Gate State
  const [email, setEmail] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [demoCodeHint, setDemoCodeHint] = useState<string | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  // NDA Execution State
  const [showNdaModal, setShowNdaModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [firmName, setFirmName] = useState('');
  const [eSignConsent, setESignConsent] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [signedData, setSignedData] = useState<SignatureRecord | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  // Document Preview Modal
  const [activeDocPreview, setActiveDocPreview] = useState<{
    title: string;
    category: string;
    file: string;
    highlights: string[];
  } | null>(null);

  // Check persistent session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('atlas_investor_session_v2');
      if (stored) {
        const parsed = JSON.parse(stored);
        setSignedData(parsed);
        setIsEmailVerified(true);
        setEmail(parsed.email || '');
      }
    } catch (e) {
      console.error('Error reading session:', e);
    }
  }, []);

  // Send Email OTP
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setVerifyError('Please provide a valid investor email address.');
      return;
    }

    setIsSendingCode(true);
    setVerifyError(null);

    try {
      const res = await fetch('/api/investors/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), action: 'send' })
      });
      const data = await res.json();

      if (res.ok) {
        setCodeSent(true);
        if (data.demoCode) {
          setDemoCodeHint(data.demoCode);
        }
      } else {
        setVerifyError(data.error || 'Failed to dispatch verification code.');
      }
    } catch (err) {
      setVerifyError('Network error. Please try again.');
    } finally {
      setIsSendingCode(false);
    }
  };

  // Verify OTP Code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode) return;

    setIsVerifyingCode(true);
    setVerifyError(null);

    try {
      const res = await fetch('/api/investors/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          action: 'verify',
          code: verificationCode.trim()
        })
      });
      const data = await res.json();

      if (res.ok && data.verified) {
        setIsEmailVerified(true);
        setShowNdaModal(true);
      } else {
        setVerifyError(data.error || 'Invalid code. Use the sent code or test code 888999.');
      }
    } catch (err) {
      setVerifyError('Verification failed.');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  // Sign NDA
  const handleSignNda = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !eSignConsent || !email) return;

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

  const documents = [
    {
      id: 'deck',
      title: '10-Slide Investor Presentation',
      category: 'Strategic Deck',
      file: '/docs/investors/ATLAS_Investor_Pitch_Deck.pdf',
      desc: 'Visual pitch deck covering the Costco wholesale model, 0% markup, and the $75k SAFE plan.',
      highlights: [
        'Costco Travel Model: 100% wholesale net savings passed at 0% markup.',
        'Target Audience: Families (45%), SMB Corporate (30%), Luxury (15%), Nomads (10%).',
        'Unit Economics: $850 blended ARPU, $115 CAC, 94% subscription gross margin.',
        'The Deal: $75,000 raise on a $1.75M Post-Money SAFE (~4.3% equity at cap).'
      ]
    },
    {
      id: 'prospectus',
      title: 'Confidential Investor Prospectus (PPM)',
      category: 'Private Placement Memorandum',
      file: '/docs/investors/ATLAS_Confidential_Prospectus.pdf',
      desc: '10-section offering memorandum, 5-year pro-forma income statement, and $0 supplier deposit model.',
      highlights: [
        'Entity: ATLAS Travel Club LLC (Manager-Managed LLC — Delaware / Wyoming).',
        '5-Year Model: Year 1: $850k ARR -> Year 3: $21.2M ARR -> Year 5: $102M ARR.',
        'Human Execution Focus: Over 57% of proceeds fund Founder stipend ($25k) and dev contractor sprints ($18k).',
        '$0 Supplier Deposits: Synchronous real-time card authorization via RateHawk, Duffel, and Stripe.'
      ]
    },
    {
      id: 'safe',
      title: 'YC Post-Money SAFE Term Sheet Summary',
      category: 'Legal Term Sheet',
      file: '/docs/investors/ATLAS_SAFE_Term_Sheet_LLC.pdf',
      desc: 'Simple Agreement for Future Equity (LLC Edition) with optional Delaware C-Corp conversion mechanics.',
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
      desc: '100% Google Cloud Ecosystem specification: Cloud Run, Vertex AI, Cloud SQL, Secret Manager.',
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
      desc: 'Pre-empts rate parity legal precedent (Sherman Act, Loi Macron), account-sharing controls, and CRS check-in.',
      file: '/docs/investors/ATLAS_Due_Diligence_FAQ.pdf',
      highlights: [
        'Rate Parity Antitrust: US Sherman Act 15 U.S.C. § 1 & EU Loi Macron exempt closed-loop buyer syndicates.',
        'Account Protection: Device fingerprinting, legal passport matching, and wallet balances disincentivize sharing.',
        'CRS Hotel Settlement: Direct bedbank voucher codes appear identical to Amex Fine Hotels reservations.',
        'Capital Efficiency: Why $75k is sufficient for 12 months due to asset-light software architecture.'
      ]
    },
    {
      id: 'exit',
      title: 'Strategic Exit Opportunities & M&A Landscape',
      category: 'Liquidity & M&A Analysis',
      desc: 'Precedent transactions (Amex, Capital One/Velocity Black, Booking, Revolut) and 3 to 6-year exit multiples.',
      file: '/docs/investors/ATLAS_Strategic_Exit_Opportunities.pdf',
      highlights: [
        'Premium Card Issuers: Capital One acquired Velocity Black for $297M; Chase acquired Frosch Travel.',
        'OTA Consolidation: Booking Holdings & Expedia seek high-margin SaaS subscription cash flows.',
        'Return Multiples on $75k SAFE: Base Case M&A ($74M valuation) = ~42x; Growth Case ($378M) = ~215x.',
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
              { id: 'teaser', label: 'Executive Teaser', icon: Award },
              { id: 'arbitrage', label: 'Wholesale Arbitrage', icon: Layers },
              { id: 'economics', label: 'Unit Economics', icon: TrendingUp },
              { id: 'budget', label: '$75k Use of Proceeds', icon: DollarSign },
              { 
                id: 'dataroom', 
                label: 'Confidential Data Room', 
                icon: FileText, 
                badge: signedData ? 'Unlocked' : 'Locked' 
              },
              { id: 'exits', label: 'M&A Exits & Multiples', icon: Building2 },
              { id: 'legal', label: 'Legal Disclosures', icon: ShieldCheck },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200/90 font-bold' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  title={item.label}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!sidebarCollapsed && item.badge && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                      item.badge === 'Unlocked' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Status */}
        <div className="p-4 border-t border-slate-200/80 bg-white/50">
          {!sidebarCollapsed ? (
            <div className="space-y-2">
              <div className="text-[11px] text-slate-500">
                Round: <strong>$75,000 SAFE</strong>
              </div>
              <div className="text-[11px] text-slate-500">
                Cap: <strong>$1.75M (20% Disc)</strong>
              </div>
              <div className="text-[10px] text-slate-400 pt-1">
                Delaware / Wyoming LLC
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Round Active"></span>
            </div>
          )}
        </div>
      </aside>

      {/* 2. MAIN APPLICATION WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="h-16 border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="text-xs font-semibold text-slate-600 hidden sm:flex items-center gap-1.5">
              <span>ATLAS Travel Club LLC</span>
              <span className="text-slate-300">•</span>
              <span className="text-amber-600 font-bold">Pre-Seed Angel SAFE ($75,000)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {signedData ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-semibold">{signedData.fullName}</span>
                <span className="text-[10px] font-mono text-emerald-600 hidden sm:inline">({signedData.signatureHash.substring(0, 12)}...)</span>
                <button
                  onClick={handleResetSession}
                  className="text-[11px] text-slate-400 hover:text-rose-600 underline ml-1 cursor-pointer"
                >
                  Exit
                </button>
              </div>
            ) : isEmailVerified ? (
              <button
                onClick={() => setShowNdaModal(true)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <FileCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Sign NDA to Unlock</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('dataroom')}
                className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold hover:bg-amber-100 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3 h-3 text-amber-600" />
                <span>Verify Access</span>
              </button>
            )}

            <Link
              href="/"
              target="_blank"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1"
            >
              <span>Live Platform</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-50 border-b border-slate-200 p-4 space-y-2">
            {[
              { id: 'teaser', label: 'Executive Teaser' },
              { id: 'arbitrage', label: 'Wholesale Arbitrage' },
              { id: 'economics', label: 'Unit Economics' },
              { id: 'budget', label: '$75k Use of Proceeds' },
              { id: 'dataroom', label: 'Confidential Data Room' },
              { id: 'exits', label: 'M&A Exits & Multiples' },
              { id: 'legal', label: 'Legal Disclosures' },
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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>Confidential Angel Brief • $75,000 Pre-Seed Round</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                  The Digital <span className="text-amber-600">Costco</span> for the $1.4T Travel Market
                </h1>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
                  ATLAS is an asset-light, closed-loop travel subscription collective. 
                  By utilizing well-established antitrust exemptions under US and EU law, 
                  we bypass the 25% OTA duopoly markup, procuring wholesale inventory at net clearing rates 
                  and passing <strong>100% of wholesale savings to subscribers at 0% markup</strong>.
                </p>
              </div>

              {/* Deal Card Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-1">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Target Capital</div>
                  <div className="text-2xl font-black text-slate-900">$75,000</div>
                  <div className="text-[11px] text-amber-600 font-semibold">YC Post-Money SAFE</div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-1">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Valuation Cap</div>
                  <div className="text-2xl font-black text-slate-900">$1.75M</div>
                  <div className="text-[11px] text-emerald-700 font-semibold">~4.3% Ownership Cap</div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-1">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Blended ARPU</div>
                  <div className="text-2xl font-black text-slate-900">$850 / yr</div>
                  <div className="text-[11px] text-slate-500">94% Gross Margin</div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-1">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Infrastructure</div>
                  <div className="text-2xl font-black text-slate-900">100% GCP</div>
                  <div className="text-[11px] text-blue-600 font-semibold">Cloud Run & Vertex AI</div>
                </div>
              </div>

              {/* Gated Access Callout */}
              <div className="p-6 rounded-2xl border-2 border-amber-500/30 bg-amber-50/30 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 justify-center sm:justify-start">
                    <Lock className="w-4 h-4 text-amber-600" />
                    <span>Confidential Due Diligence Repository</span>
                  </h3>
                  <p className="text-xs text-slate-600 max-w-xl">
                    Full 5-year financials, technical manuals, pitch deck, and SAFE agreements are protected behind our 2-step investor verification gate.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('dataroom')}
                  className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <span>{signedData ? 'Enter Data Room' : 'Verify Email & Sign NDA'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: WHOLESALE ARBITRAGE THESIS */}
          {activeTab === 'arbitrage' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-black text-slate-900">The $350B Wholesale Rate Arbitrage</h2>
                <p className="text-xs text-slate-500 mt-1">How closed-loop antitrust exemptions unlock 0% markup wholesale distribution.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600 leading-relaxed">
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h3 className="font-bold text-slate-900">The Problem: Public Rate Parity Cartels</h3>
                  <p>
                    Online Travel Agencies (Expedia Group, Booking Holdings) extract 15% to 30% markups on every room booked. 
                    They contractually impose <strong>Rate Parity clauses</strong> that legally bar hotels from offering public discounts.
                  </p>
                  <p>
                    Frequent travelers and affluent vacationers overpay thousands annually because they lack corporate buying desks.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3 text-amber-950">
                  <h3 className="font-bold text-amber-900">The Solution: Closed-Loop Wholesale Pass-Through</h3>
                  <p>
                    Under the <strong>US Sherman Antitrust Act (15 U.S.C. § 1)</strong>, the <strong>EU Digital Markets Act (DMA)</strong>, 
                    and the French <em>Loi Macron</em>, rate parity restrictions do NOT apply to password-gated, closed-loop membership clubs.
                  </p>
                  <p>
                    ATLAS sources room allotments from institutional bedbanks (Hotelbeds, RateHawk, WebBeds) and passes <strong>100% of the net savings to subscribers at 0% markup</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: UNIT ECONOMICS & MODEL */}
          {activeTab === 'economics' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Predictable Recurring Unit Economics</h2>
                <p className="text-xs text-slate-500 mt-1">High-margin software subscriptions + secondary fintech interchange revenue.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-xs font-semibold text-slate-500">Blended Annual Fee</div>
                  <div className="text-2xl font-black text-slate-900">$684 / yr</div>
                  <div className="text-[11px] text-slate-500">Club ($349), Family ($699), VIP ($1,499)</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-xs font-semibold text-slate-500">Fintech Interchange</div>
                  <div className="text-2xl font-black text-slate-900">$166 / yr</div>
                  <div className="text-[11px] text-slate-500">1.2% net yield on $13,850 card spend</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-xs font-semibold text-slate-500">Customer Payback</div>
                  <div className="text-2xl font-black text-emerald-700">1.6 Months</div>
                  <div className="text-[11px] text-emerald-700">$115 Blended CAC • 38.6x LTV:CAC</div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 text-white text-xs space-y-2">
                <div className="font-bold text-amber-400 text-sm">5-Year Growth Trajectory</div>
                <p className="text-slate-300 leading-relaxed">
                  Year 1: 1,000 paid members ($850,000 ARR) • Year 2: 6,000 members ($5.1M ARR) • Year 3: 25,000 members ($21.2M ARR) • Year 5: 120,000 members ($102M ARR).
                </p>
                <div className="text-[11px] text-slate-400">Full model available in the Confidential Prospectus PPM document.</div>
              </div>
            </div>
          )}

          {/* TAB 4: USE OF PROCEEDS ($75k BUDGET) */}
          {activeTab === 'budget' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-black text-slate-900">$75,000 Lean Capital Allocation</h2>
                <p className="text-xs text-slate-500 mt-1">Asset-light software model requiring $0 in locked supplier deposits.</p>
              </div>

              <div className="divide-y divide-slate-100 text-xs border border-slate-200 rounded-2xl overflow-hidden bg-white">
                {[
                  { name: 'Founder Executive Stipend', amt: '$25,000', pct: '33.3%', note: '$2,500/mo over 10 months for full-time founder commitment.' },
                  { name: 'Contract Engineering & Tech Ops', amt: '$18,000', pct: '24.0%', note: '6 milestone dev sprints for live RateHawk, Duffel & GCP CI/CD.' },
                  { name: 'Member Acquisition & GTM', amt: '$16,500', pct: '22.0%', note: 'Targeted executive flyer outreach, "Savings Audit" marketing, creator seeds.' },
                  { name: 'Legal, SoT Licensing & Entity Setup', amt: '$6,500', pct: '8.7%', note: 'Delaware/Wyoming LLC formalization and Seller of Travel filings.' },
                  { name: 'Google Cloud & Vertex AI Tokens', amt: '$3,500', pct: '4.7%', note: '12 mos Cloud Run, Cloud SQL, and Gemini 2.0 API inference.' },
                  { name: 'Contingency Operating Buffer', amt: '$3,500', pct: '4.7%', note: 'Emergency cash reserve ensuring 10–12 months runway.' },
                  { name: 'Minimal Operating Float', amt: '$2,000', pct: '2.7%', note: 'Working float for card generation ($1,200) and eSIM stock ($800).' },
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
            </div>
          )}

          {/* TAB 5: CONFIDENTIAL DATA ROOM (MANDATORY 2-STEP GATE) */}
          {activeTab === 'dataroom' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Confidential Investor Data Room</h2>
                <p className="text-xs text-slate-500 mt-1">Review verified offering materials, technical architecture manuals, and legal term sheets.</p>
              </div>

              {/* 2-STEP ACCESS GATE (IF NOT SIGNED) */}
              {!signedData && (
                <div className="p-6 rounded-2xl border-2 border-amber-500/40 bg-amber-50/20 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Two-Step Verification Required for Data Room Access</h3>
                      <p className="text-xs text-slate-500">Verify your investor email address and digitally sign the Mutual NDA to unlock documents.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Step 1 */}
                    <div className={`p-5 rounded-xl border bg-white space-y-3 ${
                      isEmailVerified ? 'border-emerald-300 bg-emerald-50/30' : 'border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
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
                          <form onSubmit={handleSendCode} className="space-y-2">
                            <input
                              type="email"
                              required
                              placeholder="investor@fund.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-amber-500"
                            />
                            <button
                              type="submit"
                              disabled={isSendingCode}
                              className="w-full py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              {isSendingCode ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
                              <span>Send Verification Code</span>
                            </button>
                          </form>
                        ) : (
                          <form onSubmit={handleVerifyCode} className="space-y-2">
                            <div className="text-[11px] text-slate-500 flex justify-between">
                              <span>Code sent to {email}</span>
                              <button type="button" onClick={() => setCodeSent(false)} className="text-amber-600 underline">Edit</button>
                            </div>
                            <input
                              type="text"
                              required
                              maxLength={6}
                              placeholder="Enter 6-digit code"
                              value={verificationCode}
                              onChange={(e) => setVerificationCode(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-center font-mono text-sm tracking-widest focus:outline-none focus:border-amber-500"
                            />
                            {demoCodeHint && (
                              <div className="text-[10px] text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200 text-center">
                                Demo code: <strong>{demoCodeHint}</strong> (or test: <strong>888999</strong>)
                              </div>
                            )}
                            <button
                              type="submit"
                              disabled={isVerifyingCode}
                              className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              {isVerifyingCode ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <KeyRound className="w-3.5 h-3.5" />}
                              <span>Verify Code</span>
                            </button>
                          </form>
                        )
                      ) : (
                        <p className="text-xs text-emerald-800 font-medium">
                          Verified as <strong>{email}</strong>. Ready for Step 2.
                        </p>
                      )}

                      {verifyError && <p className="text-[11px] text-rose-600 font-medium">{verifyError}</p>}
                    </div>

                    {/* Step 2 */}
                    <div className={`p-5 rounded-xl border bg-white flex flex-col justify-between ${
                      !isEmailVerified ? 'opacity-50 border-slate-200' : 'border-slate-200'
                    }`}>
                      <div className="space-y-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">2</span>
                          Step 2: Mutual NDA Signature
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Bilateral non-disclosure agreement compliant with the US E-SIGN Act (15 U.S.C. § 7001) and EU eIDAS regulation.
                        </p>
                      </div>

                      <button
                        onClick={() => setShowNdaModal(true)}
                        disabled={!isEmailVerified}
                        className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer ${
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
                    className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                          <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>{doc.title}</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 shrink-0">
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
                          className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
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
                          className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-400 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Lock className="w-3 h-3" />
                          <span>Locked</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* OFFICIAL SIGNATURE CERTIFICATE (RENDERED ONCE SIGNED) */}
              {signedData && (
                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 space-y-2">
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

                  <div className="flex items-center justify-between text-[10px] font-mono text-emerald-700 pt-1 border-t border-emerald-200/60">
                    <span className="truncate">Hash: {signedData.signatureHash}</span>
                    <button onClick={copyHash} className="ml-2 underline hover:text-emerald-950 cursor-pointer shrink-0">
                      {copiedHash ? 'Copied!' : 'Copy Hash'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: M&A EXITS & MULTIPLES */}
          {activeTab === 'exits' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-black text-slate-900">M&A Acquirer Landscape & Returns</h2>
                <p className="text-xs text-slate-500 mt-1">3 to 6-year exit horizons across 4 strategic buyer categories.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900">1. Premium Card Issuers</div>
                  <div className="text-[11px] text-amber-700 font-semibold">Amex, Capital One, Chase</div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Precedent: Capital One acquired Velocity Black for $297M; Chase acquired Frosch Travel.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900">2. Public OTAs</div>
                  <div className="text-[11px] text-blue-700 font-semibold">Booking Holdings, Expedia</div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    OTAs acquire high-margin subscription clubs to reduce Google search ad dependency.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900">3. Mobility & Super-Apps</div>
                  <div className="text-[11px] text-purple-700 font-semibold">Revolut, Hopper, Uber</div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Fintech apps with millions of cardholders looking to offer 0% markup travel perks.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="font-bold text-slate-900">Target Investor Returns on $75k SAFE:</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                  <div>• Base Case M&A (Yr 3): <strong>$74.2M Valuation (~42x return)</strong></div>
                  <div>• Growth Case (Yr 4): <strong>$378M Valuation (~215x return)</strong></div>
                  <div>• PE Buyout (Yr 5): <strong>$416M Valuation (~237x return)</strong></div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: LEGAL & STATUTORY DISCLOSURES */}
          {activeTab === 'legal' && (
            <div className="space-y-6 animate-fadeIn">
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
                    desc: 'Legal antitrust basis under US Sherman Act (15 U.S.C. § 1) and EU Loi Macron for wholesale rate distribution.',
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
                    className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-amber-500/80 transition-all flex flex-col justify-between space-y-2 group"
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
          <div className="p-6 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="font-bold text-sm">Reserve a SAFE Allocation ($10k Minimum)</div>
              <div className="text-xs text-slate-400">Direct subscription execution via YC Post-Money SAFE for LLCs.</div>
            </div>
            <a
              href="mailto:executive@atlas-travel-club.com?subject=ATLAS%20SAFE%20Allocation%20Request"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 shrink-0"
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

              {/* Consent Checkbox */}
              <div className="flex items-start gap-2.5 pt-1">
                <input 
                  type="checkbox" 
                  id="eSignConsentBox"
                  required
                  checked={eSignConsent}
                  onChange={(e) => setESignConsent(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <label htmlFor="eSignConsentBox" className="text-[11px] text-slate-600 cursor-pointer leading-tight">
                  I agree to the terms of the Mutual Non-Disclosure Agreement and consent to conducting this transaction electronically pursuant to the US E-SIGN Act (15 U.S.C. § 7001) and EU eIDAS regulation.
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSigning || !eSignConsent || !fullName}
                  className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  {isSigning ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Recording Cryptographic E-Signature...
                    </span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Execute Digital Signature & Unlock Data Room</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[10px] text-center text-slate-400">
                Timestamp, verified email ({email}), and cryptographic hash will be permanently recorded.
              </p>
            </form>
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {activeDocPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{activeDocPreview.category}</div>
                <h3 className="font-bold text-base text-slate-900">{activeDocPreview.title}</h3>
              </div>
              <button 
                onClick={() => setActiveDocPreview(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-500">Key Highlights:</div>
              <ul className="space-y-2">
                {activeDocPreview.highlights.map((h, i) => (
                  <li key={i} className="text-xs text-slate-700 flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                onClick={() => setActiveDocPreview(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>

              {signedData ? (
                <a
                  href={activeDocPreview.file}
                  download
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download Full PDF</span>
                </a>
              ) : (
                <button
                  onClick={() => {
                    setActiveDocPreview(null);
                    setShowNdaModal(true);
                  }}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Sign NDA to Download</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
