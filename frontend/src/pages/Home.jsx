import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiZap, FiSmile, FiTruck, FiAward, FiStar, FiClock, FiPlus, FiChevronDown, FiShield, FiHeart } from 'react-icons/fi';
import TiltContainer from '../components/TiltContainer';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- Sub-Components ---

const StaggeredText = ({ text, className }) => {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.05 }}
          viewport={{ once: true }}
          className="inline-block mr-2"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/5 py-8">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left group"
      >
        <span className="text-xl md:text-2xl font-display font-black text-white uppercase tracking-tighter group-hover:text-brand-500 transition-colors">
          {question}
        </span>
        <FiChevronDown className={`text-2xl text-surface-500 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pt-6 text-surface-500 text-lg leading-relaxed max-w-2xl">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ChefPickCard = ({ name, price, image, tag, description }) => (
  <motion.div 
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="group relative"
  >
    <TiltContainer intensity={10} className="cursor-pointer">
      <div className="relative h-[550px] rounded-[3.5rem] overflow-hidden bg-surface-100 shadow-premium">
        <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        
        <div className="absolute top-10 left-10">
          <div className="px-6 py-2.5 bg-brand-500 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-2xl">
            {tag}
          </div>
        </div>
        
        <div className="absolute bottom-12 left-12 right-12 space-y-4">
          <h3 className="text-4xl font-display font-black text-white uppercase tracking-tighter leading-none">{name}</h3>
          <p className="text-surface-400 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">{description}</p>
          <div className="flex items-center justify-between pt-4">
            <p className="text-brand-500 text-2xl font-black">₹{price}</p>
            <Link to="/menu" className="px-8 py-3 bg-white rounded-2xl text-black text-xs font-black uppercase tracking-widest hover:bg-brand-500 hover:text-white transition-all">
              Reserve Vibe
            </Link>
          </div>
        </div>
      </div>
    </TiltContainer>
  </motion.div>
);

const Home = () => {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  const pizzaRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const pizzaScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.2]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-line", {
        y: 150,
        skewY: 15,
        opacity: 0,
        duration: 2,
        stagger: 0.3,
        ease: "power4.out"
      });

      // Stats Count Up
      document.querySelectorAll('.stat-number').forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        gsap.to(stat, {
          innerText: target,
          duration: 3,
          snap: { innerText: 1 },
          scrollTrigger: { trigger: stat, start: "top 90%" }
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="relative bg-surface-50 overflow-x-hidden" ref={containerRef}>
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-brand-500/5 blur-[150px] rounded-full animate-pulse-soft" />
        <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-amber-500/5 blur-[150px] rounded-full" />
      </div>

      {/* 1. Hero: Balanced Entrance */}
      <section className="min-h-[90vh] relative flex items-center pt-24 pb-12" ref={heroRef}>
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10 text-center lg:text-left">
            <h1 className="text-6xl md:text-[8rem] font-display font-black leading-[0.8] tracking-tighter text-white uppercase">
              <span className="hero-line block overflow-hidden">PURE</span>
              <span className="hero-line block animate-text-shimmer overflow-hidden">VIBE.</span>
              <span className="hero-line block overflow-hidden">ZERO LIES.</span>
            </h1>

            <p className="text-lg md:text-xl text-surface-500 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              We curate a high-fidelity sensory experience using 48-hour fermented dough and rare artisanal toppings.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-8 justify-center lg:justify-start">
              <Link to="/menu" className="btn-primary !px-12 !py-5 text-xs group shadow-[0_30px_60px_rgba(255,77,79,0.2)]">
                Explore Gallery
                <FiArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
              </Link>
              <div className="flex items-center gap-5">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-surface-50 overflow-hidden shadow-2xl">
                      <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="User" />
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-base font-black text-white leading-none">150K+</p>
                  <p className="text-[9px] font-bold text-surface-500 uppercase tracking-widest">Global Vibers</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative group scale-90 lg:scale-100">
            <motion.div style={{ rotate: pizzaRotate, scale: pizzaScale }} className="relative z-10 max-w-[500px] mx-auto">
               <TiltContainer intensity={15}>
                 <div className="rounded-full overflow-hidden border-[1rem] border-white/5 shadow-[0_80px_150px_-30px_rgba(0,0,0,0.8)]">
                    <img 
                      src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1000&q=100" 
                      alt="The Masterpiece"
                      className="w-full aspect-square object-cover"
                    />
                 </div>
               </TiltContainer>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Global Stats: Trust Symbols */}
      <section className="bg-surface-100 py-20 rounded-[4rem] mx-4 border border-white/5">
        <div className="container mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <p className="text-5xl md:text-7xl font-display font-black text-white tracking-tighter"><span className="stat-number" data-target="48">0</span>H</p>
            <p className="text-[9px] font-black text-brand-500 uppercase tracking-[0.4em]">Fermentation</p>
          </div>
          <div className="space-y-1">
            <p className="text-5xl md:text-7xl font-display font-black text-white tracking-tighter"><span className="stat-number" data-target="96">0</span>%</p>
            <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.4em]">Satisfaction</p>
          </div>
          <div className="space-y-1">
            <p className="text-5xl md:text-7xl font-display font-black text-white tracking-tighter"><span className="stat-number" data-target="12">0</span>K</p>
            <p className="text-[9px] font-black text-amber-500 uppercase tracking-[0.4em]">Daily Orders</p>
          </div>
          <div className="space-y-1">
            <p className="text-5xl md:text-7xl font-display font-black text-white tracking-tighter"><span className="stat-number" data-target="5">0</span>/5</p>
            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.4em]">Vibe Rating</p>
          </div>
        </div>
      </section>

      {/* 3. The Process: Behind the Art */}
      <section className="container mx-auto px-6 py-24 space-y-24">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
           <h2 className="text-5xl md:text-8xl font-display font-black text-white uppercase tracking-tighter leading-[0.8]">
             ANATOMY OF <br/>
             <span className="text-gradient">PERFECTION.</span>
           </h2>
           <p className="text-lg text-surface-500 font-medium leading-relaxed">
             We obsess over every granular detail to ensure your vibe is uninterrupted.
           </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {[
            { img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800", title: "48H Slow Proof", desc: "Crust that is light, airy, and easily digestible." },
            { img: "https://images.unsplash.com/photo-1593504049359-74330189a345?q=80&w=800", title: "Rare Sourcing", desc: "San Marzano tomatoes and Buffalo Mozzarella flown in weekly." },
            { img: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?q=80&w=800", title: "Volcanic Heat", desc: "Blasted for 90 seconds at 450°C for perfect char." }
          ].map((step, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="space-y-8 group"
            >
               <div className="relative h-80 rounded-[2.5rem] overflow-hidden bg-surface-200 border border-white/5">
                  <img src={step.img} alt={step.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
                  <div className="absolute top-6 left-6 w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white font-black border border-white/10">0{i+1}</div>
               </div>
               <div className="space-y-3 px-2">
                  <h3 className="text-2xl font-display font-black text-white uppercase tracking-tighter">{step.title}</h3>
                  <p className="text-surface-500 text-sm leading-relaxed">{step.desc}</p>
               </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Signature Showcase */}
      <section className="container mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row items-end justify-between gap-10 mb-20">
           <div className="space-y-4">
              <div className="px-4 py-1.5 bg-brand-500/10 border border-brand-500/20 rounded-full inline-block">
                 <span className="text-[9px] font-black text-brand-500 uppercase tracking-widest">Elite drops</span>
              </div>
              <h2 className="text-6xl md:text-7xl font-display font-black text-white uppercase tracking-tighter leading-none">
                THE ELITE <br/>
                <span className="text-gradient">COLLECTION.</span>
              </h2>
           </div>
           <Link to="/menu" className="btn-secondary !px-10 !py-4 text-xs group">
             Full Gallery
             <FiArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
           </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ChefPickCard 
            name="Truffle Noir"
            price="749"
            image="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800"
            tag="Elite"
            description="Black truffles, truffle honey, and fior di latte."
          />
          <ChefPickCard 
            name="Volcano Spicy"
            price="589"
            image="https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800"
            tag="Trending"
            description="Nduja, chili oil, and spicy honey."
          />
          <ChefPickCard 
            name="Pesto Paradiso"
            price="629"
            image="https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=800"
            tag="Signature"
            description="Basil pesto, sun-dried tomatoes, and pine nuts."
          />
        </div>
      </section>

      {/* 5. Vibe Black Card */}
      <section className="container mx-auto px-6 pb-24">
        <div className="bg-black rounded-[4rem] p-10 md:p-24 relative overflow-hidden border border-white/10 group">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-blue-500/5 opacity-30" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-10">
              <div className="space-y-6 text-center lg:text-left">
                <h2 className="text-5xl md:text-[7rem] font-display font-black text-white uppercase tracking-tighter leading-[0.85]">
                  OWN THE <br/>
                  <span className="text-gradient">BLACK CARD.</span>
                </h2>
                <p className="text-lg text-surface-400 font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Invitation-only inner circle. Skip the queue and unlock the vault.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                 {[
                   { icon: <FiZap />, title: "Instant", desc: "Zero queue access." },
                   { icon: <FiHeart />, title: "Secret", desc: "Unlock hidden vibes." }
                 ].map((feat, i) => (
                   <div key={i} className="flex gap-4 p-5 bg-white/5 rounded-[2rem] border border-white/5 hover:bg-white/10 transition-all">
                      <div className="w-10 h-10 bg-brand-500/20 rounded-xl flex items-center justify-center text-brand-500">{feat.icon}</div>
                      <div className="space-y-0.5">
                        <p className="font-display font-black text-white text-xs uppercase">{feat.title}</p>
                        <p className="text-[9px] text-surface-500 font-bold uppercase tracking-widest">{feat.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="flex justify-center lg:justify-start">
                <button className="btn-primary !bg-white !text-black hover:!bg-brand-500 hover:!text-white !px-12 !py-5 text-xs">
                  Apply Now
                </button>
              </div>
            </div>

            <div className="flex-1 hidden lg:block perspective-2000">
               <motion.div 
                 initial={{ rotateY: 30, rotateX: 10, y: 50, opacity: 0 }}
                 whileInView={{ rotateY: 15, rotateX: 5, y: 0, opacity: 1 }}
                 whileHover={{ rotateY: 0, rotateX: 0, scale: 1.05 }}
                 transition={{ duration: 1.2, ease: "circOut" }}
                 className="w-full aspect-[1.6/1] bg-gradient-to-br from-zinc-800 via-black to-zinc-900 rounded-[3rem] p-16 border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative group overflow-hidden cursor-pointer"
               >
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  
                  <div className="relative z-10 flex justify-between items-start">
                     <motion.div 
                       animate={{ scale: [1, 1.1, 1] }}
                       transition={{ duration: 2, repeat: Infinity }}
                       className="w-14 h-14 bg-brand-500/20 rounded-xl flex items-center justify-center text-brand-500 text-2xl border border-brand-500/20"
                     >
                       <FiZap />
                     </motion.div>
                     <div className="text-right">
                       <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.8em]">Vibe Elite</p>
                       <p className="text-[7px] font-bold text-brand-500/60 uppercase tracking-[0.4em] mt-1">Status: Active</p>
                     </div>
                  </div>

                  <div className="absolute bottom-16 left-16 space-y-2">
                     <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Card Holder Unique ID</p>
                     <p className="text-2xl font-display font-black text-white tracking-[0.3em] uppercase drop-shadow-2xl">VIBE-ID-882</p>
                  </div>

                  {/* Holographic Shine Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[2000ms] pointer-events-none" />
               </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Vibe Check: Testimonials */}
      <section className="container mx-auto px-6 py-24 space-y-16">
        <div className="text-center space-y-4">
           <h2 className="text-5xl md:text-7xl font-display font-black text-white uppercase tracking-tighter">VIBE CHECK.</h2>
           <p className="text-lg text-surface-500 font-medium">Hear from our most frequent diners.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "Arjun Mehta", role: "Elite Member", text: "Truffle Noir is architectural perfection.", avatar: "32" },
            { name: "Sarah Khan", role: "Food Critic", text: "Finest dough fermentation in the city.", avatar: "44" },
            { name: "Vikram Singh", role: "Digital Artist", text: "Luxury unboxing experience every time.", avatar: "12" }
          ].map((item, i) => (
            <div key={i} className="p-10 bg-surface-100 rounded-[2.5rem] border border-white/5 space-y-6">
               <div className="flex text-amber-500 gap-1">
                 {[1,2,3,4,5].map(s => <FiStar key={s} className="fill-current w-3.5 h-3.5" />)}
               </div>
               <p className="text-lg text-white font-medium leading-relaxed italic">"{item.text}"</p>
               <div className="flex items-center gap-3">
                  <img src={`https://i.pravatar.cc/100?img=${item.avatar}`} alt={item.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="text-[10px] font-black text-white uppercase">{item.name}</p>
                    <p className="text-[8px] text-surface-500 font-bold uppercase tracking-widest">{item.role}</p>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="container mx-auto px-6 py-24 max-w-4xl">
        <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter mb-12">CURIOSITIES.</h2>
        <div className="space-y-2">
          <FAQItem question="What makes your dough different?" answer="Our 48-hour cold fermentation process using double-zero Italian flour results in a light, airy, and digestible crust." />
          <FAQItem question="How fast is delivery?" answer="18-minute guaranteed dispatch for Black Card members, sub-30 minutes for all other vibes." />
        </div>
      </section>

      {/* 8. Newsletter */}
      <section className="container mx-auto px-6 pb-24">
        <div className="bg-gradient-to-r from-brand-500 to-amber-500 rounded-[4rem] p-16 md:p-24 text-center space-y-10 relative overflow-hidden shadow-2xl">
           <div className="absolute inset-0 bg-black/5" />
           <div className="relative z-10 max-w-2xl mx-auto space-y-8">
              <h2 className="text-5xl md:text-7xl font-display font-black text-white uppercase tracking-tighter leading-none">
                JOIN THE <br/> ELITE.
              </h2>
              <p className="text-white/80 text-lg font-medium">Get access to secret drops and elite vouchers.</p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <input type="email" placeholder="vibe@example.com" className="flex-grow bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white placeholder-white/50 focus:outline-none text-sm font-bold" />
                <button type="submit" className="px-8 py-4 bg-white text-black rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-black hover:text-white transition-all shadow-xl">Subscribe</button>
              </form>
           </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
