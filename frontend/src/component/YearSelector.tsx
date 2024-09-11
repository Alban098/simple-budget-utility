import { TextField } from "@mui/material";
import { Form, useSubmit } from "react-router-dom";

export default function YearSelector(props: { year: number }) {
  const submit = useSubmit();
  return (
    <Form onChange={(e) => submit(e.currentTarget)}>
      <TextField
        id="year"
        label="Year"
        type="number"
        variant="filled"
        color="secondary"
        name="year"
        sx={{ width: "100px", margin: "5px" }}
        defaultValue={props.year}
      />
    </Form>
  );
}
