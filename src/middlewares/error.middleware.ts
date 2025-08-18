import { Request, Response, NextFunction } from "express";
import { ValidationError } from "yup";
import { AppError } from "../utils/AppError";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse";
import mongoose from "mongoose";

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ValidationError) {
    return ApiResponse.error(res, false, 400, err.message, err.errors);
  }

  if (err instanceof mongoose.Error) {
    return ApiResponse.error(res, false, 500, err.message, err.name);
  }

  if ((err as any)?.code) {
    const _err = err as any;
    return ApiResponse.error(res, false, 500, _err.errorResponse.errmsg, null);
  }

  if (err instanceof AppError) {
    return ApiResponse.error(res, false, err.statusCode, err.message, null);
  }

  if (err instanceof JsonWebTokenError || err instanceof TokenExpiredError) {
    return ApiResponse.error(res, false, 401, err.message, null);
  }

  return ApiResponse.error(res, false, 500, err.message, null);
};
