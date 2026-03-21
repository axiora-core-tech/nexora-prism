import { motion, useMotionValue, useSpring } from "motion/react";
import React, { useEffect, useState, useRef } from "react";

export function CustomCursor() {
  const [isVisible, setIsVisible]   = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverText, setHoverText]   = useState('');

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Ring lags softly
  const ringX = useSpring(mouseX, { damping: 26, stiffness: 120, mass: 0.8 });
  const ringY = useSpring(mouseY, { damping: 26, stiffness: 120, mass: 0.8 });

  // Dot snaps precisely
  const dotX = useSpring(mouseX, { damping: 28, stiffness: 480, mass: 0.2 });
  const dotY = useSpring(mouseY, { damping: 28, stiffness: 480, mass: 0.2 });

  const isVisibleRef = useRef(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisibleRef.current) { isVisibleRef.current = true; setIsVisible(true); }
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const clickable =
        t.tagName.toLowerCase() === 'button' ||
        t.tagName.toLowerCase() === 'a' ||
        !!t.closest('button') ||
        !!t.closest('a');
      setIsHovering(!!clickable);
      const dc = t.getAttribute('data-cursor') ||
        (t.closest('[data-cursor]') as HTMLElement | null)?.getAttribute('data-cursor') || '';
      setHoverText(dc);
    };
    const leave = () => { isVisibleRef.current = false; setIsVisible(false); };
    const enter = () => { isVisibleRef.current = true;  setIsVisible(true);  };

    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mouseover', over, { passive: true });
    document.body.addEventListener('mouseleave', leave);
    document.body.addEventListener('mouseenter', enter);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
      document.body.removeEventListener('mouseleave', leave);
      document.body.removeEventListener('mouseenter', enter);
    };
  }, [mouseX, mouseY]);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null;

  const ringSize = isHovering ? (hoverText ? 76 : 48) : 34;

  return (
    <>
      {/* Static ring — no scale animation */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full flex items-center justify-center mix-blend-difference"
        style={{
          x: ringX, y: ringY,
          translateX: '-50%', translateY: '-50%',
          opacity: isVisible ? 1 : 0,
          border: '1px solid',
        }}
        animate={{
          width:  ringSize,
          height: ringSize,
          borderColor:     isHovering ? 'rgba(129,140,248,0.35)' : 'rgba(255,255,255,0.35)',
          backgroundColor: isHovering ? 'rgba(99,102,241,0.10)' : 'rgba(255,255,255,0)',
        }}
        transition={{
          width:  { type: 'spring', stiffness: 200, damping: 20 },
          height: { type: 'spring', stiffness: 200, damping: 20 },
          borderColor:     { duration: 0.25 },
          backgroundColor: { duration: 0.25 },
        }}
      >
        <motion.span
          animate={{ opacity: hoverText ? 1 : 0, scale: hoverText ? 1 : 0.5 }}
          transition={{ duration: 0.15 }}
          className="text-[10px] font-mono uppercase tracking-widest text-white whitespace-nowrap"
        >
          {hoverText}
        </motion.span>
      </motion.div>

      {/* Breathing dot — pulses continuously */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full mix-blend-difference bg-white"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%', width: 6, height: 6 }}
        animate={{
          scale:   (isHovering && hoverText) ? 0 : [1, 2.0, 1],
          opacity: (isHovering && hoverText) ? 0 : (isVisible ? 1 : 0),
        }}
        transition={{
          scale: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' },
          opacity: { duration: 0.15 },
        }}
      />
    </>
  );
}
