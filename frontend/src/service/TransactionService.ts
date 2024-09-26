import axios, { AxiosResponse } from "axios";
import { Transaction } from "../model/Transaction";
import { Currency } from "../model/Currency";
import { Amount } from "../model/Amount";
import { Context, getUser } from "../App";
import { TransactionDto } from "../model/TransactionDto";
import moment from "moment";

export default class TransactionService {
  static async import(formData: FormData): Promise<Transaction[]> {
    const response: AxiosResponse<Transaction[]> = await axios.post(
      "/api/transaction/import",
      formData,
      {
        headers: {
          Authorization: `Bearer ${getUser()?.access_token}`,
        },
      },
    );
    const transactions: Transaction[] = [];
    response.data.forEach((transaction: Transaction) =>
      transactions.push(this.convert(transaction)),
    );
    return transactions;
  }

  static async finalizeImport(
    transactions: Transaction[],
  ): Promise<Transaction[]> {
    const response: AxiosResponse<Transaction[]> = await axios.post(
      "/api/transaction/import/finalize",
      transactions,
      {
        headers: {
          Authorization: `Bearer ${getUser()?.access_token}`,
        },
      },
    );
    const saved: Transaction[] = [];
    response.data.forEach((transaction: Transaction) =>
      saved.push(this.convert(transaction)),
    );
    return saved;
  }

  static async findAll(): Promise<Transaction[]> {
    const response: AxiosResponse<Transaction[]> = await axios.get(
      "/api/transaction/",
      {
        headers: {
          Authorization: `Bearer ${getUser()?.access_token}`,
        },
      },
    );
    const transactions: Transaction[] = [];
    response.data.forEach((transaction: Transaction) =>
      transactions.push(this.convert(transaction)),
    );
    return transactions;
  }

  static async findByAccount(accountId?: string): Promise<Transaction[]> {
    if (accountId == null || accountId === "-1") {
      return this.findAll();
    }
    const response: AxiosResponse<Transaction[]> = await axios.get(
      "/api/transaction/",
      {
        headers: {
          Authorization: `Bearer ${getUser()?.access_token}`,
        },
        params: { accountId: accountId },
      },
    );
    const transactions: Transaction[] = [];
    response.data.forEach((transaction: Transaction) =>
      transactions.push(this.convert(transaction)),
    );
    return transactions;
  }

  static async find(id: string): Promise<TransactionDto> {
    const response: AxiosResponse<TransactionDto> = await axios.get(
      `/api/transaction/${id}`,
      {
        headers: {
          Authorization: `Bearer ${getUser()?.access_token}`,
        },
        params: { currency: Context.currency },
      },
    );
    return this.convertDto(response.data);
  }

  static async create(dto: TransactionDto): Promise<Transaction> {
    const response: AxiosResponse<Transaction> = await axios.post(
      "/api/transaction/",
      { ...dto, date: moment(dto.date).format("YYYY-MM-DD") },
      {
        headers: {
          Authorization: `Bearer ${getUser()?.access_token}`,
        },
      },
    );
    return this.convert(response.data);
  }

  static async update(id: string, dto: TransactionDto): Promise<Transaction> {
    const response: AxiosResponse<Transaction> = await axios.put(
      `/api/transaction/${id}`,
      { ...dto, date: moment(dto.date).format("YYYY-MM-DD") },
      {
        headers: {
          Authorization: `Bearer ${getUser()?.access_token}`,
        },
      },
    );
    return this.convert(response.data);
  }

  static async delete(id: string) {
    await axios.delete(`/api/transaction/${id}`, {
      headers: {
        Authorization: `Bearer ${getUser()?.access_token}`,
      },
    });
  }

  private static convert(transaction: Transaction): Transaction {
    const castedAmount: Amount = {
      currency: Currency[transaction.amount.currency as keyof typeof Currency],
      value: transaction.amount.value,
    };
    transaction.amount = castedAmount;
    transaction.date = new Date(transaction.date);
    return transaction;
  }

  private static convertDto(transaction: TransactionDto): TransactionDto {
    const castedAmount: Amount = {
      currency: Currency[transaction.amount.currency as keyof typeof Currency],
      value: transaction.amount.value,
    };
    transaction.amount = castedAmount;
    transaction.date = new Date(transaction.date);
    return transaction;
  }
}
