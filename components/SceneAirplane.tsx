'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Plane, SkipForward } from 'lucide-react';
import { gsap, useGSAP } from '../utils/gsap-setup';
import { useHoverTap } from '../hooks/useHoverTap';
import { TransitionProps } from '../types';

export const SceneAirplane: React.FC<TransitionProps> = ({ onNext }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [canContinue, setCanContinue] = useState(false);

  useHoverTap(ctaRef, { scale: 1.04, y: -2 }, { scale: 0.96 });
  useHoverTap(skipRef, { scale: 1.04 }, { scale: 0.96 });

  useEffect(() => {
    const timer = window.setTimeout(() => setCanContinue(true), 3200);
    return () => window.clearTimeout(timer);
  }, []);

  useGSAP(() => {
    if (!panelRef.current) return;
    gsap.fromTo(
      panelRef.current,
      { opacity: 0, y: 24, filter: 'blur(8px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, delay: 0.3, ease: 'power2.out' },
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-[#030a17]">
      <iframe
        title="Fly Air"
        src="https://fly.javierchen.cn"
        className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
      />

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center text-white/70 text-sm tracking-[0.3em] uppercase">
          正在准备起飞
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#02050d]/30 via-transparent to-[#02050d]/60" />

      <div ref={panelRef} className="absolute inset-x-0 bottom-10 z-20 flex flex-col items-center px-6" style={{ opacity: 0 }}>
        <div className="pointer-events-auto w-full max-w-md rounded-3xl border border-white/20 bg-black/30 px-5 py-4 backdrop-blur-md">
          <div className="flex items-center gap-2 text-white/90">
            <Plane className="h-4 w-4" />
            <p className="text-xs tracking-[0.24em] uppercase">Fly To Next Memory</p>
          </div>
          <p className="mt-2 text-white/90 font-serif text-sm leading-relaxed">
            把信收好，我们飞去下一站惊喜。
          </p>

          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              ref={skipRef}
              onClick={onNext}
              className="pointer-events-auto inline-flex items-center gap-1 text-xs uppercase tracking-[0.18em] text-white/70 transition-colors hover:text-white"
            >
              <SkipForward className="h-3.5 w-3.5" />
              跳过起飞
            </button>
            <button
              ref={ctaRef}
              onClick={onNext}
              disabled={!canContinue}
              className="pointer-events-auto rounded-full bg-[#6BA3D6] px-5 py-2 text-sm font-bold text-white shadow-[0_10px_24px_-10px_rgba(107,163,214,0.8)] transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
            >
              {canContinue ? '降落下一站' : '起飞中...'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
