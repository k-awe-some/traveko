"use strict";
exports.__esModule = true;
var express_1 = require("express");
var morgan_1 = require("morgan");
// import * as tourRoutes from "./routes/tourRoutes";
// import * as userRoutes from "./routes/userRoutes";
var reviewRoutes_1 = require("./routes/reviewRoutes");
var app = express_1["default"]();
/*** MIDDLEWARES ***/
app.use(morgan_1["default"]("dev"));
app.use(function (req, res, next) {
    req.requestTime = new Date().toISOString();
    next();
});
app.use(express_1["default"].json());
/*** ROUTE HANLDERS ***/
// tourRoutes(app);
// userRoutes(app);
reviewRoutes_1["default"](app);
/*** APP LISTENER ***/
app.listen(3000, function () { return console.log("🚀 Server is running on port 3000"); });
