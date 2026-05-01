import React from 'react';

const Confetti = () => {
  const pieces = Array.from({ length: 50 });
  const colors = ['#ff4d4f', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa'];

  return (
    <div className="confetti-container">
      {pieces.map((_, i) => (
        <div 
          key={i}
          className="confetti"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            animationDelay: `${Math.random() * 2}s`,
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
