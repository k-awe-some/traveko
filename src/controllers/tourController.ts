import fs from "fs";
import { Request, Response, NextFunction } from "express";

import Tour from "../models/tourModel";
import { Err } from "./controllers.types";
import * as factory from "./handlerFactory";

import catchAsync from "../utils/catchAsync";
// import AppError from "../utils/AppError";

export const getTour = factory.getOne(Tour, { path: "reviews" });
export const getAllTours = factory.getAll(Tour);
export const createTour = factory.createOne(Tour);
export const updateTour = factory.updateOne(Tour);
export const deleteTour = factory.deleteOne(Tour);

export const aliasTopTours = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

// AGGREGATION PIPELINE
export const getTourStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          _id: { $toUpper: "$difficulty" },
          totalRatings: { $sum: "$ratingsQuantity" },
          totalTours: { $sum: 1 },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" }
        }
      }
      // { $sort: { avgPrice: 1 } }
      // { $match: { _id: { $ne: "EASY" } } }
    ]);

    res.status(200).json({
      status: "success",
      data: { stats }
    });
  }
);

export const getMonthlyPlan = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const year = Number(req.params.year);
    const plan = await Tour.aggregate([
      // $unwind: returns one element for each of the specified array field
      { $unwind: "$startDates" },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          totalStartTours: { $sum: 1 },
          tours: { $push: "$name" }
        }
      },
      { $addFields: { month: "$_id" } },
      { $project: { _id: 0 } },
      { $sort: { totalStartTours: -1 } }
    ]);

    res.status(200).json({
      status: "success",
      data: { plan }
    });
  }
);
