import fs from "fs";
import { Request, Response, NextFunction } from "express";
import Tour from "../models/tourModel";
import APIFeatures from "../utils/APIFeatures";
import AppError from "../utils/AppError";
import { Err } from "./controllers.types";
import catchAsync from "../utils/catchAsync";

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

// GET requests
export const getAllTours = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // BUILDING QUERY (by chaining all the methods)
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limit()
      .paginate();

    // EXECUTING QUERY
    const tours = await features.query;

    // SENDING RESPONSE
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: { tours }
    });
  }
);

export const getTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await Tour.findById(req.params.id).populate("reviews");

    tour
      ? res.status(200).json({
          status: "success",
          data: { tour }
        })
      : next(new AppError("No tour found with that ID", 404));
  }
);

// POST requests
export const createTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      data: { tour: newTour }
    });
  }
);

// PATCH requests
export const updateTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    tour
      ? res.status(200).json({
          status: "success",
          data: { tour }
        })
      : next(new AppError("No tour found with that ID", 404));
  }
);

// DELETE requests
export const deleteTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    tour
      ? res.status(204).json({
          status: "success",
          data: null
        })
      : next(new AppError("No tour found with that ID", 404));
  }
);

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
