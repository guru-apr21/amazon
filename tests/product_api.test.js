const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Category = require("../models/Category");
const Product = require("../models/Product");
const api = supertest(app);

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

const User = require("../models/User");

let token;
let category;

beforeAll(async () => {
  console.log("Hello");
  await User.deleteMany({});
  await Category.deleteMany({});
  await Product.deleteMany({});

  const response = await api.post("/api/users/signup").send(user);
  token = response.body.token;

  category = await api
    .post("/api/category")
    .set("Authorization", "Bearer " + token)
    .send({ title: "phones" });
});

describe("GET / /:id", () => {
  it("products are returned as JSON ", async () => {
    await api
      .get("/api/products")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("product with given id is returned with status 200", async () => {
    const product = await api
      .post("/api/products")
      .set("Authorization", "Bearer " + token)
      .send({ ...productObj, categoryId: category.body._id });
    const response = await api
      .get(`/api/products/${product.body._id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(response.body).toHaveProperty("title", "Iphone 11");
  });

  it("returns 400 if no product with the given id", async () => {
    let id = new mongoose.Types.ObjectId();
    await api.get(`/api/products/${id}`).expect(404);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
