import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

console.log('🧪 Starting Journey Finder & Search Filtering Test Suite...\n');

let passedTests = 0;
function test(description: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ PASS: ${description}`);
    passedTests++;
  } catch (error) {
    console.error(`  ✗ FAIL: ${description}`);
    console.error(error);
    process.exit(1);
  }
}

// 1. Static Contract & Interface Tests for JourneyFinder.tsx
test('JourneyFinder.tsx: exports JourneyFilter and JourneyFinderProps types and binds 3 controlled fields', () => {
  const code = fs.readFileSync(path.resolve('components/JourneyFinder.tsx'), 'utf-8');
  assert.ok(code.includes('export interface JourneyFilter'), 'Must export JourneyFilter interface');
  assert.ok(code.includes('destination: string'), 'JourneyFilter must have destination');
  assert.ok(code.includes('style: string'), 'JourneyFilter must have style');
  assert.ok(code.includes('month: string'), 'JourneyFilter must have month');
  assert.ok(code.includes('onSearch?: (filter: JourneyFilter) => void'), 'Must accept onSearch callback prop');
  assert.ok(code.includes('activeFilter?: JourneyFilter | null'), 'Must accept activeFilter prop');
  assert.ok(code.includes('setDestination'), 'Must bind setDestination state');
  assert.ok(code.includes('setStyle'), 'Must bind setStyle state');
  assert.ok(code.includes('setMonth'), 'Must bind setMonth state');
});

test('JourneyFinder.tsx: triggers onSearch and smooth scrolls to #destinations on form submission', () => {
  const code = fs.readFileSync(path.resolve('components/JourneyFinder.tsx'), 'utf-8');
  assert.ok(code.includes('onSearch({ destination, style, month })'), 'Must emit selected criteria to onSearch');
  assert.ok(code.includes("document.getElementById('destinations')"), 'Must locate destinations section');
  assert.ok(code.includes("scrollIntoView({ behavior: 'smooth' })"), 'Must scroll smoothly to destinations');
});

test('JourneyFinder.tsx: synchronizes with parent activeFilter changes', () => {
  const code = fs.readFileSync(path.resolve('components/JourneyFinder.tsx'), 'utf-8');
  assert.ok(code.includes('useEffect('), 'Must utilize useEffect for synchronization');
  assert.ok(code.includes('[activeFilter]'), 'Must depend on activeFilter');
});

// 2. Static Contract & UI Tests for DestinationCards.tsx
test('DestinationCards.tsx: accepts searchFilter and onResetFilter props', () => {
  const code = fs.readFileSync(path.resolve('components/DestinationCards.tsx'), 'utf-8');
  assert.ok(code.includes('searchFilter?: JourneyFilter | null'), 'Must accept searchFilter prop');
  assert.ok(code.includes('onResetFilter?: () => void'), 'Must accept onResetFilter prop');
});

test('DestinationCards.tsx: all 6 royal destinations have comprehensive filtering metadata', () => {
  const code = fs.readFileSync(path.resolve('components/DestinationCards.tsx'), 'utf-8');
  const requiredDestKeys = ['saudi', 'spain', 'maldives', 'switzerland', 'turkey', 'africa'];
  for (const key of requiredDestKeys) {
    assert.ok(code.includes(`destKey: '${key}'`), `Missing metadata destKey '${key}'`);
  }
  assert.ok(code.includes('styles:'), 'Destinations must have styles metadata array');
  assert.ok(code.includes('seasons:'), 'Destinations must have seasons metadata array');
});

test('DestinationCards.tsx: renders luxury active filter badge with reset button', () => {
  const code = fs.readFileSync(path.resolve('components/DestinationCards.tsx'), 'utf-8');
  assert.ok(code.includes('data-testid="active-filter-badge"') || code.includes('Active Bespoke Filter'), 'Must render active filter badge');
  assert.ok(code.includes('Reset / View All'), 'Must contain Reset / View All button');
  assert.ok(code.includes('Sanctuary') || code.includes('Sanctuaries'), 'Must display sanctuary count');
});

test('DestinationCards.tsx: renders bespoke empty state with exact required messaging and action', () => {
  const code = fs.readFileSync(path.resolve('components/DestinationCards.tsx'), 'utf-8');
  assert.ok(
    code.includes('No exact matches found for this specific criterion'),
    'Must include empty state title'
  );
  assert.ok(
    code.includes('browse our full royal portfolio'),
    'Must include "browse our full royal portfolio" instruction'
  );
  assert.ok(
    code.includes('View All Sanctuaries'),
    'Must contain "View All Sanctuaries" button'
  );
});

test('DestinationCards.tsx: category pills ("All", "Pilgrimage", "Heritage", "Island", "Alpine") remain active and synchronize', () => {
  const code = fs.readFileSync(path.resolve('components/DestinationCards.tsx'), 'utf-8');
  assert.ok(code.includes("'pilgrimage'"), 'Must support pilgrimage category');
  assert.ok(code.includes("'heritage'"), 'Must support heritage category');
  assert.ok(code.includes("'island'"), 'Must support island category');
  assert.ok(code.includes("'alpine'"), 'Must support alpine category');
  assert.ok(code.includes("'all'"), 'Must support all category');
  assert.ok(code.includes('setActiveCategory'), 'Must allow category switching');
});

// 3. Static Contract Tests for app/page.tsx
test('app/page.tsx: links JourneyFinder and DestinationCards via shared journeyFilter state', () => {
  const code = fs.readFileSync(path.resolve('app/page.tsx'), 'utf-8');
  assert.ok(code.includes('useState<JourneyFilter | null>(null)'), 'Must declare shared filter state');
  assert.ok(code.includes('<JourneyFinder'), 'Must render JourneyFinder');
  assert.ok(code.includes('onSearch={handleSearchJourneys}'), 'Must pass search callback to JourneyFinder');
  assert.ok(code.includes('activeFilter={journeyFilter}'), 'Must pass activeFilter to JourneyFinder');
  assert.ok(code.includes('<DestinationCards'), 'Must render DestinationCards');
  assert.ok(code.includes('searchFilter={journeyFilter}'), 'Must pass searchFilter to DestinationCards');
  assert.ok(code.includes('onResetFilter={handleResetFilter}'), 'Must pass reset callback to DestinationCards');
});

// 4. Static Contract Tests for index.html
test('index.html: implements interactive filter metadata, category pills, filter badge, and empty state', () => {
  const html = fs.readFileSync(path.resolve('index.html'), 'utf-8');
  assert.ok(html.includes('id="destCategoryPills"'), 'Must have category pills container');
  assert.ok(html.includes('id="destActiveFilterBadge"'), 'Must have active filter badge container');
  assert.ok(html.includes('id="destEmptyState"'), 'Must have bespoke empty state container');
  assert.ok(html.includes('No exact matches found for this specific criterion'), 'Empty state must have required text');
  assert.ok(html.includes('View All Sanctuaries'), 'Empty state must have "View All Sanctuaries" button');
  assert.ok(html.includes('data-destination="saudi"'), 'Slide 1 must have data-destination="saudi"');
  assert.ok(html.includes('data-destination="spain"'), 'Slide 2 must have data-destination="spain"');
  assert.ok(html.includes('data-destination="maldives"'), 'Slide 3 must have data-destination="maldives"');
  assert.ok(html.includes('data-destination="switzerland"'), 'Slide 4 must have data-destination="switzerland"');
  assert.ok(html.includes('data-destination="turkey"'), 'Slide 5 must have data-destination="turkey"');
  assert.ok(html.includes('data-destination="africa"'), 'Slide 6 must have data-destination="africa"');
  assert.ok(html.includes('function applyDestinationsFilter('), 'Must define applyDestinationsFilter');
  assert.ok(html.includes('function setDestinationCategory('), 'Must define setDestinationCategory');
  assert.ok(html.includes('function resetDestinationsFilter('), 'Must define resetDestinationsFilter');
  assert.ok(html.includes('function handleJourneySearch('), 'Must define handleJourneySearch');
});

// 5. Functional Filtering Logic & Edge Cases Verification
interface MockDestination {
  id: string;
  destKey: string;
  category: string;
  styles: string[];
  seasons: string[];
}

const mockDestinations: MockDestination[] = [
  { id: 'makkah', destKey: 'saudi', category: 'pilgrimage', styles: ['spiritual', 'family'], seasons: ['any', 'ramadan', 'winter', 'spring', 'summer'] },
  { id: 'spain', destKey: 'spain', category: 'heritage', styles: ['heritage', 'honeymoon', 'family'], seasons: ['any', 'spring', 'summer', 'winter'] },
  { id: 'maldives', destKey: 'maldives', category: 'island', styles: ['honeymoon', 'family'], seasons: ['any', 'winter', 'spring'] },
  { id: 'switzerland', destKey: 'switzerland', category: 'alpine', styles: ['honeymoon', 'family', 'alpine'], seasons: ['any', 'winter', 'summer', 'spring'] },
  { id: 'turkey', destKey: 'turkey', category: 'heritage', styles: ['heritage', 'honeymoon', 'family'], seasons: ['any', 'ramadan', 'spring', 'summer'] },
  { id: 'safari', destKey: 'africa', category: 'alpine', styles: ['safari', 'family'], seasons: ['any', 'summer', 'winter', 'spring'] },
];

function filterPortfolio(
  portfolio: MockDestination[],
  activeCategory: string,
  searchFilter: { destination: string; style: string; month: string } | null
) {
  return portfolio.filter((d) => {
    if (activeCategory !== 'all' && d.category !== activeCategory) {
      return false;
    }
    if (searchFilter?.destination && searchFilter.destination !== 'all') {
      if (d.destKey !== searchFilter.destination && d.id !== searchFilter.destination) {
        return false;
      }
    }
    if (searchFilter?.style && searchFilter.style !== 'all') {
      if (!d.styles.includes(searchFilter.style) && d.category !== searchFilter.style) {
        return false;
      }
    }
    if (searchFilter?.month && searchFilter.month !== 'any') {
      if (!d.seasons.includes(searchFilter.month)) {
        return false;
      }
    }
    return true;
  });
}

test('Filtering logic: "all" / null returns all 6 destinations', () => {
  const res = filterPortfolio(mockDestinations, 'all', null);
  assert.strictEqual(res.length, 6);
});

test('Filtering logic: destination "saudi" returns only Makkah & Madinah', () => {
  const res = filterPortfolio(mockDestinations, 'all', { destination: 'saudi', style: 'all', month: 'any' });
  assert.strictEqual(res.length, 1);
  assert.strictEqual(res[0].id, 'makkah');
});

test('Filtering logic: destination "africa" returns only Serengeti Safari', () => {
  const res = filterPortfolio(mockDestinations, 'all', { destination: 'africa', style: 'all', month: 'any' });
  assert.strictEqual(res.length, 1);
  assert.strictEqual(res[0].id, 'safari');
});

test('Filtering logic: style "spiritual" returns only Makkah', () => {
  const res = filterPortfolio(mockDestinations, 'all', { destination: 'all', style: 'spiritual', month: 'any' });
  assert.strictEqual(res.length, 1);
  assert.strictEqual(res[0].id, 'makkah');
});

test('Filtering logic: style "heritage" returns Spain and Turkey', () => {
  const res = filterPortfolio(mockDestinations, 'all', { destination: 'all', style: 'heritage', month: 'any' });
  assert.strictEqual(res.length, 2);
  const ids = res.map((r) => r.id).sort();
  assert.deepStrictEqual(ids, ['spain', 'turkey']);
});

test('Filtering logic: month "ramadan" returns Makkah and Turkey', () => {
  const res = filterPortfolio(mockDestinations, 'all', { destination: 'all', style: 'all', month: 'ramadan' });
  assert.strictEqual(res.length, 2);
  const ids = res.map((r) => r.id).sort();
  assert.deepStrictEqual(ids, ['makkah', 'turkey']);
});

test('Filtering logic: impossible combination returns 0 matches (triggers empty state)', () => {
  // Saudi Arabia + Halal Wildlife Safari
  const res1 = filterPortfolio(mockDestinations, 'all', { destination: 'saudi', style: 'safari', month: 'any' });
  assert.strictEqual(res1.length, 0);

  // Maldives + Sacred Spiritual Pilgrimage
  const res2 = filterPortfolio(mockDestinations, 'all', { destination: 'maldives', style: 'spiritual', month: 'any' });
  assert.strictEqual(res2.length, 0);

  // Switzerland + Ramadan season
  const res3 = filterPortfolio(mockDestinations, 'all', { destination: 'switzerland', style: 'all', month: 'ramadan' });
  assert.strictEqual(res3.length, 0);
});

test('Filtering logic: category pills filter correctly within and without search', () => {
  // Category pill only
  const pilgrims = filterPortfolio(mockDestinations, 'pilgrimage', null);
  assert.strictEqual(pilgrims.length, 1);
  assert.strictEqual(pilgrims[0].id, 'makkah');

  const islands = filterPortfolio(mockDestinations, 'island', null);
  assert.strictEqual(islands.length, 1);
  assert.strictEqual(islands[0].id, 'maldives');

  const alpines = filterPortfolio(mockDestinations, 'alpine', null);
  assert.strictEqual(alpines.length, 2);

  // Search for winter + category pill alpine
  const winterAlpine = filterPortfolio(mockDestinations, 'alpine', { destination: 'all', style: 'all', month: 'winter' });
  assert.strictEqual(winterAlpine.length, 2);
});

console.log(`\n🎉 All ${passedTests} Journey Finder & Search Filtering tests passed successfully!\n`);
