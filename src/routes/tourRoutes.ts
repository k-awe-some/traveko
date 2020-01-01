import express from "express";
const router = express.Router();

import * as tourController from "../controllers/tourController";
import * as authController from "../controllers/authController";
import * as reviewController from "../controllers/reviewController";
import reviewRouter from "./reviewRoutes";

// redirect this route pattern to reviewRouter
router.use("/:id/reviews", reviewRouter);

// aliases
router.get(
  "/top-5-tours",
  tourController.aliasTopTours,
  tourController.getAllTours
);

// stats
router.get("/tour-stats", tourController.getTourStats);
router.get(
  "/monthly-plan/:year",
  authController.protect,
  authController.restrictedTo("admin", "lead-guide", "guide"),
  tourController.getMonthlyPlan
);

router
  .route("/")
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictedTo("admin", "lead-guide"),
    tourController.createTour
  );

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictedTo("admin", "lead-guide"),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictedTo("admin", "lead-guide"),
    tourController.deleteTour
  );

export default router;
