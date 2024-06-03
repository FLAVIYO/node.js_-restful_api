import cron from 'node-cron';
import Task from '../models/task';
import mongoose from 'mongoose';

// Define a cron job to run every minute
const taskUpdateJob = cron.schedule('* * * * *', async () => {
  try {
    // Query pending tasks with next_execute_date_time <= current time
    const currentTime = new Date();
    console.log('Current time:', currentTime);

    const pendingTasks = await Task.find({
      status: 'pending',
      next_execute_date_time: { $lte: currentTime }
    });

    console.log('Retrieved pending tasks:', pendingTasks);

    if (pendingTasks.length === 0) {
      console.log('No pending tasks to update.');
    } else {
      // Update status of pending tasks to "done"
      for (const task of pendingTasks) {
        task.status = 'done';
        await task.save();
        console.log(`Task "${task.name}" with ID ${task._id} updated to done.`);
      }
    }
  } catch (error) {
    console.error('Error occurred while processing tasks:', error);
    // Stop the cron job if an error occurs
    taskUpdateJob.stop();
  }
});

export default taskUpdateJob;
