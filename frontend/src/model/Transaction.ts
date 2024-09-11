import { Account } from "./Account";
import { Amount } from "./Amount";
import { Category } from "./Category";

export class Transaction {
  id: string;
  date: Date;
  description?: string;
  category: Category;
  account: Account;
  amounts: Amount[];

  constructor(
    id: string,
    date: Date,
    description: string,
    category: Category,
    account: Account,
    amounts: Amount[],
  ) {
    this.id = id;
    this.date = date;
    this.description = description;
    this.category = category;
    this.account = account;
    this.amounts = amounts;
  }
}
