import express from 'express';
import { getGroups, getPosts, createPost, getTherapists, getTherapistById } from '../controllers/communityController.js';

const router = express.Router();

router.get('/groups', getGroups);
router.get('/groups/:groupId/posts', getPosts);
router.post('/groups/:groupId/posts', createPost);
router.get('/therapists', getTherapists);
router.get('/therapists/:id', getTherapistById);

export default router;
