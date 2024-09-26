import { Form, NavigateFunction, useNavigate } from "react-router-dom";
import { Box, Button, InputLabel, Select, TextField } from "@mui/material";
import dayjs from "dayjs";
import {
  DatePicker,
  LocalizationProvider,
  PickerValidDate,
} from "@mui/x-date-pickers";
import { Category } from "../../model/Category";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Account } from "../../model/Account";
import { Currency, getSymbol } from "../../model/Currency";
import { TransactionDto } from "../../model/TransactionDto";

interface Props {
  transaction?: TransactionDto | null;
  categories: Category[];
  accounts: Account[];
}

export default function TransactionForm({
  transaction,
  categories,
  accounts,
}: Props) {
  const navigate: NavigateFunction = useNavigate();
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="us">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box>
          <Form method="post" id="account-form">
            <DatePicker
              label="Date"
              name="date"
              sx={{
                width: "100%",
                margin: "5px",
              }}
              value={dayjs(transaction?.date) as PickerValidDate}
            />
            <TextField
              label="Description"
              variant="filled"
              color="secondary"
              defaultValue={transaction?.description}
              name="description"
              sx={{
                width: "100%",
                margin: "5px",
              }}
            />
            <InputLabel>Category</InputLabel>
            <Select
              sx={{
                width: "100%",
                margin: "5px",
              }}
              defaultValue={transaction?.category}
              required={true}
              native={true}
              variant="filled"
              label="Category"
              name="categoryId"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {" "}
                  {category.name}
                </option>
              ))}
            </Select>
            <InputLabel>Account</InputLabel>
            <Select
              sx={{
                width: "100%",
                margin: "5px",
              }}
              defaultValue={transaction?.account}
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
            <InputLabel>Amount</InputLabel>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <TextField
                sx={{ flex: 0.5, margin: "5px" }}
                id="amount"
                name="amount"
                label="Value"
                type="decimal"
                variant="filled"
                color="secondary"
                defaultValue={transaction?.amount?.value}
              />
              <Select
                sx={{ flex: 0.5, margin: "5px" }}
                id="currency"
                name="currency"
                label="currency"
                required={true}
                native={true}
                variant="filled"
                color="secondary"
                defaultValue={transaction?.amount?.currency}
              >
                {Object.values(Currency).map((currency) => {
                  return (
                    <option key={currency} value={currency}>
                      {getSymbol(currency)}
                    </option>
                  );
                })}
              </Select>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "right" }}>
              <Button
                type="submit"
                variant="contained"
                color="success"
                sx={{ margin: "5px 10px" }}
              >
                Save
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
    </LocalizationProvider>
  );
}
