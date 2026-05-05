import express from 'express';
import { updateProfile, changePassword } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { profileUpdateValidationRules, passwordChangeValidationRules, handleValidationErrors } from '../utils/validation';

const router = express.Router();

router.use(authMiddleware);

router.put('/profile', profileUpdateValidationRules(), handleValidationErrors, updateProfile);
router.put('/change-password', passwordChangeValidationRules(), handleValidationErrors, changePassword);

export default router;
