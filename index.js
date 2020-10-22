require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRouter = require("./routes/users");
const cart = require("./routes/cart");
const products = require("./routes/products");
const categories = require("./routes/category");

mongoose.connect(
  "mongodb+srv://guru-apr21:guru-apr21@contact-keeper.dawpv.mongodb.net/amazon?retryWrites=true&w=majority",
  { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true },
  () => {
    console.log("Connected to the database");
  }
);

app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/cart", cart);
app.use("/api/products", products);
app.use("/api/category", categories);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
