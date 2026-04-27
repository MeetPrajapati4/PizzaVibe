import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiMapPin, FiUser, FiCreditCard, FiCheckCircle, FiLoader, FiAlertCircle, FiArrowRight } from 'react-icons/fi';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/dominos';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, token } = useAuth();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form States
  const [address, setAddress] = useState('');
  const [nearbyStores, setNearbyStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  
  const [customerInfo, setCustomerInfo] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: ''
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    number: '',
    expiration: '',
    securityCode: '',
    postalCode: ''
  });
  
  const [orderSummary, setOrderSummary] = useState(null);
  const [finalOrderID, setFinalOrderID] = useState(null);

  useEffect(() => {
    if (cartItems.length === 0 && !finalOrderID) {
      navigate('/menu');
    }
  }, [cartItems, navigate, finalOrderID]);

  // Step 1: Find Stores
  const handleFindStores = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/stores`, { address });
      if (res.data.success) {
        setNearbyStores(res.data.stores);
        if (res.data.stores.length > 0) {
          setStep(2);
        } else {
          setError('No delivery kitchens found for this address. Please try another.');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to find stores');
    }
    setLoading(false);
  };

  // Step 2: Set Customer Info & Selected Store
  const handleNextToPricing = async () => {
    if (!customerInfo.phone || !selectedStore) {
      setError('Please provide a phone number and select a store.');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      // Use the actual product codes from the cart items
      const items = cartItems.map(item => ({
        code: item.code || '14SCREEN', 
        quantity: item.quantity,
        options: item.options || {}
      }));

      const res = await axios.post(`${API_URL}/validate`, {
        customerInfo: { ...customerInfo, address },
        storeID: selectedStore.StoreID,
        items: items
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setOrderSummary(res.data.amounts);
        setStep(3);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Order validation failed. Some items might be unavailable at this store.');
    }
    setLoading(false);
  };

  // Step 3: Place Order
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const items = cartItems.map(item => ({
        code: item.code || '14SCREEN',
        quantity: item.quantity,
        options: item.options || {}
      }));

      const res = await axios.post(`${API_URL}/place`, {
        customerInfo: { ...customerInfo, address },
        storeID: selectedStore.StoreID,
        items: items,
        paymentInfo
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setFinalOrderID(res.data.orderID);
        clearCart();
        setStep(4);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment processing failed');
    }
    setLoading(false);
  };

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-12">
          {[1, 2, 3, 4].map((i) => (
            <React.Fragment key={i}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all duration-500 ${step >= i ? 'bg-brand-500 text-white shadow-brand' : 'bg-surface-200 text-surface-400'}`}>
                {step > i ? <FiCheckCircle /> : i}
              </div>
              {i < 4 && <div className={`flex-grow h-1 mx-4 rounded-full transition-all duration-500 ${step > i ? 'bg-brand-500' : 'bg-surface-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 animate-fade-in">
            <FiAlertCircle />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        <div className="card p-8 md:p-12 bg-surface-100 shadow-premium">
          
          {step === 1 && (
            <div className="space-y-8 animate-fade-in">
              <div className="text-center">
                <h2 className="text-3xl font-black text-surface-900 uppercase tracking-tighter">Delivery Location</h2>
                <p className="text-surface-500 font-medium mt-2">Enter your address to find the nearest PizzaVibe kitchen.</p>
              </div>
              <form onSubmit={handleFindStores} className="space-y-6">
                <div className="relative">
                  <FiMapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-surface-400" />
                  <input 
                    type="text"
                    required
                    placeholder="e.g., 2 Portola Plaza, Monterey, CA"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="input-field pl-14"
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full group">
                  {loading ? <FiLoader className="animate-spin" /> : 'Find Nearby Kitchens'}
                  {!loading && <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />}
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-fade-in">
              <div className="text-center">
                <h2 className="text-3xl font-black text-surface-900 uppercase tracking-tighter">Select Kitchen & Contact</h2>
              </div>
              
              <div className="grid gap-4 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                {nearbyStores.map(store => (
                  <button
                    key={store.StoreID}
                    onClick={() => setSelectedStore(store)}
                    className={`w-full p-6 rounded-3xl border-2 text-left transition-all ${selectedStore?.StoreID === store.StoreID ? 'border-brand-500 bg-brand-500/5' : 'border-surface-200 bg-surface-100 hover:border-surface-300'}`}
                  >
                    <p className="font-black text-surface-900">Kitchen #{store.StoreID}</p>
                    <p className="text-sm text-surface-500 font-medium">{store.AddressLine1}</p>
                    <p className="text-xs text-brand-500 font-bold uppercase mt-2 tracking-widest">{store.MinDistance.toFixed(2)} Miles Away</p>
                  </button>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6 pt-4">
                <input 
                  type="text"
                  placeholder="First Name"
                  value={customerInfo.firstName}
                  onChange={(e) => setCustomerInfo({...customerInfo, firstName: e.target.value})}
                  className="input-field"
                />
                <input 
                  type="text"
                  placeholder="Last Name"
                  value={customerInfo.lastName}
                  onChange={(e) => setCustomerInfo({...customerInfo, lastName: e.target.value})}
                  className="input-field"
                />
                <input 
                  type="email"
                  placeholder="Email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                  className="input-field"
                />
                <input 
                  type="tel"
                  placeholder="Phone (e.g., 941-555-2368)"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  className="input-field"
                />
              </div>

              <button onClick={handleNextToPricing} disabled={loading} className="btn-primary w-full">
                {loading ? <FiLoader className="animate-spin" /> : 'Review Order Summary'}
              </button>
            </div>
          )}

          {step === 3 && orderSummary && (
            <div className="space-y-8 animate-fade-in">
              <div className="text-center">
                <h2 className="text-3xl font-black text-surface-900 uppercase tracking-tighter">Payment & Final Review</h2>
              </div>

              <div className="bg-surface-50 p-8 rounded-[2rem] border border-surface-200">
                <div className="space-y-3">
                  <div className="flex justify-between text-surface-500 font-bold uppercase tracking-widest text-xs">
                    <span>Subtotal</span>
                    <span>₹{orderSummary.foodAndBeverage}</span>
                  </div>
                  <div className="flex justify-between text-surface-500 font-bold uppercase tracking-widest text-xs">
                    <span>Tax</span>
                    <span>₹{orderSummary.tax}</span>
                  </div>
                  <div className="h-[1px] bg-surface-200 my-4" />
                  <div className="flex justify-between text-2xl font-black text-surface-900">
                    <span>Total Amount</span>
                    <span className="text-brand-500">₹{orderSummary.customer}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div 
                  className="p-6 rounded-3xl border-2 border-brand-500 bg-brand-500/5 flex items-center justify-between group cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-500/10 rounded-2xl flex items-center justify-center text-brand-500">
                      <FiCreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-black text-surface-900 uppercase tracking-tighter">Cash on Delivery</p>
                      <p className="text-xs text-surface-500 font-bold">Pay when your artisan pizza arrives.</p>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full border-4 border-brand-500 bg-brand-500 shadow-brand" />
                </div>

                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3">
                  <FiAlertCircle className="text-amber-600 mt-1" />
                  <p className="text-[10px] font-bold text-amber-700 leading-relaxed uppercase tracking-wider">
                    UPI and Online payments will be enabled soon. For now, we only accept Cash on Delivery for maximum safety and trust.
                  </p>
                </div>

                <button 
                  onClick={handlePlaceOrder} 
                  disabled={loading} 
                  className="btn-primary w-full !py-4 group shadow-brand"
                >
                  {loading ? <FiLoader className="animate-spin" /> : `Confirm Order (₹${orderSummary.customer})`}
                  {!loading && <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center space-y-8 animate-fade-in py-10">
              <div className="w-24 h-24 bg-brand-500/10 rounded-full flex items-center justify-center text-brand-500 mx-auto text-5xl">
                <FiCheckCircle />
              </div>
              <div>
                <h2 className="text-4xl font-black text-surface-900 uppercase tracking-tighter">Order Placed!</h2>
                <p className="text-surface-500 font-medium mt-2">Your PizzaVibe order is being prepared.</p>
              </div>
              <div className="bg-surface-50 p-6 rounded-3xl inline-block border border-surface-200">
                <p className="text-xs font-black uppercase tracking-widest text-surface-400 mb-1">Order ID</p>
                <p className="text-xl font-black text-brand-500">{finalOrderID}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <button onClick={() => navigate('/orders')} className="btn-primary">View My Orders</button>
                <button onClick={() => navigate('/menu')} className="btn-secondary">Keep Ordering</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Checkout;
