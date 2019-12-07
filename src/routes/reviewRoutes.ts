import {
  getAllReviews,
  getReview,
  createReview
} from "../controllers/reviewController";
import { protect, restrictedTo } from "../controllers/authController";

const reviewRoutes = (app: any) => {
  app
    .route("/api/v1/reviews/")
    .get(getAllReviews)
    .post(protect, restrictedTo("user"), createReview);
};

export default reviewRoutes;
