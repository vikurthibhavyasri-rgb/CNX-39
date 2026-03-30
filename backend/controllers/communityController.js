import { User, Therapist } from '../models/User.js';
import Group from '../models/Group.js';
import Post from '../models/Post.js';
import jwt from 'jsonwebtoken';

const getUserId = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    return decoded.id;
  } catch (err) {
    return null;
  }
};

export const getGroups = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Not authorized' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    let groups = await Group.find().populate('adminId', 'name role rating badges clinicalSpecialization');

    const standardCategories = [
      { topic: 'academic_stress', name: 'Academic Stress Support' },
      { topic: 'social_anxiety', name: 'Social Confidence Support' },
      { topic: 'family_conflict', name: 'Family Support' },
      { topic: 'grief_loss', name: 'Grief & Healing Support' },
      { topic: 'identity_crisis', name: 'Identity & Purpose Support' },
      { topic: 'substance_risk', name: 'Wellbeing & Recovery' },
      { topic: 'general_wellness', name: 'General Wellness' }
    ];

    let createdAny = false;
    for (const cat of standardCategories) {
      if (!groups.find(g => g.topic === cat.topic)) {
        let admin = await Therapist.findOne({ clinicalSpecialization: cat.topic });
        if (!admin) admin = await Therapist.findOne();

        await Group.create({
          name: cat.name,
          topic: cat.topic,
          adminId: admin ? admin._id : null
        });
        createdAny = true;
      }
    }

    if (createdAny) {
      groups = await Group.find().populate('adminId', 'name role rating badges clinicalSpecialization');
    }

    // Sort to put user's primary category at the top
    if (user.primaryCategory) {
      const pIdx = groups.findIndex(g => g.topic === user.primaryCategory);
      if (pIdx > -1) {
        const pGroup = groups.splice(pIdx, 1)[0];
        groups.unshift(pGroup);
      }
    }

    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Not authorized' });

    const posts = await Post.find({ groupId: req.params.groupId })
      .sort({ createdAt: -1 })
      .populate('authorId', 'name role'); // fetch author details
      
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Not authorized' });

    const { content } = req.body;
    if (!content?.trim()) {
      return res.status(400).json({ message: 'Post content is required' });
    }

    const post = await Post.create({
      groupId: req.params.groupId,
      authorId: userId,
      content
    });

    const populatedPost = await post.populate('authorId', 'name role');
    res.status(201).json(populatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTherapists = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Not authorized' });

    const therapists = await Therapist.find().select('-password');
    res.json(therapists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTherapistById = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Not authorized' });

    const therapist = await Therapist.findById(req.params.id).select('-password');
    if (!therapist) return res.status(404).json({ message: 'Therapist not found' });
    
    res.json(therapist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
