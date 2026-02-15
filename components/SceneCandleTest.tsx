import React, { useState, useRef, useEffect } from 'react';
import { gsap, useGSAP } from '../utils/gsap-setup';
import { TransitionProps } from '../types';

export const SceneCandleTest: React.FC<TransitionProps> = ({ onNext, isActive }) => {
    const [isBlown, setIsBlown] = useState(false);
    const [particleCount, setParticleCount] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Element refs
    const flameContainerRef = useRef<HTMLDivElement>(null);
    const outerGlow1Ref = useRef<HTMLDivElement>(null);
    const outerGlow2Ref = useRef<HTMLDivElement>(null);
    const flameShapeRef = useRef<HTMLDivElement>(null);
    const wickGlowRef = useRef<HTMLDivElement>(null);
    const subsurfaceTopRef = useRef<HTMLDivElement>(null);
    const subsurfaceBodyRef = useRef<HTMLDivElement>(null);
    const smokeMainRef = useRef<HTMLDivElement>(null);
    const smokeSecondaryRef = useRef<HTMLDivElement>(null);
    const emberContainerRef = useRef<HTMLDivElement>(null);

    // Handle isActive prop
    useEffect(() => {
        if (!isActive && !isBlown) {
            setIsBlown(true);
        } else if (isActive && isBlown) {
            setIsBlown(false);
            setParticleCount(0);
        }
    }, [isActive, isBlown]);

    // Particle effect when blowing
    useEffect(() => {
        if (!isBlown) return;
        const particleInterval = setInterval(() => {
            setParticleCount(prev => prev >= 20 ? prev : prev + 1);
        }, 100);
        return () => clearInterval(particleInterval);
    }, [isBlown]);

    const handleBlow = () => {
        if (isBlown) return;
        setIsBlown(true);
        setTimeout(() => {
            setTimeout(onNext, 3000);
        }, 1000);
    };

    // Flame flicker animation
    useGSAP(() => {
        if (isBlown) return;

        if (outerGlow1Ref.current) {
            gsap.to(outerGlow1Ref.current, {
                scale: 1.08, opacity: 0.55,
                duration: 0.12, repeat: -1, yoyo: true, ease: 'sine.inOut',
            });
        }
        if (outerGlow2Ref.current) {
            gsap.to(outerGlow2Ref.current, {
                scale: 1.05, opacity: 0.4,
                duration: 0.15, repeat: -1, yoyo: true, ease: 'sine.inOut',
            });
        }
        if (flameShapeRef.current) {
            gsap.to(flameShapeRef.current, {
                keyframes: [
                    { scaleY: 1.08, scaleX: 1.02, duration: 0.08 },
                    { scaleY: 0.95, scaleX: 0.98, duration: 0.08 },
                    { scaleY: 1.05, scaleX: 1.01, duration: 0.08 },
                    { scaleY: 1, scaleX: 1, duration: 0.08 },
                ],
                repeat: -1,
                ease: 'sine.inOut',
            });
        }
        if (wickGlowRef.current) {
            gsap.to(wickGlowRef.current, {
                opacity: 1, scale: 1.1,
                duration: 0.3, repeat: -1, yoyo: true, ease: 'sine.inOut',
            });
        }
        if (subsurfaceTopRef.current) {
            gsap.to(subsurfaceTopRef.current, {
                opacity: 0.8, scale: 1.05,
                duration: 0.15, repeat: -1, yoyo: true, ease: 'sine.inOut',
            });
        }
        if (subsurfaceBodyRef.current) {
            gsap.to(subsurfaceBodyRef.current, {
                opacity: 0.9, scale: 1.02,
                duration: 0.15, repeat: -1, yoyo: true, ease: 'sine.inOut',
            });
        }
    }, { dependencies: [isBlown], scope: containerRef });

    // Flame exit
    useGSAP(() => {
        if (isBlown && flameContainerRef.current) {
            gsap.to(flameContainerRef.current, {
                scale: 0.5, opacity: 0, y: -20,
                duration: 0.3, ease: 'power2.out',
                onComplete: () => gsap.set(flameContainerRef.current, { visibility: 'hidden' }),
            });
        } else if (!isBlown && flameContainerRef.current) {
            gsap.set(flameContainerRef.current, { visibility: 'visible', scale: 1, opacity: 1, y: 0 });
        }
    }, { dependencies: [isBlown], scope: containerRef });

    // Smoke
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

    // Ember particles
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
                    y: -60 - i * 8,
                    x: (Math.random() - 0.5) * 60,
                    duration: 2,
                    delay: i * 0.1,
                    ease: 'power1.out',
                },
            );
        }
    }, { dependencies: [particleCount], scope: containerRef });

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full bg-transparent flex flex-col items-center justify-center"
        >
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

                        <div className="w-full h-full relative flex justify-center items-end pb-2">
                            <div
                                ref={flameShapeRef}
                                className="w-12 h-32 relative origin-bottom flex justify-center"
                            >
                                <div className="absolute bottom-0 w-3 h-6 bg-blue-500/90 rounded-full blur-[4px] shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
                                <div className="absolute bottom-2 w-8 h-20 bg-gradient-to-t from-orange-600 via-orange-400 to-yellow-200 rounded-[50%_50%_50%_50%_/_70%_70%_30%_30%] blur-[0.5px] shadow-[0_0_20px_rgba(255,165,0,0.6)]"></div>
                                <div className="absolute bottom-4 w-5 h-14 bg-gradient-to-t from-yellow-400 via-orange-300 to-yellow-100 rounded-[50%_50%_50%_50%_/_70%_70%_30%_30%] blur-[0.3px]"></div>
                                <div className="absolute bottom-10 w-3 h-10 bg-white/95 rounded-[50%] blur-[1px] shadow-[0_0_10px_rgba(255,255,255,0.9)]"></div>
                                <div className="absolute top-0 w-full h-12 bg-white/15 rounded-full blur-md opacity-30"></div>
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
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-[4px] h-8 bg-gradient-to-b from-[#1a1a1a] via-[#3a3a3a] to-[#6a6a6a] rounded-t-sm z-20 origin-bottom shadow-lg">
                            <div
                                ref={wickGlowRef}
                                style={{ opacity: isBlown ? 0 : 0.7 }}
                                className="absolute top-0 w-full h-3 bg-gradient-to-b from-red-500 to-orange-400 blur-[2px] rounded-full shadow-[0_0_10px_rgba(255,100,0,0.8)]"
                            />
                        </div>

                        <div className="absolute -top-2 left-0 right-0 h-7 bg-gradient-to-b from-[#fff5f5] to-[#ffe4e6] rounded-[50%] z-10 shadow-[inset_0_3px_8px_rgba(255,255,255,0.9),_inset_0_-3px_8px_rgba(0,0,0,0.15)] overflow-hidden">
                            <div
                                ref={subsurfaceTopRef}
                                style={{ opacity: isBlown ? 0 : 0.5 }}
                                className="absolute inset-0 bg-gradient-to-b from-orange-400/50 to-orange-500/20 blur-md mix-blend-overlay"
                            />
                            <div className="absolute top-1 left-3 w-8 h-4 bg-white/70 rounded-full blur-[1px] rotate-12"></div>
                            <div className="absolute top-2 right-4 w-4 h-2 bg-white/50 rounded-full blur-[0.5px] rotate-45"></div>
                        </div>

                        <div
                            className="w-full h-full rounded-b-2xl rounded-t-lg overflow-hidden relative bg-[#fecdd3] shadow-2xl"
                            style={{ transform: 'rotateX(2deg)', transformStyle: 'preserve-3d' }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-[#ffe4e6] via-[#fecdd3] to-[#fda4af]"></div>
                            <div className="absolute inset-0 opacity-60"
                                style={{
                                    background: `repeating-linear-gradient(135deg, rgba(255,255,255,0.5), rgba(255,255,255,0.5) 12px, transparent 12px, transparent 24px)`
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

                        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-full h-6 bg-gradient-to-b from-black/40 to-transparent blur-lg rounded-[50%]"></div>
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-16 h-3 bg-black/30 blur-md rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
