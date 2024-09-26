import { Account } from "./Account";
import { Amount } from "./Amount";
import { Category } from "./Category";

export interface TransactionDto {
  id: string;
  date: Date;
  description?: string;
  category: Category;
  account: Account;
  amount: Amount;
}
