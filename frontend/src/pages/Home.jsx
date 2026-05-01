import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiZap, FiSmile, FiTruck, FiAward, FiStar, FiClock } from 'react-icons/fi';
import TiltContainer from '../components/TiltContainer';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const IngredientParticle = ({ icon, className, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0.4, 0.8, 0.4],
      scale: [1, 1.2, 1],
      y: [0, -20, 0],
      rotate: [0, 45, 0]
    }}
    transition={{ 
      duration: 5, 
      repeat: Infinity, 
      delay,
      ease: "easeInOut"
    }}
    className={`absolute pointer-events-none z-0 ${className}`}
  >
    {icon}
  </motion.div>
);

const ChefPickCard = ({ name, price, image, tag }) => (
  <motion.div 
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="group relative"
  >
    <TiltContainer intensity={15} className="cursor-pointer">
      <div className="relative h-[450px] rounded-[3rem] overflow-hidden bg-surface-100 shadow-premium group-hover:shadow-premium-hover transition-all duration-700">
        <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
        
        {/* Hover Content */}
        <div className="absolute top-8 left-8">
          <div className="px-5 py-2 bg-brand-500 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-2xl transform -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
            {tag}
          </div>
        </div>
        
        <div className="absolute bottom-10 left-10 right-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <h3 className="text-3xl font-display font-black text-white uppercase tracking-tighter mb-2 leading-none">{name}</h3>
          <div className="flex items-center justify-between">
            <p className="text-brand-500 text-xl font-black">₹{price}</p>
            <div className="flex gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => <FiStar key={i} className="w-3 h-3 fill-current" />)}
            </div>
          </div>
        </div>
      </div>
    </TiltContainer>
  </motion.div>
);

const Home = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const pizzaRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const pizzaY = useTransform(scrollYProgress, [0, 1], [0, 200]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Split text reveal for the main heading
      gsap.from(".hero-line", {
        y: 120,
        skewY: 10,
        opacity: 0,
        duration: 1.8,
        stagger: 0.3,
        ease: "power4.out"
      });

      // Background decorative movement
      gsap.to(".bg-orb", {
        x: "random(-100, 100)",
        y: "random(-100, 100)",
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 2
      });

      // Count up animation for stats
      const stats = document.querySelectorAll('.stat-number');
      stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        gsap.to(stat, {
          innerText: target,
          duration: 3,
          snap: { innerText: 1 },
          scrollTrigger: {
            trigger: stat,
            start: "top 80%"
          }
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative bg-surface-50" ref={containerRef}>
      {/* Dynamic Background Orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="bg-orb absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-brand-500/5 blur-[120px] rounded-full" />
        <div className="bg-orb absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full" />
        <div className="bg-orb absolute top-[40%] left-[20%] w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full" />
      </div>

      {/* Hero Section: Cinematic and Balanced */}
      <section className="min-h-[85vh] relative flex items-center pt-24 overflow-hidden">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-8 items-center relative z-10">
          
          {/* Left: Content */}
          <div className="space-y-8 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-5 py-2 bg-brand-500/10 border border-brand-500/20 rounded-full"
            >
              <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(255,77,79,0.5)]" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-500">Elite Delivery</span>
            </motion.div>

            <div className="space-y-3">
              <h1 className="text-6xl md:text-[6.5rem] font-display font-black leading-[0.8] tracking-tighter text-surface-900 overflow-hidden">
                <span className="hero-line block">CRAFTED</span>
                <span className="hero-line block animate-text-shimmer">VIBE.</span>
                <span className="hero-line block">PURE TASTE.</span>
              </h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-lg md:text-xl text-surface-600 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium"
              >
                Experience the architectural fusion of Napolitano tradition and modern culinary art. Hand-stretched dough, 48-hour fermentation.
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start"
            >
              <Link to="/menu" className="btn-primary group !px-10 !py-5 text-xs">
                Explore Menu
                <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-3 border-surface-50 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="User" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-3 border-surface-50 bg-surface-200 flex items-center justify-center text-[9px] font-black">
                  +12K
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Immersive 3D Visual - Scaled Down */}
          <div className="relative">
            <motion.div 
              style={{ rotate: pizzaRotate, y: pizzaY }}
              className="relative z-10 mx-auto w-full max-w-[500px] aspect-square"
            >
              <TiltContainer intensity={25} className="w-full h-full">
                <div className="relative animate-loop-3d">
                  <img 
                    src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=100&w=1000" 
                    alt="Premium PizzaVibe"
                    className="w-full h-full object-cover rounded-full shadow-[0_60px_120px_-20px_rgba(0,0,0,0.5)] border-[1rem] border-white/10"
                  />
                  
                  {/* Floating Micro-Badge - Scaled Down */}
                  <div className="absolute -top-5 -right-5 glass p-6 rounded-[2rem] shadow-2xl backdrop-blur-3xl border-white/10 z-20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white shadow-brand">
                        <FiClock className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-black text-surface-900 leading-none mb-1">Express</p>
                        <p className="text-[9px] text-surface-500 font-bold uppercase tracking-widest">20 MIN</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TiltContainer>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Live Order Ticker: Added Value */}
      <div className="bg-surface-900 py-4 overflow-hidden border-y border-white/5 relative z-20">
        <div className="flex animate-marquee whitespace-nowrap gap-12">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="flex items-center gap-4">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
                Fresh Order: <span className="text-white">Keema Do Pyaza</span> — 2 mins ago
              </p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
                Fresh Order: <span className="text-white">Truffle Mushroom</span> — 5 mins ago
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Grid: Tightened */}
      <section className="py-24 bg-surface-100 rounded-[4rem] mx-4 shadow-premium relative overflow-hidden">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-10 relative z-10">
          <div className="space-y-6 p-8 bg-white/5 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
             <div className="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center text-white shadow-xl">
               <FiTruck className="w-8 h-8" />
             </div>
             <h3 className="text-2xl font-display font-black text-white uppercase tracking-tighter">Fast <br/> Logistics</h3>
             <p className="text-surface-400 text-sm font-medium leading-relaxed">Our proprietary routing algorithm guarantees the shortest path from oven to table.</p>
          </div>

          <div className="space-y-6 p-8 bg-white/5 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
             <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
               <FiStar className="w-8 h-8" />
             </div>
             <h3 className="text-2xl font-display font-black text-white uppercase tracking-tighter">Artisan <br/> Quality</h3>
             <p className="text-surface-400 text-sm font-medium leading-relaxed">Each pizza undergoes a 3-point quality check by our Head Pizzaiolo before leaving.</p>
          </div>

          <div className="space-y-6 p-8 bg-white/5 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
             <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-xl">
               <FiZap className="w-8 h-8" />
             </div>
             <h3 className="text-2xl font-display font-black text-white uppercase tracking-tighter">Modern <br/> Delivery</h3>
             <p className="text-surface-400 text-sm font-medium leading-relaxed">Seamless 1-click ordering, real-time heat mapping, and elite support.</p>
          </div>
        </div>
      </section>

      {/* Chef's Signature Masterpieces: Tightened */}
      <section className="container mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-3 px-5 py-1.5 bg-brand-500/10 border border-brand-500/20 rounded-full">
               <FiAward className="text-brand-500 w-4 h-4" />
               <span className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-500">Chef's Signature</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-display font-black text-surface-900 uppercase tracking-tighter leading-[0.9]">
              CRAFTING <br/>
              <span className="text-gradient">MASTERPIECES.</span>
            </h2>
            <p className="text-lg text-surface-500 font-medium max-w-xl leading-relaxed">Our seasonal selection curated for the true pizza enthusiast. Limited availability daily.</p>
          </div>
          <Link to="/menu" className="group text-[10px] font-black uppercase text-brand-500 tracking-[0.2em] flex items-center gap-3 hover:gap-5 transition-all duration-500">
            View Collection <FiArrowRight className="text-xl" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          <ChefPickCard 
            name="Truffle Mushroom"
            price="589"
            image="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&q=80"
            tag="Editor's Choice"
          />
          <ChefPickCard 
            name="Prawn Pesto"
            price="649"
            image="https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=800&q=80"
            tag="Premium"
          />
          <ChefPickCard 
            name="Greek Feta Feast"
            price="439"
            image="https://images.unsplash.com/photo-1555072169-ee53fb05e61a?w=800&q=80"
            tag="Fresh Harvest"
          />
        </div>
      </section>

      {/* Stats Section: Scaled Down */}
      <section className="container mx-auto px-6 py-24">
        <div className="glass p-16 md:p-24 rounded-[4rem] relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-transparent to-blue-500/5" />
          <div className="relative z-10 grid md:grid-cols-3 gap-16">
            <div className="space-y-3">
              <div className="flex items-center justify-center">
                <p className="text-6xl font-display font-black text-surface-900 stat-number" data-target="52">0</p>
                <p className="text-4xl font-display font-black text-brand-500">K+</p>
              </div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-surface-400">Happy Vibers</p>
            </div>
            <div className="space-y-3">
               <div className="flex items-center justify-center">
                <p className="text-6xl font-display font-black text-surface-900 stat-number" data-target="18">0</p>
                <p className="text-4xl font-display font-black text-blue-500">+</p>
              </div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-surface-400">Unique Flavors</p>
            </div>
            <div className="space-y-3">
               <div className="flex items-center justify-center">
                <p className="text-6xl font-display font-black text-surface-900 stat-number" data-target="99">0</p>
                <p className="text-4xl font-display font-black text-emerald-500">%</p>
              </div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-surface-400">Elite Reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vibe Black Card CTA: Balanced */}
      <section className="container mx-auto px-6 pb-24">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-black rounded-[4rem] p-12 md:p-24 relative overflow-hidden border border-white/5"
        >
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-10 text-center lg:text-left">
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/5 border border-white/10 rounded-full">
                 <FiZap className="text-brand-500" />
                 <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/60">Elite Access</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-display font-black text-white uppercase tracking-tighter leading-[0.85]">
                THE VIBE <br/>
                <span className="text-gradient">BLACK CARD.</span>
              </h2>
              <p className="text-lg text-surface-400 font-medium max-w-lg leading-relaxed">
                Join the inner circle. Priority dispatch, secret menu items, and private culinary events.
              </p>
              <div className="flex justify-center lg:justify-start">
                 <Link to="/menu" className="btn-primary !px-12 !py-5 text-xs !bg-white !text-black hover:!bg-brand-500 hover:!text-white">
                   Apply For Access
                 </Link>
              </div>
            </div>

            <div className="flex-1 perspective-1000 w-full">
               <motion.div 
                 animate={{ 
                   rotateY: [0, 10, 0, -10, 0],
                   rotateX: [0, -5, 0, 5, 0],
                   y: [0, -10, 0]
                 }}
                 transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                 className="w-full max-w-md mx-auto aspect-[1.6/1] bg-gradient-to-br from-zinc-800 to-black rounded-[2.5rem] p-12 border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.7)] relative"
               >
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center">
                      <FiZap className="text-brand-500 w-6 h-6" />
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">VIBE ELITE</p>
                  </div>
                  <div className="absolute bottom-12 left-12">
                     <p className="text-[7px] font-black uppercase tracking-widest text-white/20 mb-1">Member Name</p>
                     <p className="text-2xl font-display font-black tracking-widest text-white uppercase">ELITE MASTER</p>
                  </div>
               </motion.div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
