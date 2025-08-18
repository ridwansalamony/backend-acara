import { Response, NextFunction } from "express";
import { getUserData } from "../utils/jwt";
import { IUserRequest } from "../interfaces/user.interface";
import { AppError } from "../utils/AppError";

export default (req: IUserRequest, res: Response, next: NextFunction) => {
  const authorization = req.headers?.authorization!;

  if (!authorization) {
    throw new AppError("unauthorized", 401);
  }

  const [prefix, token] = authorization.split(" ");

  if (!(prefix === "Bearer" && token)) {
    throw new AppError("unauthorized", 401);
  }

  const user = getUserData(token);

  if (!user) {
    throw new AppError("unauthorized", 401);
  }

  req.user = user;

  next();
};
