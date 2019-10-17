const fs = require("fs");
const express = require("express");
const morgan = require("morgan");
// const bodyParser = require("body-parser");

const app = express();

/*** MIDDLEWARES ***/
app.use(morgan("dev"));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));

/*** ROUTE HANLDERS ***/
require("./routes/tourRoutes")(app);

/*** APP LISTENER ***/
app.listen(3000, () => console.log("🚀 Server is running on port 3000"));
