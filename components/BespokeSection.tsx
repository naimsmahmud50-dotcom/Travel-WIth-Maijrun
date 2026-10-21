import React from 'react';
import { Check } from 'lucide-react';

interface BespokeSectionProps {
  onOpenInquiry: (topic?: string) => void;
}

export default function BespokeSection({ onOpenInquiry }: BespokeSectionProps) {
  return (
    <section id="bespoke-tailored" className="py-24 bg-brand-emerald text-white relative overflow-hidden">
      <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-brand-gold/10 filter blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -top-20 w-96 h-96 rounded-full bg-brand-gold/10 filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-brand-gold">Crafted Purely For You</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal leading-tight">
              No Fixed Schedules. <br />
              <span className="italic font-light gold-gradient-text">Only Pure Bespoke Freedom.</span>
            </h2>
            <p className="text-neutral-300 font-light text-base sm:text-lg leading-relaxed">
              Every family and traveler is unique. Whether you require a private Gulfstream jet to Madinah, complete privacy for an anniversary in Bora Bora, or multi-generational villas in the Scottish Highlands, our master travel designers craft each day from scratch.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-gold/20 text-brand-gold flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-base">Direct Conversation with Master Designers</h4>
                  <p className="text-neutral-400 text-sm font-light">We listen to your exact privacy wishes, dietary requirements, and dream pacing.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-gold/20 text-brand-gold flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-base">Vetted Private Villa Portfolio</h4>
                  <p className="text-neutral-400 text-sm font-light">Inspected personally by our team for privacy sightlines, prayer spaces, and service discretion.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-gold/20 text-brand-gold flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-base">Seamless VIP Airport Protocols</h4>
                  <p className="text-neutral-400 text-sm font-light">Tarmac limousine escort, priority immigration fast-track, and discrete handling worldwide.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => onOpenInquiry('Bespoke Custom Plan')}
                className="bg-brand-gold hover:bg-white text-brand-emeraldDeep font-semibold text-xs tracking-widest uppercase px-8 py-4 rounded-full shadow-xl transition-all duration-300"
              >
                Start Designing With A Specialist
              </button>
            </div>
          </div>

          <div className="glass-dark rounded-2xl p-8 border border-brand-gold/30 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs uppercase tracking-widest text-brand-goldLight font-bold">Bespoke Design Preview</span>
              </div>
              <span className="text-xs text-neutral-400">Sample Day Protocol</span>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between text-xs text-brand-gold mb-1 font-semibold">
                  <span>08:30 AM • FAJR & PRIVATE BREAKFAST</span>
                  <span>Granada, Spain</span>
                </div>
                <h4 className="text-white font-serif text-lg">Al-Andalus Sunrise Gastronomy</h4>
                <p className="text-neutral-300 text-xs font-light mt-1">Gourmet certified halal breakfast prepared by Private Chef Carlos at your private Carmen estate overlooking the Generalife gardens.</p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between text-xs text-brand-gold mb-1 font-semibold">
                  <span>01:15 PM • PRIVATE ACCESS & ZUHR</span>
                  <span>Nasrid Palaces</span>
                </div>
                <h4 className="text-white font-serif text-lg">Exclusive Alhambra Court of the Lions</h4>
                <p className="text-neutral-300 text-xs font-light mt-1">Private escorted entry behind velvet ropes with renowned Islamic architecture historian. Dedicated quiet prayer lounge reserved nearby.</p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between text-xs text-brand-gold mb-1 font-semibold">
                  <span>07:45 PM • SUNSET DINNER CRUISE</span>
                  <span>Mediterranean Sea</span>
                </div>
                <h4 className="text-white font-serif text-lg">Private Yacht Charter & Halal Seafood Banquet</h4>
                <p className="text-neutral-300 text-xs font-light mt-1">Sunset sailing along the Costa del Sol with non-alcoholic artisanal sparkling beverages, fresh Mediterranean catch, and starlit acoustics.</p>
              </div>
            </div>

            <div className="text-center pt-2">
              <span className="text-xs text-neutral-400">Everything is customizable down to the minute.</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
