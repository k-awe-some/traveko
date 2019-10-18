import { getAllTours, getTour } from "../controllers/tourController";

const tourRoutes = (app: any) => {
  app.get("/api/v1/tours", getAllTours);
  app.get("/api/v1/tours/:id", getTour);
};

export default tourRoutes;
