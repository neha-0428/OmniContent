import { createEntry, updateEntry } from '@/controllers/entryController.js';
import express from 'express'


const router = express.Router()

router.post('/create/:collectionSlug', createEntry);

router.put('/:entryId', updateEntry);

export default router;

