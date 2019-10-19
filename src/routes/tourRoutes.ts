import {
  getAllTours,
  getTour,
  createTour,
  updateTour
} from "../controllers/tourController";

const tourRoutes = (app: any) => {
  // app.param("id", checkTourID); // no longer needed but was a good example on how to run this middleware in this case
  app.get("/api/v1/tours", getAllTours);
  app.get("/api/v1/tours/:id", getTour);
  app.post("/api/v1/tours", createTour);
  app.patch("/api/v1/tours/:id", updateTour);
};

export default tourRoutes;
