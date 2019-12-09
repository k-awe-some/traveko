import { Document } from "mongoose";
import { Request, Response, NextFunction } from "express";

import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";

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
