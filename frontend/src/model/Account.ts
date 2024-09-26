import { Amount } from "./Amount";

export interface Account {
  id: string;
  name: string;
  accountNumber: string;
  description?: string;
  balances?: Amount[];
  amount?: Amount;
}
