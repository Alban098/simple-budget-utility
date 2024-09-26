import axios, { AxiosResponse } from "axios";
import { Category } from "../model/Category";
import { getUser } from "../App";

export default class CategoryService {
  static async findAll(): Promise<Category[]> {
    const response: AxiosResponse<Category[]> = await axios.get(
      "/api/category/",
      {
        headers: {
          Authorization: `Bearer ${getUser()?.access_token}`,
        },
      },
    );
    return response.data;
  }

  static async find(id: string): Promise<Category> {
    const response: AxiosResponse<Category> = await axios.get(
      `/api/category/${id}`,
      {
        headers: {
          Authorization: `Bearer ${getUser()?.access_token}`,
        },
      },
    );
    return response.data;
  }

  static async create(dto: Category): Promise<Category> {
    const response: AxiosResponse<Category> = await axios.post(
      "/api/category/",
      dto,
      {
        headers: {
          Authorization: `Bearer ${getUser()?.access_token}`,
        },
      },
    );
    return response.data;
  }
}
