import { Box, Button, Select, useTheme } from "@mui/material";
import { NavigateFunction, useLocation, useNavigate } from "react-router-dom";
import { Transaction } from "../../model/Transaction";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { Category } from "../../model/Category";
import { Amount } from "../../model/Amount";
import CurrencyChip from "../../component/CurrencyChip";
import Header from "../../component/Header";
import AddCardIcon from "@mui/icons-material/AddCard";
import TransactionService from "../../service/TransactionService";

export default function TransactionImportMap() {
  const navigate: NavigateFunction = useNavigate();

  async function saveTransactions(transactions: Transaction[]) {
    await TransactionService.finalizeImport(transactions);
    navigate("/transaction");
  }

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { state } = useLocation();
  const transactions = state.transactions as Transaction[];
  const categories = state.categories as Category[];

  const renderAmount = (id: string, amount: Amount) => {
    return (
      <Box p="5px 0">
        <Box key={id}>
          <CurrencyChip showZero={false} amount={amount} />
        </Box>
      </Box>
    );
  };

  const columns: GridColDef<Transaction>[] = [
    {
      field: "date",
      headerName: "Date",
      type: "date",
      resizable: false,
      width: 150,
      valueGetter: (date) => date,
      cellClassName: "date-column--cell",
    },
    {
      field: "category",
      headerName: "Category",
      resizable: false,
      width: 200,
      renderCell: ({ row: { id, category } }) => {
        return (
          <Select
            sx={{
              width: "100%",
              margin: "5px",
            }}
            defaultValue={
              category != null
                ? categories.find((c) => c.id === category)?.id
                : categories.at(0)?.id
            }
            required={true}
            native={true}
            variant="filled"
            label="Category"
            name="categoryId"
            onChange={(e) => {
              const t = transactions.find((t) => t.id === id);
              if (t != null) {
                t.category = e.target.value as string;
              }
            }}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {" "}
                {category.name}
              </option>
            ))}
          </Select>
        );
      },
      cellClassName: "category-column--cell",
    },
    {
      field: "description",
      headerName: "Description",
      resizable: false,
      flex: 1,
      cellClassName: "desc-column--cell",
    },
    {
      field: "amount",
      headerName: "Total",
      resizable: false,
      width: 180,
      type: "number",
      renderCell: ({ row: { id, amount } }) => renderAmount(id, amount),
    },
  ];
  return (
    <Box
      m="20px 40px"
      sx={{
        "& .MuiDataGrid-root": {
          border: "none",
        },
        "& .MuiDataGrid-cell": {
          borderColor: colors.grey[800],
          fontSize: "15px",
          alignContent: "center",
        },
        "& .date-column--cell": {
          color: colors.blueAccent[300],
        },
        "& .account-column--cell": {
          color: colors.redAccent[300],
          fontWeight: "bold",
        },
        "& .category-column--cell": {
          color: colors.greenAccent[400],
          fontWeight: "bold",
        },
        "& .MuiDataGrid-columnHeader": {
          backgroundColor: colors.blueAccent[700],
          borderBottom: "none",
        },
        "& .MuiDataGrid-virtualScoller": {
          backgroundColor: colors.primary[400],
        },
        "& .MuiDataGrid-footerContainer": {
          borderTop: "none",
          backgroundColor: colors.blueAccent[700],
        },
        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
          color: `${colors.grey[100]} ! important`,
        },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="Categorize transactions"
          subtitle="Account statement import 2/2"
        />
        <Button
          variant="contained"
          onClick={() => saveTransactions(transactions)}
          color="success"
          startIcon={<AddCardIcon />}
        >
          {" "}
          Finalize Import
        </Button>
      </Box>
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          isRowSelectable={() => false}
          getRowHeight={() => "auto"}
          rows={transactions}
          columns={columns}
        />
      </Box>
    </Box>
  );
}
