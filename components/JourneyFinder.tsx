'use client';

import React from 'react';
import { Sliders, ChevronDown, Calendar, Compass } from 'lucide-react';

export default function JourneyFinder() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dest = document.getElementById('destinations');
    dest?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="journey-finder" className="relative z-40 max-w-7xl mx-auto px-4 sm:px-8 -mt-16 sm:-mt-20">
      <div className="glass-light rounded-2xl p-6 sm:p-8 shadow-2xl border border-brand-sandDark">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200/60 mb-6">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-brand-goldDark" />
            <span className="text-xs tracking-[0.2em] uppercase font-bold text-brand-emerald">Bespoke Journey Finder</span>
          </div>
          <span className="text-xs text-neutral-500 font-medium hidden sm:inline">Curating over 45+ Verified Halal Luxury Escapes</span>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500">Destination</label>
            <div className="relative">
              <select className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm font-medium text-neutral-800 focus:outline-none focus:border-brand-gold transition-colors appearance-none cursor-pointer">
                <option value="all">All Global Havens</option>
                <option value="saudi">Makkah & Madinah (Royal Umrah)</option>
                <option value="spain">Andalusia & Granada (Spain)</option>
                <option value="maldives">Maldives (Private Pool Villas)</option>
                <option value="turkey">Istanbul & Turkish Riviera</option>
                <option value="switzerland">Swiss Alps & Zermatt Chalets</option>
                <option value="africa">Serengeti & Masai Mara Safaris</option>
              </select>
              <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500">Journey Style</label>
            <div className="relative">
              <select className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm font-medium text-neutral-800 focus:outline-none focus:border-brand-gold transition-colors appearance-none cursor-pointer">
                <option value="all">All Travel Styles</option>
                <option value="spiritual">Sacred Spiritual Pilgrimage</option>
                <option value="heritage">Islamic Golden Age Heritage</option>
                <option value="honeymoon">Secluded Honeymoon & Couples</option>
                <option value="family">Private Family Multi-Gen Villa</option>
                <option value="safari">Halal Wildlife Safari</option>
              </select>
              <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500">Month of Departure</label>
            <div className="relative">
              <select className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm font-medium text-neutral-800 focus:outline-none focus:border-brand-gold transition-colors appearance-none cursor-pointer">
                <option value="any">Flexible / Year-round</option>
                <option value="ramadan">Ramadan 2026 Season</option>
                <option value="winter">Winter Retreats (Nov - Feb)</option>
                <option value="spring">Spring Blossom (Mar - May)</option>
                <option value="summer">Summer Escapes (Jun - Aug)</option>
              </select>
              <Calendar className="w-4 h-4 text-neutral-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-end">
            <button type="submit" className="w-full bg-brand-emerald hover:bg-brand-gold text-white hover:text-brand-emeraldDeep font-semibold text-xs tracking-widest uppercase py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg">
              <Compass className="w-4 h-4" />
              <span>Curate My Escape</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
