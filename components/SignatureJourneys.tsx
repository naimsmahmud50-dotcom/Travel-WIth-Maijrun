'use client';

import React from 'react';
import { ArrowRight, Compass } from 'lucide-react';

interface SignatureJourneysProps {
  onOpenInquiry: (destination?: string) => void;
}

const SIGNATURE_CARDS = [
  {
    id: 'switzerland',
    title: 'Switzerland',
    tag: 'Alpine Sanctuary',
    desc: 'Storybook Alpine peaks of Zermatt & Lake Geneva with private halal chalet catering.',
    price: '10 Days • From ৳ 890,000 / $7,400',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800&auto=format&fit=crop',
    inquiryTarget: 'Switzerland Alpine Sanctuary',
  },
  {
    id: 'costa-rica',
    title: 'Costa Rica',
    tag: 'Pristine Eco-Sanctuary',
    desc: 'Lush cloud forests, private hot-spring villas, and custom halal eco-adventures.',
    price: '9 Days • From ৳ 720,000 / $6,000',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    inquiryTarget: 'Costa Rica Rainforest Sanctuary',
  },
  {
    id: 'japan',
    title: 'Japan',
    tag: 'Imperial Heritage',
    desc: 'Kyoto private ryokan buyouts, bullet train first class, and certified halal Wagyu Kaiseki.',
    price: '12 Days • From ৳ 940,000 / $7,800',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop',
    inquiryTarget: 'Japan Heritage Ryokan',
  },
  {
    id: 'moorish-spain',
    title: 'Moorish Spain',
    tag: 'Islamic Golden Age',
    desc: 'VIP private access to Alhambra, historic Cordoba courtyards, and halal olive-estate dining.',
    price: '11 Days • From ৳ 768,000 / $6,400',
    image: 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?q=80&w=800&auto=format&fit=crop',
    inquiryTarget: 'Andalusia Private Palaces',
  },
];

export default function SignatureJourneys({ onOpenInquiry }: SignatureJourneysProps) {
  return (
    <section id="signature-journeys" className="py-20 bg-white border-b border-brand-sandDark/70 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-brand-goldDark">Destinations We Love</span>
            <h2 className="font-serif text-3xl sm:text-5xl text-brand-emerald tracking-tight mt-2">
              Signature Journeys
            </h2>
            <p className="text-neutral-500 text-sm font-light mt-1">
              Inspired by iconic global journeys, hand-crafted with 100% verified Halal luxury.
            </p>
          </div>
          <button
            onClick={() => onOpenInquiry('Where Do You Want To Go Consultation')}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-brand-emerald hover:text-brand-gold transition-colors cursor-pointer group"
          >
            <span>Request Custom Portfolio</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SIGNATURE_CARDS.map((card) => (
            <div
              key={card.id}
              onClick={() => onOpenInquiry(card.inquiryTarget)}
              className="group relative rounded-2xl overflow-hidden shadow-lg h-96 flex flex-col justify-end p-6 cursor-pointer"
            >
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
              <div className="relative z-10 space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-brand-gold font-bold">
                  {card.tag}
                </span>
                <h3 className="font-serif text-2xl font-bold text-white group-hover:text-brand-goldLight transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-neutral-300 font-light line-clamp-2">
                  {card.desc}
                </p>
                <span className="text-[11px] text-brand-gold font-semibold pt-1 inline-block">
                  {card.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
