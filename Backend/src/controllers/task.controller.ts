import { Response } from 'express';
import Task from '../models/Task.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { handleError } from '../utils/errorHandler';

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { completed, priority, category, dueDate, sortBy } = req.query;
    const filter: any = { userId: req.userId };

    // Filter by completion status
    if (completed !== undefined) {
      filter.completed = completed === 'true';
    }

    // Filter by priority
    if (priority) {
      if (Array.isArray(priority)) {
        filter.priority = { $in: priority };
      } else {
        filter.priority = priority;
      }
    }

    // Filter by category
    if (category) {
      if (Array.isArray(category)) {
        filter.categories = { $in: category };
      } else {
        filter.categories = category;
      }
    }

    // Filter by due date
    if (dueDate) {
      const dateStr = dueDate as string;
      if (dateStr === 'overdue') {
        filter.dueDate = { $lt: new Date(), $exists: true };
        filter.completed = false;
      } else if (dateStr === 'today') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        filter.dueDate = { $gte: today, $lt: tomorrow };
      } else if (dateStr === 'upcoming') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        filter.dueDate = { $gte: today };
      } else if (dateStr === 'no-date') {
        filter.dueDate = { $exists: false };
      }
    }

    // Determine sort order
    let sortOrder: any = { createdAt: -1 };
    if (sortBy) {
      switch (sortBy) {
        case 'priority-high':
          sortOrder = { priority: -1, createdAt: -1 };
          break;
        case 'priority-low':
          sortOrder = { priority: 1, createdAt: -1 };
          break;
        case 'due-date':
          sortOrder = { dueDate: 1, createdAt: -1 };
          break;
        case 'newest':
          sortOrder = { createdAt: -1 };
          break;
        case 'oldest':
          sortOrder = { createdAt: 1 };
          break;
        default:
          sortOrder = { createdAt: -1 };
      }
    }

    const tasks = await Task.find(filter).sort(sortOrder);
    res.json({ tasks });
  } catch (error: any) {
    handleError(error, res);
  }
};

export const getTaskById = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ task });
  } catch (error: any) {
    handleError(error, res);
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, priority, status, dueDate, categories } = req.body;

    const task = new Task({
      title,
      description,
      priority,
      status: status || 'not-started',
      dueDate,
      categories: categories || [],
      userId: req.userId,
    });

    await task.save();
    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error: any) {
    handleError(error, res);
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, priority, status, completed, dueDate, categories } = req.body;

    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (completed !== undefined) task.completed = completed;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (categories !== undefined) task.categories = categories;

    await task.save();
    res.json({ message: 'Task updated successfully', task });
  } catch (error: any) {
    handleError(error, res);
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error: any) {
    handleError(error, res);
  }
};
