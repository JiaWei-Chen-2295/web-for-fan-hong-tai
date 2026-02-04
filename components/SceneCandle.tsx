import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind } from 'lucide-react';
import { TransitionProps } from '../types';

export const SceneCandle: React.FC<TransitionProps> = ({ onNext }) => {
  const [isBlown, setIsBlown] = useState(false);
  const [showWishes, setShowWishes] = useState(false);

  const handleBlow = () => {
    if (isBlown) return;
    setIsBlown(true);
    setTimeout(() => {
      setShowWishes(true);
      setTimeout(onNext, 5000); // Give enough time to read
    }, 1000);
  };

  return (
    <div className="relative w-full h-full bg-[#050308] flex flex-col items-center justify-center overflow-hidden">
      {/* 1. Global Ambiance / Lighting */}
      {/* Background radial glow that pulses with the flame */}
      {!isBlown && (
          <motion.div 
            animate={{ opacity: [0.3, 0.35, 0.25, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-900/20 rounded-full blur-[100px] pointer-events-none"
          />
      )}
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black/80 pointer-events-none" />

      {/* 2. The Candle Object */}
      <div className="relative z-10 flex flex-col items-center cursor-pointer mb-10 group" onClick={handleBlow}>
        <div className="relative">
            
            {/* --- REALISTIC FLAME --- */}
            {/* Positioned relative to the top of the candle, adjusted to sit on the wick */}
            <AnimatePresence>
                {!isBlown && (
                    <div className="absolute bottom-[calc(100%+14px)] left-1/2 -translate-x-1/2 w-12 h-32 pointer-events-none z-30 origin-bottom flex flex-col justify-end items-center">
                         {/* Outer Glow (Atmosphere) */}
                         <motion.div 
                            animate={{ scale: [1, 1.05, 0.95, 1], opacity: [0.5, 0.6, 0.5] }}
                            transition={{ duration: 0.1, repeat: Infinity }}
                            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-32 bg-orange-400/20 rounded-full blur-[40px]"
                         />

                         {/* Main Flame Physics */}
                         <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0, y: -20, transition: { duration: 0.3 } }}
                            className="w-full h-full relative flex justify-center items-end pb-2"
                         >
                            {/* The Flame Shape Container - with slight wind flicker */}
                            <motion.div
                                animate={{ 
                                    scaleY: [1, 1.05, 0.98, 1.02, 1], 
                                    rotate: [-1, 1, -1.5, 0.5, 0],
                                    skewX: [-1, 1, 0]
                                }}
                                transition={{ duration: 0.15, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                                className="w-10 h-24 relative origin-bottom flex justify-center"
                            >
                                {/* Base Blue (Hottest part) - Aligned to bottom */}
                                <div className="absolute bottom-0 w-2 h-5 bg-blue-600/80 rounded-full blur-[3px]"></div>
                                
                                {/* Core Flame Body */}
                                <div className="absolute bottom-2 w-6 h-16 bg-gradient-to-t from-orange-500 via-orange-300 to-yellow-100 rounded-[50%_50%_50%_50%_/_70%_70%_30%_30%] blur-[1px] shadow-[0_0_10px_rgba(255,165,0,0.5)]"></div>
                                
                                {/* Brightest Tip */}
                                <div className="absolute bottom-8 w-2 h-8 bg-white/90 rounded-[50%] blur-[2px]"></div>

                                {/* Heat Distortion (Subtle) */}
                                <div className="absolute top-0 w-full h-8 bg-white/10 rounded-full blur-md opacity-20"></div>
                            </motion.div>
                         </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- SMOKE (On Blow) --- */}
            <AnimatePresence>
                {isBlown && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: [0, 0.4, 0], y: -140, x: [0, 10, -5, 15], scale: 1.5, filter: "blur(10px)" }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 4, ease: "easeOut" }}
                        className="absolute bottom-[100%] left-1/2 -translate-x-1/2 w-4 h-40 origin-bottom z-30 pointer-events-none"
                    >
                         <div className="w-2 h-full bg-gradient-to-t from-gray-500 via-gray-400 to-transparent rounded-full opacity-30"></div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* --- REALISTIC WAX CANDLE BODY --- */}
            <div className="relative w-20 h-52">
                {/* 1. The Wick */}
                {/* Protrudes from top. Top of candle is 0. Wick starts slightly inside and goes up. */}
                {/* z-index: between surface and flame */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-[3px] h-6 bg-gradient-to-b from-[#1a1a1a] to-[#5a5a5a] rounded-t-sm z-20 origin-bottom">
                    {/* Glowing tip of the wick */}
                    {!isBlown && <div className="absolute top-0 w-full h-2 bg-red-500/60 blur-[1px] rounded-full animate-pulse"></div>}
                </div>

                {/* 2. Top Surface (The "Pool" of melted wax) */}
                <div className="absolute -top-2 left-0 right-0 h-6 bg-[#fff1f2] rounded-[50%] z-10 shadow-[inset_0_2px_5px_rgba(255,255,255,0.8),_inset_0_-2px_5px_rgba(0,0,0,0.1)] overflow-hidden">
                    {/* Inner glow from flame (Subsurface scattering) */}
                    {!isBlown && (
                        <motion.div 
                            animate={{ opacity: [0.6, 0.8, 0.6] }}
                            transition={{ duration: 0.2, repeat: Infinity }}
                            className="absolute inset-0 bg-orange-400/30 blur-md" 
                        />
                    )}
                    {/* Liquid reflection */}
                    <div className="absolute top-1 left-4 w-6 h-3 bg-white/60 rounded-full blur-[2px] rotate-12"></div>
                </div>

                {/* 3. The Main Cylinder Body */}
                <div className="w-full h-full rounded-b-xl rounded-t-lg overflow-hidden relative bg-[#fecdd3] shadow-2xl">
                     
                     {/* A. Material Texture & Color (Soft Pink Wax) */}
                     <div className="absolute inset-0 bg-[#ffe4e6]"></div>

                     {/* B. Spiral Pattern (Embedded in wax) */}
                     <div className="absolute inset-0 opacity-80" 
                          style={{
                              background: `repeating-linear-gradient(
                                135deg,
                                rgba(255,255,255,0.4), 
                                rgba(255,255,255,0.4) 15px,
                                transparent 15px,
                                transparent 30px
                              )`
                          }}
                     />
                     
                     {/* C. 3D Lighting (Cylinder effect) */}
                     {/* Darker sides */}
                     <div className="absolute inset-0 bg-gradient-to-r from-rose-900/30 via-transparent to-rose-900/30 mix-blend-multiply pointer-events-none"></div>
                     {/* Highlight center */}
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent mix-blend-soft-light pointer-events-none"></div>
                     
                     {/* D. Subsurface Scattering (Glow at top of body) */}
                     {!isBlown && (
                         <motion.div 
                            animate={{ opacity: [0.7, 0.9, 0.7] }}
                            transition={{ duration: 0.2, repeat: Infinity }}
                            className="absolute top-0 w-full h-16 bg-gradient-to-b from-orange-400/60 to-transparent mix-blend-overlay blur-md"
                         />
                     )}
                </div>

                {/* 4. Bottom Shadow/Reflection */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-full h-4 bg-black/50 blur-lg rounded-[50%]"></div>
            </div>
        </div>

        {/* Interaction Hint - Elegant style */}
        <AnimatePresence>
            {!isBlown && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 1 }}
                    className="mt-20 flex flex-col items-center gap-3 text-white/40 text-center"
                >
                    <div className="relative">
                        <p className="text-4xl font-brush text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400 drop-shadow-sm">Happy Birthday</p>
                        <motion.div 
                            animate={{ opacity: [0, 0.5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 bg-gradient-to-r from-amber-200 to-orange-400 blur-xl opacity-30"
                        />
                    </div>
                    
                    <motion.div 
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-3 px-5 py-2.5 bg-white/5 rounded-full backdrop-blur-md border border-white/10 transition-colors shadow-[0_0_15px_rgba(0,0,0,0.2)]"
                    >
                        <Wind className="w-3.5 h-3.5 text-blue-300/80" />
                        <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-blue-100/70 font-medium">Blow out the candle</span>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* Wishes Text Overlay */}
      <AnimatePresence>
        {showWishes && (
            <motion.div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 1.2, ease: "circOut" }}
                    className="text-center p-8 relative"
                >
                    {/* Background Glow behind text */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/10 blur-3xl rounded-full"></div>

                    <motion.div 
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}
                        className="relative"
                    >
                        <h2 className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 font-brush text-6xl mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                            愿望会实现的
                        </h2>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.2 }}
                    >
                        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mb-6"></div>
                        <p className="text-white/50 font-serif text-sm tracking-[0.3em] uppercase">
                            Make a wish
                        </p>
                    </motion.div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};