import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiShoppingBag, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Navbar = () => {
  const cartContext = useCart();
  const authContext = useAuth();
  
  // Extremely defensive check to prevent application crash
  const cartCount = cartContext?.cartCount || 0;
  const user = authContext?.user;
  const isAuthenticated = authContext?.isAuthenticated;
  const logout = () => {
    authContext?.logout();
    toast.success('Goodbye, Vibers! See you soon.');
  };

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Orders', path: '/orders' },
    { name: 'Track', path: '/track' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'py-2' : 'py-4'}`}>
      <div className="container mx-auto px-6">
        <div className={`glass rounded-[1.5rem] px-6 py-2.5 flex items-center justify-between transition-all duration-500 ${isScrolled ? 'shadow-premium border-surface-200/50' : 'border-transparent'}`}>
          
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg overflow-hidden shadow-brand transition-transform group-hover:rotate-12">
              <img src="/Favicon.PNG" alt="Logo" className="w-full h-full object-cover" />
            </div>

            <span className="text-xl font-display font-black tracking-tighter text-surface-900">
              PIZZA<span className="text-brand-500">VIBE</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link !py-2 !px-4 !text-[13px] ${location.pathname === link.path ? 'text-surface-900 bg-surface-200/50' : ''}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link to="/cart" className="relative p-2.5 bg-surface-200/50 hover:bg-brand-500/10 rounded-xl transition-all group">
              <FiShoppingBag className="w-4 h-4 text-surface-900 group-hover:text-brand-500" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-brand animate-fade-in">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="h-6 w-[1px] bg-surface-200/50 hidden md:block" />

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex flex-col items-end mr-1">
                  <span className="text-[9px] font-black uppercase text-surface-900 tracking-tighter leading-none">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <span className="text-[7px] font-bold uppercase text-brand-500 tracking-[0.2em] leading-none mt-1">
                    {user?.role}
                  </span>
                </div>
                <button 
                  onClick={logout} 
                  className="p-2.5 bg-brand-500/10 hover:bg-brand-500/20 text-brand-500 rounded-xl transition-all group flex items-center gap-2"
                  title="Logout"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span className="text-[9px] font-black uppercase hidden lg:block">Logout</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary !py-2 !px-5 !rounded-xl !text-[10px]">
                Sign In
              </Link>
            )}

            {/* Mobile Toggle */}
            <button 
              className="md:hidden p-2.5 bg-surface-200/50 rounded-xl text-surface-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX className="w-4 h-4" /> : <FiMenu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-6 right-6 mt-2 animate-slide-up">
          <div className="glass rounded-[1.5rem] p-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link !flex !py-3 !text-[13px] ${location.pathname === link.path ? 'bg-surface-200/50 text-surface-900' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {isAuthenticated && (
              <button 
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="nav-link !flex !py-3 !text-[13px] text-brand-500 font-black border-t border-surface-200/50 mt-1"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};


export default Navbar;
