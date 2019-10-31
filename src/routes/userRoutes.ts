import { getAllUsers, getUser } from "../controllers/userController";
import {
  signup,
  login,
  forgotPassword,
  resetPassword
} from "../controllers/authController";

// @ts-ignore
const userRoutes = app => {
  app.post("/api/v1/users/signup", signup);
  app.post("/api/v1/users/login", login);

  app.post("/api/v1/users/forgotPassword", forgotPassword);
  app.patch("/api/v1/users/resetPassword/:token", resetPassword);

  app.route("/api/v1/users").get(getAllUsers);

  app.route("/api/v1/users/:id").get(getUser);
};

export default userRoutes;
