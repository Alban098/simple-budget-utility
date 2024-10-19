export interface ImportedStatement {
  id: string;
  date: Date;
  file: string;
  account: string;
  transactionCount: number;
  firstTransactionDate: Date;
  lastTransactionDate: Date;
}
