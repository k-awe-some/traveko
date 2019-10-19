import mongoose from "mongoose";
import dotenv from "dotenv";
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

app.listen(port, () => console.log(`🚀 Server is running on port ${port}`));
