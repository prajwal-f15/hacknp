'use client';

import { useState, useEffect } from 'react';

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress from 0 to 100
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        // Increment progress with slight randomness for realistic effect
        const increment = Math.random() * 15 + 5;
        return Math.min(prev + increment, 100);
      });
    }, 150);

    // Minimum loading time of 2 seconds
    const timer = setTimeout(() => {
      setProgress(100);
      setFadeOut(true);
      // Remove preloader after fade out animation
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Logo with pulse animation */}
      <div className="mb-8 animate-pulse-slow">
        <img 
          src="/LOGO NOBGN.png" 
          alt="CareInsight Logo" 
          className="h-32 w-32 object-contain drop-shadow-2xl"
        />
      </div>

      {/* Title */}
      <div className="text-4xl md:text-5xl tracking-tight mb-12 animate-fade-in" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        <span className="text-[#4169E1] font-bold">CARE</span>
        <span className="text-[#DC4C64] font-normal">INSIGHT</span>
      </div>

      {/* Loading progress bar */}
      <div className="w-64 mb-3">
        <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#4169E1] to-[#DC4C64] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Progress percentage */}
      <p className="text-slate-300 text-sm font-semibold mb-4">
        {Math.round(progress)}%
      </p>

      {/* Loading text */}
      <p className="text-slate-400 text-sm animate-pulse">
        Loading your health dashboard...
      </p>

      {/* Animated dots */}
      <div className="flex gap-2 mt-4">
        <div className="w-2 h-2 bg-[#4169E1] rounded-full animate-bounce-delay-0"></div>
        <div className="w-2 h-2 bg-[#DC4C64] rounded-full animate-bounce-delay-1"></div>
        <div className="w-2 h-2 bg-[#4169E1] rounded-full animate-bounce-delay-2"></div>
      </div>
    </div>
  );
}
