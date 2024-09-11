import { Amount } from "./Amount";

export class Account {
  id: string;
  name: string;
  description?: string;
  balances?: Amount[];
  amount?: Amount;

  constructor(
    id: string,
    name: string,
    description?: string,
    balances?: Amount[],
    amount?: Amount,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.balances = balances;
    this.amount = amount;
  }
}
