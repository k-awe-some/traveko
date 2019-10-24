import { getAllUsers, getUser } from "../controllers/userController";
import { signup } from "../controllers/authController";

// @ts-ignore
const userRoutes = app => {
  app.post("/api/v1/users/signup", signup);

  app.route("/api/v1/users").get(getAllUsers);

  app.route("/api/v1/users/:id", getUser);
};

export default userRoutes;
