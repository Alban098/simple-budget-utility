import { InputLabel, Select } from "@mui/material";
import { Form, useSubmit } from "react-router-dom";
import { Account } from "../model/Account";

type Props = {
  accountId: string;
  accounts: Account[];
};

export default function AccountSelector({ accountId, accounts }: Props) {
  const submit = useSubmit();
  return (
    <Form onChange={(e) => submit(e.currentTarget)}>
      <InputLabel>Account</InputLabel>
      <Select
        sx={{
          width: "100%",
          margin: "5px",
        }}
        defaultValue={accountId}
        required={true}
        native={true}
        variant="filled"
        label="Account"
        name="accountId"
      >
        {accounts.map((account) => (
          <option key={account.id} value={account.id}>
            {" "}
            {account.name}
          </option>
        ))}
      </Select>
    </Form>
  );
}
