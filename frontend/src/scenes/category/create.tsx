import { Box } from "@mui/material";
import Header from "../../component/Header";
import { redirect } from "react-router-dom";
import CategoryForm from "../../component/form/CategoryForm";
import CategoryService from "../../service/CategoryService";
import { Category } from "../../model/Category";

interface ActionParameters {
  request: Request;
}

export async function action({ request }: ActionParameters): Promise<Response> {
  const formData = await request.formData();
  await CategoryService.create(
    Object.fromEntries(formData) as unknown as Category,
  );
  return redirect("/");
}

export default function CategoryCreate() {
  return (
    <Box m="20px">
      <Header title="Create Category" subtitle="Create a new Category" />
      <CategoryForm />
    </Box>
  );
}
