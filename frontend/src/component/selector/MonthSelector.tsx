import { Box, Select } from "@mui/material";
import { Form, useLocation, useSubmit } from "react-router-dom";
import { Context } from "../../App";

export default function MonthSelector() {
  const submit = useSubmit();
  const location = useLocation();
  return (
    <Box sx={{ m: "0 10px" }}>
      <Form
        onChange={() =>
          submit(null, {
            relative: "path",
            action: location.pathname,
          })
        }
      >
        {" "}
        <Select
          sx={{ width: "120px", margin: "5px" }}
          native={true}
          color="secondary"
          variant="filled"
          label="Month"
          name="month"
          defaultValue={Context.filter.month}
          onChange={(e) =>
            (Context.filter.month = parseInt(e.target.value as string))
          }
        >
          <option key="0" value="0">
            January
          </option>
          <option key="1" value="1">
            February
          </option>
          <option key="2" value="2">
            March
          </option>
          <option key="3" value="3">
            April
          </option>
          <option key="4" value="4">
            May
          </option>
          <option key="5" value="5">
            June
          </option>
          <option key="6" value="6">
            July
          </option>
          <option key="7" value="7">
            August
          </option>
          <option key="8" value="8">
            September
          </option>
          <option key="9" value="9">
            October
          </option>
          <option key="10" value="10">
            November
          </option>
          <option key="11" value="11">
            December
          </option>
        </Select>
      </Form>
    </Box>
  );
}
