import { Response } from 'express';
import Category from '../models/Category.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { handleError } from '../utils/errorHandler';

export const getCategories = async (req: AuthRequest, res: Response) => {
  try {
    const categories = await Category.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ categories });
  } catch (error: any) {
    handleError(error, res);
  }
};

export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { name, color } = req.body;

    const category = new Category({
      name,
      color,
      userId: req.userId,
    });

    await category.save();
    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error: any) {
    handleError(error, res);
  }
};

export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { name, color } = req.body;

    const category = await Category.findOne({ _id: req.params.id, userId: req.userId });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (name !== undefined) category.name = name;
    if (color !== undefined) category.color = color;

    await category.save();
    res.json({ message: 'Category updated successfully', category });
  } catch (error: any) {
    handleError(error, res);
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const category = await Category.findOneAndDelete({ _id: req.params.id, userId: req.userId });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    handleError(error, res);
  }
};
