import React, { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { RoadmapStep } from '../types';
import { ICON_MAP } from '../constants';
import { LucideIcon } from 'lucide-react';

interface RoadmapCardProps {
  step: RoadmapStep;
  index: number;
  isLeft: boolean;
  onClick: (step: RoadmapStep) => void;
}

export const RoadmapCard: React.FC<RoadmapCardProps> = ({ step, index, isLeft, onClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position for 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth out the mouse movement
  const mouseX = useSpring(x, { stiffness: 500, damping: 50 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 50 });

  const rotateX = useMotionTemplate`${mouseY}deg`;
  const rotateY = useMotionTemplate`${mouseX}deg`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate center relative to element
    const centerX = rect.left + width / 2;
    const centerY = rect.top + height / 2;
    
    // Get mouse offset from center
    const mouseXVal = e.clientX - centerX;
    const mouseYVal = e.clientY - centerY;
    
    // Convert to degrees (limit rotation)
    const rotateXVal = (mouseYVal / height) * -20; // Inverse Y for natural tilt
    const rotateYVal = (mouseXVal / width) * 20;

    x.set(rotateYVal);
    y.set(rotateXVal);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const IconComponent: LucideIcon = (step.iconName && ICON_MAP[step.iconName]) 
    ? ICON_MAP[step.iconName] 
    : ICON_MAP['Code2'];

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -50 : 50, y: 50 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, type: "spring" }}
      className={`relative w-full md:w-[45%] mb-12 md:mb-24 flex ${isLeft ? 'md:mr-auto md:justify-end' : 'md:ml-auto md:justify-start'}`}
      onClick={() => onClick(step)}
    >
      {/* Connector Line to Center (Desktop Only) */}
      <div className={`hidden md:block absolute top-1/2 w-[10%] h-[2px] bg-brand-accent/30 
        ${isLeft ? 'right-[-10%]' : 'left-[-10%]'}`} 
      />
      
      {/* Node Dot (Desktop Only) */}
      <div className={`hidden md:block absolute top-1/2 w-4 h-4 rounded-full bg-brand-accent shadow-[0_0_10px_rgba(99,102,241,0.8)]
        ${isLeft ? 'right-[-11%] translate-x-1/2' : 'left-[-11%] -translate-x-1/2'} -translate-y-1/2 z-10`} 
      />

      <div className="perspective-container w-full max-w-md">
        <motion.div
          ref={ref}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          className="relative group cursor-pointer"
        >
          {/* Card Background & Border */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/20 to-purple-600/20 rounded-2xl transform translate-z-[-10px] blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
          
          <div className="relative bg-brand-card/90 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl overflow-hidden active:scale-95 transition-transform duration-200">
            {/* Number Watermark */}
            <div className="absolute -right-4 -top-6 text-[120px] font-bold text-white/5 font-display select-none pointer-events-none">
              0{index + 1}
            </div>

            <div className="relative z-10 transform-style-3d">
              {/* Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-brand-accent/10 rounded-xl border border-brand-accent/20 text-brand-accent group-hover:scale-110 transition-transform duration-300">
                  <IconComponent size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">{step.duration}</span>
                  <h3 className="text-xl font-bold font-display text-white group-hover:text-brand-accent transition-colors">
                    {step.title}
                  </h3>
                </div>
              </div>

              {/* Content */}
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                {step.description}
              </p>

              {/* Tags */}
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium border
                  ${step.category === 'core' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : ''}
                  ${step.category === 'advanced' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' : ''}
                  ${step.category === 'tooling' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : ''}
                `}>
                  {step.category.toUpperCase()}
                </span>
                <span className="ml-auto text-xs text-brand-accent/70 flex items-center">
                   Click for details &rarr;
                </span>
              </div>
            </div>
            
            {/* Shine Effect */}
            <div 
              className={`absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12 transition-transform duration-1000 ease-in-out pointer-events-none
              ${isHovered ? 'translate-x-full' : '-translate-x-full'}`} 
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};