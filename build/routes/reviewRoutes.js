"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reviewController_1 = require("../controllers/reviewController");
var reviewRoutes = function (app) {
    app.get("/api/v1/reviews", reviewController_1.getAllReviews);
    app.get("/api/v1/reviews/:id", reviewController_1.getReview);
};
exports.default = reviewRoutes;
