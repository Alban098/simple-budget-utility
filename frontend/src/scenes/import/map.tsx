import { Box, CircularProgress } from "@mui/material";
import { useLocation } from "react-router-dom";

export default function TransactionImportMap() {
  const { state } = useLocation();
  console.log(state);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        height: "100%",
        alignItems: "center",
      }}
    >
      <CircularProgress color="secondary" />
    </Box>
  );
}
