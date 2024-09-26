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
import { Transaction } from "../../model/Transaction";
import ImportTransactionForm from "../../component/form/ImportTransactionForm";
import { Category } from "../../model/Category";
import CategoryService from "../../service/CategoryService";

interface ActionParameters {
  request: Request;
}

interface LoaderData {
  accountsPromise: Promise<Account[]>;
}

interface ActionData {
  categories: Category[];
  transactions: Transaction[];
}

export async function action({
  request,
}: ActionParameters): Promise<ActionData> {
  const formData = await request.formData();
  return {
    categories: await CategoryService.findAll(),
    transactions: await TransactionService.import(formData),
  };
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
      <Header
        title="Import Account Statement"
        subtitle="Account statement import 1/2"
      />
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
