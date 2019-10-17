const fs = require("fs");

module.exports = app => {
  const users = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
  );

  app.get("/api/v1/users", (req, res) => {
    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: users.length,
      data: { users }
    });
  });

  app.get("/api/v1/users/:id", (req, res) => {
    const id = req.params.id;
    const user = users.find(user => user._id === id);

    if (!user) {
      return res.status(404).json({
        status: "failure",
        requestedAt: req.requestTime,
        message: "Invalid ID"
      });
    }

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      data: { user }
    });
  });
};
