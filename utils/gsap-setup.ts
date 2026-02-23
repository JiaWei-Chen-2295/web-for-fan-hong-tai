import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// Keep exporting gsap, ScrollTrigger and re-export useGSAP hook for components
export { gsap, ScrollTrigger, useGSAP };

export const gsapSprings = {
  flapPeek:       { duration: 1.2, ease: 'elastic.out(0.4, 0.4)' },
  flapSwing:      { duration: 1.5, ease: 'elastic.out(0.3, 0.35)' },
  letterPeek:     { duration: 0.6, ease: 'back.out(1.5)' },
  letterFriction: { duration: 1.2, ease: 'power4.out' },
  letterFloat:    { duration: 1.8, ease: 'elastic.out(0.5, 0.3)' },
  reveal:         { duration: 1.0, ease: 'back.out(1.2)' },
  seal:           { duration: 0.5, ease: 'elastic.out(1, 0.4)' },
  button:         { duration: 0.3, ease: 'back.out(2)' },
} as const;