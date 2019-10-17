const userController = require("../controllers/userController");

module.exports = app => {
  app.get("/api/v1/users", userController.getAllUsers);
  app.get("/api/v1/users/:id", userController.getUser);
};
