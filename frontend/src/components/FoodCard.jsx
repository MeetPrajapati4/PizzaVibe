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
    { id: 'small', label: 'S', price: food.small_price || Math.round(food.price * 0.8) },
    { id: 'medium', label: 'M', price: food.price },
    { id: 'large', label: 'L', price: food.large_price || Math.round(food.price * 1.3) },
  ];

  const currentPrice = sizes.find(s => s.id === selectedSize)?.price || food.price;

  const handleAdd = (e) => {
    e.preventDefault();
    setIsAdding(true);
    addToCart({ ...food, price: currentPrice, size: selectedSize });
    toast.success(`${food.name} Added!`, { 
      style: { borderRadius: '1rem', background: '#000', color: '#fff', fontSize: '10px', fontWeight: '900' }
    });
    setTimeout(() => setIsAdding(false), 800);
  };

  const cat = {
    veg: { text: 'text-emerald-400', dot: 'bg-emerald-500' },
    'non-veg': { text: 'text-rose-400', dot: 'bg-rose-500' },
    premium: { text: 'text-amber-400', dot: 'bg-amber-500' },
  }[food.category] || { text: 'text-amber-400', dot: 'bg-amber-500' };

  return (
    <TiltContainer intensity={5} className="h-full">
      <motion.div 
        whileHover={{ y: -5 }}
        className="group flex flex-col h-full rounded-[2rem] bg-surface-100/40 border border-white/[0.03] backdrop-blur-2xl overflow-hidden transition-all duration-500 hover:border-brand-500/20"
      >
        {/* Compact Image Section */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img src={food.image} alt={food.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          
          {/* Top Details */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-black/40 backdrop-blur-md border border-white/5 ${cat.text}`}>
              {food.category}
            </span>
            <div className="flex gap-1">
               {food.isSpicy && <FiZap className="w-3 h-3 text-orange-500 fill-current" title="Spicy" />}
               <div className="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/5 flex items-center gap-1">
                 <FiStar className="w-2.5 h-2.5 text-amber-500 fill-current" />
                 <span className="text-[9px] font-black text-white">{food.rate || '4.5'}</span>
               </div>
            </div>
          </div>

          {/* Bottom Left Detail Overlay */}
          <div className="absolute bottom-3 left-3 flex gap-2">
             <div className="px-2 py-1 rounded-lg bg-white/5 backdrop-blur-md border border-white/5 text-[8px] font-black text-white/60">
                <FiClock className="inline mr-1" /> 15 MIN
             </div>
             <div className="px-2 py-1 rounded-lg bg-white/5 backdrop-blur-md border border-white/5 text-[8px] font-black text-white/60">
                240 KCAL
             </div>
          </div>
        </div>

        {/* Dense Content Section */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start gap-2 mb-2">
            <h3 className="text-sm font-display font-black text-white leading-tight">{food.name}</h3>
            <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/5">
              {sizes.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSize(s.id)}
                  className={`w-5 h-5 rounded-md text-[8px] font-black transition-all ${selectedSize === s.id ? 'bg-brand-500 text-white' : 'text-surface-500 hover:text-white'}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-surface-500 font-medium leading-relaxed line-clamp-2 mb-4">
            {food.description}
          </p>

          <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/5">
            <p className="text-base font-display font-black text-white">
              <span className="text-brand-500 text-[10px] mr-0.5">₹</span>{currentPrice}
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAdd}
              className="px-4 py-1.5 rounded-lg bg-brand-500 text-white text-[9px] font-black uppercase tracking-widest shadow-brand hover:bg-brand-600 transition-colors"
            >
              Add To Vibe
            </motion.button>
          </div>
        </div>
      </motion.div>
    </TiltContainer>
  );
};

export default React.memo(FoodCard);
