const fs = require("fs");
const express = require("express");
// const bodyParser = require("body-parser");

const app = express();
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));

require("./routes/tourRoutes")(app);

app.listen(3000, () => console.log("🚀 Server is running on port 3000"));
