import { getAllTours, getTour } from "../controllers/tourController";

const tourRoutes = (app: any) => {
  // app.param("id", checkTourID); // no longer needed but was a good example on how to run this middleware in this case
  app.get("/api/v1/tours", getAllTours);
  app.get("/api/v1/tours/:id", getTour);
};

export default tourRoutes;
