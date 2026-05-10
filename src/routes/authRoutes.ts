import express from 'express'
import { registerOrganisation, login } from '@/controllers/authController.js'
import { validate } from '@/middleware/validate.js';
import { registerSchema, loginSchema } from '@/shared/authSchema.js';

const router = express.Router()

router.post('/register', validate(registerSchema), registerOrganisation);
router.post('/login', validate(loginSchema), login);

export default router;