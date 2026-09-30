import React, { useState, useEffect, useRef } from 'react';

/**
 * Automatically load all background images placed inside src/assets/backgrounds/
 * Supports .jpg, .jpeg, .png, .webp, and .svg
 */
const imageModules = import.meta.glob('/src/assets/backgrounds/*.{jpg,jpeg,png,webp,svg}', { eager: true });
const BG_IMAGES = Object.values(imageModules).map((mod) => (typeof mod === 'string' ? mod : mod.default || mod));

export function BackgroundSlideshow({ children }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const totalImages = BG_IMAGES.length;

  // Preload all slideshow images on mount
  useEffect(() => {
    if (totalImages > 0) {
      BG_IMAGES.forEach((src) => {
        if (src) {
          const img = new Image();
          img.src = src;
        }
      });
    }
  }, [totalImages]);

  // Infinite continuous slideshow advancing every 6 seconds (pauses on hover)
  useEffect(() => {
    if (totalImages <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalImages);
    }, 6000);

    return () => clearInterval(timerRef.current);
  }, [totalImages, isPaused]);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-[#050b1e] select-none"
    >
      {/* 1. Background Images with Infinite Cross-Fade Carousel & Ken Burns Zoom */}
      {totalImages > 0 ? (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {BG_IMAGES.map((imgSrc, idx) => (
            <img
              key={idx}
              src={imgSrc}
              alt={`Portal Architecture Slide ${idx + 1}`}
              loading={idx === 0 ? 'eager' : 'lazy'}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out transform ${
                idx === currentIndex
                  ? 'opacity-100 scale-105 filter brightness-90 saturate-110'
                  : 'opacity-0 scale-100 pointer-events-none'
              }`}
            />
          ))}
        </div>
      ) : null}

      {/* 2. Multi-stop Deep Navy-to-Amethyst Vignette Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#060e28]/92 via-[#0a1538]/85 to-[#050b1e]/95 pointer-events-none" />

      {/* 3. Ambient Saffron & Emerald Radial Glow Accents for National Character */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-saffron/20 blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-indiagreen/20 blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-navy-500/10 blur-[120px] pointer-events-none" />

      {/* 4. Subtle High-Tech Geometric Grid Texture */}
      <div
        className="absolute inset-0 z-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* 5. Foreground Content */}
      <div className="relative z-10 w-full flex flex-col min-h-screen">
        {children}
      </div>

      {/* 6. Active Dot Indicators & Progress Bar (Bottom-Left) */}
      {totalImages > 1 && (
        <div className="absolute bottom-5 left-6 z-20 hidden sm:flex items-center space-x-2.5 bg-slate-950/70 backdrop-blur-xl px-3.5 py-1.5 rounded-full border border-white/20 shadow-2xl">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mr-1">
            Slide {currentIndex + 1}/{totalImages}
          </span>
          {BG_IMAGES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-7 bg-gradient-to-r from-saffron to-amber-400 shadow-[0_0_8px_rgba(255,153,51,0.8)]'
                  : 'w-2 bg-white/30 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default BackgroundSlideshow;
