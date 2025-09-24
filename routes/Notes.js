import express from 'express';
import {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  generateSummary,
  transcribeAudio
} from '../controllers/Notes.js';

const router = express.Router();

router.get('/', getNotes);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);
router.post('/:id/summary', generateSummary);
router.post('/transcribe', transcribeAudio);

export default router;
