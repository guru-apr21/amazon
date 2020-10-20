require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRouter = require("./routes/users");
const login = require("./routes/auth");
const cart = require("./routes/cart");

mongoose.connect(
  "mongodb+srv://guru-apr21:guru-apr21@contact-keeper.dawpv.mongodb.net/amazon?retryWrites=true&w=majority",
  { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true },
  () => {
    console.log("Connected to the database");
  }
);

app.use(express.json());
app.use("/api/register", userRouter);
app.use("/api/login", login);
app.use("/api/cart", cart);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
