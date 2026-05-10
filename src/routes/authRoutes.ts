import express from 'express'
import { registerOrganisation, login, getMe } from '@/controllers/authController.js'
import { validate } from '@/middleware/validate.js';
import { registerSchema, loginSchema } from '@/shared/authSchema.js';
import { protect } from '@/middleware/authMiddleware.js';

const router = express.Router()

router.post('/register', validate(registerSchema), registerOrganisation);
router.post('/login', validate(loginSchema), login);

router.use(protect)
router.get('/get-me', getMe);



export default router;