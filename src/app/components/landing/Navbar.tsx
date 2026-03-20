import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { useState } from "react";
import { Menu, X, Hexagon } from "lucide-react";
import { NavLink } from "react-router";

export function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > 150 && latest > (previous ?? 0)) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <>
      <motion.nav
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: "-100%", opacity: 0 },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center py-6 pointer-events-none mix-blend-difference"
      >
        <div className="w-full px-6 md:px-12 lg:px-24 flex items-center justify-between pointer-events-auto">
          {/* Logo / Brand */}
          <div className="flex items-center gap-4 text-white font-bold tracking-tighter text-2xl group cursor-pointer">
            <Hexagon className="w-6 h-6 text-white group-hover:text-indigo-400 transition-colors" />
            <span className="tracking-[0.2em] text-sm uppercase">
              PRISM
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-[10px] font-mono tracking-[0.2em] uppercase text-zinc-300">
            {["Intelligence", "Forecasting", "Feedback", "Platform"].map((item) => (
              <button
                key={item}
                className="hover:text-white transition-all duration-300 flex flex-col items-center gap-1 group"
              >
                {item}
                <div className="w-1 h-1 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>

          {/* CTA / Action */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink
              to="/sign-in"
              className="text-[10px] font-mono tracking-[0.2em] uppercase text-zinc-300 hover:text-white transition-colors"
            >
              Sign In
            </NavLink>
            <NavLink
              to="/demo"
              className="px-6 py-3 border border-white/30 text-[10px] font-mono tracking-[0.2em] uppercase text-white hover:bg-white hover:text-black transition-colors"
            >
              Request Demo
            </NavLink>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden p-2 text-white pointer-events-auto"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center border-x border-white/10 mx-4"
        >
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-8 right-8 p-2 text-white"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="flex flex-col items-center gap-12 text-[10px] font-mono uppercase tracking-[0.3em]">
            {["Intelligence", "Forecasting", "Feedback", "Platform"].map((item, i) => (
              <motion.button 
                key={item}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setIsMenuOpen(false)}
                className="text-zinc-400 hover:text-white transition-colors text-2xl"
              >
                {item}
              </motion.button>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <NavLink
                to="/demo"
                onClick={() => setIsMenuOpen(false)}
                className="mt-12 px-12 py-5 border border-white/30 text-white hover:bg-white hover:text-black transition-colors block text-[10px] font-mono tracking-[0.2em] uppercase"
              >
                Request Demo
              </NavLink>
            </motion.div>
          </div>
        </motion.div>
      )}
    </>
  );
}
