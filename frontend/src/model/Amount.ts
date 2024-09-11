import { Currency } from "../constant/Currency";

export class Amount {
  value: number;
  currency: Currency;

  constructor(value: number, currency: Currency) {
    this.value = value;
    this.currency = currency;
  }
}
