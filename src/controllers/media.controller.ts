import { NextFunction, Request, Response } from "express";
import uploader from "../utils/uploader";
import { AppError } from "../utils/AppError";
import { ApiResponse } from "../utils/ApiResponse";

export default {
  async single(req: Request, res: Response, next: NextFunction) {
    const file = req.file as Express.Multer.File;

    if (!file) {
      throw new AppError("file does not exist", 400);
    }

    try {
      const response = await uploader.uploadSingle(file);

      return ApiResponse.success(res, true, 200, "file uploaded successfully", response);
    } catch (error) {
      next(error);
    }
  },

  async multiple(req: Request, res: Response, next: NextFunction) {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      throw new AppError("file does not exist", 400);
    }

    try {
      const response = await uploader.uploadMultiple(files);

      return ApiResponse.success(res, true, 200, "file uploaded successfully", response);
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { fileUrl } = req.body as { fileUrl: string };

      const response = await uploader.delete(fileUrl);

      return ApiResponse.success(res, true, 200, "file deleted successfully", response);
    } catch (error) {
      next(error);
    }
  },
};
