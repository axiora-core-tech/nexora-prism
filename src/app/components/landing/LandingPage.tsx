import { Navbar }         from './Navbar';
import { HeroSection }    from './HeroSection';
import { FeatureSection } from './FeatureSection';
import { JourneySection } from './JourneySection';
import { CTASection }     from './CTASection';
import { Footer }         from './Footer';
import { CustomCursor }   from './CustomCursor';
import { Loader }         from './Loader';
import { useState }       from 'react';
import { AnimatePresence } from 'motion/react';

export function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="min-h-screen bg-[#010101] text-zinc-100 selection:bg-indigo-500/30 selection:text-white overflow-x-clip w-full font-sans antialiased">
      {/* Cinematic noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[9998] opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.95%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')",
        }}
      />

      {/* Designer grid overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9997] flex justify-center opacity-[0.03]">
        <div className="w-full h-full grid grid-cols-4 md:grid-cols-12 gap-4 px-6 md:px-12 lg:px-24">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-full border-l border-white hidden md:block" />
          ))}
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={`mob-${i}`} className="h-full border-l border-white md:hidden" />
          ))}
        </div>
      </div>

      {/* Vignette */}
      <div className="fixed inset-0 pointer-events-none z-[9996] bg-[radial-gradient(circle_at_center,transparent_40%,rgba(1,1,1,0.8)_120%)]" />

      {/* Custom cursor */}
      <CustomCursor />

      {/* Cinematic intro loader — shown every visit */}
      <AnimatePresence>
        {isLoading && <Loader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {/* Navbar */}
      <Navbar />

      {/* Page sections */}
      <main className="relative z-10 flex flex-col w-full">
        <HeroSection />
        <FeatureSection />
        <JourneySection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
