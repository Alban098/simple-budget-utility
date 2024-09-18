import { ColorModeContext, useMode } from "./theme";
import {
  Box,
  CircularProgress,
  CssBaseline,
  Theme,
  ThemeProvider,
} from "@mui/material";
import Topbar from "./component/Topbar";
import Sidebar from "./component/Sidebar";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Accounts, {
  loader as accountLoader,
  loaderShallow as accountLoaderShallow,
} from "./scenes/account";
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
import { useAuth } from "react-oidc-context";
import TransactionImport, {
  action as importTransactionAction,
} from "./scenes/import/import";
import TransactionImportMap from "./scenes/import/map";

// Maybe this is bad, but it works :/
export const Context = {
  filter: {
    accountId: "-1",
    month: dayjs().month(),
    year: dayjs().year(),
  },
  currency: Currency.EUR,
  apiToken: "",
};

const routes = [
  {
    element: <Layout />,
    loader: accountLoaderShallow,
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
        path: "/transaction/import",
        element: <TransactionImport />,
        loader: accountLoaderShallow,
        action: importTransactionAction,
      },
      {
        path: "/transaction/import/map",
        element: <TransactionImportMap />,
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
];

export default function App() {
  const auth = useAuth();

  switch (auth.activeNavigator) {
    case "signinSilent":
      return (
        <CircularProgress
          size={70}
          sx={{
            position: "fixed",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
          }}
        />
      );
  }

  if (auth.isLoading) {
    return (
      <CircularProgress
        size={70}
        sx={{
          position: "fixed",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 2,
        }}
      />
    );
  }

  if (auth.error) {
    return (
      <div>
        Oops, something happened during the login process ...{" "}
        {auth.error.message}
      </div>
    );
  }

  if (auth.isAuthenticated) {
    Context.apiToken = auth.user?.access_token ? auth.user?.access_token : "";
    const router = createBrowserRouter(routes);
    return <RouterProvider router={router} />;
  }
  Context.apiToken = "";
  auth.signinRedirect().then();
  return <></>;
}

function Layout() {
  const [theme, colorMode] = useMode() as [
    Theme,
    { toggleColorMode: () => void },
  ];
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
