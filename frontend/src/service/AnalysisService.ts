import axios, { AxiosResponse } from "axios";
import {
  DataLine,
  DataIncomeExpense,
  DataValue,
} from "../model/AnalysisObject";

export default class AnalysisService {
  static async categoryAnalysis(accountId: string): Promise<DataValue[]> {
    const response: AxiosResponse<any, DataValue[]> = await axios.get(
      `http://localhost:8080/api/analysis/category` +
        (accountId != "-1" ? `?accountId=${accountId}` : ""),
    );
    return response.data;
  }

  static async categoryYearlyAnalysis(
    accountId: string,
    year: number,
  ): Promise<DataValue[]> {
    const response: AxiosResponse<any, DataValue[]> = await axios.get(
      `http://localhost:8080/api/analysis/category/yearly?year=${year}` +
        (accountId != "-1" ? `&accountId=${accountId}` : ""),
    );
    return response.data;
  }

  static async categoryMonthlyAnalysis(
    accountId: string,
    year: number,
    month: number,
  ): Promise<DataValue[]> {
    const response: AxiosResponse<any, DataValue[]> = await axios.get(
      `http://localhost:8080/api/analysis/category/monthly?year=${year}&month=${month}` +
        (accountId != "-1" ? `&accountId=${accountId}` : ""),
    );
    return response.data;
  }

  static async categoryYearlyMonthAnalysis(
    accountId: string,
    year: number,
  ): Promise<DataValue[][]> {
    const response: AxiosResponse<any, DataValue[][]> = await axios.get(
      `http://localhost:8080/api/analysis/category/yearly/month?year=${year}` +
        (accountId != "-1" ? `&accountId=${accountId}` : ""),
    );
    return response.data;
  }

  static async netWorthInstant(accountId: string): Promise<DataValue[]> {
    const response: AxiosResponse<any, DataLine[][]> = await axios.get(
      `http://localhost:8080/api/analysis/netWorth` +
        (accountId != "-1" ? `?accountId=${accountId}` : ""),
    );
    return response.data;
  }

  static async netWorthAnalysis(accountId: string): Promise<DataLine[]> {
    const response: AxiosResponse<any, DataLine[][]> = await axios.get(
      `http://localhost:8080/api/analysis/summary/netWorth` +
        (accountId != "-1" ? `?accountId=${accountId}` : ""),
    );
    return response.data;
  }

  static async netWorthYearlyAnalysis(
    accountId: string,
    year: number,
  ): Promise<DataLine[]> {
    const response: AxiosResponse<any, DataLine[]> = await axios.get(
      `http://localhost:8080/api/analysis/summary/netWorth/yearly?year=${year}` +
        (accountId != "-1" ? `&accountId=${accountId}` : ""),
    );
    return response.data;
  }

  static async incomeExpenseAnalysis(
    accountId: string,
    year: number,
  ): Promise<DataIncomeExpense[]> {
    const response: AxiosResponse<any, DataIncomeExpense[]> = await axios.get(
      `http://localhost:8080/api/analysis/summary/incomeExpense?year=${year}` +
        (accountId != "-1" ? `&accountId=${accountId}` : ""),
    );
    return response.data;
  }
}
