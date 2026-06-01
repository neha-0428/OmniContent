import { createEntry, deleteEntry, getEntries, updateEntry } from '@/controllers/entryController.js';
import express from 'express'


const router = express.Router()

router.post('/create/:collectionSlug', createEntry);

router.put('/:entryId', updateEntry);

router.get('/:collectionSlug', getEntries);

router.delete('/:entryId', deleteEntry)

export default router;