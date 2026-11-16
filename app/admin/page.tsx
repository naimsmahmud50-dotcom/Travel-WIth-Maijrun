'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Users,
  Download,
  RefreshCw,
  CheckCircle,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  ArrowRight,
  KeyRound,
  AlertCircle,
  Sparkles,
  Compass,
  Edit3,
  Trash2,
  Plus,
  X,
  Save,
  Globe,
  Tag,
  Check,
} from 'lucide-react';

interface Inquiry {
  id: string;
  name: string;
  fullName?: string;
  email: string;
  phone: string;
  destination: string;
  destinationTitle?: string;
  guests: string;
  guestCount?: string;
  preferences: string;
  specialRequests?: string;
  preferredDates?: string;
  status: string;
  createdAt: string;
}

interface AdminDestination {
  id: string;
  destKey: string;
  category: string;
  tag: string;
  duration: string;
  country: string;
  region: string;
  title: string;
  desc: string;
  priceBdt: string;
  priceUsd?: string;
  image: string;
  styles?: string[];
  seasons?: string[];
  isCustom?: boolean;
}

export default function AdminDashboard() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [adminIdentifier, setAdminIdentifier] = useState<string>('');
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberDevice, setRememberDevice] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string>('');
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [currentAdminUser, setCurrentAdminUser] = useState<string>('Mahmud Hasan');
  const [inputsUnlocked, setInputsUnlocked] = useState<boolean>(false);

  // Dashboard Tabs State
  const [activeTab, setActiveTab] = useState<'inquiries' | 'destinations'>('inquiries');

  // CRM Leads State
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(true);
  const [actionMessage, setActionMessage] = useState<string>('');

  // CMS Destinations State
  const [destinations, setDestinations] = useState<AdminDestination[]>([]);
  const [loadingDestinations, setLoadingDestinations] = useState(false);
  const [editingDestination, setEditingDestination] = useState<AdminDestination | null>(null);
  const [isAddingDestination, setIsAddingDestination] = useState<boolean>(false);
  const [cmsFormData, setCmsFormData] = useState<Partial<AdminDestination>>({});
  const [savingCms, setSavingCms] = useState<boolean>(false);

  // Check existing session on mount via secure server-side endpoint
  useEffect(() => {
    let isMounted = true;
    async function checkSession() {
      try {
        const res = await fetch('/api/admin/session');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.authenticated) {
            setIsAuthenticated(true);
            if (data.user) setCurrentAdminUser(data.user);
          }
        }
      } catch {
        // Network or server error fallback
      } finally {
        if (isMounted) {
          setIsCheckingAuth(false);
        }
      }
    }
    checkSession();
    return () => {
      isMounted = false;
    };
  }, []);

  // Active Autofill Nullifier: Guarantee inputs remain 100% empty on mount
  useEffect(() => {
    const wipeAutofill = () => {
      if (!inputsUnlocked) {
        const idEl = document.getElementById('adminId') as HTMLInputElement | null;
        const passEl = document.getElementById('adminPass') as HTMLInputElement | null;
        if (idEl && idEl.value) {
          idEl.value = '';
          setAdminIdentifier('');
        }
        if (passEl && passEl.value) {
          passEl.value = '';
          setAdminPassword('');
        }
      }
    };

    wipeAutofill();
    const timers = [50, 150, 300, 600, 1000, 1500, 2000].map((ms) => setTimeout(wipeAutofill, ms));
    return () => timers.forEach(clearTimeout);
  }, [inputsUnlocked]);

  // Fetch inquiries and destinations when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchInquiries();
      fetchDestinations();
    }
  }, [isAuthenticated]);

  const showToast = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(''), 4000);
  };

  const fetchInquiries = async () => {
    setLoadingInquiries(true);
    try {
      const res = await fetch('/api/inquiries');
      if (res.status === 401) {
        setIsAuthenticated(false);
        setAuthError('Executive session expired or unauthorized. Please re-authenticate.');
        return;
      }
      const data = await res.json();
      if (data.success) {
        setInquiries(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInquiries(false);
    }
  };

  const fetchDestinations = async () => {
    setLoadingDestinations(true);
    try {
      const res = await fetch('/api/admin/destinations');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setDestinations(data.data || []);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDestinations(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthenticating(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: adminIdentifier,
          password: adminPassword,
          remember: rememberDevice,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        const userName = data.user || 'Mahmud Hasan (VIP Admin)';
        setCurrentAdminUser(userName);
        setIsAuthenticated(true);
        setAdminPassword('');
        setAuthError('');
      } else {
        setAuthError(
          data.error || 'Authentication rejected. Invalid Executive Identifier or Master Passcode.'
        );
      }
    } catch {
      setAuthError('Secure connection failed. Please ensure the server is operational.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    try {
      sessionStorage.removeItem('maijrun_admin_auth');
      sessionStorage.removeItem('maijrun_admin_user');
      localStorage.removeItem('maijrun_admin_auth');
      localStorage.removeItem('maijrun_admin_user');
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    setAdminPassword('');
    setAuthError('');
  };

  const exportCSV = () => {
    if (!inquiries.length) return;
    const headers = [
      'ID',
      'Client Name',
      'Email',
      'Phone',
      'Destination',
      'Guest Count',
      'Preferences',
      'Status',
      'Timestamp',
    ];
    const rows = inquiries.map((inq) => [
      inq.id,
      `"${(inq.name || inq.fullName || '').replace(/"/g, '""')}"`,
      `"${inq.email.replace(/"/g, '""')}"`,
      `"${inq.phone.replace(/"/g, '""')}"`,
      `"${(inq.destination || inq.destinationTitle || '').replace(/"/g, '""')}"`,
      `"${(inq.guests || inq.guestCount || '').replace(/"/g, '""')}"`,
      `"${(inq.preferences || inq.specialRequests || '').replace(/"/g, '""')}"`,
      inq.status || 'NEW',
      inq.createdAt,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Maijrun_VIP_Inquiries_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Inquiry Status Management
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setInquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
        showToast(`Lead status updated to ${newStatus}`);
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch {
      alert('Network error while updating lead status');
    }
  };

  // Inquiry Deletion Management
  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Are you certain you wish to delete this consultation dossier permanently?')) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/inquiries?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setInquiries((prev) => prev.filter((item) => item.id !== id));
        showToast('Inquiry dossier deleted successfully.');
      } else {
        alert(data.error || 'Failed to delete inquiry');
      }
    } catch {
      alert('Network error while deleting inquiry');
    }
  };

  // CMS Destination Edit / Add Handlers
  const openEditDestination = (dest: AdminDestination) => {
    setEditingDestination(dest);
    setIsAddingDestination(false);
    setCmsFormData({ ...dest });
  };

  const openAddDestination = () => {
    setEditingDestination(null);
    setIsAddingDestination(true);
    setCmsFormData({
      title: '',
      country: '',
      region: '',
      duration: '9 Days • 8 Nights',
      tag: 'Royal Bespoke',
      priceBdt: '৳850,000',
      priceUsd: '$7,000',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=75&w=640&auto=format&fit=crop',
      desc: '',
    });
  };

  const handleSaveDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCms(true);
    try {
      if (isAddingDestination) {
        const res = await fetch('/api/admin/destinations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cmsFormData),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setDestinations((prev) => [...prev, data.data]);
          setIsAddingDestination(false);
          setCmsFormData({});
          showToast('New luxury destination published successfully.');
        } else {
          alert(data.error || 'Failed to create destination');
        }
      } else if (editingDestination) {
        const res = await fetch('/api/admin/destinations', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...cmsFormData, id: editingDestination.id }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setDestinations((prev) =>
            prev.map((d) => (d.id === editingDestination.id ? data.data : d))
          );
          setEditingDestination(null);
          setCmsFormData({});
          showToast('Destination details and pricing updated successfully.');
        } else {
          alert(data.error || 'Failed to update destination');
        }
      }
    } catch {
      alert('Network error while saving destination');
    } finally {
      setSavingCms(false);
    }
  };

  const handleDeleteDestination = async (id: string) => {
    if (!confirm('Are you certain you wish to delete this journey package?')) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/destinations?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDestinations((prev) => prev.filter((d) => d.id !== id));
        showToast('Destination deleted successfully.');
      } else {
        alert(data.error || 'Failed to delete destination');
      }
    } catch {
      alert('Network error while deleting destination');
    }
  };

  // Dynamic Pipeline Valuation Calculation
  const pipelineTotal = inquiries.reduce((acc, inq) => {
    const destLower = (inq.destination || inq.destinationTitle || '').toLowerCase();
    if (destLower.includes('switzerland')) return acc + 1020000;
    if (destLower.includes('japan')) return acc + 950000;
    if (destLower.includes('safari') || destLower.includes('tanzania')) return acc + 1176000;
    if (destLower.includes('maldives')) return acc + 864000;
    if (destLower.includes('spain') || destLower.includes('andalus')) return acc + 768000;
    if (destLower.includes('makkah') || destLower.includes('umrah') || destLower.includes('saudi')) return acc + 695000;
    if (destLower.includes('turkey') || destLower.includes('bosphorus')) return acc + 624000;
    return acc + 750000;
  }, 0);
  const formattedPipeline = pipelineTotal > 0 ? `৳${pipelineTotal.toLocaleString('en-US')}` : '৳0';

  const STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
    NEW: { bg: 'bg-amber-950/60', text: 'text-amber-300', border: 'border-amber-500/40' },
    CONTACTED: { bg: 'bg-sky-950/60', text: 'text-sky-300', border: 'border-sky-500/40' },
    CONFIRMED: { bg: 'bg-emerald-950/60', text: 'text-emerald-300', border: 'border-emerald-500/40' },
    ARCHIVED: { bg: 'bg-neutral-800/60', text: 'text-neutral-400', border: 'border-neutral-600/40' },
  };

  // =========================================================================
  // LOADING CLEARANCE SCREEN
  // =========================================================================
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#061410] flex items-center justify-center text-brand-gold">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-medium">
            Verifying Atelier Security Clearance...
          </span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // UNAUTHENTICATED: LUXURY LOGIN PORTAL WITH DECOY TRAPS & AUTOFILL SHIELD
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#061410] flex flex-col justify-between selection:bg-[#D4AF37] selection:text-[#061410] relative overflow-hidden">
        {/* Ambient Halal Luxury Background Accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#0B2019] rounded-full blur-[100px] pointer-events-none" />

        {/* Minimal Executive Topbar */}
        <header className="relative z-10 px-6 py-5 flex items-center justify-between border-b border-white/5">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-8 h-8 rounded-full border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] font-serif text-sm font-bold group-hover:scale-105 transition-transform">
              M
            </span>
            <span className="font-serif text-sm tracking-widest uppercase text-white/90">
              Travel With Maijrun
            </span>
          </Link>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]/80 border border-[#D4AF37]/20 px-3 py-1 rounded-full bg-[#D4AF37]/5">
            Private Atelier
          </span>
        </header>

        {/* Central Authentication Card */}
        <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="bg-[#0B2019]/90 border border-[#D4AF37]/30 rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl relative">
              {/* Subtle Gold Corner Accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#D4AF37]/10 to-transparent rounded-tr-3xl pointer-events-none" />

              {/* Medallion Monogram */}
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37] bg-gradient-to-b from-[#0B2019] to-[#061410] flex items-center justify-center text-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.2)] mb-4 relative">
                  <span className="font-serif text-2xl font-bold">M</span>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#061410] shadow-sm">
                    <ShieldCheck className="w-3 h-3" />
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold mb-2">
                  <KeyRound className="w-3 h-3" />
                  <span>Executive Gateway</span>
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Private Atelier Access
                </h1>
                <p className="text-xs text-neutral-400 mt-1.5 max-w-xs leading-relaxed font-light">
                  Restricted portal for Mahmud Hasan & authorized concierge directors.
                </p>
              </div>

              {/* Error Banner */}
              {authError && (
                <div className="mb-6 p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">{authError}</span>
                </div>
              )}

              {/* Form with Passive Autofill Shield */}
              <form onSubmit={handleLogin} autoComplete="off" className="space-y-5">
                {/* Invisible decoy inputs to trap aggressive browser password managers */}
                <input
                  type="text"
                  name="decoy_user"
                  tabIndex={-1}
                  aria-hidden="true"
                  className="sr-only opacity-0 absolute -z-10 h-0 w-0 pointer-events-none"
                />
                <input
                  type="password"
                  name="decoy_pass"
                  tabIndex={-1}
                  aria-hidden="true"
                  className="sr-only opacity-0 absolute -z-10 h-0 w-0 pointer-events-none"
                />

                {/* Gmail Input */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="adminId"
                    className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-300"
                  >
                    Gmail
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="adminId"
                      name="admin_user_credential"
                      type="text"
                      required
                      value={adminIdentifier}
                      onChange={(e) => {
                        setInputsUnlocked(true);
                        setAdminIdentifier(e.target.value);
                      }}
                      onFocus={() => setInputsUnlocked(true)}
                      onMouseDown={() => setInputsUnlocked(true)}
                      onTouchStart={() => setInputsUnlocked(true)}
                      readOnly={!inputsUnlocked}
                      placeholder="Gmail"
                      autoComplete="off"
                      data-lpignore="true"
                      style={{ WebkitBoxShadow: '0 0 0 1000px #061410 inset', WebkitTextFillColor: '#ffffff' }}
                      className="w-full pl-10 pr-4 py-3 bg-black/40 border border-[#D4AF37]/25 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/60 rounded-xl text-sm text-white placeholder-neutral-400 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="adminPass"
                      className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-300"
                    >
                      Password
                    </label>
                    <span className="text-[10px] text-neutral-500">256-Bit SSL</span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="adminPass"
                      name="admin_pass_credential"
                      type="text"
                      required
                      value={adminPassword}
                      onChange={(e) => {
                        setInputsUnlocked(true);
                        setAdminPassword(e.target.value);
                      }}
                      onFocus={() => setInputsUnlocked(true)}
                      onMouseDown={() => setInputsUnlocked(true)}
                      onTouchStart={() => setInputsUnlocked(true)}
                      readOnly={!inputsUnlocked}
                      placeholder="Password"
                      autoComplete="new-password"
                      data-lpignore="true"
                      style={{ WebkitBoxShadow: '0 0 0 1000px #061410 inset', WebkitTextFillColor: '#ffffff' }}
                      className={`w-full pl-10 pr-11 py-3 bg-black/40 border border-[#D4AF37]/25 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/60 rounded-xl text-sm text-white placeholder-neutral-400 outline-none transition-all font-mono tracking-wide ${
                        showPassword ? '' : 'mask-password-dots'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-[#D4AF37] transition-colors"
                      title={showPassword ? 'Hide passcode' : 'Show passcode'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Device & Security Note */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-neutral-400 hover:text-neutral-200 transition-colors">
                    <input
                      type="checkbox"
                      checked={rememberDevice}
                      onChange={(e) => setRememberDevice(e.target.checked)}
                      className="w-4 h-4 rounded border-neutral-700 bg-black/40 text-[#D4AF37] accent-[#D4AF37] focus:ring-0 cursor-pointer"
                    />
                    <span className="text-[11px]">Remember VIP Session</span>
                  </label>
                  <span className="text-[10px] text-[#D4AF37]/80 font-mono">Confidential</span>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full mt-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] hover:brightness-105 active:scale-[0.99] text-[#061410] font-bold text-xs uppercase tracking-[0.2em] shadow-[0_4px_20px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {isAuthenticating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#061410] border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Authorize VIP Entry</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Bottom Support Note */}
              <div className="mt-8 pt-6 border-t border-white/10 text-center space-y-1">
                <p className="text-[11px] text-neutral-400">
                  Concierge Hotline:{' '}
                  <a
                    href="tel:+8801767850859"
                    className="text-[#D4AF37] hover:underline font-mono"
                  >
                    +880 1767-850859
                  </a>
                </p>
                <p className="text-[10px] text-neutral-500 font-light">
                  Protected strictly under Travel With Maijrun Atelier Privacy Governance.
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Minimal Footer */}
        <footer className="relative z-10 px-6 py-4 text-center text-[11px] text-neutral-500 border-t border-white/5">
          © {new Date().getFullYear()} Travel With Maijrun. Private Concierge & VIP Operations Terminal.
        </footer>
      </div>
    );
  }

  // =========================================================================
  // AUTHENTICATED CRM & CMS DASHBOARD: OPERATIONS SUITE
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#061410] text-neutral-100 p-4 sm:p-8 md:p-12 font-sans selection:bg-[#D4AF37] selection:text-[#061410]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Toast Alert */}
        {actionMessage && (
          <div className="fixed top-6 right-6 z-50 p-4 rounded-xl bg-[#0B2019] border border-[#D4AF37] text-brand-gold text-xs font-semibold shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-3">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Top Executive Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-[#D4AF37]/20 gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-brand-gold text-xs uppercase tracking-[0.25em] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>VIP Executive Operations Atelier</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white tracking-tight">
              Travel With Maijrun — Control Terminal
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400">
              <span>Bespoke inquiries CRM & dynamic destination package management.</span>
              <span className="text-neutral-600">•</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Director Clearance: <strong className="text-white font-normal">{currentAdminUser}</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2.5 rounded-xl bg-black/40 hover:bg-black/60 text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-2 transition-colors border border-white/10"
            >
              <span>View Public Site</span>
            </Link>
            <button
              onClick={() => {
                fetchInquiries();
                fetchDestinations();
              }}
              className="px-4 py-2.5 rounded-xl bg-[#0B2019] hover:bg-[#0E2A21] text-xs font-semibold uppercase tracking-wider text-brand-goldLight flex items-center gap-2 transition-colors border border-brand-gold/30"
              title="Refresh confidential records"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loadingInquiries || loadingDestinations ? 'animate-spin' : ''}`}
              />
              <span>Refresh</span>
            </button>
            {activeTab === 'inquiries' && (
              <button
                onClick={exportCSV}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold via-brand-goldLight to-brand-gold hover:brightness-105 text-[#061410] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            )}
            {activeTab === 'destinations' && (
              <button
                onClick={openAddDestination}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold via-brand-goldLight to-brand-gold hover:brightness-105 text-[#061410] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Destination</span>
              </button>
            )}
            <button
              onClick={handleSignOut}
              className="px-4 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-950/70 text-red-300 hover:text-red-200 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors border border-red-500/30"
              title="Lock suite & sign out"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-4 border-b border-[#D4AF37]/15 pb-4">
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2.5 ${
              activeTab === 'inquiries'
                ? 'bg-brand-gold text-[#061410] shadow-[0_2px_15px_rgba(212,175,55,0.3)]'
                : 'bg-black/30 text-neutral-400 hover:text-white border border-white/5'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Client Inquiries & CRM</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                activeTab === 'inquiries'
                  ? 'bg-[#061410] text-brand-gold'
                  : 'bg-brand-gold/15 text-brand-gold'
              }`}
            >
              {inquiries.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('destinations')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2.5 ${
              activeTab === 'destinations'
                ? 'bg-brand-gold text-[#061410] shadow-[0_2px_15px_rgba(212,175,55,0.3)]'
                : 'bg-black/30 text-neutral-400 hover:text-white border border-white/5'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Destinations & Pricing CMS</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                activeTab === 'destinations'
                  ? 'bg-[#061410] text-brand-gold'
                  : 'bg-brand-gold/15 text-brand-gold'
              }`}
            >
              {destinations.length}
            </span>
          </button>
        </div>

        {/* ================================================================= */}
        {/* TAB 1: CLIENT INQUIRIES & CRM                                    */}
        {/* ================================================================= */}
        {activeTab === 'inquiries' && (
          <div className="space-y-8">
            {/* Executive Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-[#0B2019]/80 p-6 rounded-2xl border border-[#D4AF37]/20 space-y-2 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400 uppercase tracking-[0.2em] font-semibold">
                    Total VIP Inquiries
                  </span>
                  <Sparkles className="w-4 h-4 text-brand-gold" />
                </div>
                <div className="text-3xl font-serif font-bold text-white">{inquiries.length}</div>
                <p className="text-[11px] text-neutral-500">All registered consultation requests</p>
              </div>

              <div className="bg-[#0B2019]/80 p-6 rounded-2xl border border-[#D4AF37]/20 space-y-2 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400 uppercase tracking-[0.2em] font-semibold">
                    Pending Concierge Action
                  </span>
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-gold animate-ping" />
                </div>
                <div className="text-3xl font-serif font-bold text-brand-gold">
                  {inquiries.filter((i) => i.status === 'NEW' || !i.status).length}
                </div>
                <p className="text-[11px] text-neutral-500">Requires personalized itinerary response</p>
              </div>

              <div className="bg-[#0B2019]/80 p-6 rounded-2xl border border-[#D4AF37]/20 space-y-2 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400 uppercase tracking-[0.2em] font-semibold">
                    Dynamic Pipeline Value
                  </span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-serif font-bold text-emerald-400">{formattedPipeline}</div>
                <p className="text-[11px] text-neutral-500">Calculated from active inquiry packages</p>
              </div>
            </div>

            {/* Inquiries Table */}
            <div className="bg-[#0B2019]/60 rounded-2xl border border-[#D4AF37]/20 overflow-hidden shadow-2xl backdrop-blur-md">
              <div className="p-6 border-b border-[#D4AF37]/15 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">
                    VIP Consultation Dossiers
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Captured via Bespoke Atelier, Destination pages & VIP Inquiry Modal
                  </p>
                </div>
                <span className="text-xs text-brand-gold font-mono px-3 py-1 rounded-full bg-black/40 border border-[#D4AF37]/30">
                  {inquiries.length} Record{inquiries.length === 1 ? '' : 's'}
                </span>
              </div>

              {loadingInquiries ? (
                <div className="p-16 text-center text-neutral-400 text-sm space-y-3">
                  <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto" />
                  <p>Decrypting confidential VIP dossiers...</p>
                </div>
              ) : inquiries.length === 0 ? (
                <div className="p-16 text-center space-y-3">
                  <CheckCircle className="w-10 h-10 text-brand-gold/60 mx-auto" />
                  <h4 className="font-serif text-lg text-white font-semibold">No Inquiries Found</h4>
                  <p className="text-neutral-400 text-xs max-w-sm mx-auto">
                    Submissions from the public website booking modal and custom itinerary requests will appear here instantly.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-black/50 text-neutral-300 uppercase tracking-[0.15em] font-semibold border-b border-[#D4AF37]/15">
                      <tr>
                        <th className="py-4 px-6">Client Dossier</th>
                        <th className="py-4 px-6">Direct Channels</th>
                        <th className="py-4 px-6">Destination & Dates</th>
                        <th className="py-4 px-6">Party & Requests</th>
                        <th className="py-4 px-6">Lead Status</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {inquiries.map((inq) => {
                        const statusKey = (inq.status || 'NEW').toUpperCase();
                        const badgeStyle = STATUS_STYLES[statusKey] || STATUS_STYLES.NEW;
                        return (
                          <tr key={inq.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-4 px-6 font-semibold text-white">
                              <div className="text-sm">{inq.name || inq.fullName}</div>
                              <span className="block text-[10px] text-brand-gold font-mono font-normal mt-0.5">
                                {inq.id}
                              </span>
                              <span className="text-[10px] text-neutral-500 font-mono">
                                {new Date(inq.createdAt).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            </td>
                            <td className="py-4 px-6 space-y-1">
                              <div className="flex items-center gap-1.5 text-neutral-300">
                                <Phone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                                <a href={`tel:${inq.phone}`} className="hover:underline font-mono">
                                  {inq.phone}
                                </a>
                              </div>
                              <div className="flex items-center gap-1.5 text-neutral-400">
                                <Mail className="w-3.5 h-3.5 text-brand-gold flex-shrink-0" />
                                <a href={`mailto:${inq.email}`} className="hover:underline">
                                  {inq.email}
                                </a>
                              </div>
                            </td>
                            <td className="py-4 px-6 space-y-1">
                              <div className="flex items-center gap-1.5 text-white font-medium">
                                <MapPin className="w-3.5 h-3.5 text-brand-gold flex-shrink-0" />
                                <span>{inq.destination || inq.destinationTitle}</span>
                              </div>
                              {inq.preferredDates && (
                                <div className="text-[11px] text-neutral-400">
                                  📅 {inq.preferredDates}
                                </div>
                              )}
                            </td>
                            <td className="py-4 px-6 text-neutral-300 max-w-xs font-light leading-relaxed">
                              <div className="flex items-center gap-1 text-white font-medium text-[11px] mb-1">
                                <Users className="w-3 h-3 text-brand-gold" />
                                <span>{inq.guests || inq.guestCount}</span>
                              </div>
                              <p className="line-clamp-2 text-[11px] text-neutral-400">
                                {inq.preferences || inq.specialRequests || 'Standard 100% Halal Gourmet & Private Family Sanctum'}
                              </p>
                            </td>
                            <td className="py-4 px-6">
                              <select
                                value={statusKey}
                                onChange={(e) => handleUpdateStatus(inq.id, e.target.value)}
                                className={`text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-lg border outline-none cursor-pointer ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                              >
                                <option value="NEW" className="bg-[#061410] text-amber-300">
                                  NEW
                                </option>
                                <option value="CONTACTED" className="bg-[#061410] text-sky-300">
                                  CONTACTED
                                </option>
                                <option value="CONFIRMED" className="bg-[#061410] text-emerald-300">
                                  CONFIRMED
                                </option>
                                <option value="ARCHIVED" className="bg-[#061410] text-neutral-400">
                                  ARCHIVED
                                </option>
                              </select>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <button
                                onClick={() => handleDeleteInquiry(inq.id)}
                                className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-200 border border-red-500/20 transition-colors"
                                title="Delete inquiry dossier"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: DESTINATIONS & PRICING CMS                                */}
        {/* ================================================================= */}
        {activeTab === 'destinations' && (
          <div className="space-y-8">
            {/* CMS Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-[#0B2019]/80 p-6 rounded-2xl border border-[#D4AF37]/20 space-y-2 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400 uppercase tracking-[0.2em] font-semibold">
                    Published Portfolios
                  </span>
                  <Globe className="w-4 h-4 text-brand-gold" />
                </div>
                <div className="text-3xl font-serif font-bold text-white">{destinations.length}</div>
                <p className="text-[11px] text-neutral-500">Active luxury halal journeys</p>
              </div>

              <div className="bg-[#0B2019]/80 p-6 rounded-2xl border border-[#D4AF37]/20 space-y-2 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400 uppercase tracking-[0.2em] font-semibold">
                    Custom Atelier Additions
                  </span>
                  <Compass className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-serif font-bold text-emerald-400">
                  {destinations.filter((d) => d.isCustom).length}
                </div>
                <p className="text-[11px] text-neutral-500">Added via Admin CMS Studio</p>
              </div>

              <div className="bg-[#0B2019]/80 p-6 rounded-2xl border border-[#D4AF37]/20 space-y-2 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400 uppercase tracking-[0.2em] font-semibold">
                    Published Price Range
                  </span>
                  <Tag className="w-4 h-4 text-brand-gold" />
                </div>
                <div className="text-2xl font-serif font-bold text-brand-gold">
                  ৳624,000 – ৳1,176,000
                </div>
                <p className="text-[11px] text-neutral-500">Calibrated against luxury standards</p>
              </div>
            </div>

            {/* Destinations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((dest) => (
                <div
                  key={dest.id}
                  className="bg-[#0B2019]/70 rounded-2xl border border-[#D4AF37]/25 overflow-hidden flex flex-col justify-between shadow-xl hover:border-[#D4AF37]/50 transition-all group"
                >
                  <div>
                    {/* Destination Image Preview */}
                    <div className="relative h-48 w-full overflow-hidden bg-black/40">
                      <img
                        src={dest.image}
                        alt={dest.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B2019] via-transparent to-transparent" />
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#061410]/80 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] uppercase font-bold tracking-widest">
                        {dest.tag || 'Bespoke'}
                      </div>
                      <div className="absolute bottom-3 left-3 text-xs text-white/90 font-medium">
                        📍 {dest.country} • {dest.region}
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between text-[11px] text-neutral-400">
                        <span>⏳ {dest.duration}</span>
                        {dest.isCustom && (
                          <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[9px] font-mono">
                            Custom CMS
                          </span>
                        )}
                      </div>
                      <h4 className="font-serif text-lg font-bold text-white group-hover:text-brand-gold transition-colors">
                        {dest.title}
                      </h4>
                      <p className="text-xs text-neutral-400 font-light line-clamp-2 leading-relaxed">
                        {dest.desc}
                      </p>
                      <div className="pt-2 flex items-baseline justify-between border-t border-white/10">
                        <span className="text-[11px] text-neutral-400">Starting Price:</span>
                        <div className="text-right">
                          <span className="font-serif font-bold text-brand-gold text-base">
                            {dest.priceBdt}
                          </span>
                          {dest.priceUsd && (
                            <span className="block text-[10px] text-neutral-400 font-mono">
                              {dest.priceUsd}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-4 bg-black/40 border-t border-white/5 flex items-center justify-between gap-3">
                    <button
                      onClick={() => openEditDestination(dest)}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors border border-[#D4AF37]/30"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Journey</span>
                    </button>
                    {dest.isCustom && (
                      <button
                        onClick={() => handleDeleteDestination(dest.id)}
                        className="py-2 px-3 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 text-xs font-semibold flex items-center justify-center transition-colors border border-red-500/20"
                        title="Delete Journey"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODAL: EDIT / ADD DESTINATION CMS DRAWER                         */}
        {/* ================================================================= */}
        {(editingDestination || isAddingDestination) && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0B2019] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => {
                  setEditingDestination(null);
                  setIsAddingDestination(false);
                }}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/5 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6 space-y-1">
                <span className="text-[10px] text-brand-gold uppercase tracking-[0.2em] font-semibold">
                  Atelier Journey Studio
                </span>
                <h3 className="font-serif text-2xl font-bold text-white">
                  {isAddingDestination ? 'Publish New Luxury Journey' : 'Edit Journey & Pricing'}
                </h3>
              </div>

              <form onSubmit={handleSaveDestination} className="space-y-4 text-xs">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Journey Title</label>
                  <input
                    type="text"
                    required
                    value={cmsFormData.title || ''}
                    onChange={(e) => setCmsFormData({ ...cmsFormData, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white outline-none focus:border-brand-gold"
                    placeholder="e.g. Matterhorn Majesty: Swiss Alpine Chalets"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1">Country</label>
                    <input
                      type="text"
                      required
                      value={cmsFormData.country || ''}
                      onChange={(e) => setCmsFormData({ ...cmsFormData, country: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white outline-none focus:border-brand-gold"
                      placeholder="e.g. Switzerland"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1">Region / City</label>
                    <input
                      type="text"
                      value={cmsFormData.region || ''}
                      onChange={(e) => setCmsFormData({ ...cmsFormData, region: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white outline-none focus:border-brand-gold"
                      placeholder="e.g. Zermatt & St. Moritz"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1">Duration</label>
                    <input
                      type="text"
                      value={cmsFormData.duration || ''}
                      onChange={(e) => setCmsFormData({ ...cmsFormData, duration: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white outline-none focus:border-brand-gold"
                      placeholder="e.g. 10 Days • 9 Nights"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1">Category / Tag</label>
                    <input
                      type="text"
                      value={cmsFormData.tag || ''}
                      onChange={(e) => setCmsFormData({ ...cmsFormData, tag: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white outline-none focus:border-brand-gold"
                      placeholder="e.g. Alpine Retreat"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1">Price (BDT)</label>
                    <input
                      type="text"
                      required
                      value={cmsFormData.priceBdt || ''}
                      onChange={(e) => setCmsFormData({ ...cmsFormData, priceBdt: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white outline-none focus:border-brand-gold"
                      placeholder="e.g. ৳1,020,000"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1">Price (USD)</label>
                    <input
                      type="text"
                      value={cmsFormData.priceUsd || ''}
                      onChange={(e) => setCmsFormData({ ...cmsFormData, priceUsd: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white outline-none focus:border-brand-gold"
                      placeholder="e.g. $8,500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Image URL</label>
                  <input
                    type="url"
                    required
                    value={cmsFormData.image || ''}
                    onChange={(e) => setCmsFormData({ ...cmsFormData, image: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white outline-none focus:border-brand-gold"
                    placeholder="https://images.unsplash.com/..."
                  />
                  {cmsFormData.image && (
                    <div className="mt-2 h-24 rounded-lg overflow-hidden border border-white/10">
                      <img src={cmsFormData.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={cmsFormData.desc || ''}
                    onChange={(e) => setCmsFormData({ ...cmsFormData, desc: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white outline-none focus:border-brand-gold resize-none"
                    placeholder="Bespoke highlights, private villa accommodations, and certified halal culinary details..."
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingDestination(null);
                      setIsAddingDestination(false);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 font-semibold uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingCms}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold via-brand-goldLight to-brand-gold text-[#061410] font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg disabled:opacity-60"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingCms ? 'Saving Changes...' : 'Save & Deploy'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
