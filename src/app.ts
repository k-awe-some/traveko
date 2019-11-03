import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

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

// serve static fiels
// app.use(express.static(`${__dirname}/public`))

/*** ROUTE HANLDERS ***/
reviewRoutes(app);
tourRoutes(app);
userRoutes(app);
unhandledRoutes(app);

export default app;
