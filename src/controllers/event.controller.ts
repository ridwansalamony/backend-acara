import { Request, Response, NextFunction } from "express";
import { IUserRequest } from "../interfaces/user.interface";
import { TEvent } from "../interfaces/event.interface";
import EventModel, { eventDAO } from "../models/event.model";
import { ApiResponse } from "../utils/ApiResponse";
import { FilterQuery } from "mongoose";
import { TPaginationQuery } from "../interfaces/page.types";

export default {
  async create(req: IUserRequest, res: Response, next: NextFunction) {
    try {
      const request = { ...req.body, createdBy: req.user?.id } as TEvent;

      await eventDAO.validate(request);

      const response = await EventModel.create(request);

      return ApiResponse.success(res, true, 200, "created an event successfully", response);
    } catch (error) {
      next(error);
    }
  },

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };

      const response = await EventModel.findById(id);

      return ApiResponse.success(res, true, 200, "get an event by id successful", response);
    } catch (error) {
      next(error);
    }
  },

  async findOneBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params as { slug: string };

      const response = await EventModel.findOne({ slug });

      return ApiResponse.success(res, true, 200, "get an event by slug successful", response);
    } catch (error) {
      next(error);
    }
  },

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, search } = req.query as unknown as TPaginationQuery;

      const query: FilterQuery<TEvent> = {};

      if (search) {
        Object.assign(query, {
          ...query,
          $text: {
            $search: search,
          },
        });
      }

      const response = await EventModel.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();

      const countPage = await EventModel.countDocuments(query);

      return ApiResponse.success(res, true, 200, "get all events successfully", response, { current: page, totalPages: Math.ceil(countPage / limit), total: countPage });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };

      const response = await EventModel.findByIdAndUpdate(id, { new: true });

      return ApiResponse.success(res, true, 200, "event updated successful", response);
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };

      const response = await EventModel.findByIdAndDelete(id);

      return ApiResponse.success(res, true, 200, "event deleted successfully", response);
    } catch (error) {
      next(error);
    }
  },
};
