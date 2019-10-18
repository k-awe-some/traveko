import { getAllReviews, getReview } from "../controllers/reviewController";

const reviewRoutes = app => {
  app.get("/api/v1/reviews", getAllReviews);
  app.get("/api/v1/reviews/:id", getReview);
};

export default reviewRoutes;
