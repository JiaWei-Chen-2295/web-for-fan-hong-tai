import React, { useRef } from 'react';
import { gsap, useGSAP } from '../utils/gsap-setup';
import { useHoverTap } from '../hooks/useHoverTap';
import { Play } from 'lucide-react';
import { TransitionProps } from '../types';

export const SceneIntro: React.FC<TransitionProps> = ({ onNext, isActive }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stadiumRef = useRef<HTMLDivElement>(null);
  const conicGlowRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const ticketRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useHoverTap(buttonRef, { scale: 1.05 }, { scale: 0.95 });

  useGSAP(() => {
    // Background breathing
    gsap.to(stadiumRef.current, {
      scale: 1.05,
      opacity: 0.45,
      duration: 15,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // Conic glow pulse
    gsap.to(conicGlowRef.current, {
      opacity: 0.4,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // Header entrance
    gsap.fromTo(headerRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power2.out' },
    );

    // Ticket entrance
    gsap.fromTo(ticketRef.current,
      { opacity: 0, scale: 0.95, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 1, delay: 0.5, ease: 'back.out(1.7)' },
    );

    // Title staggered entrance
    gsap.fromTo(subtitleRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, delay: 1, ease: 'power2.out' },
    );
    gsap.fromTo(titleRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.6, delay: 1.2, ease: 'power2.out' },
    );

    // Button entrance
    gsap.fromTo(buttonRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, delay: 1.5, ease: 'back.out(2)' },
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full h-full flex flex-col items-center justify-between py-10 px-6 overflow-hidden">
      {/* Dynamic Background Beams & Venue Image */}
      {/* Background Layers */}
      <div className="absolute inset-0 bg-[#0c0a09] z-0 overflow-hidden">
        {/* Stadium Image Layer */}
        <div
          ref={stadiumRef}
          style={{ opacity: 0.35 }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514525253440-b39345208668?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center grayscale-[0.2] sepia-[0.3]"
        />

        {/* Colorful Gradient Glows - Mayday Blue + Warm tones */}
        <div className="absolute inset-0 bg-gradient-to-b from-deep-mayday/40 via-transparent to-black" />
        <div
          ref={conicGlowRef}
          style={{ opacity: 0.2 }}
          className="absolute inset-0 bg-gradient-conic from-mayday-blue/15 via-honey-glow/10 to-transparent blur-3xl"
        />
      </div>

      {/* Texture Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise.png')] opacity-[0.15] z-0 pointer-events-none" />

      {/* Header */}
      <div
        ref={headerRef}
        className="w-full flex justify-between items-end text-white/90 z-10"
      >
        <div className="flex flex-col">
          <span className="text-[10px] tracking-[0.3em] uppercase font-bold">Memory Collector</span>
          <span className="font-handwritten text-3xl">青春 · 记录</span>
        </div>
        <div className="text-[10px] border border-white/40 px-2 py-1 rounded-sm backdrop-blur-sm">
          NO. 2026-02-23
        </div>
      </div>

      {/* Ticket Main Content */}
      <div
        ref={ticketRef}
        className="relative w-full max-w-sm z-10 mt-4"
      >
        <div className="border-[8px] border-[#1a1a1a] relative shadow-2xl rounded-sm overflow-hidden text-slate-900">
          {/* Dashed border effect inside */}
          <div className="absolute inset-0 border-x-2 border-dashed border-white/10 pointer-events-none z-20"></div>

          <div className="bg-[#fff9f0] relative p-1 min-h-[460px] flex flex-col">
            {/* Ticket Image */}
            <div className="h-44 w-full bg-cover bg-center relative"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514525253440-b39345208668?q=80&w=2070&auto=format&fit=crop')" }}>
              <div className="absolute inset-0 bg-gradient-to-t from-[#fff9f0] to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <span className="bg-deep-mayday/90 text-white text-[9px] px-2 py-1 rounded backdrop-blur-sm tracking-widest uppercase shadow-lg">Limited Edition</span>
              </div>
            </div>

            {/* Ticket Text */}
            <div className="px-6 py-4 text-center flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-2 my-2 opacity-20">
                <div className="h-[1px] flex-1 border-t border-dashed border-slate-900"></div>
                <span className="text-xs text-slate-400">•</span>
                <div className="h-[1px] flex-1 border-t border-dashed border-slate-900"></div>
              </div>

              <h2
                ref={subtitleRef}
                className="font-display font-bold uppercase tracking-widest text-mayday-blue text-xs mb-2"
              >
                Happy Birthday, Franklin
              </h2>
              <h1
                ref={titleRef}
                className="font-brush text-4xl text-deep-mayday leading-tight mt-1 mb-4"
              >
                生日快乐<br />我的好朋友，范部
              </h1>

              <div className="flex flex-col gap-1 mb-6">
                <p className="text-[10px] tracking-[0.2em] text-slate-500 uppercase font-bold">VIP ACCESS TICKET</p>
                <p className="text-xs text-mayday-blue/70 italic font-medium">那些未完待续的歌，在这个黄昏重逢</p>
              </div>

              <div className="grid grid-cols-3 border-y border-slate-200 py-4 mb-2">
                <div className="text-center">
                  <p className="text-[9px] uppercase text-slate-400 mb-1">Time</p>
                  <p className="text-xs font-bold text-dusk-dark">Now</p>
                </div>
                <div className="text-center border-x border-slate-200">
                  <p className="text-[9px] uppercase text-slate-400 mb-1">From</p>
                  <p className="text-xs font-bold text-dusk-dark">JavierChen</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] uppercase text-slate-400 mb-1">Seat</p>
                  <p className="text-xs font-bold text-dusk-dark">V-VIP</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <button
        ref={buttonRef}
        onClick={onNext}
        className="relative z-20 w-full max-w-xs mt-8 bg-[#6BA3D6] text-white font-bold text-lg h-14 rounded-full flex items-center justify-center gap-3 shadow-[0_10px_40px_-10px_rgba(232,196,138,0.6)] border border-white/20 group hover:scale-[1.02] transition-all duration-300"
      >
        <span className="font-brush text-xl tracking-wider pt-1">让我们回到那一天</span>
        <Play className="w-5 h-5 fill-current" />
      </button>

      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-0" />
    </div>
  );
};
