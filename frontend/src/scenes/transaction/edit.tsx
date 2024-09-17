import { Box } from "@mui/material";
import Header from "../../component/Header";
import { Params, redirect, useLoaderData } from "react-router-dom";
import TransactionService from "../../service/TransactionService";
import TransactionForm from "../../component/form/TransactionForm";
import CategoryService from "../../service/CategoryService";
import { Category } from "../../model/Category";
import { Account } from "../../model/Account";
import AccountService from "../../service/AccountService";
import { Amount } from "../../model/Amount";
import { Currency } from "../../model/Currency";
import { TransactionDto } from "../../model/TransactionDto";
import { Context } from "../../App";

interface LoaderData {
  transaction: TransactionDto | null;
  categories: Category[];
  accounts: Account[];
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
}: {
  params: Params<"id">;
}): Promise<LoaderData> {
  return {
    transaction:
      params.id === undefined
        ? null
        : await TransactionService.find(params.id, Context.apiToken),
    categories: await CategoryService.findAll(Context.apiToken),
    accounts: await AccountService.findAll(Context.apiToken),
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
  transaction.category = await CategoryService.find(
    entries.categoryId,
    Context.apiToken,
  );
  transaction.account = { id: entries.accountId } as Account;
  transaction.date = entries.date;
  transaction.description = entries.description;
  transaction.amounts = [
    { value: entries.amountEur, currency: Currency.EUR } as Amount,
    { value: entries.amountChf, currency: Currency.CHF } as Amount,
    { value: entries.amountUsd, currency: Currency.USD } as Amount,
  ];

  if (params.id !== undefined) {
    await TransactionService.update(params.id, transaction, Context.apiToken);
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
