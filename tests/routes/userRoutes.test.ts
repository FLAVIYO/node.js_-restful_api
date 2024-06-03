import request from 'supertest';
import express from 'express';
import userRouter from '../../routes/userRoutes';

const app = express();
app.use(express.json());
app.use('/api/users', userRouter);

describe('User Routes', () => {
  it('should create a new user', async () => {
    const userData = {
      username: 'testuser',
      first_name: 'John',
      last_name: 'Doe'
    };

    const res = await request(app)
      .post('/api/users')
      .send(userData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('username', userData.username);
    expect(res.body).toHaveProperty('first_name', userData.first_name);
    expect(res.body).toHaveProperty('last_name', userData.last_name);
  });

  it('should get all users', async () => {
    const res = await request(app).get('/api/users');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get a user by ID', async () => {
    const newUserRes = await request(app)
      .post('/api/users')
      .send({ username: 'user1', first_name: 'John', last_name: 'Doe' });

    const userId = newUserRes.body.id;

    const res = await request(app).get(`/api/users/${userId}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('username', 'user1');
  });

  it('should update a user by ID', async () => {
    const newUserRes = await request(app)
      .post('/api/users')
      .send({ username: 'user2', first_name: 'John', last_name: 'Doe' });

    const userId = newUserRes.body.id;

    const updatedData = {
      username: 'updatedUser',
      first_name: 'Updated',
      last_name: 'User'
    };

    const res = await request(app)
      .put(`/api/users/${userId}`)
      .send(updatedData);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('username', updatedData.username);
    expect(res.body).toHaveProperty('first_name', updatedData.first_name);
    expect(res.body).toHaveProperty('last_name', updatedData.last_name);
  });

  it('should delete a user by ID', async () => {
    const newUserRes = await request(app)
      .post('/api/users')
      .send({ username: 'user3', first_name: 'John', last_name: 'Doe' });

    const userId = newUserRes.body.id;

    const res = await request(app).delete(`/api/users/${userId}`);

    expect(res.status).toBe(200);
  });
});
