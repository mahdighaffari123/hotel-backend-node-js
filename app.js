const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");

// Body Parser, Reading data from body into req.body
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

module.exports = app;
