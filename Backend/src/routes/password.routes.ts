import express from 'express';
import { forgotPassword } from '../controllers/password.controller';
import { forgotPasswordValidationRules, handleValidationErrors } from '../utils/validation';

const router = express.Router();

router.post('/forgot-password', forgotPasswordValidationRules(), handleValidationErrors, forgotPassword);

export default router;
