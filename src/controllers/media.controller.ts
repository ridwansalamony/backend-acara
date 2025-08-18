import { NextFunction, Response } from "express";
import { IUserRequest } from "../interfaces/user.interface";
import uploader from "../utils/uploader";
import { AppError } from "../utils/AppError";
import { ApiResponse } from "../utils/ApiResponse";

export default {
  async single(req: IUserRequest, res: Response, next: NextFunction) {
    const file = req.file as Express.Multer.File;

    if (!file) {
      throw new AppError("file does not exist", 400);
    }

    try {
      const response = await uploader.uploadSingle(file);

      return ApiResponse.success(res, true, 200, "upload successful", response);
    } catch (error) {
      next(error);
    }
  },

  async multiple(req: IUserRequest, res: Response, next: NextFunction) {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      throw new AppError("file does not exist", 400);
    }

    try {
      const response = await uploader.uploadMultiple(files);

      return ApiResponse.success(res, true, 200, "upload successful", response);
    } catch (error) {
      next(error);
    }
  },

  async delete(req: IUserRequest, res: Response, next: NextFunction) {
    try {
      const { fileUrl } = req.body as { fileUrl: string };

      const response = await uploader.delete(fileUrl);

      return ApiResponse.success(res, true, 200, "deleting files was successful", response);
    } catch (error) {
      next(error);
    }
  },
};
