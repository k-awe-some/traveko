import { getAllReviews, getReview } from "../controllers/reviewController";

const reviewRoutes = (app: any) => {
  app.get("/api/v1/reviews", getAllReviews);
  app.get("/api/v1/reviews/:id", getReview);
};

export default reviewRoutes;
