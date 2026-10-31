'use client';

import React, { useState, useEffect } from 'react';
import { Phone, ShieldCheck, Globe, Search, Menu, X, ArrowRight, Sparkles, Lock, Compass } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';

const TOP_TICKER_SLIDES = [
  {
    id: 'advisory',
    icon: Phone,
    content: (
      <span className="flex items-center gap-2">
        <span className="text-[#D4AF37] font-semibold uppercase tracking-wider text-[10px]">Private Concierge:</span>
        <a href="tel:+8809612888999" className="text-white hover:text-[#F3E5AB] font-medium transition-colors">
          +880 9612-888-999
        </a>
        <span className="text-neutral-500 hidden lg:inline">•</span>
        <span className="text-neutral-300 hidden lg:inline">London Desk:</span>
        <a href="tel:+442079460920" className="text-white hover:text-[#F3E5AB] font-medium transition-colors hidden lg:inline">
          +44 20 7946 0920
        </a>
      </span>
    ),
  },
  {
    id: 'halal',
    icon: ShieldCheck,
    content: (
      <span className="flex items-center gap-2">
        <span className="text-[#D4AF37] font-semibold uppercase tracking-wider text-[10px]">100% Certified Halal Standard:</span>
        <span className="text-white font-medium">Strictly Alcohol-Free & Michelin-Curated Halal Gastronomy</span>
      </span>
    ),
  },
  {
    id: 'expeditions',
    icon: Sparkles,
    content: (
      <span className="flex items-center gap-2">
        <span className="text-[#D4AF37] font-semibold uppercase tracking-wider text-[10px]">2026 Black Book Portfolio:</span>
        <span className="text-neutral-200">Private Island Sanctuaries & Curated Royal Expeditions</span>
      </span>
    ),
  },
  {
    id: 'privacy',
    icon: Lock,
    content: (
      <span className="flex items-center gap-2">
        <span className="text-[#D4AF37] font-semibold uppercase tracking-wider text-[10px]">Absolute Privacy:</span>
        <span className="text-neutral-200">Zero-Sightline Family Pool Villas & Private Chauffeured Jets</span>
      </span>
    ),
  },
  {
    id: 'service',
    icon: Compass,
    content: (
      <span className="flex items-center gap-2">
        <span className="text-[#D4AF37] font-semibold uppercase tracking-wider text-[10px]">VIP Ground Escort:</span>
        <span className="text-neutral-200">Airport Tarmac Limousine Transfers & 24/7 Dedicated Butler Retinue</span>
      </span>
    ),
  },
];

interface NavbarProps {
  onOpenInquiry?: (type?: string) => void;
}

export default function Navbar({ onOpenInquiry }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };

    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileOpen]);

  const handleInquiry = (topic: string) => {
    if (onOpenInquiry) {
      onOpenInquiry(topic);
    } else if (typeof window !== 'undefined' && (window as any).openInquiryModal) {
      (window as any).openInquiryModal(topic);
    }
  };

  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById('journey-finder') || document.getElementById('destinations');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        {/* Top Utility Concierge Bar (38px, smoothly collapses on scroll, powered by Swiper) */}
        <div
          className={`overflow-hidden transition-all duration-300 bg-[#0B2019] border-b border-[#D4AF37]/20 ${
            scrolled ? 'max-h-0 opacity-0 py-0 border-b-0 pointer-events-none' : 'h-[38px] max-h-[38px] opacity-100'
          }`}
        >
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between text-xs text-neutral-300 gap-4">
            {/* SWIPER TICKER (Left/Center dynamic ticker) */}
            <div className="flex-1 min-w-0 h-full overflow-hidden max-w-3xl">
              <Swiper
                modules={[Autoplay]}
                direction="vertical"
                loop={true}
                autoplay={{
                  delay: 4200,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                speed={500}
                className="h-full w-full"
              >
                {TOP_TICKER_SLIDES.map((slide) => {
                  const IconComponent = slide.icon;
                  return (
                    <SwiperSlide key={slide.id} className="h-full flex items-center">
                      <div className="flex items-center gap-2 whitespace-nowrap text-[11px] sm:text-xs text-neutral-200">
                        <IconComponent className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                        {slide.content}
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>

            {/* RIGHT UTILITIES */}
            <div className="flex items-center gap-3 sm:gap-4 whitespace-nowrap shrink-0">
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span className="text-neutral-200 text-xs font-medium">BDT (৳)</span>
              </div>
              <span className="hidden md:inline text-neutral-600">|</span>
              <button
                type="button"
                onClick={() => handleInquiry('Private Brochure Request')}
                className="hidden md:inline hover:text-[#D4AF37] tracking-widest uppercase text-[11px] font-semibold transition-colors whitespace-nowrap cursor-pointer"
              >
                Request Brochure
              </button>
              <span className="hidden sm:inline text-neutral-600">|</span>
              <a
                href="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 border border-[#D4AF37]/40 hover:border-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#061410] text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full transition-all whitespace-nowrap"
              >
                Client Portal
              </a>
            </div>
          </div>
        </div>

        {/* MAIN LUXURY NAVIGATION BAR (Abercrombie & Kent Inspired Clean Single-Line Header) */}
        <nav
          aria-label="Primary"
          className={`transition-all duration-300 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#D4AF37]/25 shadow-[0_4px_25px_-5px_rgba(6,20,16,0.06)] ${
            scrolled ? 'h-[68px]' : 'h-[78px]'
          }`}
        >
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">
            
            {/* LEFT NAVIGATION LINKS (Desktop >= 1200px) */}
            <div className="hidden min-[1200px]:flex items-center gap-6 xl:gap-8 shrink-0">
              <a
                href="#destinations"
                onClick={(e) => handleNavClick(e, 'destinations')}
                className="group relative py-2 font-sans text-[12px] xl:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#0B2019] hover:text-[#D4AF37] whitespace-nowrap transition-colors duration-250 no-underline cursor-pointer"
              >
                <span>Destinations</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#D4AF37] group-hover:w-full transition-all duration-300 ease-out" />
              </a>

              <a
                href="#signature-journeys"
                onClick={(e) => handleNavClick(e, 'signature-journeys')}
                className="group relative py-2 font-sans text-[12px] xl:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#0B2019] hover:text-[#D4AF37] whitespace-nowrap transition-colors duration-250 no-underline cursor-pointer"
              >
                <span>Signature Journeys</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#D4AF37] group-hover:w-full transition-all duration-300 ease-out" />
              </a>

              <a
                href="#halal-philosophy"
                onClick={(e) => handleNavClick(e, 'halal-philosophy')}
                className="group relative py-2 font-sans text-[12px] xl:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#0B2019] hover:text-[#D4AF37] whitespace-nowrap transition-colors duration-250 flex items-center gap-1.5 no-underline cursor-pointer"
              >
                <span>Halal Sanctuary</span>
                <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded bg-[#D4AF37]/15 text-[#8C6B14] border border-[#D4AF37]/35 shadow-xs">
                  100% Halal
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#D4AF37] group-hover:w-full transition-all duration-300 ease-out" />
              </a>

              <a
                href="#bespoke-tailored"
                onClick={(e) => handleNavClick(e, 'bespoke-tailored')}
                className="group relative py-2 font-sans text-[12px] xl:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#0B2019] hover:text-[#D4AF37] whitespace-nowrap transition-colors duration-250 no-underline cursor-pointer"
              >
                <span>Tailor-Made</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#D4AF37] group-hover:w-full transition-all duration-300 ease-out" />
              </a>
            </div>

            {/* HAMBURGER TRIGGER FOR SCREENS < 1200px */}
            <div className="flex min-[1200px]:hidden items-center shrink-0">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Toggle navigation menu"
                aria-expanded={mobileOpen}
                aria-controls="luxuryMobileDrawer"
                className="w-10 h-10 rounded-full border border-[#0B2019]/15 hover:border-[#D4AF37] text-[#0B2019] hover:text-[#D4AF37] flex items-center justify-center transition-all duration-250 hover:bg-[#D4AF37]/10"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            {/* CENTER BRAND IDENTITY (Strictly Single-Line, Never Wraps) */}
            <a
              href="#"
              className="flex flex-col items-center justify-center group no-underline shrink-0 text-center px-2"
              aria-label="Travel with Maijrun Home"
            >
              <span className="font-serif text-[20px] sm:text-[23px] xl:text-[26px] font-bold tracking-[0.05em] uppercase text-[#0B2019] group-hover:text-[#D4AF37] transition-colors leading-none whitespace-nowrap">
                Travel With Maijrun
              </span>
              <span className="font-sans text-[8px] sm:text-[9px] xl:text-[9.5px] uppercase tracking-[0.32em] text-[#8C6B14] font-semibold leading-none mt-1 whitespace-nowrap">
                Bespoke Halal Expeditions
              </span>
            </a>

            {/* RIGHT ACTIONS (Search & CTA Button, Strictly Single-Line) */}
            <div className="flex items-center gap-2.5 sm:gap-4 shrink-0 whitespace-nowrap">
              {/* Find Journey Search Button */}
              <button
                type="button"
                onClick={handleSearchClick}
                className="flex items-center gap-1.5 text-[#0B2019] hover:text-[#D4AF37] px-2.5 py-1.5 rounded-full hover:bg-[#D4AF37]/10 transition-all duration-200 group whitespace-nowrap cursor-pointer"
                aria-label="Search destinations"
              >
                <Search className="w-3.5 h-3.5 text-[#D4AF37] group-hover:scale-110 transition-transform shrink-0" />
                <span className="hidden sm:inline font-sans text-[11px] xl:text-[12px] font-semibold uppercase tracking-[0.14em] whitespace-nowrap">
                  Find Journey
                </span>
              </button>

              {/* Primary CTA "Plan a Journey" Pill Button */}
              <button
                type="button"
                onClick={() => handleInquiry('Plan A Journey')}
                className="whitespace-nowrap px-4 py-2 sm:px-6 sm:py-2.5 rounded-full bg-[#0B2019] border border-[#D4AF37]/60 text-white font-sans text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.14em] shadow-sm hover:shadow-[0_4px_16px_rgba(212,175,55,0.4)] transition-all duration-300 hover:bg-[#D4AF37] hover:text-[#061410] hover:border-[#D4AF37] hover:-translate-y-0.5 shrink-0"
              >
                Plan a Journey
              </button>
            </div>

          </div>
        </nav>
      </header>

      {/* Mobile Slide-In Drawer Backdrop Overlay */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 bg-[#061410]/75 backdrop-blur-sm z-[99] transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Full-Height Mobile Drawer Panel */}
      <div
        id="luxuryMobileDrawer"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
        className={`fixed top-0 right-0 w-[min(100vw,380px)] h-full bg-gradient-to-b from-[#0B2019] to-[#061410] border-l border-[#D4AF37]/25 shadow-2xl z-[100] flex flex-col transition-transform duration-350 ease-out ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-6 flex items-center justify-between border-b border-[#D4AF37]/15">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-serif text-base font-bold shrink-0">
              M
            </span>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-semibold text-white tracking-wide leading-tight">
                Travel With Maijrun
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold mt-0.5">
                Bespoke Halal Expeditions
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Links */}
        <div className="p-6 flex flex-col gap-2 flex-1 overflow-y-auto">
          {[
            { label: 'Destinations', href: '#destinations' },
            { label: 'Signature Journeys', href: '#signature-journeys' },
            { label: 'Halal Sanctuary Ethos', href: '#halal-philosophy', badge: '100% Halal' },
            { label: 'Tailor-Made Atelier', href: '#bespoke-tailored' },
            { label: 'VIP Society Reviews', href: '#testimonials' },
            { label: 'Sign In / VIP Atelier', href: '/admin' },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => {
                if (item.href.startsWith('#')) {
                  handleNavClick(e, item.href.slice(1));
                } else {
                  setMobileOpen(false);
                }
              }}
              className="font-serif text-xl font-medium text-[#ECEAE3] hover:text-[#D4AF37] py-2.5 px-3 rounded-lg hover:bg-white/5 transition-all flex items-center justify-between group no-underline"
            >
              <div className="flex items-center gap-2">
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                    {item.badge}
                  </span>
                )}
              </div>
              <ArrowRight className="w-4 h-4 text-[#D4AF37] opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
            </a>
          ))}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-6 border-t border-[#D4AF37]/15 bg-[#061410]/60 space-y-4">
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              handleInquiry('Plan A Journey');
            }}
            className="w-full py-3.5 rounded-full bg-[#D4AF37] text-[#061410] font-sans text-xs font-bold uppercase tracking-widest hover:bg-[#F3E5AB] transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <span>Plan a Journey</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2 text-center text-xs text-neutral-400 space-y-1">
            <p className="tracking-wide">24/7 VIP Concierge & WhatsApp</p>
            <a
              href="tel:+8801800000000"
              className="text-[#D4AF37] font-semibold hover:underline block"
            >
              +880 1800-MAIJRUN
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
