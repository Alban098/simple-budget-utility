import Header from "../../component/Header";
import { Box, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid2";
import dayjs from "dayjs";
import { useLoaderData } from "react-router-dom";
import { tokens } from "../../theme";
import AnalysisService from "../../service/AnalysisService";
import { DataValue } from "../../model/AnalysisObject";
import ExpensesPieCard from "../../component/card/ExpensesPieCard";
import CategoryExpensesCard from "../../component/card/CategoryExpensesCard";
import { Context } from "../../App";

interface LoaderData {
  total: DataValue[];
  yearly: DataValue[];
  monthly: DataValue[];
  analysis: DataValue[][];
}

export async function loader() {
  return {
    total: await AnalysisService.categoryAnalysis(Context.filter.accountId),
    yearly: await AnalysisService.categoryYearlyAnalysis(
      Context.filter.accountId,
      Context.filter.year,
    ),
    monthly: await AnalysisService.categoryMonthlyAnalysis(
      Context.filter.accountId,
      Context.filter.year,
      Context.filter.month,
    ),
    analysis: await AnalysisService.categoryYearlyMonthAnalysis(
      Context.filter.accountId,
      Context.filter.year,
    ),
  };
}

export default function CategoryAnalysis() {
  const { total, yearly, monthly, analysis } = useLoaderData() as LoaderData;

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
            height: "450px",
            backgroundColor: colors.primary[400],
            pb: "25px",
          }}
        >
          <ExpensesPieCard
            period={dayjs()
              .year(Context.filter.year)
              .month(Context.filter.month)
              .format("MMMM YYYY")}
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
          <ExpensesPieCard
            period={Context.filter.year.toString()}
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
          <ExpensesPieCard period="All time" data={total} />
        </Grid>
        <Grid
          size={{ xs: 12 }}
          sx={{
            height: "450px",
            backgroundColor: colors.primary[400],
          }}
        >
          <CategoryExpensesCard
            year={Context.filter.year}
            analysis={analysis}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
