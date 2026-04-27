import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import {
  FiTrendingUp, FiShoppingBag, FiUsers, FiDollarSign,
  FiArrowUpRight, FiGrid, FiList, FiClock, FiCheckCircle
} from 'react-icons/fi';

const API = 'http://localhost:5001/api';

const StatCard = ({ title, value, change, icon, color }) => (
  <div className="card p-6 group hover:scale-[1.02] transition-transform duration-300">
    <div className="flex items-start justify-between mb-6">
      <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-6`}>
        {icon}
      </div>
      <span className="flex items-center gap-1 text-green-500 text-[10px] font-black uppercase tracking-widest bg-green-500/10 px-2 py-1 rounded-full">
        <FiArrowUpRight /> {change}
      </span>
    </div>
    <p className="text-[9px] font-black text-surface-400 uppercase tracking-[0.2em] mb-1">{title}</p>
    <h3 className="text-3xl font-black text-surface-900">{value}</h3>
  </div>
);

const statusColor = {
  pending: 'bg-amber-500/10 text-amber-600',
  confirmed: 'bg-blue-500/10 text-blue-600',
  preparing: 'bg-purple-500/10 text-purple-600',
  out_for_delivery: 'bg-orange-500/10 text-orange-600',
  delivered: 'bg-green-500/10 text-green-600',
  cancelled: 'bg-red-500/10 text-red-500',
};

const Dashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API}/orders/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (e) {
        console.error('Failed to load stats', e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  const statCards = [
    { title: 'Total Revenue', value: stats ? `₹${Number(stats.totalRevenue).toFixed(2)}` : '...', change: 'Live', icon: <FiDollarSign />, color: 'bg-green-500' },
    { title: 'Total Orders', value: stats?.totalOrders ?? '...', change: 'Live', icon: <FiShoppingBag />, color: 'bg-brand-500' },
    { title: 'Total Users', value: stats?.totalUsers ?? '...', change: 'Live', icon: <FiUsers />, color: 'bg-blue-500' },
    { title: 'Avg. Rating', value: '4.9★', change: '+2.1%', icon: <FiTrendingUp />, color: 'bg-amber-500' },
  ];

  return (
    <div className="pt-28 pb-20 container mx-auto px-6 min-h-screen max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-500/10 border border-brand-500/20 rounded-full">
            <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-500">Live Control Center</span>
          </div>
          <h1 className="text-4xl font-display font-black text-surface-900 uppercase tracking-tighter">
            Admin <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-surface-500 font-medium text-sm">Manage your pizza empire with real-time insights.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/orders" className="btn-secondary !py-2.5 !text-xs flex items-center gap-2">
            <FiList /> Manage Orders
          </Link>
          <Link to="/admin/pizzas" className="btn-primary !py-2.5 !text-xs flex items-center gap-2">
            <FiGrid /> Manage Menu
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* Recent Orders */}
      <div className="card p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-surface-900 flex items-center gap-3">
            <FiClock className="text-brand-500" /> Recent Orders
          </h3>
          <Link to="/admin/orders" className="text-[10px] font-black uppercase tracking-widest text-brand-500 hover:underline">
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : stats?.recentOrders?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-surface-200/50">
                  {['Order ID', 'Customer', 'Amount', 'Status', 'Date'].map(h => (
                    <th key={h} className="pb-4 text-[9px] font-black uppercase tracking-[0.2em] text-surface-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200/30">
                {stats.recentOrders.map(order => (
                  <tr key={order.id} className="group hover:bg-surface-200/10 transition-colors">
                    <td className="py-4 text-xs font-black text-brand-500">#{order.id}</td>
                    <td className="py-4 text-xs font-bold text-surface-900">{order.user?.name || 'Guest'}</td>
                    <td className="py-4 text-xs font-black text-surface-900">₹{Number(order.totalAmount).toFixed(2)}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${statusColor[order.status] || 'bg-surface-200 text-surface-500'}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 text-[10px] text-surface-400 font-bold">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FiCheckCircle className="w-12 h-12 text-surface-300 mx-auto mb-4" />
            <p className="text-surface-400 font-bold uppercase tracking-widest text-[10px]">No orders yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
