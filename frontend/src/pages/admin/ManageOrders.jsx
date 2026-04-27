import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FiRefreshCw, FiPackage, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';

const API = 'http://localhost:5001/api';

const statusOptions = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

const statusColor = {
  pending: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
  confirmed: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
  preparing: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
  out_for_delivery: 'bg-orange-500/10 text-orange-600 border-orange-500/30',
  delivered: 'bg-green-500/10 text-green-600 border-green-500/30',
  cancelled: 'bg-red-500/10 text-red-500 border-red-500/30',
};

const ManageOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [updating, setUpdating] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/orders/admin`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { status: filterStatus }
      });
      setOrders(res.data);
    } catch (e) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [filterStatus]);

  const updateStatus = async (orderId, status) => {
    setUpdating(orderId);
    try {
      await axios.put(`${API}/orders/${orderId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Order #${orderId} updated to "${status.replace('_', ' ')}"`);
      fetchOrders();
    } catch (e) {
      toast.error('Failed to update order status');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="pt-28 pb-20 container mx-auto px-6 min-h-screen max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-500/10 border border-brand-500/20 rounded-full">
            <FiPackage className="text-brand-500 w-3 h-3" />
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-500">Order Management</span>
          </div>
          <h1 className="text-4xl font-display font-black text-surface-900 uppercase tracking-tighter">
            Manage <span className="text-gradient">Orders</span>
          </h1>
        </div>
        <button onClick={fetchOrders} className="btn-secondary !py-2.5 !text-xs flex items-center gap-2">
          <FiRefreshCw /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {['all', ...statusOptions].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
              filterStatus === s
                ? 'bg-brand-500 text-white border-brand-500 shadow-brand'
                : 'border-surface-200 text-surface-500 hover:border-brand-500/50 hover:text-brand-500'
            }`}
          >
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <FiPackage className="w-16 h-16 text-surface-300 mx-auto mb-4" />
            <p className="text-surface-400 font-black uppercase tracking-widest text-[10px]">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-200/20">
                <tr>
                  {['ID', 'Customer', 'Phone', 'Amount', 'Payment', 'Status', 'Date', 'Update Status'].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.2em] text-surface-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200/30">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-surface-200/10 transition-colors">
                    <td className="px-6 py-4 text-xs font-black text-brand-500">#{order.id}</td>
                    <td className="px-6 py-4 text-xs font-bold text-surface-900">{order.user?.name || 'Guest'}</td>
                    <td className="px-6 py-4 text-xs text-surface-500">{order.phone}</td>
                    <td className="px-6 py-4 text-xs font-black text-surface-900">₹{Number(order.totalAmount).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase ${
                        order.paymentStatus === 'completed' ? 'bg-green-500/10 text-green-600' : 'bg-amber-500/10 text-amber-600'
                      }`}>
                        {order.paymentMethod} · {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${statusColor[order.status]}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[10px] text-surface-400 font-bold whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      {updating === order.id ? (
                        <FiLoader className="animate-spin text-brand-500" />
                      ) : (
                        <select
                          value={order.status}
                          onChange={e => updateStatus(order.id, e.target.value)}
                          className="bg-surface-200/50 border border-surface-200 rounded-xl text-[10px] font-black uppercase tracking-wide px-3 py-2 outline-none focus:border-brand-500 transition-colors cursor-pointer"
                        >
                          {statusOptions.map(s => (
                            <option key={s} value={s}>{s.replace('_', ' ')}</option>
                          ))}
                        </select>
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

export default ManageOrders;
