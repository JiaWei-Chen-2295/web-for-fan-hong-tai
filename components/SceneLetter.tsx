import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Quote } from 'lucide-react';
import { TransitionProps } from '../types';

export const SceneLetter: React.FC<TransitionProps> = ({ onNext }) => {
  return (
    <div className="relative w-full h-full bg-[#1e1e1e] flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Spotlight Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[80%] bg-gradient-to-b from-white/10 to-transparent blur-[100px] pointer-events-none" />
      
      {/* Letter Container */}
      <motion.div
        initial={{ rotateX: 90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="bg-[#fdfaf1] w-full max-w-sm rounded-sm shadow-2xl relative overflow-hidden"
        style={{ transformPerspective: 1000, transformOrigin: "top" }}
      >
        {/* Paper Texture */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-50"></div>
        
        {/* Top Decorative Strip */}
        <div className="h-2 bg-[#d14444] w-full relative">
            <div className="absolute bottom-0 w-full h-[1px] bg-black/10"></div>
        </div>

        <div className="p-8 pb-10 relative">
            {/* Reading Light Scan Effect */}
            <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ duration: 3, delay: 1, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none"
            />

            <Quote className="w-6 h-6 text-[#d14444]/20 absolute top-6 left-6" />

            <div className="space-y-6 font-serif text-[#2c2c2c] leading-relaxed">
                <motion.p 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                    className="font-bold text-lg border-b border-black/10 pb-2 inline-block pr-10"
                >
                    有责任感的 ______：
                </motion.p>
                
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="bg-blue-50/50 p-4 rounded-lg border-l-2 border-blue-400 my-4">
                    <p className="text-sm italic text-[#555] leading-loose">
                        我走过的路 只有希望<br/>
                        希望你我讲过的话 放在心肝里<br/>
                        总有那么一天<br/>
                        <span className="text-xs text-right block mt-2 text-[#999]">—《憨人》</span>
                    </p>
                </motion.div>
                
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }} className="space-y-4 text-sm text-[#444]">
                   <p>未来的你 会一帆风顺</p>
                   <p>如果你忘了我 就让风替代我 说出对你的感谢</p>
                   <p>如果能有一天 再一次重返光荣 记得找我 我的好朋友</p>
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}
                    className="pt-6 border-t border-[#d14444]/10 mt-6 text-right"
                >
                    <p className="text-sm font-bold text-[#2c2c2c]">永远的朋友，陈佳玮</p>
                    <p className="font-handwritten text-lg text-[#d14444] mt-1">2026.2.23</p>
                </motion.div>
            </div>
        </div>
      </motion.div>

      {/* Next Button */}
      <motion.button
        onClick={onNext}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 4 }}
        className="mt-10 flex items-center gap-2 text-white/60 hover:text-white transition-colors uppercase text-xs tracking-widest"
      >
        <span>One Last Surprise</span>
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </div>
  );
};