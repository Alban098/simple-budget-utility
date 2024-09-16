import axios, { AxiosResponse } from "axios";
import { DataLine, DataValue } from "../model/AnalysisObject";
import { Context } from "../App";

export default class AnalysisService {
  static async categoryAnalysis(): Promise<DataValue[]> {
    const response: AxiosResponse<DataValue[]> = await axios.get(
      "http://localhost:8080/api/analysis/category",
      {
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
      "http://localhost:8080/api/analysis/category/yearly",
      {
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
      "http://localhost:8080/api/analysis/category/monthly",
      {
        params: {
          year: Context.filter.year,
          month: Context.filter.month,
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
      "http://localhost:8080/api/analysis/category/yearly/month",
      {
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
      `http://localhost:8080/api/analysis/netWorth`,
      {
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

  static async netWorthAnalysis(): Promise<DataLine[]> {
    const response: AxiosResponse<DataLine[]> = await axios.get(
      `http://localhost:8080/api/analysis/summary/netWorth`,
      {
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

  static async netWorthYearlyAnalysis(): Promise<DataLine[]> {
    const response: AxiosResponse<DataLine[]> = await axios.get(
      `http://localhost:8080/api/analysis/summary/netWorth/yearly`,
      {
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

  static async incomeExpenseAnalysis(): Promise<DataValue[][]> {
    const response: AxiosResponse<DataValue[][]> = await axios.get(
      `http://localhost:8080/api/analysis/summary/incomeExpense`,
      {
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
