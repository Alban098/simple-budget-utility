import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { DataValue } from "../../model/AnalysisObject";
import BarChart from "../chart/BarChart";

const headerHeight = 50;
const marginTop = 25;

interface Props {
  analysis: DataValue[][];
  year: number;
}

export default function IncomeExpenseCard({ analysis, year }: Props) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <>
      <Box
        sx={{
          mt: `${marginTop}px`,
          p: "0 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ height: `${headerHeight}px` }}>
          <Typography variant="h4" fontWeight="600" color={colors.grey[100]}>
            Incomes and Expenses
          </Typography>
          <Typography
            variant="h3"
            fontWeight="bold"
            color={colors.greenAccent[500]}
          >
            {year}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          height: `calc(100% - ${headerHeight + marginTop}px)`,
        }}
      >
        <BarChart analysis={analysis} />
      </Box>
    </>
  );
}
