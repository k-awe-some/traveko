import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import catchAsync from "../utils/catchAsync";
import signToken from "../utils/signToken";
import AppError from "../utils/AppError";
import { UserDoc } from "../models/models.types";

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: "success",
      token,
      data: { user: newUser }
    });
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // 1. Check if email && password exist
    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }
    // 2. Check if user exists && password is correct
    // explicitly select password: use '+' because password select is false in userModel
    const user: UserDoc = await User.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password)))
      return next(new AppError("Incorrect email and/or password", 401));

    // 3. If everything's ok, send token to client
    const token = signToken(user._id);
    res.status(200).json({
      status: "success",
      token
    });
  }
);
