import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import {
  SANCTUARIES,
  ORIGIN_HUBS,
  projectCoords,
  calculateDistanceNM,
  calculateFlightDuration,
  getRecommendedAircraft,
} from '../lib/sanctuary-map.ts';

test('Global Sanctuary Map: contains all 6 Royal Halal Sanctuaries', () => {
  assert.strictEqual(SANCTUARIES.length, 6, 'Must feature exactly 6 royal sanctuaries');
  
  const expectedIds = ['makkah', 'spain', 'maldives', 'switzerland', 'turkey', 'safari'];
  const sanctuaryIds = SANCTUARIES.map((s) => s.id);

  for (const id of expectedIds) {
    assert.ok(sanctuaryIds.includes(id), `Sanctuary '${id}' must be present in map portfolio`);
    const item = SANCTUARIES.find((s) => s.id === id)!;
    assert.ok(item.title.length > 5, `${id} must have descriptive title`);
    assert.ok(item.country.length > 2, `${id} must have country`);
    assert.ok(item.priceBdt > 0, `${id} must have priceBdt`);
    assert.ok(item.image.startsWith('https://'), `${id} must have valid image URL`);
    assert.ok(item.highlights.length >= 2, `${id} must include curations/highlights`);
    assert.ok(typeof item.lat === 'number' && typeof item.lon === 'number', `${id} must have lat/lon`);
  }
});

test('Global Sanctuary Map: contains all 4 Private Jet Origin Hubs', () => {
  assert.strictEqual(ORIGIN_HUBS.length, 4, 'Must feature 4 luxury departure hubs');

  const expectedHubs = ['DAC', 'DXB', 'LHR', 'RUH'];
  const hubCodes = ORIGIN_HUBS.map((h) => h.code);

  for (const code of expectedHubs) {
    assert.ok(hubCodes.includes(code), `Origin hub '${code}' must be present`);
    const hub = ORIGIN_HUBS.find((h) => h.code === code)!;
    assert.ok(hub.city.length > 2, `${code} must have city`);
    assert.ok(hub.airport.length > 5, `${code} must have airport name`);
    assert.ok(hub.terminal.length > 5, `${code} must have VIP terminal name`);
    assert.ok(typeof hub.lat === 'number' && typeof hub.lon === 'number', `${code} must have coordinates`);
  }
});

test('Global Sanctuary Map: projectCoords accurately projects (lat, lon) to SVG canvas (1000x500)', () => {
  // Equator, Prime Meridian (0, 0) -> (500, 250)
  const center = projectCoords(0, 0);
  assert.strictEqual(center.x, 500);
  assert.strictEqual(center.y, 250);

  // Dhaka (23.81, 90.41)
  const dac = projectCoords(23.8103, 90.4125);
  assert.ok(dac.x > 740 && dac.x < 760, 'DAC X must be within South Asia bounds');
  assert.ok(dac.y > 175 && dac.y < 195, 'DAC Y must be within Subtropical Northern hemisphere');

  // London (51.51, -0.13)
  const lhr = projectCoords(51.5074, -0.1278);
  assert.ok(lhr.x > 490 && lhr.x < 510, 'LHR X must be around Prime Meridian');
  assert.ok(lhr.y > 100 && lhr.y < 115, 'LHR Y must be in Northern Europe');
});

test('Global Sanctuary Map: calculateDistanceNM Great-Circle calculations', () => {
  // Dhaka to Dubai (~1,900 - 2,050 NM)
  const dacToDxb = calculateDistanceNM(23.8103, 90.4125, 25.2048, 55.2708);
  assert.ok(dacToDxb >= 1900 && dacToDxb <= 2050, `DAC to DXB should be ~1950 NM, got ${dacToDxb}`);

  // London to Makkah (~2,400 - 2,650 NM)
  const lhrToMakkah = calculateDistanceNM(51.5074, -0.1278, 21.4225, 39.8262);
  assert.ok(lhrToMakkah >= 2400 && lhrToMakkah <= 2650, `LHR to Makkah should be ~2550 NM, got ${lhrToMakkah}`);

  // Dubai to Maldives (~1,600 - 1,800 NM)
  const dxbToMaldives = calculateDistanceNM(25.2048, 55.2708, 4.1755, 73.5093);
  assert.ok(dxbToMaldives >= 1600 && dxbToMaldives <= 1800, `DXB to Maldives should be ~1700 NM, got ${dxbToMaldives}`);
});

test('Global Sanctuary Map: calculateFlightDuration returns formatted private jet flight time', () => {
  // 1,950 NM ~ 4h 29m
  const d1 = calculateFlightDuration(1950);
  assert.strictEqual(d1.hours, 4);
  assert.ok(d1.minutes >= 20 && d1.minutes <= 40);
  assert.ok(d1.text.includes('4h'));

  // 2,550 NM ~ 5h 43m
  const d2 = calculateFlightDuration(2550);
  assert.strictEqual(d2.hours, 5);
  assert.ok(d2.text.includes('5h'));
});

test('Global Sanctuary Map: getRecommendedAircraft selects appropriate luxury jet model by range', () => {
  const shortFlight = getRecommendedAircraft(1800);
  assert.ok(shortFlight.model.includes('Bombardier Challenger 650'));

  const midFlight = getRecommendedAircraft(3200);
  assert.ok(midFlight.model.includes('Gulfstream G650ER'));

  const ultraLongFlight = getRecommendedAircraft(5200);
  assert.ok(ultraLongFlight.model.includes('Bombardier Global 7500'));
});

test('Global Sanctuary Map: UI component code contract', () => {
  const code = fs.readFileSync(path.resolve('components/GlobalSanctuaryMap.tsx'), 'utf-8');

  // Verify key UI elements & interactions
  assert.ok(code.includes('Royal Jet Route'), 'Must feature Royal Jet Route title');
  assert.ok(code.includes('flightPathArc'), 'Must compute animated flight path arc');
  assert.ok(code.includes('animate-ping'), 'Must include pulsing radar rings');
  assert.ok(code.includes('stroke="url(#flightArcGrad)"'), 'Must render golden gradient flight trajectory');
  assert.ok(code.includes('Avionics & Telemetry'), 'Must render Avionics & Telemetry display');
  assert.ok(code.includes('Inquire Jet Charter'), 'Must include Inquire Jet Charter CTA');
  assert.ok(code.includes('/destinations/${selectedSanctuary.id}'), 'Must link to active sanctuary dossier');
});

test('Page Integration: app/page.tsx embeds GlobalSanctuaryMap between JourneyFinder and SignatureJourneys', () => {
  const code = fs.readFileSync(path.resolve('app/page.tsx'), 'utf-8');

  assert.ok(code.includes('import GlobalSanctuaryMap from'), 'Must import GlobalSanctuaryMap');
  assert.ok(code.includes('<GlobalSanctuaryMap onOpenInquiry={handleOpenInquiry} />'), 'Must render GlobalSanctuaryMap with callback');

  const journeyFinderIdx = code.indexOf('<JourneyFinder');
  const sanctuaryMapIdx = code.indexOf('<GlobalSanctuaryMap');
  const signatureJourneysIdx = code.indexOf('<SignatureJourneys');

  assert.ok(journeyFinderIdx !== -1, 'JourneyFinder must be present');
  assert.ok(sanctuaryMapIdx !== -1, 'GlobalSanctuaryMap must be present');
  assert.ok(signatureJourneysIdx !== -1, 'SignatureJourneys must be present');

  assert.ok(
    journeyFinderIdx < sanctuaryMapIdx && sanctuaryMapIdx < signatureJourneysIdx,
    'GlobalSanctuaryMap must be located strictly between JourneyFinder and SignatureJourneys'
  );
});
