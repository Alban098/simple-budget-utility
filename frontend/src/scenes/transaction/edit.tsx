import { Box } from "@mui/material";
import Header from "../../component/Header";
import { redirect, useLoaderData } from "react-router-dom";
import TransactionService from "../../service/TransactionService";
import TransactionForm from "../../component/form/TransactionForm";
import { Transaction } from "../../model/Transaction";
import CategoryService from "../../service/CategoryService";
import { Category } from "../../model/Category";
import { Account } from "../../model/Account";
import AccountService from "../../service/AccountService";
import { Amount } from "../../model/Amount";
import { Currency } from "../../model/Currency";

interface TransactionParameter {
  id: string;
}

interface LoaderParameters {
  params: TransactionParameter;
}

interface LoaderData {
  transaction: Transaction;
  categories: Category[];
  accounts: Account[];
}

interface ActionParameters {
  params: TransactionParameter;
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

export async function loader({
  params,
}: LoaderParameters): Promise<LoaderData> {
  return {
    transaction: await TransactionService.find(params.id),
    categories: await CategoryService.findAll(),
    accounts: await AccountService.findAll(),
  } as LoaderData;
}

export async function action({
  request,
  params,
}: ActionParameters): Promise<Response> {
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

  await TransactionService.update(params.id, transaction);
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
