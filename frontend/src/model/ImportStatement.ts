import { Transaction } from "./Transaction";

export interface ImportStatement {
  transactions: Transaction[];
  fileName: string;
  accountId: string;
}
