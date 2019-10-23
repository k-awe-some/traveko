import fs from "fs";
import { Request, Response, NextFunction } from "express";
import Tour from "../models/tourModel";
import APIFeatures from "../utils/APIFeatures";

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
export const getAllTours = async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: "failure",
      message: error
    });
  }
};

export const getTour = async (req: Request, res: Response) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: { tour }
    });
  } catch (error) {
    res.status(404).json({
      status: "failure",
      message: error
    });
  }
};

// POST requests
export const createTour = async (req: Request, res: Response) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      data: { tour: newTour }
    });
  } catch (error) {
    res.status(400).json({
      status: "failure",
      message: error
    });
  }
};

// PATCH requests
export const updateTour = async (req: Request, res: Response) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: "success",
      data: { tour }
    });
  } catch (error) {
    res.status(404).json({
      status: "failure",
      message: error
    });
  }
};

// DELETE requests
export const deleteTour = async (req: Request, res: Response) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null
    });
  } catch (error) {
    res.status(404).json({
      status: "failure",
      message: error
    });
  }
};

// AGGREGATION PIPELINE
export const getTourStats = async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: "failure",
      message: error
    });
  }
};

export const getMonthlyPlan = async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: "failure",
      message: error
    });
  }
};
