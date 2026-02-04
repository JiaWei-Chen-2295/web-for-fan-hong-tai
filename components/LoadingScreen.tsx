import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music } from 'lucide-react';

interface LoadingScreenProps {
    onComplete: () => void;
}

const RESOURCES = [
    '/assets/hu_shang_a_yi.jpg',
    '/assets/jun_xun.jpg',
    '/assets/cheng_ming_qu.jpg',
    '/assets/pei_ban.jpg',
    '/assets/dan_gao.jpg',
    '/assets/lao_dong_zhou.jpg',
    'https://images.unsplash.com/photo-1514525253440-b39345208668?q=80&w=2070&auto=format&fit=crop'
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [isDone, setIsDone] = useState(false);

    useEffect(() => {
        let loadedCount = 0;
        const totalToLoad = RESOURCES.length + 1; // Images + Fonts

        const updateProgress = () => {
            loadedCount++;
            const newProgress = Math.round((loadedCount / totalToLoad) * 100);
            setProgress(newProgress);
            if (loadedCount >= totalToLoad) {
                setTimeout(() => setIsDone(true), 500);
            }
        };

        // 1. Preload Images
        RESOURCES.forEach(src => {
            const img = new Image();
            img.src = src;
            img.onload = updateProgress;
            img.onerror = updateProgress; // Continue anyway if one fails
        });

        // 2. Preload Fonts
        if (document.fonts) {
            document.fonts.ready.then(updateProgress);
        } else {
            setTimeout(updateProgress, 1000);
        }
    }, []);

    useEffect(() => {
        if (isDone) {
            const timer = setTimeout(onComplete, 1200);
            return () => clearTimeout(timer);
        }
    }, [isDone, onComplete]);

    return (
        <div className="fixed inset-0 bg-[#0c0a09] z-[100] flex flex-col items-center justify-center text-white overflow-hidden">
            {/* Background Decorative Element */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute w-[500px] h-[500px] bg-dusk-purple/20 rounded-full blur-[120px] pointer-events-none"
            />

            <div className="relative z-10 flex flex-col items-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="mb-8 p-4 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm"
                >
                    <Music className="w-8 h-8 text-sunset-gold" />
                </motion.div>

                <h2 className="font-brush text-3xl mb-8 tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                    记忆正在装载...
                </h2>

                {/* Progress Bar Container */}
                <div className="w-64 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-sunset-orange via-sunset-gold to-sunset-orange shadow-[0_0_15px_rgba(251,191,36,0.5)]"
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 flex items-center gap-2"
                >
                    <span className="text-[10px] font-mono tracking-tighter text-white/30 uppercase">
                        Collecting Memories
                    </span>
                    <span className="text-[10px] font-mono text-sunset-gold font-bold">
                        {progress}%
                    </span>
                </motion.div>
            </div>

            <AnimatePresence>
                {isDone && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-20 flex flex-col items-center gap-2"
                    >
                        <p className="text-xs text-white/40 tracking-[0.3em] uppercase animate-pulse">
                            Ready to go
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Film grain effect during loading */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/noise.png')]" />
        </div>
    );
};
