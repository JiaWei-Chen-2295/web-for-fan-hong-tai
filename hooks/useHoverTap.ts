import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';

/**
 * Replaces Framer Motion's whileHover / whileTap declarative props.
 *
 * Attaches pointer event listeners and tweens via GSAP.
 * Automatically restores original values on pointer leave.
 */
export function useHoverTap(
  ref: RefObject<HTMLElement | null>,
  hoverProps: gsap.TweenVars = {},
  tapProps: gsap.TweenVars = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tweenDefaults: gsap.TweenVars = { duration: 0.25, ease: 'power2.out', overwrite: 'auto' };

    // Capture original values for all properties we'll animate
    const allKeys = new Set([...Object.keys(hoverProps), ...Object.keys(tapProps)]);
    const original: Record<string, any> = {};
    allKeys.forEach(key => {
      original[key] = gsap.getProperty(el, key);
    });

    let isHovering = false;

    const onEnter = () => {
      isHovering = true;
      gsap.to(el, { ...tweenDefaults, ...hoverProps });
    };

    const onLeave = () => {
      isHovering = false;
      gsap.to(el, { ...tweenDefaults, ...original });
    };

    const onDown = () => {
      if (Object.keys(tapProps).length > 0) {
        gsap.to(el, { ...tweenDefaults, duration: 0.1, ...tapProps });
      }
    };

    const onUp = () => {
      if (isHovering) {
        gsap.to(el, { ...tweenDefaults, ...hoverProps });
      } else {
        gsap.to(el, { ...tweenDefaults, ...original });
      }
    };

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointerup', onUp);

    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointerup', onUp);
    };
  }, [ref, hoverProps, tapProps]);
}
