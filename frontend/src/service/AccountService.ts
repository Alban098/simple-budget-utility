import axios, { AxiosResponse } from "axios";
import { Account } from "../model/Account";
import { Currency } from "../model/Currency";
import { Amount } from "../model/Amount";
import { Context, getUser } from "../App";

export default class AccountService {
  static async findAll(shallow: boolean): Promise<Account[]> {
    const response: AxiosResponse<Account[]> = await axios.get(
      "/api/account/",
      {
        headers: {
          Authorization: `Bearer ${getUser()?.access_token}`,
        },
        params: { currency: Context.currency, shallow: shallow },
      },
    );
    const accounts: Account[] = [];
    response.data.forEach((account: Account) =>
      accounts.push(this.convertCurrencies(account)),
    );
    return accounts;
  }

  static async find(id: string, shallow: boolean): Promise<Account> {
    const response: AxiosResponse<Account> = await axios.get(
      `/api/account/${id}`,
      {
        headers: {
          Authorization: `Bearer ${getUser()?.access_token}`,
        },
        params: { currency: Context.currency, shallow: shallow },
      },
    );
    return this.convertCurrencies(response.data);
  }

  static async create(dto: Account): Promise<Account> {
    const response: AxiosResponse<Account> = await axios.post(
      "/api/account/",
      dto,
      {
        headers: {
          Authorization: `Bearer ${getUser()?.access_token}`,
        },
      },
    );
    return this.convertCurrencies(response.data);
  }

  static async update(id: string, dto: Account): Promise<Account> {
    const response: AxiosResponse<Account> = await axios.put(
      `/api/account/${id}`,
      dto,
      {
        headers: {
          Authorization: `Bearer ${getUser()?.access_token}`,
        },
      },
    );
    return this.convertCurrencies(response.data);
  }

  static async delete(id: string) {
    await axios.delete(`/api/account/${id}`, {
      headers: {
        Authorization: `Bearer ${getUser()?.access_token}`,
      },
    });
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
