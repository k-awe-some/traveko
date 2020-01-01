import { Request, Response, NextFunction } from "express";

import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";
import APIFeatures from "../utils/APIFeatures";

export const getOne = (Model: any, populateOptions: any = null) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;
    doc
      ? res.status(200).json({
          status: "success",
          data: doc
        })
      : next(new AppError("No document found with that ID", 404));
  });

export const getAll = (Model: any) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // ALLOWING NESTED GET REVIEWS ON TOUR
    let filter = {};
    if (req.params.id) filter = { forTour: req.params.id };
    // BUILDING QUERY (by chaining all the methods)
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limit()
      .paginate();
    // EXECUTING QUERY
    // const docs = await features.query.explain();
    const docs = await features.query;
    // SENDING RESPONSE
    res.status(200).json({
      status: "success",
      results: docs.length,
      data: docs
    });
  });

export const createOne = (Model: any) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: doc
    });
  });

export const updateOne = (Model: any) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    doc
      ? res.status(200).json({
          status: "success",
          data: doc
        })
      : next(new AppError("No document found with that ID", 404));
  });

export const deleteOne = (Model: any) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    doc
      ? res.status(204).json({
          status: "success",
          data: null
        })
      : next(new AppError("No document found with that ID", 404));
  });
