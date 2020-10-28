const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const user = {
  firstName: "Lokesh",
  lastName: "Prakash",
  password: "Subha@1987",
  email: "lokesh@gmail.com",
  admin: true,
};

const Category = require("../models/Category");
const User = require("../models/User");

let token;
beforeAll(async () => {
  await User.deleteMany({});
  const response = await api.post("/api/users/signup").send(user);
  token = response.body.token;
});

beforeEach(async () => {
  await Category.deleteMany({});
});

describe("GET /", () => {
  it("categories are returned as JSON", async () => {
    await api
      .get("/api/category")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

describe("POST /", () => {
  it("creates new category with status 201", async () => {
    await api
      .post("/api/category")
      .set("Authorization", "Bearer " + token)
      .send({ title: "Mobile phones" })
      .expect(201)
      .expect("Content-Type", /application\/json/);
  });
  it("if not admin returns 403", async () => {
    const response = await api
      .post("/api/users/signup")
      .send({ ...user, admin: false, email: "guru@gmail.com" });
    await api
      .post("/api/category")
      .set("Authorization", "Bearer " + response.body.token)
      .send({ title: "Mobile phones" })
      .expect(403);
  });
});

describe("PUT /:id", () => {
  it("returns 404 if no category is found", async () => {
    const id = new mongoose.Types.ObjectId();
    await api
      .put(`/api/category/${id}`)
      .set("Authorization", "Bearer " + token)
      .expect(404);
  });
  it("returns 200 and json object if category updated successfully", async () => {
    let response = await api
      .post(`/api/category`)
      .set("Authorization", "Bearer " + token)
      .send({ title: "Mobile phones" });
    const id = response.body._id;
    await api
      .put(`/api/category/${id}`)
      .set("Authorization", "Bearer " + token)
      .send({ title: "Mobile phones" })
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

describe("DELETE /:id", () => {
  it("returns 404 if category not found", async () => {
    const id = new mongoose.Types.ObjectId();
    await api
      .delete(`/api/category/${id}`)
      .set("Authorization", "Bearer " + token)
      .expect(404);
  });

  it("returns 204 if deleted successfully", async () => {
    let response = await api
      .post(`/api/category`)
      .set("Authorization", "Bearer " + token)
      .send({ title: "Mobile phones" });
    const id = response.body._id;
    await api
      .delete(`/api/category/${id}`)
      .set("Authorization", "Bearer " + token)
      .expect(204);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
