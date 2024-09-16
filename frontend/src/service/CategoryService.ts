import axios, { AxiosResponse } from "axios";
import { Category } from "../model/Category";
import { Context } from "../App";

export default class CategoryService {
  static async findAll(): Promise<Category[]> {
    const response: AxiosResponse<Category[]> = await axios.get(
      "http://localhost:8080/api/category/",
      { params: { currency: Context.currency } },
    );
    return response.data;
  }

  static async find(id: string): Promise<Category> {
    const response: AxiosResponse<Category> = await axios.get(
      `http://localhost:8080/api/category/${id}`,
      { params: { currency: Context.currency } },
    );
    return response.data;
  }

  static async create(dto: Category): Promise<Category> {
    const response: AxiosResponse<Category> = await axios.post(
      "http://localhost:8080/api/category/",
      dto,
    );
    return response.data;
  }
}
