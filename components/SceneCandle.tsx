import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Mic, MousePointerClick } from 'lucide-react';
import { TransitionProps } from '../types';

export const SceneCandle: React.FC<TransitionProps> = ({ onNext, isActive }) => {
    const [isBlown, setIsBlown] = useState(false);
    const [showWishes, setShowWishes] = useState(false);
    const [flameIntensity, setFlameIntensity] = useState(1);
    const [windDirection, setWindDirection] = useState(0);
    const [particleCount, setParticleCount] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [micPermission, setMicPermission] = useState<boolean | null>(null);

    // --- Audio / Blow Detection Logic ---
    const handleBlow = useCallback(() => {
        if (isBlown) return;
        setIsBlown(true);
        setTimeout(() => {
            setShowWishes(true);
            setTimeout(onNext, 4000); // Give enough time to read
        }, 1000);
    }, [isBlown, onNext]);

    useEffect(() => {
        if (!isActive || isBlown) return;

        let audioContext: AudioContext | null = null;
        let analyser: AnalyserNode | null = null;
        let microphone: MediaStreamAudioSourceNode | null = null;
        let dataArray: Uint8Array;
        let animationFrameId: number;
        let stream: MediaStream | null = null;

        const checkBlow = () => {
            if (!analyser) return;
            analyser.getByteFrequencyData(dataArray);

            // Calculate average volume
            let sum = 0;
            // Focus on lower frequencies where "blowing" usually lives
            const length = dataArray.length;
            for (let i = 0; i < length; i++) {
                sum += dataArray[i];
            }
            const average = sum / length;

            // Threshold for "blowing" - adjust as needed
            // Normal talking is usually lower, direct blowing spikes volume
            if (average > 45) { // Sensitivity threshold
                handleBlow();
            } else {
                // Subtle flame reaction to sound
                if (average > 10) {
                    setWindDirection((Math.random() - 0.5) * (average / 10));
                }
                animationFrameId = requestAnimationFrame(checkBlow);
            }
        };

        const initAudio = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                setMicPermission(true);

                audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                microphone = audioContext.createMediaStreamSource(stream);

                microphone.connect(analyser);
                analyser.fftSize = 256;
                dataArray = new Uint8Array(analyser.frequencyBinCount);

                checkBlow();
            } catch (err) {
                console.warn("Microphone access denied or error:", err);
                setMicPermission(false);
            }
        };

        // Delay init slightly to avoid immediate prompt on page load if possible, 
        // though isActive should handle it.
        const timer = setTimeout(initAudio, 500);

        return () => {
            clearTimeout(timer);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            if (stream) stream.getTracks().forEach(track => track.stop());
            if (audioContext) audioContext.close();
        };
    }, [isActive, isBlown, handleBlow]);

    // Handle isActive prop - extinguish/re-light candle based on isActive
    // Only react to isActive changes, NOT isBlown changes.
    // Otherwise handleBlow setting isBlown=true triggers this effect,
    // which resets isBlown=false (re-lighting the candle) while the
    // setTimeout still fires showWishes — causing wishes to appear
    // while the candle is still lit.
    const prevActiveRef = useRef(isActive);
    useEffect(() => {
        if (prevActiveRef.current === isActive) return;
        prevActiveRef.current = isActive;

        if (!isActive && !isBlown) {
            setIsBlown(true);
            setTimeout(() => {
                setShowWishes(true);
            }, 1000);
        } else if (isActive && isBlown) {
            setIsBlown(false);
            setShowWishes(false);
            setParticleCount(0);
        }
    }, [isActive, isBlown]);

    // Flame flicker animation
    useEffect(() => {
        if (isBlown) return;

        const flickerInterval = setInterval(() => {
            setFlameIntensity(prev => 0.8 + Math.random() * 0.4);
            setWindDirection(prev => (Math.random() - 0.5) * 1.5);
        }, 300);

        return () => clearInterval(flickerInterval);
    }, [isBlown]);

    // Particle effect when blowing
    useEffect(() => {
        if (!isBlown) return;

        const particleInterval = setInterval(() => {
            setParticleCount(prev => {
                if (prev >= 20) return prev;
                return prev + 1;
            });
        }, 100);

        return () => clearInterval(particleInterval);
    }, [isBlown]);



    return (
        <div
            ref={containerRef}
            onClick={handleBlow} // Click anywhere to blow
            className="relative w-full h-full bg-[#050308] flex flex-col items-center justify-center overflow-hidden cursor-pointer"
        >
            {/* 1. Global Ambiance / Lighting */}
            {/* Enhanced global glow with multiple layers */}
            {!isBlown && (
                <>
                    {/* Primary glow */}
                    <motion.div
                        animate={{
                            opacity: [0.25, 0.35, 0.25, 0.35],
                            scale: [1, 1.02, 0.98, 1]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-900/25 rounded-full blur-[120px] pointer-events-none"
                    />
                    {/* Secondary glow for depth */}
                    <motion.div
                        animate={{
                            opacity: [0.15, 0.25, 0.15, 0.25],
                            scale: [1.1, 1.15, 1.05, 1.1]
                        }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-800/15 rounded-full blur-[180px] pointer-events-none"
                    />
                    {/* Heat distortion effect */}
                    <motion.div
                        animate={{
                            opacity: [0.05, 0.1, 0.05],
                            y: [0, -5, 0]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/5 rounded-full blur-[60px] pointer-events-none"
                    />
                </>
            )}

            {/* Vignette with enhanced depth */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/30 to-black/85 pointer-events-none" />

            {/* 2. The Candle Object */}
            <div
                className="relative z-10 flex flex-col items-center cursor-pointer mb-10 group"
                onClick={handleBlow}
                style={{ perspective: '1000px' }}
            >
                <div className="relative" style={{ transformStyle: 'preserve-3d' }}>

                    {/* --- REALISTIC FLAME --- */}
                    {/* Enhanced flame with multiple layers and physics */}
                    <AnimatePresence>
                        {!isBlown && (
                            <div
                                className="absolute bottom-[calc(100%+14px)] left-1/2 -translate-x-1/2 w-16 h-40 pointer-events-none z-30 origin-bottom flex flex-col justify-end items-center"
                                style={{ transform: `rotateX(${windDirection * 5}deg)` }}
                            >
                                {/* Outer Glow (Atmosphere) - Multiple layers for depth */}
                                <motion.div
                                    animate={{
                                        scale: [1, 1.05, 0.98, 1.02, 1],
                                        opacity: [0.4, 0.45, 0.4, 0.45]
                                    }}
                                    transition={{ duration: 2.5, repeat: Infinity }}
                                    className="absolute bottom-4 left-1/2 -translate-x-1/2 w-40 h-40 bg-orange-400/25 rounded-full blur-[50px]"
                                />
                                <motion.div
                                    animate={{
                                        scale: [1, 1.03, 0.99, 1.02, 1],
                                        opacity: [0.3, 0.35, 0.3]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute bottom-8 left-1/2 -translate-x-1/2 w-32 h-32 bg-yellow-400/15 rounded-full blur-[40px]"
                                />

                                {/* Main Flame Physics - Enhanced with multiple segments */}
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.5, opacity: 0, y: -20, transition: { duration: 0.3 } }}
                                    className="w-full h-full relative flex justify-center items-end pb-2"
                                >
                                    {/* The Flame Shape Container - with realistic physics */}
                                    <motion.div
                                        animate={{
                                            scaleY: [1, 1.04, 0.96, 1.02, 1],
                                            rotate: [windDirection * 2, windDirection * -1.5, windDirection * 2.5, windDirection * -0.5, windDirection * 1.5],
                                            skewX: [windDirection * 1.5, windDirection * -0.5, windDirection * 1],
                                            scaleX: [1, 1.01, 0.99, 1.005, 1]
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            repeatType: "mirror",
                                            ease: "easeInOut"
                                        }}
                                        className="w-12 h-32 relative origin-bottom flex justify-center"
                                    >
                                        {/* Base Blue (Hottest part) - Enhanced with glow */}
                                        <div className="absolute bottom-0 w-3 h-6 bg-blue-500/90 rounded-full blur-[4px] shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>

                                        {/* Core Flame Body - Multi-layered for realism */}
                                        <div className="absolute bottom-2 w-8 h-20 bg-gradient-to-t from-orange-600 via-orange-400 to-yellow-200 rounded-[50%_50%_50%_50%_/_70%_70%_30%_30%] blur-[0.5px] shadow-[0_0_20px_rgba(255,165,0,0.6)]"></div>

                                        {/* Inner Flame Core */}
                                        <div className="absolute bottom-4 w-5 h-14 bg-gradient-to-t from-yellow-400 via-orange-300 to-yellow-100 rounded-[50%_50%_50%_50%_/_70%_70%_30%_30%] blur-[0.3px]"></div>

                                        {/* Brightest Tip - Enhanced with white core */}
                                        <div className="absolute bottom-10 w-3 h-10 bg-white/95 rounded-[50%] blur-[1px] shadow-[0_0_10px_rgba(255,255,255,0.9)]"></div>

                                        {/* Heat Distortion (Subtle) - Enhanced */}
                                        <div className="absolute top-0 w-full h-12 bg-white/15 rounded-full blur-md opacity-30"></div>

                                        {/* Heat Waves - Visible distortion */}
                                        <div className="absolute -top-2 w-full h-8 bg-gradient-to-b from-white/5 to-transparent rounded-full blur-sm opacity-40"></div>
                                    </motion.div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* --- ENHANCED SMOKE (On Blow) --- */}
                    <AnimatePresence>
                        {isBlown && (
                            <>
                                {/* Main smoke plume */}
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{
                                        opacity: [0, 0.5, 0.3, 0.1, 0],
                                        y: [-20, -80, -140, -180, -200],
                                        x: [0, 5, -8, 12, -5],
                                        scale: [1, 1.3, 1.6, 1.8, 2],
                                        filter: "blur(8px)"
                                    }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 5, ease: "easeOut" }}
                                    className="absolute bottom-[100%] left-1/2 -translate-x-1/2 w-6 h-56 origin-bottom z-30 pointer-events-none"
                                >
                                    <div className="w-3 h-full bg-gradient-to-t from-gray-600 via-gray-400 to-transparent rounded-full opacity-40"></div>
                                </motion.div>

                                {/* Secondary smoke particles */}
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{
                                        opacity: [0, 0.3, 0.1, 0],
                                        y: [-10, -60, -120, -160],
                                        x: [0, -10, 15, -8],
                                        scale: [1, 1.2, 1.4, 1.6]
                                    }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 4, delay: 0.5, ease: "easeOut" }}
                                    className="absolute bottom-[100%] left-1/2 -translate-x-1/2 w-4 h-48 origin-bottom z-30 pointer-events-none"
                                >
                                    <div className="w-2 h-full bg-gradient-to-t from-gray-500 via-gray-300 to-transparent rounded-full opacity-30"></div>
                                </motion.div>

                                {/* Ember particles */}
                                {Array.from({ length: Math.min(particleCount, 10) }).map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 0, x: 0, scale: 0 }}
                                        animate={{
                                            opacity: [0, 0.8, 0],
                                            y: [0, -30 - i * 5, -60 - i * 8],
                                            x: [0, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 60],
                                            scale: [0, 1, 0.5]
                                        }}
                                        transition={{ duration: 2, delay: i * 0.1, ease: "easeOut" }}
                                        className="absolute bottom-[100%] left-1/2 -translate-x-1/2 w-2 h-2 bg-orange-400 rounded-full blur-[1px] pointer-events-none"
                                    />
                                ))}
                            </>
                        )}
                    </AnimatePresence>

                    {/* --- ENHANCED REALISTIC WAX CANDLE BODY --- */}
                    <div className="relative w-24 h-56" style={{ transformStyle: 'preserve-3d' }}>
                        {/* 1. The Wick - Enhanced with 3D effect */}
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-[4px] h-8 bg-gradient-to-b from-[#1a1a1a] via-[#3a3a3a] to-[#6a6a6a] rounded-t-sm z-20 origin-bottom shadow-lg">
                            {/* Glowing tip of the wick with realistic glow */}
                            {!isBlown && (
                                <motion.div
                                    animate={{
                                        opacity: [0.7, 1, 0.7],
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{ duration: 0.3, repeat: Infinity }}
                                    className="absolute top-0 w-full h-3 bg-gradient-to-b from-red-500 to-orange-400 blur-[2px] rounded-full shadow-[0_0_10px_rgba(255,100,0,0.8)]"
                                />
                            )}
                        </div>

                        {/* 2. Top Surface (The "Pool" of melted wax) - Enhanced with realistic texture */}
                        <div className="absolute -top-2 left-0 right-0 h-7 bg-gradient-to-b from-[#fff5f5] to-[#ffe4e6] rounded-[50%] z-10 shadow-[inset_0_3px_8px_rgba(255,255,255,0.9),_inset_0_-3px_8px_rgba(0,0,0,0.15)] overflow-hidden">
                            {/* Inner glow from flame (Subsurface scattering) - Enhanced */}
                            {!isBlown && (
                                <motion.div
                                    animate={{
                                        opacity: [0.5, 0.8, 0.5],
                                        scale: [1, 1.05, 1]
                                    }}
                                    transition={{ duration: 0.15, repeat: Infinity }}
                                    className="absolute inset-0 bg-gradient-to-b from-orange-400/50 to-orange-500/20 blur-md mix-blend-overlay"
                                />
                            )}
                            {/* Liquid reflection - Enhanced with multiple highlights */}
                            <div className="absolute top-1 left-3 w-8 h-4 bg-white/70 rounded-full blur-[1px] rotate-12"></div>
                            <div className="absolute top-2 right-4 w-4 h-2 bg-white/50 rounded-full blur-[0.5px] rotate-45"></div>
                        </div>

                        {/* 3. The Main Cylinder Body - Enhanced with 3D geometry */}
                        <div
                            className="w-full h-full rounded-b-2xl rounded-t-lg overflow-hidden relative bg-[#fecdd3] shadow-2xl"
                            style={{
                                transform: 'rotateX(2deg)',
                                transformStyle: 'preserve-3d'
                            }}
                        >
                            {/* A. Material Texture & Color (Soft Pink Wax) - Enhanced */}
                            <div className="absolute inset-0 bg-gradient-to-b from-[#ffe4e6] via-[#fecdd3] to-[#fda4af]"></div>

                            {/* B. Spiral Pattern (Embedded in wax) - Enhanced with depth */}
                            <div className="absolute inset-0 opacity-60"
                                style={{
                                    background: `repeating-linear-gradient(
                                        135deg,
                                        rgba(255,255,255,0.5),
                                        rgba(255,255,255,0.5) 12px,
                                        transparent 12px,
                                        transparent 24px
                                    )`
                                }}
                            />

                            {/* C. 3D Lighting (Cylinder effect) - Enhanced with multiple light sources */}
                            {/* Left shadow (darker side) */}
                            <div className="absolute inset-0 bg-gradient-to-r from-rose-900/40 via-transparent to-rose-900/20 mix-blend-multiply pointer-events-none"></div>
                            {/* Right highlight (lighter side) */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent mix-blend-soft-light pointer-events-none"></div>
                            {/* Center highlight (specular) */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent mix-blend-overlay pointer-events-none"></div>

                            {/* D. Subsurface Scattering (Glow at top of body) - Enhanced */}
                            {!isBlown && (
                                <motion.div
                                    animate={{
                                        opacity: [0.6, 0.9, 0.6],
                                        scale: [1, 1.02, 1]
                                    }}
                                    transition={{ duration: 0.15, repeat: Infinity }}
                                    className="absolute top-0 w-full h-20 bg-gradient-to-b from-orange-400/70 via-orange-300/40 to-transparent mix-blend-overlay blur-md"
                                />
                            )}

                            {/* E. Wax drips (subtle texture) */}
                            <div className="absolute top-4 left-2 w-1 h-4 bg-white/20 rounded-b-full blur-[0.5px]"></div>
                            <div className="absolute top-8 right-3 w-0.5 h-3 bg-white/15 rounded-b-full blur-[0.5px]"></div>
                        </div>

                        {/* 4. Bottom Shadow/Reflection - Enhanced with ambient occlusion */}
                        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-full h-6 bg-gradient-to-b from-black/40 to-transparent blur-lg rounded-[50%]"></div>

                        {/* 5. Ground shadow (ambient occlusion) */}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-16 h-3 bg-black/30 blur-md rounded-full"></div>
                    </div>
                </div>

                {/* Interaction Hint - Enhanced with 3D effect */}
                <AnimatePresence>
                    {!isBlown && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, rotateX: -10 }}
                            animate={{ opacity: 1, y: 0, rotateX: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: 1 }}
                            className="mt-24 flex flex-col items-center gap-3 text-white/40 text-center"
                            style={{ perspective: '500px' }}
                        >
                            <div className="relative">
                                <motion.p
                                    className="text-4xl font-brush text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400 drop-shadow-sm"
                                    animate={{
                                        textShadow: [
                                            '0 0 20px rgba(255,200,100,0.3)',
                                            '0 0 30px rgba(255,200,100,0.5)',
                                            '0 0 20px rgba(255,200,100,0.3)'
                                        ]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    Happy Birthday
                                </motion.p>
                            </div>

                            {/* Enhanced Graphic Guidance */}
                            <div className="flex items-center gap-8 text-white/50 mt-4">
                                <div className="flex flex-col items-center gap-2 group-hover:scale-110 transition-transform">
                                    <div className="relative">
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="absolute inset-0 bg-blue-300/20 rounded-full blur-md"
                                        />
                                        <Mic className="w-8 h-8 text-blue-200/80" />
                                        <motion.div
                                            className="absolute -right-2 -top-2"
                                            animate={{
                                                opacity: [0, 1, 0],
                                                x: [0, 5, 10],
                                                y: [0, -5, -10]
                                            }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            <Wind className="w-3 h-3 text-blue-100" />
                                        </motion.div>
                                    </div>
                                    <span className="text-[10px] tracking-widest uppercase">吹气</span>
                                </div>

                                <div className="h-8 w-[1px] bg-white/10"></div>

                                <div className="flex flex-col items-center gap-2 group-hover:scale-110 transition-transform">
                                    <motion.div
                                        animate={{ y: [0, 3, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        <MousePointerClick className="w-8 h-8 text-amber-200/80" />
                                    </motion.div>
                                    <span className="text-[10px] tracking-widest uppercase">点击</span>
                                </div>
                            </div>

                            <motion.p
                                animate={{ opacity: [0.4, 0.8, 0.4] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="text-xs text-white/30 tracking-[0.2em] font-light mt-2"
                            >
                                对着麦克风吹气 或 点击任意位置
                            </motion.p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Wishes Text Overlay - Enhanced with 3D depth */}
            <AnimatePresence>
                {showWishes && (
                    <motion.div
                        className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/85 backdrop-blur-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, filter: "blur(12px)", rotateX: 10 }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)", rotateX: 0 }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className="text-center p-10 relative"
                            style={{ perspective: '800px', transformStyle: 'preserve-3d' }}
                        >
                            {/* Enhanced Background Glow behind text */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/15 blur-3xl rounded-full"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-orange-400/10 blur-2xl rounded-full"></div>

                            <motion.div
                                initial={{ opacity: 0, y: 40, rotateX: 15 }}
                                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                                className="relative"
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                <motion.h2
                                    className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/70 font-brush text-7xl mb-8 drop-shadow-[0_0_40px_rgba(255,255,255,0.4)]"
                                    animate={{
                                        textShadow: [
                                            '0 0 30px rgba(255,255,255,0.3)',
                                            '0 0 50px rgba(255,255,255,0.5)',
                                            '0 0 30px rgba(255,255,255,0.3)'
                                        ]
                                    }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                >
                                    愿望会实现的
                                </motion.h2>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 1.5 }}
                            >
                                <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mb-8"></div>
                                <motion.p
                                    className="text-white/60 font-serif text-base tracking-[0.4em] uppercase"
                                    animate={{ opacity: [0.6, 1, 0.6] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    许个愿望吧
                                </motion.p>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};