import { Request, Response, NextFunction } from "express";
import * as Yup from "yup";
import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IUserRequest } from "../middlewares/auth.middleware";

type TRegister = {
  fullname: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type TLogin = {
  identifier: string;
  password: string;
};

const registerValidateSchema = Yup.object({
  fullname: Yup.string().required(),
  username: Yup.string().required(),
  email: Yup.string().required(),
  password: Yup.string().required(),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password"), ""], "password not match!"),
});

export default {
  async register(req: Request, res: Response, next: NextFunction) {
    const { fullname, username, email, password, confirmPassword } = req.body as TRegister;

    try {
      await registerValidateSchema.validate({ fullname, username, email, password, confirmPassword });

      const response = await UserModel.create({ fullname, username, email, password });

      res.status(200).json({
        message: "success registration!",
        data: response,
      });
    } catch (error) {
      const err = error as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    const { identifier, password } = req.body as TLogin;
    try {
      const userByIdentifier = await UserModel.findOne({
        $or: [
          {
            email: identifier,
          },
          {
            username: identifier,
          },
        ],
      });

      if (!userByIdentifier) {
        return res.status(403).json({
          message: "user not found!",
          data: null,
        });
      }

      const validatedPassword: boolean = encrypt(password) === userByIdentifier.password;

      if (!validatedPassword) {
        return res.status(403).json({
          message: "user not found!",
          data: null,
        });
      }

      const token = generateToken({
        id: userByIdentifier._id,
        role: userByIdentifier.role,
      });

      res.status(200).json({
        message: "login successful!",
        data: token,
      });
    } catch (error) {
      const err = error as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },

  async me(req: IUserRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const response = await UserModel.findById(user?.id);

      res.status(200).json({
        message: "get user profile successful!",
        data: response,
      });
    } catch (error) {
      const err = error as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },
};
