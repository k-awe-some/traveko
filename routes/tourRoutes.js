const tourController = require("../controllers/tourController");

module.exports = app => {
  app.get("/api/v1/tours", tourController.getAllTours);
  app.get("/api/v1/tours/:id", tourController.getTour);
};
