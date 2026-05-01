import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

const PreLoader = () => {
  const [loading, setLoading] = useState(true);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setPercentage((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false); // Immediate hide
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5; // Faster loading
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!loading) {
      // Fast exit animation
      gsap.to(".preloader-bg", {
        yPercent: -100,
        duration: 0.8,
        ease: "power4.inOut",
        stagger: 0.05
      });
    }
  }, [loading]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div 
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-surface-50 overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Animated Background Panels */}
          <div className="preloader-bg absolute inset-0 bg-brand-500 z-10" />
          <div className="preloader-bg absolute inset-0 bg-surface-50 z-20" />

          {/* Circular Loader & Logo Container */}
          <div className="relative z-30 flex flex-col items-center justify-center">
            {/* SVG Circular Progress */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                {/* Background Circle */}
                <circle
                  cx="50%"
                  cy="50%"
                  r="48%"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-white/5"
                />
                {/* Animated Progress Circle */}
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r="48%"
                  fill="none"
                  stroke="url(#loaderGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: percentage / 100 }}
                  transition={{ ease: "easeOut", duration: 0.2 }}
                />
                <defs>
                  <linearGradient id="loaderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ff4d4f" />
                    <stop offset="100%" stopColor="#ff9c6e" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Logo in Center */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0, rotateY: 180 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                transition={{ 
                  duration: 1.5, 
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="relative z-40"
              >
                {/* Logo Glow Aura */}
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3] 
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-brand-500 blur-[60px] rounded-full -z-10"
                />
                
                <motion.img 
                  src="/Favicon.PNG" 
                  alt="PizzaVibe Logo"
                  className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-[0_0_30px_rgba(255,77,79,0.3)]"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                />
              </motion.div>
            </div>

            {/* Info Text */}
            <div className="mt-8 text-center space-y-2">
              <div className="flex flex-col items-center gap-1">
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[10px] font-black uppercase tracking-[0.6em] text-brand-500"
                >
                  Initializing Vibe
                </motion.p>
                <div className="flex items-center gap-4">
                  <div className="h-[1px] w-8 bg-white/10" />
                  <span className="text-sm font-display font-black text-white/60 tracking-widest">{percentage}%</span>
                  <div className="h-[1px] w-8 bg-white/10" />
                </div>
              </div>
            </div>
          </div>

          {/* Artistic Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 blur-[120px] rounded-full z-20" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PreLoader;
