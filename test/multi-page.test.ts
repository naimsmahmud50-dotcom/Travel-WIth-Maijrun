import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { DETAILED_DESTINATIONS } from '../lib/destination-details.ts';

test('Multi-Page Ecosystem: app/destinations/[id]/page.tsx defines generateStaticParams and metadata', () => {
  const code = fs.readFileSync(path.resolve('app/destinations/[id]/page.tsx'), 'utf-8');
  assert.ok(code.includes('export function generateStaticParams()'), 'Must export generateStaticParams');
  assert.ok(code.includes('export function generateMetadata'), 'Must export generateMetadata');
  assert.ok(code.includes('DestinationClientView'), 'Must render DestinationClientView');
  assert.ok(code.includes('notFound()'), 'Must handle invalid destination IDs with notFound');
});

test('Multi-Page Ecosystem: DETAILED_DESTINATIONS data integrity', () => {
  const destinationKeys = ['makkah', 'spain', 'maldives', 'switzerland', 'turkey', 'safari'];
  
  for (const key of destinationKeys) {
    const dest = DETAILED_DESTINATIONS[key];
    assert.ok(dest, `Destination ${key} must exist`);
    assert.ok(dest.title.length > 5, `${key} must have descriptive title`);
    assert.ok(dest.itinerary.length >= 7, `${key} itinerary must have at least 7 days detailed`);
    assert.ok(dest.halalInclusions.length >= 3, `${key} must have verified halal inclusions`);
    assert.ok(dest.gallery.length >= 2, `${key} must have sanctuary villa gallery`);
    assert.ok(dest.priceBdt.includes('৳'), `${key} must have BDT price`);
    assert.ok(dest.priceUsd.includes('$'), `${key} must have USD price`);
  }
});

test('Multi-Page Ecosystem: app/bespoke/page.tsx implements 4-step atelier & submits to /api/inquiries', () => {
  const code = fs.readFileSync(path.resolve('app/bespoke/page.tsx'), 'utf-8');
  assert.ok(code.includes('Tailor-Made Royal Atelier'), 'Must feature atelier title');
  assert.ok(code.includes("step === 1"), 'Must have step 1');
  assert.ok(code.includes("step === 2"), 'Must have step 2');
  assert.ok(code.includes("step === 3"), 'Must have step 3');
  assert.ok(code.includes("step === 4"), 'Must have step 4');
  assert.ok(code.includes("fetch('/api/inquiries'"), 'Must submit inquiry to API');
});

test('Multi-Page Ecosystem: app/ethos/page.tsx strictly honors Founder Mahmud Hasan', () => {
  const code = fs.readFileSync(path.resolve('app/ethos/page.tsx'), 'utf-8');
  assert.ok(code.includes('Mahmud Hasan'), 'Must honor Founder Mahmud Hasan');
  assert.ok(!code.includes('Sheikh Mahmud Hasan'), 'Strictly zero instances of "Sheikh Mahmud Hasan" allowed');
  assert.ok(code.includes('The Four Pillars of Halal Luxury'), 'Must contain 4 Pillars');
  assert.ok(code.includes('Frequently Asked Questions'), 'Must contain VIP Client FAQ');
});

test('Multi-Page Ecosystem: components/Navbar.tsx provides mega-menu and direct links', () => {
  const code = fs.readFileSync(path.resolve('components/Navbar.tsx'), 'utf-8');
  assert.ok(code.includes('/destinations/'), 'Must link to destination pages');
  assert.ok(code.includes('/ethos'), 'Must link to /ethos');
  assert.ok(code.includes('/bespoke'), 'Must link to /bespoke');
});
