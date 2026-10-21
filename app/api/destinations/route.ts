import { NextResponse } from 'next/server';

const DESTINATIONS_DB = [
  {
    id: 'makkah',
    category: 'pilgrimage',
    tag: 'Royal Presidential',
    duration: '10 Days • 9 Nights',
    country: 'Saudi Arabia',
    region: 'Bespoke Umrah',
    title: 'The Sacred Sanctuaries: Makkah & Madinah',
    desc: 'Direct Kaaba-view suites at Raffles or Dar Al Tawhid, Haram VIP access assistance, private luxury bullet train transfers, and scholars on retinue.',
    priceBdt: 695000,
    priceUsd: 5800,
    halalFeatures: ['Kaaba-view private suites', 'Haram VIP escort', 'Dedicated Islamic scholar', 'Private Haram transfers'],
    availableSlots: 4,
    image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=85&w=900&auto=format&fit=crop',
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
    priceBdt: 768000,
    priceUsd: 6400,
    halalFeatures: ['Private Michelin-star halal chef', 'After-hours Alhambra access', 'Historical prayer spaces reserved'],
    availableSlots: 6,
    image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?q=85&w=900&auto=format&fit=crop',
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
    priceBdt: 864000,
    priceUsd: 7200,
    halalFeatures: ['Zero-sightline enclosed pool', 'Alcohol-free villa', 'Private beach dining'],
    availableSlots: 3,
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=85&w=900&auto=format&fit=crop',
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
    priceBdt: 1020000,
    priceUsd: 8500,
    halalFeatures: ['Exclusive chalet buyout', 'Halal certified gourmet catering', 'Private wellness spa'],
    availableSlots: 2,
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=85&w=900&auto=format&fit=crop',
  },
  {
    id: 'turkey',
    category: 'heritage',
    tag: 'Palatial Journey',
    duration: '10 Days • 9 Nights',
    country: 'Turkey',
    region: 'Bespoke Bosphorus & Bodrum',
    title: 'Sultans of the Bosphorus: Palaces & Yachts',
    desc: 'Ciragan Palace Kempinski waterfront suites, chartered mega-yacht sunset cruise, Hagia Sophia after-hours tour, and secluded Bodrum coastal villa.',
    priceBdt: 624000,
    priceUsd: 5200,
    halalFeatures: ['Ciragan Palace private suite', 'Private yacht charter', 'Historic mosques VIP tour'],
    availableSlots: 5,
    image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=85&w=900&auto=format&fit=crop',
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
    priceBdt: 1176000,
    priceUsd: 9800,
    halalFeatures: ['Certified halal wilderness catering', 'Private 4x4 land cruiser', 'Dedicated family camp'],
    availableSlots: 4,
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=85&w=900&auto=format&fit=crop',
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  let results = DESTINATIONS_DB;
  if (category && category !== 'all') {
    results = results.filter((d) => d.category === category);
  }

  return NextResponse.json({
    success: true,
    count: results.length,
    data: results,
  });
}
