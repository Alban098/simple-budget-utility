import { Box } from "@mui/material";
import Header from "../../component/Header";
import { redirect, useLoaderData } from "react-router-dom";
import TransactionService from "../../service/TransactionService";
import TransactionForm from "../../form/TransactionForm";
import React from "react";
import { Transaction } from "../../model/Transaction";
import CategoryService from "../../service/CategoryService";
import { Category } from "../../model/Category";
import { Account } from "../../model/Account";
import AccountService from "../../service/AccountService";

// @ts-ignore
export async function loader({ params }) {
  return {
    transaction: await TransactionService.find(params.id),
    categories: await CategoryService.findAll(),
    accounts: await AccountService.findAll(),
  };
}

// @ts-ignore
export async function action({ request, params }): Promise<Response> {
  const formData = await request.formData();
  const entries = Object.fromEntries(formData);
  entries.category = await CategoryService.find(entries.category);
  entries.account = { id: entries.account };

  entries.amounts = [
    { value: entries.amountEur, currency: "EUR" },
    { value: entries.amountChf, currency: "CHF" },
    { value: entries.amountUsd, currency: "US_DOLLAR" },
  ];
  delete entries.amountEur;
  delete entries.amountChf;
  delete entries.amountUsd;

  await TransactionService.update(params.id, entries as Transaction);
  return redirect("/transaction");
}

export default function TransactionEdit() {
  const { transaction, categories, accounts } = useLoaderData() as {
    transaction: Transaction;
    categories: Category[];
    accounts: Account[];
  };

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
