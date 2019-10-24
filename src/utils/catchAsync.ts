import { Request, Response, NextFunction } from "express";
import { Err } from "../controllers/controllers.types";

// @ts-ignore
const catchAsync = fn => {
  return (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch((err: Err) => next(err));
};

export default catchAsync;
