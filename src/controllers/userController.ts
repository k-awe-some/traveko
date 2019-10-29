import fs from "fs";
import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";

// const users = JSON.parse(
//   fs.readFileSync(`${__dirname}/../../dev-data/data/users.json`, encodeURI(""))
// );

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: { users }
  });
});

export const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);

    user
      ? res.status(200).json({
          status: "success",
          data: { user }
        })
      : next(new AppError("No user found with that ID", 404));
  }
);
