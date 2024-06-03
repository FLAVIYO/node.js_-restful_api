import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../../models/user';

dotenv.config();

describe('User Model', () => {
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

  it('should be able to create a new user', async () => {
    const userData = {
      username: 'testuser',
      first_name: 'John',
      last_name: 'Doe',
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toEqual(userData.username);
    expect(savedUser.first_name).toEqual(userData.first_name);
    expect(savedUser.last_name).toEqual(userData.last_name);
  });

  it('should require a username', async () => {
    const userData = {
      first_name: 'John',
      last_name: 'Doe',
    };

    const user = new User(userData);
    let error: any;
    try {
      await user.validate();
    } catch (e) {
      error = e;
    }
    expect(error?.errors.username.message).toEqual('Path `username` is required.');
  });

  it('should require a first name', async () => {
    const userData = {
      username: 'testuser',
      last_name: 'Doe',
    };

    const user = new User(userData);
    let error: any;
    try {
      await user.validate();
    } catch (e) {
      error = e;
    }
    expect(error?.errors.first_name.message).toEqual('Path `first_name` is required.');
  });

  it('should require a last name', async () => {
    const userData = {
      username: 'testuser',
      first_name: 'John',
    };

    const user = new User(userData);
    let error: any;
    try {
      await user.validate();
    } catch (e) {
      error = e;
    }
    expect(error?.errors.last_name.message).toEqual('Path `last_name` is required.');
  });

  // Add more tests for other model functionalities (validations, methods) similarly
});
