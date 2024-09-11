import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../component/Header";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import CurrencyChip from "../../component/CurrencyChip";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import React from "react";
import { Amount } from "../../model/Amount";
import { Account } from "../../model/Account";
import { Category } from "../../model/Category";
import { Transaction } from "../../model/Transaction";
import { chfTo, Currency, eurTo, usdTo } from "../../constant/Currency";
import TransactionService from "../../service/TransactionService";
import AddCardIcon from "@mui/icons-material/AddCard";

type DialogState = {
  opened: boolean;
  id?: string;
};

export function loader() {
  return TransactionService.findAll();
}

export default function TransactionList() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();
  const transactions = useLoaderData() as Transaction[];

  const [deleteDialog, setDeleteDialog] = React.useState({
    opened: false,
  } as DialogState);

  const deleteTransactionAction = (id: string) => {
    setDeleteDialog({ opened: true, id: id });
  };

  const handleDeleteTransactionDialog = async (
    confirmed: boolean,
    id?: string,
  ) => {
    setDeleteDialog({ opened: false, id: undefined });
    if (confirmed && id != null) {
      await TransactionService.delete(id);
      navigate(".", { replace: true });
    }
  };

  const getAmount = (amounts: Amount[]) => {
    let total = 0;
    amounts.forEach((amount) => {
      switch (amount.currency) {
        case Currency.EUR:
          total += eurTo(amount.value, Currency.EUR);
          break;
        case Currency.CHF:
          total += chfTo(amount.value, Currency.EUR);
          break;
        case Currency.US_DOLLAR:
          total += usdTo(amount.value, Currency.EUR);
          break;
      }
    });
    return total;
  };

  const renderAccount = (account: Account) => {
    return (
      <Link to={`/account/${account.id}`}>
        <Button
          fullWidth
          sx={{ justifyContent: "left", fontSize: "11px" }}
          color="error"
          variant="outlined"
          startIcon={<KeyboardArrowRightIcon />}
        >
          {account.name}
        </Button>
      </Link>
    );
  };

  const renderCategory = (category: Category) => {
    return <Typography sx={{ fontSize: "11px" }}>{category.name}</Typography>;
  };

  const renderAmounts = (id: string, amounts: Amount[]) => {
    return (
      <Box p="5px 0">
        {amounts.map((amount, index) => (
          <Box key={id + "_" + index}>
            <CurrencyChip showZero={false} amount={amount} />
          </Box>
        ))}
      </Box>
    );
  };

  const renderActions = (id: string) => {
    return (
      <Box display="inline-block" justifyContent="right">
        <Link to={`/transaction/${id}/edit`}>
          <IconButton>
            <EditIcon sx={{ color: colors.greenAccent[500] }} />
          </IconButton>
        </Link>
        <IconButton onClick={() => deleteTransactionAction(id)}>
          <DeleteIcon sx={{ color: colors.redAccent[500] }} />
        </IconButton>
      </Box>
    );
  };

  const columns: GridColDef<Transaction>[] = [
    {
      field: "date",
      headerName: "Date",
      type: "date",
      resizable: false,
      width: 100,
      valueGetter: (date) => date,
      cellClassName: "date-column--cell",
    },
    {
      field: "account",
      headerName: "Account",
      resizable: false,
      width: 130,
      valueGetter: (account: Account) => account.name,
      renderCell: ({ row: { account } }) => renderAccount(account),
    },
    {
      field: "category",
      headerName: "Category",
      resizable: false,
      width: 200,
      valueGetter: (category: Category) => category.name,
      renderCell: ({ row: { category } }) => renderCategory(category),
    },
    {
      field: "description",
      headerName: "Description",
      resizable: false,
      flex: 1,
      cellClassName: "desc-column--cell",
    },
    {
      field: "amounts",
      headerName: "Total",
      resizable: false,
      width: 180,
      type: "number",
      valueGetter: (amounts) => getAmount(amounts),
      renderCell: ({ row: { id, amounts } }) => renderAmounts(id, amounts),
    },
    {
      field: "id",
      headerName: "",
      filterable: false,
      align: "right",
      resizable: false,
      width: 95,
      renderCell: ({ row: { id } }) => renderActions(id),
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
          alignContent: "center",
        },
        "& .date-column--cell": {
          color: colors.blueAccent[300],
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
        <Header title="Transactions" subtitle="Managing your transactions" />
        <Button
          variant="contained"
          onClick={() => navigate("/transaction/create")}
          color="secondary"
          startIcon={<AddCardIcon />}
        >
          {" "}
          Transaction
        </Button>
      </Box>
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          isRowSelectable={() => false}
          getRowHeight={() => "auto"}
          rows={transactions}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
          disableColumnSelector
          slotProps={{
            toolbar: {
              printOptions: { disableToolbarButton: true },
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 250 },
            },
          }}
        />
      </Box>
      <Dialog
        open={deleteDialog.opened}
        onClose={() => handleDeleteTransactionDialog(false, deleteDialog.id)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure ?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you really want to delete this transaction ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="success"
            onClick={() => handleDeleteTransactionDialog(true, deleteDialog.id)}
          >
            Yes
          </Button>
          <Button
            color="error"
            onClick={() =>
              handleDeleteTransactionDialog(false, deleteDialog.id)
            }
            autoFocus
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
