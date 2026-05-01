import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { FiPlus, FiStar, FiShoppingBag, FiZap } from 'react-icons/fi';
import toast from 'react-hot-toast';
import TiltContainer from './TiltContainer';
import { motion, AnimatePresence } from 'framer-motion';

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

  const handleAdd = (e) => {
    e.preventDefault();
    setIsAdding(true);
    addToCart({ ...food, price: currentPrice, size: selectedSize });
    
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-slide-up' : 'animate-fade-out'} bg-black/90 backdrop-blur-xl border border-white/10 p-4 rounded-[1.5rem] shadow-2xl flex items-center gap-4 min-w-[280px]`}>
        <div className="w-12 h-12 bg-brand-500 rounded-xl flex items-center justify-center text-white">
          <FiZap className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase text-brand-500 tracking-widest leading-none mb-1">Added to Order</p>
          <p className="text-sm font-display font-black text-white">{food.name}</p>
        </div>
      </div>
    ), { duration: 2000, position: 'bottom-right' });
    
    setTimeout(() => setIsAdding(false), 800);
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
    <TiltContainer intensity={8} className="h-full rounded-[2.5rem] relative z-0 hover:z-20 transition-all duration-300">
      <motion.div 
        whileHover={{ y: -8 }}
        className="group flex flex-col h-full rounded-[2.5rem] bg-surface-100/40 border border-white/[0.03] backdrop-blur-2xl overflow-hidden transition-all duration-700 hover:border-brand-500/30 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]"
      >
        {/* Image Section */}
        <div className="relative aspect-[16/11] overflow-hidden bg-surface-200/20">
          <motion.img 
            src={pizzaImage} 
            alt={food.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.12] group-hover:rotate-2"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Floating Category */}
          <div className="absolute top-5 left-5 z-20">
            <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md border ${cat.bg} ${cat.text} ${cat.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor] ${cat.dot}`} />
              {food.category}
            </span>
          </div>

          {/* Rating */}
          <div className="absolute top-5 right-5 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/5">
            <FiStar className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-[10px] font-black text-white">{rating}</span>
          </div>

          {/* Price Glass Tag */}
          <div className="absolute bottom-5 left-5 z-20">
            <motion.div 
              initial={{ x: -10, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              className="px-4 py-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
            >
              <p className="text-xl font-display font-black text-white leading-none">
                <span className="text-brand-500 text-xs mr-0.5">₹</span>
                {currentPrice}
              </p>
            </motion.div>
          </div>

          {/* Quick Add Visual Pop */}
          <AnimatePresence>
            {isAdding && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                exit={{ scale: 2, opacity: 0 }}
                className="absolute inset-0 z-30 flex items-center justify-center bg-brand-500/20 backdrop-blur-sm pointer-events-none"
              >
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl">
                   <FiShoppingBag className="w-10 h-10 text-brand-500 animate-bounce" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content Section */}
        <div className="p-7 flex flex-col flex-grow relative">
          {/* Subtle Glow inside content */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-brand-500/5 blur-[50px] pointer-events-none" />

          <div className="flex items-start justify-between gap-4 mb-4">
            <h3 className="text-xl font-display font-black text-white tracking-tight leading-tight group-hover:text-brand-500 transition-colors duration-500">
              {food.name}
            </h3>
            
            {/* Minimal Size Selector */}
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
              {sizes.map((s) => (
                <button
                  key={s.id}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedSize(s.id);
                  }}
                  className={`w-8 h-8 rounded-xl text-[10px] font-black transition-all duration-300 ${
                    selectedSize === s.id 
                    ? 'bg-brand-500 text-white shadow-brand' 
                    : 'text-surface-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-[12px] text-surface-500 font-medium leading-relaxed line-clamp-2 flex-grow mb-6 opacity-80 group-hover:opacity-100 transition-opacity">
            {food.description || "Indulge in our artisan pizza crafted with the finest ingredients and a touch of Vibe magic."}
          </p>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-6 border-t border-white/5">
             <div className="flex items-center gap-3">
                <FiZap className="text-brand-500 w-4 h-4 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-surface-400">Elite Flavor</span>
             </div>
             
             <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleAdd}
              className="group/btn relative px-6 py-3 rounded-2xl overflow-hidden transition-all duration-500"
            >
              <div className="absolute inset-0 bg-brand-500 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
              <div className="absolute inset-0 border border-brand-500/30 group-hover/btn:border-transparent transition-colors" />
              <span className="relative z-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-500 group-hover/btn:text-white transition-colors">
                <FiShoppingBag className="w-3.5 h-3.5" />
                Add To Cart
              </span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </TiltContainer>
  );
};

export default React.memo(FoodCard);
