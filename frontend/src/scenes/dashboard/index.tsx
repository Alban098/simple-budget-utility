import Header from "../../component/Header";
import { Box, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useLoaderData } from "react-router-dom";
import { tokens } from "../../theme";
import AnalysisService from "../../service/AnalysisService";
import { DataLine, DataValue } from "../../model/AnalysisObject";
import IncomeExpenseCard from "../../component/card/IncomeExpenseCard";
import NetWorthGraphCard from "../../component/card/NetWorthGraphCard";
import NetWorthCard from "../../component/card/NetWorthCard";
import { Context } from "../../App";

interface LoaderData {
  netWorth: DataValue[];
  netWorthAllTime: DataLine[];
  netWorkYearly: DataLine[];
  incomesExpenses: DataValue[][];
}

export async function loader(): Promise<LoaderData> {
  return {
    netWorth: await AnalysisService.netWorthInstant(),
    netWorthAllTime: await AnalysisService.netWorthAnalysis(),
    netWorkYearly: await AnalysisService.netWorthYearlyAnalysis(),
    incomesExpenses: await AnalysisService.incomeExpenseAnalysis(),
  };
}

function formatAllTimeAxis(line?: DataLine): string[] | undefined {
  if (line != null) {
    const keys = [] as string[];
    line.data.forEach((value) => {
      if (!Number.isNaN(parseInt(value.label))) {
        keys.push(value.label);
      }
    });
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
  const { netWorth, netWorthAllTime, netWorkYearly, incomesExpenses } =
    useLoaderData() as LoaderData;

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
          <NetWorthCard netWorth={netWorth} />
        </Grid>
        <Grid
          size={{ lg: 12, xl: 6 }}
          sx={{
            height: "400px",
            backgroundColor: colors.primary[400],
          }}
        >
          <NetWorthGraphCard
            period="All time"
            subtitle="By month"
            analysis={netWorthAllTime}
            axisLabels={formatAllTimeAxis(
              netWorthAllTime.find((l) => l.label === "Total"),
            )}
          />
        </Grid>
        <Grid
          size={{ lg: 12, xl: 6 }}
          sx={{
            height: "400px",
            backgroundColor: colors.primary[400],
          }}
        >
          <NetWorthGraphCard
            analysis={netWorkYearly}
            period={Context.filter.year.toString()}
            subtitle="By week"
            axisLabels={formatYearlyTimeAxis(
              netWorkYearly.find((l) => l.label === "Total"),
            )}
          />
        </Grid>
        <Grid
          size={{ xs: 12 }}
          sx={{
            height: "400px",
            backgroundColor: colors.primary[400],
          }}
        >
          <IncomeExpenseCard
            year={Context.filter.year}
            analysis={incomesExpenses}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
