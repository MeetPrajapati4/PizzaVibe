import React, { useState, useEffect, useCallback } from 'react';
import { FiSearch, FiTruck, FiClock, FiMapPin, FiLoader, FiCheckCircle, FiZap } from 'react-icons/fi';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/dominos';

const Tracking = () => {
  const [phone, setPhone] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTracking = useCallback(async (phoneNumber) => {
    if (!phoneNumber) return;
    try {
      const res = await axios.get(`${API_URL}/track/${phoneNumber}`);
      if (res.data.success && res.data.tracking) {
        // The dominos API returns an array or object depending on active orders
        const trackInfo = Array.isArray(res.data.tracking) ? res.data.tracking[0] : res.data.tracking;
        setTrackingData(trackInfo);
        return trackInfo;
      }
    } catch (err) {
      if (!trackingData) {
        setError(err.response?.data?.message || 'No active orders found for this number.');
      }
    }
    return null;
  }, [trackingData]);

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const data = await fetchTracking(phone);
    if (!data && !error) {
       setError('No active orders found for this number.');
    }
    setLoading(false);
  };

  // Real-time polling
  useEffect(() => {
    let interval;
    if (trackingData && trackingData.OrderStatus !== 'Delivered') {
      interval = setInterval(() => {
        fetchTracking(phone);
      }, 10000); // Poll every 10 seconds
    }
    return () => clearInterval(interval);
  }, [trackingData, phone, fetchTracking]);

  const statusStages = [
    { name: 'Preparation', icon: <FiClock />, key: 'Preparation' },
    { name: 'Baking', icon: <FiZap className="text-amber-500" />, key: 'Baking' },
    { name: 'Quality Check', icon: <FiCheckCircle className="text-emerald-500" />, key: 'Quality' },
    { name: 'Out for Delivery', icon: <FiTruck className="text-blue-500" />, key: 'Delivery' },
  ];

  const getActiveStageIndex = () => {
    if (!trackingData) return -1;
    const status = (trackingData.OrderStatus || trackingData.status || '').toLowerCase();
    
    if (status.includes('delivered')) return 4;
    if (status.includes('delivery') || status.includes('route')) return 3;
    if (status.includes('quality')) return 2;
    if (status.includes('bake') || status.includes('oven')) return 1;
    if (status.includes('prep')) return 0;
    
    return 0; // Default to first stage if tracking data exists
  };

  const activeStageIndex = getActiveStageIndex();

  return (
    <div className="pt-32 pb-20 min-h-screen bg-surface-50">
      <div className="container mx-auto px-6 max-w-2xl">
        
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-5xl font-display font-black tracking-tighter text-surface-900 uppercase">
            Live <span className="text-brand-500">Tracker</span>
          </h1>
          <p className="text-surface-500 font-medium mt-4">Follow your pizza's journey from our oven to your doorstep.</p>
        </div>

        {/* Search Box */}
        <div className="card p-8 mb-12 bg-white shadow-premium">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <input 
                type="tel" 
                placeholder="Enter Phone Number (e.g., 9415552368)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="input-field pl-6 pr-12"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary sm:w-40 flex items-center justify-center gap-2">
              {loading ? <FiLoader className="animate-spin" /> : <><FiSearch /> Track</>}
            </button>
          </form>
          {error && <p className="mt-4 text-red-500 text-xs font-bold uppercase tracking-widest">{error}</p>}
        </div>

        {/* Results */}
        {trackingData && (
          <div className="space-y-8 animate-fade-in">
            {/* Visual Progress */}
            <div className="card p-10 bg-white shadow-premium relative overflow-hidden">
               <div className="absolute top-0 left-0 w-2 h-full bg-brand-500" />
               
               <div className="flex flex-col gap-12">
                 {statusStages.map((stage, idx) => {
                   const isActive = idx === activeStageIndex;
                   const isCompleted = idx < activeStageIndex;
                   
                   return (
                     <div key={idx} className="flex items-start gap-6 group">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg transition-all duration-500 
                          ${isActive ? 'bg-brand-500 text-white scale-110' : 
                            isCompleted ? 'bg-emerald-500 text-white' : 'bg-surface-100 text-surface-400'}`}>
                          {isCompleted ? <FiCheckCircle /> : stage.icon}
                        </div>
                        <div className="pt-1">
                          <h3 className={`text-lg font-black uppercase tracking-tighter ${isActive || isCompleted ? 'text-surface-900' : 'text-surface-400'}`}>
                            {stage.name}
                          </h3>
                          {isActive && <p className="text-sm font-medium text-brand-500 mt-1">
                            {idx === 0 && "Our chefs are handcrafting your pizza..."}
                            {idx === 1 && "It's getting nice and crispy in the oven!"}
                            {idx === 2 && "Final quality check for perfection..."}
                            {idx === 3 && "Your driver is on the way!"}
                          </p>}
                        </div>
                     </div>
                   );
                 })}
               </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4">
               <div className="card p-6 bg-white shadow-sm flex flex-col items-center text-center">
                  <FiClock className="text-brand-500 mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-surface-400">Est. Time</p>
                  <p className="text-xl font-black text-surface-900">
                    {trackingData.EstimatedWaitMinutes || trackingData.wait || '25'} Mins
                  </p>
               </div>
               <div className="card p-6 bg-white shadow-sm flex flex-col items-center text-center">
                  <FiMapPin className="text-blue-500 mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-surface-400">Driver</p>
                  <p className="text-xl font-black text-surface-900">
                    {trackingData.DriverName || (activeStageIndex >= 3 ? 'On Route' : 'Pending')}
                  </p>
               </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Tracking;

