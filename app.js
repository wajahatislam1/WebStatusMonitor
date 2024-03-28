const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// Load environment variables from .env file
require("dotenv").config();
const port = process.env.PORT || 3000;

//Load routes
const usersRoutes = require("./src/routes/users");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Attaching routes to the app
app.use("/users", usersRoutes);

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });

  return;
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
