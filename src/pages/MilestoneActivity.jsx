import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Wind, Brain, Users, ArrowLeft, CheckCircle2, ChevronRight, AlertCircle, ClipboardList, Smile, Frown, Meh } from 'lucide-react';

const BreathingExercise = ({ onComplete }) => {
  const [stage, setStage] = useState('Inhale');
  const [seconds, setSeconds] = useState(4);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (cycle >= 3) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          if (stage === 'Inhale') { setStage('Hold'); return 7; }
          if (stage === 'Hold') { setStage('Exhale'); return 8; }
          if (stage === 'Exhale') { setStage('Inhale'); setCycle(c => c + 1); return 4; }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [stage, seconds, cycle, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center space-y-12 py-12">
      <motion.div
        animate={{ scale: stage === 'Inhale' ? 1.5 : stage === 'Hold' ? 1.5 : 1 }}
        transition={{ duration: stage === 'Inhale' ? 4 : stage === 'Hold' ? 7 : 8, ease: "linear" }}
        className="w-48 h-48 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center border-4 border-primary-500 shadow-2xl shadow-primary-500/20"
      >
        <span className="text-3xl font-black text-primary-600 dark:text-primary-400">{seconds}s</span>
      </motion.div>
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">{stage}...</h2>
        <p className="text-gray-500">Cycle {cycle + 1} of 3</p>
      </div>
    </div>
  );
};

const MeditationActivity = ({ onComplete }) => {
    const [mood, setMood] = useState('');
    const moods = ['Calm', 'Neutral', 'Restless', 'Anxious'];

    return (
        <div className="flex flex-col space-y-8 py-8 items-center text-center">
            <div className="max-w-md bg-secondary-50 dark:bg-secondary-900/10 p-8 rounded-3xl border border-secondary-100 dark:border-secondary-900/30">
                <Brain className="w-12 h-12 text-secondary-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4 italic">"I am at peace with my world. Everything is unfolding as it should."</h3>
                <p className="text-gray-600 dark:text-gray-400">Close your eyes, take a deep breath, and repeat this affirmation in your head for 60 seconds.</p>
            </div>
            
            <div className="w-full max-w-sm">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">How do you feel after this session?</label>
                <div className="grid grid-cols-2 gap-3">
                    {moods.map(m => (
                        <button 
                            key={m} 
                            onClick={() => setMood(m)}
                            className={`px-4 py-3 rounded-2xl border font-semibold transition-all ${mood === m ? 'bg-secondary-500 text-white border-secondary-500 shadow-lg' : 'bg-white dark:bg-darkcard border-gray-100 dark:border-darkborder text-gray-600 dark:text-gray-400'}`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            </div>

            <button 
                disabled={!mood}
                onClick={() => onComplete({ mood: mood.toLowerCase() })}
                className="bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white px-8 py-4 rounded-full font-bold shadow-xl transition-all flex items-center gap-2"
            >
                Complete Meditation <ChevronRight size={20} />
            </button>
        </div>
    )
}

const TalkToFriend = ({ onComplete }) => {
    const [thought, setThought] = useState('');

    return (
        <div className="flex flex-col space-y-8 py-8 items-center text-center">
            <div className="max-w-md bg-blue-50 dark:bg-blue-900/10 p-8 rounded-3xl border border-blue-100 dark:border-blue-900/30">
                <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Reach Out</h3>
                <p className="text-gray-600 dark:text-gray-400">Connection is a powerful tool for wellbeing. Think of one friend or family member you trust. What's one thing you'd like to share with them right now?</p>
            </div>
            
            <textarea 
                value={thought}
                onChange={(e) => setThought(e.target.value)}
                placeholder="Write your thought here... (it stays private)"
                className="w-full max-w-md bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkborder rounded-2xl p-4 min-h-[120px] focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            />

            <button 
                disabled={!thought.trim()}
                onClick={() => onComplete({ thought: thought })}
                className="bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white px-8 py-4 rounded-full font-bold shadow-xl transition-all flex items-center gap-2"
            >
                I've reflected on this <ChevronRight size={20} />
            </button>
        </div>
    )
}

const MoodCheck = ({ onComplete }) => {
    const [sleep, setSleep] = useState('');
    const [energy, setEnergy] = useState('');

    const options = [
        { label: 'Poor', value: 'poor', icon: <Frown className="text-red-500" /> },
        { label: 'Fair', value: 'fair', icon: <Meh className="text-yellow-500" /> },
        { label: 'Good', value: 'good', icon: <Smile className="text-green-500" /> }
    ];

    return (
        <div className="flex flex-col space-y-8 py-8 items-center">
            <div className="text-center max-w-md">
                <h3 className="text-2xl font-bold mb-2">How's your foundation?</h3>
                <p className="text-gray-500">Checking in on your sleep and energy levels helps us understand your baseline.</p>
            </div>

            <div className="w-full max-w-sm space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">How did you sleep last night?</label>
                    <div className="grid grid-cols-3 gap-3">
                        {options.map(opt => (
                            <button 
                                key={opt.value} 
                                onClick={() => setSleep(opt.value)}
                                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${sleep === opt.value ? 'bg-primary-50 border-primary-500 ring-2 ring-primary-500/20' : 'bg-white dark:bg-darkcard border-gray-100 dark:border-darkborder'}`}
                            >
                                {opt.icon}
                                <span className="text-xs font-bold">{opt.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">What is your energy level right now?</label>
                    <div className="grid grid-cols-3 gap-3">
                        {[{ label: 'Low', value: 'low' }, { label: 'Medium', value: 'medium' }, { label: 'High', value: 'high' }].map(opt => (
                            <button 
                                key={opt.value} 
                                onClick={() => setEnergy(opt.value)}
                                className={`p-4 rounded-2xl border font-bold text-sm transition-all ${energy === opt.value ? 'bg-primary-50 border-primary-500 ring-2 ring-primary-500/20' : 'bg-white dark:bg-darkcard border-gray-100 dark:border-darkborder'}`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <button 
                disabled={!sleep || !energy}
                onClick={() => onComplete({ sleep, energy })}
                className="bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white px-8 py-4 rounded-full font-bold shadow-xl transition-all flex items-center gap-2 mt-4"
            >
                Submit Check-in <ChevronRight size={20} />
            </button>
        </div>
    );
};

const AnxietyTest = ({ onComplete }) => {
    const [q1, setQ1] = useState(null);
    const [q2, setQ2] = useState(null);

    const scores = [
        { label: 'Not at all', value: 0 },
        { label: 'Several days', value: 1 },
        { label: 'More than half the days', value: 2 },
        { label: 'Nearly every day', value: 3 }
    ];

    return (
        <div className="flex flex-col space-y-10 py-8 items-center">
            <div className="text-center max-w-md">
                <ClipboardList className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Anxiety Assessment</h3>
                <p className="text-gray-500 italic">Over the last 2 weeks, how often have you been bothered by the following problems?</p>
            </div>

            <div className="w-full max-w-lg space-y-8">
                <div className="bg-gray-50 dark:bg-darkbg p-6 rounded-3xl">
                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-4">1. Feeling nervous, anxious, or on edge?</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {scores.map(s => (
                            <button 
                                key={s.value} 
                                onClick={() => setQ1(s.value)}
                                className={`p-3 rounded-xl border text-[10px] font-bold leading-tight transition-all ${q1 === s.value ? 'bg-primary-600 text-white border-primary-600 shadow-md' : 'bg-white dark:bg-darkcard border-gray-200 dark:border-gray-800'}`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-darkbg p-6 rounded-3xl">
                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-4">2. Not being able to stop or control worrying?</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {scores.map(s => (
                            <button 
                                key={s.value} 
                                onClick={() => setQ2(s.value)}
                                className={`p-3 rounded-xl border text-[10px] font-bold leading-tight transition-all ${q2 === s.value ? 'bg-primary-600 text-white border-primary-600 shadow-md' : 'bg-white dark:bg-darkcard border-gray-200 dark:border-gray-800'}`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <button 
                disabled={q1 === null || q2 === null}
                onClick={() => onComplete({ q1, q2 })}
                className="bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white px-10 py-4 rounded-full font-bold shadow-xl transition-all flex items-center gap-2 mt-4"
            >
                Submit Assessment <ChevronRight size={20} />
            </button>
        </div>
    );
};

export default function MilestoneActivity() {
  const { type } = useParams();
  const navigate = useNavigate();
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleComplete = async (data = {}) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/milestones/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: type, data })
      });
      
      if (res.ok) {
        setCompleted(true);
      }
    } catch (error) {
      console.error("Failed to complete milestone:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkbg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </button>

        <div className="bg-white dark:bg-darkcard rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-darkborder p-8 sm:p-12 overflow-hidden relative">
          
          <AnimatePresence mode="wait">
            {!completed ? (
              <motion.div
                key="activity"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {type === 'breathing' && <BreathingExercise onComplete={handleComplete} />}
                {type === 'meditation' && <MeditationActivity onComplete={handleComplete} />}
                {type === 'talking_to_friend' && <TalkToFriend onComplete={handleComplete} />}
                {type === 'mood_check' && <MoodCheck onComplete={handleComplete} />}
                {type === 'anxiety_test' && <AnxietyTest onComplete={handleComplete} />}
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 text-primary-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner shadow-primary-500/20">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Well Done!</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-sm mx-auto text-lg leading-relaxed">
                  You've successfully completed this milestone. Your progress has been saved.
                </p>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-primary-600 hover:bg-primary-500 text-white px-10 py-4 rounded-full font-bold shadow-xl shadow-primary-500/30 transition-all transform hover:-translate-y-1"
                >
                  Return to Dashboard
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {loading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-darkbg/80 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-bold text-primary-600">Saving Progress...</p>
              </div>
            </div>
          )}
        </div>

        {/* Tips Section */}
        {!completed && (
            <div className="mt-8 flex gap-4 bg-primary-50/50 dark:bg-primary-900/5 p-6 rounded-3xl border border-primary-100/50 dark:border-primary-900/20">
                <AlertCircle className="text-primary-500 shrink-0 mt-1" />
                <div>
                    <p className="text-sm font-bold text-primary-900 dark:text-primary-300">Quick Tip</p>
                    <p className="text-sm text-primary-700/70 dark:text-primary-400/70 italic">
                        {type === 'breathing' ? "If you feel lightheaded, pause and breathe normally. It's okay to start slow." : 
                         type === 'meditation' ? "If your mind wanders, gently bring your focus back to the affirmation without judgment." : 
                         type === 'talking_to_friend' ? "Talking to a friend doesn't always have to be about 'serious' things. Sometimes just sharing a laugh is the best support." :
                         type === 'mood_check' ? "Be honest with yourself. Tracking physical health metrics like sleep is key to identifying emotional patterns." :
                         "These questions are part of a standard screening tool (GAD-2). They help us understand your baseline worry levels."}
                    </p>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}
