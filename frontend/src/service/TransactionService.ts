import axios, { AxiosResponse } from "axios";
import { Transaction } from "../model/Transaction";
import { Currency } from "../model/Currency";
import { Amount } from "../model/Amount";
import { Context } from "../App";
import { TransactionDto } from "../model/TransactionDto";

export default class TransactionService {
  static async import(
    formData: FormData,
    token: string,
  ): Promise<Transaction[]> {
    const response: AxiosResponse<Transaction[]> = await axios.post(
      "http://localhost:8080/api/transaction/import/",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const transactions: Transaction[] = [];
    response.data.forEach((transaction: Transaction) =>
      transactions.push(this.convert(transaction)),
    );
    return transactions;
  }

  static async findAll(token: string): Promise<Transaction[]> {
    const response: AxiosResponse<Transaction[]> = await axios.get(
      "http://localhost:8080/api/transaction/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const transactions: Transaction[] = [];
    response.data.forEach((transaction: Transaction) =>
      transactions.push(this.convert(transaction)),
    );
    return transactions;
  }

  static async findByAccount(
    token: string,
    accountId?: string,
  ): Promise<Transaction[]> {
    if (accountId == null || accountId === "-1") {
      return this.findAll(token);
    }
    const response: AxiosResponse<Transaction[]> = await axios.get(
      "http://localhost:8080/api/transaction/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
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

  static async find(id: string, token: string): Promise<TransactionDto> {
    const response: AxiosResponse<TransactionDto> = await axios.get(
      `http://localhost:8080/api/transaction/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { currency: Context.currency },
      },
    );
    return this.convertDto(response.data);
  }

  static async create(
    dto: TransactionDto,
    token: string,
  ): Promise<Transaction> {
    dto.date = new Date(dto.date);
    const response: AxiosResponse<Transaction> = await axios.post(
      "http://localhost:8080/api/transaction/",
      dto,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return this.convert(response.data);
  }

  static async update(
    id: string,
    dto: TransactionDto,
    token: string,
  ): Promise<Transaction> {
    dto.date = new Date(dto.date);
    const response: AxiosResponse<Transaction> = await axios.put(
      `http://localhost:8080/api/transaction/${id}`,
      dto,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return this.convert(response.data);
  }

  static async delete(id: string, token: string) {
    await axios.delete(`http://localhost:8080/api/transaction/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private static convert(transaction: Transaction): Transaction {
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

  private static convertDto(transaction: TransactionDto): TransactionDto {
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
