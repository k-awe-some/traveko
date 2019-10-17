const fs = require("fs");

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getAllTours = (req, res) =>
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours }
  });

exports.getTour = (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find(tour => tour.id === id);

  tour
    ? res.status(200).json({
        status: "success",
        requestedAt: req.requestTime,
        data: { tour }
      })
    : res.status(404).json({
        status: "failure",
        requestedAt: req.requestTime,
        message: "Invalid ID"
      });
};
