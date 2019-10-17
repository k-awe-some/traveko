const reviewController = require("../controllers/reviewController");

module.exports = app => {
  app.get("/api/v1/reviews", reviewController.getAllReviews);
  app.get("/api/v1/reviews/:id", reviewController.getReview);
};
