import React from 'react';
import { FiLoader } from 'react-icons/fi';

export const VibeLoader = ({ fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-surface-200 border-t-brand-500 rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-brand-500/10 rounded-full animate-pulse flex items-center justify-center text-brand-500">
            <FiLoader className="animate-spin" />
          </div>
        </div>
      </div>
      <p className="text-xs font-black uppercase tracking-[0.3em] text-brand-500 animate-pulse">Loading Vibe...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-surface-50/80 backdrop-blur-md flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export const PizzaSpinner = () => (
  <div className="relative w-20 h-20">
    <div className="absolute inset-0 border-8 border-brand-500/10 rounded-full" />
    <div className="absolute inset-0 border-8 border-transparent border-t-brand-500 rounded-full animate-spin" />
    <div className="absolute inset-0 flex items-center justify-center text-3xl animate-bounce">
      🍕
    </div>
  </div>
);

const UIComponents = {
  VibeLoader,
  PizzaSpinner
};

export default UIComponents;
