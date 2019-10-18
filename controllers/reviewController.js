"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var reviews = JSON.parse(fs_1["default"].readFileSync(__dirname + "/../dev-data/data/reviews.json"));
exports.getAllReviews = function (req, res) {
    return res.status(200).json({
        status: "success",
        requestedAt: req.requestTime,
        results: reviews.length,
        data: { reviews: reviews }
    });
};
exports.getReview = function (req, res) {
    var id = req.params.id;
    var review = reviews.find(function (review) { return review._id === id; });
    review
        ? res.status(200).json({
            status: "success",
            requestedAt: req.requestTime,
            data: { review: review }
        })
        : res.status(404).json({
            status: "failure",
            requestedAt: req.requestTime,
            message: "Invalid ID"
        });
};
