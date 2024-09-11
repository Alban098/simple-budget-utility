import { TextField } from "@mui/material";
import { Form, useLocation, useSubmit } from "react-router-dom";
import { Context } from "../../App";

export default function YearSelector() {
  const submit = useSubmit();
  const location = useLocation();
  return (
    <Form
      onChange={() =>
        submit(null, {
          relative: "path",
          action: location.pathname,
        })
      }
    >
      {" "}
      <TextField
        id="year"
        label="Year"
        type="number"
        variant="filled"
        color="secondary"
        name="year"
        sx={{ width: "100px", margin: "6px 5px" }}
        defaultValue={Context.filter.year}
        onChange={(e) => (Context.filter.year = parseInt(e.target.value))}
      />
    </Form>
  );
}
