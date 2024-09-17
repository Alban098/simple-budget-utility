import { Box, IconButton, useTheme } from "@mui/material";
import { ColorModeContext, tokens } from "../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import AccountSelector from "./selector/AccountSelector";
import MonthSelector from "./selector/MonthSelector";
import YearSelector from "./selector/YearSelector";
import { Await, useLoaderData } from "react-router-dom";
import { Account } from "../model/Account";
import { Suspense, useContext } from "react";
import CurrencySelector from "./selector/CurrencySelector";
import LoadingCard from "./card/LoadingCard";
import AnalysisService from "../service/AnalysisService";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Context } from "../App";

interface LoaderData {
  accountsPromise: Promise<Account[]>;
}

async function refreshExchangeRates() {
  await AnalysisService.refreshExchangeRates(Context.apiToken);
}

export default function Topbar() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { accountsPromise } = useLoaderData() as LoaderData;
  accountsPromise.then((accounts: Account[]) => {
    if (accounts.find((a) => a.name === "All Accounts") == undefined) {
      accounts.push({ id: "-1", name: "All Accounts" } as Account);
    }
  });

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
          <Suspense fallback={<LoadingCard />}>
            <Await
              resolve={accountsPromise}
              errorElement={
                <Alert severity="error">Error loading Data from API</Alert>
              }
            >
              {(accounts: Account[]) => <AccountSelector accounts={accounts} />}
            </Await>
          </Suspense>

          <MonthSelector />
          <YearSelector />
        </Box>
      </Box>

      <CurrencySelector />
      <Box sx={{ display: "flex", pr: "20px" }}>
        <IconButton onClick={refreshExchangeRates}>
          <RefreshIcon />
        </IconButton>
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
