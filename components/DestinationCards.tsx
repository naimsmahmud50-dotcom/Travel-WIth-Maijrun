'use client';

import React, { useState } from 'react';

interface DestinationCardsProps {
  onOpenInquiry: (destination?: string) => void;
}

const DESTINATIONS = [
  {
    id: 'makkah',
    category: 'pilgrimage',
    tag: 'Royal Presidential',
    duration: '10 Days • 9 Nights',
    country: 'Saudi Arabia',
    region: 'Bespoke Umrah',
    title: 'The Sacred Sanctuaries: Makkah & Madinah',
    desc: 'Direct Kaaba-view suites at Raffles or Dar Al Tawhid, Haram VIP access assistance, private luxury bullet train transfers, and scholars on retinue.',
    priceBdt: '৳695,000',
    image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=75&w=640&auto=format&fit=crop',
  },
  {
    id: 'spain',
    category: 'heritage',
    tag: 'Cultural Heritage',
    duration: '12 Days • 11 Nights',
    country: 'Spain',
    region: 'Granada, Cordoba, Seville',
    title: 'Echoes of Al-Andalus: Moorish Splendors',
    desc: 'Private after-hours entry into the Alhambra and Great Mosque of Cordoba. Halal Andalusian culinary tastings and luxury historical estates.',
    priceBdt: '৳768,000',
    image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?q=75&w=640&auto=format&fit=crop',
  },
  {
    id: 'maldives',
    category: 'island',
    tag: '100% Privacy',
    duration: '7 Days • 6 Nights',
    country: 'Maldives',
    region: 'Bespoke Island Escape',
    title: 'The Pearl Pavilions: Private Overwater Sanctuary',
    desc: 'Enclosed lagoon infinity pool, halal private destination dining under the stars, zero public visibility, and dedicated private seaplane transfers.',
    priceBdt: '৳864,000',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=75&w=640&auto=format&fit=crop',
  },
  {
    id: 'switzerland',
    category: 'alpine',
    tag: 'Alpine Retreat',
    duration: '9 Days • 8 Nights',
    country: 'Switzerland',
    region: 'Zermatt & St. Moritz',
    title: 'Matterhorn Majesty: Swiss Alpine Chalets',
    desc: 'Private luxury chalet with halal private chef, panoramic glacier express first-class carriage, helicopter scenic flights, and secluded wellness spas.',
    priceBdt: '৳1,020,000',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=75&w=640&auto=format&fit=crop',
  },
  {
    id: 'turkey',
    category: 'heritage',
    tag: 'Palatial Journey',
    duration: '10 Days • 9 Nights',
    country: 'Turkey',
    region: 'Bosphorus & Aegean Coast',
    title: 'Sultans of the Bosphorus: Palaces & Yachts',
    desc: 'Ciragan Palace Kempinski waterfront suites, chartered mega-yacht sunset cruise, Hagia Sophia after-hours tour, and secluded Bodrum coastal villa.',
    priceBdt: '৳624,000',
    image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=75&w=640&auto=format&fit=crop',
  },
  {
    id: 'safari',
    category: 'alpine',
    tag: 'Wildlife Safari',
    duration: '8 Days • 7 Nights',
    country: 'Tanzania',
    region: 'Serengeti & Ngorongoro',
    title: 'The Great Migration: Luxury Tented Haven',
    desc: 'Singita luxury tented camp with certified halal gourmet catering, hot-air balloon dawn flight over the plains, and private open-roof 4x4 land cruisers.',
    priceBdt: '৳1,176,000',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=75&w=640&auto=format&fit=crop',
  },
];

export default function DestinationCards({ onOpenInquiry }: DestinationCardsProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = DESTINATIONS.filter((d) => activeCategory === 'all' || d.category === activeCategory);

  return (
    <section id="destinations" className="py-20 bg-white border-y border-brand-sandDark/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-brand-goldDark">World-Class Portfolio</span>
            <h2 className="font-serif text-3xl sm:text-5xl text-brand-emerald tracking-tight mt-2">
              Curated Expeditions for 2026
            </h2>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'pilgrimage', label: 'Pilgrimage' },
              { id: 'heritage', label: 'Heritage' },
              { id: 'island', label: 'Islands & Seclusion' },
              { id: 'alpine', label: 'Alpine & Nature' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all ${
                  activeCategory === tab.id
                    ? 'bg-brand-emerald text-white'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-brand-sandLight rounded-2xl overflow-hidden border border-neutral-200 hover:shadow-2xl transition-all duration-500 group flex flex-col justify-between"
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-brand-emerald/90 backdrop-blur-md text-brand-gold text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border border-brand-gold/30">
                  {item.tag}
                </div>
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-md">
                  {item.duration}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-brand-goldDark font-semibold uppercase tracking-wider mb-1">
                    <span>{item.country}</span> • <span>{item.region}</span>
                  </div>
                  <h3 className="font-serif text-2xl text-brand-emerald font-bold group-hover:text-brand-goldDark transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-neutral-600 text-sm font-light leading-relaxed mt-2">{item.desc}</p>
                </div>

                <div className="pt-4 border-t border-neutral-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-neutral-400 block font-semibold">Starting From</span>
                    <span className="font-serif text-xl font-bold text-brand-emerald">{item.priceBdt}</span>
                    <span className="text-xs text-neutral-500 font-light"> / guest</span>
                  </div>
                  <button
                    onClick={() => onOpenInquiry(item.title)}
                    className="bg-brand-emerald hover:bg-brand-gold text-white hover:text-brand-emeraldDeep text-xs font-semibold uppercase tracking-widest px-4 py-2.5 rounded-lg transition-colors"
                  >
                    Details & Booking
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
