import React from 'react';
import { Utensils, ShieldCheck, Clock, UserCheck, Sparkles, Check, LucideIcon } from 'lucide-react';

interface Pillar {
  numeral: string;
  index: string;
  category: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  hallmark: string;
}

const PILLARS: Pillar[] = [
  {
    numeral: 'I',
    index: '01',
    category: 'Gourmet',
    icon: Utensils,
    title: '100% Halal Gourmet',
    desc: 'Michelin-starred private chefs, hand-slaughtered certified halal meats, and alcohol-free banquets arranged at every private destination.',
    hallmark: 'Zabihah & Michelin Standard',
  },
  {
    numeral: 'II',
    index: '02',
    category: 'Privacy',
    icon: ShieldCheck,
    title: 'Absolute Family Privacy',
    desc: 'Private secluded pool villas, private yacht charters, and private island sections ensuring zero sightlines from neighbors for complete peace of mind.',
    hallmark: 'Zero-Sightline Guarantee',
  },
  {
    numeral: 'III',
    index: '03',
    category: 'Spirit',
    icon: Clock,
    title: 'Prayer-Friendly Pacing',
    desc: 'Itineraries seamlessly choreographed around daily Salah times, including Qibla directions, premium prayer mats, and stops at breathtaking historical Mosques.',
    hallmark: 'Salah & Qibla Synchronized',
  },
  {
    numeral: 'IV',
    index: '04',
    category: 'Concierge',
    icon: UserCheck,
    title: '24/7 Dedicated Concierge',
    desc: 'Your personal travel butler and expert cultural guides who understand your traditions and manage every airport VIP escort, baggage, and booking.',
    hallmark: 'White-Glove Butler Protocol',
  },
];

export default function HalalPillars() {
  return (
    <section id="halal-philosophy" className="py-24 sm:py-28 relative overflow-hidden scroll-mt-20">
      {/* Ambient Royal Lighting Accents */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-brand-gold/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-brand-gold/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Editorial Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/30">
            <Sparkles className="w-3 h-3 text-brand-gold" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-bold text-brand-goldDark">
              The Maijrun Standard of Excellence
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl text-brand-emerald tracking-tight leading-[1.18]">
            Why The World’s Discerning Families <br />
            <span className="italic font-light gold-gradient-text">Choose Travel With Maijrun</span>
          </h2>

          {/* Bespoke Royal Hallmark Divider */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-brand-gold" />
            <span className="text-brand-gold text-[10px]">◆</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-brand-gold" />
          </div>

          <p className="text-neutral-600 font-light text-base sm:text-lg leading-relaxed pt-2 max-w-2xl mx-auto">
            We have redefined ultra-luxury travel for the modern conscious traveler. No compromises between five-star world-class opulence and religious compliance.
          </p>
        </div>

        {/* The 4 Bespoke Luxury Ethos Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {PILLARS.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="group relative bg-gradient-to-b from-white via-[#FCFAF7] to-[#F7F4EE] rounded-2xl p-7 sm:p-8 border border-brand-gold/25 hover:border-brand-gold/70 transition-all duration-500 ease-out hover:-translate-y-2 shadow-[0_4px_20px_-2px_rgba(11,32,25,0.04),0_2px_6px_-1px_rgba(212,175,55,0.06)] hover:shadow-[0_24px_48px_-12px_rgba(11,32,25,0.12),0_12px_24px_-8px_rgba(212,175,55,0.22)] flex flex-col justify-between"
              >
                {/* Luminous Top Gold Hairline Highlight */}
                <div className="absolute top-0 inset-x-8 h-[2px] bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent group-hover:via-brand-gold group-hover:inset-x-4 transition-all duration-500 rounded-t-2xl" />

                {/* Subtle Ambient Corner Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-gold/10 via-transparent to-transparent pointer-events-none rounded-tr-2xl" />

                <div>
                  {/* Top Bar: Royal Medallion & Roman Watermark */}
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

                    {/* Roman Numeral & Pillar Index */}
                    <div className="flex flex-col items-end">
                      <span className="font-serif italic text-3xl sm:text-4xl font-light text-brand-gold/25 group-hover:text-brand-gold/60 transition-colors duration-500 select-none">
                        {item.numeral}
                      </span>
                      <span className="text-[9px] tracking-[0.25em] uppercase font-bold text-brand-goldDark/70 group-hover:text-brand-goldDark transition-colors -mt-1">
                        Pillar {item.index}
                      </span>
                    </div>
                  </div>

                  {/* Card Title */}
                  <h3 className="font-serif text-2xl text-brand-emerald font-semibold tracking-tight leading-snug group-hover:text-brand-emeraldDeep transition-colors duration-300">
                    {item.title}
                  </h3>

                  {/* Animated Hairline Rule */}
                  <div className="w-8 h-[1.5px] bg-gradient-to-r from-brand-gold via-brand-gold/60 to-transparent my-3.5 transition-all duration-500 group-hover:w-16" />

                  {/* Card Description */}
                  <p className="text-neutral-600/90 text-[13.5px] leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>

                {/* Card Footer: Royal Verification Hallmark */}
                <div className="mt-7 pt-4 border-t border-brand-sandDark group-hover:border-brand-gold/30 flex items-center justify-between text-[11px] transition-colors duration-300">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                    <span className="text-[10.5px] uppercase tracking-[0.14em] font-medium text-neutral-600 group-hover:text-brand-emerald transition-colors">
                      {item.hallmark}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-goldDark flex items-center gap-1">
                    <Check className="w-3 h-3 text-brand-gold stroke-[2.5]" />
                    Verified
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Editorial Assurance Note */}
        <div className="mt-14 pt-8 border-t border-brand-sandDark/70 max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-neutral-500 font-medium">
            Every journey audited &amp; accompanied by certified halal travel specialists • 100% Discretion Assured
          </p>
        </div>
      </div>
    </section>
  );
}
