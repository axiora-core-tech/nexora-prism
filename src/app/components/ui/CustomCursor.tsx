import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export function CustomCursor() {
  const [isVisible, setIsVisible]   = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverText, setHoverText]   = useState('');

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const ringX = useSpring(mouseX, { damping: 28, stiffness: 150, mass: 0.6 });
  const ringY = useSpring(mouseY, { damping: 28, stiffness: 150, mass: 0.6 });

  const dotX = useSpring(mouseX, { damping: 30, stiffness: 500, mass: 0.2 });
  const dotY = useSpring(mouseY, { damping: 30, stiffness: 500, mass: 0.2 });

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
        !!t.closest('a') ||
        window.getComputedStyle(t).cursor === 'pointer';
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

  const ringSize = hoverText ? 72 : 44;

  return (
    <>
      {/* Ring — only visible on clickables */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full mix-blend-[var(--p-cursor-blend)] flex items-center justify-center"
        style={{
          x: ringX, y: ringY,
          translateX: '-50%', translateY: '-50%',
          border: '1px solid',
        }}
        animate={{
          width:           isHovering ? ringSize : 0,
          height:          isHovering ? ringSize : 0,
          opacity:         isHovering ? 1 : 0,
          borderColor:     'rgba(255,255,255,0.3)',
          backgroundColor: isHovering ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0)',
        }}
        transition={{
          width:   { type: 'spring', stiffness: 260, damping: 24 },
          height:  { type: 'spring', stiffness: 260, damping: 24 },
          opacity: { duration: 0.15 },
          backgroundColor: { duration: 0.15 },
        }}
      >
        <motion.span
          animate={{ opacity: hoverText ? 1 : 0, scale: hoverText ? 1 : 0.6 }}
          transition={{ duration: 0.12 }}
          className="absolute inset-0 flex items-center justify-center text-[10px] font-mono uppercase tracking-widest text-white whitespace-nowrap"
        >
          {hoverText}
        </motion.span>
      </motion.div>

      {/* Breathing dot — always present */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full mix-blend-[var(--p-cursor-blend)] bg-white"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%', width: 6, height: 6 }}
        animate={{
          scale:   (isHovering && hoverText) ? 0 : [1, 1.9, 1],
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          scale:   { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
          opacity: { duration: 0.15 },
        }}
      />
    </>
  );
}
