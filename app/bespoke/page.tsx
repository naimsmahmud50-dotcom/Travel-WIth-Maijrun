'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  Sparkles,
  Calendar,
  Users,
  ShieldCheck,
  Plane,
  Utensils,
  EyeOff,
  BookOpen,
  Car,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Send,
  Lock,
  Phone,
  HeartHandshake
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InquiryModal from '@/components/InquiryModal';

const SANCTUARIES = [
  {
    id: 'makkah',
    title: 'The Sacred Sanctuaries',
    subtitle: 'Makkah & Madinah Royal Umrah',
    tag: 'Spiritual Elevation',
    image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'spain',
    title: 'Echoes of Al-Andalus',
    subtitle: 'Granada, Cordoba, Seville',
    tag: 'Moorish Heritage',
    image: 'https://images.unsplash.com/photo-1583200424564-94676644fcf6?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'maldives',
    title: 'The Pearl Pavilions',
    subtitle: 'Private Overwater Island Sanctuary',
    tag: 'Seclusion & Ocean',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'switzerland',
    title: 'Matterhorn Majesty',
    subtitle: 'Zermatt, Lake Geneva, Interlaken',
    tag: 'Alpine Luxury',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'turkey',
    title: 'Sultans of the Bosphorus',
    subtitle: 'Istanbul, Bosphorus Yacht, Cappadocia',
    tag: 'Ottoman Grandeur',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'safari',
    title: 'The Great Migration',
    subtitle: 'Serengeti & Ngorongoro Tented Haven',
    tag: 'Wildlife Luxury',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'custom',
    title: 'Custom Multi-Country Charter',
    subtitle: 'Unrestricted Global Royal Itinerary',
    tag: 'Bespoke Atelier',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800&auto=format&fit=crop',
  },
];

const PRIVILEGES = [
  {
    id: 'private_jet',
    title: 'Private Jet / First-Class Escort',
    desc: 'Dedicated tarmac limousine and charter handling',
    icon: Plane,
  },
  {
    id: 'halal_chef',
    title: 'Private Halal Executive Chef',
    desc: 'Michelin-pedigree 100% certified halal private dining',
    icon: Utensils,
  },
  {
    id: 'zero_sightline',
    title: 'Guaranteed Zero-Sightline Seclusion',
    desc: 'Enclosed family infinity pools with zero outside visibility',
    icon: EyeOff,
  },
  {
    id: 'scholar',
    title: 'Islamic Scholar on Retinue',
    desc: 'Historical context, spiritual guidance & low-crowd Umrah choreography',
    icon: BookOpen,
  },
  {
    id: 'chauffeured_fleet',
    title: 'Private Chauffeured Luxury Fleet',
    desc: 'GMC Yukon XL / Mercedes Maybach with courteous driver',
    icon: Car,
  },
  {
    id: 'prayer_pacing',
    title: 'Salah-Paced Sacred Timeline',
    desc: 'Every tour, transfer, and meal choreographed around prayer times',
    icon: Compass,
  },
];

export default function BespokePage() {
  const [step, setStep] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [selectedSanctuary, setSelectedSanctuary] = useState('makkah');
  const [travelStyle, setTravelStyle] = useState('Royal Family Sanctuary');
  const [targetSeason, setTargetSeason] = useState('Ramadan 2026');
  const [duration, setDuration] = useState('10 - 14 Days');
  const [guestCount, setGuestCount] = useState('4 Guests (Family)');
  const [specialElders, setSpecialElders] = useState(false);
  const [selectedPrivileges, setSelectedPrivileges] = useState<string[]>([
    'halal_chef',
    'zero_sightline',
    'prayer_pacing',
  ]);

  // Step 4 contact details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [residence, setResidence] = useState('Bangladesh');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const togglePrivilege = (id: string) => {
    setSelectedPrivileges((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    const sanctuaryObj = SANCTUARIES.find((s) => s.id === selectedSanctuary);
    const destinationTitle = sanctuaryObj ? sanctuaryObj.title : 'Bespoke Royal Journey';

    const privilegesText = selectedPrivileges
      .map((pid) => PRIVILEGES.find((p) => p.id === pid)?.title)
      .filter(Boolean)
      .join(', ');

    const dossierNotes = `[Bespoke Atelier Request]
Style: ${travelStyle}
Season: ${targetSeason}
Duration: ${duration}
Guests: ${guestCount} (Elders/Wheelchair Support: ${specialElders ? 'Yes' : 'No'})
Privileges: ${privilegesText}
Residence: ${residence}
Notes: ${additionalNotes}`;

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          fullName,
          email,
          phone,
          destination: `[Atelier] ${destinationTitle}`,
          destinationTitle: `[Atelier] ${destinationTitle}`,
          preferredDates: `${targetSeason} • ${duration}`,
          guests: guestCount,
          guestCount,
          preferences: dossierNotes,
          specialRequests: dossierNotes,
        }),
      });

      if (!response.ok) {
        throw new Error('Could not submit dossier to concierge. Please connect with us directly via phone or WhatsApp.');
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Submission error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0B2019] flex flex-col font-sans selection:bg-[#D4AF37] selection:text-[#0B2019]">
      <Navbar onOpenInquiry={() => setModalOpen(true)} />

      {/* ATELIER HERO */}
      <section className="relative pt-[116px] lg:pt-[126px] pb-16 bg-[#0B2019] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-neutral-400 mb-2">
            <Link href="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
            <span className="text-[#D4AF37]">•</span>
            <span className="text-white font-semibold">Tailor-Made Atelier</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold tracking-[0.25em] uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Private Commission Desk</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-bold tracking-tight">
            Tailor-Made Royal Atelier
          </h1>

          <p className="text-neutral-300 text-sm sm:text-base lg:text-lg font-light max-w-2xl mx-auto leading-relaxed">
            Every family is unique. Hand-craft your personal sanctuary itinerary with verified 100% Halal catering, private villa seclusion, and dedicated 24/7 butler retinue.
          </p>
        </div>
      </section>

      {/* 4-STEP WIZARD PROGRESS DOCK */}
      <div className="bg-white border-b border-neutral-200 sticky top-[68px] lg:top-[78px] z-30 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { stepNum: 1, label: '1. Sanctuary & Vibe' },
              { stepNum: 2, label: '2. Timing & Guests' },
              { stepNum: 3, label: '3. VIP Privileges' },
              { stepNum: 4, label: '4. Confidential Dossier' },
            ].map((s) => (
              <button
                key={s.stepNum}
                type="button"
                onClick={() => {
                  if (s.stepNum < step || (s.stepNum === 2 && selectedSanctuary)) {
                    setStep(s.stepNum);
                  }
                }}
                className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all cursor-pointer ${
                  step === s.stepNum
                    ? 'bg-[#0B2019] text-[#D4AF37] font-bold shadow-xs'
                    : step > s.stepNum
                    ? 'text-neutral-700 hover:bg-neutral-100 font-medium'
                    : 'text-neutral-400 pointer-events-none'
                }`}
              >
                <span className="text-[10px] sm:text-xs tracking-wider uppercase truncate">
                  {s.label}
                </span>
                <span className={`h-1 w-full mt-1.5 rounded-full ${
                  step === s.stepNum ? 'bg-[#D4AF37]' : step > s.stepNum ? 'bg-emerald-700' : 'bg-neutral-200'
                }`} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN STEP CONTENT */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {isSubmitted ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-emerald-300 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center border-2 border-emerald-500">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.25em] text-[#8C6B14] font-bold">
                Royal Commission Logged
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#0B2019] font-bold">
                Your Bespoke Dossier Has Been Received
              </h2>
              <p className="text-neutral-600 text-sm sm:text-base font-light max-w-lg mx-auto leading-relaxed">
                Thank you, <strong>{fullName}</strong>. Our Private Client Director is curating your personalized itinerary options for <strong>{SANCTUARIES.find((s) => s.id === selectedSanctuary)?.title}</strong>.
              </p>
            </div>

            <div className="bg-[#FAF8F5] rounded-2xl p-6 border border-[#D4AF37]/30 max-w-md mx-auto text-left space-y-2 text-xs text-neutral-700">
              <div className="flex justify-between">
                <span className="text-neutral-400 uppercase font-semibold">Lead Guest:</span>
                <span className="font-bold text-[#0B2019]">{fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400 uppercase font-semibold">Direct WhatsApp:</span>
                <span className="font-bold text-[#0B2019]">{phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400 uppercase font-semibold">Target Timeline:</span>
                <span className="font-bold text-[#0B2019]">{targetSeason} ({duration})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400 uppercase font-semibold">Priority Concierge:</span>
                <span className="font-bold text-[#D4AF37]">Active (Fast-Tracked)</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`https://wa.me/8801767850859?text=Salam,%20I%20have%20submitted%20my%20bespoke%20dossier%20under%20${encodeURIComponent(fullName)}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#0B2019] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#061410] font-sans text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Chat Directly with Founder Concierge</span>
              </a>

              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-neutral-300 text-neutral-700 hover:border-[#0B2019] font-sans text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200 shadow-lg">
            
            {/* STEP 1: SANCTUARY SELECTION */}
            {step === 1 && (
              <div className="space-y-8">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C6B14] font-bold block mb-1">
                    Step 1 of 4
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-[#0B2019] font-bold">
                    Select Your Desired Sanctuary
                  </h2>
                  <p className="text-neutral-500 text-xs sm:text-sm font-light mt-1">
                    Choose one of our signature realms, or commission a completely custom multi-destination voyage.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {SANCTUARIES.map((sanctuary) => {
                    const isSelected = selectedSanctuary === sanctuary.id;
                    return (
                      <div
                        key={sanctuary.id}
                        onClick={() => setSelectedSanctuary(sanctuary.id)}
                        className={`group relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-300 p-4 flex gap-4 items-center ${
                          isSelected
                            ? 'border-[#D4AF37] bg-[#D4AF37]/5 shadow-md scale-[1.01]'
                            : 'border-neutral-200 hover:border-neutral-400 bg-white'
                        }`}
                      >
                        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 relative">
                          <img
                            src={sanctuary.image}
                            alt={sanctuary.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] uppercase tracking-wider font-bold text-[#8C6B14] block">
                            {sanctuary.tag}
                          </span>
                          <h3 className="font-serif text-base sm:text-lg font-bold text-[#0B2019] truncate">
                            {sanctuary.title}
                          </h3>
                          <p className="text-neutral-500 text-xs truncate mt-0.5">{sanctuary.subtitle}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-[#0B2019] bg-[#0B2019] text-[#D4AF37]' : 'border-neutral-300'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Travel Style Selector */}
                <div className="pt-4 border-t border-neutral-200">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0B2019] mb-3">
                    Preferred Travel Atmosphere & Vibe
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      'Royal Family Sanctuary',
                      'Romantic Honeymoon Seclusion',
                      'Spiritual Umrah & Heritage',
                      'Multi-Generational Luxury',
                    ].map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => setTravelStyle(style)}
                        className={`p-3 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer ${
                          travelStyle === style
                            ? 'bg-[#0B2019] text-[#D4AF37] shadow-xs'
                            : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-3 rounded-full bg-[#0B2019] hover:bg-[#D4AF37] text-white hover:text-[#061410] font-sans text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Proceed to Timing & Dynamics</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: DATES & GUEST COUNT */}
            {step === 2 && (
              <div className="space-y-8">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C6B14] font-bold block mb-1">
                    Step 2 of 4
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-[#0B2019] font-bold">
                    Dates, Duration & Guest Dynamics
                  </h2>
                  <p className="text-neutral-500 text-xs sm:text-sm font-light mt-1">
                    Help us coordinate private suite availability and prayer-paced flight schedules.
                  </p>
                </div>

                {/* Season Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0B2019] mb-3">
                    Target Departure Window
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      'Ramadan 2026 (Sacred Weeks)',
                      'Eid al-Fitr 2026',
                      'Summer Holidays 2026',
                      'Autumn / Winter 2026',
                      'December / New Year',
                      'Spring 2027',
                    ].map((season) => (
                      <button
                        key={season}
                        type="button"
                        onClick={() => setTargetSeason(season)}
                        className={`p-3.5 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer border ${
                          targetSeason === season
                            ? 'bg-[#0B2019] text-[#D4AF37] border-[#0B2019] shadow-xs'
                            : 'bg-white hover:bg-neutral-50 text-neutral-700 border-neutral-200'
                        }`}
                      >
                        {season}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0B2019] mb-3">
                    Ideal Voyage Duration
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {['7 - 9 Days', '10 - 14 Days', '15 - 21 Days', '21+ Days Grand Tour'].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDuration(d)}
                        className={`p-3 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer border ${
                          duration === d
                            ? 'bg-[#0B2019] text-[#D4AF37] border-[#0B2019]'
                            : 'bg-white hover:bg-neutral-50 text-neutral-700 border-neutral-200'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Guest Composition */}
                <div className="space-y-4 pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0B2019]">
                    Party Size & Demographics
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      '2 Guests (Couple)',
                      '3 - 5 Guests (Immediate Family)',
                      '6 - 12+ Guests (Extended Royal Retinue)',
                    ].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGuestCount(g)}
                        className={`p-3.5 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer border ${
                          guestCount === g
                            ? 'bg-[#0B2019] text-[#D4AF37] border-[#0B2019]'
                            : 'bg-white hover:bg-neutral-50 text-neutral-700 border-neutral-200'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <HeartHandshake className="w-5 h-5 text-[#8C6B14]" />
                      <div>
                        <h4 className="text-xs font-bold text-[#0B2019]">Senior Elders / Mobility Support Required</h4>
                        <p className="text-[11px] text-neutral-500">Provide personal wheelchairs and gentle pacing during Haram Tawaf and palace stairs</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={specialElders}
                      onChange={(e) => setSpecialElders(e.target.checked)}
                      className="w-5 h-5 accent-[#0B2019] cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-6 py-3 rounded-full border border-neutral-300 text-neutral-700 font-sans text-xs font-semibold uppercase tracking-wider hover:border-[#0B2019] transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-3 rounded-full bg-[#0B2019] hover:bg-[#D4AF37] text-white hover:text-[#061410] font-sans text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Proceed to VIP Privileges</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: VIP PRIVILEGES */}
            {step === 3 && (
              <div className="space-y-8">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C6B14] font-bold block mb-1">
                    Step 3 of 4
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-[#0B2019] font-bold">
                    Select Bespoke VIP Privileges
                  </h2>
                  <p className="text-neutral-500 text-xs sm:text-sm font-light mt-1">
                    Choose the sacred standards and high-luxury arrangements you wish integrated into your itinerary.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {PRIVILEGES.map((p) => {
                    const isSelected = selectedPrivileges.includes(p.id);
                    const IconComp = p.icon;
                    return (
                      <div
                        key={p.id}
                        onClick={() => togglePrivilege(p.id)}
                        className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex gap-4 items-start ${
                          isSelected
                            ? 'border-[#D4AF37] bg-[#D4AF37]/5 shadow-xs'
                            : 'border-neutral-200 hover:border-neutral-300 bg-white'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#0B2019] text-[#D4AF37]' : 'bg-neutral-100 text-neutral-600'
                        }`}>
                          <IconComp className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-serif text-base font-bold text-[#0B2019] leading-tight">
                            {p.title}
                          </h3>
                          <p className="text-neutral-500 text-xs mt-1 leading-relaxed">
                            {p.desc}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          readOnly
                          className="w-5 h-5 accent-[#0B2019] shrink-0 mt-0.5 pointer-events-none"
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between pt-4 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-6 py-3 rounded-full border border-neutral-300 text-neutral-700 font-sans text-xs font-semibold uppercase tracking-wider hover:border-[#0B2019] transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-3 rounded-full bg-[#0B2019] hover:bg-[#D4AF37] text-white hover:text-[#061410] font-sans text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Proceed to Dossier Submission</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: CONFIDENTIAL SUBMISSION */}
            {step === 4 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C6B14] font-bold block mb-1">
                    Step 4 of 4
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-[#0B2019] font-bold">
                    Transmit Your Confidential Dossier
                  </h2>
                  <p className="text-neutral-500 text-xs sm:text-sm font-light mt-1">
                    Your details are encrypted and handled exclusively by our executive client directorate under NDA standards.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0B2019] mb-1">
                      Lead Guest Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Al-Haj Mahmud Rahman"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-hidden focus:border-[#D4AF37] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0B2019] mb-1">
                      Direct WhatsApp / Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+880 1767-850859"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-hidden focus:border-[#D4AF37] text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0B2019] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="vip@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-hidden focus:border-[#D4AF37] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0B2019] mb-1">
                      Country of Residence
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bangladesh / United Kingdom / UAE"
                      value={residence}
                      onChange={(e) => setResidence(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-hidden focus:border-[#D4AF37] text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0B2019] mb-1">
                    Confidential Dietary, Villa or Flight Notes
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Specific halal certification requests, wheelchair needs, connecting suites, security details..."
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-hidden focus:border-[#D4AF37] text-sm resize-none"
                  />
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#D4AF37]/30 text-xs text-neutral-600 flex items-center gap-3">
                  <Lock className="w-5 h-5 text-[#8C6B14] shrink-0" />
                  <span>
                    <strong>Strict Discretion Guarantee:</strong> Your information is never shared with external brokers or third-party marketing networks.
                  </span>
                </div>

                <div className="flex justify-between pt-4 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-6 py-3 rounded-full border border-neutral-300 text-neutral-700 font-sans text-xs font-semibold uppercase tracking-wider hover:border-[#0B2019] transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3.5 rounded-full bg-[#0B2019] hover:bg-[#D4AF37] text-white hover:text-[#061410] font-sans text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Encrypting & Sending...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Commission My Royal Itinerary</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        )}
      </main>

      <Footer />

      <InquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
