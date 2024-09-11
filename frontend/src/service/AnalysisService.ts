import axios, { AxiosResponse } from "axios";
import {
  DataLine,
  DataIncomeExpense,
  DataValue,
} from "../model/AnalysisObject";

export default class AnalysisService {
  static async categoryAnalysis(accountId: string): Promise<DataValue[]> {
    const response: AxiosResponse<any, DataValue[]> = await axios.get(
      `http://localhost:8080/api/analysis/category?accountId=${accountId}`,
    );
    return response.data;
  }

  static async categoryYearlyAnalysis(
    accountId: string,
    month: number,
  ): Promise<DataValue[]> {
    const response: AxiosResponse<any, DataValue[]> = await axios.get(
      `http://localhost:8080/api/analysis/category/yearly?accountId=${accountId}&year=${month}`,
    );
    return response.data;
  }

  static async categoryMonthlyAnalysis(
    accountId: string,
    year: number,
    month: number,
  ): Promise<DataValue[]> {
    const response: AxiosResponse<any, DataValue[]> = await axios.get(
      `http://localhost:8080/api/analysis/category/monthly?accountId=${accountId}&year=${year}&month=${month}`,
    );
    return response.data;
  }

  static async categoryYearlyMonthAnalysis(
    accountId: string,
    year: number,
  ): Promise<Map<number, DataValue[][]>> {
    const response: AxiosResponse<any, DataValue[][]> = await axios.get(
      `http://localhost:8080/api/analysis/category/yearly/month?accountId=${accountId}&year=${year}`,
    );
    return response.data;
  }

  static async netWorthInstant(
    accountId: string,
  ): Promise<Map<number, DataValue[]>> {
    const response: AxiosResponse<any, DataLine[][]> = await axios.get(
      `http://localhost:8080/api/analysis/netWorth?accountId=${accountId}`,
    );
    return response.data;
  }

  static async netWorthAnalysis(
    accountId: string,
  ): Promise<Map<number, DataLine[]>> {
    const response: AxiosResponse<any, DataLine[][]> = await axios.get(
      `http://localhost:8080/api/analysis/summary/netWorth?accountId=${accountId}`,
    );
    return response.data;
  }

  static async netWorthYearlyAnalysis(
    accountId: string,
    year: number,
  ): Promise<Map<number, DataLine[]>> {
    const response: AxiosResponse<any, DataLine[]> = await axios.get(
      `http://localhost:8080/api/analysis/summary/netWorth/yearly?accountId=${accountId}&year=${year}`,
    );
    return response.data;
  }

  static async incomeExpenseAnalysis(
    accountId: string,
    year: number,
  ): Promise<Map<number, DataIncomeExpense[]>> {
    const response: AxiosResponse<any, DataIncomeExpense[]> = await axios.get(
      `http://localhost:8080/api/analysis/summary/incomeExpense?accountId=${accountId}&year=${year}`,
    );
    return response.data;
  }
}
