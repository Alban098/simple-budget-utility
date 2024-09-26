import Header from "../../component/Header";
import { Alert, Box, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid2";
import dayjs from "dayjs";
import { Await, useLoaderData } from "react-router-dom";
import { tokens } from "../../theme";
import AnalysisService from "../../service/AnalysisService";
import { DataValue } from "../../model/AnalysisObject";
import ExpensesPieCard from "../../component/card/ExpensesPieCard";
import CategoryExpensesCard from "../../component/card/CategoryExpensesCard";
import { Context } from "../../App";
import LoadingCard from "../../component/card/LoadingCard";
import { Suspense } from "react";

interface LoaderData {
  totalPromise: Promise<DataValue[]>;
  yearlyPromise: Promise<DataValue[]>;
  monthlyPromise: Promise<DataValue[]>;
  analysisPromise: Promise<DataValue[][]>;
}

export function loader(): LoaderData {
  return {
    totalPromise: AnalysisService.categoryAnalysis(),
    yearlyPromise: AnalysisService.categoryYearlyAnalysis(),
    monthlyPromise: AnalysisService.categoryMonthlyAnalysis(),
    analysisPromise: AnalysisService.categoryYearlyMonthAnalysis(),
  };
}

export default function CategoryAnalysis() {
  const { totalPromise, yearlyPromise, monthlyPromise, analysisPromise } =
    useLoaderData() as LoaderData;

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px 40px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Categories" subtitle="Summary" />
      </Box>
      <Grid container spacing={2}>
        <Grid
          size={{ md: 12, lg: 4 }}
          sx={{
            height: "460px",
            backgroundColor: colors.primary[400],
            pb: "25px",
          }}
        >
          <Suspense fallback={<LoadingCard />}>
            <Await
              resolve={monthlyPromise}
              errorElement={
                <Alert severity="error">Error loading Data from API</Alert>
              }
            >
              {(montlhy: DataValue[]) => (
                <ExpensesPieCard
                  period={dayjs()
                    .year(Context.filter.year)
                    .month(Context.filter.month)
                    .format("MMMM YYYY")}
                  data={montlhy}
                />
              )}
            </Await>
          </Suspense>
        </Grid>
        <Grid
          size={{ md: 12, lg: 4 }}
          sx={{
            height: "460px",
            backgroundColor: colors.primary[400],
            pb: "25px",
          }}
        >
          <Suspense fallback={<LoadingCard />}>
            <Await
              resolve={yearlyPromise}
              errorElement={
                <Alert severity="error">Error loading Data from API</Alert>
              }
            >
              {(yearly: DataValue[]) => (
                <ExpensesPieCard
                  period={Context.filter.year.toString()}
                  data={yearly}
                />
              )}
            </Await>
          </Suspense>
        </Grid>
        <Grid
          size={{ md: 12, lg: 4 }}
          sx={{
            height: "460px",
            backgroundColor: colors.primary[400],
            pb: "25px",
          }}
        >
          <Suspense fallback={<LoadingCard />}>
            <Await
              resolve={totalPromise}
              errorElement={
                <Alert severity="error">Error loading Data from API</Alert>
              }
            >
              {(total: DataValue[]) => (
                <ExpensesPieCard period="All time" data={total} />
              )}
            </Await>
          </Suspense>
        </Grid>
        <Grid
          size={{ xs: 12 }}
          sx={{
            height: "570px",
            backgroundColor: colors.primary[400],
          }}
        >
          <Suspense fallback={<LoadingCard />}>
            <Await
              resolve={analysisPromise}
              errorElement={
                <Alert severity="error">Error loading Data from API</Alert>
              }
            >
              {(analysis: DataValue[][]) => (
                <CategoryExpensesCard
                  year={Context.filter.year}
                  analysis={analysis}
                />
              )}
            </Await>
          </Suspense>
        </Grid>
      </Grid>
    </Box>
  );
}
