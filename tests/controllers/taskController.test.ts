import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app'; // Assuming your Express app is exported from this module
import Task from '../../models/task';
import User from '../../models/user';

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
  await mongoose.connection.close();
});


describe('Task Controller', () => {
  let userId: mongoose.Types.ObjectId | undefined;

  beforeAll(async () => {
    const user = new User({ username: 'testuser', first_name: 'Test', last_name: 'User' });
    await user.save();
    userId = (user._id as mongoose.Types.ObjectId);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Task.deleteMany({});
  });

  describe('POST /users/:userId/tasks', () => {
    it('should create a new task', async () => {
      const res = await request(app)
        .post(`/users/${userId}/tasks`)
        .send({ name: 'Test Task', description: 'Task description', date_time: new Date() });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('name', 'Test Task');
    });

    it('should return 400 for invalid userId', async () => {
      const res = await request(app)
        .post('/users/invalidId/tasks')
        .send({ name: 'Test Task', description: 'Task description', date_time: new Date() });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /users/:userId/tasks', () => {
    it('should get all tasks for a user', async () => {
      const res = await request(app).get(`/users/${userId}/tasks`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should return 400 for invalid userId', async () => {
      const res = await request(app).get('/users/invalidId/tasks');

      expect(res.status).toBe(400);
    });
  });

  describe('GET /tasks/:id', () => {
    let taskId= userId

    beforeAll(async () => {
      const task = new Task({ userId, name: 'Another Test Task', description: 'Description', date_time: new Date(), status: 'pending', next_execute_date_time: new Date() });
      await task.save();
      taskId = (task._id as mongoose.Types.ObjectId);
    });

    it('should get a task by ID', async () => {
      const res = await request(app).get(`/tasks/${taskId}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'Another Test Task');
    });

    it('should return 400 for invalid task ID', async () => {
      const res = await request(app).get('/tasks/invalidId');

      expect(res.status).toBe(400);
    });

    it('should return 404 if task not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/tasks/${nonExistentId}`);

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /users/:userId/tasks/:id', () => {
    let taskId: mongoose.Types.ObjectId;

    beforeAll(async () => {
      const task = new Task({ userId, name: 'Update Test Task', description: 'Description', date_time: new Date(), status: 'pending', next_execute_date_time: new Date() });
      await task.save();
      taskId = (task._id as mongoose.Types.ObjectId);
    });

    it('should update a task', async () => {
      const res = await request(app)
        .put(`/users/${userId}/tasks/${taskId}`)
        .send({ name: 'Updated Task', description: 'Updated Description' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'Updated Task');
      expect(res.body).toHaveProperty('status', 'pending');
    });

    it('should return 400 for invalid IDs', async () => {
      const res = await request(app)
        .put('/users/invalidUserId/tasks/invalidTaskId')
        .send({ name: 'Updated Task', description: 'Updated Description' });

      expect(res.status).toBe(400);
    });

    it('should return 404 if task not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/users/${userId}/tasks/${nonExistentId}`)
        .send({ name: 'Updated Task', description: 'Updated Description' });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /users/:userId/tasks/:id', () => {
    let taskId: mongoose.Types.ObjectId;

    beforeAll(async () => {
      const task = new Task({ userId, name: 'Delete Test Task', description: 'Description', date_time: new Date(), status: 'pending', next_execute_date_time: new Date() });
      await task.save();
      taskId = (task._id as mongoose.Types.ObjectId);
    });

    it('should delete a task', async () => {
      const res = await request(app).delete(`/users/${userId}/tasks/${taskId}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Task deleted');
    });

    it('should return 400 for invalid IDs', async () => {
      const res = await request(app).delete('/users/invalidUserId/tasks/invalidTaskId');

      expect(res.status).toBe(400);
    });

    it('should return 404 if task not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/users/${userId}/tasks/${nonExistentId}`);

      expect(res.status).toBe(404);
    });
  });
});

