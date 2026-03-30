import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Gamepad2, BrainCircuit, Activity, HeartHandshake, FileQuestion, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MilestoneTracker from '../components/MilestoneTracker';
import AnalysisResult from '../components/AnalysisResult';
import NGOAnalytics from '../components/NGOAnalytics';
import InfoModal from '../components/InfoModal';

const ModuleCard = ({ title, description, icon, isBeta, onClick, delay }) => (
  <motion.button
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    onClick={onClick}
    className="group bg-white dark:bg-darkcard border border-gray-100 dark:border-darkborder p-6 rounded-3xl shadow-sm hover:shadow-xl hover:border-primary-100 dark:hover:border-primary-900/50 transition-all text-left flex flex-col relative overflow-hidden h-full"
  >
    <div className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 p-3 rounded-2xl w-fit mb-4 group-hover:scale-110 group-hover:bg-primary-100 transition-all">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed flex-1">
      {description}
    </p>
    
    {isBeta && (
      <span className="absolute top-6 right-6 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-bold px-2.5 py-1 rounded-full border border-purple-200 dark:border-purple-800">
        Phase 3
      </span>
    )}
  </motion.button>
);

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState({ isOpen: false, title: '', description: '', phase: 3 });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUser));
      fetchData();
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [mRes, aRes] = await Promise.all([
        fetch('http://localhost:5000/api/milestones', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/milestones/analysis', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      const mData = await mRes.json();
      const aData = await aRes.json();

      if (mRes.ok) setMilestones(mData);
      if (aRes.ok) setAnalysis(aData);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null; // Avoid flicker before redirect

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkbg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Dashboard Header */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
          className="bg-white dark:bg-darkcard p-8 sm:p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-darkborder flex flex-col md:flex-row gap-8 items-center justify-between"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Welcome to your Safe Space, {user.name.split(' ')[0]}.
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl text-lg">
              {user.role === 'youth' 
                ? "This is your private dashboard. No judgment. No pressure. Explore at your own pace."
                : `Thank you for supporting our community as a registered ${user.role}! Explore your tools below.`}
            </p>
          </div>
          <div className="hidden md:flex bg-primary-50 dark:bg-primary-900/20 p-4 rounded-full border-4 border-white dark:border-darkcard shadow-lg">
            <Activity className="w-12 h-12 text-primary-500" />
          </div>
        </motion.div>

        {/* Milestone Tracker & Analysis Section (Youth Only) */}
        {user.role === 'youth' ? (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <MilestoneTracker 
                milestones={milestones} 
                onSelect={(id) => navigate(`/milestone/${id}`)} 
              />
            </div>
            <div className="lg:col-span-2">
              {analysis?.result ? (
                <AnalysisResult analysis={analysis} />
              ) : (
                <div className="bg-white dark:bg-darkcard border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[3.5rem] p-12 text-center h-full flex flex-col items-center justify-center">
                  <Sparkles className="w-16 h-16 text-primary-200 mb-6 animate-pulse" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Locked Feature</h3>
                  <p className="text-gray-500 max-w-sm">Complete all milestones to unlock your personalized mental health journey analysis.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-darkcard p-8 sm:p-12 rounded-[3.5rem] border border-gray-100 dark:border-darkborder shadow-sm">
            <NGOAnalytics />
          </div>
        )}

        {/* Feature Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 px-2">Your Wellbeing Tools</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ModuleCard
              delay={0.1}
              icon={<FileQuestion size={28} />}
              title="Assessments"
              description="Quick, stress-free questionnaires to help track your mood and identify feelings early on."
              onClick={() => setModalData({ isOpen: true, title: 'In-Depth Assessments', description: 'Our comprehensive assessments go deeper into identifying patterns of anxiety and stress. This feature is entering security audits and will launch soon.', phase: 4 })}
            />
            <ModuleCard
              delay={0.2}
              icon={<Gamepad2 size={28} />}
              title="Mini-Games & Exercises"
              description="Interactive breathing exercises, visual grounding games, and anxiety-relief activities."
              onClick={() => setModalData({ isOpen: true, title: 'Mindfulness Games', description: 'We are building interactive WebGL games that help lower heart rate and focus the mind through rhythmic play.', phase: 4 })}
            />
            <ModuleCard
              delay={0.3}
              icon={<HeartHandshake size={28} />}
              title="Anonymous Community"
              description="Share your struggles privately. Support others or get advice anonymously. Zero personal info required."
              isBeta={true}
              onClick={() => setModalData({ isOpen: true, title: 'Encrypted Community', description: 'A safe, fully anonymous forum where empathy is the only currency. Launching for all verified students in Phase 3.', phase: 3 })}
            />
            <ModuleCard
              delay={0.4}
              icon={<Users size={28} />}
              title="Peer Mentorship"
              description="Connect with trained mentors and professional therapists to discuss specific challenges safely."
              isBeta={true}
              onClick={() => setModalData({ isOpen: true, title: 'Certified Mentorship', description: 'Our mentorship matching system connects you with senior students and professional counselors for 1-on-1 support.', phase: 3 })}
            />
            <ModuleCard
              delay={0.5}
              icon={<BrainCircuit size={28} />}
              title="Svasthya AI Companion"
              description="Talk to our free, intelligent chatbot 24/7 for coping tips, grounding exercises, and mental health suggestions."
              onClick={() => window.dispatchEvent(new CustomEvent('svasthya-open-chat'))}
            />
          </div>
        </div>

        <InfoModal 
          {...modalData} 
          onClose={() => setModalData({ ...modalData, isOpen: false })} 
        />

      </div>
    </div>
  );
}
