import { Request, Response, NextFunction } from "express";
import * as Yup from "yup";
import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { TLogin, TRegister } from "../interfaces/auth.types";
import { IUserRequest } from "../interfaces/user.interface";

const registerValidateSchema = Yup.object({
  fullname: Yup.string().required(),
  username: Yup.string().required(),
  email: Yup.string().required(),
  password: Yup.string()
    .required()
    .min(6, "password must be at least 6 characters")
    .test("at-least-one-uppercase-letter", "contains at least one uppercase letter", (value) => {
      if (!value) {
        return false;
      }

      const regex = /^(?=.*[A-Z])/;

      return regex.test(value);
    })
    .test("at-least-one-number", "contains at least one number", (value) => {
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
  async register(req: Request, res: Response) {
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

  async login(req: Request, res: Response) {
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

  async me(req: IUserRequest, res: Response) {
    /**
      #swagger.tags = ["Auth"]
      #swagger.security = [{
        "bearerAuth": []
      }]
    */

    const user = req.user;

    try {
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

  async activation(req: Request, res: Response) {
    /**
      #swagger.tags = ["Auth"]
      #swagger.requestBody = {
        required: true,
        schema: {$ref: "#/components/schemas/ActivationRequest"}
      }
    */

    const { code } = req.body as { code: string };

    try {
      const user = await UserModel.findOneAndUpdate(
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

      res.status(200).json({
        message: "user successfully activated",
        data: user,
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
