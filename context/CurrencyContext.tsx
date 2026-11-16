'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CurrencyCode,
  CURRENCIES,
  CurrencyConfig,
  SUPPORTED_CURRENCY_CODES,
  formatBdt as formatBdtUtil,
  convertBdtToCurrency,
} from '@/lib/currency';

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatBdt: (amount: number | string) => string;
  convertBdt: (amount: number | string) => number;
  currencies: Record<CurrencyCode, CurrencyConfig>;
  currencyList: CurrencyConfig[];
  isHydrated: boolean;
}

const STORAGE_KEY = 'travel_maijrun_currency_pref';

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('BDT');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
      if (stored && CURRENCIES[stored]) {
        setCurrencyState(stored);
      }
    } catch {
      // LocalStorage access may fail in certain browser privacy modes
    }
    setIsHydrated(true);
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    if (CURRENCIES[code]) {
      setCurrencyState(code);
      try {
        localStorage.setItem(STORAGE_KEY, code);
      } catch {
        // Ignore write error
      }
    }
  };

  const formatBdt = (amount: number | string) => {
    return formatBdtUtil(amount, currency);
  };

  const convertBdt = (amount: number | string) => {
    return convertBdtToCurrency(amount, currency);
  };

  const currencyList = SUPPORTED_CURRENCY_CODES.map((code) => CURRENCIES[code]);

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatBdt,
        convertBdt,
        currencies: CURRENCIES,
        currencyList,
        isHydrated,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const context = useContext(CurrencyContext);
  if (!context) {
    return {
      currency: 'BDT',
      setCurrency: () => {},
      formatBdt: (amt: number | string) => formatBdtUtil(amt, 'BDT'),
      convertBdt: (amt: number | string) => convertBdtToCurrency(amt, 'BDT'),
      currencies: CURRENCIES,
      currencyList: SUPPORTED_CURRENCY_CODES.map((code) => CURRENCIES[code]),
      isHydrated: true,
    };
  }
  return context;
}
