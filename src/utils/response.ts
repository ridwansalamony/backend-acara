import { TPagination } from "../interfaces/page.types";

export class ApiResponse<T> {
  constructor(public status: boolean, public statusCode: number, public message: string, public data: T | null, public pagination?: TPagination) {}
}
