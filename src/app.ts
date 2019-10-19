import express from "express";
import morgan from "morgan";

import reviewRoutes from "./routes/reviewRoutes";
import tourRoutes from "./routes/tourRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();

/*** MIDDLEWARES ***/
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

/*** ROUTE HANLDERS ***/
reviewRoutes(app);
tourRoutes(app);
userRoutes(app);

export default app;
