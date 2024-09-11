import { Box } from "@mui/material";
import Header from "../../component/Header";
import { redirect, useLoaderData } from "react-router-dom";
import { Transaction } from "../../model/Transaction";
import TransactionService from "../../service/TransactionService";
import TransactionForm from "../../component/form/TransactionForm";
import CategoryService from "../../service/CategoryService";
import AccountService from "../../service/AccountService";
import { Category } from "../../model/Category";
import { Account } from "../../model/Account";
import { Currency } from "../../model/Currency";
import { Amount } from "../../model/Amount";

interface ActionParameters {
  request: Request;
}

interface TransactionFormData {
  date: Date;
  description: string;
  accountId: string;
  categoryId: string;
  amountEur: number;
  amountChf: number;
  amountUsd: number;
}

export async function action({ request }: ActionParameters): Promise<Response> {
  const formData = await request.formData();
  const entries = Object.fromEntries(
    formData,
  ) as unknown as TransactionFormData;

  const transaction = {} as Transaction;
  transaction.category = await CategoryService.find(entries.categoryId);
  transaction.account = { id: entries.accountId } as Account;
  transaction.date = entries.date;
  transaction.description = entries.description;
  transaction.amounts = [
    { value: entries.amountEur, currency: Currency.EUR } as Amount,
    { value: entries.amountChf, currency: Currency.CHF } as Amount,
    { value: entries.amountUsd, currency: Currency.USD } as Amount,
  ];

  await TransactionService.create(transaction);
  return redirect("/transaction");
}

export async function loader() {
  return {
    categories: await CategoryService.findAll(),
    accounts: await AccountService.findAll(),
  };
}

export default function TransactionCreate() {
  const { categories, accounts } = useLoaderData() as {
    categories: Category[];
    accounts: Account[];
  };
  return (
    <Box m="20px">
      <Header title="Create Transaction" subtitle="Create a new transaction" />
      <TransactionForm categories={categories} accounts={accounts} />
    </Box>
  );
}
