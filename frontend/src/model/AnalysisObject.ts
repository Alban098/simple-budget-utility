export interface DataValue {
  label: string;
  value: number;
}

export interface DataIncomeExpense {
  label: string;
  income: number;
  expense: number;
}

export interface DataLine {
  label: string;
  data: DataValue[];
}

export interface DataAccountIncomeExpense {
  account: string;
  data: DataIncomeExpense[];
}
