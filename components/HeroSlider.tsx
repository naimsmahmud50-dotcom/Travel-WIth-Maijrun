'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Sparkles, Crown, Shield, Compass, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface HeroSliderProps {
  onOpenInquiry: (destination?: string) => void;
}

const HERO_SLIDES = [
  {
    id: 'makkah',
    image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=85&w=2000&auto=format&fit=crop',
    tag: 'Royal Spiritual Expeditions',
    icon: Sparkles,
    titleMain: 'Makkah & Madinah',
    titleItalic: 'The Presidential Sanctuary',
    desc: 'Experience the pinnacle of spiritual elevation with five-star private Haram-facing suites, private chauffeured VIP transfers, and curated Islamic scholars on retinue.',
    inquiryTarget: 'Royal Makkah & Madinah',
  },
  {
    id: 'andalusia',
    image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?q=85&w=2000&auto=format&fit=crop',
    tag: 'Islamic Heritage Discovery',
    icon: Crown,
    titleMain: 'Moorish Andalusia',
    titleItalic: 'Alhambra & Cordoba Splendors',
    desc: 'Walk through 800 years of golden Islamic civilization with private after-hours palace tours, certified Halal gourmet Michelin-star chefs, and boutique historical riads.',
    inquiryTarget: 'Moorish Andalusia',
  },
  {
    id: 'maldives',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=85&w=2000&auto=format&fit=crop',
    tag: '100% Private Secluded Haven',
    icon: Shield,
    titleMain: 'The Maldives Pavilions',
    titleItalic: 'Private Overwater Seclusion',
    desc: 'Zero visibility infinity plunge pools, halal oceanfront private dining under the stars, and alcohol-free luxury family villas designed for absolute peace of mind.',
    inquiryTarget: 'Maldives Private Pavilion',
  },
  {
    id: 'turkey',
    image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=85&w=2000&auto=format&fit=crop',
    tag: 'Ottoman Grandeur & Coastal Luxury',
    icon: Compass,
    titleMain: 'Bosphorus Royalty',
    titleItalic: 'Palatial Istanbul & Bodrum',
    desc: 'Private luxury yacht cruises on the Bosphorus, VIP private palace tours, and exclusive halal-certified coastal wellness resorts in Bodrum.',
    inquiryTarget: 'Bosphorus & Bodrum',
  },
];

export default function HeroSlider({ onOpenInquiry }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];
  const IconComponent = slide.icon;

  return (
    <section className="relative w-full h-[92vh] min-h-[650px] max-h-[1000px] overflow-hidden bg-brand-emeraldDeep pt-28">
      {/* Slides Background Container */}
      {HERO_SLIDES.map((item, idx) => {
        const isActive = idx === currentSlide;
        return (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <div
              className={`absolute inset-0 bg-cover bg-center transition-transform duration-[6000ms] ease-out ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
              style={{ backgroundImage: `url(${item.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-emeraldDeep via-brand-emeraldDeep/50 to-brand-emeraldDeep/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-emeraldDeep/80 via-transparent to-brand-emeraldDeep/40" />

            <div className="relative z-20 h-full max-w-7xl mx-auto px-6 sm:px-8 flex flex-col justify-end pb-36 md:pb-40">
              <div className="max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/20 border border-brand-gold/40 text-brand-goldLight text-xs tracking-[0.2em] uppercase font-medium">
                  <IconComponent className="w-3.5 h-3.5 text-brand-gold" />
                  <span>{item.tag}</span>
                </div>
                <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal text-white leading-[1.08] tracking-tight">
                  {item.titleMain} <br />
                  <span className="italic font-light gold-gradient-text">{item.titleItalic}</span>
                </h1>
                <p className="text-neutral-300 text-base sm:text-lg max-w-xl font-light leading-relaxed">
                  {item.desc}
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => onOpenInquiry(item.inquiryTarget)}
                    className="bg-brand-gold hover:bg-white text-brand-emeraldDeep font-semibold text-xs tracking-widest uppercase px-8 py-4 rounded-full shadow-xl transition-all duration-300"
                  >
                    Explore Itinerary
                  </button>
                  <a
                    href="#destinations"
                    className="inline-flex items-center gap-2 text-white hover:text-brand-gold tracking-widest text-xs uppercase font-medium py-3 px-4 border-b border-white/30 hover:border-brand-gold transition-all"
                  >
                    <span>View All 2026 Journeys</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Controls */}
      <div className="absolute bottom-16 right-6 sm:right-12 z-30 flex items-center gap-3">
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          className="w-11 h-11 rounded-full border border-white/20 bg-brand-emerald/40 hover:bg-brand-gold text-white hover:text-brand-emeraldDeep flex items-center justify-center transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-white text-xs tracking-widest font-mono px-2">
          0{currentSlide + 1} / 0{HERO_SLIDES.length}
        </div>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
          className="w-11 h-11 rounded-full border border-white/20 bg-brand-emerald/40 hover:bg-brand-gold text-white hover:text-brand-emeraldDeep flex items-center justify-center transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
