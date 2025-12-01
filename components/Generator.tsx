import React, { useState } from 'react';
import { generateRoadmap } from '../services/geminiService';
import { RoadmapStep, GeneratorStatus } from '../types';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GeneratorProps {
  onRoadmapGenerated: (topic: string, steps: RoadmapStep[]) => void;
}

export const Generator: React.FC<GeneratorProps> = ({ onRoadmapGenerated }) => {
  const [topic, setTopic] = useState('');
  const [status, setStatus] = useState<GeneratorStatus>(GeneratorStatus.IDLE);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setStatus(GeneratorStatus.GENERATING);
    setError('');

    try {
        // Wait for generation
        const steps = await generateRoadmap(topic);
        onRoadmapGenerated(topic, steps);
        setStatus(GeneratorStatus.SUCCESS);
        setTimeout(() => setStatus(GeneratorStatus.IDLE), 2000); // Reset after success
    } catch (err) {
        setStatus(GeneratorStatus.ERROR);
        setError('Could not generate roadmap. Please check your API Key or try again.');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mb-12 relative z-20">
      <div className="bg-brand-card/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center gap-6">
           <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                    What do you want to learn?
                </label>
                <form onSubmit={handleSubmit} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-accent to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                    <div className="relative flex items-center bg-[#0a0a12] rounded-lg border border-white/10 overflow-hidden focus-within:border-brand-accent transition-colors">
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g. 'Advanced Python', 'UI/UX Design'..."
                            className="w-full bg-transparent border-none px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-0"
                            disabled={status === GeneratorStatus.GENERATING}
                        />
                        <button
                            type="submit"
                            disabled={status === GeneratorStatus.GENERATING || !topic.trim()}
                            className="p-3 text-brand-accent hover:text-white hover:bg-brand-accent/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {status === GeneratorStatus.GENERATING ? (
                                <Loader2 className="animate-spin w-5 h-5" />
                            ) : (
                                <Sparkles className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </form>
           </div>
           
           <div className="hidden md:block w-px h-16 bg-white/10"></div>
           
           <div className="text-center md:text-left">
               <h3 className="text-white font-bold text-lg font-display">AI Generator</h3>
               <p className="text-xs text-gray-500 max-w-[200px]">
                   Powered by Gemini 2.5 Flash. Generates a custom 7-step roadmap instantly.
               </p>
           </div>
        </div>

        <AnimatePresence>
            {status === GeneratorStatus.ERROR && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm"
                >
                    <AlertCircle size={16} />
                    {error}
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
};