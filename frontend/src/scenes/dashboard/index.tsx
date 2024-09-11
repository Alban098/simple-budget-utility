import Header from "../../component/Header";
import { Box, Typography, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid2";
import dayjs from "dayjs";
import { useLoaderData } from "react-router-dom";
import { tokens } from "../../theme";
import AnalysisService from "../../service/AnalysisService";
import YearSelector from "../../component/YearSelector";
import { DataLine, DataValue } from "../../model/AnalysisObject";
import LineChart from "../../component/LineChart";
import BarChart from "../../component/BarChart";
import { format } from "../../constant/Currency";
import { Account } from "../../model/Account";
import AccountService from "../../service/AccountService";
import AccountSelector from "../../component/AccountSelector";

type LoaderData = {
  netWorth: DataValue[];
  netWorthAllTime: DataLine[];
  netWorkYearly: DataLine[];
  incomesExpenses: DataValue[][];
  accounts: Account[];
};

export async function loader({
  params,
}: {
  params: { year?: number; accountId?: string };
}) {
  const year = params.year ? params.year : dayjs().year();
  const accountId = params.accountId ? params.accountId : "*";
  return {
    netWorth: await AnalysisService.netWorthInstant(accountId),
    netWorthAllTime: await AnalysisService.netWorthAnalysis(accountId),
    netWorkYearly: await AnalysisService.netWorthYearlyAnalysis(
      accountId,
      year,
    ),
    incomesExpenses: await AnalysisService.incomeExpenseAnalysis(
      accountId,
      year,
    ),
    accounts: await AccountService.findAll(),
  };
}

function extractParams() {
  const queryParameters = new URLSearchParams(window.location.search);
  const yearParam = queryParameters.get("year");
  const accountId = queryParameters.get("accountId") || "*";
  const year = yearParam == null ? dayjs().year() : parseInt(yearParam);
  return { year, accountId };
}

export default function Dashboard() {
  const { year, accountId } = extractParams();
  const {
    netWorth,
    netWorthAllTime,
    netWorkYearly,
    incomesExpenses,
    accounts,
  } = useLoaderData() as LoaderData;

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (accounts.find((a) => a.name === "All") == undefined) {
    accounts.push(new Account("*", "All"));
  }
  return (
    <Box m="20px 40px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Dashboard" subtitle="Finance reporting" />
        <AccountSelector accountId={accountId} accounts={accounts} />
        <YearSelector year={year} />
      </Box>
      <Grid container spacing={2}>
        <Grid
          size={{ sm: 12 }}
          sx={{
            height: "100px",
            backgroundColor: colors.primary[400],
            pb: "25px",
          }}
        >
          <Box
            sx={{
              mt: "25px",
              p: "0 30px",
              display: "flex ",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {netWorth.map((account) => {
              return (
                <Box>
                  <Typography
                    variant="h3"
                    fontWeight="600"
                    color={
                      account.label == "Total"
                        ? colors.redAccent[400]
                        : colors.blueAccent[300]
                    }
                  >
                    {account.label}
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color={colors.greenAccent[500]}
                  >
                    {format(account.value)}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Grid>
        <Grid
          size={{ lg: 12, xl: 6 }}
          sx={{
            height: "350px",
            backgroundColor: colors.primary[400],
            pb: "25px",
          }}
        >
          <LineChart
            title="Net Worth - All time"
            subtitle="By month"
            analysis={netWorthAllTime}
            formatTick={false}
          />
        </Grid>
        <Grid
          size={{ lg: 12, xl: 6 }}
          sx={{
            height: "350px",
            backgroundColor: colors.primary[400],
            pb: "25px",
          }}
        >
          <LineChart
            analysis={netWorkYearly}
            title={"Net Worth " + { year }}
            subtitle="By week"
            formatTick={true}
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
            title="Incomes and Expenses"
            subtitle={year.toString()}
            analysis={incomesExpenses}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
