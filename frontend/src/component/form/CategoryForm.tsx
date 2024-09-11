import { Form, NavigateFunction, useNavigate } from "react-router-dom";
import { Box, Button, TextField } from "@mui/material";

export default function CategoryForm() {
  const navigate: NavigateFunction = useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box>
        <Form method="post" id="account-form">
          <TextField
            label="Name"
            variant="filled"
            color="secondary"
            name="name"
            sx={{
              width: "100%",
              margin: "5px",
            }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "right",
            }}
          >
            <Button
              type="submit"
              variant="contained"
              color="success"
              sx={{
                margin: "5px 10px",
              }}
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
              sx={{
                margin: "5px 0",
              }}
            >
              Cancel
            </Button>
          </Box>
        </Form>
      </Box>
    </Box>
  );
}
