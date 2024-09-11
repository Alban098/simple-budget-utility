import { ResponsivePie } from "@nivo/pie";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { DataValue } from "../model/AnalysisObject";
import React from "react";

type Props = {
  data: DataValue[];
  title: string;
  subtitle: string;
};

export default function PieChart({ data, title, subtitle }: Props) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
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
      <ResponsivePie
        data={data}
        id="label"
        valueFormat=">-d"
        margin={{ top: 50, right: 50, bottom: 100, left: 50 }}
        innerRadius={0.5}
        padAngle={0.7}
        activeOuterRadiusOffset={8}
        colors={{ scheme: "category10" }}
        borderWidth={3}
        motionConfig="stiff"
        transitionMode="startAngle"
        arcLinkLabelsSkipAngle={10}
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
    </>
  );
}
