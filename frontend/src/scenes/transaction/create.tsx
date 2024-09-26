import { Box } from "@mui/material";
import Header from "../../component/Header";
import { redirect, useLoaderData } from "react-router-dom";
import TransactionService from "../../service/TransactionService";
import TransactionForm from "../../component/form/TransactionForm";
import CategoryService from "../../service/CategoryService";
import AccountService from "../../service/AccountService";
import { Category } from "../../model/Category";
import { Account } from "../../model/Account";
import { Currency } from "../../model/Currency";
import { TransactionDto } from "../../model/TransactionDto";
import dayjs from "dayjs";

interface ActionParameters {
  request: Request;
}

interface LoaderData {
  categories: Category[];
  accounts: Account[];
}

interface TransactionFormData {
  date: string;
  description: string;
  accountId: string;
  categoryId: string;
  amount: number;
  currency: Currency;
}

export async function action({ request }: ActionParameters): Promise<Response> {
  const formData = await request.formData();
  const entries = Object.fromEntries(
    formData,
  ) as unknown as TransactionFormData;

  const transaction = {} as TransactionDto;
  transaction.category = await CategoryService.find(entries.categoryId);
  transaction.account = { id: entries.accountId } as Account;
  transaction.date = dayjs(
    entries.date.replace("/", "-"),
    "MM-DD-YYYY",
    "en",
  ).toDate();
  transaction.description = entries.description;
  transaction.amount = { value: entries.amount, currency: entries.currency };

  await TransactionService.create(transaction);
  return redirect("/transaction");
}

export async function loader(): Promise<LoaderData> {
  return {
    categories: await CategoryService.findAll(),
    accounts: await AccountService.findAll(true),
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
