import React, { useState } from 'react';
import { RoadmapView } from './components/RoadmapView';
import { INITIAL_ROADMAP, ICON_MAP } from './constants';
import { RoadmapStep } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Calendar, CheckCircle2 } from 'lucide-react';

const App: React.FC = () => {
  const [steps] = useState<RoadmapStep[]>(INITIAL_ROADMAP);
  const [selectedStep, setSelectedStep] = useState<RoadmapStep | null>(null);
  const [currentTopic] = useState("Frontend Development");

  return (
    <div className="min-h-screen bg-brand-dark relative overflow-x-hidden selection:bg-brand-accent selection:text-white">
      {/* Ambient Background Lights */}
      <div className="fixed top-0 left-0 w-full h-screen overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-accent/20 rounded-full blur-[120px] animate-float" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '-3s' }} />
      </div>

      <main className="relative z-10 pt-16 pb-20">
        
        {/* Header Section */}
        <section className="text-center px-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-brand-accent/10 text-brand-accent text-xs font-bold tracking-widest border border-brand-accent/20 mb-6">
                INTERACTIVE 3D ROADMAP
            </span>
            <h1 className="text-5xl md:text-7xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-6 drop-shadow-xl">
              {currentTopic}
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
              A visualized path to mastery. Click on any milestone to view detailed timeline and curriculum information.
            </p>
          </motion.div>
        </section>

        {/* Roadmap Display */}
        <div id="roadmap-view">
           <RoadmapView steps={steps} onStepClick={setSelectedStep} />
        </div>

      </main>

      {/* Step Detail Modal */}
      <AnimatePresence>
        {selectedStep && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStep(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#12121A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Modal Decor */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-accent via-purple-500 to-brand-accent" />
              
              <button 
                onClick={() => setSelectedStep(null)}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors z-10"
              >
                <X size={20} />
              </button>

              <div className="p-8">
                {/* Header with Icon */}
                <div className="flex items-start gap-5 mb-8">
                  <div className="p-4 bg-brand-accent/10 rounded-xl border border-brand-accent/20 text-brand-accent shrink-0">
                    {(() => {
                      const Icon = selectedStep.iconName && ICON_MAP[selectedStep.iconName] 
                        ? ICON_MAP[selectedStep.iconName] 
                        : ICON_MAP['Code2'];
                      return <Icon size={32} />;
                    })()}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold font-display text-white mb-2 leading-tight">
                      {selectedStep.title}
                    </h2>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border uppercase tracking-wider
                      ${selectedStep.category === 'core' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : ''}
                      ${selectedStep.category === 'advanced' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' : ''}
                      ${selectedStep.category === 'tooling' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : ''}
                    `}>
                      {selectedStep.category}
                    </span>
                  </div>
                </div>

                {/* Duration Highlight Card */}
                <div className="bg-gradient-to-br from-brand-accent/20 to-purple-900/20 border border-brand-accent/20 rounded-xl p-5 mb-6 flex items-center gap-4">
                  <div className="p-3 bg-brand-accent rounded-lg text-white shadow-lg shadow-brand-accent/40">
                     <Clock size={24} />
                  </div>
                  <div className="flex-1">
                     <p className="text-xs text-brand-accent font-bold uppercase tracking-wider mb-1">Estimated Duration</p>
                     <p className="text-2xl font-bold text-white">{selectedStep.duration}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <CheckCircle2 size={14} /> What you'll learn
                    </h3>
                    <p className="text-gray-300 text-lg leading-relaxed border-l-2 border-white/10 pl-4">
                      {selectedStep.description}
                    </p>
                  </div>
                  
                  <div className="pt-4 mt-6 border-t border-white/5">
                    <button 
                      onClick={() => setSelectedStep(null)}
                      className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Close Details
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center border-t border-white/5 bg-black/20 backdrop-blur-sm">
        <p className="text-gray-600 text-sm">
          Built with React & Tailwind
        </p>
      </footer>
    </div>
  );
};

export default App;