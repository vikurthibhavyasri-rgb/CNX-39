import express from 'express';
import { getBookings, createBooking } from '../controllers/bookingsController.js';

const router = express.Router();

router.get('/', getBookings);
router.post('/', createBooking);

export default router;
