import { Box, CircularProgress } from "@mui/material";

export default function LoadingCard() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        height: "100%",
        alignItems: "center",
      }}
    >
      <CircularProgress />{" "}
    </Box>
  );
}
