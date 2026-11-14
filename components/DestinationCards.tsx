'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCcw, Compass } from 'lucide-react';
import { JourneyFilter } from '@/components/JourneyFinder';

export interface DestinationCardsProps {
  onOpenInquiry: (destination?: string) => void;
  searchFilter?: JourneyFilter | null;
  onResetFilter?: () => void;
}

export interface DestinationItem {
  id: string;
  category: 'pilgrimage' | 'heritage' | 'island' | 'alpine';
  tag: string;
  duration: string;
  country: string;
  region: string;
  title: string;
  desc: string;
  priceBdt: string;
  image: string;
  destKey: string;
  styles: string[];
  seasons: string[];
}

export const DESTINATIONS: DestinationItem[] = [
  {
    id: 'makkah',
    destKey: 'saudi',
    category: 'pilgrimage',
    tag: 'Royal Presidential',
    duration: '10 Days • 9 Nights',
    country: 'Saudi Arabia',
    region: 'Bespoke Umrah',
    title: 'The Sacred Sanctuaries: Makkah & Madinah',
    desc: 'Direct Kaaba-view suites at Raffles or Dar Al Tawhid, Haram VIP access assistance, private luxury bullet train transfers, and scholars on retinue.',
    priceBdt: '৳695,000',
    image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=75&w=640&auto=format&fit=crop',
    styles: ['spiritual', 'family'],
    seasons: ['any', 'ramadan', 'winter', 'spring', 'summer'],
  },
  {
    id: 'spain',
    destKey: 'spain',
    category: 'heritage',
    tag: 'Cultural Heritage',
    duration: '12 Days • 11 Nights',
    country: 'Spain',
    region: 'Granada, Cordoba, Seville',
    title: 'Echoes of Al-Andalus: Moorish Splendors',
    desc: 'Private after-hours entry into the Alhambra and Great Mosque of Cordoba. Halal Andalusian culinary tastings and luxury historical estates.',
    priceBdt: '৳768,000',
    image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?q=75&w=640&auto=format&fit=crop',
    styles: ['heritage', 'honeymoon', 'family'],
    seasons: ['any', 'spring', 'summer', 'winter'],
  },
  {
    id: 'maldives',
    destKey: 'maldives',
    category: 'island',
    tag: '100% Privacy',
    duration: '7 Days • 6 Nights',
    country: 'Maldives',
    region: 'Bespoke Island Escape',
    title: 'The Pearl Pavilions: Private Overwater Sanctuary',
    desc: 'Enclosed lagoon infinity pool, halal private destination dining under the stars, zero public visibility, and dedicated private seaplane transfers.',
    priceBdt: '৳864,000',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=75&w=640&auto=format&fit=crop',
    styles: ['honeymoon', 'family'],
    seasons: ['any', 'winter', 'spring'],
  },
  {
    id: 'switzerland',
    destKey: 'switzerland',
    category: 'alpine',
    tag: 'Alpine Retreat',
    duration: '9 Days • 8 Nights',
    country: 'Switzerland',
    region: 'Zermatt & St. Moritz',
    title: 'Matterhorn Majesty: Swiss Alpine Chalets',
    desc: 'Private luxury chalet with halal private chef, panoramic glacier express first-class carriage, helicopter scenic flights, and secluded wellness spas.',
    priceBdt: '৳1,020,000',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=75&w=640&auto=format&fit=crop',
    styles: ['honeymoon', 'family', 'alpine'],
    seasons: ['any', 'winter', 'summer', 'spring'],
  },
  {
    id: 'turkey',
    destKey: 'turkey',
    category: 'heritage',
    tag: 'Palatial Journey',
    duration: '10 Days • 9 Nights',
    country: 'Turkey',
    region: 'Bosphorus & Aegean Coast',
    title: 'Sultans of the Bosphorus: Palaces & Yachts',
    desc: 'Ciragan Palace Kempinski waterfront suites, chartered mega-yacht sunset cruise, Hagia Sophia after-hours tour, and secluded Bodrum coastal villa.',
    priceBdt: '৳624,000',
    image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=75&w=640&auto=format&fit=crop',
    styles: ['heritage', 'honeymoon', 'family'],
    seasons: ['any', 'ramadan', 'spring', 'summer'],
  },
  {
    id: 'safari',
    destKey: 'africa',
    category: 'alpine',
    tag: 'Wildlife Safari',
    duration: '8 Days • 7 Nights',
    country: 'Tanzania',
    region: 'Serengeti & Ngorongoro',
    title: 'The Great Migration: Luxury Tented Haven',
    desc: 'Singita luxury tented camp with certified halal gourmet catering, hot-air balloon dawn flight over the plains, and private open-roof 4x4 land cruisers.',
    priceBdt: '৳1,176,000',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=75&w=640&auto=format&fit=crop',
    styles: ['safari', 'family'],
    seasons: ['any', 'summer', 'winter', 'spring'],
  },
];

const DESTINATION_LABELS: Record<string, string> = {
  all: 'All Global Havens',
  saudi: 'Makkah & Madinah',
  spain: 'Andalusia & Granada',
  maldives: 'Maldives',
  turkey: 'Istanbul & Turkish Riviera',
  switzerland: 'Swiss Alps',
  africa: 'Serengeti & Masai Mara',
};

const STYLE_LABELS: Record<string, string> = {
  all: 'All Travel Styles',
  spiritual: 'Sacred Spiritual Pilgrimage',
  heritage: 'Islamic Golden Age Heritage',
  honeymoon: 'Secluded Honeymoon & Couples',
  family: 'Private Family Multi-Gen Villa',
  safari: 'Halal Wildlife Safari',
};

const MONTH_LABELS: Record<string, string> = {
  any: 'Flexible / Year-round',
  ramadan: 'Ramadan 2026 Season',
  winter: 'Winter Retreats (Nov - Feb)',
  spring: 'Spring Blossom (Mar - May)',
  summer: 'Summer Escapes (Jun - Aug)',
};

export default function DestinationCards({
  onOpenInquiry,
  searchFilter,
  onResetFilter,
}: DestinationCardsProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  // Synchronize category pills whenever external search filter changes
  useEffect(() => {
    if (!searchFilter) {
      setActiveCategory('all');
      return;
    }

    if (searchFilter.destination === 'saudi' || searchFilter.style === 'spiritual') {
      setActiveCategory('pilgrimage');
    } else if (
      (searchFilter.destination === 'spain' || searchFilter.destination === 'turkey') &&
      searchFilter.style === 'all'
    ) {
      setActiveCategory('heritage');
    } else if (searchFilter.style === 'heritage') {
      setActiveCategory('heritage');
    } else if (searchFilter.destination === 'maldives') {
      setActiveCategory('island');
    } else if (
      searchFilter.destination === 'switzerland' ||
      searchFilter.destination === 'africa' ||
      searchFilter.style === 'safari'
    ) {
      setActiveCategory('alpine');
    } else {
      setActiveCategory('all');
    }
  }, [searchFilter]);

  const isSearchActive = Boolean(
    searchFilter &&
      (searchFilter.destination !== 'all' ||
        searchFilter.style !== 'all' ||
        (searchFilter.month && searchFilter.month !== 'any'))
  );

  const handleReset = () => {
    setActiveCategory('all');
    if (onResetFilter) {
      onResetFilter();
    }
  };

  const filtered = DESTINATIONS.filter((d) => {
    // 1. Category pill filter
    if (activeCategory !== 'all' && d.category !== activeCategory) {
      return false;
    }

    // 2. Search destination filter
    if (searchFilter?.destination && searchFilter.destination !== 'all') {
      if (d.destKey !== searchFilter.destination && d.id !== searchFilter.destination) {
        return false;
      }
    }

    // 3. Search style filter
    if (searchFilter?.style && searchFilter.style !== 'all') {
      if (!d.styles.includes(searchFilter.style) && d.category !== searchFilter.style) {
        return false;
      }
    }

    // 4. Search month filter
    if (searchFilter?.month && searchFilter.month !== 'any') {
      if (!d.seasons.includes(searchFilter.month)) {
        return false;
      }
    }

    return true;
  });

  return (
    <section id="destinations" className="py-20 bg-white border-y border-brand-sandDark/70 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
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
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap ${
                  activeCategory === tab.id
                    ? 'bg-brand-emerald text-white shadow-sm'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sleek luxury indicator badge showing active external filter */}
        {isSearchActive && (
          <div
            data-testid="active-filter-badge"
            className="mb-8 p-4 sm:p-5 rounded-2xl bg-brand-sandLight/90 border border-brand-gold/30 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-emerald text-brand-gold flex items-center justify-center shrink-0 shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-goldDark">
                    Active Bespoke Filter
                  </span>
                  <span className="text-xs text-neutral-300">•</span>
                  <span className="text-xs font-serif italic text-brand-emerald font-semibold">
                    {filtered.length} {filtered.length === 1 ? 'Sanctuary' : 'Sanctuaries'} Found
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  {searchFilter?.destination && searchFilter.destination !== 'all' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20">
                      <span className="text-[10px] uppercase text-brand-goldDark font-semibold">Destination:</span>
                      <span>{DESTINATION_LABELS[searchFilter.destination] || searchFilter.destination}</span>
                    </span>
                  )}
                  {searchFilter?.style && searchFilter.style !== 'all' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20">
                      <span className="text-[10px] uppercase text-brand-goldDark font-semibold">Style:</span>
                      <span>{STYLE_LABELS[searchFilter.style] || searchFilter.style}</span>
                    </span>
                  )}
                  {searchFilter?.month && searchFilter.month !== 'any' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20">
                      <span className="text-[10px] uppercase text-brand-goldDark font-semibold">Month:</span>
                      <span>{MONTH_LABELS[searchFilter.month] || searchFilter.month}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase text-neutral-700 hover:text-brand-emerald bg-white hover:bg-brand-sand border border-neutral-200 hover:border-brand-gold transition-all duration-300 shadow-sm shrink-0"
              aria-label="Reset filter and view all sanctuaries"
            >
              <RotateCcw className="w-3.5 h-3.5 text-brand-goldDark" />
              <span>Reset / View All</span>
            </button>
          </div>
        )}

        {/* Dynamic Card Grid or Elegant Empty State */}
        {filtered.length === 0 ? (
          <div
            data-testid="destinations-empty-state"
            className="py-16 sm:py-20 px-6 text-center max-w-xl mx-auto bg-brand-sandLight/60 rounded-3xl border border-brand-sandDark shadow-sm"
          >
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-brand-emerald/10 border border-brand-gold/30 flex items-center justify-center text-brand-goldDark">
              <Compass className="w-8 h-8 stroke-[1.5]" />
            </div>
            <span className="text-[11px] uppercase tracking-[0.25em] font-bold text-brand-goldDark block mb-2">
              Curated Sanctuary Search
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-brand-emerald font-bold mb-3">
              No exact matches found for this specific criterion
            </h3>
            <p className="text-neutral-600 text-sm font-light leading-relaxed mb-8">
              No exact matches found for this specific criterion — browse our full royal portfolio, or let our Senior Concierge tailor an exclusive itinerary to your exact dates.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleReset}
                className="w-full sm:w-auto bg-brand-emerald hover:bg-brand-gold text-white hover:text-brand-emeraldDeep text-xs font-semibold uppercase tracking-widest px-6 py-3.5 rounded-xl transition-all duration-300 shadow-md inline-flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>View All Sanctuaries</span>
              </button>
              <button
                onClick={() => onOpenInquiry('Custom Bespoke Itinerary')}
                className="w-full sm:w-auto bg-white hover:bg-brand-sand text-brand-emerald hover:text-brand-emeraldDeep border border-brand-emerald/30 text-xs font-semibold uppercase tracking-widest px-6 py-3.5 rounded-xl transition-all duration-300 shadow-sm"
              >
                Request Bespoke Concierge
              </button>
            </div>
          </div>
        ) : (
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
        )}
      </div>
    </section>
  );
}
