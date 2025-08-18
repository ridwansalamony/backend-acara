import { Request, Response, NextFunction } from "express";
import { ValidationError } from "yup";
import { AppError } from "../utils/AppError";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse";

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ValidationError) {
    return ApiResponse.error(res, false, 400, err.message, err.errors);
  }

  if (err instanceof AppError) {
    return ApiResponse.error(res, false, err.statusCode, err.message, null);
  }

  if (err instanceof JsonWebTokenError || err instanceof TokenExpiredError) {
    return ApiResponse.error(res, false, 401, err.message, null);
  }

  return ApiResponse.error(res, false, 500, err.message, null);
};
