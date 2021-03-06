import fs from "fs";
import { Request, Response, NextFunction } from "express";

import Review from "../models/reviewModel";
import * as factory from "./handlerFactory";

// import catchAsync from "../utils/catchAsync";
// import AppError from "../utils/AppError";

// middleware to set IDs before creating a  review
export const setTourAndUserIds = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.forTour) req.body.forTour = req.params.id;
  // @ts-ignore
  if (!req.body.writtenBy) req.body.writtenBy = req.user.id;
  next();
};

export const getReview = factory.getOne(Review);
export const getAllReviews = factory.getAll(Review);
export const createReview = factory.createOne(Review);
export const updateReview = factory.updateOne(Review);
export const deleteReview = factory.deleteOne(Review);
