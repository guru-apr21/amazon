const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/User");
const Category = require("../models/Category");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Address = require("../models/Address");

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

const orderObj = {
  itemsPrice: 14999,
  shippingPrice: 100,
  totalPrice: 15099,
};

const addressObj = {
  city: "Tuticorin",
  country: "IN",
  line1: "No 26, Arignar Anna 4th street, Manthithoppu road",
  line2: "Anna nagar, Kovilpatti",
  postal_code: "628501",
  state: "Tamil Nadu",
};

let token;
let product;
let category;
let order;
let address;

beforeEach(async () => {
  await User.deleteMany({});
  await Category.deleteMany({});
  await Product.deleteMany({});
  await Order.deleteMany({});
  await Address.deleteMany({});

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

  address = await api
    .post("/api/address")
    .set("Authorization", "Bearer " + token)
    .send(addressObj);

  order = await api
    .post("/api/orders")
    .set("Authorization", "Bearer " + token)
    .send({
      ...orderObj,
      shipping: address.body._id,
      orderItems: [
        {
          quantity: 2,
          productId: product.body._id,
        },
      ],
    });
});

describe("GET /", () => {
  it("get all orders", async () => {
    const response = await api
      .get("/api/orders")
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(response.body[0]).toHaveProperty("totalPrice", 15099);
  });
});

describe("POST /", () => {
  it("Create new order and returns 201", async () => {
    const response = await api
      .post("/api/orders")
      .set("Authorization", "Bearer " + token)
      .send({ totalPrice: 15999, shipping: address.body._id })
      .expect(201);
    expect(response.body.data).toHaveProperty("shipping", address.body._id);
  });
});

describe("DELETE /", () => {
  it("returns 404 if no order is not found", async () => {
    const id = new mongoose.Types.ObjectId();
    await api
      .delete(`/api/orders/${id}`)
      .set("Authorization", "Bearer " + token)
      .expect(404);
  });

  it("returns 204 when order deleted successfully", async () => {
    await api
      .delete(`/api/orders/${order.body.data._id}`)
      .set("Authorization", "Bearer " + token)
      .expect(204);
  });
});

describe("PUT /", () => {
  it("returns 404 if order not found", async () => {
    const id = new mongoose.Types.ObjectId();
    await api
      .put(`/api/orders/${id}/pay`)
      .set("Authorization", "Bearer " + token)
      .expect(404);
  });

  it("returns 200 if payment successfull", async () => {
    await api
      .put(`/api/orders/${order.body.data._id}/pay`)
      .set("Authorization", "Bearer " + token)
      .expect(200);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
