import { Response } from "express";
import { IUserRequest } from "../interfaces/user.interface";
import uploader from "../utils/uploader";

export default {
  async single(req: IUserRequest, res: Response) {
    const file = req.file as Express.Multer.File;

    if (!file) {
      return res.status(400).json({
        message: "file is not exist",
        data: null,
      });
    }

    try {
      const response = await uploader.uploadSingle(file);

      res.status(200).json({
        message: "upload success",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        message: "failed to upload file!",
        data: null,
      });
    }
  },

  async multiple(req: IUserRequest, res: Response) {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({
        message: "files are not exist",
        data: null,
      });
    }

    try {
      const response = await uploader.uploadMultiple(files);

      res.status(200).json({
        message: "upload success",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        message: "failed to upload files!",
        data: null,
      });
    }
  },

  async delete(req: IUserRequest, res: Response) {
    try {
      const { fileUrl } = req.body as { fileUrl: string };

      const response = await uploader.delete(fileUrl);

      res.status(200).json({
        message: "delete file success",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        message: "failed to delete files!",
        data: null,
      });
    }
  },
};
