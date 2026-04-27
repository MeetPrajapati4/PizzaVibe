import React from 'react';
import { FiPackage, FiClock, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Orders = () => {
  // Mock data for demo purposes
  const mockOrders = [
    {
      id: '#PV-8291',
      date: 'Oct 24, 2024',
      status: 'Delivered',
      total: 34.50,
      items: ['Truffle Mushroom', 'Diavola']
    },
    {
      id: '#PV-8292',
      date: 'Oct 26, 2024',
      status: 'In Transit',
      total: 21.00,
      items: ['Burrata Bliss']
    }
  ];

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

        {mockOrders.length > 0 ? (
          <div className="space-y-6">
            {mockOrders.map((order) => (
              <div key={order.id} className="card p-8 group hover:border-brand-500/30 transition-all duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg ${order.status === 'Delivered' ? 'bg-green-500' : 'bg-brand-500 animate-pulse'}`}>
                      {order.status === 'Delivered' ? <FiCheckCircle className="w-8 h-8" /> : <FiClock className="w-8 h-8" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm font-black text-surface-900">{order.id}</span>
                        <span className={`badge ${order.status === 'Delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-brand-500/10 text-brand-500 border-brand-500/20'}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-surface-400 font-bold uppercase tracking-widest">{order.date}</p>
                    </div>
                  </div>

                  <div className="flex-grow md:px-12">
                    <p className="text-sm text-surface-500 font-medium leading-relaxed">
                      {order.items.join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center justify-between md:block text-right">
                    <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest md:block md:mb-1">Total Paid</span>
                    <span className="text-2xl font-black text-surface-900">
                      <span className="text-brand-500 text-sm mr-1">$</span>
                      {order.total.toFixed(2)}
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
