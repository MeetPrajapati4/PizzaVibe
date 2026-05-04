import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FiUserPlus, FiUsers, FiMail, FiUser, FiLoader, FiAlertCircle } from 'react-icons/fi';

const SupabaseUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inserting, setInserting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  
  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error.message);
      toast.error(`Failed to fetch users: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();    
    // Realtime subscription — auto-refresh on any change to 'Users' table
    const channel = supabase
      .channel('realtime:users')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'users' },
        () => fetchUsers()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // Insert user
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setInserting(true);
      const { data, error } = await supabase
        .from('users')
        .insert([
          { 
            name: formData.name, 
            email: formData.email,
            password: 'Password_123', // required by user model
            role: 'user'
          }
        ])
        .select();

      if (error) throw error;

      toast.success('User registered successfully!');
      setFormData({ name: '', email: '' });
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error('Error registering user:', error.message);
      toast.error(`Registration failed: ${error.message}`);
    } finally {
      setInserting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
            Supabase User Management
          </h1>
          <p className="text-slate-400 text-lg">Real-time database integration with premium UI</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Registration Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl shadow-2xl shadow-blue-500/10"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
                <FiUserPlus size={24} />
              </div>
              <h2 className="text-2xl font-semibold">Register New User</h2>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={inserting}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {inserting ? (
                  <FiLoader className="animate-spin" />
                ) : (
                  <>
                    <span>Register User</span>
                    <FiUserPlus className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* User List */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl shadow-2xl shadow-cyan-500/10 flex flex-col h-[600px]"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-cyan-500/20 rounded-2xl text-cyan-400">
                  <FiUsers size={24} />
                </div>
                <h2 className="text-2xl font-semibold">Database Records</h2>
              </div>
              <button 
                onClick={fetchUsers}
                className="text-slate-400 hover:text-white transition-colors p-2"
                title="Refresh"
              >
                <FiLoader className={loading ? 'animate-spin' : ''} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
              {loading && users.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
                  <FiLoader size={48} className="animate-spin text-blue-500" />
                  <p>Connecting to Supabase...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
                  <div className="p-6 bg-slate-900/50 rounded-full border border-slate-800">
                    <FiAlertCircle size={40} />
                  </div>
                  <p>No users found in the database</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {users.map((user, idx) => (
                      <motion.div
                        key={user.id || idx}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-slate-900/40 border border-slate-700/50 p-5 rounded-2xl hover:border-slate-600 transition-all group"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg text-slate-200 group-hover:text-blue-400 transition-colors">
                              {user.name}
                            </h3>
                            <p className="text-slate-400 text-sm flex items-center gap-2 mt-1">
                              <FiMail className="text-slate-600" />
                              {user.email}
                            </p>
                          </div>
                          <span className="text-[10px] uppercase tracking-widest text-slate-500 bg-slate-800 px-2 py-1 rounded-md">
                            {user.id ? `ID: ${user.id}` : 'PENDING'}
                          </span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-800/50 flex justify-between items-center text-[11px] text-slate-500">
                           <span>Active User</span>
                           <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseUsers;
