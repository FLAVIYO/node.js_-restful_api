import { Request, Response } from 'express';
import Task from '../models/task';
import User from '../models/user';
import mongoose from 'mongoose';

// Create a new task
export const createTask = async (req: Request, res: Response) => {
  try {
    const { name, description, date_time } = req.body;
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid userId');
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const task = new Task({
      userId: user._id,
      name,
      description: description || undefined,
      date_time: new Date(date_time),
      next_execute_date_time: new Date(date_time), // Set this field
      status: 'pending',
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'Unknown error occurred' });
    }
  }
};

// Get all tasks for a user
export const getTasks = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const tasks = await Task.find({ userId });

    if (tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks found' });
    }

    return res.status(200).json(tasks);
  } catch (error) {
    console.error('Error retrieving tasks:', error);
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    } else {
      return res.status(500).json({ message: 'Unknown error occurred' });
    }
  }
};

// Get a task by ID
export const getTaskById = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    const task = await Task.findById(taskId);
    if (task) {
      return res.status(200).json(task);
    } else {
      return res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    console.error('Error retrieving task:', error);
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    } else {
      return res.status(500).json({ message: 'Unknown error occurred' });
    }
  }
};

// Update a task by ID
export const updateTask = async (req: Request, res: Response) => {
  try {
    const { userId, id: taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: 'Invalid user or task ID' });
    }

    const updateFields = req.body;

    // Ensure next_execute_date_time is updated correctly if provided
    if (updateFields.next_execute_date_time) {
      updateFields.next_execute_date_time = new Date(updateFields.next_execute_date_time);
    }

    // Always set status to 'pending'
    updateFields.status = 'pending';

    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId },
      updateFields,
      { new: true, runValidators: true }
    );

    if (task) {
      console.log('Task updated:', task);
      res.status(200).json(task);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    console.error('Error updating task:', error);
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'Unknown error occurred' });
    }
  }
};

// Delete a task by ID
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { userId, id: taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: 'Invalid user or task ID' });
    }

    const task = await Task.findOneAndDelete({ _id: taskId, userId });

    if (task) {
      console.log('Task deleted:', task);
      res.status(200).json({ message: 'Task deleted' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error occurred' });
    }
  }
};
