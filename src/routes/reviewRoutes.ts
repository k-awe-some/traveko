import express from "express";
const router = express.Router({ mergeParams: true });

import * as authController from "../controllers/authController";
import * as reviewController from "../controllers/reviewController";

// all redirected routes will be matched with this route
router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictedTo("user"),
    reviewController.createReview
  );

export default router;
