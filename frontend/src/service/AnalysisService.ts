import axios, { AxiosResponse } from "axios";
import { DataLine, DataValue } from "../model/AnalysisObject";
import { Context, getUser } from "../App";

export default class AnalysisService {
  static async refreshExchangeRates() {
    await axios.get("/api/analysis/refresh", {
      headers: {
        Authorization: `Bearer ${getUser()?.access_token}`,
      },
    });
  }

  static async categoryAnalysis(): Promise<DataValue[]> {
    const response: AxiosResponse<DataValue[]> = await axios.get(
      "/api/analysis/category",
      {
        headers: {
          Authorization: `Bearer ${getUser()?.access_token}`,
        },
        params: {
          accountId:
            Context.filter.accountId !== "-1"
              ? Context.filter.accountId
              : undefined,
          currency: Context.currency,
        },
      },
    );
    return response.data;
  }

  static async categoryYearlyAnalysis(): Promise<DataValue[]> {
    const response: AxiosResponse<DataValue[]> = await axios.get(
      "/api/analysis/category/yearly",
      {
        headers: {
          Authorization: `Bearer ${getUser()?.access_token}`,
        },
        params: {
          year: Context.filter.year,
          accountId:
            Context.filter.accountId !== "-1"
              ? Context.filter.accountId
              : undefined,
          currency: Context.currency,
        },
      },
    );
    return response.data;
  }

  static async categoryMonthlyAnalysis(): Promise<DataValue[]> {
    const response: AxiosResponse<DataValue[]> = await axios.get(
      "/api/analysis/category/monthly",
      {
        headers: {
          Authorization: `Bearer ${getUser()?.access_token}`,
        },
        params: {
          year: Context.filter.year,
          month: Context.filter.month + 1,
          accountId:
            Context.filter.accountId !== "-1"
              ? Context.filter.accountId
              : undefined,
          currency: Context.currency,
        },
      },
    );
    return response.data;
  }

  static async categoryYearlyMonthAnalysis(): Promise<DataValue[][]> {
    const response: AxiosResponse<DataValue[][]> = await axios.get(
      "/api/analysis/category/yearly/month",
      {
        headers: {
          Authorization: `Bearer ${getUser()?.access_token}`,
        },
        params: {
          year: Context.filter.year,
          accountId:
            Context.filter.accountId !== "-1"
              ? Context.filter.accountId
              : undefined,
          currency: Context.currency,
        },
      },
    );
    return response.data;
  }

  static async netWorthInstant(): Promise<DataValue[]> {
    const response: AxiosResponse<DataValue[]> = await axios.get(
      `/api/analysis/netWorth`,
      {
        headers: {
          Authorization: `Bearer ${getUser()?.access_token}`,
        },
        params: {
          currency: Context.currency,
        },
      },
    );
    return response.data;
  }

  static async netWorthAnalysis(): Promise<DataLine[]> {
    const response: AxiosResponse<DataLine[]> = await axios.get(
      `/api/analysis/summary/netWorth`,
      {
        headers: {
          Authorization: `Bearer ${getUser()?.access_token}`,
        },
        params: {
          currency: Context.currency,
        },
      },
    );
    return response.data;
  }

  static async netWorthYearlyAnalysis(): Promise<DataLine[]> {
    const response: AxiosResponse<DataLine[]> = await axios.get(
      `/api/analysis/summary/netWorth/yearly`,
      {
        headers: {
          Authorization: `Bearer ${getUser()?.access_token}`,
        },
        params: {
          year: Context.filter.year,
          currency: Context.currency,
        },
      },
    );
    return response.data;
  }

  static async incomeExpenseAnalysis(): Promise<DataValue[][]> {
    const response: AxiosResponse<DataValue[][]> = await axios.get(
      `/api/analysis/summary/incomeExpense`,
      {
        headers: {
          Authorization: `Bearer ${getUser()?.access_token}`,
        },
        params: {
          year: Context.filter.year,
          accountId:
            Context.filter.accountId !== "-1"
              ? Context.filter.accountId
              : undefined,
          currency: Context.currency,
        },
      },
    );
    return response.data;
  }
}
