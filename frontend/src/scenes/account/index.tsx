import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../component/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import CurrencyChip from "../../component/CurrencyChip";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddCardIcon from "@mui/icons-material/AddCard";
import AccountService from "../../service/AccountService";
import { Account } from "../../model/Account";
import React from "react";
import { Amount } from "../../model/Amount";

interface DialogState {
  opened: boolean;
  id?: string;
}

export function loader(): Promise<Account[]> {
  return AccountService.findAll();
}

export default function AccountList() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();
  const accounts = useLoaderData() as Account[];

  const [deleteDialog, setDeleteDialog] = React.useState({
    opened: false,
  } as DialogState);

  const deleteAccountAction = (id: string) => {
    setDeleteDialog({ opened: true, id: id });
  };

  const handleDeleteAccountDialog = async (confirmed: boolean, id?: string) => {
    setDeleteDialog({ opened: false, id: undefined });
    if (confirmed && id != null) {
      await AccountService.delete(id);
      navigate(".", { replace: true });
    }
  };

  const renderAmounts = (id: string, amounts?: Amount[]) => {
    return (
      <Box p="5px 0">
        {amounts?.map((amount, index) => (
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
        <Link to={"/account/" + id}>
          <IconButton>
            <VisibilityIcon />
          </IconButton>
        </Link>
        <Link to={"/account/" + id + "/edit"}>
          <IconButton color="secondary">
            <EditIcon />
          </IconButton>
        </Link>
        <IconButton color="error" onClick={() => deleteAccountAction(id)}>
          <DeleteIcon />
        </IconButton>
      </Box>
    );
  };

  const columns: GridColDef<Account>[] = [
    {
      field: "name",
      headerName: "Name",
      resizable: false,
      flex: 0.33,
      cellClassName: "name-column--cell",
    },
    {
      field: "description",
      headerName: "Description",
      resizable: false,
      flex: 0.66,
      cellClassName: "desc-column--cell",
    },
    {
      field: "balances",
      headerName: "Balances",
      resizable: false,
      width: 180,
      type: "number",
      renderCell: ({ row: { id, balances } }) => renderAmounts(id, balances),
    },
    {
      field: "amount",
      headerName: "Total",
      resizable: false,
      width: 180,
      type: "number",
      renderCell: ({ row: { amount } }) => {
        return <CurrencyChip amount={amount} />;
      },
    },
    {
      field: "id",
      headerName: "",
      resizable: false,
      width: 140,
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
        "& .name-column--cell": {
          color: colors.redAccent[300],
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
        <Header title="Accounts" subtitle="Managing your accounts" />
        <Button
          variant="contained"
          onClick={() => navigate("/account/create")}
          color="secondary"
          startIcon={<AddCardIcon />}
        >
          {" "}
          Account
        </Button>
      </Box>
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={accounts}
          columns={columns}
          isRowSelectable={() => false}
          getRowHeight={() => "auto"}
        />
      </Box>
      <Dialog
        open={deleteDialog.opened}
        onClose={() => handleDeleteAccountDialog(false, deleteDialog.id)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure ?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you really want to delete this account ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="success"
            onClick={() => handleDeleteAccountDialog(true, deleteDialog.id)}
          >
            Yes
          </Button>
          <Button
            color="error"
            onClick={() => handleDeleteAccountDialog(false, deleteDialog.id)}
            autoFocus
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
