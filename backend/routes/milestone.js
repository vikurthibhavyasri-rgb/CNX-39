import express from 'express';
import { getMilestones, updateMilestone, getAnalysis } from '../controllers/milestoneController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getMilestones);
router.post('/complete', protect, updateMilestone);
router.get('/analysis', protect, getAnalysis);

export default router;
