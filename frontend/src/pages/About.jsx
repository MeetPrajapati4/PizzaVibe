import React from 'react';
import { FiUsers, FiAward, FiHeart, FiCheck } from 'react-icons/fi';

const About = () => {
  return (
    <div className="pt-32 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="container mx-auto px-6 mb-24">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/10 border border-brand-500/20 rounded-full">
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-500">Our Story</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-display font-black leading-[0.9] tracking-tighter text-surface-900">
              WE DON'T JUST BAKE PIZZAS. <br />
              <span className="text-gradient">WE CRAFT VIBES.</span>
            </h1>
            <p className="text-xl text-surface-600 leading-relaxed font-medium">
              PizzaVibe started with a simple idea: that pizza should be more than just a quick meal. It should be an experience that lingers. Founded in 2026, we've combined traditional Italian techniques with modern culinary "vibes" to create something truly unique.
            </p>
          </div>
          <div className="flex-1 relative">
             <div className="absolute -inset-4 bg-brand-500/20 blur-3xl rounded-full -z-10 animate-pulse" />
             <img 
               src="https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=800&q=80" 
               alt="Chef Crafting Pizza" 
               className="w-full h-[500px] object-cover rounded-[3rem] shadow-premium"
             />
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-surface-50 py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-black text-surface-900 mb-4 uppercase tracking-tighter">Our Core <span className="text-brand-500">DNA</span></h2>
            <p className="text-surface-500 font-medium max-w-2xl mx-auto">These are the principles that guide every slice we serve and every order we deliver.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ValueCard 
              icon={<FiUsers className="w-6 h-6" />}
              title="Community First"
              description="We're more than a restaurant; we're a hub for the local vibe, supporting local farmers and artisans."
            />
            <ValueCard 
              icon={<FiAward className="w-6 h-6" />}
              title="Elite Quality"
              description="From 00 flour to San Marzano tomatoes, we never compromise on the ingredients that make our vibe."
            />
            <ValueCard 
              icon={<FiHeart className="w-6 h-6" />}
              title="Passion Driven"
              description="Every chef at PizzaVibe is an artist, bringing their own unique flair to the traditional pizza canvas."
            />
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 order-2 md:order-1">
            <img 
              src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=800&q=80" 
              alt="Pizza Ingredients" 
              className="w-full h-[400px] object-cover rounded-[2.5rem] shadow-premium"
            />
          </div>
          <div className="flex-1 space-y-8 order-1 md:order-2">
            <h2 className="text-4xl font-display font-black text-surface-900 uppercase tracking-tighter">The <span className="text-brand-500">Vibe Process</span></h2>
            <ul className="space-y-6">
              <ProcessItem number="01" title="48-Hour Fermentation" description="Our dough rests for 48 hours to develop a light, airy texture and incredible flavor depth." />
              <ProcessItem number="02" title="Stone-Fired Perfection" description="Cooked at 450°C in our custom stone ovens for that authentic leopard-spotted crust." />
              <ProcessItem number="03" title="Fresh Topping Assembly" description="Ingredients are sliced fresh every morning and added only when the order is placed." />
            </ul>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-brand-500 py-24 text-white rounded-[4rem] mx-6">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl font-display font-black mb-12 uppercase tracking-tighter">Join the <span className="text-surface-900">Vibe</span></h2>
          <p className="text-xl font-medium mb-12 max-w-3xl mx-auto opacity-90">
            "Pizza is the one food that brings everyone together. At PizzaVibe, we're not just selling food; we're creating moments of connection and joy."
          </p>
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <p className="text-4xl font-black">50+</p>
              <p className="text-xs font-bold uppercase tracking-widest opacity-70">Dedicated Chefs</p>
            </div>
            <div className="w-[1px] bg-white/20" />
            <div className="text-center">
              <p className="text-4xl font-black">12</p>
              <p className="text-xs font-bold uppercase tracking-widest opacity-70">Vibe Hubs</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const ValueCard = ({ icon, title, description }) => (
  <div className="card p-10 bg-black/20 border border-surface-200/20">
    <div className="w-16 h-16 bg-brand-500/10 text-brand-500 rounded-2xl flex items-center justify-center mb-8">
      {icon}
    </div>
    <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">{title}</h3>
    <p className="text-surface-400 font-medium leading-relaxed">{description}</p>
  </div>
);

const ProcessItem = ({ number, title, description }) => (
  <li className="flex gap-6">
    <span className="text-3xl font-display font-black text-brand-500/30">{number}</span>
    <div>
      <h4 className="text-xl font-black text-surface-900 uppercase tracking-tighter mb-1">{title}</h4>
      <p className="text-surface-500 font-medium">{description}</p>
    </div>
  </li>
);

export default About;
