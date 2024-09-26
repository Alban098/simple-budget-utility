import Header from "../../component/Header";
import { Alert, Box, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Await, useLoaderData } from "react-router-dom";
import { tokens } from "../../theme";
import AnalysisService from "../../service/AnalysisService";
import { DataLine, DataValue } from "../../model/AnalysisObject";
import IncomeExpenseCard from "../../component/card/IncomeExpenseCard";
import NetWorthGraphCard from "../../component/card/NetWorthGraphCard";
import NetWorthCard from "../../component/card/NetWorthCard";
import { Context } from "../../App";
import { Suspense } from "react";
import LoadingCard from "../../component/card/LoadingCard";

interface LoaderData {
  netWorthPromise: Promise<DataValue[]>;
  netWorthAllTimePromise: Promise<DataLine[]>;
  netWorkYearlyPromise: Promise<DataLine[]>;
  incomesExpensesPromise: Promise<DataValue[][]>;
}

export function loader(): LoaderData {
  return {
    netWorthPromise: AnalysisService.netWorthInstant(),
    netWorthAllTimePromise: AnalysisService.netWorthAnalysis(),
    netWorkYearlyPromise: AnalysisService.netWorthYearlyAnalysis(),
    incomesExpensesPromise: AnalysisService.incomeExpenseAnalysis(),
  };
}

function formatAllTimeAxis(line?: DataLine): string[] | undefined {
  if (line != null) {
    const keys = [] as string[];
    if (line.data.length <= 12) {
      line.data.forEach((value) => {
        keys.push(value.label);
      });
    } else {
      line.data.forEach((value) => {
        if (!Number.isNaN(parseInt(value.label))) {
          keys.push(value.label);
        }
      });
    }
    return keys;
  }
  return undefined;
}

function formatYearlyTimeAxis(line?: DataLine): string[] | undefined {
  if (line != null) {
    const keys = [] as string[];
    line.data.forEach((value) => {
      if (
        !Number.isNaN(parseInt(value.label)) &&
        parseInt(value.label) % 10 === 0
      ) {
        keys.push(value.label);
      }
    });
    return keys;
  }
  return undefined;
}

export default function Dashboard() {
  const {
    netWorthPromise,
    netWorthAllTimePromise,
    netWorkYearlyPromise,
    incomesExpensesPromise,
  } = useLoaderData() as LoaderData;

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px 40px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Dashboard" subtitle="Finance reporting" />
      </Box>
      <Grid container spacing={2}>
        <Grid
          size={{ sm: 12 }}
          sx={{
            height: "100px",
            backgroundColor: colors.primary[400],
          }}
        >
          <Suspense fallback={<LoadingCard />}>
            <Await
              resolve={netWorthPromise}
              errorElement={
                <Alert severity="error">Error loading Data from API</Alert>
              }
            >
              {(netWorth: DataValue[]) => <NetWorthCard netWorth={netWorth} />}
            </Await>
          </Suspense>
        </Grid>
        <Grid
          size={{ lg: 12, xl: 6 }}
          sx={{
            height: "450px",
            backgroundColor: colors.primary[400],
          }}
        >
          <Suspense fallback={<LoadingCard />}>
            <Await
              resolve={netWorthAllTimePromise}
              errorElement={
                <Alert severity="error">Error loading Data from API</Alert>
              }
            >
              {(netWorthAllTime: DataLine[]) => (
                <NetWorthGraphCard
                  period="All time"
                  subtitle="By month"
                  analysis={netWorthAllTime}
                  axisLabels={formatAllTimeAxis(
                    netWorthAllTime.find((l) => l.label === "Total"),
                  )}
                />
              )}
            </Await>
          </Suspense>
        </Grid>
        <Grid
          size={{ lg: 12, xl: 6 }}
          sx={{
            height: "450px",
            backgroundColor: colors.primary[400],
          }}
        >
          <Suspense fallback={<LoadingCard />}>
            <Await
              resolve={netWorkYearlyPromise}
              errorElement={
                <Alert severity="error">Error loading Data from API</Alert>
              }
            >
              {(netWorkYearly: DataLine[]) => (
                <NetWorthGraphCard
                  analysis={netWorkYearly}
                  period={Context.filter.year.toString()}
                  subtitle="By week"
                  axisLabels={formatYearlyTimeAxis(
                    netWorkYearly.find((l) => l.label === "Total"),
                  )}
                />
              )}
            </Await>
          </Suspense>
        </Grid>
        <Grid
          size={{ xs: 12 }}
          sx={{
            height: "450px",
            backgroundColor: colors.primary[400],
          }}
        >
          <Suspense fallback={<LoadingCard />}>
            <Await
              resolve={incomesExpensesPromise}
              errorElement={
                <Alert severity="error">Error loading Data from API</Alert>
              }
            >
              {(incomesExpenses: DataValue[][]) => (
                <IncomeExpenseCard
                  year={Context.filter.year}
                  analysis={incomesExpenses}
                />
              )}
            </Await>
          </Suspense>
        </Grid>
      </Grid>
    </Box>
  );
}
