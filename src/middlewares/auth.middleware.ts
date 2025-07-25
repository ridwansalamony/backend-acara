import { Request, Response, NextFunction } from "express";
import { getUserData, IUserToken } from "../utils/jwt";
export interface IUserRequest extends Request {
  user?: IUserToken;
}

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
