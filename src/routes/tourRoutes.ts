import express from "express";
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

const tourRoutes = (app: any) => {
  app
    .route("/api/v1/tours")
    .get(getAllTours)
    .post(createTour);

  app
    .route("/api/v1/tours/:id")
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

  // aliases
  app.route("/api/v1/tours/top-5-tours").get(aliasTopTours, getAllTours);

  // stats
  app.route("/api/v1/tours/tour-stats").get(getTourStats);
  app.route("/api/v1/tours/monthly-plan/:year").get(getMonthlyPlan);
};

export default tourRoutes;
