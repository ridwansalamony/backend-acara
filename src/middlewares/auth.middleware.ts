import { Response, NextFunction } from "express";
import { getUserData } from "../utils/jwt";
import { IUserRequest } from "../interfaces/user.interface";

export default (req: IUserRequest, res: Response, next: NextFunction) => {
  const authorization = req.headers?.authorization!;

  if (!authorization) {
    res.status(403).json({
      message: "unauthorized!",
      data: null,
    });
  }

  const [prefix, token] = authorization.split(" ");

  if (!(prefix === "Bearer" && token)) {
    res.status(403).json({
      message: "unauthorized!",
      data: null,
    });
  }

  const user = getUserData(token);

  if (!user) {
    res.status(403).json({
      message: "unauthorized!",
      data: null,
    });
  }

  req.user = user;

  next();
};
