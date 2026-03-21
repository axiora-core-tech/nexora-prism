import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import React, { useEffect, useState } from "react";

export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 700, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Use a ref to track visibility in the event handler without capturing stale state.
  // This means setIsVisible(true) is only ever called once (on first move), not on
  // every single mousemove event — preventing a React re-render at 60+ fps.
  const isVisibleRef = React.useRef(false);

  useEffect(() => {
    document.body.style.cursor = 'none';

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        !!target.closest('button') ||
        !!target.closest('a');
      setIsHovered(isInteractive);
    };

    const handleMouseLeave = () => { isVisibleRef.current = false; setIsVisible(false); };
    const handleMouseEnter = () => { isVisibleRef.current = true;  setIsVisible(true);  };

    window.addEventListener('mousemove', moveCursor, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      document.body.style.cursor = 'auto';
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursorX, cursorY]); // isVisible intentionally removed — tracked via ref

  const backgroundX = useSpring(useTransform(cursorX, x => x - 192 + 16), { damping: 40, stiffness: 200 });
  const backgroundY = useSpring(useTransform(cursorY, y => y - 192 + 16), { damping: 40, stiffness: 200 });

  if (!isVisible) return null;

  return (
    <>
      {/* Interactive Cursor Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center"
        style={{ x: cursorXSpring, y: cursorYSpring }}
        animate={{ 
          scale: isHovered ? 2.5 : 1, 
          backgroundColor: isHovered ? "rgba(99, 102, 241, 1)" : "rgba(99, 102, 241, 0)",
          borderColor: isHovered ? "rgba(99, 102, 241, 0)" : "rgba(129, 140, 248, 0.8)",
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        <motion.div 
          className="w-1.5 h-1.5 bg-white rounded-full"
          animate={{ 
            opacity: isHovered ? 0 : 1,
            scale: isHovered ? 0 : 1
          }}
        />
      </motion.div>

      {/* Subtle background tracking glow for extra vividness */}
      <motion.div
        className="fixed top-0 left-0 w-96 h-96 rounded-full pointer-events-none z-0 mix-blend-screen"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, rgba(0,0,0,0) 70%)",
          x: backgroundX,
          y: backgroundY
        }}
      />
    </>
  );
}
