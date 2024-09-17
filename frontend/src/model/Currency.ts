import { Context } from "../App";

export enum Currency {
  EUR = "EUR",
  CHF = "CHF",
  USD = "USD",
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
