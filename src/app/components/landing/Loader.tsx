import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

export function Loader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isExploding, setIsExploding] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    const duration = 2000;
    const interval = 20;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setProgress(Math.min((currentStep / steps) * 100, 100));
      if (currentStep >= steps) {
        clearInterval(timer);
        setIsExploding(true);
        setTimeout(() => {
          document.body.style.overflow = '';
          onComplete();
        }, 1200);
      }
    }, interval);

    return () => {
      clearInterval(timer);
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#010101] overflow-hidden"
      animate={{
        backgroundColor: isExploding ? "rgba(1,1,1,0)" : "rgba(1,1,1,1)"
      }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      {/* Vivid Exploding Ring */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-indigo-500/30 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 shadow-[0_0_100px_rgba(99,102,241,0.5)] z-0 mix-blend-screen"
        initial={{ width: "10vw", height: "10vw", opacity: 0 }}
        animate={isExploding ? {
          width: "150vw",
          height: "150vw",
          opacity: [0.8, 0],
          borderWidth: "0px"
        } : {
          width: "20vw",
          height: "20vw",
          opacity: 1,
        }}
        transition={{ duration: isExploding ? 1.2 : 2, ease: "easeInOut" }}
      />

      {/* Loader Content */}
      <AnimatePresence>
        {!isExploding && (
          <motion.div 
            className="relative z-10 flex flex-col items-center"
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-6xl md:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-rose-400 mb-6 font-mono drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]">
              {Math.round(progress)}%
            </div>
            
            <div className="w-64 h-[2px] bg-white/10 overflow-hidden relative">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-400 to-rose-400 shadow-[0_0_15px_rgba(225,29,72,0.8)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="mt-8 text-[10px] font-mono tracking-[0.3em] uppercase text-zinc-300 flex items-center gap-3 bg-black/50 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
              <div className="w-2 h-2 bg-indigo-500 animate-[ping_1s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full" />
              Calibrating Core
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
