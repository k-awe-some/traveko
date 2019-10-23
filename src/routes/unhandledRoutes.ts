import { Request, Response, NextFunction } from "express";
import { globalErrorHandler } from "../controllers/errorController";
import AppError from "../utils/AppError";

const unhandledRoutes = (app: any) => {
  app
    .route("*")
    .all(
      (req: Request, res: Response, next: NextFunction) =>
        next(new AppError(`Can't find ${req.originalUrl} on this server`, 404)),
      globalErrorHandler
    );
};

export default unhandledRoutes;
