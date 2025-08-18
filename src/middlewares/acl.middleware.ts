import { Response, NextFunction } from "express";
import { IUserRequest } from "../interfaces/user.interface";
import { AppError } from "../utils/AppError";

export default function (roles: string[]) {
  return (req: IUserRequest, res: Response, next: NextFunction) => {
    const role = req.user?.role;

    if (!role || !roles.includes(role)) {
      throw new AppError("forbidden", 403);
    }
    next();
  };
}
