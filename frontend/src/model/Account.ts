import { Amount } from "./Amount";

export interface Account {
  id: string;
  name: string;
  description?: string;
  balances?: Amount[];
  amount?: Amount;
}
