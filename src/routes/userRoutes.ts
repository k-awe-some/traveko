import { getAllUsers, getUser } from "../controllers/userController";
import { signup, login } from "../controllers/authController";

// @ts-ignore
const userRoutes = app => {
  app.post("/api/v1/users/signup", signup);
  app.post("/api/v1/users/login", login);

  app.route("/api/v1/users").get(getAllUsers);

  app.route("/api/v1/users/:id").get(getUser);
};

export default userRoutes;
