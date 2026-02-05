import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Gift, Sparkles } from 'lucide-react';
import { TransitionProps } from '../types';

export const SceneGift: React.FC<TransitionProps> = ({ onNext, onReplay }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        if (isOpen) return;
        setIsOpen(true);

        // Confetti explosion
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#6BA3D6', '#9B8EC6', '#E8C48A', '#ffffff', '#E8B4A8']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#6BA3D6', '#9B8EC6', '#E8C48A', '#ffffff', '#D4A4A4']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    };

    return (
        <div className="relative w-full h-full bg-sky-twilight flex flex-col items-center justify-center p-6 overflow-hidden">
            {/* Dual color spotlight - blue + gold */}
            <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[300px] h-1/2 bg-gradient-to-b from-mayday-blue/20 to-transparent blur-3xl pointer-events-none"></div>
            <div className="absolute top-0 right-1/4 translate-x-1/2 w-[300px] h-1/2 bg-gradient-to-b from-honey-glow/15 to-transparent blur-3xl pointer-events-none"></div>

            <AnimatePresence mode="wait">
                {!isOpen ? (
                    <motion.div
                        key="closed"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: "spring" }}
                        className="relative cursor-pointer group"
                        onClick={handleOpen}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {/* Gift Box with Heartbeat Pulse */}
                        <motion.div
                            // Heartbeat animation: rapid pulse then pause
                            animate={{
                                scale: [1, 1.05, 1, 1.05, 1],
                                rotate: [0, -1, 1, -1, 0]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                repeatDelay: 1, // Pause between beats
                                ease: "easeInOut"
                            }}
                            className="w-48 h-48 bg-gradient-to-br from-deep-mayday to-mayday-blue rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center relative z-10 border border-white/10"
                        >
                            {/* Ribbon */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-6 h-full bg-white/10 shadow-sm backdrop-blur-sm"></div>
                                <div className="h-6 w-full bg-white/10 absolute shadow-sm backdrop-blur-sm"></div>
                            </div>
                            {/* Lid */}
                            <div className="absolute top-0 w-52 h-12 bg-deep-mayday rounded-sm -mt-2 shadow-lg border-b border-white/5"></div>
                            <Gift className="w-16 h-16 text-white/80 z-20 opacity-80" />
                        </motion.div>

                        <div className="mt-12 text-center">
                            <p className="text-white/60 text-sm tracking-widest uppercase animate-pulse">这里有一个礼物给你哦</p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="opened"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="text-center z-20 max-w-sm"
                    >
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mb-8 flex justify-center"
                        >
                            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-mayday-blue to-honey-glow flex items-center justify-center shadow-lg shadow-mayday-blue/30">
                                <Sparkles className="w-10 h-10 text-white fill-white" />
                            </div>
                        </motion.div>

                        <h2 className="text-2xl font-bold text-white mb-6">惊喜将在三月揭晓</h2>

                        <div className="p-6 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 mb-8">
                            <p className="text-white/90 font-serif leading-relaxed">
                                一个实体的礼物<br />
                                正等待与你见面<br />
                                <span className="text-xs text-white/40 block mt-4 uppercase tracking-widest">Coming Soon</span>
                            </p>
                        </div>

                        <p className="text-blush-coral font-handwritten text-xl tracking-wide">
                            谢谢你出现在我的生命里
                        </p>

                        <motion.button
                            onClick={onReplay}
                            whileHover={{ scale: 1.05, color: '#ffffff' }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-12 text-white/30 text-xs transition-colors uppercase tracking-widest"
                        >
                            再次回到那一天
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};