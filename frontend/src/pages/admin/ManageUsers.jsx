import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FiUsers, FiShield, FiTrash2, FiLoader, FiSearch, FiUserCheck, FiUserX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const API = 'http://localhost:5001/api';

const ManageUsers = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleRole = async (userId) => {
    setUpdatingId(userId);
    try {
      const res = await axios.put(`${API}/admin/users/${userId}/role`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Role changed to "${res.data.role}"`);
      fetchUsers();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update role');
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteUser = async (userId, name) => {
    if (!window.confirm(`Delete user "${name}" permanently?`)) return;
    try {
      await axios.delete(`${API}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('User deleted');
      fetchUsers();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to delete user');
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-28 pb-20 container mx-auto px-6 min-h-screen max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <FiUsers className="text-blue-500 w-3 h-3" />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">User Management</span>
          </div>
          <h1 className="text-4xl font-display font-black text-surface-900 uppercase tracking-tighter">
            Manage <span className="text-gradient">Users</span>
          </h1>
          <p className="text-surface-500 font-medium text-sm">
            {users.length} registered users · {users.filter(u => u.role === 'admin').length} admins
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field !pl-11 !py-3 !text-sm"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <FiUsers className="w-16 h-16 text-surface-300 mx-auto mb-4" />
            <p className="text-surface-400 font-black uppercase tracking-widest text-[10px]">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" id="users-table">
              <thead className="bg-surface-200/20">
                <tr>
                  {['ID', 'Avatar', 'Name', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.2em] text-surface-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200/30">
                {filtered.map(user => (
                  <tr key={user.id} className="hover:bg-surface-200/10 transition-colors group">
                    <td className="px-6 py-4 text-xs font-black text-brand-500">#{user.id}</td>
                    <td className="px-6 py-4">
                      <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-surface-200 group-hover:border-brand-500/50 transition-colors">
                        <img
                          src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=40`}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-surface-900">{user.name}</td>
                    <td className="px-6 py-4 text-xs text-surface-500">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                        user.role === 'admin'
                          ? 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                          : 'bg-blue-500/10 text-blue-600 border-blue-500/30'
                      }`}>
                        {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[10px] text-surface-400 font-bold whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      {user.email === 'Admin@Boss' ? (
                        <span className="text-[9px] font-black uppercase tracking-widest text-surface-400 flex items-center gap-1">
                          <FiShield className="w-3 h-3" /> Primary
                        </span>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleRole(user.id)}
                            disabled={updatingId === user.id}
                            className={`p-2 rounded-xl transition-all ${
                              user.role === 'admin'
                                ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600'
                                : 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-600'
                            }`}
                            title={user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                          >
                            {updatingId === user.id
                              ? <FiLoader className="w-3.5 h-3.5 animate-spin" />
                              : user.role === 'admin'
                                ? <FiUserX className="w-3.5 h-3.5" />
                                : <FiUserCheck className="w-3.5 h-3.5" />
                            }
                          </button>
                          <button
                            onClick={() => deleteUser(user.id, user.name)}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all"
                            title="Delete User"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
