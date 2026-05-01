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

      {/* 1. Hero: The Grand Entrance */}
      <section className="min-h-screen relative flex items-center pt-32 pb-20" ref={heroRef}>
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-4 px-6 py-2.5 bg-white/5 border border-white/10 rounded-full"
            >
              <span className="w-2.5 h-2.5 bg-brand-500 rounded-full animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-surface-400">Defining Culinary Architecture</span>
            </motion.div>

            <h1 className="text-7xl md:text-[9.5rem] font-display font-black leading-[0.8] tracking-tighter text-white uppercase">
              <span className="hero-line block overflow-hidden">PURE</span>
              <span className="hero-line block animate-text-shimmer overflow-hidden">VIBE.</span>
              <span className="hero-line block overflow-hidden">ZERO LIES.</span>
            </h1>

            <p className="text-xl md:text-2xl text-surface-500 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              We don't just make pizza. We curate a high-fidelity sensory experience using 48-hour fermented dough and rare artisanal toppings.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-10 justify-center lg:justify-start">
              <Link to="/menu" className="btn-primary !px-16 !py-6 text-sm group shadow-[0_30px_60px_rgba(255,77,79,0.2)]">
                Explore The Gallery
                <FiArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
              </Link>
              <div className="flex items-center gap-6">
                <div className="flex -space-x-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-14 h-14 rounded-full border-4 border-surface-50 overflow-hidden shadow-2xl">
                      <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="User" />
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-lg font-black text-white leading-none">150K+</p>
                  <p className="text-[10px] font-bold text-surface-500 uppercase tracking-widest">Global Vibers</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <motion.div style={{ rotate: pizzaRotate, scale: pizzaScale }} className="relative z-10">
               <TiltContainer intensity={20}>
                 <div className="rounded-full overflow-hidden border-[1.5rem] border-white/5 shadow-[0_100px_200px_-50px_rgba(0,0,0,0.8)]">
                    <img 
                      src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&q=100" 
                      alt="The Masterpiece"
                      className="w-full aspect-square object-cover"
                    />
                 </div>
               </TiltContainer>
            </motion.div>
            
            {/* Floating Accents */}
            <div className="absolute -top-10 -right-10 glass p-8 rounded-[3rem] shadow-2xl z-20 hidden lg:block border-white/5">
               <div className="flex items-center gap-5">
                 <div className="w-14 h-14 bg-brand-500 rounded-2xl flex items-center justify-center text-white">
                   <FiClock className="w-7 h-7" />
                 </div>
                 <div>
                   <p className="text-sm font-black text-white uppercase">Fast Track</p>
                   <p className="text-[10px] text-surface-500 font-bold tracking-widest uppercase">18 MIN DISPATCH</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Global Stats: Trust Symbols */}
      <section className="bg-surface-100 py-24 rounded-[5rem] mx-4 border border-white/5">
        <div className="container mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          <div className="space-y-2">
            <p className="text-6xl md:text-8xl font-display font-black text-white tracking-tighter"><span className="stat-number" data-target="48">0</span>H</p>
            <p className="text-[10px] font-black text-brand-500 uppercase tracking-[0.4em]">Fermentation</p>
          </div>
          <div className="space-y-2">
            <p className="text-6xl md:text-8xl font-display font-black text-white tracking-tighter"><span className="stat-number" data-target="96">0</span>%</p>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Satisfaction</p>
          </div>
          <div className="space-y-2">
            <p className="text-6xl md:text-8xl font-display font-black text-white tracking-tighter"><span className="stat-number" data-target="12">0</span>K</p>
            <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">Daily Orders</p>
          </div>
          <div className="space-y-2">
            <p className="text-6xl md:text-8xl font-display font-black text-white tracking-tighter"><span className="stat-number" data-target="5">0</span>/5</p>
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Vibe Rating</p>
          </div>
        </div>
      </section>

      {/* 3. The Process: Behind the Art */}
      <section className="container mx-auto px-6 py-32 space-y-32">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
           <h2 className="text-6xl md:text-9xl font-display font-black text-white uppercase tracking-tighter leading-[0.8]">
             THE ANATOMY OF <br/>
             <span className="text-gradient">PERFECTION.</span>
           </h2>
           <p className="text-xl text-surface-500 font-medium leading-relaxed">
             From the mineral content of our water to the altitude at which our tomatoes grow, we obsess over every granular detail to ensure your vibe is uninterrupted.
           </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-16">
          <div className="space-y-10 group">
             <div className="relative h-96 rounded-[3rem] overflow-hidden bg-surface-200">
                <img src="https://images.unsplash.com/photo-1556290624-9f4a0a58339c?w=800" alt="Dough" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-8 left-8 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-black font-black text-xl">01</div>
             </div>
             <div className="space-y-4 px-4">
                <h3 className="text-3xl font-display font-black text-white uppercase tracking-tighter">48H Slow Proof</h3>
                <p className="text-surface-500 text-sm leading-relaxed">Natural levitation process that breaks down starches, creating a crust that is incredibly light, airy, and easily digestible.</p>
             </div>
          </div>

          <div className="space-y-10 group lg:translate-y-20">
             <div className="relative h-96 rounded-[3rem] overflow-hidden bg-surface-200">
                <img src="https://images.unsplash.com/photo-1628515670304-7667d4039162?w=800" alt="Ingredients" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-8 left-8 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-black font-black text-xl">02</div>
             </div>
             <div className="space-y-4 px-4">
                <h3 className="text-3xl font-display font-black text-white uppercase tracking-tighter">Rare Sourcing</h3>
                <p className="text-surface-500 text-sm leading-relaxed">DOP San Marzano tomatoes and Buffalo Mozzarella flown in weekly from small cooperatives in Campania, Italy.</p>
             </div>
          </div>

          <div className="space-y-10 group lg:translate-y-40">
             <div className="relative h-96 rounded-[3rem] overflow-hidden bg-surface-200">
                <img src="https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?w=800" alt="Firing" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-8 left-8 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-black font-black text-xl">03</div>
             </div>
             <div className="space-y-4 px-4">
                <h3 className="text-3xl font-display font-black text-white uppercase tracking-tighter">Volcanic Heat</h3>
                <p className="text-surface-500 text-sm leading-relaxed">Blasted for 90 seconds at 450°C in our custom-built volcanic stone ovens for the perfect leopard-spotted char.</p>
             </div>
          </div>
        </div>
      </section>

      {/* 4. Signature Showcase */}
      <section className="container mx-auto px-6 py-40">
        <div className="flex flex-col md:flex-row items-end justify-between gap-12 mb-24">
           <div className="space-y-6">
              <div className="px-5 py-2 bg-brand-500/10 border border-brand-500/20 rounded-full inline-block">
                 <span className="text-[10px] font-black text-brand-500 uppercase tracking-widest">Seasonal drops</span>
              </div>
              <h2 className="text-7xl md:text-8xl font-display font-black text-white uppercase tracking-tighter leading-none">
                THE ELITE <br/>
                <span className="text-gradient">COLLECTION.</span>
              </h2>
           </div>
           <Link to="/menu" className="btn-secondary !px-12 !py-5 text-xs group">
             Full Menu Gallery
             <FiArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
           </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          <ChefPickCard 
            name="Truffle Noir"
            price="749"
            image="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800"
            tag="Elite Drop"
            description="Freshly shaved black truffles, truffle-infused honey, and fior di latte."
          />
          <ChefPickCard 
            name="Volcano Spicy"
            price="589"
            image="https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800"
            tag="Trending"
            description="Nduja sausage, calabrian chili oil, and spicy honey drizzle."
          />
          <ChefPickCard 
            name="Pesto Paradiso"
            price="629"
            image="https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=800"
            tag="Signature"
            description="House-made basil pesto, sun-dried tomatoes, and toasted pine nuts."
          />
        </div>
      </section>

      {/* 5. Vibe Black Card: The Experience */}
      <section className="container mx-auto px-6 pb-40">
        <div className="bg-black rounded-[5rem] p-12 md:p-32 relative overflow-hidden border border-white/10 group">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-blue-500/10 opacity-30" />
          <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-brand-500/5 blur-[200px] rounded-full translate-x-1/2 -translate-y-1/2" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-24">
            <div className="flex-1 space-y-12">
              <div className="space-y-6">
                <h2 className="text-6xl md:text-[8rem] font-display font-black text-white uppercase tracking-tighter leading-[0.85]">
                  OWN THE <br/>
                  <span className="text-gradient">BLACK CARD.</span>
                </h2>
                <p className="text-xl text-surface-400 font-medium leading-relaxed max-w-xl">
                  Not a loyalty program. An invitation to the inner circle. Limited to 1,000 members per city.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                 {[
                   { icon: <FiZap />, title: "Instant Dispatch", desc: "Skip the queue entirely." },
                   { icon: <FiShield />, title: "Private Events", desc: "Monthly tasting sessions." },
                   { icon: <FiHeart />, title: "Secret Menu", desc: "Unlock hidden recipes." },
                   { icon: <FiStar />, title: "Elite Vibe", desc: "Concierge-level support." }
                 ].map((feat, i) => (
                   <div key={i} className="flex gap-4 p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all">
                      <div className="w-12 h-12 bg-brand-500/20 rounded-xl flex items-center justify-center text-brand-500 text-xl">{feat.icon}</div>
                      <div className="space-y-1">
                        <p className="font-display font-black text-white text-sm uppercase">{feat.title}</p>
                        <p className="text-[10px] text-surface-500 font-bold uppercase tracking-widest">{feat.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>

              <button className="btn-primary !bg-white !text-black hover:!bg-brand-500 hover:!text-white !px-16 !py-6 text-sm">
                Apply For Membership
              </button>
            </div>

            <div className="flex-1 perspective-1000 hidden lg:block">
               <motion.div 
                 animate={{ rotateY: [-10, 10, -10], y: [0, -20, 0] }}
                 transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                 className="w-full aspect-[1.6/1] bg-gradient-to-br from-zinc-800 to-black rounded-[4rem] p-20 border border-white/10 shadow-[0_80px_150px_rgba(0,0,0,0.8)] relative group overflow-hidden"
               >
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                  <div className="relative z-10 flex justify-between">
                     <div className="w-20 h-20 bg-brand-500/20 rounded-2xl flex items-center justify-center text-brand-500 text-3xl">
                       <FiZap />
                     </div>
                     <p className="text-xs font-black text-white/20 uppercase tracking-[0.8em]">Vibe Elite</p>
                  </div>
                  <div className="absolute bottom-20 left-20">
                     <p className="text-4xl font-display font-black text-white tracking-widest uppercase">VIBE-ID-882</p>
                  </div>
               </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Vibe Check: Testimonials */}
      <section className="container mx-auto px-6 py-32 space-y-24">
        <div className="text-center space-y-6">
           <h2 className="text-6xl md:text-8xl font-display font-black text-white uppercase tracking-tighter">THE VIBE CHECK.</h2>
           <p className="text-xl text-surface-500 font-medium">Hear from our most frequent diners about their sensory journey.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {[
            { name: "Arjun Mehta", role: "Vibe Elite Member", text: "The Truffle Noir is architectural perfection. The char on the crust is exactly what I was looking for.", avatar: "32" },
            { name: "Sarah Khan", role: "Food Critic", text: "Finally, a brand that cares as much about the dough fermentation as they do about the visual vibe.", avatar: "44" },
            { name: "Vikram Singh", role: "Digital Artist", text: "Every order feels like a luxury unboxing experience. The delivery is shockingly fast.", avatar: "12" }
          ].map((item, i) => (
            <div key={i} className="p-12 bg-surface-100 rounded-[3rem] border border-white/5 space-y-8 hover:bg-surface-200 transition-colors">
               <div className="flex text-amber-500 gap-1">
                 {[1,2,3,4,5].map(s => <FiStar key={s} className="fill-current w-4 h-4" />)}
               </div>
               <p className="text-xl text-white font-medium leading-relaxed italic">"{item.text}"</p>
               <div className="flex items-center gap-4">
                  <img src={`https://i.pravatar.cc/100?img=${item.avatar}`} alt={item.name} className="w-12 h-12 rounded-full border border-white/10" />
                  <div>
                    <p className="text-sm font-black text-white uppercase">{item.name}</p>
                    <p className="text-[10px] text-surface-500 font-bold uppercase tracking-widest">{item.role}</p>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FAQ: Common Curiosities */}
      <section className="container mx-auto px-6 py-32 max-w-5xl">
        <div className="mb-20">
           <h2 className="text-5xl font-display font-black text-white uppercase tracking-tighter">CURIOSITIES.</h2>
        </div>
        <div className="space-y-4">
          <FAQItem 
            question="What makes your dough different?" 
            answer="Our dough undergoes a rigorous 48-hour cold fermentation process using only water, salt, yeast, and double-zero Italian flour. This results in a crust that is low in gluten and high in texture."
          />
          <FAQItem 
            question="How fast is the 'Elite' delivery?" 
            answer="Our Black Card members enjoy 18-minute guaranteed dispatch. For standard orders, we aim for sub-30 minute delivery via our hyper-local logistics network."
          />
          <FAQItem 
            question="Do you offer Vegan or Gluten-Free vibes?" 
            answer="Absolutely. We offer a selection of organic vegan cheeses and a special cauliflower-based crust that maintains the architectural integrity of our pizzas."
          />
          <FAQItem 
            question="Where do you source your ingredients?" 
            answer="We source over 80% of our ingredients directly from small-scale artisanal producers in Italy and local organic farms that meet our elite sustainability standards."
          />
        </div>
      </section>

      {/* 8. Newsletter: Join the Elite */}
      <section className="container mx-auto px-6 pb-32">
        <div className="bg-gradient-to-r from-brand-500 to-amber-500 rounded-[5rem] p-20 md:p-40 text-center space-y-12 relative overflow-hidden shadow-2xl">
           <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
           <div className="relative z-10 max-w-3xl mx-auto space-y-10">
              <h2 className="text-6xl md:text-8xl font-display font-black text-white uppercase tracking-tighter leading-none">
                NEVER MISS <br/> A DROP.
              </h2>
              <p className="text-white/80 text-xl font-medium">Join the mailing list for secret drops, limited collections, and elite vouchers.</p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                <input 
                  type="email" 
                  placeholder="vibe@example.com" 
                  className="flex-grow bg-white/10 border border-white/20 rounded-2xl px-8 py-5 text-white placeholder-white/50 focus:outline-none focus:bg-white/20 transition-all text-sm font-bold"
                />
                <button type="submit" className="px-10 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all shadow-xl">
                  Subscribe
                </button>
              </form>
           </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
