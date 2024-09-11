import { Amount } from "../model/Amount";
import { Box, Typography } from "@mui/material";
import { format } from "../model/Currency";

interface Props {
  amount?: Amount;
  showZero?: boolean;
}

export default function CurrencyChip({ amount, showZero = true }: Props) {
  if (amount != null && (showZero || amount.value !== 0)) {
    return (
      <Box
        sx={{
          width: "fit-content",
          m: "2px auto",
          p: "5px 15px",
          display: "inline-block",
          justifyContent: "right",
          backgroundColor: amount.value < 0 ? "#f84a4a" : "#1b7b1b",
          borderRadius: "15px",
        }}
      >
        <Typography fontSize="14px" color="#e0e0e0" sx={{ ml: "5px" }}>
          {format(amount.value, amount.currency)}
        </Typography>
      </Box>
    );
  }
  return <></>;
}
