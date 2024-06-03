import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function setupTestDatabase() {
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
}

export async function teardownTestDatabase() {
  try {
    // Clear the test database after each test
    await mongoose.connection.db.dropDatabase();
  } catch (error) {
    console.error('Error clearing the test database:', error);
  }

  try {
    // Disconnect from the test database after running all tests
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error disconnecting from the test database:', error);
  }
}

beforeAll(async () => {
  await setupTestDatabase();
});

afterEach(async () => {
  await teardownTestDatabase();
});
