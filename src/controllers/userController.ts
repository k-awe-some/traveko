import fs from "fs";
import { Request, Response, NextFunction } from "express";

import User from "../models/userModel";
import * as factory from "./handlerFactory";

import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";

export const getUser = factory.getOne(User);
export const getAllUsers = factory.getAll(User);
export const updateUser = factory.updateOne(User);
export const deleteUser = factory.deleteOne(User);

const filterObject = (
  obj: Request["body"],
  ...allowedFields: Array<string>
) => {
  let newObj = {};
  Object.keys(obj).forEach(el => {
    // @ts-ignore
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const updateMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.password || req.body.passwordConfirm)
      return next(
        new AppError(
          "This route is not for password updates, please use /updateMyPassword.",
          400
        )
      );

    // Filter out unwanted field names that are not allowed to be updated
    const filteredBody = filterObject(req.body, "name", "email");

    const updatedUser = await User.findByIdAndUpdate(
      // @ts-ignore
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser
      }
    });
  }
);

export const getMe = (req: Request, res: Response, next: NextFunction) => {
  //@ts-ignore
  req.params.id = req.user.id;
  next();
};

export const deleteMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // not deleting user, only marking user as inactive
    await User.findByIdAndUpdate(
      // @ts-ignore
      req.user.id,
      { active: false }
    );

    res.status(204).json({
      status: "success",
      data: null
    });
  }
);
