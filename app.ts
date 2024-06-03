import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';
import setupSwagger from './config/swagger';
import taskUpdateJob from './scheduledJobs/taskScheduler';

// Load environment variables from .env file
dotenv.config();

// Create an Express application
const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Setup Swagger for API documentation
setupSwagger(app);

// Define routes
app.use('/api/users', userRoutes);
app.use('/api/users', taskRoutes); // Routes for handling tasks with userId

// Define the port from environment variables or default to 5000
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Start the cron job
taskUpdateJob.start();

export default app;
