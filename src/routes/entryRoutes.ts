import { createEntry } from '@/controllers/entryController.js';
import express from 'express'


const router = express.Router()

router.post('/create/:collectionSlug', createEntry);

export default router;

