import {
  aliasTopTours,
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan
} from "../controllers/tourController";
import { protect, restrictedTo } from "../controllers/authController";

// @ts-ignore
const tourRoutes = app => {
  // aliases
  app.route("/api/v1/tours/top-5-tours").get(aliasTopTours, getAllTours);

  // stats
  app.route("/api/v1/tours/tour-stats").get(getTourStats);
  app.route("/api/v1/tours/monthly-plan/:year").get(getMonthlyPlan);

  app
    .route("/api/v1/tours")
    .get(protect, getAllTours)
    .post(createTour);

  app
    .route("/api/v1/tours/:id")
    .get(getTour)
    .patch(updateTour)
    .delete(protect, restrictedTo("admin", "lead-guide"), deleteTour);
};

export default tourRoutes;
