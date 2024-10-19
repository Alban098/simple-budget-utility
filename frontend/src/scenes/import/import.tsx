import { Alert, Box, CircularProgress, useTheme } from "@mui/material";
import Header from "../../component/Header";
import {
  Await,
  NavigateFunction,
  useActionData,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { Account } from "../../model/Account";
import { Suspense, useEffect } from "react";
import TransactionService from "../../service/TransactionService";
import { Transaction } from "../../model/Transaction";
import ImportTransactionForm from "../../component/form/ImportTransactionForm";
import { Category } from "../../model/Category";
import CategoryService from "../../service/CategoryService";
import { ImportStatement } from "../../model/ImportStatement";
import { ImportedStatement } from "../../model/ImportedStatement";
import AccountService from "../../service/AccountService";
import ImportedStatementService from "../../service/ImportedStatementService";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { tokens } from "../../theme";

interface ActionParameters {
  request: Request;
}

interface LoaderData {
  accountsPromise: Promise<Account[]>;
  importedStatementsPromise: Promise<ImportedStatement[]>;
}

interface ActionData {
  categories: Category[];
  importStatement: ImportStatement;
}

export function loader(): LoaderData {
  return {
    accountsPromise: AccountService.findAll(true),
    importedStatementsPromise: ImportedStatementService.findAll(),
  };
}

export async function action({
  request,
}: ActionParameters): Promise<ActionData> {
  const formData = await request.formData();
  return {
    categories: await CategoryService.findAll(),
    importStatement: await TransactionService.import(formData),
  };
}

export default function TransactionImport() {
  const { accountsPromise, importedStatementsPromise } =
    useLoaderData() as LoaderData;
  const transactions = useActionData() as Transaction[];
  const navigate: NavigateFunction = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    if (transactions) {
      navigate("/transaction/import/map", {
        state: transactions,
        replace: true,
      });
    }
  }, [transactions, navigate]);

  const columns: GridColDef<ImportedStatement>[] = [
    {
      field: "date",
      headerName: "Date",
      type: "date",
      resizable: false,
      width: 150,
      valueGetter: (date) => date,
      cellClassName: "date-column--cell",
    },
    {
      field: "account",
      headerName: "Account",
      resizable: false,
      width: 175,
      cellClassName: "account-column--cell",
    },
    {
      field: "file",
      headerName: "File",
      resizable: false,
      flex: 1,
    },
    {
      field: "transactionCount",
      headerName: "Transactions",
      resizable: false,
      width: 120,
    },
    {
      field: "firstTransactionDate",
      headerName: "First Transaction",
      type: "date",
      resizable: false,
      width: 150,
      cellClassName: "date-column--cell",
    },
    {
      field: "lastTransactionDate",
      headerName: "Last Transaction",
      type: "date",
      resizable: false,
      width: 150,
      cellClassName: "date-column--cell",
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="Import Account Statement"
        subtitle="Account statement import 1/2"
      />
      <Box>
        <Suspense
          fallback={
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                height: "100%",
                alignItems: "center",
              }}
            >
              <CircularProgress color="secondary" />
            </Box>
          }
        >
          <Await
            resolve={accountsPromise}
            errorElement={
              <Alert severity="error">Error loading Data from API</Alert>
            }
          >
            {(accounts: Account[]) => (
              <ImportTransactionForm accounts={accounts} />
            )}
          </Await>
        </Suspense>
      </Box>
      <Box
        m="40px 15vw 0 15vw"
        height="50vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderColor: colors.grey[800],
            fontSize: "15px",
            alignContent: "center",
          },
          "& .date-column--cell": {
            color: colors.blueAccent[300],
          },
          "& .account-column--cell": {
            color: colors.redAccent[300],
            fontWeight: "bold",
          },
          "& .category-column--cell": {
            color: colors.greenAccent[400],
            fontWeight: "bold",
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScoller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
        }}
      >
        <Suspense
          fallback={
            <DataGrid
              loading
              columns={columns}
              slotProps={{
                loadingOverlay: {
                  noRowsVariant: "skeleton",
                },
              }}
            />
          }
        >
          <Await
            resolve={importedStatementsPromise}
            errorElement={
              <Alert severity="error">Error loading Data from API</Alert>
            }
          >
            {(importedStatement: ImportedStatement[]) => (
              <DataGrid
                rows={importedStatement}
                columns={columns}
                isRowSelectable={() => false}
                getRowHeight={() => "auto"}
              />
            )}
          </Await>
        </Suspense>
      </Box>
    </Box>
  );
}
