import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { Datum, ResponsiveLine, Serie } from "@nivo/line";
import { DataLine } from "../model/AnalysisObject";

type Props = {
  analysis: DataLine[];
  formatTick: boolean;
  title: string;
  subtitle: string;
};

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

export default function LineChart({
  analysis,
  title,
  subtitle,
  formatTick = false,
}: Props) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const data = formatData(analysis);
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
      <ResponsiveLine
        data={data}
        margin={{ top: 40, right: 40, bottom: 90, left: 70 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: true,
          reverse: false,
        }}
        yFormat=">-d"
        curve="natural"
        axisBottom={{
          format: (tick) => (formatTick && tick % 5 != 0 ? "" : tick),
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
        legends={[
          {
            anchor: "top-right",
            direction: "row",
            justify: false,
            translateX: 7,
            translateY: -38,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 88,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
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
        motionConfig="stiff"
      />
    </>
  );
}
