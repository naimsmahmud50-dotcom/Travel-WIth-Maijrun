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
      className="relative py-20 sm:py-24 bg-[#FAF8F5] text-[#0B2019] border-b border-[#E8E2D5] overflow-hidden scroll-mt-20 transition-colors duration-500"
    >
      {/* Subtle Warm Luxury Cartographic Background Pattern */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cartoGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1" fill="#D4AF37" opacity="0.35" />
              <path d="M 30 0 L 30 60 M 0 30 L 60 30" stroke="#D4AF37" strokeWidth="0.5" strokeOpacity="0.09" strokeDasharray="2 4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cartoGrid)" />
        </svg>
      </div>

      {/* Ambient Warm Golden Center Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55rem] h-[30rem] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/12 via-[#D4AF37]/3 to-transparent filter blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Editorial Header with Luxury Badge and Title */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#8C6B14] text-[10px] sm:text-[11px] tracking-[0.25em] uppercase font-bold mb-3 shadow-xs">
              <Plane className="w-3.5 h-3.5 text-[#8C6B14]" />
              <span>Private Aviation &amp; Global Sanctuary Map</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#0B2019] font-normal tracking-tight">
              Royal Jet Route <span className="italic font-light text-[#8C6B14]">Simulator</span>
            </h2>
            <p className="text-neutral-600 text-xs sm:text-sm font-light mt-2 max-w-2xl leading-relaxed">
              Experience seamless private jet travel from your departure capital directly to our six certified halal sanctuaries with VIP tarmac escort and dedicated royal retinue.
            </p>
          </div>

          {/* Departure Hub Toggle Pills */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8C6B14] block">
              Select Private Departure Hub:
            </span>
            <div className="inline-flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-white/90 border border-[#D4AF37]/30 shadow-xs backdrop-blur-md">
              {ORIGIN_HUBS.map((hub) => (
                <button
                  key={hub.code}
                  type="button"
                  onClick={() => setSelectedOrigin(hub)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                    selectedOrigin.code === hub.code
                      ? 'bg-[#0B2019] text-[#D4AF37] font-bold shadow-md scale-102'
                      : 'text-neutral-700 hover:text-[#0B2019] hover:bg-[#FAF8F5]'
                  }`}
                  aria-pressed={selectedOrigin.code === hub.code}
                >
                  <Plane className={`w-3.5 h-3.5 ${selectedOrigin.code === hub.code ? 'rotate-45 text-[#D4AF37]' : 'text-neutral-400'}`} />
                  <span>{hub.city}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                    selectedOrigin.code === hub.code ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    {hub.code}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive World Cartography Folio Frame */}
        <div className="relative rounded-3xl bg-white border border-[#D4AF37]/35 p-3.5 sm:p-7 shadow-[0_12px_45px_-12px_rgba(11,32,25,0.08)] overflow-hidden">
          
          {/* Top Telemetry Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-neutral-200/80 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-neutral-500 font-mono text-[11px] uppercase tracking-wider font-medium">
                DEPARTURE: <span className="text-[#0B2019] font-bold">{selectedOrigin.airport} ({selectedOrigin.code})</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neutral-500 font-mono text-[11px] uppercase tracking-wider font-medium">
                DESTINATION: <span className="text-[#8C6B14] font-bold">{selectedSanctuary.title}</span>
              </span>
            </div>
          </div>

          {/* SVG Map Container (Royal Handcrafted Antique Cartography Palette) */}
          <div className="relative w-full aspect-[2/1] min-h-[320px] max-h-[520px] select-none rounded-2xl overflow-hidden border border-[#D4AF37]/25 shadow-inner">
            <svg
              viewBox="0 0 1000 500"
              className="w-full h-full"
              preserveAspectRatio="xMidYMid meet"
              aria-label="Interactive Global Sanctuary Vector Map"
            >
              <defs>
                {/* Antique Parchment Silk Ocean Gradient */}
                <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FBF9F4" />
                  <stop offset="50%" stopColor="#F5EFE4" />
                  <stop offset="100%" stopColor="#EDE5D6" />
                </linearGradient>

                {/* Golden Trajectory Arc Gradient */}
                <linearGradient id="flightArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8C6B14" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#D4AF37" stopOpacity="1" />
                  <stop offset="100%" stopColor="#B38F24" stopOpacity="0.9" />
                </linearGradient>

                {/* Radar Pulse Glow */}
                <radialGradient id="beaconGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Ocean Background */}
              <rect width="1000" height="500" fill="url(#oceanGrad)" rx="16" />

              {/* Equator and Meridian Latitude / Longitude Grids */}
              <g stroke="#D4AF37" strokeOpacity="0.22" strokeWidth="0.75" strokeDasharray="3 4">
                <line x1="0" y1="250" x2="1000" y2="250" /> {/* Equator */}
                <line x1="0" y1="125" x2="1000" y2="125" /> {/* 45 N */}
                <line x1="0" y1="375" x2="1000" y2="375" /> {/* 45 S */}
                <line x1="500" y1="0" x2="500" y2="500" /> {/* Prime Meridian */}
                <line x1="250" y1="0" x2="250" y2="500" />
                <line x1="750" y1="0" x2="750" y2="500" />
              </g>

              {/* Stylized Royal Emerald & Gold Landmasses */}
              <g fill="#0E2A21" stroke="#D4AF37" strokeOpacity="0.55" strokeWidth="1.2" strokeLinejoin="round">
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
                <circle cx="704" cy="238" r="3.5" fill="#0E2A21" stroke="#D4AF37" strokeOpacity="0.6" /> {/* Maldives */}

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
                {/* Soft Golden Aura Line */}
                <path
                  d={flightPathArc}
                  fill="none"
                  stroke="#D4AF37"
                  strokeOpacity="0.35"
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
                {/* Animated Flying Private Jet Marker */}
                <g>
                  <animateMotion
                    path={flightPathArc}
                    dur="4.5s"
                    repeatCount="indefinite"
                    rotate="auto"
                  />
                  <g transform="translate(0, 0)">
                    <circle r="7" fill="#D4AF37" opacity="0.4" />
                    <path
                      d="M 6 0 L -4 -4 L -2 -1 L -6 -1 L -7 -3 L -8 -3 L -7 0 L -8 3 L -7 3 L -6 1 L -2 1 L -4 4 Z"
                      fill="#D4AF37"
                      stroke="#0B2019"
                      strokeWidth="0.8"
                    />
                  </g>
                </g>
              </g>

              {/* All 6 Sanctuary Location Pins */}
              {SANCTUARIES.map((sanctuary) => {
                const isSelected = selectedSanctuary.id === sanctuary.id;
                const coords = projectCoords(sanctuary.lat, sanctuary.lon);
                // Smart label offset
                const labelY = sanctuary.id === 'switzerland' ? coords.y + 16 : coords.y - 12;

                return (
                  <g
                    key={sanctuary.id}
                    onClick={() => setSelectedSanctuary(sanctuary)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedSanctuary(sanctuary);
                      }
                    }}
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
                          stroke="#8C6B14"
                          strokeWidth="1.5"
                          opacity="0.9"
                        />
                      </>
                    )}

                    {/* Pin Outer Ring */}
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r={isSelected ? '7' : '4.5'}
                      fill={isSelected ? '#D4AF37' : '#0B2019'}
                      stroke={isSelected ? '#0B2019' : '#D4AF37'}
                      strokeWidth={isSelected ? '2' : '1.5'}
                      className="transition-all duration-300 group-hover:scale-125"
                    />

                    {/* Pin Core */}
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r={isSelected ? '2.5' : '1.5'}
                      fill={isSelected ? '#0B2019' : '#D4AF37'}
                    />

                    {/* Sanctuary Label Pill */}
                    <g transform={`translate(${coords.x}, ${labelY})`}>
                      <rect
                        x="-48"
                        y="-10"
                        width="96"
                        height="18"
                        rx="9"
                        fill={isSelected ? '#0B2019' : '#FFFFFF'}
                        stroke={isSelected ? '#D4AF37' : '#D4AF37'}
                        strokeOpacity={isSelected ? '1' : '0.6'}
                        strokeWidth={isSelected ? '1.5' : '1'}
                        filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.12))"
                        className="transition-all"
                      />
                      <text
                        x="0"
                        y="2.5"
                        textAnchor="middle"
                        fill={isSelected ? '#D4AF37' : '#0B2019'}
                        fontSize="8.5"
                        fontWeight={isSelected ? '700' : '600'}
                        letterSpacing="0.04em"
                        className="select-none font-sans"
                      >
                        {sanctuary.shortTitle}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* All 4 Origin Hub Markers */}
              {ORIGIN_HUBS.map((hub) => {
                const isSelected = selectedOrigin.code === hub.code;
                const coords = projectCoords(hub.lat, hub.lon);

                return (
                  <g
                    key={hub.code}
                    transform={`translate(${coords.x}, ${coords.y})`}
                    className="cursor-pointer group"
                    role="button"
                    tabIndex={0}
                    aria-label={`Select departure hub: ${hub.city} (${hub.code})`}
                    onClick={() => setSelectedOrigin(hub)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedOrigin(hub);
                      }
                    }}
                  >
                    {isSelected ? (
                      <>
                        <circle
                          r="16"
                          fill="none"
                          stroke="#0B2019"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                          className="animate-spin"
                          style={{ animationDuration: '8s' }}
                        />
                        <circle r="6" fill="#0B2019" stroke="#D4AF37" strokeWidth="2" />
                        <circle r="2" fill="#D4AF37" />
                        
                        {/* Origin Badge */}
                        <g transform="translate(0, 16)">
                          <rect
                            x="-34"
                            y="-8"
                            width="68"
                            height="16"
                            rx="8"
                            fill="#0B2019"
                            stroke="#D4AF37"
                            strokeWidth="1"
                            filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.15))"
                          />
                          <text
                            x="0"
                            y="3.5"
                            textAnchor="middle"
                            fill="#D4AF37"
                            fontSize="8"
                            fontWeight="bold"
                            letterSpacing="0.08em"
                            className="select-none font-mono"
                          >
                            {hub.code} ORIGIN
                          </text>
                        </g>
                      </>
                    ) : (
                      <>
                        <circle
                          r="4"
                          fill="#FFFFFF"
                          stroke="#0B2019"
                          strokeWidth="1.5"
                          className="group-hover:scale-125 transition-transform"
                        />
                        <text
                          x="0"
                          y="-7"
                          textAnchor="middle"
                          fill="#0B2019"
                          fontSize="7.5"
                          fontWeight="700"
                          letterSpacing="0.05em"
                          className="select-none font-mono opacity-80 group-hover:opacity-100"
                        >
                          {hub.code}
                        </text>
                      </>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Sanctuary Selection Pills Slider */}
          <div className="mt-4 pt-3.5 border-t border-neutral-200/80 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C6B14] whitespace-nowrap pl-1 pr-2">
              Royal Sanctuaries:
            </span>
            {SANCTUARIES.map((sanctuary) => (
              <button
                key={sanctuary.id}
                type="button"
                onClick={() => setSelectedSanctuary(sanctuary)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                  selectedSanctuary.id === sanctuary.id
                    ? 'bg-[#0B2019] text-[#D4AF37] font-bold shadow-xs'
                    : 'bg-neutral-100/80 text-neutral-700 hover:text-[#0B2019] hover:bg-neutral-200/80 border border-neutral-200'
                }`}
              >
                <MapPin className={`w-3 h-3 ${selectedSanctuary.id === sanctuary.id ? 'text-[#D4AF37]' : 'text-[#8C6B14]'}`} />
                <span>{sanctuary.shortTitle}</span>
              </button>
            ))}
          </div>

        </div>

        {/* Flight Telemetry & Sanctuary Preview Dashboard Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Flight Telemetry & Aircraft Specs (7 Columns) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#D4AF37]/30 p-6 sm:p-7 shadow-sm flex flex-col justify-between space-y-6">
            
            {/* Telemetry Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200/80">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#8C6B14]">
                  <Gauge className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C6B14] block">
                    Avionics & Telemetry
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#0B2019] font-bold">
                    {selectedOrigin.city} → {selectedSanctuary.shortTitle}
                  </h3>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-mono font-medium">Status</span>
                <span className="text-emerald-700 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1 justify-end">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Flight Plan Active
                </span>
              </div>
            </div>

            {/* Telemetry Stats 4-Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-neutral-200/80">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 block font-mono font-semibold">Flight Duration</span>
                <span className="font-serif text-2xl font-bold text-[#0B2019] block mt-0.5">{duration.text}</span>
                <span className="text-[10px] text-[#8C6B14] font-medium">Non-stop private cruise</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-neutral-200/80">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 block font-mono font-semibold">Air Distance</span>
                <span className="font-serif text-2xl font-bold text-[#0B2019] block mt-0.5">
                  {distanceNM.toLocaleString()} <span className="text-xs font-sans text-neutral-500 font-normal">NM</span>
                </span>
                <span className="text-[10px] text-neutral-500 font-light">Great-circle route</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-neutral-200/80">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 block font-mono font-semibold">Cruising Speed</span>
                <span className="font-serif text-xl font-bold text-[#0B2019] block mt-1">{aircraft.speed.split(' ')[0]}</span>
                <span className="text-[10px] text-neutral-500 font-light">{aircraft.speed.split('(')[1]?.replace(')', '') || 'High-speed'}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-neutral-200/80">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 block font-mono font-semibold">Cruise Ceiling</span>
                <span className="font-serif text-xl font-bold text-[#0B2019] block mt-1">{aircraft.ceiling.split(' ')[0]}</span>
                <span className="text-[10px] text-neutral-500 font-light">{aircraft.ceiling.split('(')[1]?.replace(')', '') || 'Above weather'}</span>
              </div>
            </div>

            {/* Aircraft Details Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FAF8F5] via-white to-[#FAF8F5] border border-[#D4AF37]/35 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0B2019] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Plane className="w-5 h-5 rotate-45 text-[#D4AF37]" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C6B14] block">
                    Recommended Jet Configuration
                  </span>
                  <h4 className="font-serif text-lg font-bold text-[#0B2019]">
                    {aircraft.model}
                  </h4>
                  <p className="text-xs text-neutral-600 font-light">
                    {aircraft.category} • Private bedroom suite &amp; certified halal culinary galley
                  </p>
                </div>
              </div>

              <div className="shrink-0 text-left sm:text-right">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0B2019] bg-white px-2.5 py-1 rounded-full border border-[#D4AF37]/30 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8C6B14]" />
                  <span>VIP Tarmac Fast-Track</span>
                </span>
              </div>
            </div>

          </div>

          {/* Right: Selected Sanctuary Preview Card (5 Columns) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-[#D4AF37]/30 p-6 sm:p-7 shadow-sm flex flex-col justify-between space-y-4">
            
            <div className="relative h-44 rounded-2xl overflow-hidden border border-neutral-200 group">
              <img
                src={selectedSanctuary.image}
                alt={selectedSanctuary.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute top-3 left-3 bg-[#0B2019]/90 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                {selectedSanctuary.country}
              </div>
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{selectedSanctuary.duration}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8C6B14] block">
                Featured Halal Sanctuary
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#0B2019] group-hover:text-[#8C6B14] transition-colors leading-tight">
                {selectedSanctuary.title}
              </h3>
              <p className="text-xs text-neutral-600 font-light line-clamp-2 leading-relaxed">
                {selectedSanctuary.highlights.join(' • ')}
              </p>
            </div>

            <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-semibold font-mono">
                  Royal Portfolio Investment
                </span>
                <span className="font-serif text-2xl font-bold text-[#0B2019]">
                  {formatBdt(selectedSanctuary.priceBdt)}
                </span>
                <span className="text-xs text-neutral-500 font-light"> / guest</span>
              </div>

              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                100% Halal Verified
              </span>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={handleInquireFlight}
                className="w-full py-3 px-5 rounded-xl bg-[#0B2019] hover:bg-[#D4AF37] text-white hover:text-[#061410] font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
              >
                <Plane className="w-4 h-4 text-[#D4AF37] group-hover:text-[#061410]" />
                <span>Inquire Jet Charter</span>
              </button>

              <Link
                href={`/destinations/${selectedSanctuary.id}`}
                className="w-full sm:w-auto py-3 px-4 rounded-xl border border-neutral-300 hover:border-[#0B2019] hover:bg-[#FAF8F5] text-[#0B2019] font-sans text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer"
              >
                <span>Itinerary</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#8C6B14]" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
