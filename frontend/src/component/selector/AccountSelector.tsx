import { Box, Select } from "@mui/material";
import { Form, useLocation, useSubmit } from "react-router-dom";
import { Account } from "../../model/Account";
import { Context } from "../../App";

interface Props {
  accounts: Account[];
}

export default function AccountSelector({ accounts }: Props) {
  const submit = useSubmit();
  const location = useLocation();
  return (
    <Box sx={{ m: "0 10px" }}>
      <Form
        onChange={() =>
          submit(null, {
            relative: "path",
            action: location.pathname,
          })
        }
      >
        <Select
          sx={{
            width: "100%",
            margin: "5px",
          }}
          defaultValue={Context.filter.accountId}
          required={true}
          native={true}
          variant="filled"
          label="Account"
          name="accountId"
          onChange={(e) => (Context.filter.accountId = e.target.value)}
        >
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {" "}
              {account.name}
            </option>
          ))}
        </Select>
      </Form>
    </Box>
  );
}
