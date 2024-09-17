import { Box } from "@mui/material";
import Header from "../../component/Header";
import { useLoaderData } from "react-router-dom";
import AccountService from "../../service/AccountService";
import AccountForm from "../../component/form/AccountForm";
import { redirect, Params } from "react-router-dom";
import { Account } from "../../model/Account";
import { Context } from "../../App";

export async function loader({
  params,
}: {
  params: Params<"id">;
}): Promise<Account | null> {
  if (params.id !== undefined) {
    return await AccountService.find(params.id, Context.apiToken);
  }
  return null;
}

export async function action({
  request,
  params,
}: {
  request: Request;
  params: Params<"id">;
}): Promise<Response> {
  const formData = await request.formData();
  if (params.id !== undefined) {
    await AccountService.update(
      params.id,
      Object.fromEntries(formData) as unknown as Account,
      Context.apiToken,
    );
  }
  return redirect("/account");
}

export default function AccountEdit() {
  const account: Account = useLoaderData() as Account;

  return (
    <Box m="20px">
      <Header title="Edit Account" subtitle="Edit an existing account" />
      <AccountForm account={account} />
    </Box>
  );
}
