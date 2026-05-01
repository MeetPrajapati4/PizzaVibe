import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (password.length < 1) {
      toast.error('Password is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success('Welcome back, Vibers!');
      navigate('/');
    } catch (err) {
      toast.error(err || 'Login failed. Please register.');
      navigate('/register');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden relative bg-surface-50">
      {/* Dynamic Background Decorative Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-brand-500/10 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-amber-500/10 blur-[100px] rounded-full -z-10 animate-float" />
      
      {/* Floating Italian Elements (Abstract) */}
      <div className="absolute top-1/4 left-10 w-12 h-12 border-2 border-brand-500/20 rounded-full animate-float -z-10 hidden lg:block" />
      <div className="absolute bottom-1/4 right-10 w-16 h-16 border-2 border-amber-500/20 rounded-2xl rotate-12 animate-float -z-10 hidden lg:block" style={{ animationDelay: '1s' }} />

      <div className="w-full max-w-[380px] animate-slide-up relative">
        <div className="glass p-5 md:p-8 rounded-[2rem] shadow-premium relative overflow-hidden border border-white/20">
          {/* Subtle Shine Effect */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <Link to="/" className="relative group">
                <div className="absolute -inset-2 bg-brand-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                <img 
                  src="/Favicon.PNG" 
                  alt="Logo" 
                  className="w-12 h-12 rounded-xl shadow-brand relative z-10 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110" 
                />
              </Link>
            </div>

            <h1 className="text-2xl font-display font-black text-surface-900 mb-1 tracking-tighter uppercase">
              WELCOME <span className="text-gradient">BACK</span>
            </h1>
            <p className="text-[8px] text-surface-400 font-black uppercase tracking-[0.25em]">
              Handcrafted with Vibe.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase tracking-[0.25em] text-surface-500 ml-1">Email</label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500 group-focus-within:text-brand-500 transition-colors text-xs" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="input-field !pl-10 !py-2.5 !bg-black/40 focus:!bg-black/60 text-[13px] text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[8px] font-black uppercase tracking-[0.25em] text-surface-500">Password</label>
                <button type="button" className="text-[7px] font-black uppercase tracking-widest text-brand-500 hover:underline">Reset?</button>
              </div>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500 group-focus-within:text-brand-500 transition-colors text-xs" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field !pl-10 !pr-10 !py-2.5 !bg-black/40 focus:!bg-black/60 text-[13px] text-white"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-500 hover:text-brand-500 transition-colors"
                >
                  {showPassword ? <FiEyeOff className="text-xs" /> : <FiEye className="text-xs" />}
                </button>
              </div>
            </div>


            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="btn-primary w-full !py-3 group shadow-lg relative overflow-hidden mt-1"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 text-[9px]">
                {isSubmitting ? 'Authenticating...' : 'Sign In Now'}
                {!isSubmitting && <FiArrowRight className="transition-transform group-hover:translate-x-1" />}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-brand-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </form>

          <div className="mt-6 text-center border-t border-surface-200/50 pt-5">
            <p className="text-[9px] text-surface-500 font-bold uppercase tracking-widest">
              No account? <Link to="/register" className="text-brand-500 font-black hover:underline ml-1">Join Now</Link>
            </p>
          </div>
        </div>
      </div>


    </div>
  );
};


export default Login;
