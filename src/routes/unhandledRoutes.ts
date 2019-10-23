import { Request, Response, NextFunction } from "express";
import { globalErrorHandler } from "../controllers/errorController";
import AppError from "../utils/AppError";

const unhandledRoutes = (app: any) => {
  app.all("*", (req: Request, res: Response, next: NextFunction) =>
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
  );
  app.use(globalErrorHandler);
};

export default unhandledRoutes;
