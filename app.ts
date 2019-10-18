import express from "express";
import morgan from "morgan";

// import * as tourRoutes from "./routes/tourRoutes";
// import * as userRoutes from "./routes/userRoutes";
import reviewRoutes from "./routes/reviewRoutes";

const app = express();

/*** MIDDLEWARES ***/
app.use(morgan("dev"));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(express.json());

/*** ROUTE HANLDERS ***/
// tourRoutes(app);
// userRoutes(app);
reviewRoutes(app);

/*** APP LISTENER ***/
app.listen(3000, () => console.log("🚀 Server is running on port 3000"));
