import { Box, IconButton, useTheme } from "@mui/material";
import { ColorModeContext, tokens } from "../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import AccountSelector from "./selector/AccountSelector";
import MonthSelector from "./selector/MonthSelector";
import YearSelector from "./selector/YearSelector";
import { useLoaderData } from "react-router-dom";
import { Account } from "../model/Account";
import { useContext } from "react";
import CurrencySelector from "./selector/CurrencySelector";

export default function Topbar() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const accounts = useLoaderData() as Account[];
  if (accounts.find((a) => a.name === "All Accounts") == undefined) {
    accounts.push({ id: "-1", name: "All Accounts" } as Account);
  }
  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: colors.primary[900],
        justifyContent: "space-between",
        p: 2,
      }}
    >
      <Box sx={{ display: "flex" }}>
        <Box sx={{ display: "flex", pr: "40px" }}>
          <AccountSelector accounts={accounts} />
          <MonthSelector />
          <YearSelector />
        </Box>
      </Box>

      <CurrencySelector />

      <Box sx={{ display: "flex", pr: "20px" }}>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
      </Box>
    </Box>
  );
}
