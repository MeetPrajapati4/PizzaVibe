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

      {/* Hero Section: Cinematic Full Screen */}
      <section className="min-h-screen relative flex items-center pt-32 overflow-hidden">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Left: Content */}
          <div className="space-y-12 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-6 py-2.5 bg-brand-500/10 border border-brand-500/20 rounded-full"
            >
              <span className="w-2.5 h-2.5 bg-brand-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(255,77,79,0.5)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-500">Elite Pizza Experience</span>
            </motion.div>

            <div className="space-y-4">
              <h1 className="text-7xl md:text-[10rem] font-display font-black leading-[0.75] tracking-tighter text-surface-900 overflow-hidden">
                <span className="hero-line block">CRAFTED</span>
                <span className="hero-line block animate-text-shimmer">VIBE.</span>
                <span className="hero-line block">BORN 86.</span>
              </h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-xl md:text-2xl text-surface-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
              >
                Experience the architectural fusion of Napolitano tradition and modern culinary art. Every crust tells a story of 48-hour fermentation.
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex flex-col sm:flex-row items-center gap-8 justify-center lg:justify-start"
            >
              <Link to="/menu" className="btn-primary group !px-14 !py-6 text-sm">
                Explore The Menu
                <FiArrowRight className="ml-3 transition-transform group-hover:translate-x-2" />
              </Link>
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-surface-50 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                  </div>
                ))}
                <div className="w-12 h-12 rounded-full border-4 border-surface-50 bg-surface-200 flex items-center justify-center text-[10px] font-black">
                  +12K
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Immersive 3D Visual */}
          <div className="relative">
            <motion.div 
              style={{ rotate: pizzaRotate, y: pizzaY }}
              className="relative z-10 mx-auto w-full max-w-[600px] aspect-square"
            >
              <TiltContainer intensity={30} className="w-full h-full">
                <div className="relative animate-loop-3d">
                  <img 
                    src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=100&w=1200" 
                    alt="Premium PizzaVibe"
                    className="w-full h-full object-cover rounded-full shadow-[0_80px_150px_-30px_rgba(0,0,0,0.6)] border-[1.5rem] border-white/5"
                  />
                  
                  {/* Floating Micro-Badges */}
                  <div className="absolute -top-10 -right-10 glass p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-3xl border-white/10 z-20">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-brand-500 rounded-2xl flex items-center justify-center text-white shadow-brand">
                        <FiClock className="w-7 h-7" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-black text-surface-900 leading-none mb-1">Express</p>
                        <p className="text-[10px] text-surface-500 font-bold uppercase tracking-widest">20 MIN DELIVERY</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TiltContainer>
            </motion.div>

            {/* Decorative Particles */}
            <IngredientParticle icon={<FiZap className="w-8 h-8 text-brand-500/20" />} className="top-0 left-0" />
            <IngredientParticle icon={<FiAward className="w-10 h-10 text-amber-500/20" />} className="bottom-20 right-0" delay={1} />
            <IngredientParticle icon={<FiSmile className="w-6 h-6 text-blue-500/20" />} className="top-40 right-20" delay={2} />
          </div>
        </div>
      </section>

      {/* Feature Grid: High Impact */}
      <section className="py-40 bg-surface-100 rounded-[5rem] mx-6 shadow-premium relative overflow-hidden">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-16 relative z-10">
          <div className="space-y-8 p-10 bg-white/5 rounded-[3rem] border border-white/5 backdrop-blur-xl">
             <div className="w-20 h-20 bg-brand-500 rounded-3xl flex items-center justify-center text-white shadow-2xl">
               <FiTruck className="w-10 h-10" />
             </div>
             <h3 className="text-3xl font-display font-black text-white uppercase tracking-tighter">Hyper-Local <br/> Logistics</h3>
             <p className="text-surface-400 font-medium leading-relaxed">Our proprietary routing algorithm guarantees the shortest path from oven to table.</p>
          </div>

          <div className="space-y-8 p-10 bg-white/5 rounded-[3rem] border border-white/5 backdrop-blur-xl">
             <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-2xl">
               <FiStar className="w-10 h-10" />
             </div>
             <h3 className="text-3xl font-display font-black text-white uppercase tracking-tighter">Artisanal <br/> Standards</h3>
             <p className="text-surface-400 font-medium leading-relaxed">Each pizza undergoes a 3-point quality check by our Head Pizzaiolo before leaving.</p>
          </div>

          <div className="space-y-8 p-10 bg-white/5 rounded-[3rem] border border-white/5 backdrop-blur-xl">
             <div className="w-20 h-20 bg-amber-500 rounded-3xl flex items-center justify-center text-white shadow-2xl">
               <FiZap className="w-10 h-10" />
             </div>
             <h3 className="text-3xl font-display font-black text-white uppercase tracking-tighter">Modern <br/> Experience</h3>
             <p className="text-surface-400 font-medium leading-relaxed">Seamless 1-click ordering, real-time heat mapping, and elite concierge support.</p>
          </div>
        </div>
      </section>

      {/* Chef's Signature Masterpieces */}
      <section className="container mx-auto px-6 py-40">
        <div className="flex flex-col md:flex-row items-end justify-between gap-12 mb-24">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-brand-500/10 border border-brand-500/20 rounded-full">
               <FiAward className="text-brand-500" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-500">Chef's Signature</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-display font-black text-surface-900 uppercase tracking-tighter leading-[0.85]">
              CRAFTING <br/>
              <span className="text-gradient">MASTERPIECES.</span>
            </h2>
            <p className="text-xl text-surface-500 font-medium max-w-2xl leading-relaxed">Our seasonal selection curated for the true pizza enthusiast. Limited availability daily to maintain elite quality.</p>
          </div>
          <Link to="/menu" className="group text-sm font-black uppercase text-brand-500 tracking-[0.3em] flex items-center gap-4 hover:gap-6 transition-all duration-500">
            View Collection <FiArrowRight className="text-2xl" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
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

      {/* Stats Section: High Fidelity Counter */}
      <section className="container mx-auto px-6 py-40">
        <div className="glass p-20 md:p-32 rounded-[5rem] relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-blue-500/5" />
          <div className="relative z-10 grid md:grid-cols-3 gap-24">
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <p className="text-8xl font-display font-black text-surface-900 stat-number" data-target="52">0</p>
                <p className="text-6xl font-display font-black text-brand-500">K+</p>
              </div>
              <p className="text-xs font-black uppercase tracking-[0.4em] text-surface-400">Happy Vibers</p>
            </div>
            <div className="space-y-4">
               <div className="flex items-center justify-center">
                <p className="text-8xl font-display font-black text-surface-900 stat-number" data-target="18">0</p>
                <p className="text-6xl font-display font-black text-blue-500">+</p>
              </div>
              <p className="text-xs font-black uppercase tracking-[0.4em] text-surface-400">Unique Flavors</p>
            </div>
            <div className="space-y-4">
               <div className="flex items-center justify-center">
                <p className="text-8xl font-display font-black text-surface-900 stat-number" data-target="99">0</p>
                <p className="text-6xl font-display font-black text-emerald-500">%</p>
              </div>
              <p className="text-xs font-black uppercase tracking-[0.4em] text-surface-400">Elite Reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vibe Black Card CTA */}
      <section className="container mx-auto px-6 pb-40">
        <motion.div 
          whileHover={{ y: -10 }}
          className="bg-black rounded-[5rem] p-16 md:p-32 relative overflow-hidden border border-white/5"
        >
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-500/10 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-24">
            <div className="flex-1 space-y-12 text-center lg:text-left">
              <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/5 border border-white/10 rounded-full">
                 <FiZap className="text-brand-500" />
                 <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60">Elite Access</span>
              </div>
              <h2 className="text-6xl md:text-[7rem] font-display font-black text-white uppercase tracking-tighter leading-[0.85]">
                UNVEIL THE <br/>
                <span className="text-gradient">BLACK CARD.</span>
              </h2>
              <p className="text-xl text-surface-400 font-medium max-w-xl leading-relaxed">
                Join the inner circle of PizzaVibe. Priority dispatch, secret menu items, and private culinary events.
              </p>
              <div className="flex justify-center lg:justify-start">
                 <Link to="/menu" className="btn-primary !px-16 !py-6 text-sm !bg-white !text-black hover:!bg-brand-500 hover:!text-white">
                   Apply For Membership
                 </Link>
              </div>
            </div>

            <div className="flex-1 perspective-1000">
               <motion.div 
                 animate={{ 
                   rotateY: [0, 15, 0, -15, 0],
                   rotateX: [0, -10, 0, 10, 0],
                   y: [0, -20, 0]
                 }}
                 transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                 className="w-full max-w-lg aspect-[1.6/1] bg-gradient-to-br from-zinc-800 to-black rounded-[3rem] p-16 border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative"
               >
                  <div className="flex justify-between items-start">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center">
                      <FiZap className="text-brand-500 w-8 h-8" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white/30">VIBE ELITE</p>
                  </div>
                  <div className="absolute bottom-16 left-16">
                     <p className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-2">Member Name</p>
                     <p className="text-3xl font-display font-black tracking-widest text-white uppercase">ELITE MASTER</p>
                  </div>
                  <div className="absolute bottom-16 right-16">
                     <p className="text-3xl font-display font-black text-white/5 italic">P.</p>
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
