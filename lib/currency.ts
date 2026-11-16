export type CurrencyCode = 'BDT' | 'USD' | 'GBP' | 'EUR' | 'SAR' | 'AED';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  country: string;
  rateToBdt: number; // 1 Unit of this currency = X BDT
  rateFromBdt: number; // 1 BDT = X Units of this currency
}

/**
 * Calibrated Exchange Rates (USD Baseline = 120 BDT)
 * 1 USD = 120 BDT
 * 1 GBP = 152 BDT
 * 1 EUR = 130 BDT
 * 1 SAR = 32 BDT
 * 1 AED = 32.7 BDT
 */
export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  BDT: {
    code: 'BDT',
    symbol: '৳',
    name: 'Bangladeshi Taka',
    country: 'Bangladesh',
    rateToBdt: 1,
    rateFromBdt: 1,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    country: 'United States',
    rateToBdt: 120,
    rateFromBdt: 1 / 120,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    country: 'United Kingdom',
    rateToBdt: 152,
    rateFromBdt: 1 / 152,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    country: 'European Union',
    rateToBdt: 130,
    rateFromBdt: 1 / 130,
  },
  SAR: {
    code: 'SAR',
    symbol: '﷼',
    name: 'Saudi Riyal',
    country: 'Saudi Arabia',
    rateToBdt: 32,
    rateFromBdt: 1 / 32,
  },
  AED: {
    code: 'AED',
    symbol: 'د.إ',
    name: 'UAE Dirham',
    country: 'United Arab Emirates',
    rateToBdt: 32.7,
    rateFromBdt: 1 / 32.7,
  },
};

export const SUPPORTED_CURRENCY_CODES: CurrencyCode[] = ['BDT', 'USD', 'GBP', 'EUR', 'SAR', 'AED'];

/**
 * Extracts a numeric BDT value from a raw number or string like '৳695,000' or 'From ৳ 890,000'
 */
export function parseBdtAmount(input: number | string | undefined | null): number {
  if (input == null) return 0;
  if (typeof input === 'number') return isNaN(input) ? 0 : input;

  // Extract the first contiguous cluster of numbers with commas
  const cleaned = input.replace(/,/g, '');
  const match = cleaned.match(/\d+(\.\d+)?/);
  if (!match) return 0;

  const val = parseFloat(match[0]);
  return isNaN(val) ? 0 : val;
}

/**
 * Converts a BDT amount into the target currency
 */
export function convertBdtToCurrency(amountInBdt: number | string, targetCurrency: CurrencyCode): number {
  const bdt = parseBdtAmount(amountInBdt);
  const config = CURRENCIES[targetCurrency] || CURRENCIES.BDT;
  return bdt * config.rateFromBdt;
}

/**
 * Converts an amount from one currency to another
 */
export function convertPrice(amount: number, fromCurrency: CurrencyCode, toCurrency: CurrencyCode): number {
  if (fromCurrency === toCurrency) return amount;
  const fromConfig = CURRENCIES[fromCurrency] || CURRENCIES.BDT;
  const toConfig = CURRENCIES[toCurrency] || CURRENCIES.BDT;

  // Convert to BDT first
  const bdtAmount = amount * fromConfig.rateToBdt;
  // Convert from BDT to target
  return bdtAmount * toConfig.rateFromBdt;
}

/**
 * Formats a currency amount with symbol and thousand separators.
 */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode = 'BDT',
  options: { round?: boolean } = { round: true }
): string {
  const config = CURRENCIES[currency] || CURRENCIES.BDT;
  const safeAmount = isNaN(amount) || amount == null ? 0 : amount;
  const rounded = options.round !== false ? Math.round(safeAmount) : safeAmount;
  const formattedNumber = rounded.toLocaleString('en-US');

  if (config.symbol === 'د.إ' || config.symbol === '﷼') {
    return `${config.symbol} ${formattedNumber}`;
  }
  return `${config.symbol}${formattedNumber}`;
}

/**
 * Convenience helper: takes raw BDT amount (number or formatted string)
 * and returns it formatted in the target currency.
 */
export function formatBdt(amountInBdt: number | string, targetCurrency: CurrencyCode = 'BDT'): string {
  const converted = convertBdtToCurrency(amountInBdt, targetCurrency);
  return formatCurrency(converted, targetCurrency);
}
