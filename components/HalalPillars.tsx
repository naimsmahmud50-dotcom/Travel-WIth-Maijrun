import React from 'react';
import { Utensils, ShieldCheck, Clock, UserCheck } from 'lucide-react';

const PILLARS = [
  {
    icon: Utensils,
    title: '100% Halal Gourmet',
    desc: 'Michelin-starred private chefs, hand-slaughtered certified halal meats, and alcohol-free banquets arranged at every private destination.',
  },
  {
    icon: ShieldCheck,
    title: 'Absolute Family Privacy',
    desc: 'Private secluded pool villas, private yacht charters, and private island sections ensuring zero sightlines from neighbors for complete peace of mind.',
  },
  {
    icon: Clock,
    title: 'Prayer-Friendly Pacing',
    desc: 'Itineraries seamlessly choreographed around daily Salah times, including Qibla directions, premium prayer mats, and stops at breathtaking historical Mosques.',
  },
  {
    icon: UserCheck,
    title: '24/7 Dedicated Concierge',
    desc: 'Your personal travel butler and expert cultural guides who understand your traditions and manage every airport VIP escort, baggage, and booking.',
  },
];

export default function HalalPillars() {
  return (
    <section id="halal-philosophy" class="py-24 max-w-7xl mx-auto px-4 sm:px-8">
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <span className="text-xs uppercase tracking-[0.25em] font-bold text-brand-goldDark">The Maijrun Standard of Excellence</span>
        <h2 className="font-serif text-3xl sm:text-5xl text-brand-emerald tracking-tight">
          Why The World’s Discerning Families <br />
          <span className="italic font-light">Choose Travel With Maijrun</span>
        </h2>
        <div className="w-20 h-0.5 bg-brand-gold mx-auto mt-4" />
        <p className="text-neutral-600 font-light text-base leading-relaxed pt-2">
          We have redefined ultra-luxury travel for the modern conscious traveler. No compromises between five-star world-class opulence and religious compliance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {PILLARS.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-8 border border-neutral-200/80 hover:border-brand-gold/50 hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center mb-6 group-hover:bg-brand-emerald group-hover:text-brand-gold transition-colors">
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl text-brand-emerald font-semibold mb-3">{item.title}</h3>
              <p className="text-neutral-600 text-sm leading-relaxed font-light">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
