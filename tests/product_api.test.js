const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Category = require('../models/Category');
const { Product } = require('../models/Product');
const api = supertest(app);

const user = {
  firstName: 'Lokesh',
  lastName: 'Prakash',
  password: 'Subha@1987',
  email: 'lokesh@gmail.com',
  admin: true,
};

const productObj = {
  title: 'Iphone 11',
  description:
    'Maximize performance with Game Booster technology which gives smooth graphics, life-like motion and learns your usage patterns to optimize battery',
  price: 174999,
  brand: 'Apple',
};

const User = require('../models/User');

let token;
let category;
let product;

beforeAll(async () => {
  await User.deleteMany({});
  await Category.deleteMany({});
  await Product.deleteMany({});

  const response = await api.post('/api/users/signup').send(user);
  token = response.body.token;

  category = await api
    .post('/api/category')
    .set('Authorization', 'Bearer ' + token)
    .send({ title: 'phones' });
  product = await api
    .post('/api/products')
    .set('Authorization', 'Bearer ' + token)
    .send({ ...productObj, categoryId: category.body._id });
});

describe('GET / /:id', () => {
  it('products are returned as JSON ', async () => {
    await api
      .get('/api/products')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  it('product with given id is returned with status 200', async () => {
    const response = await api
      .get(`/api/products/${product.body._id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    expect(response.body).toHaveProperty('title', 'Iphone 11');
  });

  it('returns 400 if no product with the given id', async () => {
    let id = new mongoose.Types.ObjectId();
    await api.get(`/api/products/${id}`).expect(404);
  });
});

describe('POST /', () => {
  it('returns 200 if new product is created', async () => {
    expect(product).toHaveProperty('status', 201);
  });

  it('return 404 if category not found', async () => {
    const id = new mongoose.Types.ObjectId();
    await api
      .post('/api/products')
      .set('Authorization', 'Bearer ' + token)
      .send({ ...productObj, categoryId: id })
      .expect(404);
  });
});

describe('PUT /:id', () => {
  it('returns 200 when product updated successfully', async () => {
    const response = await api
      .put(`/api/products/${product.body._id}`)
      .send({ title: 'Samsung' })
      .set('Authorization', 'Bearer ' + token)
      .expect(200);
    expect(response.body).toHaveProperty('title', 'Samsung');
  });

  it('returns 404 if no product with the given id', async () => {
    const id = new mongoose.Types.ObjectId();
    await api
      .put(`/api/products/${id}`)
      .send({ title: 'Samsung' })
      .set('Authorization', 'Bearer ' + token)
      .expect(404);
  });
});

describe('DELETE /', () => {
  it('returns 404 if no product with the given id', async () => {
    const id = new mongoose.Types.ObjectId();
    await api
      .delete(`/api/products/${id}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(404);
  });

  it('returns 204 if product deleted successfully', async () => {
    console.log(product.body._id);
    await api
      .delete(`/api/products/${product.body._id}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(204);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
