import { ResponsivePie } from "@nivo/pie";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { DataValue } from "../../model/AnalysisObject";

interface Props {
  data: DataValue[];
}

export default function PieChart({ data }: Props) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <ResponsivePie
      data={data}
      id="label"
      valueFormat=">-d"
      margin={{ top: 35, right: 110, bottom: 25, left: 110 }}
      innerRadius={0.5}
      padAngle={0.7}
      activeOuterRadiusOffset={8}
      colors={{ scheme: "category10" }}
      borderWidth={3}
      motionConfig="stiff"
      transitionMode="startAngle"
      arcLinkLabelsSkipAngle={5}
      arcLinkLabelsStraightLength={20}
      arcLinkLabelsTextColor={colors.primary[100]}
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      enableArcLabels={false}
      arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
      theme={{
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
    />
  );
}
