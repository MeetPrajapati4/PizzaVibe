import React, { useState } from 'react';

const TiltContainer = ({ children, className = "", intensity = 10 }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation based on cursor position relative to center
    // rotateX is affected by Y movement, rotateY is affected by X movement
    const rotateX = ((centerY - y) / centerY) * intensity;
    const rotateY = ((x - centerX) / centerX) * intensity;
    
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div 
      className={`perspective-1000 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ isolation: 'isolate' }}
    >
      <div 
        className="transition-transform duration-300 ease-out preserve-3d h-full w-full"
        style={{ 
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default TiltContainer;
