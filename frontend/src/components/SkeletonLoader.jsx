import React from 'react';

export const Skeleton = ({ className, variant = 'rect' }) => {
  const baseClasses = "bg-surface-200 animate-pulse-soft animate-shimmer relative overflow-hidden";
  const variantClasses = {
    rect: "rounded-2xl",
    circle: "rounded-full",
    text: "rounded-lg h-4 w-full"
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />
  );
};

export const FoodCardSkeleton = () => (
  <div className="rounded-3xl bg-surface-100/60 border border-white/[0.04] overflow-hidden">
    <Skeleton className="w-full aspect-[4/3]" />
    <div className="p-5 space-y-3">
      <Skeleton variant="text" className="w-3/4 h-5" />
      <Skeleton variant="text" className="w-full h-3" />
      <Skeleton variant="text" className="w-2/3 h-3" />
      <div className="flex justify-between items-center pt-3 border-t border-white/[0.04]">
        <div className="flex gap-2">
          <Skeleton className="w-12 h-5 rounded-lg" />
          <Skeleton className="w-16 h-5 rounded-lg" />
        </div>
        <Skeleton className="w-16 h-8 rounded-xl" />
      </div>
    </div>
  </div>
);

export const OrderRowSkeleton = () => (
  <div className="flex items-center gap-4 p-4 border-b border-surface-200">
    <Skeleton variant="circle" className="w-12 h-12" />
    <div className="flex-grow space-y-2">
      <Skeleton variant="text" className="w-1/3" />
      <Skeleton variant="text" className="w-1/4" />
    </div>
    <Skeleton className="w-20 h-8 rounded-full" />
  </div>
);

const SkeletonLoader = {
  Skeleton,
  FoodCardSkeleton,
  OrderRowSkeleton
};

export default SkeletonLoader;
