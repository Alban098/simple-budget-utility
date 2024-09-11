import { Context } from "../App";

export enum Currency {
  EUR = "EUR",
  CHF = "CHF",
  USD = "USD",
}

export function chfTo(chf: number, to: Currency): number {
  switch (to) {
    case Currency.EUR:
      return chf * 1.0579;
    case Currency.USD:
      return chf * 1.1706;
  }
  return chf;
}

export function eurTo(eur: number, to: Currency): number {
  switch (to) {
    case Currency.CHF:
      return eur / 1.0579;
    case Currency.USD:
      return eur * 1.11;
  }
  return eur;
}

export function usdTo(usd: number, to: Currency): number {
  switch (to) {
    case Currency.EUR:
      return usd / 1.11;
    case Currency.CHF:
      return usd / 1.1706;
  }
  return usd;
}

export function format(
  amount: number,
  currency: Currency = Context.currency,
): string {
  return Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

export function getSymbol(currency: Currency): string {
  return (0)
    .toLocaleString("fr-FR", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    .replace(/\d/g, "")
    .trim();
}
