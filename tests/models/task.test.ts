import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Task from '../../models/task';

dotenv.config();

describe('Task Model', () => {
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

  it('should be able to create a new task', async () => {
    const taskData = {
      userId: new mongoose.Types.ObjectId(),
      name: 'Test Task',
      description: 'This is a test task',
      date_time: new Date(),
      status: 'pending', // Add status field
    };

    const task = new Task(taskData);
    const savedTask = await task.save();

    expect(savedTask._id).toBeDefined();
    expect(savedTask.userId).toEqual(taskData.userId);
    expect(savedTask.name).toEqual(taskData.name);
    expect(savedTask.description).toEqual(taskData.description);
    expect(savedTask.date_time.getTime()).toEqual(taskData.date_time.getTime());
    expect(savedTask.status).toEqual(taskData.status); // Check status field
  });

  it('should require a user ID', async () => {
    const taskData = {
      name: 'Test Task',
      description: 'This is a test task',
      date_time: new Date(),
      status: 'pending', // Add status field
    };

    const task = new Task(taskData);
    let error: any;
    try {
      await task.validate();
    } catch (e) {
      error = e;
    }
    expect(error?.errors.userId.message).toEqual('Path `userId` is required.');
  });

  it('should require a name', async () => {
    const taskData = {
      userId: new mongoose.Types.ObjectId(),
      description: 'This is a test task',
      date_time: new Date(),
      status: 'pending', // Add status field
    };

    const task = new Task(taskData);
    let error: any;
    try {
      await task.validate();
    } catch (e) {
      error = e;
    }
    expect(error?.errors.name.message).toEqual('Path `name` is required.');
  });

  it('should require a date and time', async () => {
    const taskData = {
      userId: new mongoose.Types.ObjectId(),
      name: 'Test Task',
      description: 'This is a test task',
      status: 'pending', // Add status field
    };

    const task = new Task(taskData);
    let error: any;
    try {
      await task.validate();
    } catch (e) {
      error = e;
    }
    expect(error?.errors.date_time.message).toEqual('Path `date_time` is required.');
  });

  // Add more tests for other model functionalities (validations, methods) similarly
});
