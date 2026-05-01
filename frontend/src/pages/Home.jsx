import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiZap, FiSmile, FiTruck } from 'react-icons/fi';
import TiltContainer from '../components/TiltContainer';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ChefPickCard = ({ name, price, image, tag }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="animate-loop-3d" 
    style={{ animationDelay: `${Math.random() * 2}s` }}
  >
    <TiltContainer intensity={10} className="group cursor-pointer">
      <div className="relative h-[400px] rounded-[2.5rem] overflow-hidden mb-6">
        <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
        <div className="absolute top-6 left-6 px-4 py-2 bg-brand-500 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-lg">
          {tag}
        </div>
        <div className="absolute bottom-8 left-8 right-8">
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-1">{name}</h3>
          <p className="text-brand-500 font-black">₹{price}</p>
        </div>
      </div>
    </TiltContainer>
  </motion.div>
);

const TestimonialCard = ({ text, author, role }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="p-10 bg-black/20 border border-surface-200/20 rounded-[2.5rem] hover:bg-black/30 transition-all duration-300"
  >
    <p className="text-lg font-medium leading-relaxed italic mb-8 text-white opacity-80">"{text}"</p>
    <div>
      <p className="font-black uppercase tracking-widest text-brand-500 text-xs mb-1">{author}</p>
      <p className="text-[10px] font-bold uppercase tracking-widest text-surface-500">{role}</p>
    </div>
  </motion.div>
);

const FeatureCard = ({ icon, title, description, color }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="card p-10 hover:-translate-y-2 group transition-all duration-500"
  >
    <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg mb-8 transition-transform group-hover:scale-110 group-hover:rotate-6`}>
      {icon}
    </div>
    <h3 className="text-2xl font-black text-surface-900 mb-4">{title}</h3>
    <p className="text-surface-600 font-medium leading-relaxed">
      {description}
    </p>
  </motion.div>
);

const Home = () => {
  const heroRef = useRef(null);
  const pizzaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax effect for the hero pizza
      gsap.to(pizzaRef.current, {
        y: 100,
        rotate: 15,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      // Split text-like reveal for heading
      gsap.from(".hero-title span", {
        y: 100,
        skewY: 7,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "power4.out"
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="pt-32 pb-20 overflow-hidden" ref={heroRef}>
      {/* Hero Section */}
      <section className="container mx-auto px-6 relative min-h-[80vh] flex items-center justify-center">
        {/* Central Spotlight */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/10 blur-[150px] rounded-full -z-10" />
        
        <div className="max-w-5xl mx-auto text-center space-y-16">
          {/* Main Visual Centerpiece */}
          <div className="relative mx-auto w-full max-w-2xl" ref={pizzaRef}>
            <div className="animate-loop-3d">
              <TiltContainer intensity={20} className="relative z-10">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1200" 
                    alt="Premium PizzaVibe"
                    className="w-full h-[400px] md:h-[500px] object-cover rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5 transition-all duration-700"
                  />
                  
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1, type: "spring" }}
                    className="absolute -top-6 -right-6 glass p-6 rounded-3xl shadow-2xl z-20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-brand-500 rounded-full flex items-center justify-center text-white">
                        <FiZap className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-black text-surface-900">Italian Choice</p>
                        <p className="text-[10px] text-surface-500 font-bold uppercase">Fresh Daily</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </TiltContainer>
            </div>
          </div>

          {/* Centered Text Content */}
          <div className="space-y-8 relative z-30">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-6 py-2 bg-brand-500/10 border border-brand-500/20 rounded-full"
            >
              <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-500">Premium Pizza Delivery</span>
            </motion.div>
            
            <h1 className="hero-title text-6xl md:text-9xl font-display font-black leading-[0.8] tracking-tighter text-surface-900">
              <span className="block">CRAFTED</span>
              <span className="block animate-text-shimmer">CRUSTS.</span>
              <span className="block">PURE VIBE.</span>
            </h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-xl text-surface-600 max-w-2xl mx-auto leading-relaxed font-medium"
            >
              We've refined our craft to bring you the ultimate pizza experience. From hand-stretched dough to premium toppings, every bite is a vibe.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row items-center gap-6 justify-center"
            >
              <Link to="/menu" className="btn-primary group !px-12 !py-5">
                Order Your Vibe
                <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/menu" className="btn-secondary !px-12 !py-5">
                View Gallery
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-28">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          <FeatureCard 
            icon={<FiZap className="w-6 h-6" />}
            title="Rapid Delivery"
            description="Our specialized logistics network ensures your pizza arrives piping hot within 30 minutes."
            color="bg-brand-500"
          />

          <FeatureCard 
            icon={<FiSmile className="w-6 h-6" />}
            title="Premium Taste"
            description="We use 100% real mozzarella and farm-fresh ingredients to guarantee an elite taste."
            color="bg-blue-500"
          />

          <FeatureCard 
            icon={<FiTruck className="w-6 h-6" />}
            title="Live Tracking"
            description="Track your vibe in real-time. From the oven to your doorstep, know exactly where your pizza is."
            color="bg-emerald-500"
          />
        </div>
      </section>

      {/* Our Craft */}
      <section className="container mx-auto px-6 py-32">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
          <div className="flex-1 space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/10 border border-brand-500/20 rounded-full">
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-500">The Secret Recipe</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-black text-surface-900 leading-[0.9] uppercase tracking-tighter">
              BORN IN <br />
              <span className="text-gradient">NAPLES.</span> <br />
              MADE FOR YOU.
            </h2>
            <p className="text-xl text-surface-600 leading-relaxed font-medium">
              We use 48-hour fermented sourdough and stone-ground flour imported directly from Italy. This isn't just pizza; it's a centuries-old tradition refined for the modern palate.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-8">
              <div className="space-y-2">
                <div className="w-12 h-1 bg-brand-500" />
                <p className="text-xs font-black uppercase tracking-widest text-surface-900">Stone Oven</p>
                <p className="text-[10px] text-surface-500 font-bold leading-relaxed">Baked at 450°C for the perfect char.</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-1 bg-brand-500" />
                <p className="text-xs font-black uppercase tracking-widest text-surface-900">Local Produce</p>
                <p className="text-[10px] text-surface-500 font-bold leading-relaxed">Sourced fresh from local elite farms.</p>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <TiltContainer intensity={10}>
              <img 
                src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=1000&q=80" 
                alt="Artisanal Pizza Craft"
                className="w-full h-[600px] object-cover rounded-[4rem] shadow-premium"
              />
            </TiltContainer>
          </div>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="container mx-auto px-6 py-32">
        <div className="glass p-12 md:p-20 rounded-[4rem] text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-brand-500/5 to-transparent" />
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-6xl font-display font-black text-surface-900 uppercase tracking-tighter">
              JOIN THE <span className="text-gradient">50K+</span> <br />
              PIZZA LOVERS
            </h2>
            <div className="flex flex-wrap justify-center gap-12 pt-8">
              <div className="space-y-2">
                <p className="text-5xl font-black text-brand-500">4.9/5</p>
                <p className="text-xs font-bold text-surface-400 uppercase tracking-widest">Customer Rating</p>
              </div>
              <div className="space-y-2">
                <p className="text-5xl font-black text-surface-900">12+</p>
                <p className="text-xs font-bold text-surface-400 uppercase tracking-widest">Italian Awards</p>
              </div>
              <div className="space-y-2">
                <p className="text-5xl font-black text-surface-900">24/7</p>
                <p className="text-xs font-bold text-surface-400 uppercase tracking-widest">Vibe Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chef's Picks */}
      <section className="container mx-auto px-6 py-32">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/10 border border-brand-500/20 rounded-full">
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-500">Elite Selection</span>
            </div>
            <h2 className="text-5xl font-display font-black text-surface-900 uppercase tracking-tighter">Chef's <span className="text-gradient">Masterpieces</span></h2>
            <p className="text-surface-500 font-medium max-w-xl">Curated by our head chef, these pizzas represent the pinnacle of the PizzaVibe experience.</p>
          </div>
          <Link to="/menu" className="text-xs font-black uppercase text-brand-500 tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
            Full Menu <FiArrowRight />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <ChefPickCard 
            name="Truffle Mushroom"
            price="549"
            image="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&q=80"
            tag="Italian Choice"
          />
          <ChefPickCard 
            name="Seafood Sensation"
            price="649"
            image="https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=600&q=80"
            tag="Premium"
          />
          <ChefPickCard 
            name="Butter Chicken Fusion"
            price="489"
            image="https://images.unsplash.com/photo-1613564834361-9436948817d1?w=600&q=80"
            tag="Chef Special"
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-surface-100 py-32 text-white rounded-[4rem] mx-6">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
             <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mb-4">Vibe <span className="text-brand-500">Reviews</span></h2>
             <p className="text-surface-400 font-medium tracking-wide">Join thousands of satisfied vibers across the city.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            <TestimonialCard 
              text="The best pizza I've ever had! The crust is so light and airy, and the toppings are incredibly fresh."
              author="Aarav Sharma"
              role="Food Blogger"
            />
            <TestimonialCard 
              text="PizzaVibe has completely changed my weekends. The express shipping is actually under 30 minutes every time."
              author="Priya Patel"
              role="Tech Professional"
            />
            <TestimonialCard 
              text="Italian quality at local prices. The Truffle Mushroom pizza is a masterpiece. Highly recommend!"
              author="James Wilson"
              role="Chef"
            />
          </div>
        </div>
      </section>

      {/* Vibe Elite Membership */}
      <section className="container mx-auto px-6 py-32">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="card bg-gradient-to-br from-surface-100 to-black p-12 md:p-20 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-brand-500/10 blur-[100px] rounded-full group-hover:bg-brand-500/20 transition-all duration-700" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/10 border border-brand-500/20 rounded-full">
                <FiZap className="text-brand-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-500">Elite Membership</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-black text-white uppercase tracking-tighter leading-[0.9]">
                THE VIBE <br />
                <span className="text-gradient">BLACK CARD</span>
              </h2>
              <p className="text-surface-400 font-medium text-lg leading-relaxed">
                Unlock 24/7 priority delivery, exclusive off-menu masterpieces, and zero delivery fees. Experience pizza at the highest level.
              </p>
              <div className="flex justify-center lg:justify-start">
                 <button className="btn-primary !px-12">Apply for Access</button>
              </div>
            </div>
            
            <div className="flex-1 perspective-1000 w-full">
               <motion.div 
                 animate={{ 
                   rotateY: [0, 15, 0, -15, 0], 
                   rotateX: [0, -10, 0, 10, 0],
                   y: [0, -10, 0] 
                 }}
                 transition={{ 
                   duration: 8, 
                   repeat: Infinity, 
                   ease: "easeInOut" 
                 }}
                 className="w-full max-w-md mx-auto aspect-[1.6/1] bg-gradient-to-br from-zinc-800 to-black border border-white/10 rounded-[2rem] p-10 shadow-2xl relative overflow-hidden preserve-3d"
               >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 blur-3xl rounded-full" />
                  <div className="flex justify-between items-start mb-16">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center">
                      <FiZap className="text-brand-500 w-8 h-8" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Vibe Elite</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Card Member</p>
                    <p className="text-2xl font-display font-black tracking-[0.1em] text-white uppercase">VIBE MASTER</p>
                  </div>
                  <div className="absolute bottom-10 right-10">
                     <span className="text-2xl font-display font-black text-white/10 italic">PIZZAVIBE.</span>
                  </div>
                  <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-brand-500/5 blur-3xl rounded-full" />
               </motion.div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
