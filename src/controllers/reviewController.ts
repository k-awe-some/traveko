import fs from "fs";
import { Request, Response, NextFunction } from "express";

import Review from "../models/reviewModel";

import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";

export const getAllReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const reviews = await Review.find();

    res.status(200).json({
      status: "success",
      results: reviews.length,
      data: { reviews }
    });
  }
);

export const getReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const review = await Review.findById(req.params.id);

    if (!review) return next(new AppError("No review found with that ID", 404));

    res.status(200).json({
      status: "success",
      data: { review }
    });
  }
);

export const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newReview = await Review.create(req.body);

    res.status(201).json({
      status: "success",
      data: { review: newReview }
    });
  }
);
