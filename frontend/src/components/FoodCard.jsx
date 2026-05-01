import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { FiPlus, FiStar, FiShoppingBag } from 'react-icons/fi';
import toast from 'react-hot-toast';
import TiltContainer from './TiltContainer';

const FoodCard = ({ food }) => {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedSize, setSelectedSize] = useState('medium');

  // Size Configuration
  const sizes = [
    { id: 'small', label: 'S', price: food.small_price && food.small_price > 0 ? food.small_price : Math.round(food.price * 0.8) },
    { id: 'medium', label: 'M', price: food.price },
    { id: 'large', label: 'L', price: food.large_price && food.large_price > 0 ? food.large_price : Math.round(food.price * 1.3) },
  ];

  const currentSizeObj = sizes.find(s => s.id === selectedSize) || sizes[1];
  const currentPrice = currentSizeObj.price;

  const handleAdd = () => {
    setIsAdding(true);
    addToCart({ ...food, price: currentPrice, size: selectedSize });
    toast.success(`${food.name} (${selectedSize.toUpperCase()}) added!`, {
      style: {
        borderRadius: '1rem',
        background: '#18181b',
        color: '#e4e4e7',
        border: '1px solid #27272a',
      },
      iconTheme: {
        primary: '#ff4d4f',
        secondary: '#fff',
      },
    });
    setTimeout(() => setIsAdding(false), 600);
  };

  const pizzaImage = imageError 
    ? "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800" 
    : food.image;

  const categoryConfig = {
    veg: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-500', border: 'border-emerald-500/20' },
    'non-veg': { bg: 'bg-rose-500/15', text: 'text-rose-400', dot: 'bg-rose-500', border: 'border-rose-500/20' },
    premium: { bg: 'bg-amber-500/15', text: 'text-amber-400', dot: 'bg-amber-500', border: 'border-amber-500/20' },
  };

  const cat = categoryConfig[food.category] || categoryConfig.premium;
  const rating = Number(food.rate || food.averageRating || 4.5).toFixed(1);

  return (
    <TiltContainer intensity={6} className="h-full rounded-3xl relative z-0 hover:z-10 transition-[z-index] duration-0">
      <div 
        className="group flex flex-col h-full rounded-3xl bg-surface-100/60 border border-white/[0.04] backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-white/[0.08] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)]"
        style={{ transform: 'translateZ(0)' }}
      >
        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-surface-200/30 to-surface-100/10">
          <img 
            src={pizzaImage} 
            alt={food.name}
            onError={() => setImageError(true)}
            loading="lazy"
            className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.08]"
          />
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* Category Pill */}
          <div className="absolute top-4 left-4 z-20">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md border ${cat.bg} ${cat.text} ${cat.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${cat.dot}`} />
              {food.category}
            </span>
          </div>

          {/* Rating Chip */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
            <FiStar className="w-3 h-3 text-amber-400 fill-current" />
            <span className="text-[10px] font-black text-white">{rating}</span>
          </div>

          {/* Quick Add Overlay */}
          <button
            onClick={handleAdd}
            aria-label={`Add ${food.name} to cart`}
            className="absolute bottom-4 right-4 z-20 w-12 h-12 bg-brand-500 text-white rounded-2xl flex items-center justify-center shadow-[0_8px_24px_rgba(255,77,79,0.35)] opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 hover:bg-brand-600 hover:scale-110 active:scale-95"
          >
            <FiPlus className={`w-5 h-5 transition-transform duration-300 ${isAdding ? 'rotate-[360deg]' : ''}`} />
          </button>

          {/* Price Tag on Image */}
          <div className="absolute bottom-4 left-4 z-20">
            <div className="px-4 py-2 rounded-xl bg-black/50 backdrop-blur-md border border-white/10">
              <span className="text-lg font-display font-black text-white">
                <span className="text-brand-500 text-xs mr-0.5">₹</span>
                {currentPrice}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-base font-display font-black text-white tracking-tight leading-snug group-hover:text-brand-400 transition-colors duration-300">
              {food.name}
            </h3>
            
            {/* Size Selector */}
            <div className="flex bg-black/20 p-1 rounded-xl border border-white/5">
              {sizes.map((s) => (
                <button
                  key={s.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(s.id);
                  }}
                  className={`w-7 h-7 rounded-lg text-[10px] font-black transition-all ${
                    selectedSize === s.id 
                    ? 'bg-brand-500 text-white shadow-lg' 
                    : 'text-surface-500 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-surface-500 font-medium leading-relaxed line-clamp-2 flex-grow mb-4">
            {food.description}
          </p>

          {/* Bottom Action Row */}
          <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
            <div className="flex items-center gap-2">
              {food.badges?.filter(Boolean).map((badge, i) => (
                <span 
                  key={i} 
                  className="px-2.5 py-1 rounded-lg bg-white/[0.04] text-[8px] font-black uppercase tracking-widest text-surface-500 border border-white/[0.04]"
                >
                  {badge}
                </span>
              ))}
            </div>
            
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500/10 text-brand-500 text-[10px] font-black uppercase tracking-widest border border-brand-500/20 hover:bg-brand-500 hover:text-white transition-all duration-300 active:scale-95"
            >
              <FiShoppingBag className="w-3 h-3" />
              Add
            </button>
          </div>
        </div>
      </div>
    </TiltContainer>
  );
};

export default React.memo(FoodCard);
