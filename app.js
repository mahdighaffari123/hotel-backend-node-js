const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const hotelRoutes = require("./routes/hotelRoutes");
const globalErrorHandler = require("./controller/errorController");
// Body Parser, Reading data from body into req.body
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/hotels", hotelRoutes);

app.use(globalErrorHandler);

module.exports = app;
