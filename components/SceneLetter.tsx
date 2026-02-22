'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { gsap, useGSAP } from '../utils/gsap-setup';
import { gsapSprings } from '../utils/gsap-setup';
import { useHoverTap } from '../hooks/useHoverTap';
import { ArrowRight, Quote, Music, Beer, Star, Sparkles } from 'lucide-react';
import { TransitionProps } from '../types';
import { letterContent } from '../content/letterContent';

/**
 * SceneLetter — 信封开启动画 (GSAP version)
 *
 * Phase timeline managed by gsap.timeline() instead of setTimeout chains.
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

type Phase = 'idle' | 'sealBreak' | 'flapTear' | 'letterPeek' | 'letterSlide' | 'letterRise' | 'reading';
const LETTER_PULL_OUT_SPEED = 1.35;

// ─── Sub-components ────────────────────────────────────────────

/** Warm floating dust particle */
const DustParticle: React.FC<{ index: number }> = ({ index }) => {
  const ref = useRef<HTMLDivElement>(null);
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

  useGSAP(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      keyframes: [
        { y: -s.drift, x: s.drift * 0.3, opacity: 0.7, scale: 1, duration: s.dur / 2 },
        { y: 0, x: 0, opacity: 0, scale: 0.5, duration: s.dur / 2 },
      ],
      repeat: -1,
      delay: s.delay,
      ease: 'sine.inOut',
    });
  });

  return (
    <div
      ref={ref}
      className="absolute rounded-full"
      style={{
        width: s.size, height: s.size,
        left: `${s.left}%`, top: `${s.top}%`,
        background: `radial-gradient(circle, ${kraft.warmGlow}90, ${kraft.gold}40)`,
        boxShadow: `0 0 ${s.size * 2}px ${kraft.warmGlow}50`,
        opacity: 0, scale: 0.5,
      }}
    />
  );
};

/** Seal debris — scatters when seal cracks */
const SealDebris: React.FC<{ index: number }> = ({ index }) => {
  const ref = useRef<HTMLDivElement>(null);
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

  useGSAP(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current,
      { x: 0, y: 0, opacity: 1, scale: 1, rotation: 0 },
      { x: s.x, y: s.y, opacity: 0, scale: 0.15, rotation: s.rot, duration: 0.8, ease: 'power2.out' },
    );
  });

  return (
    <div
      ref={ref}
      className="absolute rounded-sm"
      style={{
        width: s.size, height: s.size * 0.7,
        background: `linear-gradient(135deg, ${kraft.sealRed}, ${kraft.sealDark})`,
        left: '50%', top: '50%',
      }}
    />
  );
};

// ─── Main Component ────────────────────────────────────────────

export const SceneLetter: React.FC<TransitionProps> = ({ onNext }) => {
  const [phase, setPhase] = useState<Phase>('idle');

  // Refs for GSAP timeline targets
  const containerRef = useRef<HTMLDivElement>(null);
  const envelopeWrapperRef = useRef<HTMLDivElement>(null);
  const shakeRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const sealGlowRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const letterPaperRef = useRef<HTMLDivElement>(null);
  const linerRef = useRef<HTMLDivElement>(null);
  const innerGlowRef = useRef<HTMLDivElement>(null);
  const flapShadowRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const lampRef = useRef<HTMLDivElement>(null);
  const crease1Ref = useRef<HTMLDivElement>(null);
  const crease2Ref = useRef<HTMLDivElement>(null);
  const foldShadowRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLDivElement>(null);
  const letterTextRef = useRef<HTMLSpanElement>(null);
  const edgeHighlightRef = useRef<HTMLDivElement>(null);
  const readingRef = useRef<HTMLDivElement>(null);
  const readingContentRef = useRef<HTMLDivElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const lyricsRef = useRef<HTMLDivElement>(null);

  useHoverTap(nextButtonRef, { scale: 1.05, y: -2 }, { scale: 0.95 });

  // Phase-progression flags (derived from phase state for conditional rendering)
  const sealBroken = phase !== 'idle';
  const flapTorn = ['flapTear', 'letterPeek', 'letterSlide', 'letterRise', 'reading'].includes(phase);
  const letterRisen = phase === 'letterRise' || phase === 'reading';
  const isReading = phase === 'reading';

  const dustParticles = useMemo(
    () => Array.from({ length: 18 }, (_, i) => <DustParticle key={i} index={i} />),
    [],
  );

  // ═══ MAIN GSAP TIMELINE ═══
  useGSAP(() => {
    const tl = gsap.timeline();

    // Phase: idle (1s wait)
    tl.to({}, { duration: 1 })
    .call(() => { tl.timeScale(LETTER_PULL_OUT_SPEED); })

    // Phase: sealBreak — seal cracks + envelope shakes
    .call(() => setPhase('sealBreak'))
    .to(sealRef.current, {
      scale: 0.95, rotation: 5,
      ...gsapSprings.seal,
    }, '<')
    .to(shakeRef.current, {
      keyframes: [
        { rotationZ: -2, x: -3, duration: 0.08 },
        { rotationZ: 2, x: 3, duration: 0.08 },
        { rotationZ: -1.2, x: -1.5, duration: 0.08 },
        { rotationZ: 0.8, x: 0.5, duration: 0.08 },
        { rotationZ: -0.3, x: 0, duration: 0.08 },
        { rotationZ: 0, x: 0, duration: 0.1 },
      ],
    }, '<')

    // Phase: flapTear — flap tears off upward
    .call(() => setPhase('flapTear'), [], '+=0.3')
    // Brief tension vibration
    .to(flapRef.current, {
      keyframes: [
        { y: -4, x: 2, rotation: 1.5, duration: 0.06 },
        { y: -1, x: -1, rotation: -0.8, duration: 0.05 },
        { y: -3, x: 1, rotation: 0.5, duration: 0.05 },
      ],
    }, '<')
    // Tear off — fly upward-right with rotation
    .to(flapRef.current, {
      y: -300, x: 60, rotation: 20, scale: 0.5, opacity: 0,
      duration: 0.55, ease: 'power3.in',
    })
    // Seal tears off with flap
    .to(sealRef.current, {
      y: -280, x: 40, rotation: 15, opacity: 0, scale: 0.4,
      duration: 0.5, ease: 'power3.in',
    }, '<+0.03')
    // Reveal inner liner + glow
    .to(linerRef.current, { opacity: 0.65, duration: 0.5 }, '<')
    .to(innerGlowRef.current, { opacity: 1, duration: 0.8 }, '<')

    // Phase: letterPeek — letter top edge shows
    .call(() => setPhase('letterPeek'), [], '+=0.3')
    .to(letterRef.current, {
      y: -14,
      ...gsapSprings.letterPeek,
    }, '<')

    // Phase: letterSlide — letter slides out with friction
    .call(() => setPhase('letterSlide'), [], '+=0.3')
    .to(letterRef.current, {
      y: -55, rotationZ: -0.6,
      ...gsapSprings.letterFriction,
    }, '<')
    .to(letterPaperRef.current, {
      boxShadow: '0 14px 35px -8px rgba(0,0,0,0.3), 0 5px 14px rgba(0,0,0,0.12)',
      filter: 'brightness(0.96)',
      duration: 0.8,
    }, '<')
    // Envelope body shifts down slightly
    .to(envelopeWrapperRef.current, { y: 8, duration: 0.8, ease: 'circ.out' }, '<')

    // Phase: letterRise — letter floats up + z-index jump
    .call(() => setPhase('letterRise'), [], '+=0.5')
    .set(letterRef.current, { zIndex: 10 })
    .to(letterRef.current, {
      y: -180, scale: 1.08, rotationZ: 0,
      ...gsapSprings.letterFloat,
    }, '<')
    .to(letterPaperRef.current, {
      boxShadow: `0 30px 60px -15px rgba(0,0,0,0.45), 0 10px 25px rgba(0,0,0,0.15), 0 0 60px ${kraft.warmGlow}10`,
      filter: 'brightness(1.04)',
      duration: 0.8,
    }, '<')
    // Fold creases flatten
    .to(crease1Ref.current, { height: 0.5, opacity: 0.2, duration: 1.2, ease: 'power2.out' }, '<')
    .to(crease2Ref.current, { height: 0.5, opacity: 0.12, duration: 1.2, ease: 'power2.out' }, '<')
    .to(foldShadowRef.current, { opacity: 0, duration: 0.8 }, '<')
    // Heart pulse starts
    .to(heartRef.current, { scale: 1.15, duration: 1, repeat: -1, yoyo: true, ease: 'sine.inOut' }, '<')
    .to(heartRef.current, { opacity: 1, duration: 0.5 }, '<')
    .to(letterTextRef.current, { opacity: 0.9, duration: 0.8 }, '<')
    // Edge highlight
    .to(edgeHighlightRef.current, {
      boxShadow: 'inset 0 0 0 0.5px rgba(255,255,255,0.2)',
      duration: 0.8,
    }, '<')
    // Vignette tightens
    .to(vignetteRef.current, {
      background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10,5,15,0.7) 100%)',
      duration: 1.5,
    }, '<')
    // Shadow fades as letter rises
    .to(shadowRef.current, {
      width: 350, height: 22, opacity: 0.08, y: 10,
      duration: 1, ease: 'power2.out',
    }, '<')
    // Envelope wrapper moves down
    .to(envelopeWrapperRef.current, { y: -20, duration: 1, ease: 'power2.out' }, '<')

    // Phase: reading — envelope exits, full letter appears
    .call(() => setPhase('reading'), [], '+=1.5');
  }, { scope: containerRef });

  // Desk lamp glow pulse (always running)
  useGSAP(() => {
    if (lampRef.current) {
      gsap.to(lampRef.current, {
        opacity: 0.8, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut',
      });
    }
  }, { scope: containerRef });

  // Seal glow pulse (before broken)
  useGSAP(() => {
    if (sealGlowRef.current && !sealBroken) {
      gsap.to(sealGlowRef.current, {
        opacity: 1, duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut',
      });
    }
  }, { scope: containerRef });

  // Envelope exit + reading entrance
  useGSAP(() => {
    if (!isReading) return;

    // Exit envelope
    if (envelopeWrapperRef.current) {
      gsap.to(envelopeWrapperRef.current, {
        opacity: 0, scale: 1.15, filter: 'blur(12px)', y: 60,
        duration: 0.5, ease: 'power2.in',
        onComplete: () => gsap.set(envelopeWrapperRef.current, { display: 'none' }),
      });
    }

    // Enter reading content
    if (readingRef.current) {
      gsap.set(readingRef.current, { display: 'flex' });
      gsap.fromTo(readingRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
      );
    }
    if (readingContentRef.current) {
      gsap.fromTo(readingContentRef.current,
        { y: 40, scale: 0.9, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, delay: 0.2, ...gsapSprings.reveal },
      );
    }
    if (nextButtonRef.current) {
      gsap.fromTo(nextButtonRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, delay: 0.4, ...gsapSprings.button },
      );
    }

    // Lyrics fade in
    if (lyricsRef.current) {
      gsap.fromTo(lyricsRef.current,
        { opacity: 0 },
        { opacity: 1, delay: 1, duration: 1 },
      );
    }
  }, { dependencies: [isReading], scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full h-full bg-dusk-dark flex items-center justify-center overflow-hidden">

      {/* ═══ WARM AMBIENT LIGHTING ═══ */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2a2035]/80 via-[#1e2a3a] to-[#15101a]" />

        {/* Desk lamp light cone */}
        <div
          ref={lampRef}
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4"
          style={{
            width: 500, height: 400,
            background: `radial-gradient(ellipse at center, ${kraft.warmGlow}18, ${kraft.gold}08, transparent 70%)`,
            filter: 'blur(60px)',
            opacity: 0.6,
          }}
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

        {/* Vignette */}
        <div
          ref={vignetteRef}
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,5,15,0.6) 100%)' }}
        />
      </div>

      {/* Floating warm dust */}
      <div className="absolute inset-0 pointer-events-none">{dustParticles}</div>

      {/* ═══ 3D ENVELOPE ═══ */}
      <div
        ref={envelopeWrapperRef}
        className="relative flex items-center justify-center"
        style={{ perspective: 1200, opacity: 1 }}
      >
        {/* Shake wrapper */}
        <div
          ref={shakeRef}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* ENVELOPE CONTAINER — FLAT rendering (NO preserve-3d!) */}
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
              <div className="absolute inset-0 rounded-md opacity-20 mix-blend-multiply" style={{ backgroundImage: paperNoiseSvg }} />
              <div className="absolute inset-0 rounded-md" style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)' }} />
              {/* Inner liner */}
              <div
                ref={linerRef}
                className="absolute rounded-sm"
                style={{
                  top: 6, left: 6, right: 6, bottom: '45%',
                  background: `linear-gradient(to bottom, ${kraft.liner}, ${kraft.flapInner})`,
                  opacity: 0,
                }}
              />
              {/* Inner warm glow */}
              <div
                ref={innerGlowRef}
                className="absolute rounded-sm"
                style={{
                  top: '10%', left: '10%', right: '10%', bottom: '50%',
                  background: `radial-gradient(ellipse at center bottom, ${kraft.warmGlow}60, ${kraft.gold}25, transparent 80%)`,
                  filter: 'blur(15px)',
                  opacity: 0,
                }}
              />
            </div>

            {/* ─── z2: LETTER ─── */}
            <div
              ref={letterRef}
              className="absolute"
              style={{
                left: 18, right: 18, top: 15,
                height: 170,
                transformOrigin: 'center bottom',
                zIndex: 2,
              }}
            >
              <div
                ref={letterPaperRef}
                className="w-full h-full rounded-sm relative overflow-hidden"
                style={{
                  background: `linear-gradient(to bottom, ${kraft.paper}, ${kraft.paperEdge})`,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                  filter: 'brightness(0.88)',
                }}
              >
                {/* Fold crease lines */}
                <div
                  ref={crease1Ref}
                  className="absolute top-[33%] left-3 right-3"
                  style={{ background: `${kraft.bodyDark}18`, height: 1.5, opacity: 0.7 }}
                />
                <div
                  ref={crease2Ref}
                  className="absolute top-[66%] left-3 right-3"
                  style={{ background: `${kraft.bodyDark}10`, height: 1, opacity: 0.45 }}
                />
                {/* Fold shadow */}
                <div
                  ref={foldShadowRef}
                  className="absolute top-[33%] left-2 right-2 h-[4px]"
                  style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.04), transparent)', opacity: 0.6 }}
                />

                {/* Content preview */}
                <div className="flex flex-col items-center justify-center h-full">
                  <div
                    ref={heartRef}
                    className="text-3xl mb-2"
                    style={{ color: kraft.sealRed, opacity: 0.55 }}
                  >
                    <Beer className="w-8 h-8 fill-current mb-2" />
                  </div>
                  <span
                    ref={letterTextRef}
                    className="text-[10px] tracking-[0.3em] uppercase font-serif"
                    style={{ color: kraft.bodyDark, opacity: 0.35 }}
                  >
                    {letterContent.envelopePreviewTitle}
                  </span>
                </div>

                {/* Paper texture overlay */}
                <div className="absolute inset-0 opacity-10 mix-blend-multiply" style={{ backgroundImage: paperNoiseSvg }} />

                {/* Subtle edge highlight when risen */}
                <div
                  ref={edgeHighlightRef}
                  className="absolute inset-0 rounded-sm pointer-events-none"
                  style={{ boxShadow: 'inset 0 0 0 0px transparent' }}
                />
              </div>
            </div>

            {/* ─── z3: FRONT PANEL ─── */}
            <div
              className="absolute bottom-0 left-0 right-0 rounded-b-md"
              style={{
                height: '60%',
                zIndex: 3,
                background: `linear-gradient(0deg, ${kraft.bodyDark} 0%, ${kraft.body} 60%, ${kraft.bodyLight} 100%)`,
                boxShadow: `inset 0 1px 0 ${kraft.bodyLight}50`,
              }}
            >
              <div className="absolute inset-0 rounded-b-md opacity-[0.18] mix-blend-multiply" style={{ backgroundImage: paperNoiseSvg }} />
              <div className="absolute top-0 left-[10%] right-[10%] h-px" style={{ background: `linear-gradient(to right, transparent, ${kraft.shadow}20, transparent)` }} />
              <div className="absolute top-0 left-0 right-0 h-[4px]" style={{ background: `linear-gradient(to bottom, ${kraft.shadow}35, transparent)` }} />
              <div className="absolute top-0 left-0 w-[30%] h-[40%]" style={{ background: `linear-gradient(135deg, ${kraft.bodyDark}15, transparent 60%)` }} />
              <div className="absolute top-0 right-0 w-[30%] h-[40%]" style={{ background: `linear-gradient(-135deg, ${kraft.bodyDark}15, transparent 60%)` }} />
            </div>

            {/* ─── z4: TOP FLAP ─── */}
            <div
              ref={flapRef}
              className="absolute left-0 right-0"
              style={{
                top: 0,
                height: '52%',
                transformOrigin: 'center top',
                transformStyle: 'preserve-3d',
                zIndex: 4,
              }}
            >
              {/* Front face */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, ${kraft.flap} 0%, ${kraft.body} 100%)`,
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  backfaceVisibility: 'hidden',
                }}
              >
                <div className="absolute inset-0 opacity-20 mix-blend-multiply" style={{ backgroundImage: paperNoiseSvg, clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
                <div className="absolute bottom-[5%] left-[20%] right-[20%] h-px" style={{ background: `linear-gradient(to right, transparent, ${kraft.shadow}40, transparent)` }} />
                <div className="absolute top-[30%] left-[5%] w-[45%] h-px rotate-[25deg]" style={{ background: `${kraft.shadow}10` }} />
                <div className="absolute top-[30%] right-[5%] w-[45%] h-px -rotate-[25deg]" style={{ background: `${kraft.shadow}10` }} />
              </div>

              {/* Back face */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(0deg, ${kraft.flapInner} 0%, ${kraft.liner} 100%)`,
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  transform: 'rotateX(180deg)',
                  backfaceVisibility: 'hidden',
                }}
              />

              {/* Flap shadow during peek */}
              <div
                ref={flapShadowRef}
                className="absolute bottom-[-2px] left-[12%] right-[12%] h-[8px]"
                style={{
                  background: `linear-gradient(to bottom, ${kraft.shadow}60, transparent)`,
                  filter: 'blur(3px)',
                  transformOrigin: 'center top',
                  opacity: 0, scaleY: 0,
                }}
              />
            </div>

            {/* ─── z5: WAX SEAL ─── */}
            <div
              ref={sealRef}
              className="absolute left-1/2 -translate-x-1/2"
              style={{ top: '45%', zIndex: 5 }}
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
                <Beer className="w-8 h-8 text-red-200/80 fill-current drop-shadow-sm" />
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    border: `2px solid ${kraft.sealDark}40`,
                    boxShadow: `inset 0 0 0 3px ${kraft.sealRed}60`,
                  }}
                />
                {/* Warm pulse glow */}
                <div
                  ref={sealGlowRef}
                  className="absolute inset-[-8px] rounded-full"
                  style={{ background: `radial-gradient(circle, ${kraft.warmGlow}20, transparent 70%)`, opacity: 0.5 }}
                />
                {/* Crack lines on seal */}
                {sealBroken && !flapTorn && (
                  <div style={{ opacity: 1 }}>
                    <div className="absolute top-1/2 left-0.5 right-0.5 h-[1.5px] bg-black/40 rotate-[12deg]" />
                    <div className="absolute top-[38%] left-1.5 right-2 h-[1px] bg-black/25 -rotate-[10deg]" />
                    <div className="absolute top-[60%] left-3 right-1 h-[1px] bg-black/[0.18] rotate-[5deg]" />
                  </div>
                )}
                {/* Seal debris particles */}
                {sealBroken && !flapTorn && (
                  <>
                    {Array.from({ length: 8 }, (_, i) => (
                      <SealDebris key={i} index={i} />
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Envelope shadow on desk surface */}
            <div
              ref={shadowRef}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-full"
              style={{
                zIndex: 0,
                width: 300, height: 16, opacity: 0.35,
                background: 'radial-gradient(ellipse, rgba(0,0,0,0.3), transparent 70%)',
                filter: 'blur(8px)',
              }}
            />
          </div>
        </div>
      </div>

      {/* ═══ FULL LETTER (Reading State) ═══ */}
      <div
        ref={readingRef}
        className="absolute inset-0 flex flex-col items-center justify-start overflow-y-auto no-scrollbar py-6 px-4 pb-28"
        style={{ zIndex: 100, display: 'none', opacity: 0 }}
      >
        <div
          ref={readingContentRef}
          className="w-full max-w-[380px]"
          style={{ opacity: 0 }}
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
            <div className="h-2" style={{ background: `linear-gradient(to right, ${kraft.gold}, #9B8EC6, ${kraft.warmGlow})` }} />
            <div className="absolute inset-0 opacity-[0.08] mix-blend-multiply pointer-events-none" style={{ backgroundImage: paperNoiseSvg }} />

            <div className="p-6 relative">
              <Quote className="absolute top-3 left-3 w-4 h-4" style={{ color: `${kraft.gold}40` }} />

              <div className="space-y-4 font-serif text-gray-700 leading-relaxed">
                <p className="font-bold text-[15px] text-gray-800">{letterContent.recipient}</p>

                {letterContent.paragraphs.map((paragraph, index) => (
                  <p key={`paragraph-${index}`} className="text-sm leading-relaxed">
                    {paragraph}
                  </p>
                ))}

                <p className="font-bold text-base italic" style={{ color: kraft.sealRed }}>
                  &ldquo;{letterContent.highlightQuote}&rdquo;
                </p>

                <div
                  className="relative py-3 px-4 rounded-r"
                  style={{ borderLeft: `2px solid ${kraft.gold}80`, background: `${kraft.gold}10` }}
                >
                  <Music className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8" style={{ color: `${kraft.gold}18` }} />
                  <p className="text-sm italic text-gray-600 leading-relaxed">
                    &ldquo;
                    {letterContent.songQuote.lines.map((line, index) => (
                      <React.Fragment key={`song-line-${index}`}>
                        {line}
                        {index < letterContent.songQuote.lines.length - 1 && <br />}
                      </React.Fragment>
                    ))}
                    &rdquo;
                  </p>
                  <span className="block text-[10px] tracking-widest text-gray-400 font-bold uppercase mt-2">
                    {letterContent.songQuote.source}
                  </span>
                </div>

                <div className="pt-4 text-right" style={{ borderTop: `1px solid ${kraft.gold}30` }}>
                  <p className="text-sm font-bold text-gray-800">{letterContent.signatureName}</p>
                  <p className="font-handwritten text-xl mt-1" style={{ color: kraft.gold }}>{letterContent.signatureDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          ref={nextButtonRef}
          onClick={onNext}
          className="mt-8 flex items-center gap-2 text-white font-bold text-sm tracking-wide px-8 py-3 rounded-full transition-all group"
          style={{
            background: '#6BA3D6',
            boxShadow: `0 10px 30px -10px rgba(232,196,138,0.5), 0 0 0 1px rgba(255,255,255,0.2) inset`,
            opacity: 0,
          }}
        >
          <span>{letterContent.nextButtonText}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* ═══ FLOWING LYRICS ═══ */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none z-50">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-dusk-dark to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-dusk-dark to-transparent z-10" />

        <div
          ref={lyricsRef}
          className="py-4 whitespace-nowrap"
          style={{ opacity: 0 }}
        >
          <div className="inline-flex animate-marquee">
            <span className="mx-8 text-sm text-lavender-mist/40 font-serif italic tracking-wide">
              {letterContent.marqueeLines[0]}
            </span>
            <span className="mx-8 text-sm text-mayday-blue/30"><Star className="w-3 h-3" /></span>
            <span className="mx-8 text-sm text-honey-glow/35 font-serif italic tracking-wide">
              {letterContent.marqueeLines[1]}
            </span>
            <span className="mx-8 text-sm text-blush-coral/30"><Music className="w-3 h-3" /></span>
            <span className="mx-8 text-sm text-lavender-mist/40 font-serif italic tracking-wide">
              {letterContent.marqueeLines[2]}
            </span>
            <span className="mx-8 text-sm text-mayday-blue/30"><Sparkles className="w-3 h-3" /></span>
          </div>
          <div className="inline-flex animate-marquee" aria-hidden="true">
            <span className="mx-8 text-sm text-lavender-mist/40 font-serif italic tracking-wide">
              {letterContent.marqueeLines[0]}
            </span>
            <span className="mx-8 text-sm text-mayday-blue/30"><Star className="w-3 h-3" /></span>
            <span className="mx-8 text-sm text-honey-glow/35 font-serif italic tracking-wide">
              {letterContent.marqueeLines[1]}
            </span>
            <span className="mx-8 text-sm text-blush-coral/30"><Music className="w-3 h-3" /></span>
            <span className="mx-8 text-sm text-lavender-mist/40 font-serif italic tracking-wide">
              {letterContent.marqueeLines[2]}
            </span>
            <span className="mx-8 text-sm text-mayday-blue/30"><Sparkles className="w-3 h-3" /></span>
          </div>
        </div>
      </div>
    </div>
  );
};
