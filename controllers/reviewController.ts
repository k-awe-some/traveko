import { path } from "path";
import fs from "fs";

const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/reviews.json`)
);

export const getAllReviews = (req, res) =>
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: reviews.length,
    data: { reviews }
  });

export const getReview = (req, res) => {
  const id = req.params.id;
  const review = reviews.find(review => review._id === id);

  review
    ? res.status(200).json({
        status: "success",
        requestedAt: req.requestTime,
        data: { review }
      })
    : res.status(404).json({
        status: "failure",
        requestedAt: req.requestTime,
        message: "Invalid ID"
      });
};
