import { Response, NextFunction } from "express";
import { IUserRequest } from "../interfaces/user.interface";

export default function (roles: string[]) {
  return (req: IUserRequest, res: Response, next: NextFunction) => {
    const role = req.user?.role;

    if (!role || !roles.includes(role)) {
      res.status(403).json({
        message: "forbidden!",
        data: null,
      });
    }
    next();
  };
}
