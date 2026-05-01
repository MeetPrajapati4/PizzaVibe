import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateProfile(formData.name, formData.email);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      toast.error(err || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate Initials Avatar
  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (!user) return null;

  return (
    <div className="pt-40 pb-20 container mx-auto px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-start gap-12">
          {/* Sidebar / Avatar Section */}
          <div className="w-full md:w-80 space-y-8 animate-slide-up">
            <div className="glass rounded-[3rem] p-8 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-brand-500/5 group-hover:bg-brand-500/10 transition-colors" />
              
              <div className="relative z-10">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-brand-500 to-amber-500 rounded-full flex items-center justify-center text-4xl font-display font-black text-white shadow-brand mb-6 border-4 border-surface-50">
                  {getInitials(user.name)}
                </div>
                <h2 className="text-2xl font-display font-black text-white tracking-tighter uppercase">{user.name}</h2>
                <p className="text-xs font-bold text-brand-500 uppercase tracking-widest mt-2">{user.role}</p>
              </div>

              {/* Decorative Glow */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-500/20 blur-3xl rounded-full" />
            </div>

            <div className="glass rounded-[2.5rem] p-8 space-y-4">
               <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-surface-500 border-b border-white/5 pb-4">
                  <span>Membership</span>
                  <span className="text-brand-500">Elite</span>
               </div>
               <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-surface-500">
                  <span>Joined</span>
                  <span className="text-white">May 2026</span>
               </div>
            </div>
          </div>

          {/* Main Info Section */}
          <div className="flex-grow space-y-8 animate-slide-up stagger-1">
             <div className="flex items-center justify-between mb-2">
                <h1 className="text-4xl md:text-5xl font-display font-black text-white uppercase tracking-tighter">Your <span className="text-gradient">Vibe</span></h1>
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="p-3 bg-white/5 hover:bg-brand-500/10 text-white hover:text-brand-500 rounded-2xl transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest border border-white/5"
                  >
                    <FiEdit2 /> Edit Profile
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="p-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-2xl transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest border border-rose-500/20"
                  >
                    <FiX /> Cancel
                  </button>
                )}
             </div>

             <div className="glass rounded-[3rem] p-10 md:p-12 relative overflow-hidden">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Name Field */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-surface-500 ml-1">Full Name</label>
                      <div className="relative group">
                        <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500 group-focus-within:text-brand-500 transition-colors" />
                        <input 
                          type="text" 
                          disabled={!isEditing}
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={`input-field !pl-12 !bg-black/40 ${!isEditing ? 'opacity-60 cursor-not-allowed grayscale' : 'focus:!bg-black/60'}`}
                          placeholder="Your Name"
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-surface-500 ml-1">Email Address</label>
                      <div className="relative group">
                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500 group-focus-within:text-brand-500 transition-colors" />
                        <input 
                          type="email" 
                          disabled={!isEditing}
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`input-field !pl-12 !bg-black/40 ${!isEditing ? 'opacity-60 cursor-not-allowed grayscale' : 'focus:!bg-black/60'}`}
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="pt-6 animate-fade-in">
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="btn-primary w-full md:w-auto flex items-center justify-center gap-3 !px-12"
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <FiSave className="text-lg" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </form>

                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 blur-[100px] -z-10 rounded-full" />
             </div>

             {/* Loyalty Info */}
             <div className="grid md:grid-cols-2 gap-8 animate-slide-up stagger-2">
                <div className="glass rounded-[2.5rem] p-8 flex items-center gap-6 group hover:border-brand-500/30 transition-all">
                   <div className="w-16 h-16 bg-brand-500/10 rounded-2xl flex items-center justify-center text-brand-500 text-2xl font-black">
                      05
                   </div>
                   <div>
                      <p className="text-xs font-black uppercase tracking-widest text-surface-500 mb-1">Orders Placed</p>
                      <p className="text-white font-medium">Keep the vibe going!</p>
                   </div>
                </div>
                <div className="glass rounded-[2.5rem] p-8 flex items-center gap-6 group hover:border-amber-500/30 transition-all">
                   <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 text-2xl font-black">
                      450
                   </div>
                   <div>
                      <p className="text-xs font-black uppercase tracking-widest text-surface-500 mb-1">Vibe Points</p>
                      <p className="text-white font-medium">10% off next order</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
