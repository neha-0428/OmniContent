import express from 'express'
import { registerOrganisation } from '@/controllers/authController.js'
import { validate } from '@/middleware/validate.js';
import { registerSchema } from '@/shared/authSchema.js';

const router = express.Router()

router.post('/register', validate(registerSchema), registerOrganisation);

export default router;