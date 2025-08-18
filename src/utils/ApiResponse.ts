import { TPagination } from "../interfaces/page.types";
import { Response } from "express";

export class ApiResponse<T> {
  constructor(public status: boolean, public statusCode: number, public message: string, public data: T | null, public pagination?: TPagination) {}

  send(res: Response) {
    return res.status(this.statusCode).json({
      meta: {
        status: this.status,
        statusCode: this.statusCode,
        message: this.message,
      },
      data: this.data,
      pagination: this.pagination,
    });
  }

  // ✅ Success helper
  static success<T>(res: Response, status: boolean, statusCode: number, message: string, data: T, pagination?: TPagination) {
    return new ApiResponse<T>(status, statusCode, message, data, pagination).send(res);
  }

  // ✅ Error helper
  static error<T>(res: Response, status: boolean, statusCode: number, message: string, data: T) {
    return new ApiResponse<T>(status, statusCode, message, data).send(res);
  }
}
