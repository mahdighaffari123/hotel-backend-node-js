const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Dotenv config
dotenv.config({ path: "./config.env" });

const app = require("./app");
const { getLogger } = require("nodemailer/lib/shared");

const DB = process.env.DATABASE;

//todo add password to database
//todo implement eslint
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("connection to DB was successfull");
  });

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
