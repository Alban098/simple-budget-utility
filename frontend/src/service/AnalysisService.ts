import axios, { AxiosResponse } from "axios";
import { DataLine, DataValue } from "../model/AnalysisObject";
import { Context } from "../App";

export default class AnalysisService {
  static async refreshExchangeRates(token: string) {
    await axios.get("/api/analysis/refresh", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  static async categoryAnalysis(token: string): Promise<DataValue[]> {
    const response: AxiosResponse<DataValue[]> = await axios.get(
      "http://localhost:8080/api/analysis/category",
      {
        headers: {
          Authorization: `Bearer ${token}`,
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

  static async categoryYearlyAnalysis(token: string): Promise<DataValue[]> {
    const response: AxiosResponse<DataValue[]> = await axios.get(
      "http://localhost:8080/api/analysis/category/yearly",
      {
        headers: {
          Authorization: `Bearer ${token}`,
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

  static async categoryMonthlyAnalysis(token: string): Promise<DataValue[]> {
    const response: AxiosResponse<DataValue[]> = await axios.get(
      "http://localhost:8080/api/analysis/category/monthly",
      {
        headers: {
          Authorization: `Bearer ${token}`,
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

  static async categoryYearlyMonthAnalysis(
    token: string,
  ): Promise<DataValue[][]> {
    const response: AxiosResponse<DataValue[][]> = await axios.get(
      "http://localhost:8080/api/analysis/category/yearly/month",
      {
        headers: {
          Authorization: `Bearer ${token}`,
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

  static async netWorthInstant(token: string): Promise<DataValue[]> {
    const response: AxiosResponse<DataValue[]> = await axios.get(
      `http://localhost:8080/api/analysis/netWorth`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          currency: Context.currency,
        },
      },
    );
    return response.data;
  }

  static async netWorthAnalysis(token: string): Promise<DataLine[]> {
    const response: AxiosResponse<DataLine[]> = await axios.get(
      `http://localhost:8080/api/analysis/summary/netWorth`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          currency: Context.currency,
        },
      },
    );
    return response.data;
  }

  static async netWorthYearlyAnalysis(token: string): Promise<DataLine[]> {
    const response: AxiosResponse<DataLine[]> = await axios.get(
      `http://localhost:8080/api/analysis/summary/netWorth/yearly`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          year: Context.filter.year,
          currency: Context.currency,
        },
      },
    );
    return response.data;
  }

  static async incomeExpenseAnalysis(token: string): Promise<DataValue[][]> {
    const response: AxiosResponse<DataValue[][]> = await axios.get(
      `http://localhost:8080/api/analysis/summary/incomeExpense`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
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
