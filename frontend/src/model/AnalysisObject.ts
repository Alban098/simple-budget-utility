export class DataValue {
  label: string;
  value: number;

  constructor(label: string, value: number) {
    this.label = label;
    this.value = value;
  }
}

export class DataIncomeExpense {
  label: string;
  income: number;
  expense: number;

  constructor(label: string, x: number, y: number) {
    this.label = label;
    this.income = x;
    this.expense = y;
  }
}

export class DataLine {
  label: string;
  data: DataValue[];

  constructor(account: string, data: DataValue[]) {
    this.label = account;
    this.data = data;
  }
}

export class DataAccountIncomeExpense {
  account: string;
  data: DataIncomeExpense[];

  constructor(account: string, data: DataIncomeExpense[]) {
    this.account = account;
    this.data = data;
  }
}
