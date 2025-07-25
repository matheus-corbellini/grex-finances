/**
 * Utilitários para formatação de moeda e valores financeiros
 */

export interface CurrencyFormatOptions {
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  showSymbol?: boolean;
  showCode?: boolean;
}

const DEFAULT_OPTIONS: CurrencyFormatOptions = {
  currency: "BRL",
  locale: "pt-BR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  showSymbol: true,
  showCode: false,
};

export const formatCurrency = (
  amount: number,
  options: CurrencyFormatOptions = {}
): string => {
  const config = { ...DEFAULT_OPTIONS, ...options };

  try {
    const formatter = new Intl.NumberFormat(config.locale!, {
      style: config.showSymbol ? "currency" : "decimal",
      currency: config.currency,
      minimumFractionDigits: config.minimumFractionDigits,
      maximumFractionDigits: config.maximumFractionDigits,
    });

    let formatted = formatter.format(amount);

    if (config.showCode && !config.showSymbol) {
      formatted += ` ${config.currency}`;
    }

    return formatted;
  } catch (error) {
    console.error("Error formatting currency:", error);
    return `${config.currency} ${amount.toFixed(config.maximumFractionDigits)}`;
  }
};

export const formatCurrencyCompact = (
  amount: number,
  options: CurrencyFormatOptions = {}
): string => {
  const config = { ...DEFAULT_OPTIONS, ...options };

  const formatter = new Intl.NumberFormat(config.locale!, {
    style: config.showSymbol ? "currency" : "decimal",
    currency: config.currency,
    notation: "compact",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });

  return formatter.format(amount);
};

export const parseCurrency = (value: string): number => {
  // Remove todos os caracteres não numéricos exceto ponto e vírgula
  const cleaned = value.replace(/[^\d,.-]/g, "");

  // Substituir vírgula por ponto se for o separador decimal
  const normalized = cleaned.replace(",", ".");

  return parseFloat(normalized) || 0;
};

export const formatPercentage = (
  value: number,
  decimals: number = 2,
  locale: string = "pt-BR"
): string => {
  const formatter = new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return formatter.format(value / 100);
};

export const getCurrencySymbol = (
  currency: string,
  locale: string = "pt-BR"
): string => {
  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      currencyDisplay: "symbol",
    });

    return (
      formatter.formatToParts(0).find((part) => part.type === "currency")
        ?.value || currency
    );
  } catch {
    return currency;
  }
};

export const formatNumberCompact = (
  num: number,
  locale: string = "pt-BR"
): string => {
  const formatter = new Intl.NumberFormat(locale, {
    notation: "compact",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });

  return formatter.format(num);
};

export const isValidCurrencyAmount = (value: string): boolean => {
  const cleaned = value.replace(/[^\d,.-]/g, "");
  const normalized = cleaned.replace(",", ".");
  return !isNaN(parseFloat(normalized)) && isFinite(parseFloat(normalized));
};

// Constantes de moedas comuns
export const CURRENCIES = {
  BRL: { symbol: "R$", name: "Real Brasileiro", locale: "pt-BR" },
  USD: { symbol: "$", name: "Dólar Americano", locale: "en-US" },
  EUR: { symbol: "€", name: "Euro", locale: "de-DE" },
  GBP: { symbol: "£", name: "Libra Esterlina", locale: "en-GB" },
  JPY: { symbol: "¥", name: "Iene Japonês", locale: "ja-JP" },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;
