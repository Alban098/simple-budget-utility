import { Box } from "@mui/material";
import Header from "../../component/Header";
import { useLoaderData } from "react-router-dom";
import AccountService from "../../service/AccountService";
import AccountForm from "../../component/form/AccountForm";
import { redirect } from "react-router-dom";
import { Account } from "../../model/Account";

interface AccountParameters {
  id: string;
}

interface LoaderParameters {
  params: AccountParameters;
}

interface ActionParameters {
  params: AccountParameters;
  request: Request;
}

export async function loader({ params }: LoaderParameters): Promise<Account> {
  return AccountService.find(params.id);
}

export async function action({
  request,
  params,
}: ActionParameters): Promise<Response> {
  const formData = await request.formData();
  await AccountService.update(
    params.id,
    Object.fromEntries(formData) as unknown as Account,
  );
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
