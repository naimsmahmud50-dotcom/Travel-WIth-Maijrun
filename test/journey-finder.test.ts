import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import {
  DESTINATIONS,
  filterDestinations,
  determineCategoryFromFilter,
  isSearchFilterActive,
  DESTINATION_LABELS,
  STYLE_LABELS,
  MONTH_LABELS,
} from '../lib/destinations.ts';

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
  assert.ok(code.includes('JourneyFilter'), 'Must export/use JourneyFilter interface');
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
  assert.ok(code.includes("scrollIntoView"), 'Must scroll smoothly to destinations');
});

test('JourneyFinder.tsx: synchronizes with parent activeFilter changes', () => {
  const code = fs.readFileSync(path.resolve('components/JourneyFinder.tsx'), 'utf-8');
  assert.ok(code.includes('useEffect('), 'Must utilize useEffect for synchronization');
  assert.ok(code.includes('[activeFilter]'), 'Must depend on activeFilter');
});

// 2. Static Contract & UI Tests for DestinationCards.tsx
test('DestinationCards.tsx: accepts searchFilter, onResetFilter, and onFilterChange props', () => {
  const code = fs.readFileSync(path.resolve('components/DestinationCards.tsx'), 'utf-8');
  assert.ok(code.includes('searchFilter?: JourneyFilter | null'), 'Must accept searchFilter prop');
  assert.ok(code.includes('onResetFilter?: () => void'), 'Must accept onResetFilter prop');
  assert.ok(code.includes('onFilterChange?:'), 'Must accept onFilterChange prop');
});

test('DestinationCards.tsx: re-exports DESTINATIONS portfolio and metadata', () => {
  const code = fs.readFileSync(path.resolve('components/DestinationCards.tsx'), 'utf-8');
  assert.ok(code.includes('export { DESTINATIONS }'), 'Must re-export DESTINATIONS');
  assert.strictEqual(DESTINATIONS.length, 6, 'Portfolio must contain 6 luxury havens');
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
  assert.ok(code.includes('handleCategorySelect'), 'Must invoke handleCategorySelect on tab clicks');
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

// 5. Functional Real-Data Filtering Tests using lib/destinations.ts
test('Filtering logic: null / undefined filter returns all 6 destinations', () => {
  const resNull = filterDestinations(DESTINATIONS, 'all', null);
  assert.strictEqual(resNull.length, 6);
  const resUndef = filterDestinations(DESTINATIONS, 'all', undefined);
  assert.strictEqual(resUndef.length, 6);
});

test('Filtering logic: "all" / "any" defaults return all 6 destinations', () => {
  const res = filterDestinations(DESTINATIONS, 'all', { destination: 'all', style: 'all', month: 'any' });
  assert.strictEqual(res.length, 6);
});

test('Filtering logic: destination "saudi" returns only Makkah & Madinah', () => {
  const res = filterDestinations(DESTINATIONS, 'all', { destination: 'saudi', style: 'all', month: 'any' });
  assert.strictEqual(res.length, 1);
  assert.strictEqual(res[0].id, 'makkah');
});

test('Filtering logic: destination "spain" returns only Moorish Splendors', () => {
  const res = filterDestinations(DESTINATIONS, 'all', { destination: 'spain', style: 'all', month: 'any' });
  assert.strictEqual(res.length, 1);
  assert.strictEqual(res[0].id, 'spain');
});

test('Filtering logic: destination "maldives" returns only Overwater Sanctuary', () => {
  const res = filterDestinations(DESTINATIONS, 'all', { destination: 'maldives', style: 'all', month: 'any' });
  assert.strictEqual(res.length, 1);
  assert.strictEqual(res[0].id, 'maldives');
});

test('Filtering logic: destination "turkey" returns only Sultans of the Bosphorus', () => {
  const res = filterDestinations(DESTINATIONS, 'all', { destination: 'turkey', style: 'all', month: 'any' });
  assert.strictEqual(res.length, 1);
  assert.strictEqual(res[0].id, 'turkey');
});

test('Filtering logic: destination "switzerland" returns only Matterhorn Majesty', () => {
  const res = filterDestinations(DESTINATIONS, 'all', { destination: 'switzerland', style: 'all', month: 'any' });
  assert.strictEqual(res.length, 1);
  assert.strictEqual(res[0].id, 'switzerland');
});

test('Filtering logic: destination "africa" returns only Serengeti Safari', () => {
  const res = filterDestinations(DESTINATIONS, 'all', { destination: 'africa', style: 'all', month: 'any' });
  assert.strictEqual(res.length, 1);
  assert.strictEqual(res[0].id, 'safari');
});

test('Filtering logic: style "spiritual" returns only Makkah', () => {
  const res = filterDestinations(DESTINATIONS, 'all', { destination: 'all', style: 'spiritual', month: 'any' });
  assert.strictEqual(res.length, 1);
  assert.strictEqual(res[0].id, 'makkah');
});

test('Filtering logic: style "heritage" returns Spain and Turkey', () => {
  const res = filterDestinations(DESTINATIONS, 'all', { destination: 'all', style: 'heritage', month: 'any' });
  assert.strictEqual(res.length, 2);
  const ids = res.map((r) => r.id).sort();
  assert.deepStrictEqual(ids, ['spain', 'turkey']);
});

test('Filtering logic: style "honeymoon" returns 4 secluded retreats', () => {
  const res = filterDestinations(DESTINATIONS, 'all', { destination: 'all', style: 'honeymoon', month: 'any' });
  assert.strictEqual(res.length, 4);
  const ids = res.map((r) => r.id).sort();
  assert.deepStrictEqual(ids, ['maldives', 'spain', 'switzerland', 'turkey']);
});

test('Filtering logic: style "safari" returns Serengeti Safari', () => {
  const res = filterDestinations(DESTINATIONS, 'all', { destination: 'all', style: 'safari', month: 'any' });
  assert.strictEqual(res.length, 1);
  assert.strictEqual(res[0].id, 'safari');
});

test('Filtering logic: month "ramadan" returns Makkah and Turkey', () => {
  const res = filterDestinations(DESTINATIONS, 'all', { destination: 'all', style: 'all', month: 'ramadan' });
  assert.strictEqual(res.length, 2);
  const ids = res.map((r) => r.id).sort();
  assert.deepStrictEqual(ids, ['makkah', 'turkey']);
});

test('Filtering logic: month "winter" returns 5 retreats', () => {
  const res = filterDestinations(DESTINATIONS, 'all', { destination: 'all', style: 'all', month: 'winter' });
  assert.strictEqual(res.length, 5);
  // Turkey is omitted in deep winter
  assert.ok(!res.some((d) => d.id === 'turkey'));
});

test('Filtering logic: compound filter (Turkey + Heritage + Ramadan) returns Turkey', () => {
  const res = filterDestinations(DESTINATIONS, 'all', {
    destination: 'turkey',
    style: 'heritage',
    month: 'ramadan',
  });
  assert.strictEqual(res.length, 1);
  assert.strictEqual(res[0].id, 'turkey');
});

test('Filtering logic: impossible combinations return 0 matches (triggers empty state)', () => {
  // Saudi + Safari
  const res1 = filterDestinations(DESTINATIONS, 'all', { destination: 'saudi', style: 'safari', month: 'any' });
  assert.strictEqual(res1.length, 0);

  // Maldives + Spiritual
  const res2 = filterDestinations(DESTINATIONS, 'all', { destination: 'maldives', style: 'spiritual', month: 'any' });
  assert.strictEqual(res2.length, 0);

  // Switzerland + Ramadan
  const res3 = filterDestinations(DESTINATIONS, 'all', { destination: 'switzerland', style: 'all', month: 'ramadan' });
  assert.strictEqual(res3.length, 0);
});

// 6. Category Pill Synchronization Logic (determineCategoryFromFilter)
test('Category synchronization: handles all single-destination and style mappings accurately', () => {
  assert.strictEqual(determineCategoryFromFilter(null), 'all');
  assert.strictEqual(determineCategoryFromFilter({ destination: 'all', style: 'all', month: 'any' }), 'all');
  assert.strictEqual(determineCategoryFromFilter({ destination: 'saudi', style: 'all', month: 'any' }), 'pilgrimage');
  assert.strictEqual(determineCategoryFromFilter({ destination: 'all', style: 'spiritual', month: 'any' }), 'pilgrimage');
  assert.strictEqual(determineCategoryFromFilter({ destination: 'spain', style: 'family', month: 'any' }), 'heritage');
  assert.strictEqual(determineCategoryFromFilter({ destination: 'turkey', style: 'honeymoon', month: 'any' }), 'heritage');
  assert.strictEqual(determineCategoryFromFilter({ destination: 'all', style: 'heritage', month: 'any' }), 'heritage');
  assert.strictEqual(determineCategoryFromFilter({ destination: 'maldives', style: 'all', month: 'any' }), 'island');
  assert.strictEqual(determineCategoryFromFilter({ destination: 'switzerland', style: 'all', month: 'any' }), 'alpine');
  assert.strictEqual(determineCategoryFromFilter({ destination: 'africa', style: 'all', month: 'any' }), 'alpine');
  assert.strictEqual(determineCategoryFromFilter({ destination: 'all', style: 'safari', month: 'any' }), 'alpine');
  // Multi-category styles default to 'all'
  assert.strictEqual(determineCategoryFromFilter({ destination: 'all', style: 'honeymoon', month: 'any' }), 'all');
  assert.strictEqual(determineCategoryFromFilter({ destination: 'all', style: 'family', month: 'any' }), 'all');
});

// 7. Category Switching & Dead-End Prevention
test('Category switching: clicking category tab remains 100% functional and never deadlocks', () => {
  // Scenario: user searched for Saudi, then clicks 'heritage' category pill
  const heritageResults = filterDestinations(DESTINATIONS, 'heritage', {
    destination: 'saudi',
    style: 'all',
    month: 'any',
  });
  // Must return Spain and Turkey instead of collapsing to 0
  assert.strictEqual(heritageResults.length, 2);
  const heritageIds = heritageResults.map((d) => d.id).sort();
  assert.deepStrictEqual(heritageIds, ['spain', 'turkey']);

  // Scenario: user searched for Saudi, then clicks 'island' category pill
  const islandResults = filterDestinations(DESTINATIONS, 'island', {
    destination: 'saudi',
    style: 'all',
    month: 'any',
  });
  assert.strictEqual(islandResults.length, 1);
  assert.strictEqual(islandResults[0].id, 'maldives');

  // Scenario: winter search + category pill filtering
  const winterAlpine = filterDestinations(DESTINATIONS, 'alpine', {
    destination: 'all',
    style: 'all',
    month: 'winter',
  });
  assert.strictEqual(winterAlpine.length, 2);
  const winterAlpineIds = winterAlpine.map((d) => d.id).sort();
  assert.deepStrictEqual(winterAlpineIds, ['safari', 'switzerland']);
});

// 8. Helper isSearchFilterActive
test('isSearchFilterActive: correctly identifies active vs inactive criteria', () => {
  assert.strictEqual(isSearchFilterActive(null), false);
  assert.strictEqual(isSearchFilterActive(undefined), false);
  assert.strictEqual(isSearchFilterActive({ destination: 'all', style: 'all', month: 'any' }), false);
  assert.strictEqual(isSearchFilterActive({ destination: 'saudi', style: 'all', month: 'any' }), true);
  assert.strictEqual(isSearchFilterActive({ destination: 'all', style: 'spiritual', month: 'any' }), true);
  assert.strictEqual(isSearchFilterActive({ destination: 'all', style: 'all', month: 'winter' }), true);
});

console.log(`\n🎉 All ${passedTests} Journey Finder & Search Filtering tests passed successfully!\n`);
