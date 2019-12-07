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
router.get("/monthly-plan/:year", tourController.getMonthlyPlan);

router
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router.get("/:id", tourController.getTour);

export default router;
