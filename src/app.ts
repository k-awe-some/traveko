import express from "express";
import morgan from "morgan";

import reviewRoutes from "./routes/reviewRoutes";
import tourRoutes from "./routes/tourRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();

/*** MIDDLEWARES ***/
app.use(morgan("dev"));
app.use(express.json());

/*** ROUTE HANLDERS ***/
reviewRoutes(app);
tourRoutes(app);
userRoutes(app);

/*** APP LISTENER ***/
app.listen(3000, () => console.log("🚀 Server is running on port 3000"));
