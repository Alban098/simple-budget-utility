import axios, { AxiosResponse } from "axios";
import { Category } from "../model/Category";

export default class CategoryService {
  static async findAll(): Promise<Category[]> {
    const response: AxiosResponse<Category[]> = await axios.get(
      "http://localhost:8080/api/category/",
    );
    return response.data;
  }

  static async find(id: string): Promise<Category> {
    const response: AxiosResponse<Category> = await axios.get(
      `http://localhost:8080/api/category/${id}`,
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
