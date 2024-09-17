import axios, { AxiosResponse } from "axios";
import { Category } from "../model/Category";

export default class CategoryService {
  static async findAll(token: string): Promise<Category[]> {
    const response: AxiosResponse<Category[]> = await axios.get(
      "http://localhost:8080/api/category/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  }

  static async find(id: string, token: string): Promise<Category> {
    const response: AxiosResponse<Category> = await axios.get(
      `http://localhost:8080/api/category/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  }

  static async create(dto: Category, token: string): Promise<Category> {
    const response: AxiosResponse<Category> = await axios.post(
      "http://localhost:8080/api/category/",
      dto,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  }
}
