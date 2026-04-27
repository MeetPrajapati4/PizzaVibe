import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { FiPlus, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';

const FoodCard = ({ food }) => {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);

  const handleAdd = () => {
    addToCart(food);
    toast.success(`${food.name} added to cart!`, {
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
  };

  if (imageError) return null;

  return (
    <div className="card group flex flex-col h-full animate-fade-in">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-200/50">
        <img 
          src={food.image} 
          alt={food.name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* India-Specific Badges (Veg/Non-Veg) */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {food.badges?.map((badge, idx) => (
            <span 
              key={idx}
              className={`badge flex items-center gap-2 ${
                badge === 'Veg' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                badge === 'Non-Veg' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 
                'glass text-surface-900 border-surface-200/50'
              }`}
            >
              {(badge === 'Veg' || badge === 'Non-Veg') && (
                <span className={`w-2 h-2 rounded-full ${badge === 'Veg' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
              )}
              {badge}
            </span>
          ))}
        </div>

        {/* Category Overlay */}
        <div className="absolute bottom-4 left-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-white/70 drop-shadow-md">
            {food.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-black text-surface-900 group-hover:text-brand-500 transition-colors">
            {food.name}
          </h3>
          <div className="flex items-center gap-1 text-amber-500">
            <FiStar className="fill-current w-3 h-3" />
            <span className="text-xs font-black">4.9</span>
          </div>
        </div>

        <p className="text-sm text-surface-500 font-medium leading-relaxed mb-8 flex-grow">
          {food.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-6 border-t border-surface-200/50">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Price</span>
            <span className="text-2xl font-black text-surface-900">
              <span className="text-brand-500 text-sm mr-0.5">₹</span>
              {food.price}
            </span>
          </div>

          <button 
            onClick={handleAdd}
            className="w-12 h-12 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl flex items-center justify-center shadow-brand transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <FiPlus className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(FoodCard);
