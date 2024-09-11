import axios, { AxiosResponse } from "axios";
import { Category } from "../model/Category";

export default class CategoryService {
  static async findAll(): Promise<Category[]> {
    const response: AxiosResponse<any, Category[]> = await axios.get(
      "http://localhost:8080/api/category/",
    );
    return response.data;
  }

  static async findByName(query: string): Promise<Category[]> {
    const response: AxiosResponse<any, Category[]> = await axios.get(
      "http://localhost:8080/api/category/",
      { params: { query: query } },
    );
    return response.data;
  }

  static async find(id: string): Promise<Category> {
    const response: AxiosResponse<any, Category> = await axios.get(
      "http://localhost:8080/api/category/" + id,
    );
    return response.data;
  }

  static async create(dto: Category): Promise<Category> {
    const response: AxiosResponse<any, Category> = await axios.post(
      "http://localhost:8080/api/category/",
      dto,
    );
    return response.data;
  }

  static async update(id: string, dto: Category): Promise<Category> {
    const response: AxiosResponse<any, Category> = await axios.put(
      "http://localhost:8080/api/category/" + id,
      dto,
    );
    return response.data;
  }

  static async delete(id: string) {
    await axios.delete("http://localhost:8080/api/category/" + id);
  }
}
