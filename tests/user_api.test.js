const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../app');
const User = require('../models/User');
const api = supertest(app);
const user = {
  firstName: 'Lokesh',
  lastName: 'Prakash',
  password: 'Subha@1987',
  email: 'lokesh@gmail.com',
  admin: true,
};

describe('/api/users', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  it('returns a jwt token', async () => {
    const response = await api.post('/api/users/signup').send(user).expect(200);

    expect(response.body).toHaveProperty('token');
  });

  it('missing field returns 500', async () => {
    await api
      .post('/api/users/signup')
      .send({
        lastName: 'Prakash',
        password: 'Subha@1987',
        email: 'lokesh@gmail.com',
        admin: 'true',
      })
      .expect(500);
  });

  it('user signin returns jwt token', async () => {
    await api.post('/api/users/signup').send(user);
    const response = await api
      .post('/api/users/signin')
      .send({
        email: 'lokesh@gmail.com',
        password: 'Subha@1987',
      })
      .expect(200);

    expect(response.body).toHaveProperty('token');
  });

  it('Invalid email returns 400', async () => {
    await api
      .post('/api/users/signin')
      .send({ email: 'abc@gmail.com', password: 'password' })
      .expect(400);
  });

  it('Invalid password returns 400', async () => {
    await api.post('/api/users/signup').send(user);
    await api
      .post('/api/users/signin')
      .send({ email: 'lokesh@gmail.com', password: 'password' })
      .expect(400);
  });

  it('Successfull password change returns 204', async () => {
    const response = await api.post('/api/users/signup').send(user);
    await api
      .put('/api/users/changepwd')
      .set('Authorization', 'Bearer ' + response.body.token)
      .send({ password: 'Subha@1987', newPassword: 'lakshmiguru1999' })
      .expect(204);
  }, 10000);

  it('Wrong password returns 400', async () => {
    const response = await api.post('/api/users/signup').send(user);
    await api
      .put('/api/users/changepwd')
      .set('Authorization', 'Bearer ' + response.body.token)
      .send({ password: 'Subha@198', newPassword: 'lakshmiguru1999' })
      .expect(204);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
