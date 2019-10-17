const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) =>
  res
    .status(200)
    .json({ app: "traveko", message: "Hello from the server side" })
);

app.post("/", (req, res) => res.send("You can post to this endpoint."));

app.listen(3000, () => console.log("🚀 Server is running on port 3000"));
