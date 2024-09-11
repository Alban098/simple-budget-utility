import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { format } from "../../model/Currency";
import { DataValue } from "../../model/AnalysisObject";

interface Props {
  netWorth: DataValue[];
}

export default function NetWorthCard({ netWorth }: Props) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box
      sx={{
        mt: "25px",
        p: "0 30px",
        display: "flex ",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {netWorth.map((account) => {
        return (
          <Box key={account.label}>
            <Typography
              variant="h3"
              fontWeight="600"
              color={
                account.label == "Total"
                  ? colors.redAccent[400]
                  : colors.blueAccent[300]
              }
            >
              {account.label}
            </Typography>
            <Typography
              variant="h4"
              fontWeight="bold"
              color={colors.greenAccent[500]}
            >
              {format(account.value)}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
