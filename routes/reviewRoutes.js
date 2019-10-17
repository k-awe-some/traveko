const fs = require("fs");

module.exports = app => {
  const reviews = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/reviews.json`)
  );

  app.get("/api/v1/reviews", (req, res) => {
    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: reviews.length,
      data: { reviews }
    });
  });

  app.get("/api/v1/reviews/:id", (req, res) => {
    const id = req.params.id;
    const review = reviews.find(review => review._id === id);

    if (!review) {
      return res.status(404).json({
        status: "failure",
        requestedAt: req.requestTime,
        message: "Invalid ID"
      });
    }

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      data: { review }
    });
  });
};
