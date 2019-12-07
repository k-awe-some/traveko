import express from "express";
const router = express.Router();

import * as authController from "../controllers/authController";
import * as reviewController from "../controllers/reviewController";

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictedTo("user"),
    reviewController.createReview
  );

export default router;
