import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="pt-40 pb-20 container mx-auto px-6 text-center">
        <div className="w-24 h-24 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-8 text-surface-400">
          <FiShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-4xl font-display font-black text-surface-900 mb-4">Your cart is empty</h2>
        <p className="text-surface-500 font-medium mb-12">Looks like you haven't added any vibes to your cart yet.</p>
        <Link to="/menu" className="btn-primary">
          Explore Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 container mx-auto px-6">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items List */}
        <div className="flex-grow space-y-8">
          <div className="flex items-center justify-between border-b border-surface-200/50 pb-8">
            <h1 className="text-4xl font-display font-black text-surface-900">YOUR <span className="text-gradient">CART</span></h1>
            <button 
              onClick={clearCart}
              className="text-xs font-black uppercase tracking-widest text-surface-400 hover:text-brand-500 transition-colors"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="card p-6 flex flex-col sm:flex-row items-center gap-6 group">
                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="text-xl font-black text-surface-900 mb-1">{item.name}</h3>
                  <p className="text-sm text-surface-500 font-medium">{item.category}</p>
                </div>

                <div className="flex items-center gap-4 bg-surface-200/50 p-2 rounded-2xl border border-surface-200/50">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-8 h-8 flex items-center justify-center text-surface-500 hover:text-brand-500 transition-colors"
                  >
                    <FiMinus />
                  </button>
                  <span className="w-8 text-center font-black text-surface-900">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-8 h-8 flex items-center justify-center text-surface-500 hover:text-brand-500 transition-colors"
                  >
                    <FiPlus />
                  </button>
                </div>

                <div className="text-xl font-black text-surface-900 sm:w-24 text-right">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>

                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="p-3 text-surface-400 hover:text-brand-500 hover:bg-brand-500/10 rounded-xl transition-all"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>

          <Link to="/menu" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-surface-500 hover:text-brand-500 transition-colors">
            <FiArrowLeft />
            Continue Browsing
          </Link>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:w-[400px] shrink-0">
          <div className="card p-10 sticky top-32">
            <h2 className="text-2xl font-black text-surface-900 mb-8 pb-8 border-b border-surface-200/50">Order Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-surface-500 font-bold uppercase tracking-widest text-[10px]">
                <span>Subtotal</span>
                <span className="text-surface-900 text-sm">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-surface-500 font-bold uppercase tracking-widest text-[10px]">
                <span>Delivery</span>
                <span className="text-green-500 text-sm font-black">FREE</span>
              </div>
              <div className="flex justify-between text-surface-500 font-bold uppercase tracking-widest text-[10px]">
                <span>Taxes</span>
                <span className="text-surface-900 text-sm">₹{(cartTotal * 0.05).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-10 pt-8 border-t border-surface-200/50">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Total Amount</span>
                <span className="text-4xl font-black text-surface-900">
                  <span className="text-brand-500 text-xl mr-1">₹</span>
                  {(cartTotal * 1.05).toFixed(2)}
                </span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="btn-primary w-full !py-5 shadow-2xl"
            >
              Proceed to Checkout
            </button>
            
            <p className="text-center mt-6 text-[10px] text-surface-400 font-bold uppercase tracking-widest">
              Safe & Secure Checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
