'use client';

import React, { useState } from 'react';
import { Phone, ShieldCheck, Globe, Search, Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenInquiry: (destination?: string) => void;
}

export default function Navbar({ onOpenInquiry }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Utility Concierge Bar */}
      <div className="bg-brand-emerald text-xs text-neutral-300 border-b border-brand-gold/15 py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="tel:+8801800000000" className="flex items-center gap-2 hover:text-brand-goldLight transition-colors">
              <Phone className="w-3.5 h-3.5 text-brand-gold" />
              <span className="tracking-wider">24/7 VIP CONCIERGE: <strong className="text-white font-medium">+880 1800-MAIJRUN</strong></span>
            </a>
            <span className="hidden md:inline text-neutral-500">•</span>
            <span className="hidden md:flex items-center gap-1.5 text-neutral-400">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
              <span>100% Certified Halal Hospitality</span>
            </span>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-brand-gold" />
              <span className="text-neutral-300 font-medium">BDT (৳)</span>
            </div>
            <span className="text-neutral-600">|</span>
            <button onClick={() => onOpenInquiry('Brochure Request')} className="hover:text-brand-gold tracking-widest uppercase text-[11px] font-semibold transition-colors">
              Request Brochure
            </button>
            <span className="text-neutral-600">|</span>
            <button onClick={() => onOpenInquiry('VIP Concierge Callback')} className="hidden sm:inline bg-brand-gold/20 hover:bg-brand-gold text-brand-gold hover:text-brand-emeraldDeep text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded transition-all">
              VIP Inquiry
            </button>
          </div>
        </div>
      </div>

      {/* Main Luxury Navigation Bar */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-brand-sandDark/60 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          
          <button 
            onClick={() => setMobileOpen(!mobileOpen)} 
            className="lg:hidden p-2 text-brand-emerald hover:text-brand-gold transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="hidden lg:flex items-center gap-8 text-[13px] tracking-[0.16em] uppercase font-semibold text-neutral-700">
            <a href="#destinations" className="hover:text-brand-gold transition-colors">Destinations</a>
            <a href="#signature-journeys" className="hover:text-brand-gold transition-colors">Signature Journeys</a>
            <a href="#halal-philosophy" className="hover:text-brand-gold transition-colors flex items-center gap-1.5">
              <span>Halal Sanctuary</span>
              <span className="bg-brand-gold/15 text-brand-goldDark text-[10px] px-1.5 py-0.5 rounded font-bold tracking-normal">100% Halal</span>
            </a>
            <a href="#bespoke-tailored" className="hover:text-brand-gold transition-colors">Tailor-Made</a>
          </div>

          <a href="#" className="flex flex-col items-center group">
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-brand-emerald uppercase group-hover:text-brand-gold transition-colors">
              Travel With Maijrun
            </span>
            <span className="text-[9px] tracking-[0.35em] uppercase text-neutral-400 font-medium -mt-1 group-hover:text-brand-goldDark transition-colors">
              Bespoke Halal Expeditions
            </span>
          </a>

          <div className="flex items-center gap-4">
            <a href="#journey-finder" className="hidden sm:flex items-center gap-2 text-xs tracking-widest font-semibold uppercase text-brand-emerald hover:text-brand-gold transition-colors">
              <Search className="w-4 h-4 text-brand-gold" />
              <span>Find Journey</span>
            </a>
            <button 
              onClick={() => onOpenInquiry('Plan A Journey')} 
              className="bg-brand-emerald text-white hover:bg-brand-gold hover:text-brand-emeraldDeep text-xs tracking-widest uppercase font-semibold px-5 py-2.5 rounded-full shadow-md transition-all duration-300"
            >
              Plan A Journey
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden bg-brand-emerald border-t border-brand-gold/20 px-6 py-6 text-white space-y-4">
            <a href="#destinations" onClick={() => setMobileOpen(false)} className="block text-sm tracking-widest uppercase py-2 border-b border-white/10 hover:text-brand-gold">Destinations</a>
            <a href="#signature-journeys" onClick={() => setMobileOpen(false)} className="block text-sm tracking-widest uppercase py-2 border-b border-white/10 hover:text-brand-gold">Signature Journeys</a>
            <a href="#halal-philosophy" onClick={() => setMobileOpen(false)} className="block text-sm tracking-widest uppercase py-2 border-b border-white/10 hover:text-brand-gold">Halal Sanctuary Ethos</a>
            <a href="#bespoke-tailored" onClick={() => setMobileOpen(false)} className="block text-sm tracking-widest uppercase py-2 border-b border-white/10 hover:text-brand-gold">Bespoke Tailoring</a>
            <a href="#testimonials" onClick={() => setMobileOpen(false)} className="block text-sm tracking-widest uppercase py-2 hover:text-brand-gold">VIP Reviews</a>
          </div>
        )}
      </nav>
    </header>
  );
}
