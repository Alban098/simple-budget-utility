import {
  Alert,
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
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Amount } from "../../model/Amount";
import { Transaction } from "../../model/Transaction";
import TransactionService from "../../service/TransactionService";
import AddCardIcon from "@mui/icons-material/AddCard";
import { Context } from "../../App";
import { Suspense, useState } from "react";
import UploadIcon from "@mui/icons-material/Upload";

type DialogState = {
  opened: boolean;
  id?: string;
};

interface LoaderData {
  transactionsPromise: Promise<Transaction[]>;
}

export function loader(): LoaderData {
  return {
    transactionsPromise: TransactionService.findByAccount(
      Context.filter.accountId,
    ),
  };
}

export default function TransactionList() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();
  const { transactionsPromise } = useLoaderData() as LoaderData;

  const [deleteDialog, setDeleteDialog] = useState({
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

  const renderAmount = (id: string, amount: Amount) => {
    return (
      <Box p="5px 0">
        <Box key={id}>
          <CurrencyChip showZero={false} amount={amount} />
        </Box>
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
      field: "imported",
      headerName: "",
      resizable: false,
      width: 20,
      renderCell: ({ row: { imported } }) =>
        imported ? <UploadIcon></UploadIcon> : <></>,
      cellClassName: "imported-column--cell",
    },
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
      field: "account",
      headerName: "Account",
      resizable: false,
      width: 180,
      cellClassName: "account-column--cell",
    },
    {
      field: "category",
      headerName: "Category",
      resizable: false,
      width: 200,
      cellClassName: "category-column--cell",
      renderCell: ({ row: { category } }) => (
        <Typography> {category} </Typography>
      ),
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
        "& .imported-column--cell": {
          color: colors.greenAccent[500],
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
        <Suspense
          fallback={
            <DataGrid
              loading
              columns={columns}
              slots={{ toolbar: GridToolbar }}
              disableColumnSelector
              slotProps={{
                toolbar: {
                  printOptions: { disableToolbarButton: true },
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 250 },
                },
                loadingOverlay: {
                  noRowsVariant: "skeleton",
                },
              }}
            />
          }
        >
          <Await
            resolve={transactionsPromise}
            errorElement={
              <Alert severity="error">Error loading Data from API</Alert>
            }
          >
            {(transactions: Transaction[]) => (
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
            )}
          </Await>
        </Suspense>
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
