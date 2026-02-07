'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Quote, Music, Heart, Star, Sparkles } from 'lucide-react';
import { TransitionProps } from '../types';

/**
 * SceneLetter — 信封开启动画
 *
 * Phase timeline:
 *   idle → sealBreak → flapPeek → flapOpen → letterPeek → letterSlide → letterRise → reading
 *
 * Rendering strategy:
 *   The envelope container uses FLAT rendering (no preserve-3d).
 *   Standard CSS z-index controls layer ordering.
 *   Only the flap has its own preserve-3d for front/back face rotation.
 *
 *   Layer order (z-index):
 *     0  Shadow (below envelope, negative bottom offset)
 *     1  Back panel
 *     2  Letter (→ 10 when risen)
 *     3  Front panel (pocket wall — clips letter via z-index overlap)
 *     4  Flap (→ 0 when opened past 90°)
 *     5  Seal (→ disappears)
 */

// ─── Spring Physics ────────────────────────────────────────────
const springs = {
  flapPeek: { type: 'spring' as const, stiffness: 40, damping: 18, mass: 2 },
  flapSwing: { type: 'spring' as const, stiffness: 28, damping: 14, mass: 1.8 },
  letterPeek: { type: 'spring' as const, stiffness: 80, damping: 24, mass: 0.8 },
  letterFriction: { duration: 1.2, ease: [0.08, 0.01, 0.18, 0.98] as const },
  letterFloat: { type: 'spring' as const, stiffness: 24, damping: 11, mass: 1.4 },
  reveal: { type: 'spring' as const, stiffness: 40, damping: 20, mass: 1.2 },
  seal: { type: 'spring' as const, stiffness: 200, damping: 15, mass: 0.5 },
  button: { type: 'spring' as const, stiffness: 300, damping: 20, mass: 1 },
};

// ─── Kraft Paper Palette ───────────────────────────────────────
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

// Paper fiber SVG noise (inline — no network dependency)
const paperNoiseSvg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E")`;

type Phase = 'idle' | 'sealBreak' | 'flapPeek' | 'flapOpen' | 'letterPeek' | 'letterSlide' | 'letterRise' | 'reading';

// ─── Sub-components ────────────────────────────────────────────

/** Warm floating dust particle */
const DustParticle: React.FC<{ index: number }> = ({ index }) => {
  const s = useMemo(() => {
    const size = 2 + Math.random() * 3;
    return {
      size,
      left: Math.random() * 100,
      top: Math.random() * 100,
      dur: 6 + Math.random() * 8,
      delay: Math.random() * 5,
      drift: 15 + Math.random() * 30,
    };
  }, []);

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: s.size, height: s.size,
        left: `${s.left}%`, top: `${s.top}%`,
        background: `radial-gradient(circle, ${kraft.warmGlow}90, ${kraft.gold}40)`,
        boxShadow: `0 0 ${s.size * 2}px ${kraft.warmGlow}50`,
      }}
      animate={{
        y: [0, -s.drift, 0],
        x: [0, s.drift * 0.3, 0],
        opacity: [0, 0.7, 0],
        scale: [0.5, 1, 0.5],
      }}
      transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
};

/** Seal debris — scatters when seal cracks */
const SealDebris: React.FC<{ index: number }> = ({ index }) => {
  const s = useMemo(() => {
    const angle = (index / 8) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
    const dist = 16 + Math.random() * 22;
    const sz = 1.5 + Math.random() * 2.5;
    return {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist + 10,
      size: sz,
      rot: Math.random() * 540 - 270,
    };
  }, [index]);

  return (
    <motion.div
      className="absolute rounded-sm"
      style={{
        width: s.size, height: s.size * 0.7,
        background: `linear-gradient(135deg, ${kraft.sealRed}, ${kraft.sealDark})`,
        left: '50%', top: '50%',
      }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
      animate={{ x: s.x, y: s.y, opacity: 0, scale: 0.15, rotate: s.rot }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    />
  );
};

// ─── Main Component ────────────────────────────────────────────

export const SceneLetter: React.FC<TransitionProps> = ({ onNext }) => {
  const [phase, setPhase] = useState<Phase>('idle');

  useEffect(() => {
    const run = async () => {
      await wait(1000);        // 信封静置 — 酝酿沉浸感
      setPhase('sealBreak');   // 蜡封碎裂 + 信封微震
      await wait(700);
      setPhase('flapPeek');    // 信封盖微微翘起 (~30°)
      await wait(900);
      setPhase('flapOpen');    // 信封盖完全翻开 (~170°)
      await wait(800);
      setPhase('letterPeek');  // 信纸顶边露出
      await wait(600);
      setPhase('letterSlide'); // 信纸缓慢抽出 (带摩擦感)
      await wait(1100);
      setPhase('letterRise');  // 信纸完全升起 悬停
      await wait(2000);
      setPhase('reading');     // 进入阅读
    };
    run();
  }, []);

  const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

  // Phase-progression flags
  const sealBroken = phase !== 'idle';
  const flapPeeking = ['flapPeek', 'flapOpen', 'letterPeek', 'letterSlide', 'letterRise', 'reading'].includes(phase);
  const flapOpened = ['flapOpen', 'letterPeek', 'letterSlide', 'letterRise', 'reading'].includes(phase);
  const letterPeeking = ['letterPeek', 'letterSlide', 'letterRise', 'reading'].includes(phase);
  const letterSliding = ['letterSlide', 'letterRise', 'reading'].includes(phase);
  const letterRisen = phase === 'letterRise' || phase === 'reading';
  const isReading = phase === 'reading';

  const dustParticles = useMemo(
    () => Array.from({ length: 18 }, (_, i) => <DustParticle key={i} index={i} />),
    [],
  );

  return (
    <div className="relative w-full h-full bg-dusk-dark flex items-center justify-center overflow-hidden">

      {/* ═══ WARM AMBIENT LIGHTING ═══ */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2a2035]/80 via-[#1e2a3a] to-[#15101a]" />

        {/* Desk lamp light cone */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4"
          style={{
            width: 500, height: 400,
            background: `radial-gradient(ellipse at center, ${kraft.warmGlow}18, ${kraft.gold}08, transparent 70%)`,
            filter: 'blur(60px)',
          }}
          animate={{ opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Side fill light */}
        <div
          className="absolute top-1/3 right-0 -translate-y-1/2"
          style={{
            width: 300, height: 300,
            background: `radial-gradient(circle, ${kraft.warmGlow}0C, transparent 70%)`,
            filter: 'blur(80px)',
          }}
        />

        <div className="absolute bottom-1/4 left-1/4 w-[200px] h-[200px] bg-mayday-blue/5 blur-[100px] rounded-full" />

        {/* Vignette — tightens as letter rises for dramatic focus */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: letterRisen
              ? 'radial-gradient(ellipse at center, transparent 30%, rgba(10,5,15,0.7) 100%)'
              : 'radial-gradient(ellipse at center, transparent 40%, rgba(10,5,15,0.6) 100%)',
          }}
          transition={{ duration: 1.5 }}
        />
      </div>

      {/* Floating warm dust */}
      <div className="absolute inset-0 pointer-events-none">{dustParticles}</div>

      {/* ═══ 3D ENVELOPE ═══ */}
      <AnimatePresence>
        {!isReading && (
          <motion.div
            className="relative flex items-center justify-center"
            style={{ perspective: 1200 }}
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: letterRisen ? -20 : (letterSliding ? 8 : 0),
            }}
            exit={{ opacity: 0, scale: 1.15, filter: 'blur(12px)', y: 60 }}
            transition={{
              duration: 0.8,
              ease: 'circOut',
              y: { type: 'spring', stiffness: 60, damping: 16 },
            }}
          >
            {/* Shake wrapper — preserve-3d so perspective passes through to envelope tilt */}
            <motion.div
              style={{ transformStyle: 'preserve-3d' }}
              animate={{
                rotateZ: sealBroken && !flapPeeking ? [0, -2, 2, -1.2, 0.8, -0.3, 0] : 0,
                x: sealBroken && !flapPeeking ? [0, -3, 3, -1.5, 0.5, 0] : 0,
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              {/*
                ENVELOPE CONTAINER — FLAT rendering (NO preserve-3d!)
                Children use standard z-index stacking.
                The rotateX(5deg) is purely visual — it tilts the whole
                flat-rendered envelope as one slab in the parent's 3D space.
              */}
              <div
                className="relative"
                style={{
                  width: 320,
                  height: 220,
                  perspective: 800,
                  transform: 'rotateX(5deg)',
                }}
              >

                {/* ─── z1: BACK PANEL ─── */}
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
                  <div
                    className="absolute inset-0 rounded-md"
                    style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)' }}
                  />
                  {/* Inner liner — revealed when flap lifts */}
                  <motion.div
                    className="absolute rounded-sm"
                    style={{
                      top: 6, left: 6, right: 6, bottom: '45%',
                      background: `linear-gradient(to bottom, ${kraft.liner}, ${kraft.flapInner})`,
                    }}
                    animate={{ opacity: flapOpened ? 0.65 : (flapPeeking ? 0.2 : 0) }}
                    transition={{ duration: 0.8 }}
                  />
                  {/* Inner warm glow — grows as envelope opens */}
                  <motion.div
                    className="absolute rounded-sm"
                    style={{
                      top: '10%', left: '10%', right: '10%', bottom: '50%',
                      background: `radial-gradient(ellipse at center bottom, ${kraft.warmGlow}60, ${kraft.gold}25, transparent 80%)`,
                      filter: 'blur(15px)',
                    }}
                    animate={{ opacity: flapOpened ? 1 : (flapPeeking ? 0.25 : 0) }}
                    transition={{ duration: 1.4, delay: 0.2 }}
                  />
                </div>

                {/* ─── z2: LETTER ───
                     z-index 2 = BELOW front panel (3).
                     Where letter overlaps front panel → hidden behind it.
                     Where letter extends above front panel → visible.
                     On rise → z-index jumps to 10 (above everything).
                */}
                <motion.div
                  className="absolute"
                  style={{
                    left: 18, right: 18, top: 15,
                    height: 170,
                    transformOrigin: 'center bottom',
                  }}
                  initial={{ y: 0, zIndex: 2 }}
                  animate={{
                    zIndex: letterRisen ? 10 : 2,
                    y: letterPeeking
                      ? (letterSliding
                        ? (letterRisen ? -180 : -55)
                        : -14)
                      : 0,
                    rotateZ: letterSliding && !letterRisen ? -0.6 : 0,
                    scale: letterRisen ? 1.08 : 1,
                  }}
                  transition={{
                    y: letterPeeking
                      ? (letterSliding
                        ? (letterRisen
                          ? springs.letterFloat
                          : springs.letterFriction)
                        : springs.letterPeek)
                      : { duration: 0 },
                    rotateZ: { duration: 0.8, ease: 'easeInOut' },
                    scale: { duration: 1, ease: 'easeOut' },
                    zIndex: { duration: 0 },
                  }}
                >
                  <motion.div
                    className="w-full h-full rounded-sm relative overflow-hidden"
                    style={{
                      background: `linear-gradient(to bottom, ${kraft.paper}, ${kraft.paperEdge})`,
                    }}
                    animate={{
                      boxShadow: letterRisen
                        ? `0 30px 60px -15px rgba(0,0,0,0.45), 0 10px 25px rgba(0,0,0,0.15), 0 0 60px ${kraft.warmGlow}10`
                        : letterSliding
                          ? `0 14px 35px -8px rgba(0,0,0,0.3), 0 5px 14px rgba(0,0,0,0.12)`
                          : letterPeeking
                            ? `0 6px 18px -4px rgba(0,0,0,0.18)`
                            : `0 2px 6px rgba(0,0,0,0.06)`,
                      filter: letterRisen
                        ? 'brightness(1.04)'
                        : letterSliding
                          ? 'brightness(0.96)'
                          : 'brightness(0.88)',
                    }}
                    transition={{ duration: 0.8 }}
                  >
                    {/* Fold crease lines — flatten as letter straightens */}
                    <motion.div
                      className="absolute top-[33%] left-3 right-3"
                      style={{ background: `${kraft.bodyDark}18` }}
                      animate={{ height: letterRisen ? 0.5 : 1.5, opacity: letterRisen ? 0.2 : 0.7 }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                    />
                    <motion.div
                      className="absolute top-[66%] left-3 right-3"
                      style={{ background: `${kraft.bodyDark}10` }}
                      animate={{ height: letterRisen ? 0.5 : 1, opacity: letterRisen ? 0.12 : 0.45 }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                    />

                    {/* Fold shadow (depth illusion for folded paper) */}
                    <motion.div
                      className="absolute top-[33%] left-2 right-2 h-[4px]"
                      style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.04), transparent)' }}
                      animate={{ opacity: letterRisen ? 0 : 0.6 }}
                      transition={{ duration: 0.8 }}
                    />

                    {/* Content preview — ♥ A Letter For You */}
                    <div className="flex flex-col items-center justify-center h-full">
                      <motion.div
                        className="text-3xl mb-2"
                        style={{ color: kraft.sealRed }}
                        animate={{
                          scale: letterRisen ? [1, 1.15, 1] : 1,
                          opacity: letterRisen ? 1 : 0.55,
                        }}
                        transition={{ duration: 2, repeat: letterRisen ? Infinity : 0, ease: 'easeInOut' }}
                      >
                        <Heart className="w-8 h-8 fill-current mb-2" />
                      </motion.div>
                      <motion.span
                        className="text-[10px] tracking-[0.3em] uppercase font-serif"
                        style={{ color: kraft.bodyDark }}
                        animate={{ opacity: letterRisen ? 0.9 : 0.35 }}
                        transition={{ duration: 0.8 }}
                      >
                        A Letter For You
                      </motion.span>
                    </div>

                    {/* Paper texture overlay */}
                    <div
                      className="absolute inset-0 opacity-10 mix-blend-multiply"
                      style={{ backgroundImage: paperNoiseSvg }}
                    />

                    {/* Subtle edge highlight when risen */}
                    <motion.div
                      className="absolute inset-0 rounded-sm pointer-events-none"
                      animate={{
                        boxShadow: letterRisen
                          ? 'inset 0 0 0 0.5px rgba(255,255,255,0.2)'
                          : 'inset 0 0 0 0px transparent',
                      }}
                      transition={{ duration: 0.8 }}
                    />
                  </motion.div>
                </motion.div>

                {/* ─── z3: FRONT PANEL (pocket wall) ───
                     z-index 3 = ABOVE letter (2).
                     The front panel naturally hides the letter where they overlap.
                     This is the key to the clipping — pure CSS z-index, no 3D tricks.
                */}
                <div
                  className="absolute bottom-0 left-0 right-0 rounded-b-md"
                  style={{
                    height: '60%',
                    zIndex: 3,
                    background: `linear-gradient(0deg, ${kraft.bodyDark} 0%, ${kraft.body} 60%, ${kraft.bodyLight} 100%)`,
                    boxShadow: `inset 0 1px 0 ${kraft.bodyLight}50`,
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-b-md opacity-[0.18] mix-blend-multiply"
                    style={{ backgroundImage: paperNoiseSvg }}
                  />
                  {/* Fold seam lines */}
                  <div
                    className="absolute top-0 left-[10%] right-[10%] h-px"
                    style={{ background: `linear-gradient(to right, transparent, ${kraft.shadow}20, transparent)` }}
                  />
                  {/* Pocket opening shadow (depth cue) */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[4px]"
                    style={{ background: `linear-gradient(to bottom, ${kraft.shadow}35, transparent)` }}
                  />
                  {/* Side fold triangles */}
                  <div
                    className="absolute top-0 left-0 w-[30%] h-[40%]"
                    style={{ background: `linear-gradient(135deg, ${kraft.bodyDark}15, transparent 60%)` }}
                  />
                  <div
                    className="absolute top-0 right-0 w-[30%] h-[40%]"
                    style={{ background: `linear-gradient(-135deg, ${kraft.bodyDark}15, transparent 60%)` }}
                  />
                </div>

                {/* ─── z4: TOP FLAP ───
                     This is the ONLY element with preserve-3d,
                     for the front/back face rotation trick.
                     z-index: 4 (closed) → 0 (opened, goes behind back panel).
                */}
                <motion.div
                  className="absolute left-0 right-0"
                  style={{
                    top: 0,
                    height: '52%',
                    transformOrigin: 'center bottom',
                    transformStyle: 'preserve-3d',
                  }}
                  initial={{ rotateX: 0, zIndex: 4 }}
                  animate={{
                    rotateX: flapOpened ? 165 : (flapPeeking ? 20 : 0),
                    y: flapOpened ? -3 : (flapPeeking ? -1 : 0),
                    zIndex: flapOpened ? 0 : 4,
                  }}
                  transition={{
                    rotateX: flapOpened
                      ? springs.flapSwing
                      : flapPeeking
                        ? springs.flapPeek
                        : { duration: 0.1 },
                    y: { duration: 0.5, ease: 'easeOut' },
                    zIndex: { duration: 0, delay: flapOpened ? 0.35 : 0 },
                  }}
                >
                  {/* Front face — visible when closed */}
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
                    <div
                      className="absolute bottom-[5%] left-[20%] right-[20%] h-px"
                      style={{ background: `linear-gradient(to right, transparent, ${kraft.shadow}40, transparent)` }}
                    />
                    {/* Diagonal fold lines */}
                    <div
                      className="absolute top-[30%] left-[5%] w-[45%] h-px rotate-[25deg]"
                      style={{ background: `${kraft.shadow}10` }}
                    />
                    <div
                      className="absolute top-[30%] right-[5%] w-[45%] h-px -rotate-[25deg]"
                      style={{ background: `${kraft.shadow}10` }}
                    />
                  </div>

                  {/* Back face — visible when opened */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(0deg, ${kraft.flapInner} 0%, ${kraft.liner} 100%)`,
                      clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                      transform: 'rotateX(180deg)',
                      backfaceVisibility: 'hidden',
                    }}
                  />

                  {/* Flap shadow on envelope body during peek */}
                  <motion.div
                    className="absolute bottom-[-2px] left-[12%] right-[12%] h-[8px]"
                    style={{
                      background: `linear-gradient(to bottom, ${kraft.shadow}60, transparent)`,
                      filter: 'blur(3px)',
                      transformOrigin: 'center top',
                    }}
                    animate={{
                      opacity: flapPeeking && !flapOpened ? 0.8 : 0,
                      scaleY: flapPeeking && !flapOpened ? 1.5 : 0,
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.div>

                {/* ─── z5: WAX SEAL ─── */}
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2"
                  style={{ top: '45%' }}
                  initial={{ scale: 1, opacity: 1, zIndex: 5 }}
                  animate={{
                    zIndex: flapPeeking ? 0 : 5,
                    scale: sealBroken ? (flapPeeking ? 0 : 0.95) : 1,
                    opacity: sealBroken ? (flapPeeking ? 0 : 1) : 1,
                    rotate: sealBroken ? (flapPeeking ? -20 : 5) : 0,
                    y: flapPeeking ? 15 : 0,
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
                    <Heart className="w-8 h-8 text-red-200/80 fill-current drop-shadow-sm" />
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        border: `2px solid ${kraft.sealDark}40`,
                        boxShadow: `inset 0 0 0 3px ${kraft.sealRed}60`,
                      }}
                    />
                    {/* Warm pulse glow */}
                    <motion.div
                      className="absolute inset-[-8px] rounded-full"
                      style={{ background: `radial-gradient(circle, ${kraft.warmGlow}20, transparent 70%)` }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    {/* Crack lines on seal */}
                    {sealBroken && !flapPeeking && (
                      <motion.div
                        className="absolute inset-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.15 }}
                      >
                        <div className="absolute top-1/2 left-0.5 right-0.5 h-[1.5px] bg-black/40 rotate-[12deg]" />
                        <div className="absolute top-[38%] left-1.5 right-2 h-[1px] bg-black/25 -rotate-[10deg]" />
                        <div className="absolute top-[60%] left-3 right-1 h-[1px] bg-black/[0.18] rotate-[5deg]" />
                      </motion.div>
                    )}
                    {/* Seal debris particles */}
                    {sealBroken && !flapPeeking && (
                      <>
                        {Array.from({ length: 8 }, (_, i) => (
                          <SealDebris key={i} index={i} />
                        ))}
                      </>
                    )}
                  </div>
                </motion.div>

                {/* Envelope shadow on desk surface */}
                <motion.div
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-full"
                  style={{
                    zIndex: 0,
                    background: 'radial-gradient(ellipse, rgba(0,0,0,0.3), transparent 70%)',
                    filter: 'blur(8px)',
                  }}
                  animate={{
                    width: flapOpened ? 350 : (flapPeeking ? 325 : 300),
                    height: flapOpened ? 22 : (flapPeeking ? 18 : 16),
                    opacity: letterRisen ? 0.08 : (flapOpened ? 0.28 : 0.35),
                    y: letterRisen ? 10 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 60, damping: 18 }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ FULL LETTER (Reading State) ═══ */}
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
              initial={{ y: 40, scale: 0.9, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              transition={{ ...springs.reveal, delay: 0.2 }}
            >
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
                {/* Top accent ribbon */}
                <div
                  className="h-2"
                  style={{ background: `linear-gradient(to right, ${kraft.gold}, #9B8EC6, ${kraft.warmGlow})` }}
                />

                <div
                  className="absolute inset-0 opacity-[0.08] mix-blend-multiply pointer-events-none"
                  style={{ backgroundImage: paperNoiseSvg }}
                />

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

                    <div
                      className="relative py-3 px-4 rounded-r"
                      style={{ borderLeft: `2px solid ${kraft.gold}80`, background: `${kraft.gold}10` }}
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

                    <div className="pt-4 text-right" style={{ borderTop: `1px solid ${kraft.gold}30` }}>
                      <p className="text-sm font-bold text-gray-800">永远的朋友，陈佳玮</p>
                      <p className="font-handwritten text-xl mt-1" style={{ color: kraft.gold }}>2026.2.23</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.button
              onClick={onNext}
              className="mt-8 flex items-center gap-2 text-white font-bold text-sm tracking-wide px-8 py-3 rounded-full transition-all group"
              style={{
                background: '#6BA3D6',
                boxShadow: `0 10px 30px -10px rgba(232,196,138,0.5), 0 0 0 1px rgba(255,255,255,0.2) inset`,
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

      {/* ═══ FLOWING LYRICS ═══ */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none z-50">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-dusk-dark to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-dusk-dark to-transparent z-10" />

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
            <span className="mx-8 text-sm text-mayday-blue/30"><Star className="w-3 h-3" /></span>
            <span className="mx-8 text-sm text-honey-glow/35 font-serif italic tracking-wide">
              如果你忘了我 就让风替代我 说出对你的感谢
            </span>
            <span className="mx-8 text-sm text-blush-coral/30"><Music className="w-3 h-3" /></span>
            <span className="mx-8 text-sm text-lavender-mist/40 font-serif italic tracking-wide">
              如果能有一天 再一次重返光荣 记得找我 我的好朋友
            </span>
            <span className="mx-8 text-sm text-mayday-blue/30"><Sparkles className="w-3 h-3" /></span>
          </div>
          <div className="inline-flex animate-marquee" aria-hidden="true">
            <span className="mx-8 text-sm text-lavender-mist/40 font-serif italic tracking-wide">
              未来的你 会一帆风顺
            </span>
            <span className="mx-8 text-sm text-mayday-blue/30"><Star className="w-3 h-3" /></span>
            <span className="mx-8 text-sm text-honey-glow/35 font-serif italic tracking-wide">
              如果你忘了我 就让风替代我 说出对你的感谢
            </span>
            <span className="mx-8 text-sm text-blush-coral/30"><Music className="w-3 h-3" /></span>
            <span className="mx-8 text-sm text-lavender-mist/40 font-serif italic tracking-wide">
              如果能有一天 再一次重返光荣 记得找我 我的好朋友
            </span>
            <span className="mx-8 text-sm text-mayday-blue/30"><Sparkles className="w-3 h-3" /></span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
