import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../../app';
import User from '../../models/user';

dotenv.config();

describe('User API', () => {
  beforeAll(async () => {
    try {
      const mongoURI = process.env.MONGO_URI_TEST;
      if (!mongoURI) {
        throw new Error('MongoDB URI for testing is not provided in the environment variables.');
      }
      await mongoose.connect(mongoURI, {});
    } catch (error) {
      console.error('Error connecting to the test database:', error);
      process.exit(1); // Exit the test process if database connection fails
    }
  });

  afterAll(async () => {
    // Disconnect from the test database after running tests
    await mongoose.connection.close();
  });

  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        username: 'testuser',
        first_name: 'Test',
        last_name: 'User'
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('User created successfully');
    expect(res.body.user).toHaveProperty('_id');
  });

  it('should not create a user that already exists', async () => {
    await User.create({
      username: 'testuser',
      first_name: 'Test',
      last_name: 'User'
    });

    const res = await request(app)
      .post('/api/users')
      .send({
        username: 'testuser',
        first_name: 'Test',
        last_name: 'User'
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('User already exists');
  });

  it('should get all users', async () => {
    await User.create({
      username: 'testuser1',
      first_name: 'Test1',
      last_name: 'User1'
    });
    await User.create({
      username: 'testuser2',
      first_name: 'Test2',
      last_name: 'User2'
    });

    const res = await request(app).get('/api/users');

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Users retrieved successfully');
    expect(res.body.users.length).toBe(2);
  });

  it('should get a user by ID', async () => {
    const user = await User.create({
      username: 'testuser',
      first_name: 'Test',
      last_name: 'User'
    });

    const res = await request(app).get(`/api/users/${user._id}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.username).toBe('testuser');
  });

  it('should update a user by ID', async () => {
    const user = await User.create({
      username: 'testuser',
      first_name: 'Test',
      last_name: 'User'
    });

    const res = await request(app)
      .put(`/api/users/${user._id}`)
      .send({
        first_name: 'Updated'
      });

    expect(res.status).toBe(200);
    expect(res.body.first_name).toBe('Updated');
  });

  it('should delete a user by ID', async () => {
    const user = await User.create({
      username: 'testuser',
      first_name: 'Test',
      last_name: 'User'
    });

    const res = await request(app).delete(`/api/users/${user._id}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('User deleted');
  });
});
