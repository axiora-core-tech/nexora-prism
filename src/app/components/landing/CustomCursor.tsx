import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 30, stiffness: 400, mass: 0.1 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // We only want custom cursor on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.body.style.cursor = 'none';
    
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 4); // Offset half the default 8px cursor size
      cursorY.set(e.clientY - 4);
      if (!isVisible) setIsVisible(true);
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'button' || 
        target.tagName.toLowerCase() === 'a' || 
        target.closest('button') || 
        target.closest('a')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnter);
    
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      document.body.style.cursor = 'auto';
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-2 h-2 pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center"
      style={{ x: cursorXSpring, y: cursorYSpring }}
    >
      <motion.div 
        className="w-full h-full bg-white rounded-full"
        animate={{ 
          scale: isHovered ? 4 : 1,
          opacity: isHovered ? 0 : 1 
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
      {/* Hollow ring that appears on hover */}
      <motion.div 
        className="absolute inset-0 border border-white rounded-full"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ 
          scale: isHovered ? 6 : 0.5,
          opacity: isHovered ? 1 : 0 
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
    </motion.div>
  );
}