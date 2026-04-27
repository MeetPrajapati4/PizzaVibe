import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiZap, FiTruck, FiSmile, FiMapPin, FiCloud } from 'react-icons/fi';
import { getLocalWeather, getChefTip } from '../externalApi.js';

const Home = () => {
  const [weather, setWeather] = useState(null);
  const [tip, setTip] = useState('');

  useEffect(() => {
    const loadExtras = async () => {
      const weatherData = await getLocalWeather();
      const tipData = await getChefTip();
      setWeather(weatherData);
      setTip(tipData);
    };
    loadExtras();
  }, []);

  return (
    <div className="pt-32 pb-20 overflow-hidden">
      {/* Dynamic Header Info */}
      <div className="container mx-auto px-6 mb-12 flex flex-wrap gap-4 items-center justify-center lg:justify-start animate-fade-in">
        {weather && (
          <div className="glass px-4 py-2 rounded-full flex items-center gap-2 border-brand-500/10">
            <FiMapPin className="text-brand-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-surface-400">{weather.city}</span>
            <span className="w-1 h-1 bg-surface-300 rounded-full" />
            <FiCloud className="text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-surface-900">{weather.temp}°C • {weather.desc}</span>
          </div>
        )}
        {tip && (
          <div className="glass px-4 py-2 rounded-full flex items-center gap-2 border-brand-500/10">
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-500 italic">PizzaVibe Tip: {tip}</span>
          </div>
        )}
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-6 relative">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-brand-500/10 blur-[120px] rounded-full -z-10" />
        
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/10 border border-brand-500/20 rounded-full">
              <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-500">Premium Pizza Delivery</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-display font-black leading-[0.9] tracking-tighter text-surface-900">
              CRAFTED <br />
              <span className="text-gradient">CRUSTS.</span> <br />
              PURE VIBE.
            </h1>

            <p className="text-xl text-surface-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              We've refined our craft to bring you the ultimate pizza experience. From hand-stretched dough to premium toppings, every bite is a vibe.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link to="/menu" className="btn-primary group !px-10">
                Order Your Vibe
                <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/menu" className="btn-secondary">
                View Gallery
              </Link>
            </div>

            <div className="pt-8 flex items-center justify-center lg:justify-start gap-12 border-t border-surface-200/50">
              <div>
                <p className="text-3xl font-black text-surface-900">100%</p>
                <p className="text-xs font-bold text-surface-500 uppercase tracking-widest">Handcrafted</p>
              </div>
              <div>
                <p className="text-3xl font-black text-surface-900">20k+</p>
                <p className="text-xs font-bold text-surface-500 uppercase tracking-widest">Orders Served</p>
              </div>
              <div>
                <p className="text-3xl font-black text-surface-900">30 Min</p>
                <p className="text-xs font-bold text-surface-500 uppercase tracking-widest">Express Ship</p>
              </div>
            </div>
          </div>

          <div className="flex-1 relative animate-fade-in delay-300">
            <div className="relative z-10 perspective-1000">
              <div className="rotate-3 hover:rotate-0 transition-all duration-700 hover:scale-105">
                <img 
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1200" 
                  alt="Premium PizzaVibe"
                  className="w-full h-[500px] object-cover rounded-[3rem] shadow-2xl"
                />
              </div>
              
              <div className="absolute -top-10 -left-10 glass p-6 rounded-3xl shadow-xl animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center text-white">
                    <FiZap />
                  </div>
                  <div>
                    <p className="text-sm font-black text-surface-900">Artisan Choice</p>
                    <p className="text-[10px] text-surface-500 font-bold uppercase">Fresh Daily</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 mt-40">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<FiZap className="w-6 h-6" />}
            title="Rapid Delivery"
            description="Our specialized logistics network ensures your pizza arrives piping hot within 30 minutes."
            color="bg-brand-500"
          />
          <FeatureCard 
            icon={<FiTruck className="w-6 h-6" />}
            title="Live Tracking"
            description="Watch your pizza's journey from our oven to your doorstep with our real-time tracker."
            color="bg-amber-500"
          />
          <FeatureCard 
            icon={<FiSmile className="w-6 h-6" />}
            title="Premium Taste"
            description="We use 100% real mozzarella and farm-fresh ingredients to guarantee an elite taste."
            color="bg-blue-500"
          />
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, color }) => (
  <div className="card p-10 hover:-translate-y-2 group transition-all duration-500">
    <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg mb-8 transition-transform group-hover:scale-110 group-hover:rotate-6`}>
      {icon}
    </div>
    <h3 className="text-2xl font-black text-surface-900 mb-4">{title}</h3>
    <p className="text-surface-600 font-medium leading-relaxed">
      {description}
    </p>
  </div>
);

export default Home;
