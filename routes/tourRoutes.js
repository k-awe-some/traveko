const fs = require("fs");

module.exports = app => {
  const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
  );

  app.get("/api/v1/tours", (req, res) => {
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: { tours }
    });
  });

  app.get("/api/v1/tours/:id", (req, res) => {
    const id = Number(req.params.id);
    const tour = tours.find(tour => tour.id === id);

    if (!tour) {
      return res.status(404).json({
        status: "failure",
        message: "Invalid ID"
      });
    }

    res.status(200).json({
      status: "success",
      data: { tour }
    });
  });
};
