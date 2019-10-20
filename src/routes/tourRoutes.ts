import express from "express";
import {
  aliasTopTours,
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour
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
};

export default tourRoutes;
