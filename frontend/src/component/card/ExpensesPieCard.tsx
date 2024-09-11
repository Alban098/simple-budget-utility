import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { DataValue } from "../../model/AnalysisObject";
import PieChart from "../chart/PieChart";
import { format } from "../../model/Currency";

const headerHeight = 50;
const marginTop = 25;

interface Props {
  data: DataValue[];
  period: string;
}

function computeTotal(data: DataValue[]): number {
  let total = 0;
  data.forEach((i) => (total += i.value ? i.value : 0));
  return total;
}

export default function ExpensesPieCard({ data, period }: Props) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <>
      <Box
        sx={{
          mt: `${marginTop}px`,
          p: "0 30px",
          display: "flex ",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ height: `${headerHeight}px` }}>
          <Typography variant="h4" fontWeight="600" color={colors.grey[100]}>
            Expenses - {period}
          </Typography>
          <Typography
            variant="h3"
            fontWeight="bold"
            color={colors.greenAccent[500]}
          >
            {format(computeTotal(data))}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          height: `calc(100% - ${headerHeight + marginTop}px)`,
        }}
      >
        <PieChart data={data} />
      </Box>
    </>
  );
}
