import { Request, Response, NextFunction } from "express";
import { ValidationError } from "yup";
import { AppError } from "../utils/error";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ValidationError) {
    res.status(400).json({
      meta: {
        status: false,
        statusCode: 400,
        message: err.message,
      },
      data: null,
    });
  } else if (err instanceof AppError) {
    res.status(err.statusCode).json({
      meta: {
        status: false,
        statusCode: err.statusCode,
        message: err.message,
      },
      data: null,
    });
  } else if (err instanceof JsonWebTokenError) {
    res.status(401).json({
      meta: {
        status: false,
        statusCode: 401,
        message: err.message,
      },
      data: null,
    });
  } else if (err instanceof TokenExpiredError) {
    res.status(401).json({
      meta: {
        status: false,
        statusCode: 401,
        message: err.message,
      },
      data: null,
    });
  } else {
    res.status(500).json({
      meta: {
        status: false,
        statusCode: 500,
        message: err.message,
      },
      data: null,
    });
  }
};
