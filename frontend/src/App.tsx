import { ColorModeContext, useMode } from "./theme";
import { Box, CssBaseline, Theme, ThemeProvider } from "@mui/material";
import Topbar from "./component/Topbar";
import Sidebar from "./component/Sidebar";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Accounts, { loader as accountLoader } from "./scenes/account";
import Transaction, { loader as transactionLoader } from "./scenes/transaction";
import AccountEdit, {
  loader as editAccountLoader,
  action as editAccountAction,
} from "./scenes/account/edit";
import TransactionEdit, {
  loader as transactionEditLoader,
  action as transactionEditAction,
} from "./scenes/transaction/edit";
import CategoryCreate, {
  action as categoryCreateAction,
} from "./scenes/category/create";
import CategoryAnalysis, {
  loader as categoryAnalysisLoader,
} from "./scenes/analysis/categories";
import Dashboard, { loader as summaryAnalysisLoader } from "./scenes/dashboard";
import AccountCreate, {
  action as createAccountAction,
} from "./scenes/account/create";
import TransactionCreate, {
  loader as transactionCreateLoader,
  action as createTransactionAction,
} from "./scenes/transaction/create";
import dayjs from "dayjs";
import { Currency } from "./model/Currency";

export const Context = {
  filter: {
    accountId: "-1",
    month: dayjs().month(),
    year: dayjs().year(),
  },
  currency: Currency.EUR,
};

const router = createBrowserRouter([
  {
    element: <Layout />,
    loader: accountLoader,
    children: [
      {
        path: "/",
        element: <Dashboard />,
        loader: summaryAnalysisLoader,
      },
      { path: "/account", element: <Accounts />, loader: accountLoader },
      {
        path: "/account/create",
        element: <AccountCreate />,
        action: createAccountAction,
      },
      {
        path: "/account/:id/edit",
        element: <AccountEdit />,
        loader: editAccountLoader,
        action: editAccountAction,
      },
      {
        path: "/transaction",
        element: <Transaction />,
        loader: transactionLoader,
      },
      {
        path: "/transaction/create",
        element: <TransactionCreate />,
        loader: transactionCreateLoader,
        action: createTransactionAction,
      },
      {
        path: "/transaction/:id/edit",
        element: <TransactionEdit />,
        loader: transactionEditLoader,
        action: transactionEditAction,
      },
      {
        path: "/category",
        element: <CategoryCreate />,
        action: categoryCreateAction,
      },
      {
        path: "/analysis/summary",
        element: <Dashboard />,
        loader: summaryAnalysisLoader,
      },
      {
        path: "/analysis/categories",
        element: <CategoryAnalysis />,
        loader: categoryAnalysisLoader,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

function Layout() {
  const [theme, colorMode] = useMode() as [Theme, any];

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar />
          <main
            className="content"
            style={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Topbar />
            <Box sx={{ flex: 1, overflow: "scroll" }}>
              <Outlet />
            </Box>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
