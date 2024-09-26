import { Box } from "@mui/material";
import Header from "../../component/Header";
import { Params, redirect, useLoaderData } from "react-router-dom";
import TransactionService from "../../service/TransactionService";
import TransactionForm from "../../component/form/TransactionForm";
import CategoryService from "../../service/CategoryService";
import { Category } from "../../model/Category";
import { Account } from "../../model/Account";
import AccountService from "../../service/AccountService";
import { Currency } from "../../model/Currency";
import { TransactionDto } from "../../model/TransactionDto";
import dayjs from "dayjs";

interface LoaderData {
  transaction: TransactionDto | null;
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

export async function loader({
  params,
}: {
  params: Params<"id">;
}): Promise<LoaderData> {
  return {
    transaction:
      params.id === undefined ? null : await TransactionService.find(params.id),
    categories: await CategoryService.findAll(),
    accounts: await AccountService.findAll(true),
  } as LoaderData;
}

export async function action({
  request,
  params,
}: {
  request: Request;
  params: Params<"id">;
}): Promise<Response> {
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

  if (params.id !== undefined) {
    await TransactionService.update(params.id, transaction);
  }
  return redirect("/transaction");
}

export default function TransactionEdit() {
  const { transaction, categories, accounts } = useLoaderData() as LoaderData;

  return (
    <Box m="20px">
      <Header
        title="Edit Transaction"
        subtitle="Edit an existing Transaction"
      />
      <TransactionForm
        transaction={transaction}
        categories={categories}
        accounts={accounts}
      />
    </Box>
  );
}
