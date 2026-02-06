'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Quote, Music } from 'lucide-react';
import { TransitionProps } from '../types';

/**
 * SceneLetter - 3D realistic warm envelope opening to reveal a heartfelt letter
 */

// Spring physics - tuned for realistic paper feel
const springs = {
  flapOpen: { type: "spring" as const, stiffness: 35, damping: 20, mass: 1.2 },
  letterRise: { type: "spring" as const, stiffness: 28, damping: 16, mass: 1 },
  reveal: { type: "spring" as const, stiffness: 50, damping: 18 },
  seal: { type: "spring" as const, stiffness: 200, damping: 15 },
  button: { type: "spring" as const, stiffness: 300, damping: 20 },
};

// Warm kraft paper palette
const kraft = {
  body: '#C4975E',
  bodyLight: '#D4AA74',
  bodyDark: '#A67B4A',
  flap: '#BF9058',
  flapInner: '#D9BD96',
  liner: '#E8D5BC',
  shadow: '#7A5C3A',
  paper: '#FFF8EE',
  paperEdge: '#F0E4D0',
  sealRed: '#B83A2A',
  sealDark: '#8B2A1E',
  gold: '#D4A054',
  warmGlow: '#FFD4A0',
};

// Paper fiber SVG noise (inline for no network dependency)
const paperNoiseSvg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E")`;

type Phase = 'idle' | 'sealBreak' | 'flapOpen' | 'letterPeek' | 'letterRise' | 'reading';

// Warm floating dust particle
const DustParticle: React.FC<{ index: number }> = ({ index }) => {
  const style = useMemo(() => {
    const size = 2 + Math.random() * 3;
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const duration = 6 + Math.random() * 8;
    const delay = Math.random() * 5;
    const drift = 15 + Math.random() * 30;
    return { size, left, top, duration, delay, drift };
  }, []);

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: style.size,
        height: style.size,
        left: `${style.left}%`,
        top: `${style.top}%`,
        background: `radial-gradient(circle, ${kraft.warmGlow}90, ${kraft.gold}40)`,
        boxShadow: `0 0 ${style.size * 2}px ${kraft.warmGlow}50`,
      }}
      animate={{
        y: [0, -style.drift, 0],
        x: [0, style.drift * 0.3, 0],
        opacity: [0, 0.7, 0],
        scale: [0.5, 1, 0.5],
      }}
      transition={{
        duration: style.duration,
        delay: style.delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

export const SceneLetter: React.FC<TransitionProps> = ({ onNext }) => {
  const [phase, setPhase] = useState<Phase>('idle');

  useEffect(() => {
    const sequence = async () => {
      await delay(900);
      setPhase('sealBreak');      // Wax seal cracks
      await delay(800);
      setPhase('flapOpen');       // Top flap lifts open
      await delay(1400);
      setPhase('letterPeek');     // Letter peeks out
      await delay(600);
      setPhase('letterRise');     // Letter rises up
      await delay(1200);
      setPhase('reading');        // Full reading mode
    };
    sequence();
  }, []);

  const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

  // Phase progression flags
  const sealBroken = phase !== 'idle';
  const flapOpened = phase === 'flapOpen' || phase === 'letterPeek' || phase === 'letterRise' || phase === 'reading';
  const letterPeeking = phase === 'letterPeek' || phase === 'letterRise' || phase === 'reading';
  const letterRisen = phase === 'letterRise' || phase === 'reading';
  const isReading = phase === 'reading';

  // Dust particles for warm atmosphere
  const dustParticles = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => <DustParticle key={i} index={i} />), []
  );

  return (
    <div className="relative w-full h-full bg-dusk-dark flex items-center justify-center overflow-hidden">

      {/* ========== WARM AMBIENT LIGHTING ========== */}
      <div className="absolute inset-0">
        {/* Base warm gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2a2035]/80 via-[#1e2a3a] to-[#15101a]" />

        {/* Warm top-down light source (like a desk lamp) */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4"
          style={{
            width: 500,
            height: 400,
            background: `radial-gradient(ellipse at center, ${kraft.warmGlow}18, ${kraft.gold}08, transparent 70%)`,
            filter: 'blur(60px)',
          }}
          animate={{ opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Side warm glow */}
        <div
          className="absolute top-1/3 right-0 -translate-y-1/2"
          style={{
            width: 300,
            height: 300,
            background: `radial-gradient(circle, ${kraft.warmGlow}0C, transparent 70%)`,
            filter: 'blur(80px)',
          }}
        />

        {/* Subtle mayday-blue accent glow */}
        <div className="absolute bottom-1/4 left-1/4 w-[200px] h-[200px] bg-mayday-blue/5 blur-[100px] rounded-full" />

        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,5,15,0.6) 100%)',
          }}
        />
      </div>

      {/* Floating warm dust */}
      <div className="absolute inset-0 pointer-events-none">
        {dustParticles}
      </div>

      {/* ========== 3D REALISTIC ENVELOPE ========== */}
      <AnimatePresence>
        {!isReading && (
          <motion.div
            className="relative flex items-center justify-center"
            style={{ perspective: '1200px' }}
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -60, rotateX: -15 }}
            transition={{ duration: 0.6 }}
          >
            {/*
              Envelope layer order (back→front):
              z1: Back panel (envelope body)
              z2: Letter (slides up to emerge)
              z3: Front panel (pocket wall, hides letter)
              z4: Top flap (triangle, flips backward when opened)
              z5: Wax seal (on flap tip)
            */}
            <div
              className="relative"
              style={{
                width: 320,
                height: 220,
                transformStyle: 'preserve-3d',
                transform: 'rotateX(5deg)',
              }}
            >
              {/* === z1: BACK PANEL === */}
              <div
                className="absolute inset-0 rounded-md"
                style={{
                  zIndex: 1,
                  background: `linear-gradient(170deg, ${kraft.bodyLight} 0%, ${kraft.body} 50%, ${kraft.bodyDark} 100%)`,
                  boxShadow: `
                    0 25px 50px -12px rgba(0,0,0,0.5),
                    0 12px 24px -8px ${kraft.shadow}60,
                    inset 0 1px 0 ${kraft.bodyLight}80,
                    inset 0 -2px 4px ${kraft.bodyDark}40
                  `,
                }}
              >
                {/* Paper fiber texture */}
                <div
                  className="absolute inset-0 rounded-md opacity-20 mix-blend-multiply"
                  style={{ backgroundImage: paperNoiseSvg }}
                />
                {/* Worn edge highlight */}
                <div className="absolute inset-0 rounded-md"
                  style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)' }}
                />
                {/* Inner liner visible when flap opens */}
                <motion.div
                  className="absolute rounded-sm"
                  style={{
                    top: 6, left: 6, right: 6, bottom: '45%',
                    background: `linear-gradient(to bottom, ${kraft.liner}, ${kraft.flapInner})`,
                  }}
                  animate={{ opacity: flapOpened ? 0.5 : 0 }}
                  transition={{ duration: 0.6 }}
                />
              </div>

              {/* === z2: LETTER (emerges from the top opening) === */}
              <motion.div
                className="absolute"
                style={{
                  left: 18,
                  right: 18,
                  top: 15,
                  height: 170,
                  zIndex: 2,
                  transformOrigin: 'center bottom',
                }}
                initial={{ y: 0 }}
                animate={{
                  y: letterPeeking ? (letterRisen ? -130 : -35) : 0,
                }}
                transition={springs.letterRise}
              >
                <div
                  className="w-full h-full rounded-sm relative overflow-hidden"
                  style={{
                    background: `linear-gradient(to bottom, ${kraft.paper}, ${kraft.paperEdge})`,
                    boxShadow: letterRisen
                      ? `0 20px 40px -10px rgba(0,0,0,0.35), 0 6px 16px rgba(0,0,0,0.12)`
                      : `0 2px 6px rgba(0,0,0,0.06)`,
                  }}
                >
                  {/* Fold crease lines */}
                  <div className="absolute top-[33%] left-3 right-3 h-px" style={{ background: `${kraft.bodyDark}12` }} />
                  <div className="absolute top-[66%] left-3 right-3 h-px" style={{ background: `${kraft.bodyDark}08` }} />

                  {/* Content preview */}
                  <div className="flex flex-col items-center justify-center h-full">
                    <motion.div
                      className="text-3xl mb-2"
                      style={{ color: kraft.sealRed }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      ♥
                    </motion.div>
                    <span
                      className="text-[10px] tracking-[0.3em] uppercase font-serif"
                      style={{ color: `${kraft.bodyDark}90` }}
                    >
                      A Letter For You
                    </span>
                  </div>

                  {/* Paper texture */}
                  <div
                    className="absolute inset-0 opacity-10 mix-blend-multiply"
                    style={{ backgroundImage: paperNoiseSvg }}
                  />
                </div>
              </motion.div>

              {/* === z3: FRONT PANEL (pocket wall - hides letter) === */}
              <div
                className="absolute left-0 right-0 bottom-0 rounded-b-md"
                style={{
                  height: '60%',
                  zIndex: 3,
                  background: `linear-gradient(0deg, ${kraft.bodyDark} 0%, ${kraft.body} 60%, ${kraft.bodyLight} 100%)`,
                  boxShadow: `inset 0 1px 0 ${kraft.bodyLight}50`,
                }}
              >
                {/* Paper texture */}
                <div
                  className="absolute inset-0 rounded-b-md opacity-18 mix-blend-multiply"
                  style={{ backgroundImage: paperNoiseSvg }}
                />
                {/* Subtle fold lines showing internal flap edges */}
                <div
                  className="absolute top-0 left-[10%] right-[10%] h-px"
                  style={{ background: `linear-gradient(to right, transparent, ${kraft.shadow}20, transparent)` }}
                />
              </div>

              {/* === z4: TOP FLAP (triangle, hinged at tip/point) === */}
              <motion.div
                className="absolute left-0 right-0"
                style={{
                  top: 0,
                  height: '52%',
                  transformOrigin: 'center bottom',
                  transformStyle: 'preserve-3d',
                  zIndex: flapOpened ? 0 : 4,
                }}
                initial={{ rotateX: 0 }}
                animate={{ rotateX: flapOpened ? 175 : 0 }}
                transition={springs.flapOpen}
              >
                {/* Flap front face (visible when closed) */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(180deg, ${kraft.flap} 0%, ${kraft.body} 100%)`,
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-20 mix-blend-multiply"
                    style={{
                      backgroundImage: paperNoiseSvg,
                      clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                    }}
                  />
                  {/* Fold shadow at tip */}
                  <div
                    className="absolute bottom-[5%] left-[20%] right-[20%] h-px"
                    style={{
                      background: `linear-gradient(to right, transparent, ${kraft.shadow}40, transparent)`,
                    }}
                  />
                </div>

                {/* Flap back face (visible when opened/flipped) */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(0deg, ${kraft.flapInner} 0%, ${kraft.liner} 100%)`,
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                    transform: 'rotateX(180deg)',
                    backfaceVisibility: 'hidden',
                  }}
                />
              </motion.div>

              {/* === z5: WAX SEAL (at flap tip, where it meets front panel) === */}
              <motion.div
                className="absolute left-1/2 -translate-x-1/2"
                style={{
                  top: '45%',
                  zIndex: 5,
                }}
                initial={{ scale: 1, opacity: 1 }}
                animate={{
                  scale: sealBroken ? (flapOpened ? 0 : 0.9) : 1,
                  opacity: sealBroken ? (flapOpened ? 0 : 0.85) : 1,
                  rotate: sealBroken ? (flapOpened ? -20 : 6) : 0,
                  y: flapOpened ? 8 : 0,
                }}
                transition={springs.seal}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center relative"
                  style={{
                    background: `radial-gradient(circle at 35% 35%, ${kraft.sealRed} 0%, ${kraft.sealDark} 80%)`,
                    boxShadow: `
                      0 4px 12px ${kraft.sealDark}90,
                      0 1px 3px rgba(0,0,0,0.4),
                      inset 0 2px 3px rgba(255,200,200,0.3),
                      inset 0 -1px 2px rgba(0,0,0,0.3)
                    `,
                  }}
                >
                  <span className="text-red-200/80 text-2xl" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                    ♥
                  </span>
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      border: `2px solid ${kraft.sealDark}40`,
                      boxShadow: `inset 0 0 0 3px ${kraft.sealRed}60`,
                    }}
                  />
                  {/* Warm glow */}
                  <motion.div
                    className="absolute inset-[-8px] rounded-full"
                    style={{ background: `radial-gradient(circle, ${kraft.warmGlow}20, transparent 70%)` }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  {/* Crack lines */}
                  {sealBroken && !flapOpened && (
                    <motion.div
                      className="absolute inset-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="absolute top-1/2 left-1 right-1 h-[1px] bg-black/30 rotate-[15deg]" />
                      <div className="absolute top-[40%] left-2 right-3 h-[1px] bg-black/20 -rotate-[8deg]" />
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Envelope shadow on surface */}
              <motion.div
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-full"
                style={{
                  background: 'radial-gradient(ellipse, rgba(0,0,0,0.3), transparent 70%)',
                  filter: 'blur(8px)',
                }}
                animate={{
                  width: flapOpened ? 360 : 300,
                  height: flapOpened ? 20 : 16,
                  opacity: letterRisen ? 0.15 : 0.35,
                }}
                transition={springs.flapOpen}
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
            transition={{ duration: 0.4 }}
            style={{ zIndex: 100 }}
          >
            <motion.div
              className="w-full max-w-[380px]"
              initial={{ y: 80, scale: 0.88, opacity: 0, rotateX: 8 }}
              animate={{ y: 0, scale: 1, opacity: 1, rotateX: 0 }}
              transition={springs.reveal}
            >
              {/* Paper with realistic warm styling */}
              <div
                className="relative rounded overflow-hidden"
                style={{
                  background: `linear-gradient(175deg, ${kraft.paper} 0%, ${kraft.paperEdge} 100%)`,
                  boxShadow: `
                    0 40px 70px -25px rgba(0,0,0,0.5),
                    0 15px 30px -10px ${kraft.shadow}40,
                    0 0 0 1px ${kraft.bodyDark}15,
                    inset 0 1px 0 rgba(255,255,255,0.6)
                  `,
                }}
              >
                {/* Top accent - warm gradient */}
                <div
                  className="h-2"
                  style={{
                    background: `linear-gradient(to right, ${kraft.gold}, #9B8EC6, ${kraft.warmGlow})`,
                  }}
                />

                {/* Paper texture overlay */}
                <div
                  className="absolute inset-0 opacity-8 mix-blend-multiply pointer-events-none"
                  style={{ backgroundImage: paperNoiseSvg }}
                />

                {/* Content */}
                <div className="p-6 relative">
                  <Quote className="absolute top-3 left-3 w-4 h-4" style={{ color: `${kraft.gold}40` }} />

                  <div className="space-y-4 font-serif text-gray-700 leading-relaxed">
                    <p className="font-bold text-[15px] text-gray-800">致 范宏泰：</p>

                    <p className="text-sm leading-relaxed">
                      这一年无论是你的陪伴还是照顾，我其实一直都记在心里。偶然间留心到了你的生日，虽不确定这个惊喜是否完全合你的心意，但真心希望这些碎碎念的记忆能让你感到温暖。
                    </p>

                    <p className="text-sm leading-relaxed">
                      从大一一起抢票看演唱会，到大二在大雨里陪你取手机的劳动周，再到大三我们依然并肩而行……总有那么一些瞬间，让我深深感受到你的那份善意与包容。
                    </p>

                    <p className="font-bold text-base italic" style={{ color: kraft.sealRed }}>
                      &ldquo;那一夜，没有你真的完全不行。&rdquo;
                    </p>

                    {/* Quote block */}
                    <div
                      className="relative py-3 px-4 rounded-r"
                      style={{
                        borderLeft: `2px solid ${kraft.gold}80`,
                        background: `${kraft.gold}10`,
                      }}
                    >
                      <Music className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8" style={{ color: `${kraft.gold}18` }} />
                      <p className="text-sm italic text-gray-600 leading-relaxed">
                        &ldquo;我走过的路 只有希望<br />
                        希望你我讲过的话 放在心肝里<br />
                        总有那么一天&rdquo;
                      </p>
                      <span className="block text-[10px] tracking-widest text-gray-400 font-bold uppercase mt-2">
                        —《憨人》
                      </span>
                    </div>

                    {/* Signature */}
                    <div className="pt-4 text-right" style={{ borderTop: `1px solid ${kraft.gold}30` }}>
                      <p className="text-sm font-bold text-gray-800">永远的朋友，陈佳玮</p>
                      <p className="font-handwritten text-xl mt-1" style={{ color: kraft.gold }}>2026.2.23</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Button */}
            <motion.button
              onClick={onNext}
              className="mt-8 flex items-center gap-2 text-white font-bold text-sm tracking-wide px-6 py-3 rounded-full transition-all"
              style={{
                background: `linear-gradient(135deg, #6BA3D6, #9B8EC6, ${kraft.gold})`,
                boxShadow: `0 10px 30px -10px rgba(107,163,214,0.4), 0 4px 12px ${kraft.gold}30`,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ ...springs.button, delay: 0.2 }}
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
