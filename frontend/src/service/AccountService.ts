import axios, { AxiosResponse } from "axios";
import { Account } from "../model/Account";
import { Currency } from "../model/Currency";
import { Amount } from "../model/Amount";
import { Context } from "../App";

export default class AccountService {
  static async findAll(): Promise<Account[]> {
    const response: AxiosResponse<Account[]> = await axios.get(
      "http://localhost:8080/api/account/",
      { params: { currency: Context.currency } },
    );
    const accounts: Account[] = [];
    response.data.forEach((account: Account) =>
      accounts.push(this.convertCurrencies(account)),
    );
    return accounts;
  }

  static async find(id: string): Promise<Account> {
    const response: AxiosResponse<Account> = await axios.get(
      `http://localhost:8080/api/account/${id}`,
      { params: { currency: Context.currency } },
    );
    return this.convertCurrencies(response.data);
  }

  static async create(dto: Account): Promise<Account> {
    const response: AxiosResponse<Account> = await axios.post(
      "http://localhost:8080/api/account/",
      dto,
    );
    return this.convertCurrencies(response.data);
  }

  static async update(id: string, dto: Account): Promise<Account> {
    const response: AxiosResponse<Account> = await axios.put(
      `http://localhost:8080/api/account/${id}`,
      dto,
    );
    return this.convertCurrencies(response.data);
  }

  static async delete(id: string) {
    await axios.delete(`http://localhost:8080/api/account/${id}`);
  }

  private static convertCurrencies(account: Account): Account {
    const castedBalance: Amount[] = [];
    account.balances?.forEach((balance) => {
      castedBalance.push({
        currency: Currency[balance.currency as keyof typeof Currency],
        value: balance.value,
      });
    });
    account.balances = castedBalance;
    if (account.amount != null) {
      account.amount.currency =
        Currency[account.amount.currency as keyof typeof Currency];
    }
    return account;
  }
}
