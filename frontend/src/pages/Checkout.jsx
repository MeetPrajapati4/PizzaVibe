import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiMapPin, FiPhone, FiCheckCircle, FiLoader, FiAlertCircle, FiArrowRight, FiCreditCard } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

import Confetti from '../components/Confetti';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, token } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle'); // idle, success, failed
  const [finalOrderID, setFinalOrderID] = useState(null);
  
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    paymentMethod: 'cod'
  });

  useEffect(() => {
    if (cartItems.length === 0 && status === 'idle') {
      navigate('/menu');
    }
  }, [cartItems, navigate, status]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post('http://localhost:5001/api/orders', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data) {
        setFinalOrderID(res.data.id);
        clearCart();
        setStatus('success');
        toast.success('Vibe Order Confirmed!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please check your connection.');
      setStatus('failed');
      toast.error('Order Failed');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="pt-32 pb-20 min-h-screen flex items-center justify-center overflow-hidden">
        <Confetti />
        <div className="container mx-auto px-6 max-w-2xl text-center space-y-10 animate-scale-up">
          <div className="relative inline-block">
            <div className="absolute -inset-4 bg-brand-500/20 blur-3xl rounded-full animate-pulse-soft" />
            <div className="w-28 h-28 bg-brand-500 text-white rounded-[2rem] flex items-center justify-center text-5xl shadow-brand relative animate-bounce">
              <FiCheckCircle />
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-5xl font-black text-surface-900 uppercase tracking-tighter animate-slide-up stagger-1">ORDER SUCCESSFUL!</h2>
            <p className="text-surface-500 font-medium text-lg animate-slide-up stagger-2">Your artisan masterpiece is in the oven and will arrive fresh.</p>
          </div>

          <div className="bg-surface-100 p-10 rounded-[3rem] border border-surface-200 shadow-premium inline-block animate-slide-up stagger-3">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-400 mb-4">Vibe Order Reference</p>
            <p className="text-3xl font-black text-brand-500">#PV-{finalOrderID?.toString().padStart(6, '0').toUpperCase()}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-slide-up stagger-4">
            <button onClick={() => navigate('/orders')} className="btn-primary !px-12">Track My Vibe</button>
            <button onClick={() => navigate('/menu')} className="btn-secondary !px-12">Keep Exploring</button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="pt-32 pb-20 min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-6 max-w-2xl text-center space-y-8 animate-scale-up">
          <div className="w-24 h-24 bg-rose-500/10 text-rose-500 rounded-[2rem] flex items-center justify-center text-5xl mx-auto">
            <FiAlertCircle />
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-surface-900 uppercase tracking-tighter">ORDER FAILED</h2>
            <p className="text-surface-500 font-medium max-w-md mx-auto">{error}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <button onClick={() => setStatus('idle')} className="btn-primary !bg-rose-500 hover:!bg-rose-600">Try Again</button>
            <button onClick={() => navigate('/menu')} className="btn-secondary">Return to Menu</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 min-h-screen bg-surface-50">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left: Checkout Form */}
          <div className="flex-grow space-y-8 animate-slide-up">
            <div>
              <h1 className="text-4xl font-display font-black text-surface-900 uppercase tracking-tighter">Secure <span className="text-gradient">Checkout</span></h1>
              <p className="text-surface-500 font-medium mt-2">Complete your details to finish your order.</p>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500">
                <FiAlertCircle />
                <p className="text-sm font-bold">{error}</p>
              </div>
            )}

            <form onSubmit={handlePlaceOrder} className="space-y-10">
              {/* Delivery Section */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-500">
                    <FiMapPin />
                  </div>
                  <h3 className="text-lg font-black text-surface-900 uppercase tracking-tight">Delivery Address</h3>
                </div>
                
                <div className="grid gap-4">
                  <input 
                    name="street"
                    required
                    placeholder="Street Address"
                    value={formData.street}
                    onChange={handleChange}
                    className="input-field"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      name="city"
                      required
                      placeholder="City"
                      value={formData.city}
                      onChange={handleChange}
                      className="input-field"
                    />
                    <input 
                      name="state"
                      required
                      placeholder="State"
                      value={formData.state}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      name="zipCode"
                      required
                      placeholder="Zip Code"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="input-field"
                    />
                    <div className="relative">
                      <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
                      <input 
                        name="phone"
                        required
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input-field pl-12"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Payment Section */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-500">
                    <FiCreditCard />
                  </div>
                  <h3 className="text-lg font-black text-surface-900 uppercase tracking-tight">Payment Method</h3>
                </div>

                <div className="grid gap-4">
                  <label className="relative flex items-center justify-between p-6 rounded-3xl border-2 border-brand-500 bg-brand-500/5 cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center text-brand-500 text-xl font-black">
                        ₹
                      </div>
                      <div>
                        <p className="font-black text-surface-900 uppercase tracking-tighter">Cash on Delivery</p>
                        <p className="text-xs text-surface-500 font-bold">Pay ₹{cartTotal.toFixed(2)} at your door.</p>
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-full border-4 border-brand-500 bg-brand-500 shadow-brand" />
                  </label>
                  
                  <div className="p-4 bg-surface-100 rounded-2xl flex items-center gap-3 border border-surface-200">
                    <FiAlertCircle className="text-surface-400" />
                    <p className="text-[10px] font-bold text-surface-500 uppercase tracking-wider">
                      Digital payments (UPI/Card) are currently under maintenance.
                    </p>
                  </div>
                </div>
              </section>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full !py-5 group shadow-brand"
              >
                {loading ? <FiLoader className="animate-spin" /> : `Complete Order (₹${cartTotal.toFixed(2)})`}
                {!loading && <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />}
              </button>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div className="w-full lg:w-[380px] animate-fade-in">
            <div className="card p-8 sticky top-32">
              <h3 className="text-xl font-black text-surface-900 uppercase tracking-tighter mb-8 pb-4 border-b border-surface-200/50">Order Summary</h3>
              
              <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-grow py-1">
                      <p className="text-[11px] font-black text-surface-900 leading-tight uppercase">{item.name}</p>
                      <p className="text-[10px] font-bold text-surface-400 mt-1 uppercase tracking-widest">{item.size} • Qty: {item.quantity}</p>
                      <p className="text-xs font-black text-brand-500 mt-1">₹{parseFloat(item.price).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-surface-200/50">
                <div className="flex justify-between text-xs font-bold text-surface-500 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-surface-500 uppercase tracking-widest">
                  <span>Delivery</span>
                  <span className="text-green-500">FREE</span>
                </div>
                <div className="h-[1px] bg-surface-200/50 my-4" />
                <div className="flex justify-between items-end">
                  <span className="text-xs font-black text-surface-400 uppercase tracking-widest mb-1">Total Amount</span>
                  <span className="text-3xl font-black text-surface-900">
                    <span className="text-brand-500 text-sm mr-1">₹</span>
                    {cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
