import express from "express";
const router = express.Router({ mergeParams: true });

import * as authController from "../controllers/authController";
import * as reviewController from "../controllers/reviewController";

router.use(authController.protect);

// all redirected routes will be matched with this route
router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictedTo("user"),
    reviewController.setTourAndUserIds,
    reviewController.createReview
  );

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(
    authController.restrictedTo("user", "admin"),
    reviewController.updateReview
  )
  .delete(
    authController.restrictedTo("user", "admin"),
    reviewController.deleteReview
  );

export default router;
