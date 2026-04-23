import express from 'express'
import { registerOrganisation } from '@/controllers/authController.js'

const router = express.Router()

router.post('/register', registerOrganisation);

export default router;