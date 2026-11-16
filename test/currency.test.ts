import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import {
  CURRENCIES,
  SUPPORTED_CURRENCY_CODES,
  parseBdtAmount,
  convertBdtToCurrency,
  convertPrice,
  formatCurrency,
  formatBdt,
  type CurrencyCode,
} from '../lib/currency.ts';

test('Currency Engine: supports all 6 required luxury currencies', () => {
  const requiredCurrencies: CurrencyCode[] = ['BDT', 'USD', 'GBP', 'EUR', 'SAR', 'AED'];
  assert.strictEqual(SUPPORTED_CURRENCY_CODES.length, 6);
  
  for (const code of requiredCurrencies) {
    assert.ok(CURRENCIES[code], `Currency ${code} must be defined`);
    assert.ok(CURRENCIES[code].symbol, `${code} must have a symbol`);
    assert.ok(CURRENCIES[code].name, `${code} must have a name`);
    assert.ok(CURRENCIES[code].rateToBdt > 0, `${code} must have positive rateToBdt`);
    assert.ok(CURRENCIES[code].rateFromBdt > 0, `${code} must have positive rateFromBdt`);
  }
});

test('Currency Engine: validates calibrated exchange rates against USD baseline', () => {
  // Baseline rates calibrated to BDT
  assert.strictEqual(CURRENCIES.BDT.rateToBdt, 1);
  assert.strictEqual(CURRENCIES.USD.rateToBdt, 120);
  assert.strictEqual(CURRENCIES.GBP.rateToBdt, 152);
  assert.strictEqual(CURRENCIES.EUR.rateToBdt, 130);
  assert.strictEqual(CURRENCIES.SAR.rateToBdt, 32);
  assert.strictEqual(CURRENCIES.AED.rateToBdt, 32.7);

  // Verify inverse rateFromBdt math
  assert.strictEqual(CURRENCIES.BDT.rateFromBdt, 1);
  assert.strictEqual(CURRENCIES.USD.rateFromBdt, 1 / 120);
  assert.strictEqual(CURRENCIES.GBP.rateFromBdt, 1 / 152);
  assert.strictEqual(CURRENCIES.EUR.rateFromBdt, 1 / 130);
  assert.strictEqual(CURRENCIES.SAR.rateFromBdt, 1 / 32);
  assert.strictEqual(CURRENCIES.AED.rateFromBdt, 1 / 32.7);
});

test('Currency Engine: parseBdtAmount extracts clean numeric values', () => {
  assert.strictEqual(parseBdtAmount(695000), 695000);
  assert.strictEqual(parseBdtAmount('৳695,000'), 695000);
  assert.strictEqual(parseBdtAmount('৳ 890,000'), 890000);
  assert.strictEqual(parseBdtAmount('From ৳ 1,176,000 / $9,800'), 1176000);
  assert.strictEqual(parseBdtAmount('1020000'), 1020000);
  assert.strictEqual(parseBdtAmount(null), 0);
  assert.strictEqual(parseBdtAmount(undefined), 0);
  assert.strictEqual(parseBdtAmount('no-numbers'), 0);
});

test('Currency Engine: convertBdtToCurrency converts accurately', () => {
  const bdtAmount = 695000;
  
  // 695,000 / 120 = 5791.666...
  const inUsd = convertBdtToCurrency(bdtAmount, 'USD');
  assert.ok(Math.abs(inUsd - 5791.666) < 0.01);

  // 695,000 / 152 = 4572.368...
  const inGbp = convertBdtToCurrency(bdtAmount, 'GBP');
  assert.ok(Math.abs(inGbp - 4572.368) < 0.01);

  // 695,000 / 130 = 5346.153...
  const inEur = convertBdtToCurrency(bdtAmount, 'EUR');
  assert.ok(Math.abs(inEur - 5346.153) < 0.01);

  // 695,000 / 32 = 21718.75
  const inSar = convertBdtToCurrency(bdtAmount, 'SAR');
  assert.strictEqual(inSar, 21718.75);

  // 695,000 / 32.7 = 21253.82...
  const inAed = convertBdtToCurrency(bdtAmount, 'AED');
  assert.ok(Math.abs(inAed - 21253.822) < 0.01);

  // BDT identity
  assert.strictEqual(convertBdtToCurrency(bdtAmount, 'BDT'), 695000);
});

test('Currency Engine: convertPrice handles arbitrary currency pairs', () => {
  // Convert 1,000 USD to EUR:
  // 1,000 USD = 120,000 BDT -> 120,000 / 130 = 923.0769 EUR
  const usdToEur = convertPrice(1000, 'USD', 'EUR');
  assert.ok(Math.abs(usdToEur - 923.077) < 0.01);

  // Convert 1,000 GBP to SAR:
  // 1,000 GBP = 152,000 BDT -> 152,000 / 32 = 4,750 SAR
  const gbpToSar = convertPrice(1000, 'GBP', 'SAR');
  assert.strictEqual(gbpToSar, 4750);

  // Identity conversion
  assert.strictEqual(convertPrice(500, 'USD', 'USD'), 500);
});

test('Currency Engine: formatCurrency formats with exact symbols and commas', () => {
  assert.strictEqual(formatCurrency(695000, 'BDT'), '৳695,000');
  assert.strictEqual(formatCurrency(5792, 'USD'), '$5,792');
  assert.strictEqual(formatCurrency(4572, 'GBP'), '£4,572');
  assert.strictEqual(formatCurrency(5346, 'EUR'), '€5,346');
  assert.strictEqual(formatCurrency(21719, 'SAR'), '﷼ 21,719');
  assert.strictEqual(formatCurrency(21254, 'AED'), 'د.إ 21,254');
});

test('Currency Engine: formatBdt helper integrates parsing, conversion, and formatting', () => {
  // BDT formatting
  assert.strictEqual(formatBdt('৳695,000', 'BDT'), '৳695,000');
  assert.strictEqual(formatBdt(695000, 'BDT'), '৳695,000');

  // USD formatting
  assert.strictEqual(formatBdt('৳695,000', 'USD'), '$5,792');

  // GBP formatting
  assert.strictEqual(formatBdt('৳768,000', 'GBP'), '£5,053');

  // EUR formatting
  assert.strictEqual(formatBdt('৳864,000', 'EUR'), '€6,646');

  // SAR formatting
  assert.strictEqual(formatBdt('৳1,020,000', 'SAR'), '﷼ 31,875');

  // AED formatting
  assert.strictEqual(formatBdt('৳1,176,000', 'AED'), 'د.إ 35,963');
});

test('Currency Engine: robust handling of NaN, null, and empty boundaries', () => {
  // NaN inputs safely format to zero rather than displaying NaN to luxury visitors
  assert.strictEqual(formatCurrency(NaN, 'BDT'), '৳0');
  assert.strictEqual(formatCurrency(NaN, 'USD'), '$0');
  // Nullish conversion
  assert.strictEqual(formatBdt(null, 'USD'), '$0');
  assert.strictEqual(formatBdt(undefined, 'GBP'), '£0');
  assert.strictEqual(formatBdt('', 'EUR'), '€0');
  assert.strictEqual(formatBdt('invalid-text', 'SAR'), '﷼ 0');
});

test('Currency UI Contract: Navbar integrates visible non-clipped currency selector', () => {
  const code = fs.readFileSync(path.resolve('components/Navbar.tsx'), 'utf-8');
  assert.ok(code.includes('useCurrency'), 'Navbar must consume useCurrency hook');
  assert.ok(code.includes('currencyDropdownOpen'), 'Navbar must manage dropdown state');
  assert.ok(code.includes('overflow-visible'), 'Navbar top bar must have overflow-visible when not scrolled to prevent clipping dropdown');
  assert.ok(code.includes('Select Currency'), 'Navbar must include Select Currency controls');
  assert.ok(code.includes('currencyList.map'), 'Navbar must map through all supported currencies');
});


