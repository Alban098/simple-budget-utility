import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { Datum, ResponsiveLine, Serie } from "@nivo/line";
import { DataLine } from "../../model/AnalysisObject";

interface Props {
  analysis: DataLine[];
  axisLabels?: string[];
}

function formatData(analysis: DataLine[]): Serie[] {
  const formatted: Serie[] = [];
  analysis.forEach((line) => {
    const entry = { id: line.label, data: [] as Datum[] };
    line.data.forEach((data) => {
      entry.data.push({ x: data.label, y: data.value });
    });
    formatted.push(entry);
  });
  return formatted;
}

export default function LineChart({ analysis, axisLabels }: Props) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const data = formatData(analysis);
  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 35, right: 40, bottom: 40, left: 80 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: false,
        reverse: false,
      }}
      yFormat=">-d"
      curve="linear"
      axisBottom={{
        tickValues: axisLabels,
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        truncateTickAt: 0,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
      }}
      enableGridX={false}
      colors={{ scheme: "category10" }}
      lineWidth={2}
      enablePoints={false}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabel="data.yFormatted"
      pointLabelYOffset={-12}
      enableSlices="x"
      enableTouchCrosshair={true}
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
      motionConfig="stiff"
    />
  );
}
