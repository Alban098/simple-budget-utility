export enum Currency {
  EUR = "EUR",
  CHF = "CHF",
  US_DOLLAR = "USD",
}

export function chfTo(chf: number, to: Currency): number {
  switch (to) {
    case Currency.EUR:
      return chf * 1.0579;
    case Currency.US_DOLLAR:
      return chf * 1.1706;
  }
  return chf;
}

export function eurTo(eur: number, to: Currency): number {
  switch (to) {
    case Currency.CHF:
      return eur / 1.0579;
    case Currency.US_DOLLAR:
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
  currency: Currency = Currency.EUR,
): string {
  return Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency,
  }).format(amount);
}
