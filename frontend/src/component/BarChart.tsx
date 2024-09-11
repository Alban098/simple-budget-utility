import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { BarDatum, ResponsiveBar } from "@nivo/bar";
import dayjs from "dayjs";
import { DataValue } from "../model/AnalysisObject";

type Props = {
  analysis: DataValue[][];
  title: string;
  subtitle: string;
};

function extractKeys(analysis: DataValue[][]): {
  keys: string[];
  data: BarDatum[];
} {
  const data: any[] = [];
  const keys: string[] = [];
  analysis.forEach((monthlyData, month) => {
    const monthEntry = {} as any;
    monthEntry.month = dayjs().month(month).format("MMM");
    monthlyData.forEach((entry) => {
      monthEntry[entry.label] = entry.value;
      if (keys.find((k) => k === entry.label) == undefined) {
        keys.push(entry.label);
      }
    });
    data.push(monthEntry);
  });
  return { keys, data };
}

export default function BarChart({ analysis, title, subtitle }: Props) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { keys, data } = extractKeys(analysis);
  return (
    <>
      <Box
        sx={{
          mt: "25px",
          p: "0 30px",
          display: "flex ",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="600" color={colors.grey[100]}>
            {title}
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
      <ResponsiveBar
        data={data}
        keys={keys}
        motionConfig="stiff"
        valueFormat=">-d"
        enableTotals={true}
        indexBy="month"
        margin={{ top: 30, right: 150, bottom: 85, left: 70 }}
        padding={0.4}
        colors={{ scheme: "category10" }}
        innerPadding={1}
        groupMode="grouped"
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        axisBottom={{ tickSize: 0, tickPadding: 5, legendPosition: "middle" }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 10,
          tickRotation: 25,
          legendPosition: "middle",
        }}
        enableLabel={false}
        labelSkipWidth={7}
        labelSkipHeight={12}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 120,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [{ on: "hover", style: { itemOpacity: 1 } }],
          },
        ]}
        theme={{
          text: {
            fontSize: 13,
            fill: colors.primary[100],
            outlineWidth: 0,
            outlineColor: "transparent",
          },
          grid: { line: { stroke: colors.grey[700], strokeWidth: 1 } },
          axis: {
            domain: { line: { stroke: colors.grey[100] } },
            legend: { text: { fill: colors.grey[100] } },
            ticks: {
              line: { stroke: colors.grey[100], strokeWidth: 1 },
              text: { fill: colors.grey[100] },
            },
          },
          legends: { text: { fill: colors.grey[100] } },
          tooltip: {
            container: {
              background: "#EEEEEE",
              color: "#000000",
              fontSize: 12,
            },
          },
        }}
        role="application"
      />
    </>
  );
}
