import React, { useState, useEffect, useRef } from 'react';
import { gsap, useGSAP } from '../utils/gsap-setup';
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

    const containerRef = useRef<HTMLDivElement>(null);
    const blueGlowRef = useRef<HTMLDivElement>(null);
    const goldGlowRef = useRef<HTMLDivElement>(null);
    const spinnerRef = useRef<HTMLDivElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const infoRef = useRef<HTMLDivElement>(null);
    const readyRef = useRef<HTMLDivElement>(null);

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
            img.onerror = updateProgress;
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

    // Looping glow animations
    useGSAP(() => {
        gsap.to(blueGlowRef.current, {
            scale: 1.2,
            opacity: 0.45,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
        });
        gsap.to(goldGlowRef.current, {
            scale: 1,
            opacity: 0.35,
            duration: 5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 1,
        });
        gsap.to(spinnerRef.current, {
            rotation: 360,
            duration: 10,
            repeat: -1,
            ease: 'none',
        });
        gsap.fromTo(infoRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.5 },
        );
    }, { scope: containerRef });

    // Progress bar width
    useGSAP(() => {
        gsap.to(progressBarRef.current, {
            width: `${progress}%`,
            duration: 0.3,
            ease: 'power1.out',
        });
    }, { dependencies: [progress], scope: containerRef });

    // Ready text entrance
    useGSAP(() => {
        if (isDone && readyRef.current) {
            gsap.fromTo(readyRef.current,
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.5)' }
            );
        }
    }, { dependencies: [isDone], scope: containerRef });

    return (
        <div ref={containerRef} className="fixed inset-0 bg-sky-twilight z-[100] flex flex-col items-center justify-center text-white overflow-hidden">
            {/* Background Decorative Elements - Blue + Gold Glow */}
            <div
                ref={blueGlowRef}
                style={{ opacity: 0.25 }}
                className="absolute w-[500px] h-[500px] bg-mayday-blue/25 rounded-full blur-[120px] pointer-events-none"
            />
            <div
                ref={goldGlowRef}
                style={{ scale: 1.1, opacity: 0.2 }}
                className="absolute w-[400px] h-[400px] bg-honey-glow/20 rounded-full blur-[100px] pointer-events-none translate-x-20 translate-y-10"
            />

            <div className="relative z-10 flex flex-col items-center">
                <div
                    ref={spinnerRef}
                    className="mb-8 p-4 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm"
                >
                    <Music className="w-8 h-8 text-mayday-blue" />
                </div>

                <h2 className="font-brush text-3xl mb-8 tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                    记忆正在装载...
                </h2>

                {/* Progress Bar Container */}
                <div className="w-64 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
                    <div
                        ref={progressBarRef}
                        style={{ width: 0 }}
                        className="h-full bg-gradient-to-r from-mayday-blue via-lavender-mist to-honey-glow shadow-[0_0_12px_rgba(107,163,214,0.4)]"
                    />
                </div>

                <div ref={infoRef} className="mt-4 flex items-center gap-2">
                    <span className="text-[10px] font-mono tracking-tighter text-white/30 uppercase">
                        Collecting Memories
                    </span>
                    <span className="text-[10px] font-mono text-mayday-blue font-bold">
                        {progress}%
                    </span>
                </div>
            </div>

            {isDone && (
                <div
                    ref={readyRef}
                    style={{ opacity: 0 }}
                    className="absolute bottom-20 flex flex-col items-center gap-2"
                >
                    <p className="text-xs text-white/40 tracking-[0.3em] uppercase animate-pulse">
                        Ready to go
                    </p>
                </div>
            )}

            {/* Film grain effect during loading */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/noise.png')]" />
        </div>
    );
};
