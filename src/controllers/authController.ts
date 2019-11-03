import { Request, Response, NextFunction } from "express";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/userModel";
import catchAsync from "../utils/catchAsync";
import signToken from "../utils/signToken";
import sendEmail from "../utils/sendEmail";
import AppError from "../utils/AppError";
import { UserDoc, DecodedToken } from "../models/models.types";
import { CookieOptions } from "./controllers.types";

const createSendToken = (user: UserDoc, statusCode: number, res: Response) => {
  const token = signToken(user._id);
  const cookieOptions: CookieOptions = {
    expires: new Date(
      // @ts-ignore
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);
  // remove password from outputs
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: { user }
  });
};

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAt: req.body.passwordChangedAt,
      role: req.body.role
    });

    createSendToken(newUser, 201, res);
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
    createSendToken(user, 200, res);
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
    const decoded = (await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    )) as DecodedToken;

    // 3. Check if user still exists
    // @ts-ignore
    const currentUser: UserDoc = await User.findById(decoded.id);
    if (!currentUser) return next(new AppError("User no longer exists", 401));

    // 4. Check if user changed password after JWT was issued
    if (currentUser.changedPasswordAfter(decoded.iat))
      return next(new AppError("Password was recently changed", 401));

    // IF ALL PASSED --> GRANT ACCESS TO PROTECTED ROUTES
    // @ts-ignore
    req.user = currentUser;
    next();
  }
);

export const restrictedTo = (...roles: Array<string>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    if (!roles.includes(req.user.role))
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );

    next();
  };
};

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1. Get user based on posted email
    const user: UserDoc = await User.findOne({ email: req.body.email });
    if (!user)
      return next(
        new AppError("There is no user with that email address", 404)
      );

    // 2. Generate the random token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3. Send token to user's email
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to ${resetURL}.\nIf you didn't forget your password, please ignore this email.`;

    try {
      await sendEmail({
        email: req.body.email,
        subject: "Your password reset token (valid for 10 min)",
        message
      });

      res.status(200).json({
        status: "success",
        message: "Token sent to email"
      });
    } catch (err) {
      console.log(err);
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new AppError(
          "There was an error sending the email. Please try again later.",
          500
        )
      );
    }
  }
);

export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1. Get user based on token
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user: UserDoc = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    // 2. If token has not expired && there is user, set new password
    if (!user)
      return next(new AppError("Token is invalid or has expired", 400));
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    // 3. Update passwordChangedAt property for user (done in userSchema)
    // 4. Log user in, send jwt
    createSendToken(user, 200, res);
  }
);

export const updatePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1. Get user from collection
    // @ts-ignore
    const user: UserDoc = await User.findById(req.user.id).select("+password");

    // 2. Check if POSTed password is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password)))
      return next(new AppError("Your current password is incorrect", 401));

    // 3. Update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // 4. Log user in, send jwt
    createSendToken(user, 200, res);
  }
);
