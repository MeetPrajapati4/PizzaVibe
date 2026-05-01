import React, { useState, useEffect } from 'react';
import { FiPackage, FiClock, FiCheckCircle, FiLoader, FiArrowRight } from 'react-icons/fi';
import { OrderRowSkeleton } from '../components/SkeletonLoader.jsx';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 container mx-auto px-6 min-h-screen">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-20 w-48 bg-surface-200 animate-pulse rounded-2xl mb-8" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-8"><OrderRowSkeleton /></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 container mx-auto px-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-16">
          <div className="space-y-4">
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/10 border border-brand-500/20 rounded-full">
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-500">History</span>
            </div>
            <h1 className="text-5xl font-display font-black text-surface-900">YOUR <span className="text-gradient">ORDERS</span></h1>
            <p className="text-surface-500 font-medium">Track your current deliveries and look back at your past vibes.</p>
          </div>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="card p-8 group hover:border-brand-500/30 transition-all duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg ${order.status === 'delivered' ? 'bg-green-500' : 'bg-brand-500 animate-pulse'}`}>
                      {order.status === 'delivered' ? <FiCheckCircle className="w-8 h-8" /> : <FiClock className="w-8 h-8" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm font-black text-surface-900 uppercase">#PV-{order.id.toString().slice(-4)}</span>
                        <span className={`badge uppercase ${order.status === 'delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-brand-500/10 text-brand-500 border-brand-500/20'}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-surface-400 font-bold uppercase tracking-widest">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex-grow md:px-12">
                    <p className="text-sm text-surface-500 font-medium leading-relaxed">
                      {order.items?.map(item => `${item.quantity}x ${item.name}`).join(', ') || 'Processing items...'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between md:block text-right">
                    <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest md:block md:mb-1">Total Paid</span>
                    <span className="text-2xl font-black text-surface-900">
                      <span className="text-brand-500 text-sm mr-1">₹</span>
                      {parseFloat(order.totalAmount).toFixed(2)}
                    </span>
                  </div>
                </div>
                

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 card bg-surface-100/50">
            <div className="w-20 h-20 bg-surface-200 rounded-full flex items-center justify-center mx-auto mb-6 text-surface-400">
              <FiPackage className="w-10 h-10" />
            </div>
            <p className="text-surface-500 font-bold text-lg mb-8">No orders yet. Your recent pizzas will appear here.</p>
            <Link to="/menu" className="btn-primary">
              Order your first Pizza
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
