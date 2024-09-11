import { Box } from "@mui/material";
import Header from "../../component/Header";
import { useLoaderData } from "react-router-dom";
import AccountService from "../../service/AccountService";
import AccountForm from "../../form/AccountForm";
import { redirect } from "react-router-dom";
import React from "react";
import { Account } from "../../model/Account";

// @ts-ignore
export async function loader({ params }): Promise<Account> {
  return AccountService.find(params.id);
}

// @ts-ignore
export async function action({ request, params }): Promise<Response> {
  const formData = await request.formData();
  await AccountService.update(
    params.id,
    Object.fromEntries(formData) as Account,
  );
  return redirect("/account");
}

export default function AccountEdit() {
  const account: Account = useLoaderData() as Account;

  return (
    <Box m="20px">
      <Header title="Edit Account" subtitle="Edit an existing account" />
      <AccountForm account={account} cancelButton={true} />
    </Box>
  );
}
