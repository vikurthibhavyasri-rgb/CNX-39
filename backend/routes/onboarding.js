import express from 'express';
import { submitOnboarding } from '../controllers/onboardingController.js';

const router = express.Router();

router.post('/', submitOnboarding);

export default router;
