import Header from "../../component/Header";
import { Box, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React from "react";
import PieChart from "../../component/PieChart";
import dayjs from "dayjs";
import { useLoaderData } from "react-router-dom";
import { tokens } from "../../theme";
import BarChart from "../../component/BarChart";
import AnalysisService from "../../service/AnalysisService";
import MonthSelector from "../../component/MonthSelector";
import { DataValue } from "../../model/AnalysisObject";
import { format } from "../../constant/Currency";
import { Account } from "../../model/Account";
import AccountService from "../../service/AccountService";
import AccountSelector from "../../component/AccountSelector";

type LoaderData = {
  total: DataValue[];
  yearly: DataValue[];
  monthly: DataValue[];
  analysis: DataValue[][];
  accounts: Account[];
};

export async function loader({
  params,
}: {
  params: { year?: number; month?: number; accountId?: string };
}) {
  const year = params.year ? params.year : dayjs().year();
  const month = params.month ? params.month : dayjs().month();
  const accountId = params.accountId ? params.accountId : "*";
  return {
    total: await AnalysisService.categoryAnalysis(accountId),
    yearly: await AnalysisService.categoryYearlyAnalysis(accountId, year),
    monthly: await AnalysisService.categoryMonthlyAnalysis(
      accountId,
      year,
      month,
    ),
    analysis: await AnalysisService.categoryYearlyMonthAnalysis(
      accountId,
      year,
    ),
    accounts: await AccountService.findAll(),
  };
}

function computeTotals(
  total: DataValue[],
  yearly: DataValue[],
  monthly: DataValue[],
) {
  let totalExpenses = 0;
  let yearlyExpenses = 0;
  let monthlyExpenses = 0;
  total.forEach((i) => (totalExpenses += i.value ? i.value : 0));
  yearly.forEach((i) => (yearlyExpenses += i.value ? i.value : 0));
  monthly.forEach((i) => (monthlyExpenses += i.value ? i.value : 0));
  return { totalExpenses, yearlyExpenses, monthlyExpenses };
}

function extractParams() {
  const queryParameters = new URLSearchParams(window.location.search);
  const yearParam = queryParameters.get("year");
  const monthParam = queryParameters.get("month");
  const accountId = queryParameters.get("accountId") || "*";
  const year = yearParam == null ? dayjs().year() : parseInt(yearParam);
  const month = monthParam == null ? dayjs().month() : parseInt(monthParam);
  return { year, month, accountId };
}

export default function CategoryAnalysis() {
  const { year, month, accountId } = extractParams();
  const { total, yearly, monthly, analysis, accounts } =
    useLoaderData() as LoaderData;
  const { totalExpenses, yearlyExpenses, monthlyExpenses } = computeTotals(
    total,
    yearly,
    monthly,
  );

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (accounts.find((a) => a.name === "All") == undefined) {
    accounts.push(new Account("*", "All"));
  }

  return (
    <Box m="20px 40px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Categories" subtitle="Summary" />
        <AccountSelector accountId={accountId} accounts={accounts} />
        <MonthSelector year={year} month={month} />
      </Box>
      <Grid container spacing={2}>
        <Grid
          size={{ md: 12, lg: 4 }}
          sx={{
            height: "450px",
            backgroundColor: colors.primary[400],
            pb: "25px",
          }}
        >
          <PieChart
            title={
              "Expenses " + dayjs().year(year).month(month).format("MMMM YYYY")
            }
            subtitle={format(monthlyExpenses)}
            data={monthly}
          />
        </Grid>
        <Grid
          size={{ md: 12, lg: 4 }}
          sx={{
            height: "450px",
            backgroundColor: colors.primary[400],
            pb: "25px",
          }}
        >
          <PieChart
            title={"Expenses for " + year}
            subtitle={format(yearlyExpenses)}
            data={yearly}
          />
        </Grid>
        <Grid
          size={{ md: 12, lg: 4 }}
          sx={{
            height: "450px",
            backgroundColor: colors.primary[400],
            pb: "25px",
          }}
        >
          <PieChart
            title="Total Expenses"
            subtitle={format(totalExpenses)}
            data={total}
          />
        </Grid>
        <Grid
          size={{ xs: 12 }}
          sx={{
            height: "350px",
            backgroundColor: colors.primary[400],
            pb: "25px",
          }}
        >
          <BarChart
            title="Expenses by categories"
            subtitle={year.toString()}
            analysis={analysis}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
