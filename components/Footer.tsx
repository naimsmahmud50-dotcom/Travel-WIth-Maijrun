'use client';

import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck,
  Github,
  Linkedin,
  Facebook,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [activeModal, setActiveModal] = useState<'privacy' | 'halal' | 'terms' | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setFeedbackMessage('Please enter a valid private email address.');
      return;
    }

    setStatus('loading');
    setFeedbackMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
        setFeedbackMessage(
          'Marhaban! Your invitation to our 2026 Black Book of Private Journeys has been dispatched.'
        );
        setEmail('');
      } else {
        setStatus('error');
        setFeedbackMessage(data.error || 'Unable to complete reservation. Please try again.');
      }
    } catch {
      setStatus('error');
      setFeedbackMessage('Connection error. Please reach out directly to our WhatsApp concierge.');
    }
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <footer className="bg-[#061410] text-white border-t border-[#D4AF37]/20 pt-20 pb-12 relative overflow-hidden">
        {/* Subtle background ambient radial glow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#D4AF37]/5 blur-[140px] pointer-events-none rounded-full"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          
          {/* ================= 1. NEWSLETTER SECTION ================= */}
          <div className="bg-[#0B2019]/90 backdrop-blur-xl rounded-2xl p-8 sm:p-12 border border-[#D4AF37]/30 mb-16 shadow-2xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-2 max-w-xl text-center lg:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] tracking-[0.25em] uppercase font-bold">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  <span>Private Society Newsletter</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-white tracking-wide">
                  Receive Our Curated 2026 Black Book of Journeys
                </h3>
                <p className="text-neutral-300 text-xs sm:text-sm font-light leading-relaxed">
                  Unpublished private island villas, upcoming royal Umrah itineraries, and bespoke invitations sent monthly.
                </p>
              </div>

              {/* Newsletter Form */}
              <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full sm:w-80">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status !== 'idle') setStatus('idle');
                    }}
                    required
                    placeholder="Enter your private email"
                    disabled={status === 'loading'}
                    className="w-full px-5 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-neutral-400 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all disabled:opacity-50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#061410] font-semibold text-xs tracking-widest uppercase px-8 py-3.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-[#D4AF37]/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                >
                  {status === 'loading' ? 'Reserving...' : 'Subscribe'}
                </button>
              </form>
            </div>

            {/* Feedback notification */}
            {status === 'success' && (
              <div className="mt-4 p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{feedbackMessage}</span>
              </div>
            )}
            {status === 'error' && (
              <div className="mt-4 p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{feedbackMessage}</span>
              </div>
            )}
          </div>

          {/* ================= 2. LINKS GRID ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-white/10">
            
            {/* Col 1 & 2: Brand & Founder Narrative */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="font-serif text-2xl font-bold tracking-tight text-white uppercase flex items-center gap-2">
                <span>Travel With Maijrun</span>
              </h4>
              <p className="text-neutral-300 text-xs font-light leading-relaxed max-w-sm">
                Curating world-class bespoke luxury journeys, royal pilgrimages, and sacred historical expeditions under strict 100% Halal hospitality standards.
              </p>
              
              <div className="text-xs text-neutral-400 font-light pt-1">
                <span className="text-[#D4AF37] font-medium">Founder & Executive Director:</span>{' '}
                <span className="text-white font-medium">Sheikh Mahmud Hasan</span>
              </div>

              {/* Accreditations */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs text-[#D4AF37] font-medium">Accredited:</span>
                <span className="text-[11px] bg-white/5 border border-white/10 px-2.5 py-1 rounded text-neutral-300">
                  IATA Accredited
                </span>
                <span className="text-[11px] bg-white/5 border border-white/10 px-2.5 py-1 rounded text-neutral-300">
                  Halal Tourism Alliance
                </span>
              </div>

              {/* Social Channels */}
              <div className="pt-3 flex items-center gap-3">
                <a
                  href="https://github.com/naimsmahmud50-dotcom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/15 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#061410] text-neutral-300 flex items-center justify-center transition-all"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="https://www.linkedin.com/in/mahmud-hasan-687908269/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/15 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#061410] text-neutral-300 flex items-center justify-center transition-all"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61594545143334"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/15 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#061410] text-neutral-300 flex items-center justify-center transition-all"
                  aria-label="Facebook Profile"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/8801767850859?text=Salam,%20I%20would%20like%20to%20inquire%20about%20a%20luxury%20halal%20journey%20with%20Travel%20With%20Maijrun"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-emerald-950/60 border border-emerald-500/40 hover:bg-emerald-600 hover:text-white text-emerald-400 flex items-center justify-center transition-all"
                  aria-label="Direct WhatsApp Concierge"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Col 3: Destinations */}
            <div className="space-y-3">
              <h5 className="text-xs tracking-[0.2em] uppercase font-bold text-[#D4AF37]">Destinations</h5>
              <ul className="space-y-2 text-xs text-neutral-300 font-light">
                <li>
                  <a
                    href="#destinations"
                    onClick={(e) => handleSmoothScroll(e, 'destinations')}
                    className="hover:text-[#D4AF37] transition-colors"
                  >
                    Makkah &amp; Madinah Royal
                  </a>
                </li>
                <li>
                  <a
                    href="#destinations"
                    onClick={(e) => handleSmoothScroll(e, 'destinations')}
                    className="hover:text-[#D4AF37] transition-colors"
                  >
                    Andalusia &amp; Granada
                  </a>
                </li>
                <li>
                  <a
                    href="#destinations"
                    onClick={(e) => handleSmoothScroll(e, 'destinations')}
                    className="hover:text-[#D4AF37] transition-colors"
                  >
                    Maldives Private Atolls
                  </a>
                </li>
                <li>
                  <a
                    href="#destinations"
                    onClick={(e) => handleSmoothScroll(e, 'destinations')}
                    className="hover:text-[#D4AF37] transition-colors"
                  >
                    Bosphorus &amp; Bodrum
                  </a>
                </li>
                <li>
                  <a
                    href="#destinations"
                    onClick={(e) => handleSmoothScroll(e, 'destinations')}
                    className="hover:text-[#D4AF37] transition-colors"
                  >
                    Swiss Alpine Chalets
                  </a>
                </li>
                <li>
                  <a
                    href="#destinations"
                    onClick={(e) => handleSmoothScroll(e, 'destinations')}
                    className="hover:text-[#D4AF37] transition-colors"
                  >
                    Serengeti Safari Tents
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Expedition Styles */}
            <div className="space-y-3">
              <h5 className="text-xs tracking-[0.2em] uppercase font-bold text-[#D4AF37]">Expedition Styles</h5>
              <ul className="space-y-2 text-xs text-neutral-300 font-light">
                <li>
                  <a
                    href="#bespoke-tailored"
                    onClick={(e) => handleSmoothScroll(e, 'bespoke-tailored')}
                    className="hover:text-[#D4AF37] transition-colors"
                  >
                    Private Aviation &amp; Jets
                  </a>
                </li>
                <li>
                  <a
                    href="#signature-journeys"
                    onClick={(e) => handleSmoothScroll(e, 'signature-journeys')}
                    className="hover:text-[#D4AF37] transition-colors"
                  >
                    Sacred Royal Umrah
                  </a>
                </li>
                <li>
                  <a
                    href="#bespoke-tailored"
                    onClick={(e) => handleSmoothScroll(e, 'bespoke-tailored')}
                    className="hover:text-[#D4AF37] transition-colors"
                  >
                    Secluded Honeymoons
                  </a>
                </li>
                <li>
                  <a
                    href="#bespoke-tailored"
                    onClick={(e) => handleSmoothScroll(e, 'bespoke-tailored')}
                    className="hover:text-[#D4AF37] transition-colors"
                  >
                    Multi-Gen Family Havens
                  </a>
                </li>
                <li>
                  <a
                    href="#bespoke-tailored"
                    onClick={(e) => handleSmoothScroll(e, 'bespoke-tailored')}
                    className="hover:text-[#D4AF37] transition-colors"
                  >
                    Yacht &amp; Coastal Charters
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 5: VIP Concierge (Mahmud Hasan's Authentic Information) */}
            <div className="space-y-3">
              <h5 className="text-xs tracking-[0.2em] uppercase font-bold text-[#D4AF37]">VIP Concierge</h5>
              <div className="space-y-2.5 text-xs text-neutral-300 font-light">
                <div className="flex items-start gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#D4AF37] mt-0.5 shrink-0" />
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Direct Hotline:</span>
                    <a
                      href="tel:+8801767850859"
                      className="text-white hover:text-[#D4AF37] font-medium transition-colors"
                    >
                      +880 1767-850859
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-neutral-400 block text-[11px]">WhatsApp Concierge:</span>
                    <a
                      href="https://wa.me/8801767850859?text=Salam,%20I%20would%20like%20to%20inquire%20about%20a%20luxury%20halal%20journey%20with%20Travel%20With%20Maijrun"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-emerald-300 font-medium transition-colors inline-flex items-center gap-1"
                    >
                      <span>+880 1767-850859</span>
                      <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#D4AF37] mt-0.5 shrink-0" />
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Private Desk:</span>
                    <a
                      href="mailto:naimsmahmud50@gmail.com"
                      className="text-white hover:text-[#D4AF37] font-medium transition-colors break-all"
                    >
                      naimsmahmud50@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37] mt-0.5 shrink-0" />
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Global Headquarters:</span>
                    <span className="text-neutral-300">Gulshan Avenue, Dhaka, Bangladesh</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ================= 3. COPYRIGHT & LEGAL ACTION BUTTONS ================= */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-4">
            <p className="text-center sm:text-left">
              &copy; {new Date().getFullYear()} Travel With Maijrun Ltd. Founded by Sheikh Mahmud Hasan. All Rights Reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <button
                type="button"
                onClick={() => setActiveModal('privacy')}
                className="hover:text-[#D4AF37] transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={() => setActiveModal('halal')}
                className="hover:text-[#D4AF37] transition-colors cursor-pointer"
              >
                Halal Certification Guarantee
              </button>
              <button
                type="button"
                onClick={() => setActiveModal('terms')}
                className="hover:text-[#D4AF37] transition-colors cursor-pointer"
              >
                Terms of Luxury Service
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* ================= 4. INTERACTIVE POLICY DIALOG MODALS ================= */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-[#0B2019] border border-[#D4AF37]/40 rounded-2xl p-6 sm:p-8 max-w-lg w-full text-white shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {activeModal === 'privacy' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#D4AF37]">
                  <ShieldCheck className="w-5 h-5" />
                  <h3 className="font-serif text-xl font-bold">Privacy Policy &amp; Non-Disclosure</h3>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Travel With Maijrun operates under absolute client confidentiality. We maintain strict zero-disclosure protocols for high-profile travelers, royal families, and dignitaries.
                </p>
                <ul className="text-xs text-neutral-400 space-y-1.5 list-disc pl-4">
                  <li>Personal details and itineraries are never shared with unauthorized third parties.</li>
                  <li>Direct encrypted communication channels via private concierge desk.</li>
                  <li>Inquiries can be conducted under confidential Non-Disclosure Agreements (NDAs).</li>
                </ul>
              </div>
            )}

            {activeModal === 'halal' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#D4AF37]">
                  <ShieldCheck className="w-5 h-5" />
                  <h3 className="font-serif text-xl font-bold">Halal Certification Guarantee</h3>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Every villa, private retreat, resort, and gastronomic arrangement in our portfolio is rigorously audited and certified under Islamic hospitality guidelines.
                </p>
                <ul className="text-xs text-neutral-400 space-y-1.5 list-disc pl-4">
                  <li>100% Zabihah Halal hand-slaughtered meat options curated by Michelin-trained chefs.</li>
                  <li>Strictly alcohol-free villas and private dining environments upon request.</li>
                  <li>Guaranteed zero-sightline privacy in private swimming pools and family suites.</li>
                  <li>Salah-synchronized itineraries with exact Qibla orientation and prayer accommodations.</li>
                </ul>
              </div>
            )}

            {activeModal === 'terms' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#D4AF37]">
                  <ShieldCheck className="w-5 h-5" />
                  <h3 className="font-serif text-xl font-bold">Terms of Luxury Service</h3>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Bespoke reservations are crafted exclusively through one-on-one consultation with our dedicated travel artisans led by Sheikh Mahmud Hasan.
                </p>
                <ul className="text-xs text-neutral-400 space-y-1.5 list-disc pl-4">
                  <li>Complimentary itinerary revisions during the initial bespoke design phase.</li>
                  <li>Dedicated 24/7 Butler &amp; VIP Concierge retinue assigned throughout your expedition.</li>
                  <li>VIP tarmac limousine transfers and discreet private aviation coordination.</li>
                </ul>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 rounded-full bg-[#D4AF37] text-[#061410] text-xs font-semibold uppercase tracking-wider hover:bg-[#F3E5AB] transition-all cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
