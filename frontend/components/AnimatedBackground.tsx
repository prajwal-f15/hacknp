'use client';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-glow" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-glow" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-glow" style={{ animationDelay: '2s' }} />
      
      {/* Floating particles */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-float opacity-40" />
      <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-purple-400 rounded-full animate-float opacity-40" style={{ animationDelay: '1.5s' }} />
      <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-cyan-400 rounded-full animate-float opacity-40" style={{ animationDelay: '3s' }} />
      <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-blue-300 rounded-full animate-float opacity-40" style={{ animationDelay: '2.5s' }} />
    </div>
  );
}
