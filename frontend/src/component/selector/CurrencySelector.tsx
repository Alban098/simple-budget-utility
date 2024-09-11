import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useLocation, useSubmit } from "react-router-dom";
import { Context } from "../../App";
import { Currency, getSymbol } from "../../model/Currency";

export default function CurrencySelector() {
  const submit = useSubmit();
  const location = useLocation();
  return (
    <ToggleButtonGroup
      sx={{ display: "flex", pr: "20px" }}
      value={Context.currency}
      exclusive
      onChange={(_e, value) => {
        if (value != null) {
          Context.currency = Currency[value as keyof typeof Currency];
          submit(null, {
            relative: "path",
            action: location.pathname,
          });
        }
      }}
      aria-label="Currency"
    >
      {Object.values(Currency).map((currency) => {
        return (
          <ToggleButton
            key={currency}
            sx={{ fontSize: "16px", width: "60px", height: "100%" }}
            value={currency}
          >
            {getSymbol(currency)}
          </ToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );
}
