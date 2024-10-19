import axios, { AxiosResponse } from "axios";
import { getUser } from "../App";
import { ImportedStatement } from "../model/ImportedStatement";

export default class ImportedStatementService {
  static async findAll(): Promise<ImportedStatement[]> {
    const response: AxiosResponse<ImportedStatement[]> = await axios.get(
      "/api/statement/",
      {
        headers: {
          Authorization: `Bearer ${getUser()?.access_token}`,
        },
      },
    );
    const statements: ImportedStatement[] = [];
    response.data.forEach((statement: ImportedStatement) =>
      statements.push(this.convert(statement)),
    );
    return statements;
  }

  private static convert(statement: ImportedStatement): ImportedStatement {
    statement.date = new Date(statement.date);
    statement.firstTransactionDate = new Date(statement.firstTransactionDate);
    statement.lastTransactionDate = new Date(statement.lastTransactionDate);
    return statement;
  }
}
