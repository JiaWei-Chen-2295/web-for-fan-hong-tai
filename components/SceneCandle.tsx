import React, { useState, useRef, useEffect, useCallback } from 'react';
import { gsap, useGSAP } from '../utils/gsap-setup';
import { Wind, Mic, MousePointerClick } from 'lucide-react';
import { TransitionProps } from '../types';

export const SceneCandle: React.FC<TransitionProps> = ({ onNext, isActive }) => {
    const [isBlown, setIsBlown] = useState(false);
    const [showWishes, setShowWishes] = useState(false);
    const [particleCount, setParticleCount] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [micPermission, setMicPermission] = useState<boolean | null>(null);

    // Element refs
    const primaryGlowRef = useRef<HTMLDivElement>(null);
    const secondaryGlowRef = useRef<HTMLDivElement>(null);
    const heatDistortionRef = useRef<HTMLDivElement>(null);
    const flameContainerRef = useRef<HTMLDivElement>(null);
    const flameShapeRef = useRef<HTMLDivElement>(null);
    const outerGlow1Ref = useRef<HTMLDivElement>(null);
    const outerGlow2Ref = useRef<HTMLDivElement>(null);
    const wickGlowRef = useRef<HTMLDivElement>(null);
    const subsurfaceTopRef = useRef<HTMLDivElement>(null);
    const subsurfaceBodyRef = useRef<HTMLDivElement>(null);
    const smokeMainRef = useRef<HTMLDivElement>(null);
    const smokeSecondaryRef = useRef<HTMLDivElement>(null);
    const hintRef = useRef<HTMLDivElement>(null);
    const hintTextRef = useRef<HTMLParagraphElement>(null);
    const micGlowRef = useRef<HTMLDivElement>(null);
    const windIconRef = useRef<HTMLDivElement>(null);
    const clickIconRef = useRef<HTMLDivElement>(null);
    const happyBirthdayRef = useRef<HTMLParagraphElement>(null);
    const wishesOverlayRef = useRef<HTMLDivElement>(null);
    const wishesContentRef = useRef<HTMLDivElement>(null);
    const wishesTitleRef = useRef<HTMLDivElement>(null);
    const wishesSubRef = useRef<HTMLDivElement>(null);
    const wishesSubTextRef = useRef<HTMLParagraphElement>(null);
    const emberContainerRef = useRef<HTMLDivElement>(null);

    // --- Audio / Blow Detection Logic ---
    const handleBlow = useCallback(() => {
        if (isBlown) return;
        setIsBlown(true);
        setTimeout(() => {
            setShowWishes(true);
            setTimeout(onNext, 4000);
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
            let sum = 0;
            const length = dataArray.length;
            for (let i = 0; i < length; i++) {
                sum += dataArray[i];
            }
            const average = sum / length;

            if (average > 45) {
                handleBlow();
            } else {
                // Subtle flame reaction to sound — directly via GSAP, no React re-render
                if (average > 10 && flameShapeRef.current) {
                    const wind = (Math.random() - 0.5) * (average / 10);
                    gsap.to(flameShapeRef.current, {
                        rotation: wind * 2,
                        skewX: wind * 1.5,
                        duration: 0.15,
                        overwrite: 'auto',
                    });
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

        const timer = setTimeout(initAudio, 500);

        return () => {
            clearTimeout(timer);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            if (stream) stream.getTracks().forEach(track => track.stop());
            if (audioContext) audioContext.close();
        };
    }, [isActive, isBlown, handleBlow]);

    // Handle isActive prop
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

    // === GSAP Animations ===

    // Ambient glows (looping, only when not blown)
    useGSAP(() => {
        if (isBlown) return;

        if (primaryGlowRef.current) {
            gsap.to(primaryGlowRef.current, {
                opacity: 0.35, scale: 1.02,
                duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut',
            });
        }
        if (secondaryGlowRef.current) {
            gsap.to(secondaryGlowRef.current, {
                opacity: 0.25, scale: 1.15,
                duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut',
            });
        }
        if (heatDistortionRef.current) {
            gsap.to(heatDistortionRef.current, {
                opacity: 0.1, y: -5,
                duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut',
            });
        }
    }, { dependencies: [isBlown], scope: containerRef });

    // Flame flicker animation (GSAP timeline replaces setInterval + React state)
    useGSAP(() => {
        if (isBlown) return;

        // Outer glow pulsing
        if (outerGlow1Ref.current) {
            gsap.to(outerGlow1Ref.current, {
                scale: 1.05, opacity: 0.45,
                duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut',
            });
        }
        if (outerGlow2Ref.current) {
            gsap.to(outerGlow2Ref.current, {
                scale: 1.03, opacity: 0.35,
                duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut',
            });
        }

        // Main flame flicker
        if (flameShapeRef.current) {
            gsap.to(flameShapeRef.current, {
                keyframes: [
                    { scaleY: 1.04, scaleX: 1.01, duration: 0.4 },
                    { scaleY: 0.96, scaleX: 0.99, duration: 0.3 },
                    { scaleY: 1.02, scaleX: 1.005, duration: 0.4 },
                    { scaleY: 1, scaleX: 1, duration: 0.4 },
                ],
                repeat: -1,
                ease: 'sine.inOut',
            });
        }

        // Wick glow
        if (wickGlowRef.current) {
            gsap.to(wickGlowRef.current, {
                opacity: 1, scale: 1.1,
                duration: 0.3, repeat: -1, yoyo: true, ease: 'sine.inOut',
            });
        }

        // Subsurface scattering on wax top
        if (subsurfaceTopRef.current) {
            gsap.to(subsurfaceTopRef.current, {
                opacity: 0.8, scale: 1.05,
                duration: 0.15, repeat: -1, yoyo: true, ease: 'sine.inOut',
            });
        }

        // Subsurface on body
        if (subsurfaceBodyRef.current) {
            gsap.to(subsurfaceBodyRef.current, {
                opacity: 0.9, scale: 1.02,
                duration: 0.15, repeat: -1, yoyo: true, ease: 'sine.inOut',
            });
        }
    }, { dependencies: [isBlown], scope: containerRef });

    // Flame exit animation
    useGSAP(() => {
        if (isBlown && flameContainerRef.current) {
            gsap.to(flameContainerRef.current, {
                scale: 0.5, opacity: 0, y: -20,
                duration: 0.3, ease: 'power2.out',
                onComplete: () => {
                    gsap.set(flameContainerRef.current, { visibility: 'hidden' });
                },
            });
        } else if (!isBlown && flameContainerRef.current) {
            gsap.set(flameContainerRef.current, { visibility: 'visible', scale: 1, opacity: 1, y: 0 });
        }
    }, { dependencies: [isBlown], scope: containerRef });

    // Smoke animations
    useGSAP(() => {
        if (!isBlown) return;

        if (smokeMainRef.current) {
            gsap.set(smokeMainRef.current, { visibility: 'visible' });
            gsap.fromTo(smokeMainRef.current,
                { opacity: 0, y: -20, x: 0, scale: 1 },
                {
                    keyframes: [
                        { opacity: 0.5, y: -80, x: 5, scale: 1.3, duration: 1 },
                        { opacity: 0.3, y: -140, x: -8, scale: 1.6, duration: 1 },
                        { opacity: 0.1, y: -180, x: 12, scale: 1.8, duration: 1 },
                        { opacity: 0, y: -200, x: -5, scale: 2, duration: 2 },
                    ],
                    ease: 'power1.out',
                },
            );
        }
        if (smokeSecondaryRef.current) {
            gsap.set(smokeSecondaryRef.current, { visibility: 'visible' });
            gsap.fromTo(smokeSecondaryRef.current,
                { opacity: 0, y: -10, x: 0, scale: 1 },
                {
                    keyframes: [
                        { opacity: 0.3, y: -60, x: -10, scale: 1.2, duration: 1 },
                        { opacity: 0.1, y: -120, x: 15, scale: 1.4, duration: 1.5 },
                        { opacity: 0, y: -160, x: -8, scale: 1.6, duration: 1.5 },
                    ],
                    delay: 0.5,
                    ease: 'power1.out',
                },
            );
        }
    }, { dependencies: [isBlown], scope: containerRef });

    // Ember particles animation
    useGSAP(() => {
        if (!isBlown || !emberContainerRef.current) return;
        const embers = emberContainerRef.current.children;
        for (let i = 0; i < embers.length; i++) {
            const ember = embers[i] as HTMLElement;
            gsap.fromTo(ember,
                { opacity: 0, y: 0, x: 0, scale: 0 },
                {
                    keyframes: [
                        { opacity: 0.8, scale: 1, duration: 0.3 },
                        { opacity: 0, scale: 0.5, duration: 1.7 },
                    ],
                    y: -30 - i * 5 + (-60 - i * 8 - (-30 - i * 5)),
                    x: (Math.random() - 0.5) * 60,
                    duration: 2,
                    delay: i * 0.1,
                    ease: 'power1.out',
                },
            );
        }
    }, { dependencies: [particleCount], scope: containerRef });

    // Hint section
    useGSAP(() => {
        if (isBlown) {
            if (hintRef.current) gsap.to(hintRef.current, { opacity: 0, duration: 0.3 });
            return;
        }
        if (hintRef.current) {
            gsap.fromTo(hintRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, delay: 1, ease: 'power2.out' });
        }
        if (micGlowRef.current) {
            gsap.to(micGlowRef.current, { scale: 1.2, opacity: 1, duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        }
        if (windIconRef.current) {
            gsap.to(windIconRef.current, {
                keyframes: [
                    { opacity: 1, x: 5, y: -5, duration: 0.5 },
                    { opacity: 0, x: 10, y: -10, duration: 1 },
                ],
                repeat: -1, ease: 'power1.out',
            });
        }
        if (clickIconRef.current) {
            gsap.to(clickIconRef.current, { y: 3, duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        }
        if (happyBirthdayRef.current) {
            gsap.to(happyBirthdayRef.current, {
                textShadow: '0 0 30px rgba(255,200,100,0.5)',
                duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut',
            });
        }
        if (hintTextRef.current) {
            gsap.to(hintTextRef.current, { opacity: 0.8, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        }
    }, { dependencies: [isBlown], scope: containerRef });

    // Wishes overlay animation
    useGSAP(() => {
        if (!showWishes) return;

        if (wishesOverlayRef.current) {
            gsap.fromTo(wishesOverlayRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.5, ease: 'power2.out' },
            );
        }
        if (wishesContentRef.current) {
            gsap.fromTo(wishesContentRef.current,
                { opacity: 0, scale: 0.9, filter: 'blur(12px)' },
                { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.5, ease: 'circ.out' },
            );
        }
        if (wishesTitleRef.current) {
            gsap.fromTo(wishesTitleRef.current,
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 1.2, delay: 0.4, ease: 'power2.out' },
            );
            // Title glow pulse
            gsap.to(wishesTitleRef.current, {
                textShadow: '0 0 50px rgba(255,255,255,0.5)',
                duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.6,
            });
        }
        if (wishesSubRef.current) {
            gsap.fromTo(wishesSubRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 1, delay: 1.5, ease: 'power2.out' },
            );
        }
        if (wishesSubTextRef.current) {
            gsap.to(wishesSubTextRef.current, {
                opacity: 1, duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2.5,
            });
        }
    }, { dependencies: [showWishes], scope: containerRef });

    return (
        <div
            ref={containerRef}
            onClick={handleBlow}
            className="relative w-full h-full bg-[#050308] flex flex-col items-center justify-center overflow-hidden cursor-pointer"
        >
            {/* 1. Global Ambiance / Lighting */}
            <div
                ref={primaryGlowRef}
                style={{ opacity: 0.25 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-900/25 rounded-full blur-[120px] pointer-events-none"
            />
            <div
                ref={secondaryGlowRef}
                style={{ opacity: 0.15, scale: 1.1 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-800/15 rounded-full blur-[180px] pointer-events-none"
            />
            <div
                ref={heatDistortionRef}
                style={{ opacity: 0.05 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/5 rounded-full blur-[60px] pointer-events-none"
            />

            {/* Vignette */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/30 to-black/85 pointer-events-none" />

            {/* 2. The Candle Object */}
            <div
                className="relative z-10 flex flex-col items-center cursor-pointer mb-10 group"
                onClick={handleBlow}
                style={{ perspective: '1000px' }}
            >
                <div className="relative" style={{ transformStyle: 'preserve-3d' }}>

                    {/* --- REALISTIC FLAME --- */}
                    <div
                        ref={flameContainerRef}
                        className="absolute bottom-[calc(100%+14px)] left-1/2 -translate-x-1/2 w-16 h-40 pointer-events-none z-30 origin-bottom flex flex-col justify-end items-center"
                    >
                        {/* Outer Glow layers */}
                        <div
                            ref={outerGlow1Ref}
                            style={{ opacity: 0.4 }}
                            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-40 h-40 bg-orange-400/25 rounded-full blur-[50px]"
                        />
                        <div
                            ref={outerGlow2Ref}
                            style={{ opacity: 0.3 }}
                            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-32 h-32 bg-yellow-400/15 rounded-full blur-[40px]"
                        />

                        {/* Main Flame Physics */}
                        <div className="w-full h-full relative flex justify-center items-end pb-2">
                            <div
                                ref={flameShapeRef}
                                className="w-12 h-32 relative origin-bottom flex justify-center"
                            >
                                {/* Base Blue (Hottest part) */}
                                <div className="absolute bottom-0 w-3 h-6 bg-blue-500/90 rounded-full blur-[4px] shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
                                {/* Core Flame Body */}
                                <div className="absolute bottom-2 w-8 h-20 bg-gradient-to-t from-orange-600 via-orange-400 to-yellow-200 rounded-[50%_50%_50%_50%_/_70%_70%_30%_30%] blur-[0.5px] shadow-[0_0_20px_rgba(255,165,0,0.6)]"></div>
                                {/* Inner Flame Core */}
                                <div className="absolute bottom-4 w-5 h-14 bg-gradient-to-t from-yellow-400 via-orange-300 to-yellow-100 rounded-[50%_50%_50%_50%_/_70%_70%_30%_30%] blur-[0.3px]"></div>
                                {/* Brightest Tip */}
                                <div className="absolute bottom-10 w-3 h-10 bg-white/95 rounded-[50%] blur-[1px] shadow-[0_0_10px_rgba(255,255,255,0.9)]"></div>
                                {/* Heat Distortion */}
                                <div className="absolute top-0 w-full h-12 bg-white/15 rounded-full blur-md opacity-30"></div>
                                {/* Heat Waves */}
                                <div className="absolute -top-2 w-full h-8 bg-gradient-to-b from-white/5 to-transparent rounded-full blur-sm opacity-40"></div>
                            </div>
                        </div>
                    </div>

                    {/* --- SMOKE (On Blow) --- */}
                    <div
                        ref={smokeMainRef}
                        style={{ visibility: 'hidden' }}
                        className="absolute bottom-[100%] left-1/2 -translate-x-1/2 w-6 h-56 origin-bottom z-30 pointer-events-none"
                    >
                        <div className="w-3 h-full bg-gradient-to-t from-gray-600 via-gray-400 to-transparent rounded-full opacity-40"></div>
                    </div>
                    <div
                        ref={smokeSecondaryRef}
                        style={{ visibility: 'hidden' }}
                        className="absolute bottom-[100%] left-1/2 -translate-x-1/2 w-4 h-48 origin-bottom z-30 pointer-events-none"
                    >
                        <div className="w-2 h-full bg-gradient-to-t from-gray-500 via-gray-300 to-transparent rounded-full opacity-30"></div>
                    </div>

                    {/* Ember particles */}
                    <div ref={emberContainerRef} className="absolute bottom-[100%] left-1/2 -translate-x-1/2 pointer-events-none z-30">
                        {Array.from({ length: Math.min(particleCount, 10) }).map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-2 h-2 bg-orange-400 rounded-full blur-[1px]"
                                style={{ opacity: 0 }}
                            />
                        ))}
                    </div>

                    {/* --- REALISTIC WAX CANDLE BODY --- */}
                    <div className="relative w-24 h-56" style={{ transformStyle: 'preserve-3d' }}>
                        {/* 1. The Wick */}
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-[4px] h-8 bg-gradient-to-b from-[#1a1a1a] via-[#3a3a3a] to-[#6a6a6a] rounded-t-sm z-20 origin-bottom shadow-lg">
                            <div
                                ref={wickGlowRef}
                                style={{ opacity: isBlown ? 0 : 0.7 }}
                                className="absolute top-0 w-full h-3 bg-gradient-to-b from-red-500 to-orange-400 blur-[2px] rounded-full shadow-[0_0_10px_rgba(255,100,0,0.8)]"
                            />
                        </div>

                        {/* 2. Top Surface */}
                        <div className="absolute -top-2 left-0 right-0 h-7 bg-gradient-to-b from-[#fff5f5] to-[#ffe4e6] rounded-[50%] z-10 shadow-[inset_0_3px_8px_rgba(255,255,255,0.9),_inset_0_-3px_8px_rgba(0,0,0,0.15)] overflow-hidden">
                            <div
                                ref={subsurfaceTopRef}
                                style={{ opacity: isBlown ? 0 : 0.5 }}
                                className="absolute inset-0 bg-gradient-to-b from-orange-400/50 to-orange-500/20 blur-md mix-blend-overlay"
                            />
                            <div className="absolute top-1 left-3 w-8 h-4 bg-white/70 rounded-full blur-[1px] rotate-12"></div>
                            <div className="absolute top-2 right-4 w-4 h-2 bg-white/50 rounded-full blur-[0.5px] rotate-45"></div>
                        </div>

                        {/* 3. The Main Cylinder Body */}
                        <div
                            className="w-full h-full rounded-b-2xl rounded-t-lg overflow-hidden relative bg-[#fecdd3] shadow-2xl"
                            style={{ transform: 'rotateX(2deg)', transformStyle: 'preserve-3d' }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-[#ffe4e6] via-[#fecdd3] to-[#fda4af]"></div>
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
                            <div className="absolute inset-0 bg-gradient-to-r from-rose-900/40 via-transparent to-rose-900/20 mix-blend-multiply pointer-events-none"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent mix-blend-soft-light pointer-events-none"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent mix-blend-overlay pointer-events-none"></div>
                            <div
                                ref={subsurfaceBodyRef}
                                style={{ opacity: isBlown ? 0 : 0.6 }}
                                className="absolute top-0 w-full h-20 bg-gradient-to-b from-orange-400/70 via-orange-300/40 to-transparent mix-blend-overlay blur-md"
                            />
                            <div className="absolute top-4 left-2 w-1 h-4 bg-white/20 rounded-b-full blur-[0.5px]"></div>
                            <div className="absolute top-8 right-3 w-0.5 h-3 bg-white/15 rounded-b-full blur-[0.5px]"></div>
                        </div>

                        {/* 4. Bottom Shadow/Reflection */}
                        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-full h-6 bg-gradient-to-b from-black/40 to-transparent blur-lg rounded-[50%]"></div>
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-16 h-3 bg-black/30 blur-md rounded-full"></div>
                    </div>
                </div>

                {/* Interaction Hint */}
                <div
                    ref={hintRef}
                    className="mt-24 flex flex-col items-center gap-3 text-white/40 text-center"
                    style={{ perspective: '500px', display: isBlown ? 'none' : 'flex' }}
                >
                    <div className="relative">
                        <p
                            ref={happyBirthdayRef}
                            className="text-4xl font-brush text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400 drop-shadow-sm"
                            style={{ textShadow: '0 0 20px rgba(255,200,100,0.3)' }}
                        >
                            Happy Birthday
                        </p>
                    </div>

                    <div className="flex items-center gap-8 text-white/50 mt-4">
                        <div className="flex flex-col items-center gap-2 group-hover:scale-110 transition-transform">
                            <div className="relative">
                                <div
                                    ref={micGlowRef}
                                    style={{ opacity: 0.5 }}
                                    className="absolute inset-0 bg-blue-300/20 rounded-full blur-md"
                                />
                                <Mic className="w-8 h-8 text-blue-200/80" />
                                <div
                                    ref={windIconRef}
                                    className="absolute -right-2 -top-2"
                                    style={{ opacity: 0 }}
                                >
                                    <Wind className="w-3 h-3 text-blue-100" />
                                </div>
                            </div>
                            <span className="text-[10px] tracking-widest uppercase">吹气</span>
                        </div>

                        <div className="h-8 w-[1px] bg-white/10"></div>

                        <div className="flex flex-col items-center gap-2 group-hover:scale-110 transition-transform">
                            <div ref={clickIconRef}>
                                <MousePointerClick className="w-8 h-8 text-amber-200/80" />
                            </div>
                            <span className="text-[10px] tracking-widest uppercase">点击</span>
                        </div>
                    </div>

                    <p
                        ref={hintTextRef}
                        style={{ opacity: 0.4 }}
                        className="text-xs text-white/30 tracking-[0.2em] font-light mt-2"
                    >
                        对着麦克风吹气 或 点击任意位置
                    </p>
                </div>
            </div>

            {/* Wishes Text Overlay */}
            {showWishes && (
                <div
                    ref={wishesOverlayRef}
                    className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/85 backdrop-blur-xl"
                    style={{ opacity: 0 }}
                >
                    <div
                        ref={wishesContentRef}
                        className="text-center p-10 relative"
                        style={{ perspective: '800px', transformStyle: 'preserve-3d', opacity: 0 }}
                    >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/15 blur-3xl rounded-full"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-orange-400/10 blur-2xl rounded-full"></div>

                        <div ref={wishesTitleRef} className="relative" style={{ opacity: 0 }}>
                            <h2
                                className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/70 font-brush text-7xl mb-8 drop-shadow-[0_0_40px_rgba(255,255,255,0.4)]"
                                style={{ textShadow: '0 0 30px rgba(255,255,255,0.3)' }}
                            >
                                愿望会实现的
                            </h2>
                        </div>

                        <div ref={wishesSubRef} style={{ opacity: 0 }}>
                            <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mb-8"></div>
                            <p
                                ref={wishesSubTextRef}
                                className="text-white/60 font-serif text-base tracking-[0.4em] uppercase"
                                style={{ opacity: 0.6 }}
                            >
                                许个愿望吧
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
