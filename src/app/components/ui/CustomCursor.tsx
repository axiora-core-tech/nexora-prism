import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverText, setHoverText] = useState("");

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if we're hovering over something clickable or significant
      const isClickable = window.getComputedStyle(target).cursor === 'pointer' || 
                          target.tagName.toLowerCase() === 'button' ||
                          target.tagName.toLowerCase() === 'a' ||
                          target.closest('button') || 
                          target.closest('a');
      
      setIsHovering(!!isClickable);

      // Extract optional text for the cursor
      const dataCursor = target.getAttribute('data-cursor') || target.closest('[data-cursor]')?.getAttribute('data-cursor');
      if (dataCursor) {
        setHoverText(dataCursor);
      } else {
        setHoverText("");
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
      setHoverText("");
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, [mouseX, mouseY, isVisible]);

  // Hide on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[100] flex items-center justify-center"
      style={{
        x: cursorX,
        y: cursorY,
        opacity: isVisible ? 1 : 0,
        translateX: '-50%',
        translateY: '-50%'
      }}
    >
      {/* Outer Ring */}
      <motion.div
        animate={{
          width: isHovering ? (hoverText ? 80 : 48) : 24,
          height: isHovering ? (hoverText ? 80 : 48) : 24,
          backgroundColor: isHovering ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0)',
          borderColor: isHovering ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.5)',
          backdropFilter: isHovering ? 'blur(4px)' : 'blur(0px)',
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="absolute rounded-full border border-white/50 flex items-center justify-center mix-blend-difference"
      >
        <motion.span 
          animate={{ opacity: hoverText ? 1 : 0, scale: hoverText ? 1 : 0.5 }}
          className="text-[10px] font-mono uppercase tracking-widest text-white whitespace-nowrap"
        >
          {hoverText}
        </motion.span>
      </motion.div>

      {/* Center Dot */}
      <motion.div
        animate={{
          scale: isHovering && !hoverText ? 0 : 1,
          opacity: isHovering && hoverText ? 0 : 1
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="w-1.5 h-1.5 bg-white rounded-full mix-blend-difference"
      />
    </motion.div>
  );
}
