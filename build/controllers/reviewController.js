"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var reviews = JSON.parse(fs_1.default.readFileSync(__dirname + "/../../dev-data/data/reviews.json", encodeURI("")));
exports.getAllReviews = function (req, res) {
    return res.status(200).json({
        status: "success",
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
            data: { review: review }
        })
        : res.status(404).json({
            status: "failure",
            message: "Invalid ID"
        });
};
