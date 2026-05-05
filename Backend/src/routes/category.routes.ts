import express from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { categoryValidationRules, handleValidationErrors } from '../utils/validation';

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

router.get('/', getCategories);
router.post('/', categoryValidationRules(), handleValidationErrors, createCategory);
router.put('/:id', categoryValidationRules(), handleValidationErrors, updateCategory);
router.delete('/:id', deleteCategory);

export default router;
