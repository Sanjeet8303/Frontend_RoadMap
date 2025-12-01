import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { RoadmapStep } from '../types';
import { RoadmapCard } from './RoadmapCard';

interface RoadmapViewProps {
  steps: RoadmapStep[];
  onStepClick: (step: RoadmapStep) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ steps, onStepClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgHeight, setSvgHeight] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    if (containerRef.current) {
      setSvgHeight(containerRef.current.clientHeight);
    }
    const handleResize = () => {
        if(containerRef.current) setSvgHeight(containerRef.current.clientHeight);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [steps]);

  // Generate path data for a winding snake shape
  const generateSnakePath = (height: number) => {
    if (height === 0) return "";
    
    // We need points to connect. 
    // Start top center.
    // Loop through steps.
    // For each step pair, we need a curve.
    
    const width = 100; // SVG viewBox width percentage-ish
    const startX = 50;
    const startY = 0;
    let d = `M ${startX} ${startY}`;
    
    // Distance between nodes vertically
    // This is an approximation as actual DOM elements determine height, but for the BG line we estimate
    const stepHeight = height / (steps.length + 1);
    
    for (let i = 0; i < steps.length; i++) {
        // We want the line to wave between left (approx 20%) and right (approx 80%) 
        // depending on step index? Actually, the design shows items on alternating sides, 
        // but the line itself stays relatively central with a wave.
        
        const y = (i + 1) * stepHeight;
        
        // Curve parameters
        const isEven = i % 2 === 0;
        const amplitude = 15; // How wide the snake waves
        
        // Control points for cubic bezier
        const prevY = i * stepHeight;
        
        // Simple wave down the center
        const waveX = isEven ? 50 - amplitude : 50 + amplitude;
        
        d += ` C 50 ${prevY + stepHeight/2}, ${waveX} ${prevY + stepHeight/2}, 50 ${y}`;
    }
    
    // Extend to bottom
    d += ` L 50 ${height}`;
    
    return d;
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-6xl mx-auto px-4 py-20 min-h-screen">
      
      {/* Background SVG Path (Desktop) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none hidden md:block z-0 overflow-hidden">
        <svg 
          className="w-full h-full" 
          viewBox={`0 0 100 ${svgHeight}`} 
          preserveAspectRatio="none"
        >
          {/* Base Track */}
          <path 
            d={generateSnakePath(svgHeight)}
            fill="none"
            stroke="#1f2937" 
            strokeWidth="2"
            strokeDasharray="10 10"
          />
          {/* Animated Glow Track */}
          <motion.path 
            d={generateSnakePath(svgHeight)}
            fill="none"
            stroke="#6366f1"
            strokeWidth="4"
            style={{ pathLength }}
            strokeLinecap="round"
          />
          
          {/* Animated Gradient definitions */}
          <defs>
            <linearGradient id="roadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="1" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Mobile Line (Simple vertical) */}
      <div className="absolute top-0 left-8 w-1 h-full bg-gray-800 md:hidden z-0">
         <motion.div 
            className="w-full bg-brand-accent origin-top"
            style={{ height: "100%", scaleY: pathLength }} 
         />
      </div>

      <div className="relative z-10 flex flex-col w-full">
        {steps.map((step, index) => (
          <div key={step.id} className="relative w-full flex md:block pl-16 md:pl-0">
             {/* Mobile Dot */}
             <div className="absolute left-[26px] top-6 w-3 h-3 rounded-full bg-brand-accent md:hidden shadow-[0_0_10px_rgba(99,102,241,0.8)] z-20"></div>
             
             <RoadmapCard 
                step={step} 
                index={index} 
                isLeft={index % 2 === 0}
                onClick={onStepClick}
             />
          </div>
        ))}
      </div>
      
      {/* End Node */}
      <div className="flex justify-center mt-12 relative z-10">
        <motion.div 
           initial={{ scale: 0 }}
           whileInView={{ scale: 1 }}
           className="px-8 py-4 bg-brand-accent text-white rounded-full font-bold shadow-lg shadow-brand-accent/50 text-xl tracking-wider"
        >
           GOAL REACHED
        </motion.div>
      </div>
    </div>
  );
};