import { User, Youth, Mentor, Therapist } from '../models/User.js';
import jwt from 'jsonwebtoken';

// ── Scoring logic for Youth ─────────────────────────────────────────────
const YOUTH_CATEGORY_MAP = {
  academic_stress:  ['exam_pressure', 'burnout', 'performance', 'school'],
  social_anxiety:   ['judgment', 'isolation', 'peer_pressure', 'social'],
  family_conflict:  ['family', 'parents', 'home', 'conflict', 'abuse'],
  grief_loss:       ['loss', 'grief', 'death', 'ending'],
  identity_crisis:  ['identity', 'purpose', 'gender', 'sexuality', 'confused'],
  substance_risk:   ['substance', 'alcohol', 'drugs', 'peer_use'],
  self_harm_risk:   ['self_harm', 'hurt_self', 'suicidal', 'end_life'],
  general_wellness: ['general', 'curious', 'wellness', 'prevention'],
};

function categorizeYouth(answers) {
  const scores = {};
  const crisisTags = ['self_harm_risk'];

  // answers is an object: { q1: 'value', q2: ['v1','v2'], ... }
  const allValues = Object.values(answers).flat().join(' ').toLowerCase();

  for (const [category, keywords] of Object.entries(YOUTH_CATEGORY_MAP)) {
    scores[category] = keywords.filter(k => allValues.includes(k)).length;
  }

  // Sort by score descending
  const sorted = Object.entries(scores)
    .filter(([, s]) => s > 0)
    .sort((a, b) => b[1] - a[1]);

  const communityTags = sorted.map(([cat]) => cat);
  const primaryCategory = communityTags[0] || 'general_wellness';
  const isCrisisRisk = communityTags.some(t => crisisTags.includes(t));

  return { primaryCategory, communityTags, isCrisisRisk };
}

// ── Save onboarding answers ─────────────────────────────────────────────
export const submitOnboarding = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Not authorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { answers } = req.body;

    if (user.role === 'youth') {
      const { primaryCategory, communityTags, isCrisisRisk } = categorizeYouth(answers);
      await Youth.findByIdAndUpdate(user._id, {
        onboardingAnswers: answers,
        primaryCategory,
        communityTags,
        isCrisisRisk,
        onboardingComplete: true,
      });
      return res.json({ success: true, primaryCategory, communityTags, isCrisisRisk });
    }

    if (user.role === 'mentor') {
      await Mentor.findByIdAndUpdate(user._id, {
        onboardingAnswers: answers,
        experienceCategory: answers.q1 || '',
        supportAgeGroup: answers.q3 || '',
        availabilityPerWeek: answers.q5 || '',
        primaryCategory: answers.q1 || '',
        onboardingComplete: true,
      });
      return res.json({ success: true });
    }

    if (user.role === 'therapist') {
      await Therapist.findByIdAndUpdate(user._id, {
        onboardingAnswers: answers,
        clinicalSpecialization: answers.q1 || '',
        yearsExperience: answers.q2 || '',
        crisisCertified: answers.q5 === 'yes',
        sessionLanguages: Array.isArray(answers.q4) ? answers.q4 : [answers.q4 || 'English'],
        onboardingComplete: true,
      });
      return res.json({ success: true });
    }

    // Admin or unknown — just mark complete
    await User.findByIdAndUpdate(user._id, { onboardingComplete: true });
    return res.json({ success: true });

  } catch (err) {
    console.error('Onboarding error:', err);
    res.status(500).json({ message: err.message });
  }
};
