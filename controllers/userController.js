const fs = require("fs");

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);

exports.getAllUsers = (req, res) =>
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: users.length,
    data: { users }
  });

exports.getUser = (req, res) => {
  const id = req.params.id;
  const user = users.find(user => user._id === id);

  user
    ? res.status(200).json({
        status: "success",
        requestedAt: req.requestTime,
        data: { user }
      })
    : res.status(404).json({
        status: "failure",
        requestedAt: req.requestTime,
        message: "Invalid ID"
      });
};
