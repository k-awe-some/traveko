import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
// @ts-ignore
import xss from "xss-clean";
import hpp from "hpp";

import reviewRouter from "./routes/reviewRoutes";
import tourRouter from "./routes/tourRoutes";
import userRouter from "./routes/userRoutes";

import AppError from "./utils/AppError";
import { globalErrorHandler } from "./controllers/errorController";

const app = express();

/*** GLOBAL MIDDLEWARES ***/
// set security HTTP headers
app.use(helmet());

// development log in
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// limit requests from same IP
const limiter = rateLimit({
  max: 500,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour."
});
app.use("/api", limiter);

// (body-parser) read data from body to req.body
app.use(express.json({ limit: "10kb" }));

// data sanitization against NoSQL query injection (filter out all $ signs from requests)
app.use(mongoSanitize());

// data sanitization agains XSS
app.use(xss());

// prevent parameter pollution & allow certain duplicate fields
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price"
    ]
  })
);

// serve static fields
// app.use(express.static(`${__dirname}/public`))

/*** ROUTE HANLDERS ***/
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// handle non-existing routes
app.all("*", (req: Request, res: Response, next: NextFunction) =>
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
);
app.use(globalErrorHandler);

export default app;
