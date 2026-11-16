'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Plane,
  Compass,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Gauge,
  Navigation2,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import {
  type SanctuaryLocation,
  type OriginHub,
  ORIGIN_HUBS,
  SANCTUARIES,
  projectCoords,
  calculateDistanceNM,
  calculateFlightDuration,
  getRecommendedAircraft,
} from '@/lib/sanctuary-map';

export type { SanctuaryLocation, OriginHub };
export {
  ORIGIN_HUBS,
  SANCTUARIES,
  projectCoords,
  calculateDistanceNM,
  calculateFlightDuration,
  getRecommendedAircraft,
};

interface GlobalSanctuaryMapProps {
  onOpenInquiry?: (destination?: string) => void;
}

export default function GlobalSanctuaryMap({ onOpenInquiry }: GlobalSanctuaryMapProps) {
  const { formatBdt } = useCurrency();
  const [selectedOrigin, setSelectedOrigin] = useState<OriginHub>(ORIGIN_HUBS[0]); // Dhaka default
  const [selectedSanctuary, setSelectedSanctuary] = useState<SanctuaryLocation>(SANCTUARIES[0]); // Makkah default

  const originCoords = useMemo(
    () => projectCoords(selectedOrigin.lat, selectedOrigin.lon),
    [selectedOrigin]
  );
  const sanctuaryCoords = useMemo(
    () => projectCoords(selectedSanctuary.lat, selectedSanctuary.lon),
    [selectedSanctuary]
  );

  const distanceNM = useMemo(
    () =>
      calculateDistanceNM(
        selectedOrigin.lat,
        selectedOrigin.lon,
        selectedSanctuary.lat,
        selectedSanctuary.lon
      ),
    [selectedOrigin, selectedSanctuary]
  );

  const duration = useMemo(() => calculateFlightDuration(distanceNM), [distanceNM]);
  const aircraft = useMemo(() => getRecommendedAircraft(distanceNM), [distanceNM]);

  // Generate curved golden Bezier arc
  const flightPathArc = useMemo(() => {
    const x1 = originCoords.x;
    const y1 = originCoords.y;
    const x2 = sanctuaryCoords.x;
    const y2 = sanctuaryCoords.y;

    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Arch curves upwards towards north
    const lift = Math.max(35, Math.min(130, dist * 0.3));
    const cx = mx;
    const cy = my - lift;

    return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
  }, [originCoords, sanctuaryCoords]);

  const handleInquireFlight = () => {
    const subject = `Private Jet Charter: ${selectedOrigin.city} (${selectedOrigin.code}) to ${selectedSanctuary.title}`;
    if (onOpenInquiry) {
      onOpenInquiry(subject);
    } else if (typeof window !== 'undefined' && (window as any).openInquiryModal) {
      (window as any).openInquiryModal(subject);
    }
  };

  return (
    <section
      id="sanctuary-map"
      className="relative py-20 bg-gradient-to-b from-[#061410] via-[#0B2019] to-[#061410] text-white border-b border-[#D4AF37]/25 overflow-hidden scroll-mt-20"
    >
      {/* Background Star Constellation Pattern */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="starGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="0.75" fill="#D4AF37" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#starGrid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Luxury Badge and Title */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#D4AF37] text-[10px] tracking-[0.25em] uppercase font-bold mb-3 shadow-xs">
              <Plane className="w-3.5 h-3.5" />
              <span>Private Aviation & Global Sanctuary Map</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-white font-normal tracking-tight">
              Royal Jet Route <span className="italic font-light text-[#F3E5AB]">Simulator</span>
            </h2>
            <p className="text-neutral-300 text-xs sm:text-sm font-light mt-1.5 max-w-2xl leading-relaxed">
              Experience seamless private jet travel from your departure capital directly to our six certified halal sanctuaries with VIP tarmac escort and dedicated royal retinue.
            </p>
          </div>

          {/* Departure Hub Toggle Buttons */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#D4AF37] block">
              Select Private Departure Hub:
            </span>
            <div className="inline-flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-black/40 border border-[#D4AF37]/30 backdrop-blur-md">
              {ORIGIN_HUBS.map((hub) => (
                <button
                  key={hub.code}
                  type="button"
                  onClick={() => setSelectedOrigin(hub)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                    selectedOrigin.code === hub.code
                      ? 'bg-[#D4AF37] text-[#061410] font-bold shadow-lg scale-102'
                      : 'text-neutral-300 hover:text-white hover:bg-white/10'
                  }`}
                  aria-pressed={selectedOrigin.code === hub.code}
                >
                  <Plane className={`w-3.5 h-3.5 ${selectedOrigin.code === hub.code ? 'rotate-45' : ''}`} />
                  <span>{hub.city}</span>
                  <span className={`text-[10px] font-mono px-1 py-0.2 rounded ${
                    selectedOrigin.code === hub.code ? 'bg-[#061410]/20 text-[#061410]' : 'bg-white/10 text-[#D4AF37]'
                  }`}>
                    {hub.code}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive World Vector Map Display */}
        <div className="relative rounded-3xl bg-[#061410]/90 border border-[#D4AF37]/35 p-3 sm:p-6 shadow-2xl overflow-hidden backdrop-blur-sm">
          
          {/* Subtle Top Telemetry Overlay Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-neutral-400 font-mono text-[11px] uppercase tracking-wider">
                DEPARTURE: <span className="text-white font-bold">{selectedOrigin.airport} ({selectedOrigin.code})</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neutral-400 font-mono text-[11px] uppercase tracking-wider">
                DESTINATION: <span className="text-[#D4AF37] font-bold">{selectedSanctuary.title}</span>
              </span>
            </div>
          </div>

          {/* SVG Map Container */}
          <div className="relative w-full aspect-[2/1] min-h-[320px] max-h-[520px] select-none">
            <svg
              viewBox="0 0 1000 500"
              className="w-full h-full"
              preserveAspectRatio="xMidYMid meet"
              aria-label="Interactive Global Sanctuary Vector Map"
            >
              <defs>
                {/* Ocean Gradient */}
                <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#081C15" />
                  <stop offset="50%" stopColor="#0B2019" />
                  <stop offset="100%" stopColor="#061410" />
                </linearGradient>

                {/* Golden Trajectory Arc Gradient */}
                <linearGradient id="flightArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F3E5AB" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#D4AF37" stopOpacity="1" />
                  <stop offset="100%" stopColor="#AA820A" stopOpacity="0.8" />
                </linearGradient>

                {/* Radar Pulse Filter */}
                <radialGradient id="beaconGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Ocean Background */}
              <rect width="1000" height="500" fill="url(#oceanGrad)" rx="16" />

              {/* Equator and Meridian Latitude / Longitude Grids */}
              <g stroke="#D4AF37" strokeOpacity="0.08" strokeWidth="0.75" strokeDasharray="4 4">
                <line x1="0" y1="250" x2="1000" y2="250" /> {/* Equator */}
                <line x1="0" y1="125" x2="1000" y2="125" /> {/* 45 N */}
                <line x1="0" y1="375" x2="1000" y2="375" /> {/* 45 S */}
                <line x1="500" y1="0" x2="500" y2="500" /> {/* Prime Meridian */}
                <line x1="250" y1="0" x2="250" y2="500" />
                <line x1="750" y1="0" x2="750" y2="500" />
              </g>

              {/* Stylized Vector World Landmasses */}
              <g fill="#123026" stroke="#D4AF37" strokeOpacity="0.25" strokeWidth="1" strokeLinejoin="round">
                {/* Europe */}
                <path d="M 470 90 L 515 80 L 550 95 L 565 130 L 540 150 L 500 155 L 480 145 L 460 135 L 450 115 Z" />
                <path d="M 485 105 L 510 102 L 505 125 L 485 120 Z" /> {/* British Isles */}
                <path d="M 465 145 L 495 140 L 490 170 L 465 170 Z" /> {/* Iberian Peninsula (Spain) */}
                <path d="M 515 125 L 530 120 L 528 155 L 518 160 Z" /> {/* Italy */}

                {/* Africa */}
                <path d="M 465 180 L 525 180 L 585 200 L 610 245 L 585 320 L 555 365 L 520 370 L 500 320 L 460 250 L 450 200 Z" />
                <path d="M 605 310 L 615 315 L 610 345 L 600 340 Z" /> {/* Madagascar */}

                {/* Middle East & Central Asia */}
                <path d="M 570 140 L 620 140 L 640 175 L 635 220 L 585 225 L 575 190 Z" /> {/* Arabian Peninsula */}
                <path d="M 570 120 L 670 105 L 710 145 L 670 180 L 620 160 Z" /> {/* Levant & Persia */}

                {/* South Asia & India */}
                <path d="M 670 180 L 730 175 L 755 210 L 735 270 L 705 250 L 680 205 Z" />
                <circle cx="704" cy="238" r="3.5" fill="#13382c" stroke="#D4AF37" strokeOpacity="0.3" /> {/* Maldives */}

                {/* East & Southeast Asia */}
                <path d="M 680 90 L 820 80 L 870 120 L 850 190 L 790 200 L 760 180 L 740 130 Z" />
                <path d="M 770 205 L 820 220 L 830 260 L 770 270 L 755 240 Z" /> {/* SE Asia Archipelago */}
                <path d="M 850 120 L 870 115 L 865 155 L 845 155 Z" /> {/* Japan */}

                {/* North America */}
                <path d="M 120 70 L 260 70 L 290 125 L 240 180 L 190 210 L 150 170 L 100 120 Z" />
                <path d="M 330 40 L 400 40 L 370 85 L 310 80 Z" /> {/* Greenland */}

                {/* South America */}
                <path d="M 230 220 L 305 240 L 330 290 L 290 380 L 250 410 L 235 340 L 210 260 Z" />

                {/* Australia */}
                <path d="M 810 320 L 890 310 L 910 360 L 880 405 L 820 395 L 795 350 Z" />
              </g>

              {/* Animated Flight Path Bezier Arc */}
              <g>
                {/* Glow Filter Line */}
                <path
                  d={flightPathArc}
                  fill="none"
                  stroke="#D4AF37"
                  strokeOpacity="0.25"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                {/* Main Trajectory Line */}
                <path
                  d={flightPathArc}
                  fill="none"
                  stroke="url(#flightArcGrad)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="6 6"
                  className="animate-pulse"
                />
              </g>

              {/* All 6 Sanctuary Location Pins */}
              {SANCTUARIES.map((sanctuary) => {
                const isSelected = selectedSanctuary.id === sanctuary.id;
                const coords = projectCoords(sanctuary.lat, sanctuary.lon);

                return (
                  <g
                    key={sanctuary.id}
                    onClick={() => setSelectedSanctuary(sanctuary)}
                    className="cursor-pointer group"
                    role="button"
                    tabIndex={0}
                    aria-label={`Select sanctuary: ${sanctuary.title}`}
                  >
                    {/* Pulsing Radar Ring for Active Sanctuary */}
                    {isSelected && (
                      <>
                        <circle
                          cx={coords.x}
                          cy={coords.y}
                          r="18"
                          fill="url(#beaconGlow)"
                          className="animate-ping"
                          style={{ animationDuration: '2.5s' }}
                        />
                        <circle
                          cx={coords.x}
                          cy={coords.y}
                          r="12"
                          fill="none"
                          stroke="#D4AF37"
                          strokeWidth="1.5"
                          opacity="0.8"
                        />
                      </>
                    )}

                    {/* Pin Outer Ring */}
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r={isSelected ? '7' : '4.5'}
                      fill={isSelected ? '#D4AF37' : '#0B2019'}
                      stroke={isSelected ? '#F3E5AB' : '#D4AF37'}
                      strokeWidth={isSelected ? '2' : '1.5'}
                      className="transition-all duration-300 group-hover:scale-125"
                    />

                    {/* Pin Inner Center */}
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r={isSelected ? '3' : '1.5'}
                      fill={isSelected ? '#061410' : '#F3E5AB'}
                    />

                    {/* Label Badge */}
                    <g transform={`translate(${coords.x}, ${coords.y - 12})`}>
                      <rect
                        x="-40"
                        y="-16"
                        width="80"
                        height="16"
                        rx="8"
                        fill={isSelected ? '#0B2019' : 'rgba(6,20,16,0.85)'}
                        stroke={isSelected ? '#D4AF37' : 'rgba(212,175,55,0.4)'}
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="-5"
                        textAnchor="middle"
                        fill={isSelected ? '#F3E5AB' : '#E2E8F0'}
                        fontSize="8"
                        fontWeight={isSelected ? 'bold' : 'normal'}
                        letterSpacing="0.05em"
                        className="pointer-events-none select-none font-sans"
                      >
                        {sanctuary.shortTitle}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Selected Origin Hub Marker */}
              <g transform={`translate(${originCoords.x}, ${originCoords.y})`}>
                <circle r="14" fill="#10B981" opacity="0.2" className="animate-ping" />
                <circle r="6" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
                <g transform="translate(0, 16)">
                  <rect
                    x="-24"
                    y="0"
                    width="48"
                    height="14"
                    rx="4"
                    fill="#061410"
                    stroke="#10B981"
                    strokeWidth="1"
                  />
                  <text
                    x="0"
                    y="10"
                    textAnchor="middle"
                    fill="#A7F3D0"
                    fontSize="7.5"
                    fontWeight="bold"
                    letterSpacing="0.1em"
                    className="select-none font-mono"
                  >
                    {selectedOrigin.code} ORIGIN
                  </text>
                </g>
              </g>
            </svg>
          </div>

          {/* Sanctuary Selection Pills Slider */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] whitespace-nowrap pl-1 pr-2">
              Royal Sanctuaries:
            </span>
            {SANCTUARIES.map((sanctuary) => (
              <button
                key={sanctuary.id}
                type="button"
                onClick={() => setSelectedSanctuary(sanctuary)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                  selectedSanctuary.id === sanctuary.id
                    ? 'bg-[#D4AF37] text-[#061410] font-bold shadow-md'
                    : 'bg-white/5 text-neutral-300 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                <MapPin className="w-3 h-3 text-[#D4AF37]" />
                <span>{sanctuary.shortTitle}</span>
              </button>
            ))}
          </div>

        </div>

        {/* Flight Telemetry & Sanctuary Preview Dashboard Grid */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Flight Telemetry & Aircraft Specs (7 Columns) */}
          <div className="lg:col-span-7 bg-[#061410]/80 rounded-3xl border border-[#D4AF37]/30 p-6 backdrop-blur-md flex flex-col justify-between space-y-6">
            
            {/* Telemetry Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <Gauge className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#D4AF37] block">
                    Avionics & Telemetry
                  </span>
                  <h3 className="font-serif text-xl text-white font-semibold">
                    {selectedOrigin.city} → {selectedSanctuary.shortTitle}
                  </h3>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-mono">Status</span>
                <span className="text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">Flight Plan Active</span>
              </div>
            </div>

            {/* Telemetry Stats 4-Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-mono">Flight Duration</span>
                <span className="font-serif text-2xl font-bold text-[#D4AF37] block mt-0.5">{duration.text}</span>
                <span className="text-[10px] text-neutral-400 font-light">Non-stop private cruise</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-mono">Air Distance</span>
                <span className="font-serif text-2xl font-bold text-white block mt-0.5">
                  {distanceNM.toLocaleString()} <span className="text-xs font-sans text-neutral-400 font-normal">NM</span>
                </span>
                <span className="text-[10px] text-neutral-400 font-light">Great-circle route</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-mono">Cruising Speed</span>
                <span className="font-serif text-xl font-bold text-white block mt-1">{aircraft.speed.split(' ')[0]}</span>
                <span className="text-[10px] text-neutral-400 font-light">{aircraft.speed.split('(')[1]?.replace(')', '') || 'High-speed'}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-mono">Cruise Ceiling</span>
                <span className="font-serif text-xl font-bold text-white block mt-1">{aircraft.ceiling.split(' ')[0]}</span>
                <span className="text-[10px] text-neutral-400 font-light">{aircraft.ceiling.split('(')[1]?.replace(')', '') || 'Above weather'}</span>
              </div>
            </div>

            {/* Aircraft Details Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0B2019] to-black/60 border border-[#D4AF37]/35 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Plane className="w-5 h-5 rotate-45" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#D4AF37] block">
                    Recommended Jet Configuration
                  </span>
                  <h4 className="font-serif text-lg font-bold text-white">
                    {aircraft.model}
                  </h4>
                  <p className="text-xs text-neutral-300 font-light">
                    {aircraft.category} • Private bedroom suite & certified halal culinary galley
                  </p>
                </div>
              </div>

              <div className="shrink-0 text-left sm:text-right">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-200 bg-white/10 px-2.5 py-1 rounded-full border border-white/15">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>VIP Tarmac Fast-Track</span>
                </span>
              </div>
            </div>

          </div>

          {/* Right: Selected Sanctuary Preview Card (5 Columns) */}
          <div className="lg:col-span-5 bg-[#061410]/80 rounded-3xl border border-[#D4AF37]/30 p-6 backdrop-blur-md flex flex-col justify-between space-y-4">
            
            <div className="relative h-44 rounded-2xl overflow-hidden border border-white/15 group">
              <img
                src={selectedSanctuary.image}
                alt={selectedSanctuary.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3 bg-[#0B2019]/90 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                {selectedSanctuary.country}
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h4 className="font-serif text-xl font-bold text-white leading-tight">
                  {selectedSanctuary.title}
                </h4>
                <span className="text-xs text-[#F3E5AB] font-light block mt-0.5">
                  {selectedSanctuary.duration}
                </span>
              </div>
            </div>

            {/* Sanctuary Inclusions Checklist */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block">
                Exclusive Sanctuary Curations:
              </span>
              <ul className="space-y-1 text-xs text-neutral-300">
                {selectedSanctuary.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price & Action Buttons */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-semibold">
                  Starting Investment
                </span>
                <span className="font-serif text-2xl font-bold text-[#D4AF37]">
                  {formatBdt(selectedSanctuary.priceBdt)}
                </span>
                <span className="text-[11px] text-neutral-400 font-light block">/ guest</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <Link
                  href={`/destinations/${selectedSanctuary.id}`}
                  className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl border border-white/20 hover:border-[#D4AF37] text-white hover:text-[#D4AF37] text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Dossier</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={handleInquireFlight}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#061410] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
                >
                  <span>Inquire Jet Charter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
