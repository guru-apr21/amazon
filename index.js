require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRouter = require("./routes/users");
const cart = require("./routes/cart");
const products = require("./routes/products");
const categories = require("./routes/category");
const order = require("./routes/order");
const errorHandler = require("./middleware/error");

mongoose.connect(
  "mongodb+srv://guru-apr21:guru-apr21@contact-keeper.dawpv.mongodb.net/amazon?retryWrites=true&w=majority",
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  () => {
    console.log("Connected to the database");
  }
);

app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/cart", cart);
app.use("/api/products", products);
app.use("/api/category", categories);
app.use("/api/orders", order);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
