const fs = require("fs");

const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/reviews.json`)
);

exports.getAllReviews = (req, res) =>
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: reviews.length,
    data: { reviews }
  });

exports.getReview = (req, res) => {
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
