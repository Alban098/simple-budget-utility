import { Box } from "@mui/material";
import Header from "../../component/Header";
import { redirect, useLoaderData } from "react-router-dom";
import React from "react";
import { Transaction } from "../../model/Transaction";
import TransactionService from "../../service/TransactionService";
import TransactionForm from "../../form/TransactionForm";
import CategoryService from "../../service/CategoryService";
import AccountService from "../../service/AccountService";
import { Category } from "../../model/Category";
import { Account } from "../../model/Account";

// @ts-ignore
export async function action({ request }): Promise<Response> {
  const formData = await request.formData();
  const entries = Object.fromEntries(formData);
  entries.category = await CategoryService.find(entries.category);
  entries.account = { id: entries.account };

  entries.amounts = [
    {
      value: entries.amountEur,
      currency: "EUR",
    },
    {
      value: entries.amountChf,
      currency: "CHF",
    },
    {
      value: entries.amountUsd,
      currency: "US_DOLLAR",
    },
  ];
  delete entries.amountEur;
  delete entries.amountChf;
  delete entries.amountUsd;

  await TransactionService.create(entries as Transaction);
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
