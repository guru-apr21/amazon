const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/User");
const Category = require("../models/Category");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

const user = {
  firstName: "Lokesh",
  lastName: "Prakash",
  password: "Subha@1987",
  email: "lokesh@gmail.com",
  admin: true,
};

const productObj = {
  title: "Iphone 11",
  description:
    "Maximize performance with Game Booster technology which gives smooth graphics, life-like motion and learns your usage patterns to optimize battery",
  price: 174999,
  brand: "Apple",
};

let token;
let product;
let category;
beforeEach(async () => {
  await User.deleteMany({});
  await Category.deleteMany({});
  await Product.deleteMany({});
  await Cart.deleteMany({});

  const response = await api.post("/api/users/signup").send(user);
  token = response.body.token;

  category = await api
    .post("/api/category")
    .set("Authorization", "Bearer " + token)
    .send({ title: "phones" });

  product = await api
    .post("/api/products")
    .set("Authorization", "Bearer " + token)
    .send({ ...productObj, categoryId: category.body._id });

  await api
    .post("/api/cart")
    .set("Authorization", "Bearer " + token)
    .send({
      productId: product.body._id,
      quantity: 4,
      title: "Iphone 11",
      price: 43000,
    });
});

describe("GET /", () => {
  it("empty cart are returned with status 204", async () => {
    await Cart.deleteMany({});
    const response = await api
      .get("/api/cart")
      .set("Authorization", "Bearer " + token)
      .expect(204);
  });

  it("Non empty cart returns 200", async () => {
    await api
      .get("/api/cart")
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

describe("POST /", () => {
  it("returns 200 if product added to the existing cart", async () => {
    const response = await api
      .post("/api/cart")
      .set("Authorization", "Bearer " + token)
      .send({
        productId: product.body._id,
        quantity: 9,
        title: "Iphone 11",
        price: 43000,
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(response.body.products[0]).toHaveProperty("quantity", 9);
  });

  it("Create new cart with items and returns 200", async () => {
    await Cart.deleteMany({});
    const response = await api
      .post("/api/cart")
      .set("Authorization", "Bearer " + token)
      .send({
        productId: product.body._id,
        quantity: 9,
        title: "Iphone 11",
        price: 43000,
      })
      .expect(201)
      .expect("Content-Type", /application\/json/);
    expect(response.body.products[0]).toHaveProperty("quantity", 9);
  });
});

describe("PUT /", () => {
  it("updates the products and returns 200", async () => {
    const response = await api
      .put("/api/cart")
      .set("Authorization", "Bearer " + token)
      .send({ id: product.body._id })
      .expect(200);
  });
});

describe("DELETE /", () => {
  it("if cart is empty already respond with 400 or no cart for the given user", async () => {
    await Cart.deleteMany({});
    await api
      .delete("/api/cart")
      .set("Authorization", "Bearer " + token)
      .expect(400)
      .expect('"Cart is empty already"');
  });

  it("returns 204 after emptying the cart", async () => {
    await api
      .delete("/api/cart")
      .set("Authorization", "Bearer " + token)
      .expect(204);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
