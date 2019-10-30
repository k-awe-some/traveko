import { Request, Response, NextFunction } from "express";
import { promisify } from "util";
import jwt from "jsonwebtoken";
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
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAt: req.body.passwordChangedAt
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

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1. Get token && check if it exist
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2. Verify token
    if (!token) return next(new AppError("Please log in to get access", 401));
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3. Check if user still exists
    // @ts-ignore
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) return next(new AppError("User no longer exists", 401));

    // 4. Check if user changed password after JWT was issued
    // @ts-ignore
    if (currentUser.changedPasswordAfter(decoded.iat))
      return next(new AppError("Password was recently changed", 401));

    // IF ALL PASSED --> GRANT ACCESS TO PROTECTED ROUTES
    req.user = currentUser;
    next();
  }
);
