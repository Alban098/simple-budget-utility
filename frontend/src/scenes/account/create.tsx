import { Box } from "@mui/material";
import Header from "../../component/Header";
import AccountService from "../../service/AccountService";
import AccountForm from "../../form/AccountForm";
import { redirect } from "react-router-dom";
import { Account } from "../../model/Account";

// @ts-ignore
export async function action({ request }): Promise<Response> {
  const formData = await request.formData();
  await AccountService.create(Object.fromEntries(formData) as Account);
  return redirect("/account");
}

export default function AccountCreate() {
  return (
    <Box m="20px">
      <Header title="Create Account" subtitle="Create a new account" />
      <AccountForm />
    </Box>
  );
}
