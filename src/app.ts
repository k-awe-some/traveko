import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
// @ts-ignore
import xss from "xss-clean";

import reviewRoutes from "./routes/reviewRoutes";
import tourRoutes from "./routes/tourRoutes";
import userRoutes from "./routes/userRoutes";
import unhandledRoutes from "./routes/unhandledRoutes";

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

// serve static fiels
// app.use(express.static(`${__dirname}/public`))

/*** ROUTE HANLDERS ***/
reviewRoutes(app);
tourRoutes(app);
userRoutes(app);
unhandledRoutes(app);

export default app;
