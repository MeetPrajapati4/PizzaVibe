import React, { useState, useEffect } from 'react';

const CursorGlow = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className="fixed pointer-events-none z-[9999] transition-opacity duration-500"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Primary Glow */}
      <div className="w-[400px] h-[400px] bg-brand-500/5 blur-[100px] rounded-full animate-pulse-soft" />
      
      {/* Sharp Center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-brand-500 rounded-full shadow-[0_0_20px_rgba(255,77,79,0.8)] opacity-20" />
    </div>
  );
};

export default CursorGlow;
