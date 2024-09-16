import axios, { AxiosResponse } from "axios";
import { Transaction } from "../model/Transaction";
import { Currency } from "../model/Currency";
import { Amount } from "../model/Amount";
import { Context } from "../App";

export default class TransactionService {
  static async findAll(): Promise<Transaction[]> {
    const response: AxiosResponse<Transaction[]> = await axios.get(
      "http://localhost:8080/api/transaction/",
    );
    const transactions: Transaction[] = [];
    response.data.forEach((transaction: Transaction) =>
      transactions.push(this.convertDto(transaction)),
    );
    return transactions;
  }

  static async findByAccount(accountId?: string): Promise<Transaction[]> {
    if (accountId == null || accountId === "-1") {
      return this.findAll();
    }
    const response: AxiosResponse<Transaction[]> = await axios.get(
      "http://localhost:8080/api/transaction/",
      { params: { accountId: accountId } },
    );
    const transactions: Transaction[] = [];
    response.data.forEach((transaction: Transaction) =>
      transactions.push(this.convertDto(transaction)),
    );
    return transactions;
  }

  static async find(id: string): Promise<Transaction> {
    const response: AxiosResponse<Transaction> = await axios.get(
      `http://localhost:8080/api/transaction/${id}`,
      { params: { currency: Context.currency } },
    );
    return this.convertDto(response.data);
  }

  static async create(dto: Transaction): Promise<Transaction> {
    dto.date = new Date(dto.date);
    const response: AxiosResponse<Transaction> = await axios.post(
      "http://localhost:8080/api/transaction/",
      dto,
    );
    return this.convertDto(response.data);
  }

  static async update(id: string, dto: Transaction): Promise<Transaction> {
    dto.date = new Date(dto.date);
    const response: AxiosResponse<Transaction> = await axios.put(
      `http://localhost:8080/api/transaction/${id}`,
      dto,
    );
    return this.convertDto(response.data);
  }

  static async delete(id: string) {
    await axios.delete(`http://localhost:8080/api/transaction/${id}`);
  }

  private static convertDto(transaction: Transaction): Transaction {
    const castedAmounts: Amount[] = [];
    transaction.amounts?.forEach((balance) => {
      castedAmounts.push({
        currency: Currency[balance.currency as keyof typeof Currency],
        value: balance.value,
      });
    });
    transaction.amounts = castedAmounts;
    transaction.date = new Date(transaction.date);
    return transaction;
  }
}
