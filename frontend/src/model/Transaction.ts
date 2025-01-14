import { Amount } from "./Amount";

export interface Transaction {
  id: string;
  date: Date;
  description?: string;
  category: string;
  account: string;
  amount: Amount;
  imported: boolean;
}
