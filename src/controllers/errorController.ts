import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import { Err } from "./controllers.types";

const handleCastErrorDB = (err: Err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: Err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
  const message = `Duplicate field value: ${value[0]}. Please use another value.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: Err) => {
  const errors = Object.values(err.errors).map((error: Err) => error.message);
  const message = `Invalid input data. ${errors.join(". ")}.`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid token. Please log in again.", 401);

const handleTokenExpiredError = () =>
  new AppError("Expired token. Please log in again.", 401);

const sendErrorDev = (err: Err, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err: Err, res: Response) => {
  err.isOperational
    ? res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      })
    : res.status(500).json({
        status: "error",
        message: "Something went wrong"
      });
};

export const globalErrorHandler = (
  err: Err,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err } as Err;

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleTokenExpiredError();

    sendErrorProd(error, res);
  }
};
