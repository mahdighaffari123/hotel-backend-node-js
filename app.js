const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const bodyParser = require("body-parser");
const hotelRoutes = require("./routes/hotelRoutes");
const blogRoutes = require("./routes/blogRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const globalErrorHandler = require("./controller/errorController");
// Body Parser, Reading data from body into req.body
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//todo make dynamic routing
// Routes
app.use("/api/users", userRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/reviews", reviewRoutes);

app.use(globalErrorHandler);

module.exports = app;
