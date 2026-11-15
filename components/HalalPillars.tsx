import React from 'react';
import { Utensils, ShieldCheck, Clock, UserCheck, Sparkles, LucideIcon } from 'lucide-react';

interface Pillar {
  numeral: string;
  index: string;
  category: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  hallmarkTag: string;
  hallmark: string;
}

const PILLARS: Pillar[] = [
  {
    numeral: 'I',
    index: '01',
    category: 'Gastronomy',
    icon: Utensils,
    title: '100% Halal Gourmet',
    desc: 'Michelin-starred private chefs, hand-slaughtered certified halal meats, and alcohol-free banquets arranged at every private destination.',
    hallmarkTag: 'Halal Haute Cuisine',
    hallmark: '100% Zabihah & Michelin Standard',
  },
  {
    numeral: 'II',
    index: '02',
    category: 'Sanctuary',
    icon: ShieldCheck,
    title: 'Absolute Family Privacy',
    desc: 'Private secluded pool villas, private yacht charters, and private island sections ensuring zero sightlines from neighbors for complete peace of mind.',
    hallmarkTag: 'Complete Seclusion',
    hallmark: 'Zero-Sightline Privacy Guarantee',
  },
  {
    numeral: 'III',
    index: '03',
    category: 'Devotion',
    icon: Clock,
    title: 'Prayer-Friendly Pacing',
    desc: 'Itineraries seamlessly choreographed around daily Salah times, including Qibla directions, premium prayer mats, and stops at breathtaking historical Mosques.',
    hallmarkTag: 'Sacred Timekeeping',
    hallmark: 'Salah & Qibla Synchronized Pacing',
  },
  {
    numeral: 'IV',
    index: '04',
    category: 'Concierge',
    icon: UserCheck,
    title: '24/7 Dedicated Concierge',
    desc: 'Your personal travel butler and expert cultural guides who understand your traditions and manage every airport VIP escort, baggage, and booking.',
    hallmarkTag: 'Private Retinue',
    hallmark: 'White-Glove VIP Butler Protocol',
  },
];

export default function HalalPillars() {
  return (
    <section id="halal-philosophy" className="py-24 sm:py-28 relative overflow-hidden scroll-mt-20">
      {/* Ambient Royal Center Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[54rem] h-[30rem] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-gold/10 via-brand-gold/2 to-transparent filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Editorial Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/30 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-bold text-brand-goldDark">
              The Maijrun Standard of Excellence
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-[3.25rem] text-brand-emerald tracking-tight leading-[1.16]">
            Why The World’s Discerning Families <br />
            <span className="italic font-light gold-gradient-text">Choose Travel With Maijrun</span>
          </h2>

          {/* Bespoke Royal Hallmark Divider */}
          <div className="flex items-center justify-center gap-3 pt-1.5">
            <div className="w-14 h-px bg-gradient-to-r from-transparent via-brand-gold/60 to-brand-gold" />
            <span className="text-brand-gold text-[10px] tracking-widest">✦ ◆ ✦</span>
            <div className="w-14 h-px bg-gradient-to-l from-transparent via-brand-gold/60 to-brand-gold" />
          </div>

          <p className="text-neutral-600 font-light text-base sm:text-lg leading-relaxed pt-2 max-w-2xl mx-auto">
            We have redefined ultra-luxury travel for the modern conscious traveler. No compromises between five-star world-class opulence and religious compliance.
          </p>
        </div>

        {/* The 4 Bespoke Luxury Ethos Folio Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {PILLARS.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="group relative bg-white rounded-2xl p-6 sm:p-7 border border-[#E8E2D5] hover:border-brand-gold/70 transition-all duration-500 ease-out hover:-translate-y-2 shadow-[0_4px_24px_-4px_rgba(11,32,25,0.05),0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_24px_48px_-12px_rgba(11,32,25,0.12),0_0_0_1px_rgba(212,175,55,0.35)] flex flex-col justify-between"
              >
                {/* Bespoke Inner Hairline Inlay (Cartier / Luxury Stationery Signature) */}
                <div className="absolute inset-2 sm:inset-2.5 rounded-xl border border-brand-gold/15 pointer-events-none group-hover:border-brand-gold/35 transition-colors duration-500" />

                {/* Luminous Top Gold Foil Accent Bar */}
                <div className="absolute top-0 inset-x-8 h-[2px] bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent group-hover:via-brand-gold group-hover:inset-x-4 transition-all duration-500 rounded-t-2xl" />

                {/* Subtle Ambient Corner Illumination */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-gold/8 via-transparent to-transparent pointer-events-none rounded-tr-2xl" />

                <div className="relative z-10">
                  {/* Top Bar: Royal Medallion & Chapter Index */}
                  <div className="flex items-start justify-between mb-6">
                    {/* Double-Ringed Royal Medallion */}
                    <div className="relative">
                      <div className="absolute -inset-1 rounded-2xl bg-brand-gold/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative w-14 h-14 rounded-2xl p-[1.5px] bg-gradient-to-br from-brand-gold via-brand-goldDark to-brand-emerald/40 shadow-sm transition-transform duration-500 group-hover:scale-105">
                        <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-brand-emerald via-[#0F2D23] to-brand-emeraldDeep flex items-center justify-center">
                          <Icon
                            className="w-6 h-6 text-brand-gold group-hover:text-brand-goldLight transition-all duration-300 group-hover:scale-110"
                            strokeWidth={1.8}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Chapter Index: Roman Numeral & Pillar Realm */}
                    <div className="flex flex-col items-end text-right">
                      <span className="font-serif italic text-3xl sm:text-4xl font-normal leading-none text-brand-gold/40 group-hover:text-brand-gold transition-colors duration-500 select-none">
                        {item.numeral}
                      </span>
                      <span className="text-[10px] tracking-[0.22em] uppercase font-bold text-brand-goldDark/90 mt-1.5">
                        {item.index} · {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Title Container with Harmonized Minimum Height */}
                  <div className="min-h-[58px] flex flex-col justify-center">
                    <h3 className="font-serif text-2xl text-brand-emerald font-semibold tracking-tight leading-snug group-hover:text-brand-goldDark transition-colors duration-300">
                      {item.title}
                    </h3>
                  </div>

                  {/* Animated Hairline Rule */}
                  <div className="w-10 h-[1.5px] bg-gradient-to-r from-brand-gold via-brand-goldLight to-transparent my-3.5 transition-all duration-500 group-hover:w-20" />

                  {/* Card Description */}
                  <p className="text-neutral-600/90 text-[13.5px] leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>

                {/* Card Footer: Bespoke Luxury Guarantee & Seal */}
                <div className="relative z-10 mt-6 pt-4 border-t border-[#EFE9DD] group-hover:border-brand-gold/30 transition-colors duration-300">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9.5px] uppercase tracking-[0.2em] font-semibold text-brand-goldDark">
                      {item.hallmarkTag}
                    </span>
                    <span className="text-[9px] text-brand-gold tracking-widest font-serif font-light">
                      ✦ SANCTUARY
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0" />
                    <span className="text-[11.5px] font-medium text-neutral-800 tracking-wide group-hover:text-brand-emerald transition-colors">
                      {item.hallmark}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Editorial Assurance Note */}
        <div className="mt-16 pt-8 border-t border-brand-sandDark/80 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 sm:gap-3 px-4 py-1.5 rounded-full bg-white/70 border border-brand-gold/20 shadow-sm mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] font-bold text-brand-emerald">
              The Royal Sanctuary Guarantee
            </span>
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
          </div>
          <p className="text-xs sm:text-[13px] uppercase tracking-[0.2em] text-neutral-600 font-medium leading-relaxed">
            Every journey audited &amp; accompanied by certified halal travel specialists • 100% Discretion &amp; Seclusion Assured
          </p>
          <div className="mt-6">
            <a
              href="/ethos"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0B2019] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#061410] text-xs font-semibold uppercase tracking-widest transition-all shadow-sm"
            >
              <span>Explore The Halal Standard &amp; Founder’s Ethos</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
