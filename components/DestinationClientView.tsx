'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Calendar,
  Clock,
  Compass,
  MapPin,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Phone,
  ArrowRight,
  Send,
  Lock,
  Utensils,
  EyeOff,
  UserCheck
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InquiryModal from '@/components/InquiryModal';
import { DetailedDestination } from '@/lib/destination-details';
import { useCurrency } from '@/context/CurrencyContext';

interface DestinationClientViewProps {
  destination: DetailedDestination;
}

export default function DestinationClientView({ destination }: DestinationClientViewProps) {
  const { currency, formatBdt } = useCurrency();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTarget, setModalTarget] = useState<string | undefined>(destination.title);
  
  // Accordion state: default open Day 1 & Day 2
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({ 1: true, 2: true });

  // In-page inquiry form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    travelDates: '',
    guestsCount: '2 Guests',
    specialRequests: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const toggleDay = (dayNum: number) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayNum]: !prev[dayNum],
    }));
  };

  const expandAll = () => {
    const all: Record<number, boolean> = {};
    destination.itinerary.forEach((item) => {
      all[item.day] = true;
    });
    setExpandedDays(all);
  };

  const collapseAll = () => {
    setExpandedDays({});
  };

  const handleOpenModal = (topic?: string) => {
    setModalTarget(topic || destination.title);
    setModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          destinationTitle: destination.title,
          preferredDates: formData.travelDates,
          guestCount: formData.guestsCount,
          specialRequests: formData.specialRequests,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to transmit your confidential dossier. Please contact concierge directly.');
      }

      setSubmitSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        travelDates: '',
        guestsCount: '2 Guests',
        specialRequests: '',
      });
    } catch (err: any) {
      setSubmitError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0B2019] flex flex-col font-sans selection:bg-[#D4AF37] selection:text-[#0B2019]">
      <Navbar onOpenInquiry={handleOpenModal} />

      {/* LUXURY PANORAMIC HERO HEADER */}
      <section className="relative pt-[116px] lg:pt-[126px] pb-16 lg:pb-24 bg-[#061410] text-white overflow-hidden">
        {/* Ambient Hero Background with subtle zoom */}
        <div className="absolute inset-0 z-0">
          <img
            src={destination.heroImage}
            alt={destination.title}
            className="w-full h-full object-cover object-center opacity-40 scale-105 filter brightness-90 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061410] via-[#061410]/70 to-transparent" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#061410]/40 to-[#061410]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 mb-6">
            <Link href="/" className="hover:text-[#D4AF37] transition-colors">
              Home
            </Link>
            <span className="text-[#D4AF37]">•</span>
            <Link href="/#destinations" className="hover:text-[#D4AF37] transition-colors">
              Expeditions
            </Link>
            <span className="text-[#D4AF37]">•</span>
            <span className="text-white font-semibold truncate">{destination.country}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full bg-[#D4AF37] text-[#061410] text-[10px] sm:text-xs font-bold tracking-widest uppercase">
                  {destination.tag}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FAF8F5] text-[10px] sm:text-xs font-semibold tracking-wider uppercase">
                  {destination.region}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#0B2019] border border-[#D4AF37]/50 text-[#D4AF37] text-[10px] sm:text-xs font-bold tracking-wider uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  100% Halal Verified
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-bold tracking-tight leading-[1.1]">
                {destination.title}
              </h1>

              <p className="text-neutral-300 text-sm sm:text-base lg:text-lg font-light leading-relaxed max-w-3xl">
                {destination.overview}
              </p>
            </div>

            {/* Quick Price & Action Card */}
            <div className="lg:col-span-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-white shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-white/15">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-neutral-300 block">Expedition Length</span>
                  <div className="flex items-center gap-1.5 font-serif text-lg font-semibold text-white mt-0.5">
                    <Clock className="w-4 h-4 text-[#D4AF37]" />
                    <span>{destination.duration}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] uppercase tracking-wider text-neutral-300 block">Investment</span>
                  <span className="font-serif text-2xl font-bold text-[#D4AF37]">{formatBdt(destination.priceBdt)}</span>
                  <span className="text-xs text-neutral-300 block">
                    {currency === 'BDT' ? `(${destination.priceUsd} / guest)` : `(${destination.priceBdt} / guest)`}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => handleOpenModal()}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#061410] font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_4px_20px_rgba(212,175,55,0.4)] cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Request Custom Itinerary</span>
                </button>

                <a
                  href="#itinerary-schedule"
                  className="w-full py-3 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white font-sans text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 border border-white/15 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-[#D4AF37]" />
                  <span>View Day-by-Day Schedule</span>
                </a>
              </div>

              <div className="flex items-center justify-center gap-4 pt-1 text-[11px] text-neutral-300">
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Strictly Confidential
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Private Butler Included
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 SACRED HALAL PRIVILEGES ACCORD STRIP */}
      <section className="bg-[#0B2019] text-[#FAF8F5] border-y border-[#D4AF37]/30 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-white">100% Halal Gourmet</h4>
                <p className="text-neutral-400 text-xs font-light mt-0.5">Strictly alcohol-free private chef service</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                <EyeOff className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-white">Zero Sightlines</h4>
                <p className="text-neutral-400 text-xs font-light mt-0.5">Absolute privacy for family pool villas</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-white">Prayer Choreography</h4>
                <p className="text-neutral-400 text-xs font-light mt-0.5">Journeys aligned with daily Salah times</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-white">24/7 VIP Butler Retinue</h4>
                <p className="text-neutral-400 text-xs font-light mt-0.5">Dedicated concierge escort at every leg</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS & HALAL SPECIFICATIONS */}
      <section className="py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Curated Hallmarks */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#8C6B14] text-[10px] tracking-[0.25em] uppercase font-bold mb-3">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                <span>Exclusive Hallmarks</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#0B2019] font-bold">
                Bespoke Experiences Curated for Distinguished Families
              </h2>
            </div>

            <div className="space-y-4">
              {destination.highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs flex items-start gap-4 hover:border-[#D4AF37] transition-colors"
                >
                  <span className="w-8 h-8 rounded-full bg-[#0B2019] text-[#D4AF37] font-serif font-bold text-sm flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-neutral-700 text-sm sm:text-base font-medium leading-relaxed pt-1">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            {/* Sanctuary Villa Gallery */}
            <div className="space-y-4 pt-4">
              <h3 className="font-serif text-2xl text-[#0B2019] font-bold">Sanctuary Suites & Private Estate Views</h3>
              <div className="grid grid-cols-2 gap-4">
                {destination.gallery.map((imgUrl, i) => (
                  <div key={i} className="relative h-48 sm:h-64 rounded-2xl overflow-hidden group border border-neutral-200">
                    <img
                      src={imgUrl}
                      alt={`${destination.title} sanctuary view ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-white text-xs font-semibold uppercase tracking-wider">
                        Private Haven View {i + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Halal Certification & Direct Booking Card */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* The Maijrun Halal Charter Box */}
            <div className="bg-[#0B2019] text-white rounded-3xl p-8 border border-[#D4AF37]/35 shadow-xl relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-[#D4AF37]/10 pointer-events-none blur-2xl" />
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">The Maijrun Halal Guarantee</h3>
                  <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">100% Certified Assurance</span>
                </div>
              </div>

              <div className="space-y-3.5">
                {destination.halalInclusions.map((inclusion, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span className="text-neutral-200 text-xs sm:text-sm font-light leading-relaxed">
                      {inclusion}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">Personal Concierge Desk</span>
                  <a href="tel:+8801767850859" className="text-[#D4AF37] font-semibold text-sm hover:underline">
                    +880 1767-850859
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenModal()}
                  className="px-4 py-2 rounded-full bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#061410] font-sans text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Inquire Now
                </button>
              </div>
            </div>

            {/* In-Page Quick Reservation Form */}
            <div id="booking-inquiry" className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-md">
              <div className="mb-6">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C6B14] font-bold block mb-1">
                  Confidential Booking Desk
                </span>
                <h3 className="font-serif text-2xl text-[#0B2019] font-bold">
                  Reserve Your Private Dossier
                </h3>
                <p className="text-neutral-500 text-xs font-light mt-1">
                  Our private client director will contact you within 2 hours with customized villa options.
                </p>
              </div>

              {submitSuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-emerald-900">Dossier Received</h4>
                  <p className="text-emerald-700 text-xs leading-relaxed">
                    Thank you. Your bespoke inquiry for <strong>{destination.title}</strong> has been transmitted to our VIP director. We will connect directly via WhatsApp.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitSuccess(false)}
                    className="text-xs text-emerald-800 underline font-semibold mt-2 cursor-pointer"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {submitError && (
                    <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
                      {submitError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Tariq Al-Mansoor"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-hidden focus:border-[#D4AF37] text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="vip@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-hidden focus:border-[#D4AF37] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+880 1767-850859"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-hidden focus:border-[#D4AF37] text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                        Travel Window
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ramadan 2026 / Nov"
                        value={formData.travelDates}
                        onChange={(e) => setFormData({ ...formData, travelDates: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-hidden focus:border-[#D4AF37] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                        Party Size
                      </label>
                      <select
                        value={formData.guestsCount}
                        onChange={(e) => setFormData({ ...formData, guestsCount: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-hidden focus:border-[#D4AF37] text-sm bg-white"
                      >
                        <option>2 Guests (Couple / Executive)</option>
                        <option>3 - 5 Guests (Small Family)</option>
                        <option>6 - 12 Guests (Royal Extended Family)</option>
                        <option>12+ Guests (Private Charter Buyout)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                      Bespoke Privileges or Dietary Specifications
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Private jet charter, dedicated scholar, baby care, strict zero-sightline pool requirements..."
                      value={formData.specialRequests}
                      onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-hidden focus:border-[#D4AF37] text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-[#0B2019] hover:bg-[#D4AF37] text-white hover:text-[#061410] font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Transmitting Dossier...</span>
                    ) : (
                      <>
                        <span>Submit Confidential Dossier</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* INTERACTIVE DAY-BY-DAY ROYAL ITINERARY SCHEDULE */}
      <section id="itinerary-schedule" className="py-16 lg:py-24 bg-[#FAF8F5] border-t border-neutral-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-neutral-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#8C6B14] text-[10px] tracking-[0.25em] uppercase font-bold mb-2">
                <Calendar className="w-3 h-3 text-[#D4AF37]" />
                <span>Daily Royal Schedule</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#0B2019] font-bold">
                Day-by-Day Sacred Itinerary
              </h2>
              <p className="text-neutral-600 text-xs sm:text-sm font-light mt-1">
                Carefully paced around prayer windows, private entries, and luxury sanctuary relaxation.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={expandAll}
                className="text-xs uppercase tracking-wider font-semibold text-[#8C6B14] hover:text-[#0B2019] transition-colors cursor-pointer"
              >
                Expand All
              </button>
              <span className="text-neutral-400">|</span>
              <button
                type="button"
                onClick={collapseAll}
                className="text-xs uppercase tracking-wider font-semibold text-[#8C6B14] hover:text-[#0B2019] transition-colors cursor-pointer"
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* Accordion List */}
          <div className="space-y-4">
            {destination.itinerary.map((day) => {
              const isExpanded = !!expandedDays[day.day];
              return (
                <div
                  key={day.day}
                  className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs hover:border-[#D4AF37]/60 transition-all duration-300"
                >
                  <button
                    type="button"
                    onClick={() => toggleDay(day.day)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-neutral-50/70 transition-colors"
                  >
                    <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-[#0B2019] text-[#D4AF37] flex flex-col items-center justify-center shrink-0 border border-[#D4AF37]/30">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#FAF8F5]/70">Day</span>
                        <span className="font-serif text-lg font-bold leading-none">{day.day}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#8C6B14] uppercase tracking-wider">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{day.location}</span>
                        </div>
                        <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0B2019] mt-0.5 truncate">
                          {day.title}
                        </h3>
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 shrink-0">
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-[#D4AF37]" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-neutral-100 space-y-4">
                      <p className="text-neutral-700 text-sm sm:text-base font-light leading-relaxed">
                        {day.desc}
                      </p>

                      {day.highlights && day.highlights.length > 0 && (
                        <div className="bg-[#FAF8F5] rounded-xl p-4 border border-[#D4AF37]/20">
                          <span className="text-[10px] uppercase tracking-wider font-bold text-[#8C6B14] block mb-2">
                            Key Inclusions For Day {day.day}
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {day.highlights.map((h, hIdx) => (
                              <div key={hIdx} className="flex items-center gap-2 text-xs text-neutral-800">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                                <span>{h}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Navigation Return Link */}
          <div className="mt-12 text-center">
            <Link
              href="/#destinations"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0B2019] hover:text-[#D4AF37] transition-colors"
            >
              <span>← Return to All Curated Expeditions</span>
            </Link>
          </div>
        </div>
      </section>

      {/* WHATSAPP CONCIERGE DOCK */}
      <div className="sticky bottom-4 z-40 max-w-sm ml-auto mr-4 pointer-events-auto">
        <a
          href={`https://wa.me/8801767850859?text=Salam,%20I%20am%20interested%20in%20the%20${encodeURIComponent(destination.title)}%20journey.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-[#0B2019] text-white p-3.5 rounded-full border border-[#D4AF37]/50 shadow-2xl hover:bg-[#D4AF37] hover:text-[#061410] transition-all duration-300 group"
        >
          <div className="w-9 h-9 rounded-full bg-emerald-600 group-hover:bg-[#0B2019] flex items-center justify-center text-white shrink-0">
            <Phone className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0 pr-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#D4AF37] group-hover:text-[#0B2019] block">
              Direct VIP WhatsApp
            </span>
            <span className="text-xs font-semibold truncate block">+880 1767-850859</span>
          </div>
        </a>
      </div>

      <Footer />

      <InquiryModal
        isOpen={modalOpen}
        destinationTitle={modalTarget}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
