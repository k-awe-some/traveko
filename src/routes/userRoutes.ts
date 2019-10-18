import { getAllUsers, getUser } from "../controllers/userController";

const userRoutes = (app: any) => {
  app.get("/api/v1/users", getAllUsers);
  app.get("/api/v1/users/:id", getUser);
};

export default userRoutes;
