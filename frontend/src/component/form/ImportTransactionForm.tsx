import { Form, NavigateFunction, useNavigate } from "react-router-dom";
import { Box, Button, InputLabel, Select } from "@mui/material";
import { Account } from "../../model/Account";
import { Banks } from "../../model/Banks";

interface Props {
  accounts: Account[];
}

export default function ImportTransactionForm({ accounts }: Props) {
  const navigate: NavigateFunction = useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box>
        <Form method="post" id="account-form" encType="multipart/form-data">
          <InputLabel>Account</InputLabel>
          <Select
            sx={{
              width: "100%",
              margin: "5px",
            }}
            required={true}
            defaultValue={accounts[0].id}
            native={true}
            variant="filled"
            label="Account"
            name="account"
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {" "}
                {account.name}
              </option>
            ))}
          </Select>
          <InputLabel>Bank</InputLabel>
          <Select
            sx={{
              width: "100%",
              margin: "5px",
            }}
            required={true}
            defaultValue={Banks.YUH}
            native={true}
            variant="filled"
            label="Bank"
            name="type"
          >
            {Object.values(Banks).map((bank) => (
              <option key={bank} value={bank}>
                {bank}
              </option>
            ))}
          </Select>
          <InputLabel>File</InputLabel>
          <input name="file" type="file" />
          <Box sx={{ display: "flex", justifyContent: "right" }}>
            <Button
              type="submit"
              variant="contained"
              color="success"
              sx={{ margin: "5px 10px" }}
            >
              Import
            </Button>
            <Button
              type="button"
              variant="contained"
              color="error"
              onClick={() => {
                navigate(-1);
              }}
              sx={{ margin: "5px 0" }}
            >
              Cancel
            </Button>
          </Box>
        </Form>
      </Box>
    </Box>
  );
}
