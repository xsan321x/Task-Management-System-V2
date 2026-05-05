import express from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/task.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { taskValidationRules, taskUpdateValidationRules, handleValidationErrors } from '../utils/validation';

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', taskValidationRules(), handleValidationErrors, createTask);
router.put('/:id', taskUpdateValidationRules(), handleValidationErrors, updateTask);
router.delete('/:id', deleteTask);

export default router;
