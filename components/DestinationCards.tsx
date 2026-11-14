'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCcw, Compass } from 'lucide-react';
import {
  DESTINATIONS,
  type DestinationItem,
  type JourneyFilter,
  DESTINATION_LABELS,
  STYLE_LABELS,
  MONTH_LABELS,
  determineCategoryFromFilter,
  filterDestinations,
  isSearchFilterActive,
} from '@/lib/destinations';

export { DESTINATIONS };
export type { DestinationItem, JourneyFilter };

export interface DestinationCardsProps {
  onOpenInquiry: (destination?: string) => void;
  searchFilter?: JourneyFilter | null;
  onResetFilter?: () => void;
  onFilterChange?: (filter: JourneyFilter | null) => void;
}

export default function DestinationCards({
  onOpenInquiry,
  searchFilter,
  onResetFilter,
  onFilterChange,
}: DestinationCardsProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  // Synchronize category pills whenever external search filter changes
  useEffect(() => {
    setActiveCategory(determineCategoryFromFilter(searchFilter));
  }, [searchFilter]);

  const isSearchActive = isSearchFilterActive(searchFilter);

  const handleReset = () => {
    setActiveCategory('all');
    if (onResetFilter) {
      onResetFilter();
    }
  };

  const handleCategorySelect = (catId: string) => {
    setActiveCategory(catId);

    // If a category pill is explicitly clicked by user:
    if (catId === 'all') {
      // If destination was set, clicking 'All' clears the destination constraint
      if (searchFilter?.destination && searchFilter.destination !== 'all') {
        if (onFilterChange) {
          onFilterChange(
            searchFilter.style === 'all' && (searchFilter.month === 'any' || !searchFilter.month)
              ? null
              : { ...searchFilter, destination: 'all' }
          );
        } else if (onResetFilter && searchFilter.style === 'all' && (searchFilter.month === 'any' || !searchFilter.month)) {
          onResetFilter();
        }
      }
    } else {
      // If destination belongs to another category, clear conflicting destination
      if (searchFilter?.destination && searchFilter.destination !== 'all') {
        const destItem = DESTINATIONS.find(
          (d) => d.destKey === searchFilter.destination || d.id === searchFilter.destination
        );
        if (destItem && destItem.category !== catId) {
          if (onFilterChange) {
            onFilterChange({ ...searchFilter, destination: 'all' });
          } else if (onResetFilter) {
            onResetFilter();
          }
        }
      }
    }
  };

  const filtered = filterDestinations(DESTINATIONS, activeCategory, searchFilter);

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
                onClick={() => handleCategorySelect(tab.id)}
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
