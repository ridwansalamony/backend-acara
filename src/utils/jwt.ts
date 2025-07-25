import jwt from "jsonwebtoken";
import { IUser } from "../models/user.model";
import { SECRET } from "./env";
import { Types } from "mongoose";

export interface IUserToken extends Omit<IUser, "fullname" | "username" | "email" | "password" | "profilePicture" | "isActive" | "activationCode"> {
  id: Types.ObjectId;
}

export const generateToken = (user: IUserToken): string => {
  const token = jwt.sign(user, SECRET, {
    expiresIn: "1h",
  });
  return token;
};

export const getUserData = (token: string) => {
  const user = jwt.verify(token, SECRET) as IUserToken;
  return user;
};
