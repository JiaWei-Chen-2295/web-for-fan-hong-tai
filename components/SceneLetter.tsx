'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Quote, Music } from 'lucide-react';
import { TransitionProps } from '../types';

/**
 * SceneLetter - Envelope opens like a book to reveal the letter inside
 */

// Spring physics
const springs = {
  unfold: { type: "spring" as const, stiffness: 50, damping: 18, mass: 0.8 },
  reveal: { type: "spring" as const, stiffness: 60, damping: 16 },
  letterRise: { type: "spring" as const, stiffness: 40, damping: 14 },
  button: { type: "spring" as const, stiffness: 300, damping: 20 },
};

// Kraft paper colors - enriched with mayday blue tones
const kraft = {
  light: '#C9A87C',
  medium: '#B8956F',
  dark: '#A07D5A',
  shadow: '#8B6B4A',
  inner: '#D4B896',
  accent: '#4A90D9', // mayday-blue accent
};

type Phase = 'idle' | 'unfolding' | 'opened' | 'letterRising' | 'reading';

export const SceneLetter: React.FC<TransitionProps> = ({ onNext }) => {
  const [phase, setPhase] = useState<Phase>('idle');

  useEffect(() => {
    const sequence = async () => {
      await delay(800);
      setPhase('unfolding');    // Envelope unfolds like a book
      await delay(1200);
      setPhase('opened');       // Fully open, letter visible
      await delay(1000);
      setPhase('letterRising'); // Letter rises up
      await delay(1000);
      setPhase('reading');      // Full reading mode
    };
    sequence();
  }, []);

  const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

  // Animation state flags
  const isUnfolding = phase === 'unfolding' || phase === 'opened' || phase === 'letterRising' || phase === 'reading';
  const isOpened = phase === 'opened' || phase === 'letterRising' || phase === 'reading';
  const isLetterRising = phase === 'letterRising' || phase === 'reading';
  const isReading = phase === 'reading';

  return (
    <div className="relative w-full h-full bg-dusk-dark flex items-center justify-center overflow-hidden">

      {/* ========== AMBIENT ========== */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-deep-mayday/30 via-transparent to-black/50" />
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-mayday-blue/8 blur-[120px] rounded-full" />
        <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-[250px] h-[200px] bg-honey-glow/6 blur-[100px] rounded-full" />
      </div>

      {/* ========== BOOK-STYLE ENVELOPE ========== */}
      <AnimatePresence>
        {!isReading && (
          <motion.div
            className="relative flex items-center justify-center"
            style={{ perspective: '1200px' }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            {/* === ENVELOPE CONTAINER === */}
            <div
              className="relative"
              style={{
                width: 320,
                height: 200,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Inner content - The Letter (visible when opened) */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                style={{ zIndex: 5 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: isOpened ? 1 : 0,
                  scale: isOpened ? 1 : 0.9,
                  y: isLetterRising ? -30 : 0,
                }}
                transition={springs.letterRise}
              >
                <div
                  className="w-[280px] h-[170px] rounded-sm flex flex-col items-center justify-center relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(to bottom, #fffefa, #f8f3e8)',
                    boxShadow: isLetterRising
                      ? '0 20px 40px -10px rgba(0,0,0,0.3)'
                      : '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                >
                  {/* Fold lines on letter */}
                  <div className="absolute top-1/3 left-4 right-4 h-px bg-black/[0.05]" />
                  <div className="absolute top-2/3 left-4 right-4 h-px bg-black/[0.05]" />

                  {/* Content preview */}
                  <div className="text-mayday-blue/50 text-3xl mb-1">♥</div>
                  <span className="text-[10px] text-gray-400 tracking-[0.3em] uppercase font-serif">
                    A Letter For You
                  </span>
                </div>
              </motion.div>

              {/* Left page (envelope back left) */}
              <motion.div
                className="absolute top-0 left-0 h-full origin-right"
                style={{
                  width: '50%',
                  transformStyle: 'preserve-3d',
                  zIndex: isUnfolding ? 10 : 20,
                }}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: isUnfolding ? -160 : 0 }}
                transition={springs.unfold}
              >
                {/* Front face (visible when closed) */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${kraft.light} 0%, ${kraft.medium} 100%)`,
                    backfaceVisibility: 'hidden',
                    borderRadius: '4px 0 0 4px',
                    boxShadow: 'inset -2px 0 8px rgba(0,0,0,0.1)',
                  }}
                >
                  {/* Paper texture */}
                  <div
                    className="absolute inset-0 opacity-25 mix-blend-multiply rounded-l"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    }}
                  />
                  {/* Decorative line */}
                  <div className="absolute right-0 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                </div>

                {/* Back face (visible when opened) */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(45deg, ${kraft.inner} 0%, ${kraft.light} 100%)`,
                    transform: 'rotateY(180deg)',
                    backfaceVisibility: 'hidden',
                    borderRadius: '0 4px 4px 0',
                  }}
                />
              </motion.div>

              {/* Right page (envelope back right) */}
              <motion.div
                className="absolute top-0 right-0 h-full origin-left"
                style={{
                  width: '50%',
                  transformStyle: 'preserve-3d',
                  zIndex: isUnfolding ? 10 : 20,
                }}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: isUnfolding ? 160 : 0 }}
                transition={springs.unfold}
              >
                {/* Front face (visible when closed) */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(-135deg, ${kraft.light} 0%, ${kraft.medium} 100%)`,
                    backfaceVisibility: 'hidden',
                    borderRadius: '0 4px 4px 0',
                    boxShadow: 'inset 2px 0 8px rgba(0,0,0,0.1)',
                  }}
                >
                  {/* Paper texture */}
                  <div
                    className="absolute inset-0 opacity-25 mix-blend-multiply rounded-r"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    }}
                  />
                  {/* Decorative line */}
                  <div className="absolute left-0 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                </div>

                {/* Back face (visible when opened) */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(-45deg, ${kraft.inner} 0%, ${kraft.light} 100%)`,
                    transform: 'rotateY(180deg)',
                    backfaceVisibility: 'hidden',
                    borderRadius: '4px 0 0 4px',
                  }}
                />
              </motion.div>

              {/* Center spine / seal */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ zIndex: 30 }}
                initial={{ opacity: 1, scale: 1 }}
                animate={{
                  opacity: isUnfolding ? 0 : 1,
                  scale: isUnfolding ? 0.5 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Wax seal */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(145deg, #c0392b 0%, #922b21 100%)',
                    boxShadow: '0 4px 15px rgba(146,43,33,0.5), inset 0 2px 0 rgba(255,255,255,0.2)',
                  }}
                >
                  <span className="text-red-200 text-xl">♥</span>
                </div>
              </motion.div>

              {/* Shadow under envelope */}
              <motion.div
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[280px] h-4 bg-black/20 blur-lg rounded-full"
                animate={{
                  width: isUnfolding ? 400 : 280,
                  opacity: isUnfolding ? 0.1 : 0.2,
                }}
                transition={springs.unfold}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== FULL LETTER (Reading State) ========== */}
      <AnimatePresence>
        {isReading && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-start overflow-y-auto no-scrollbar py-6 px-4 pb-28"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{ zIndex: 100 }}
          >
            <motion.div
              className="w-full max-w-[380px]"
              initial={{ y: -60, scale: 0.9, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              transition={springs.reveal}
            >
              {/* Paper */}
              <div
                className="relative rounded overflow-hidden bg-paper-base"
                style={{
                  boxShadow: `
                    0 30px 60px -20px rgba(0,0,0,0.5),
                    0 10px 25px -10px rgba(0,0,0,0.2),
                    0 0 0 1px rgba(0,0,0,0.04)
                  `,
                }}
              >
                {/* Top accent */}
                <div className="h-2 bg-gradient-to-r from-mayday-blue via-lavender-mist to-honey-glow" />

                {/* Content */}
                <div className="p-6 relative">
                  <Quote className="absolute top-3 left-3 w-4 h-4 text-mayday-blue/20" />

                  <div className="space-y-4 font-serif text-gray-700 leading-relaxed">
                    <p className="font-bold text-[15px] text-gray-800">致 范宏泰：</p>

                    <p className="text-sm leading-relaxed">
                      这一年无论是你的陪伴还是照顾，我其实一直都记在心里。偶然间留心到了你的生日，虽不确定这个惊喜是否完全合你的心意，但真心希望这些碎碎念的记忆能让你感到温暖。
                    </p>

                    <p className="text-sm leading-relaxed">
                      从大一一起抢票看演唱会，到大二在大雨里陪你取手机的劳动周，再到大三我们依然并肩而行……总有那么一些瞬间，让我深深感受到你的那份善意与包容。
                    </p>

                    <p className="font-bold text-mayday-blue text-base italic">
                      "那一夜，没有你真的完全不行。"
                    </p>

                    {/* Quote block */}
                    <div className="relative py-3 px-4 border-l-2 border-mayday-blue/40 bg-mayday-blue/5 rounded-r">
                      <Music className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 text-mayday-blue/10" />
                      <p className="text-sm italic text-gray-600 leading-relaxed">
                        "我走过的路 只有希望<br />
                        希望你我讲过的话 放在心肝里<br />
                        总有那么一天"
                      </p>
                      <span className="block text-[10px] tracking-widest text-gray-400 font-bold uppercase mt-2">
                        —《憨人》
                      </span>
                    </div>

                    {/* Signature */}
                    <div className="pt-4 border-t border-mayday-blue/20 text-right">
                      <p className="text-sm font-bold text-gray-800">永远的朋友，陈佳玮</p>
                      <p className="font-handwritten text-xl text-mayday-blue mt-1">2026.2.23</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Button */}
            <motion.button
              onClick={onNext}
              className="mt-8 flex items-center gap-2 text-white font-bold text-sm tracking-wide bg-gradient-to-r from-mayday-blue via-lavender-mist to-honey-glow hover:from-deep-mayday hover:via-lavender-mist hover:to-amber-warmth px-6 py-3 rounded-full transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ ...springs.button, delay: 0.2 }}
              style={{
                boxShadow: '0 10px 25px -10px rgba(107,163,214,0.4)',
              }}
            >
              <span>最后的惊喜</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== FLOWING LYRICS ========== */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none z-50">
        {/* Gradient fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-dusk-dark to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-dusk-dark to-transparent z-10" />

        {/* Lyrics marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="py-4 whitespace-nowrap"
        >
          <div className="inline-flex animate-marquee">
            <span className="mx-8 text-sm text-lavender-mist/40 font-serif italic tracking-wide">
              未来的你 会一帆风顺
            </span>
            <span className="mx-8 text-xs text-mayday-blue/30">✦</span>
            <span className="mx-8 text-sm text-honey-glow/35 font-serif italic tracking-wide">
              如果你忘了我 就让风替代我 说出对你的感谢
            </span>
            <span className="mx-8 text-xs text-blush-coral/30">♪</span>
            <span className="mx-8 text-sm text-lavender-mist/40 font-serif italic tracking-wide">
              如果能有一天 再一次重返光荣 记得找我 我的好朋友
            </span>
            <span className="mx-8 text-xs text-mayday-blue/30">✦</span>
          </div>
          <div className="inline-flex animate-marquee" aria-hidden="true">
            <span className="mx-8 text-sm text-lavender-mist/40 font-serif italic tracking-wide">
              未来的你 会一帆风顺
            </span>
            <span className="mx-8 text-xs text-mayday-blue/30">✦</span>
            <span className="mx-8 text-sm text-honey-glow/35 font-serif italic tracking-wide">
              如果你忘了我 就让风替代我 说出对你的感谢
            </span>
            <span className="mx-8 text-xs text-blush-coral/30">♪</span>
            <span className="mx-8 text-sm text-lavender-mist/40 font-serif italic tracking-wide">
              如果能有一天 再一次重返光荣 记得找我 我的好朋友
            </span>
            <span className="mx-8 text-xs text-mayday-blue/30">✦</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};