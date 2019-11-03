import { getAllUsers, getUser } from "../controllers/userController";
import {
  signup,
  login,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword
} from "../controllers/authController";
import { updateMe, deleteMe } from "../controllers/userController";

// @ts-ignore
const userRoutes = app => {
  app.post("/api/v1/users/signup", signup);
  app.post("/api/v1/users/login", login);

  app.post("/api/v1/users/forgotPassword", forgotPassword);
  app.patch("/api/v1/users/resetPassword/:token", resetPassword);

  app.patch("/api/v1/users/updateMyPassword", protect, updatePassword);

  app.patch("/api/v1/users/updateMe", protect, updateMe);
  app.delete("/api/v1/users/deleteMe", protect, deleteMe);

  app.route("/api/v1/users").get(getAllUsers);

  app.route("/api/v1/users/:id").get(getUser);
};

export default userRoutes;
