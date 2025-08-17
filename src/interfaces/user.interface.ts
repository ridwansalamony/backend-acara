import { Request } from "express";
import { Types } from "mongoose";

export interface IUser {
  fullname: string;
  username: string;
  email: string;
  password: string;
  role: string;
  profilePicture: string;
  isActive: boolean;
  activationCode: string;
  createdAt?: string;
}

export interface IUserToken extends Omit<IUser, "fullname" | "username" | "email" | "password" | "profilePicture" | "isActive" | "activationCode"> {
  id: Types.ObjectId;
}

export interface IUserRequest extends Request {
  user?: IUserToken;
}
