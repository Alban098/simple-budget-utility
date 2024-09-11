export class Category {
  id: string;
  name: string;
  expense?: number;

  constructor(id: string, name: string, expense: number) {
    this.id = id;
    this.name = name;
    this.expense = expense;
  }
}
