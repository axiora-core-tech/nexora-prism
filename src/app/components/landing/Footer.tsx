import { motion } from "motion/react";
import { ArrowUpRight, Hexagon } from "lucide-react";

export function Footer() {
  const links = ["Twitter", "LinkedIn", "Customer Stories", "Help Center"];

  return (
    <footer className="relative w-full bg-[#010101] overflow-hidden border-t border-white/10 pt-32 pb-12">
      <div className="w-full px-6 md:px-12 lg:px-24 flex flex-col md:flex-row justify-between items-start mb-32 gap-16 relative z-10">
        
        {/* Brand / Mission */}
        <div className="flex flex-col gap-8 w-full max-w-md">
          <div className="flex items-center gap-3">
            <Hexagon className="w-8 h-8 text-white" />
            <span className="text-xl font-light tracking-[0.35em] text-white uppercase">Prism</span>
          </div>
          <p className="text-lg text-zinc-400 font-light leading-relaxed">
            Every person on your team contains more than their job title. Prism helps you see the whole picture — and act on it.
          </p>
          <div className="flex items-center gap-4 mt-4">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-zinc-300 uppercase">SYS.PRISM.CORE // Online</span>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 sm:gap-24 w-full md:w-auto">
          <div className="flex flex-col gap-6">
            <span className="text-zinc-500 uppercase tracking-[0.2em] text-[10px] font-mono mb-2">Platform</span>
            {["Intelligence", "Forecasting", "Feedback", "Security"].map((item) => (
              <a href="#" key={item} className="text-zinc-300 hover:text-white transition-colors flex items-center gap-2 group text-sm">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500">&gt;</span>
                {item}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-6">
            <span className="text-zinc-500 uppercase tracking-[0.2em] text-[10px] font-mono mb-2">Company</span>
            {links.map((link) => (
              <a href="#" key={link} className="text-zinc-300 hover:text-white transition-colors flex items-center gap-2 group text-sm">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500">&gt;</span>
                {link}
                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-6">
            <span className="text-zinc-500 uppercase tracking-[0.2em] text-[10px] font-mono mb-2">Legal</span>
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <a href="#" key={item} className="text-zinc-300 hover:text-white transition-colors flex items-center gap-2 group text-sm">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500">&gt;</span>
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Massive Typography Footer */}
      <div className="relative w-full flex justify-center mb-16 select-none overflow-hidden mix-blend-difference pointer-events-none">
        <motion.h1 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-[18vw] font-bold tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-900"
        >
          PRISM
        </motion.h1>
      </div>

      <div className="w-full px-6 md:px-12 lg:px-24 flex flex-col sm:flex-row items-center justify-between text-[10px] text-zinc-500 tracking-[0.2em] font-mono uppercase border-t border-white/20 pt-8 relative z-10">
        <p>IDENTIFIER: PRISM.HR.2026.V2.0</p>
        <p className="mt-4 sm:mt-0">© 2026 PRISM INC. ALL RIGHTS RESERVED.</p>
      </div>
    </footer>
  );
}
