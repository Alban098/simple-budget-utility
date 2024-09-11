import { Box } from "@mui/material";
import Header from "../../component/Header";
import { redirect } from "react-router-dom";
import React from "react";
import CategoryForm from "../../form/CategoryForm";
import CategoryService from "../../service/CategoryService";
import { Category } from "../../model/Category";

// @ts-ignore
export async function action({ request }): Promise<Response> {
  const formData = await request.formData();
  await CategoryService.create(Object.fromEntries(formData) as Category);
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
