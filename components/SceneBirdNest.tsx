import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronDown, Train, Map, Music } from 'lucide-react';
import { TransitionProps } from '../types';

interface SectionProps {
    title: string;
    icon: React.ElementType;
    content: string;
    isOpen: boolean;
    onToggle: () => void;
    img: string;
}

const AccordionSection: React.FC<SectionProps> = ({ title, icon: Icon, content, isOpen, onToggle, img }) => {
    return (
        <div className="mb-4 overflow-hidden rounded-xl border border-blue-500/20 bg-blue-950/30 backdrop-blur-md">
            <button 
                onClick={onToggle}
                className="w-full p-4 flex items-center justify-between text-left text-blue-100"
            >
                <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-blue-400" />
                    <span className="font-bold tracking-wide">{title}</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 pt-0">
                            <div className="h-32 w-full rounded-lg bg-cover bg-center mb-3 shadow-inner" style={{ backgroundImage: `url('${img}')` }}></div>
                            <p className="text-sm text-blue-200/70 leading-relaxed font-light">
                                {content}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const SceneBirdNest: React.FC<TransitionProps> = ({ onNext }) => {
  const [openSection, setOpenSection] = useState<number | null>(0);

  return (
    <div className="relative w-full h-full bg-[#0f172a] text-white flex flex-col items-center overflow-hidden">
      {/* Background with subtle glow */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-luminosity"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-blue-900/20"></div>
      
      {/* Floating particles/glow sticks */}
      <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
              <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-blue-400 rounded-full blur-[1px]"
                  initial={{ 
                      x: Math.random() * window.innerWidth, 
                      y: Math.random() * window.innerHeight, 
                      opacity: 0.2 
                  }}
                  animate={{ 
                      y: [null, Math.random() * -100], 
                      opacity: [0.2, 0.8, 0.2] 
                  }}
                  transition={{ 
                      duration: 3 + Math.random() * 5, 
                      repeat: Infinity, 
                      ease: "linear" 
                  }}
              />
          ))}
      </div>

      <div className="relative z-10 w-full px-6 pt-12 flex flex-col h-full">
        {/* Header */}
        <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8 text-center"
        >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-400/30 bg-blue-900/30 backdrop-blur-sm mb-4">
                <MapPin className="w-3 h-3 text-blue-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">2024.05.22 · 北京鸟巢</span>
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-blue-300">
                那一夜<br/>没有你完全不行
            </h1>
        </motion.div>

        {/* Content Accordion */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
            <AccordionSection 
                title="在火车上" 
                icon={Train}
                content="漫长的旅途，因为有期待和你的陪伴，似乎也变得不那么难熬。窗外的风景倒退，我们离梦想越来越近。"
                img="https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=2070&auto=format&fit=crop"
                isOpen={openSection === 0}
                onToggle={() => setOpenSection(openSection === 0 ? null : 0)}
            />
            <AccordionSection 
                title="到达鸟巢时" 
                icon={Map}
                content="巨大而沉默的建筑，在夜色中亮起灯光。那一刻，真的有一种“朝圣”的实感，人潮汹涌，而你在身边。"
                img="https://images.unsplash.com/photo-1514525253440-b39345208668?q=80&w=2070&auto=format&fit=crop"
                isOpen={openSection === 1}
                onToggle={() => setOpenSection(openSection === 1 ? null : 1)}
            />
             <AccordionSection 
                title="最感动的瞬间" 
                icon={Music}
                content="当那首熟悉的旋律响起，十万人的大合唱震耳欲聋。我看了一眼身边的你，觉得这一切都值了。"
                img="https://images.unsplash.com/photo-1459749411177-0473ef4884f3?q=80&w=2070&auto=format&fit=crop"
                isOpen={openSection === 2}
                onToggle={() => setOpenSection(openSection === 2 ? null : 2)}
            />
        </div>

        <motion.button
            onClick={onNext}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mb-8 w-full py-4 text-center text-blue-300/50 text-sm tracking-[0.2em] uppercase hover:text-white transition-colors animate-pulse"
        >
            Continue to Letter
        </motion.button>
      </div>
    </div>
  );
};