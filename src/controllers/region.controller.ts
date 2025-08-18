import { Request, Response, NextFunction } from "express";
import RegionModel from "../models/region.model";
import { ApiResponse } from "../utils/ApiResponse";

export default {
  async findByCity(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.query;

      const response = await RegionModel.findByCity(`${name}`);

      return ApiResponse.success(res, true, 200, "get region by city name successfully", response);
    } catch (error) {
      next(error);
    }
  },

  async getAllProvinces(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await RegionModel.getAllProvinces();

      return ApiResponse.success(res, true, 200, "get all provinces successfully", response);
    } catch (error) {
      next(error);
    }
  },

  async getProvince(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const response = await RegionModel.getProvince(Number(id));

      return ApiResponse.success(res, true, 200, "get the province successfully", response);
    } catch (error) {
      next(error);
    }
  },

  async getRegency(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const response = await RegionModel.getRegency(Number(id));

      return ApiResponse.success(res, true, 200, "get the regency successfully", response);
    } catch (error) {
      next(error);
    }
  },

  async getDistrict(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const response = await RegionModel.getDistrict(Number(id));

      return ApiResponse.success(res, true, 200, "get the district successfully", response);
    } catch (error) {
      next(error);
    }
  },

  async getVillage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const response = await RegionModel.getVillage(Number(id));

      return ApiResponse.success(res, true, 200, "get the village successfully", response);
    } catch (error) {
      next(error);
    }
  },
};
