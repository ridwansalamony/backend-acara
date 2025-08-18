import { Request, Response, NextFunction } from "express";
import CategoryModel, { categoryDAO, TCategory } from "../models/category.model";
import { ApiResponse } from "../utils/ApiResponse";
import { TPaginationQuery } from "../interfaces/page.types";
import { FilterQuery } from "mongoose";

export default {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const createRequestValidated = await categoryDAO.validate(req.body as TCategory);

      const response = await CategoryModel.create(createRequestValidated);

      return ApiResponse.success(res, true, 200, "create a successful category", response);
    } catch (error) {
      next(error);
    }
  },

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };

      const response = await CategoryModel.findById(id);

      return ApiResponse.success(res, true, 200, "get category a by id successful", response);
    } catch (error) {
      next(error);
    }
  },

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, search } = req.query as unknown as TPaginationQuery;

      const query = {} as FilterQuery<TCategory>;

      if (search) {
        Object.assign(query, {
          $or: [
            {
              name: { $regex: search, $options: "i" },
            },
            {
              description: { $regex: search, $options: "i" },
            },
          ],
        });
      }

      const response = await CategoryModel.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();

      const countPage = await CategoryModel.countDocuments(query);

      return ApiResponse.success(res, true, 200, "get all categories successfully", response, { current: page, totalPages: Math.ceil(countPage / limit), total: countPage });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };

      const response = await CategoryModel.findByIdAndUpdate(id, req.body, { new: true });

      return ApiResponse.success(res, true, 200, "category update successful", response);
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };

      const response = await CategoryModel.findByIdAndDelete(id);

      return ApiResponse.success(res, true, 200, "deleting category was successful", response);
    } catch (error) {
      next(error);
    }
  },
};
