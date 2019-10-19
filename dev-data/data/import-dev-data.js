const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Tour = require("../../src/models/tourModel");

dotenv.config({ path: `${__dirname}/../../.env` });
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
    console.log("🚀 Database successfully connected");
  });

// READ JSON FILE
const tours = JSON.parse(
  fs.readFileSync(
    `${__dirname}/tours-simple.json`,
    encodeURI("")
  )
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("🎉 Data successfully loaded");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany({});
    console.log("🎉 Data successfully deleted");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// RUN ON COMMAND CONDITIONS
console.log(process.argv);
if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
