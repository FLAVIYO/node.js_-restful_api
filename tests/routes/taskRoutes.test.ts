import request from 'supertest';
import express from 'express';
import taskRouter from '../../routes/taskRoutes';

const app = express();
app.use(express.json());
app.use('/tasks', taskRouter);

describe('Task Routes', () => {
  let userId: string;

  beforeAll(async () => {
    // Create a user for testing purposes
    const userRes = await request(app)
      .post('/api/users')
      .send({ username: 'testuser', first_name: 'John', last_name: 'Doe' });

    userId = userRes.body.id;
  });

  it('should create a new task', async () => {
    const taskData = {
      title: 'Test Task',
      description: 'Task Description',
      userId: userId,
      status: 'pending'
    };

    const res = await request(app)
      .post(`/tasks/${userId}/tasks`)
      .send(taskData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('title', taskData.title);
    expect(res.body).toHaveProperty('description', taskData.description);
    expect(res.body).toHaveProperty('userId', taskData.userId);
    expect(res.body).toHaveProperty('status', taskData.status);
  });

  it('should get all tasks', async () => {
    const res = await request(app).get(`/tasks/${userId}/tasks`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get a task by ID', async () => {
    // Create a new task for testing
    const createRes = await request(app)
      .post(`/tasks/${userId}/tasks`)
      .send({ title: 'Test Task', description: 'Task Description', userId: userId, status: 'pending' });

    const taskId = createRes.body.id;

    // Retrieve the task by its ID
    const getRes = await request(app).get(`/tasks/${userId}/tasks/${taskId}`);

    expect(getRes.status).toBe(200);
    expect(getRes.body).toHaveProperty('title', 'Test Task');
  });

  it('should update a task by ID', async () => {
    // Create a new task for testing
    const createRes = await request(app)
      .post(`/tasks/${userId}/tasks`)
      .send({ title: 'Test Task', description: 'Task Description', userId: userId, status: 'pending' });

    const taskId = createRes.body.id;

    // Update the task
    const updateRes = await request(app)
      .put(`/tasks/${userId}/tasks/${taskId}`)
      .send({ title: 'Updated Task', description: 'Updated Description', status: 'completed' });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body).toHaveProperty('title', 'Updated Task');
    expect(updateRes.body).toHaveProperty('status', 'completed');
  });

  it('should delete a task by ID', async () => {
    // Create a new task for testing
    const createRes = await request(app)
      .post(`/tasks/${userId}/tasks`)
      .send({ title: 'Test Task', description: 'Task Description', userId: userId, status: 'pending' });

    const taskId = createRes.body.id;

    // Delete the task
    const deleteRes = await request(app).delete(`/tasks/${userId}/tasks/${taskId}`);

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body).toHaveProperty('message', 'Task deleted');
  });
});
