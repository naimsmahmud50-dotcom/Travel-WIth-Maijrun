'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Utensils,
  EyeOff,
  Compass,
  Phone,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Award,
  CheckCircle2,
  Lock,
  ArrowRight,
  HeartHandshake,
  Clock,
  UserCheck
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InquiryModal from '@/components/InquiryModal';

const FAQS = [
  {
    q: 'How do you verify 100% halal meat in European destinations like Switzerland and Spain?',
    a: 'We operate under our own strict audit protocol. In destinations without ubiquitous halal certification, our local ground teams partner directly with certified artisanal halal suppliers (hand-slaughtered, Zabiha Halal). For our private chalet and villa bookings, our dedicated private chefs prepare meals in cleansed, alcohol-free kitchen environments with dedicated cookware.',
  },
  {
    q: 'How do you guarantee zero sightlines for private swimming pools in the Maldives and Bali?',
    a: 'Every villa in our portfolio is personally inspected and sightline-audited. We measure exterior angles, neighboring villa deck heights, and watercraft navigational lanes. We only approve villas that offer complete physical seclusion, screened sundecks, or natural vegetative buffers where families and sisters can swim in total peace of mind.',
  },
  {
    q: 'How is daily prayer (Salah) integrated into full-day excursions and wildlife safaris?',
    a: 'We never treat prayer as an afterthought. Every day’s itinerary is choreographed around the 5 daily prayer windows. Vehicles are equipped with Qibla compasses, clean prayer rugs, and fresh ablution supplies. When in historic cities (such as Istanbul, Cordoba, or Cairo), stops are scheduled at grand historic Mosques during prayer times.',
  },
  {
    q: 'Can we request female staff (chauffeurs, spa therapists, private butleresses)?',
    a: 'Yes, absolutely. For clients who observe strict Islamic modesty, we can arrange dedicated female guides, female chauffeur services in select destinations, and private in-villa spa treatments performed exclusively by licensed female wellness professionals.',
  },
  {
    q: 'What is the minimum lead time required to commission a bespoke royal journey?',
    a: 'While we frequently accommodate emergency or short-notice private jet charters within 72 hours, we recommend a 3 to 6-week window for bespoke journeys (particularly during Ramadan, Eid seasons, and peak European summer) to secure optimal presidential suites and private villa buyouts.',
  },
];

export default function EthosPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0B2019] flex flex-col font-sans selection:bg-[#D4AF37] selection:text-[#0B2019]">
      <Navbar onOpenInquiry={() => setModalOpen(true)} />

      {/* HERO SECTION */}
      <section className="relative pt-[116px] lg:pt-[126px] pb-16 lg:pb-24 bg-[#061410] text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542816417-0983c9c9ad53?q=80&w=1600&auto=format&fit=crop"
            alt="Islamic Architecture & Luxury Ethos"
            className="w-full h-full object-cover opacity-25 filter brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061410] via-[#061410]/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-neutral-400 mb-2">
            <Link href="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
            <span className="text-[#D4AF37]">•</span>
            <span className="text-white font-semibold">The Halal Standard & Ethos</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold tracking-[0.25em] uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>Uncompromising Faith & High Luxury</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-bold tracking-tight leading-[1.15]">
            The Halal Luxury Standard & Founder’s Ethos
          </h1>

          <p className="text-neutral-300 text-sm sm:text-base lg:text-lg font-light max-w-3xl mx-auto leading-relaxed">
            Founded by Mahmud Hasan, Travel With Maijrun was born from a singular conviction: discerning Muslim families should never have to compromise between five-star world-class hospitality and the sacred tenets of Islamic faith.
          </p>
        </div>
      </section>

      {/* FOUNDER'S PHILOSOPHY ESSAY */}
      <section className="py-16 lg:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-14 border border-neutral-200 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-bl-full pointer-events-none" />

          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-full border-2 border-[#D4AF37] p-1 flex items-center justify-center bg-[#0B2019] text-[#D4AF37] font-serif text-2xl font-bold">
              MH
            </div>
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B2019]">
                Mahmud Hasan
              </h2>
              <span className="text-xs uppercase tracking-widest text-[#8C6B14] font-semibold block mt-0.5">
                Founder & Principal Architect of Luxury Expeditions
              </span>
            </div>
          </div>

          <div className="space-y-5 text-neutral-700 text-sm sm:text-base font-light leading-relaxed">
            <p className="first-letter:font-serif first-letter:text-5xl first-letter:font-bold first-letter:text-[#0B2019] first-letter:float-left first-letter:mr-3 first-letter:leading-none">
              Throughout history, travel in the Islamic tradition was never merely leisure; it was a sacred pursuit of knowledge, reflection on the majesty of Creation, and an encounter with heritage. Yet for decades, modern ultra-luxury hospitality has treated halal travelers as an afterthought.
            </p>
            <p>
              When a family checks into the finest presidential suite in St. Moritz or an overwater villa in the Indian Ocean, they should not have to negotiate whether the meat is hand-slaughtered, endure open bars, or worry if neighboring decks look directly into their private pool.
            </p>
            <blockquote className="my-6 p-6 rounded-2xl bg-[#FAF8F5] border-l-4 border-[#D4AF37] text-[#0B2019] font-serif text-lg sm:text-xl italic font-normal">
              “True luxury is peace of heart. When your soul is in complete tranquility knowing your food is pure, your family is in absolute modesty, and your prayers are honored on time, that is when the magic of travel truly begins.”
            </blockquote>
            <p>
              Under my stewardship, Travel With Maijrun audits every hotel partner, villa estate, private jet charter, and culinary supplier personally. We do not just book rooms; we engineer private sanctums where your faith flourishes alongside world-class elegance.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Personally verified across 18+ luxury jurisdictions</span>
            </div>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="px-6 py-2.5 rounded-full bg-[#0B2019] hover:bg-[#D4AF37] text-white hover:text-[#061410] font-sans text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Consult with Founder Desk
            </button>
          </div>
        </div>
      </section>

      {/* THE 4 PILLARS IN DEPTH */}
      <section className="py-16 bg-[#0B2019] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-bold block">
              The Sovereign Foundation
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              The Four Pillars of Halal Luxury
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm font-light max-w-xl mx-auto">
              Our non-negotiable operational standard applied to every sanctuary in our Black Book.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Pillar 1 */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-[#D4AF37]/50 transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                <Utensils className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#D4AF37]">Pillar I</span>
                <h3 className="font-serif text-2xl font-bold text-white">100% Halal Gourmet & Alcohol-Free</h3>
              </div>
              <p className="text-neutral-300 text-xs sm:text-sm font-light leading-relaxed">
                We eliminate all ambiguity. Every steak, cut of poultry, and delicate sauce is strictly 100% certified halal (hand-slaughtered). In-villa minibars are cleared of alcohol prior to arrival, replaced with artisanal sparkling grape, fresh date elixirs, and bespoke mocktails curated by private mixologists.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs text-[#D4AF37]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Audited halal supply chain in Switzerland, Spain, Japan & Safari</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-[#D4AF37]/50 transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                <EyeOff className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#D4AF37]">Pillar II</span>
                <h3 className="font-serif text-2xl font-bold text-white">Absolute Family Privacy & Zero Sightlines</h3>
              </div>
              <p className="text-neutral-300 text-xs sm:text-sm font-light leading-relaxed">
                Modesty (Haya) is sacred. We reserve secluded royal estates and overwater villas engineered with zero public visibility. Sisters and families can enjoy private heated pools, private sundecks, and private gardens without the risk of intrusion or prying lenses.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs text-[#D4AF37]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Drone-free zones & physical sightline verification</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-[#D4AF37]/50 transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                <Compass className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#D4AF37]">Pillar III</span>
                <h3 className="font-serif text-2xl font-bold text-white">Prayer Choreography & Sacred Pacing</h3>
              </div>
              <p className="text-neutral-300 text-xs sm:text-sm font-light leading-relaxed">
                Your journey flows with the rhythms of the cosmos. No sunrise tour begins without time for Fajr; no long highway transfer skips Maghrib. Every suite features high-precision Qibla orientation, luxury prayer mats, and pristine copies of the Holy Qur’an.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs text-[#D4AF37]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Calculated prayer halts at monumental historical Mosques</span>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-[#D4AF37]/50 transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                <UserCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#D4AF37]">Pillar IV</span>
                <h3 className="font-serif text-2xl font-bold text-white">24/7 Dedicated Butler & Scholar Retinue</h3>
              </div>
              <p className="text-neutral-300 text-xs sm:text-sm font-light leading-relaxed">
                From fast-track tarmac clearance to luggage transfers, your personal travel butler manages every logistic invisibly. For spiritual journeys (Umrah, Andalusian heritage, Ottoman history), we accompany you with respected Islamic scholars who bring the sacred stones to life.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs text-[#D4AF37]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Multilingual English & Bengali speaking escort team</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="py-16 lg:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C6B14] font-bold block">
            Client Advisory
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B2019]">
            Frequently Asked Questions
          </h2>
          <p className="text-neutral-500 text-xs sm:text-sm font-light max-w-lg mx-auto">
            Clear answers to common questions about our halal luxury standards and protocol.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs transition-colors hover:border-[#D4AF37]/60"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-neutral-50/60 transition-colors"
                >
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#0B2019]">
                    {faq.q}
                  </h3>
                  <div className="w-7 h-7 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4 text-[#D4AF37]" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 border-t border-neutral-100">
                    <p className="text-neutral-600 text-xs sm:text-sm font-light leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-xs text-neutral-500 mb-4">
            Have a custom requirement or need an NDA prior to commissioning?
          </p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0B2019] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#061410] font-sans text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-sm"
          >
            <span>Open Private Inquiry</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* WHATSAPP DOCK */}
      <div className="sticky bottom-4 z-40 max-w-sm ml-auto mr-4 pointer-events-auto">
        <a
          href="https://wa.me/8801767850859?text=Salam,%20I%20would%20like%20to%20inquire%20about%20Travel%20With%20Maijrun%20Halal%20Ethos."
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-[#0B2019] text-white p-3.5 rounded-full border border-[#D4AF37]/50 shadow-2xl hover:bg-[#D4AF37] hover:text-[#061410] transition-all duration-300 group"
        >
          <div className="w-9 h-9 rounded-full bg-emerald-600 group-hover:bg-[#0B2019] flex items-center justify-center text-white shrink-0">
            <Phone className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0 pr-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#D4AF37] group-hover:text-[#0B2019] block">
              Founder Concierge WhatsApp
            </span>
            <span className="text-xs font-semibold truncate block">+880 1767-850859</span>
          </div>
        </a>
      </div>

      <Footer />

      <InquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
