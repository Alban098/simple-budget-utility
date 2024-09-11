import { Form, NavigateFunction, useNavigate } from "react-router-dom";
import React from "react";
import { Box, Button, InputLabel, Select, TextField } from "@mui/material";
import { Transaction } from "../model/Transaction";
import dayjs from "dayjs";
import {
  DatePicker,
  LocalizationProvider,
  PickerValidDate,
} from "@mui/x-date-pickers";
import { Category } from "../model/Category";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Account } from "../model/Account";
import { Currency } from "../constant/Currency";

type Props = {
  transaction?: Transaction;
  categories: Category[];
  accounts: Account[];
};

export default function AccountForm({
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
              defaultValue={transaction?.category?.id}
              required={true}
              native={true}
              variant="filled"
              label="Category"
              name="category"
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
              defaultValue={transaction?.account?.id}
              required={true}
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
            <InputLabel>Amounts</InputLabel>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <TextField
                sx={{ flex: 0.3333, margin: "5px" }}
                id="amountEur"
                name="amountEur"
                label="Euro"
                type="number"
                variant="filled"
                color="secondary"
                defaultValue={
                  transaction?.amounts?.findLast(
                    (a) => a.currency === Currency.EUR,
                  )?.value
                }
              />
              <TextField
                sx={{ flex: 0.3333, margin: "5px" }}
                id="amountChf"
                name="amountChf"
                label="Swiss Franc"
                type="number"
                variant="filled"
                color="secondary"
                defaultValue={
                  transaction?.amounts?.findLast(
                    (a) => a.currency === Currency.CHF,
                  )?.value
                }
              />
              <TextField
                sx={{ flex: 0.3333, margin: "5px" }}
                id="amountUsd"
                name="amountUsd"
                label="US Dollar"
                type="number"
                variant="filled"
                color="secondary"
                defaultValue={
                  transaction?.amounts?.findLast(
                    (a) => a.currency === Currency.US_DOLLAR,
                  )?.value
                }
              />
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
