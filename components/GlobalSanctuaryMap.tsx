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
  const [hoveredLocationId, setHoveredLocationId] = useState<string | null>(null);

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

              {/* High-Fidelity Organic Royal Emerald & Gold Landmasses */}
              <g fill="#0E2A21" stroke="#D4AF37" strokeOpacity="0.55" strokeWidth="1" strokeLinejoin="round">
                {/* British Isles */}
                <path d="M 488 102 C 484 96 490 92 496 95 C 501 98 504 106 500 114 C 496 122 491 125 487 118 C 485 113 491 106 488 102 Z" />
                <path d="M 478 108 C 475 105 480 102 483 105 C 486 109 484 116 480 115 C 476 114 476 110 478 108 Z" />

                {/* Scandinavia */}
                <path d="M 515 85 C 518 72 528 62 538 65 C 548 68 558 75 562 88 C 560 98 550 102 542 98 C 536 95 532 88 526 90 C 520 92 516 95 515 85 Z" />

                {/* Western & Central Europe */}
                <path d="M 475 138 C 482 135 495 132 505 130 C 515 125 518 118 525 118 C 535 118 545 125 555 128 C 565 132 575 138 578 148 C 572 155 560 156 550 150 C 542 146 535 148 528 142 C 518 138 505 142 492 140 C 482 140 478 139 475 138 Z" />

                {/* Iberian Peninsula (Spain) */}
                <path d="M 462 144 C 458 152 462 165 470 170 C 482 173 496 168 495 152 C 495 145 486 142 476 142 C 468 142 464 143 462 144 Z" />

                {/* Italy & Sicily */}
                <path d="M 518 132 C 524 135 528 142 532 148 C 535 154 532 160 527 162 C 523 162 522 154 520 148 C 518 142 515 136 518 132 Z" />
                <path d="M 522 165 C 526 164 528 168 524 170 C 520 171 519 167 522 165 Z" />

                {/* Anatolia / Turkey */}
                <path d="M 570 134 C 585 130 610 130 625 135 C 630 142 622 150 610 152 C 595 152 580 150 572 142 C 568 138 568 135 570 134 Z" />

                {/* Arabian Peninsula */}
                <path d="M 602 168 C 615 162 630 162 642 168 C 655 174 658 185 660 198 C 662 212 654 225 640 228 C 625 230 612 224 606 210 C 600 196 598 180 602 168 Z" />

                {/* Africa */}
                <path d="M 465 176 C 500 174 540 178 575 186 C 595 192 612 210 622 232 C 628 248 618 268 604 290 C 592 312 580 340 562 364 C 550 376 532 376 520 362 C 506 342 496 308 488 274 C 478 245 458 238 450 218 C 445 204 450 188 465 176 Z" />
                <path d="M 612 308 C 618 312 622 324 618 342 C 614 352 608 350 605 338 C 602 326 606 312 612 308 Z" />

                {/* Indian Subcontinent & Sri Lanka */}
                <path d="M 672 172 C 692 168 720 168 742 174 C 758 180 762 195 754 212 C 744 230 732 254 722 272 C 716 274 710 262 702 244 C 692 224 676 206 672 188 C 670 178 670 174 672 172 Z" />
                <path d="M 728 266 C 732 264 736 268 734 274 C 731 278 727 276 728 266 Z" />
                {/* Maldives Atolls */}
                <circle cx="704" cy="238" r="3" fill="#0E2A21" stroke="#D4AF37" strokeWidth="0.8" />
                <circle cx="705" cy="244" r="2.2" fill="#0E2A21" stroke="#D4AF37" strokeWidth="0.8" />
                <circle cx="706" cy="250" r="1.8" fill="#0E2A21" stroke="#D4AF37" strokeWidth="0.8" />

                {/* Northern Eurasia & China */}
                <path d="M 565 110 C 610 92 680 82 760 80 C 820 80 865 92 875 112 C 880 128 855 145 832 155 C 805 164 775 168 748 168 C 715 166 680 158 640 152 C 600 148 575 130 565 110 Z" />

                {/* East Asia & Japan */}
                <path d="M 780 150 C 810 148 838 162 842 182 C 840 200 818 208 792 205 C 768 200 762 182 768 168 C 772 158 775 152 780 150 Z" />
                <path d="M 854 118 C 862 114 868 122 865 134 C 860 145 852 156 845 154 C 842 150 848 138 852 128 C 854 122 850 120 854 118 Z" />
                <path d="M 866 104 C 872 102 876 108 872 114 C 868 116 864 110 866 104 Z" />

                {/* Southeast Asia Archipelago */}
                <path d="M 764 195 C 778 194 792 202 788 218 C 785 228 778 242 774 252 C 770 252 768 238 765 224 C 762 210 758 198 764 195 Z" />
                <path d="M 765 258 C 778 260 790 272 785 278 C 775 282 760 270 765 258 Z" />
                <path d="M 792 245 C 808 242 818 255 812 268 C 802 272 795 260 792 245 Z" />
                <path d="M 788 280 C 810 280 822 284 815 290 C 802 292 785 286 788 280 Z" />
                <path d="M 825 215 C 832 212 836 224 832 238 C 828 244 822 235 825 215 Z" />

                {/* North America & Greenland */}
                <path d="M 110 82 C 145 70 195 68 245 74 C 278 80 294 105 286 130 C 278 152 258 178 235 198 C 215 214 195 220 180 205 C 165 188 150 162 135 140 C 118 118 100 95 110 82 Z" />
                <path d="M 335 45 C 362 38 395 40 388 65 C 380 82 355 88 335 78 C 322 70 325 52 335 45 Z" />

                {/* South America */}
                <path d="M 230 224 C 265 218 305 230 325 255 C 338 275 330 310 312 345 C 295 380 275 412 258 418 C 248 418 242 395 240 360 C 236 320 220 275 215 245 C 212 232 220 225 230 224 Z" />

                {/* Australia & New Zealand */}
                <path d="M 812 322 C 845 308 885 312 905 335 C 918 355 912 385 892 402 C 868 414 835 410 815 395 C 795 378 792 348 802 330 C 806 324 810 323 812 322 Z" />
                <path d="M 938 395 C 944 390 948 398 944 410 C 940 418 935 412 938 395 Z" />
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
                {/* Animated Flying Private Jet Marker with Golden Jet-Stream */}
                <g>
                  <animateMotion
                    path={flightPathArc}
                    dur="4.5s"
                    repeatCount="indefinite"
                    rotate="auto"
                  />
                  {/* Trailing Twin Golden Jet-Stream Contrails */}
                  <g stroke="#D4AF37" strokeLinecap="round">
                    <line x1="-6" y1="-2.5" x2="-26" y2="-3" strokeWidth="1.2" strokeOpacity="0.85" strokeDasharray="3 2" />
                    <line x1="-6" y1="2.5" x2="-26" y2="3" strokeWidth="1.2" strokeOpacity="0.85" strokeDasharray="3 2" />
                    <line x1="-26" y1="-3" x2="-52" y2="-3.5" strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="4 4" />
                    <line x1="-26" y1="3" x2="-52" y2="3.5" strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="4 4" />
                  </g>

                  {/* Jet Engine Afterburner Thrust Halo */}
                  <circle cx="-6" cy="0" r="4" fill="#FFE58F" opacity="0.85" filter="drop-shadow(0 0 6px #D4AF37)" />
                  <circle cx="0" cy="0" r="9" fill="#D4AF37" opacity="0.25" />

                  {/* Sleek Golden Private Jet Fuselage */}
                  <path
                    d="M 9 0 L -4 -5.5 L -2 -1.5 L -7 -1.5 L -9 -4 L -10.5 -4 L -9.5 0 L -10.5 4 L -9 4 L -7 1.5 L -2 1.5 L -4 5.5 Z"
                    fill="#D4AF37"
                    stroke="#0B2019"
                    strokeWidth="0.9"
                    filter="drop-shadow(0 2px 4px rgba(11,32,25,0.4))"
                  />
                  {/* VIP Cockpit Window */}
                  <ellipse cx="3.5" cy="0" rx="1.5" ry="0.8" fill="#0B2019" />
                </g>
              </g>

              {/* All 6 Sanctuary Location Pins (Smart De-cluttered Architecture) */}
              {SANCTUARIES.map((sanctuary) => {
                const isSelected = selectedSanctuary.id === sanctuary.id;
                const isHovered = hoveredLocationId === sanctuary.id;
                const coords = projectCoords(sanctuary.lat, sanctuary.lon);

                // Smart label offset preventing collision with flight path or nearby pins
                const labelOffsetY =
                  sanctuary.id === 'spain'
                    ? 18
                    : sanctuary.id === 'safari' || sanctuary.id === 'maldives'
                    ? 18
                    : -16;

                return (
                  <g
                    key={sanctuary.id}
                    onClick={() => setSelectedSanctuary(sanctuary)}
                    onMouseEnter={() => setHoveredLocationId(sanctuary.id)}
                    onMouseLeave={() => setHoveredLocationId((prev) => (prev === sanctuary.id ? null : prev))}
                    onFocus={() => setHoveredLocationId(sanctuary.id)}
                    onBlur={() => setHoveredLocationId((prev) => (prev === sanctuary.id ? null : prev))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedSanctuary(sanctuary);
                      }
                    }}
                    className="cursor-pointer group outline-none"
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
                          r="20"
                          fill="url(#beaconGlow)"
                          className="animate-ping"
                          style={{ animationDuration: '2.5s' }}
                        />
                        <circle
                          cx={coords.x}
                          cy={coords.y}
                          r="13"
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
                      r={isSelected ? '8' : isHovered ? '6.5' : '4.5'}
                      fill={isSelected ? '#D4AF37' : isHovered ? '#0E2A21' : '#0B2019'}
                      stroke={isSelected ? '#0B2019' : '#D4AF37'}
                      strokeWidth={isSelected ? '2' : '1.5'}
                      className="transition-all duration-300"
                    />

                    {/* Pin Core */}
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r={isSelected ? '3' : '1.8'}
                      fill={isSelected ? '#0B2019' : '#D4AF37'}
                    />

                    {/* Active Destination Banner (Rendered ONLY when selected) */}
                    {isSelected && (
                      <g
                        transform={`translate(${coords.x}, ${coords.y + labelOffsetY})`}
                        className="transition-all duration-300 filter drop-shadow(0 4px 10px rgba(14,42,33,0.28))"
                      >
                        <rect
                          x="-62"
                          y="-11"
                          width="124"
                          height="22"
                          rx="11"
                          fill="#0E2A21"
                          stroke="#D4AF37"
                          strokeWidth="1.4"
                        />
                        <text
                          x="0"
                          y="3.5"
                          textAnchor="middle"
                          fill="#D4AF37"
                          fontSize="8.5"
                          fontWeight="700"
                          letterSpacing="0.04em"
                          className="select-none font-sans"
                        >
                          ✦ {sanctuary.shortTitle}
                        </text>
                      </g>
                    )}

                    {/* Hover Tooltip (Rendered when hovered but not selected) */}
                    {!isSelected && isHovered && (
                      <g
                        transform={`translate(${coords.x}, ${coords.y + labelOffsetY})`}
                        className="transition-all duration-200 filter drop-shadow(0 3px 8px rgba(0,0,0,0.18)) pointer-events-none"
                      >
                        <rect
                          x="-50"
                          y="-10"
                          width="100"
                          height="20"
                          rx="10"
                          fill="#FFFFFF"
                          stroke="#D4AF37"
                          strokeWidth="1.2"
                        />
                        <text
                          x="0"
                          y="3"
                          textAnchor="middle"
                          fill="#0E2A21"
                          fontSize="8"
                          fontWeight="600"
                          letterSpacing="0.02em"
                          className="select-none font-sans"
                        >
                          {sanctuary.shortTitle}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* All 4 Origin Hub Markers */}
              {ORIGIN_HUBS.map((hub) => {
                const isSelected = selectedOrigin.code === hub.code;
                const isHovered = hoveredLocationId === hub.code;
                const coords = projectCoords(hub.lat, hub.lon);

                // Smart offset: LHR, RUH, DAC place badge slightly above or below to avoid flight arc
                const hubOffsetY = hub.code === 'DXB' ? 16 : -16;

                return (
                  <g
                    key={hub.code}
                    transform={`translate(${coords.x}, ${coords.y})`}
                    className="cursor-pointer group outline-none"
                    role="button"
                    tabIndex={0}
                    aria-label={`Select departure hub: ${hub.city} (${hub.code})`}
                    onClick={() => setSelectedOrigin(hub)}
                    onMouseEnter={() => setHoveredLocationId(hub.code)}
                    onMouseLeave={() => setHoveredLocationId((prev) => (prev === hub.code ? null : prev))}
                    onFocus={() => setHoveredLocationId(hub.code)}
                    onBlur={() => setHoveredLocationId((prev) => (prev === hub.code ? null : prev))}
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
                          r="17"
                          fill="none"
                          stroke="#0B2019"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                          className="animate-spin"
                          style={{ animationDuration: '8s' }}
                        />
                        <circle r="6.5" fill="#0B2019" stroke="#D4AF37" strokeWidth="2" />
                        <circle r="2.5" fill="#D4AF37" />

                        {/* Selected Origin Badge */}
                        <g
                          transform={`translate(0, ${hubOffsetY})`}
                          className="filter drop-shadow(0 3px 8px rgba(11,32,25,0.22))"
                        >
                          <rect
                            x="-36"
                            y="-9"
                            width="72"
                            height="18"
                            rx="9"
                            fill="#0B2019"
                            stroke="#D4AF37"
                            strokeWidth="1.2"
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
                          r={isHovered ? '5' : '3.8'}
                          fill="#FFFFFF"
                          stroke="#0B2019"
                          strokeWidth="1.4"
                          className="transition-all duration-200"
                        />
                        <circle r="1.5" fill="#0B2019" />

                        {/* Hover Tooltip for unselected origin */}
                        {isHovered && (
                          <g
                            transform={`translate(0, ${hubOffsetY})`}
                            className="filter drop-shadow(0 2px 6px rgba(0,0,0,0.15)) pointer-events-none"
                          >
                            <rect
                              x="-30"
                              y="-8"
                              width="60"
                              height="16"
                              rx="8"
                              fill="#0E2A21"
                              stroke="#D4AF37"
                              strokeWidth="1"
                            />
                            <text
                              x="0"
                              y="3"
                              textAnchor="middle"
                              fill="#D4AF37"
                              fontSize="7.5"
                              fontWeight="bold"
                              letterSpacing="0.06em"
                              className="select-none font-mono"
                            >
                              {hub.code} • {hub.city}
                            </text>
                          </g>
                        )}
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
