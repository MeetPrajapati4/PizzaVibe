import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiMail, FiMapPin, FiPhone, FiArrowUpRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-50 pt-20 pb-10 border-t border-white/5 relative overflow-hidden">
      {/* Massive Background Text */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-[20vw] font-display font-black text-white/[0.02] select-none pointer-events-none whitespace-nowrap">
        PIZZAVIBE
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand Column */}
          <div className="space-y-8">
            <Link to="/" className="inline-block">
               <span className="text-3xl font-display font-black tracking-tighter text-white">
                PIZZA<span className="text-brand-500">VIBE.</span>
              </span>
            </Link>
            <p className="text-surface-500 font-medium leading-relaxed max-w-xs">
              Crafting elite Italian experiences since 2026. Every slice is a masterpiece, every bite is a vibe. Join the movement.
            </p>
            <div className="flex gap-4">
              {[FiInstagram, FiTwitter, FiFacebook].map((Icon, i) => (
                <motion.a 
                  key={i}
                  href="#" 
                  whileHover={{ y: -5, color: '#ff4d4f' }}
                  className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-brand-500">Navigation</h4>
            <ul className="space-y-4">
              {['Home', 'Menu', 'About', 'Orders'].map((item) => (
                <li key={item}>
                  <Link 
                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                    className="group flex items-center gap-2 text-surface-400 hover:text-white font-bold transition-all"
                  >
                    <span className="w-0 group-hover:w-4 h-[2px] bg-brand-500 transition-all overflow-hidden" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-brand-500">Contact</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <FiMapPin className="text-brand-500 w-5 h-5 mt-1" />
                <span className="text-surface-400 font-medium">123 Vibe Street, <br />Mumbai, MH 400001</span>
              </li>
              <li className="flex items-center gap-4">
                <FiPhone className="text-brand-500 w-5 h-5" />
                <span className="text-surface-400 font-medium">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-4">
                <FiMail className="text-brand-500 w-5 h-5" />
                <span className="text-surface-400 font-medium">hello@pizzavibe.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-brand-500">Join the Vibe</h4>
            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 space-y-4">
              <p className="text-sm text-white font-bold">Subscribe for elite rewards.</p>
              <div className="relative group">
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-surface-500 focus:outline-none focus:border-brand-500/50 transition-all"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-500 hover:text-white transition-colors">
                  <FiArrowUpRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-surface-600">
            &copy; {currentYear} PIZZAVIBE. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-surface-600 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-surface-600 hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
