import { Request, Response, NextFunction } from "express";
import * as Yup from "yup";
import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { TLogin, TRegister } from "../interfaces/auth.types";
import { IUserRequest } from "../interfaces/user.interface";
import { ApiResponse } from "../utils/ApiResponse";
import { AppError } from "../utils/AppError";

const registerValidateSchema = Yup.object({
  fullname: Yup.string().required(),
  username: Yup.string().required(),
  email: Yup.string().required(),
  password: Yup.string()
    .required()
    .min(6, "password must be at least 6 characters")
    .test("at-least-one-uppercase-letter", "password must contain at least one capital letter", (value) => {
      if (!value) {
        return false;
      }

      const regex = /^(?=.*[A-Z])/;

      return regex.test(value);
    })
    .test("at-least-one-number", "password must contain at least one number", (value) => {
      if (!value) {
        return false;
      }

      const regex = /^(?=.*\d)/;

      return regex.test(value);
    }),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password"), ""], "password not match!"),
});

export default {
  async register(req: Request, res: Response, next: NextFunction) {
    /**
      #swagger.tags = ["Auth"]
      #swagger.requestBody = {
        required: true,
        schema: {$ref: "#/components/schemas/RegisterRequest"}
      }
    */

    const { fullname, username, email, password, confirmPassword } = req.body as TRegister;

    try {
      await registerValidateSchema.validate({ fullname, username, email, password, confirmPassword });

      const response = await UserModel.create({ fullname, username, email, password });

      return ApiResponse.success(res, true, 200, "registration successful", response);
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    /**
      #swagger.tags = ["Auth"]
      #swagger.requestBody = {
        required: true,
        schema: {$ref: "#/components/schemas/LoginRequest"}
      }
     */

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
        isActive: true,
      });

      if (!userByIdentifier) {
        throw new AppError("user not found", 404);
      }

      const validatedPassword: boolean = encrypt(password) === userByIdentifier.password;

      if (!validatedPassword) {
        throw new AppError("user not found", 404);
      }

      const token = generateToken({
        id: userByIdentifier._id,
        role: userByIdentifier.role,
      });

      return ApiResponse.success(res, true, 200, "login successfully", { token });
    } catch (error) {
      next(error);
    }
  },

  async me(req: IUserRequest, res: Response, next: NextFunction) {
    /**
      #swagger.tags = ["Auth"]
      #swagger.security = [{
        "bearerAuth": []
      }]
    */

    const user = req.user;

    try {
      const response = await UserModel.findById(user?.id);

      return ApiResponse.success(res, true, 200, "get user profile successfully", response);
    } catch (error) {
      next(error);
    }
  },

  async activation(req: Request, res: Response, next: NextFunction) {
    /**
      #swagger.tags = ["Auth"]
      #swagger.requestBody = {
        required: true,
        schema: {$ref: "#/components/schemas/ActivationRequest"}
      }
    */

    const { code } = req.body as { code: string };

    try {
      const response = await UserModel.findOneAndUpdate(
        {
          activationCode: code,
        },
        {
          isActive: true,
        },
        {
          new: true,
        }
      );

      return ApiResponse.success(res, true, 200, "user has been successfully activated", response);
    } catch (error) {
      next(error);
    }
  },
};
