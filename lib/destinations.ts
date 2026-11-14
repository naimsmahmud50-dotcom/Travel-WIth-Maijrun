export interface JourneyFilter {
  destination: string;
  style: string;
  month: string;
}

export interface DestinationItem {
  id: string;
  destKey: string;
  category: 'pilgrimage' | 'heritage' | 'island' | 'alpine';
  tag: string;
  duration: string;
  country: string;
  region: string;
  title: string;
  desc: string;
  priceBdt: string;
  image: string;
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

export const DESTINATION_LABELS: Record<string, string> = {
  all: 'All Global Havens',
  saudi: 'Makkah & Madinah',
  spain: 'Andalusia & Granada',
  maldives: 'Maldives',
  turkey: 'Istanbul & Turkish Riviera',
  switzerland: 'Swiss Alps',
  africa: 'Serengeti & Masai Mara',
};

export const STYLE_LABELS: Record<string, string> = {
  all: 'All Travel Styles',
  spiritual: 'Sacred Spiritual Pilgrimage',
  heritage: 'Islamic Golden Age Heritage',
  honeymoon: 'Secluded Honeymoon & Couples',
  family: 'Private Family Multi-Gen Villa',
  safari: 'Halal Wildlife Safari',
};

export const MONTH_LABELS: Record<string, string> = {
  any: 'Flexible / Year-round',
  ramadan: 'Ramadan 2026 Season',
  winter: 'Winter Retreats (Nov - Feb)',
  spring: 'Spring Blossom (Mar - May)',
  summer: 'Summer Escapes (Jun - Aug)',
};

/**
 * Returns whether any filter criteria beyond defaults are currently set.
 */
export function isSearchFilterActive(filter: JourneyFilter | null | undefined): boolean {
  if (!filter) return false;
  return (
    (filter.destination !== undefined && filter.destination !== 'all') ||
    (filter.style !== undefined && filter.style !== 'all') ||
    (filter.month !== undefined && filter.month !== 'any')
  );
}

/**
 * Synchronizes the active category pill based on external search criteria.
 * Fixes prior worker's bug where Spain/Turkey with a specific style failed to sync to 'heritage'.
 */
export function determineCategoryFromFilter(filter: JourneyFilter | null | undefined): string {
  if (!filter) return 'all';

  if (filter.destination === 'saudi' || filter.style === 'spiritual') {
    return 'pilgrimage';
  }
  if (
    filter.destination === 'spain' ||
    filter.destination === 'turkey' ||
    filter.style === 'heritage'
  ) {
    return 'heritage';
  }
  if (filter.destination === 'maldives') {
    return 'island';
  }
  if (
    filter.destination === 'switzerland' ||
    filter.destination === 'africa' ||
    filter.style === 'safari'
  ) {
    return 'alpine';
  }
  return 'all';
}

/**
 * Filters the destination portfolio using category tab and search criteria.
 * Ensures category pill selection remains 100% functional and never gets deadlocked
 * by a conflicting destination selection.
 */
export function filterDestinations(
  portfolio: DestinationItem[],
  activeCategory: string,
  searchFilter: JourneyFilter | null | undefined
): DestinationItem[] {
  return portfolio.filter((d) => {
    // 1. Category pill filter
    if (activeCategory !== 'all' && d.category !== activeCategory) {
      return false;
    }

    // 2. Search destination filter
    // If destination belongs to a different category than the explicitly selected active category tab,
    // the category tab takes precedence so the user is never deadlocked.
    if (searchFilter?.destination && searchFilter.destination !== 'all') {
      const searchedItem = portfolio.find(
        (item) => item.destKey === searchFilter.destination || item.id === searchFilter.destination
      );
      if (!searchedItem || activeCategory === 'all' || searchedItem.category === activeCategory) {
        if (d.destKey !== searchFilter.destination && d.id !== searchFilter.destination) {
          return false;
        }
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
}
