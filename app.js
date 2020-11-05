const express = require("express");
const { MONGO_URL } = require("./utils/config");
const app = express();
const mongoose = require("mongoose");
const userRouter = require("./routes/users");
const cart = require("./routes/cart");
const products = require("./routes/products");
const categories = require("./routes/category");
const order = require("./routes/order");
const reviews = require("./routes/review");
const address = require("./routes/address");
const stripe = require("./routes/payment");
const errorHandler = require("./middleware/error");
const { authenticateJwt } = require("./middleware/auth");

mongoose
  .connect(MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.log("Error connecting to the database", err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authenticateJwt);

app.use("/api/users", userRouter);
app.use("/api/cart", cart);
app.use("/api/products", products);
app.use("/api/category", categories);
app.use("/api/orders", order);
app.use("/api/reviews", reviews);
app.use("/api/address", address);
app.use("/api/stripe", stripe);

app.use(errorHandler);

module.exports = app;
