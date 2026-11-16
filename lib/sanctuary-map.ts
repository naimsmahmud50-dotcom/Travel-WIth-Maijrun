export interface SanctuaryLocation {
  id: string;
  country: string;
  title: string;
  shortTitle: string;
  region: string;
  duration: string;
  priceBdt: number;
  image: string;
  lat: number;
  lon: number;
  highlights: string[];
}

export interface OriginHub {
  code: string;
  city: string;
  country: string;
  airport: string;
  terminal: string;
  lat: number;
  lon: number;
}

export const ORIGIN_HUBS: OriginHub[] = [
  {
    code: 'DAC',
    city: 'Dhaka',
    country: 'Bangladesh',
    airport: 'Hazrat Shahjalal International Airport',
    terminal: 'VVIP Presidential Tarmac',
    lat: 23.8103,
    lon: 90.4125,
  },
  {
    code: 'DXB',
    city: 'Dubai',
    country: 'United Arab Emirates',
    airport: 'Dubai International Airport',
    terminal: 'Al Majlis Royal Pavilion',
    lat: 25.2048,
    lon: 55.2708,
  },
  {
    code: 'LHR',
    city: 'London',
    country: 'United Kingdom',
    airport: 'London Heathrow Airport',
    terminal: 'The Windsor VIP Suite',
    lat: 51.5074,
    lon: -0.1278,
  },
  {
    code: 'RUH',
    city: 'Riyadh',
    country: 'Saudi Arabia',
    airport: 'King Khalid International Airport',
    terminal: 'Royal Terminal & FBO Lounge',
    lat: 24.7136,
    lon: 46.6753,
  },
];

export const SANCTUARIES: SanctuaryLocation[] = [
  {
    id: 'makkah',
    country: 'Saudi Arabia',
    title: 'The Sacred Sanctuaries: Makkah & Madinah',
    shortTitle: 'Makkah & Madinah',
    region: 'The Sacred Sanctuaries',
    duration: '10 Days • 9 Nights',
    priceBdt: 695000,
    image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=75&w=640&auto=format&fit=crop',
    lat: 21.4225,
    lon: 39.8262,
    highlights: ['Direct Kaaba-view suites', 'Private bullet train', 'Scholars on retinue'],
  },
  {
    id: 'spain',
    country: 'Spain',
    title: 'Echoes of Al-Andalus: Moorish Splendors',
    shortTitle: 'Granada & Cordoba',
    region: 'Granada & Cordoba',
    duration: '12 Days • 11 Nights',
    priceBdt: 768000,
    image: 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?q=75&w=640&auto=format&fit=crop',
    lat: 37.1773,
    lon: -3.5986,
    highlights: ['Private Alhambra after-hours', 'Halal gastronomy', 'Historical riads'],
  },
  {
    id: 'maldives',
    country: 'Maldives',
    title: 'The Pearl Pavilions: Overwater Sanctuary',
    shortTitle: 'North Malé Atoll',
    region: 'North Malé Atoll',
    duration: '7 Days • 6 Nights',
    priceBdt: 864000,
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=75&w=640&auto=format&fit=crop',
    lat: 4.1755,
    lon: 73.5093,
    highlights: ['Zero-sightline lagoon pool', 'Private seaplane', 'Starlight dining'],
  },
  {
    id: 'switzerland',
    country: 'Switzerland',
    title: 'Matterhorn Majesty: Swiss Alpine Chalets',
    shortTitle: 'Zermatt & Lake Geneva',
    region: 'Zermatt & Lake Geneva',
    duration: '9 Days • 8 Nights',
    priceBdt: 1020000,
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=75&w=640&auto=format&fit=crop',
    lat: 45.9765,
    lon: 7.7491,
    highlights: ['Private chalet with chef', 'Glacier Express VIP', 'Helicopter scenic flights'],
  },
  {
    id: 'turkey',
    country: 'Turkey',
    title: 'Sultans of the Bosphorus: Palaces & Yachts',
    shortTitle: 'Istanbul & Cappadocia',
    region: 'Istanbul & Cappadocia',
    duration: '10 Days • 9 Nights',
    priceBdt: 624000,
    image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=75&w=640&auto=format&fit=crop',
    lat: 41.0082,
    lon: 28.9784,
    highlights: ['Ciragan Palace suites', 'Private mega-yacht charter', 'Hagia Sophia VIP'],
  },
  {
    id: 'safari',
    country: 'Tanzania',
    title: 'The Great Migration: Luxury Tented Haven',
    shortTitle: 'Serengeti & Ngorongoro',
    region: 'Serengeti & Ngorongoro',
    duration: '8 Days • 7 Nights',
    priceBdt: 1176000,
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=75&w=640&auto=format&fit=crop',
    lat: -2.3333,
    lon: 34.8333,
    highlights: ['Singita tented haven', 'Hot-air balloon dawn flights', 'Halal bush banquets'],
  },
];

/**
 * Projects (lat, lon) coordinates onto SVG canvas (1000 x 500)
 */
export function projectCoords(lat: number, lon: number): { x: number; y: number } {
  const x = ((lon + 180) / 360) * 1000;
  const y = ((90 - lat) / 180) * 500;
  return {
    x: Math.round(x * 10) / 10,
    y: Math.round(y * 10) / 10,
  };
}

/**
 * Great-Circle distance in Nautical Miles using Haversine formula
 */
export function calculateDistanceNM(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R_NM = 3440.065;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R_NM * c);
}

/**
 * Private Jet flight duration based on Mach 0.85 cruising speed (~485 knots)
 */
export function calculateFlightDuration(distanceNM: number): { hours: number; minutes: number; text: string } {
  const safeDistance = Math.max(0, isNaN(distanceNM) ? 0 : distanceNM);
  const totalMinutes = Math.round((safeDistance / 485 + 0.45) * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return {
    hours,
    minutes,
    text: `${hours}h ${minutes.toString().padStart(2, '0')}m`,
  };
}

/**
 * Luxury aircraft recommendation according to distance range
 */
export function getRecommendedAircraft(distanceNM: number): {
  model: string;
  category: string;
  speed: string;
  ceiling: string;
} {
  if (distanceNM < 2500) {
    return {
      model: 'Bombardier Challenger 650',
      category: 'Super Mid-Size VIP',
      speed: 'Mach 0.82 (540 mph)',
      ceiling: 'FL410 (41,000 ft)',
    };
  }
  if (distanceNM <= 4500) {
    return {
      model: 'Gulfstream G650ER',
      category: 'Ultra-Long Range Royal',
      speed: 'Mach 0.85 (560 mph)',
      ceiling: 'FL510 (51,000 ft)',
    };
  }
  return {
    model: 'Bombardier Global 7500',
    category: 'Four-Zone Flagship Jet',
    speed: 'Mach 0.88 (580 mph)',
    ceiling: 'FL510 (51,000 ft)',
  };
}
