import { Alert, Box, CircularProgress } from "@mui/material";
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
import { Context } from "../../App";
import { Transaction } from "../../model/Transaction";
import ImportTransactionForm from "../../component/form/ImportTransactionForm";

interface ActionParameters {
  request: Request;
}

interface LoaderData {
  accountsPromise: Promise<Account[]>;
}

export async function action({
  request,
}: ActionParameters): Promise<Transaction[]> {
  const formData = await request.formData();
  return await TransactionService.import(formData, Context.apiToken);
}

export default function TransactionImport() {
  const { accountsPromise } = useLoaderData() as LoaderData;
  const transactions = useActionData() as Transaction[];
  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    if (transactions) {
      navigate("/transaction/import/map", {
        state: transactions,
        replace: true,
      });
    }
  }, [transactions, navigate]);

  return (
    <Box m="20px">
      <Header title="Import Account Statement" subtitle="Import" />
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
  );
}
