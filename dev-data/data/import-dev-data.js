const fs = require("fs");
const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/../../.env` });
const Tour = require(`${__dirname}/../../build/models/tourModel`).default;

const DB = process.env.MONGODB.replace(
  "<password>",
  process.env.MONGODB_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("🚀 Database successfully connected");
  })
  .catch(error => console.log("💥", error));

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));

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
// console.log(process.argv);
if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
