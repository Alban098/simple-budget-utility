import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { DataLine } from "../../model/AnalysisObject";
import LineChart from "../chart/LineChart";

const headerHeight = 50;
const marginTop = 25;

interface Props {
  analysis: DataLine[];
  period: string;
  subtitle: string;
  axisLabels?: string[];
}

export default function NetWorthGraphCard({
  analysis,
  period,
  subtitle,
  axisLabels,
}: Props) {
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
            Net Worth - {period}
          </Typography>
          <Typography
            variant="h3"
            fontWeight="bold"
            color={colors.greenAccent[500]}
          >
            {subtitle}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          height: `calc(100% - ${headerHeight + marginTop}px)`,
        }}
      >
        <LineChart analysis={analysis} axisLabels={axisLabels} />
      </Box>
    </>
  );
}
