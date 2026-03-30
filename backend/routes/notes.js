import express from 'express';
import { createNote, getNotes, getNote, deleteNote, analyzeUserHistory } from '../controllers/notesController.js';

const router = express.Router();

router.get('/analysis', analyzeUserHistory);
router.post('/', createNote);
router.get('/', getNotes);
router.get('/:id', getNote);
router.delete('/:id', deleteNote);

export default router;
