import mongoose from "mongoose";
import dotenv from "dotenv";
import { Err } from "./controllers/controllers.types";

(process as NodeJS.EventEmitter).on("uncaughtException", err => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  process.exit(1);
});

dotenv.config({ path: `${__dirname}/../.env` });
import app from "./app";

const DB = process.env.MONGODB.replace("<password>", process.env
  .MONGODB_PASSWORD as string);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("🚀 Database connection successful");
  });

/*** APP LISTENER ***/
const port = process.env.PORT || 3000;

const server = app.listen(port, () =>
  console.log(`🚀 Server is running on port ${port}`)
);

/*** GLOBAL unhandledRejection HANDLER ***/
(process as NodeJS.EventEmitter).on("unhandledRejection", err => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION! 💥  Shutting down...");
  server.close(() => process.exit(1));
});
