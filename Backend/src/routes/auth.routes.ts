import express from 'express';
import { signup, login, getMe } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { authValidationRules, handleValidationErrors } from '../utils/validation';

const router = express.Router();

router.post('/signup', authValidationRules(), handleValidationErrors, signup);
router.post('/login', authValidationRules(), handleValidationErrors, login);
router.get('/me', authMiddleware, getMe);

export default router;
