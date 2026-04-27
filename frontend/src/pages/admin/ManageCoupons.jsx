import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FiTag, FiPlus, FiEdit2, FiTrash2, FiLoader, FiX, FiSave, FiPercent, FiDollarSign } from 'react-icons/fi';
import toast from 'react-hot-toast';

const API = 'http://localhost:5001/api';

const emptyForm = {
  code: '',
  discount: '',
  minOrder: '0',
  maxDiscount: '0',
  expiryDate: '',
  isActive: true
};

const ManageCoupons = () => {
  const { token } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/admin/coupons`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCoupons(res.data);
    } catch {
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const openAdd = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (c) => {
    setForm({
      code: c.code,
      discount: c.discount,
      minOrder: c.minOrder || 0,
      maxDiscount: c.maxDiscount || 0,
      expiryDate: c.expiryDate ? new Date(c.expiryDate).toISOString().split('T')[0] : '',
      isActive: c.isActive
    });
    setEditId(c.id);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        code: form.code.toUpperCase(),
        discount: Number(form.discount),
        minOrder: Number(form.minOrder),
        maxDiscount: Number(form.maxDiscount),
        expiryDate: form.expiryDate || '2027-12-31',
        isActive: form.isActive
      };

      if (editId) {
        await axios.put(`${API}/admin/coupons/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Coupon updated!');
      } else {
        await axios.post(`${API}/admin/coupons`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Coupon created!');
      }
      setShowModal(false);
      fetchCoupons();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to save coupon');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Delete coupon "${code}" permanently?`)) return;
    try {
      await axios.delete(`${API}/admin/coupons/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Coupon deleted');
      fetchCoupons();
    } catch {
      toast.error('Failed to delete coupon');
    }
  };

  const toggleActive = async (coupon) => {
    try {
      await axios.put(`${API}/admin/coupons/${coupon.id}`, { isActive: !coupon.isActive }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Coupon ${coupon.isActive ? 'deactivated' : 'activated'}`);
      fetchCoupons();
    } catch {
      toast.error('Failed to toggle coupon');
    }
  };

  return (
    <div className="pt-28 pb-20 container mx-auto px-6 min-h-screen max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
            <FiTag className="text-green-500 w-3 h-3" />
            <span className="text-[10px] font-black uppercase tracking-widest text-green-600">Coupon Management</span>
          </div>
          <h1 className="text-4xl font-display font-black text-surface-900 uppercase tracking-tighter">
            Manage <span className="text-gradient">Coupons</span>
          </h1>
          <p className="text-surface-500 font-medium text-sm">
            {coupons.length} coupons · {coupons.filter(c => c.isActive).length} active
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary !py-2.5 !text-xs flex items-center gap-2">
          <FiPlus /> Create Coupon
        </button>
      </div>

      {/* Coupons Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : coupons.length === 0 ? (
        <div className="card p-20 text-center">
          <FiTag className="w-16 h-16 text-surface-300 mx-auto mb-4" />
          <p className="text-surface-400 font-black uppercase tracking-widest text-[10px]">No coupons yet</p>
          <button onClick={openAdd} className="btn-primary !py-2.5 !text-xs mt-6 mx-auto">
            <FiPlus className="mr-2" /> Create Your First Coupon
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map(c => (
            <div key={c.id} className={`card p-6 group hover:scale-[1.02] transition-transform duration-300 ${!c.isActive ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${c.isActive ? 'bg-green-500' : 'bg-surface-400'}`}>
                    <FiPercent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-surface-900 tracking-tight">{c.code}</h3>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${c.isActive ? 'text-green-500' : 'text-red-500'}`}>
                      {c.isActive ? '● Active' : '● Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-surface-500 font-bold">Discount</span>
                  <span className="font-black text-brand-500">{c.discount}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-surface-500 font-bold">Min. Order</span>
                  <span className="font-black text-surface-900">₹{Number(c.minOrder || 0).toFixed(0)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-surface-500 font-bold">Max Discount</span>
                  <span className="font-black text-surface-900">₹{Number(c.maxDiscount || 0).toFixed(0)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-surface-500 font-bold">Expires</span>
                  <span className="font-bold text-surface-700">
                    {c.expiryDate ? new Date(c.expiryDate).toLocaleDateString('en-IN') : 'Never'}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-surface-200/50">
                <button
                  onClick={() => toggleActive(c)}
                  className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    c.isActive
                      ? 'bg-red-500/10 hover:bg-red-500/20 text-red-500'
                      : 'bg-green-500/10 hover:bg-green-500/20 text-green-600'
                  }`}
                >
                  {c.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => openEdit(c)} className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 rounded-xl transition-all" title="Edit">
                  <FiEdit2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(c.id, c.code)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all" title="Delete">
                  <FiTrash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="glass rounded-[2rem] p-8 w-full max-w-lg shadow-premium border border-white/10 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-surface-900 uppercase tracking-tighter">
                {editId ? 'Edit Coupon' : 'Create Coupon'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 bg-surface-200/50 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all">
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <input
                required
                placeholder="Coupon Code (e.g. WELCOME20)"
                value={form.code}
                onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                className="input-field !bg-surface-200/40 !text-surface-900 text-sm uppercase"
              />
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <FiPercent className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 w-4 h-4" />
                  <input
                    required
                    type="number"
                    min="1"
                    max="100"
                    placeholder="Discount %"
                    value={form.discount}
                    onChange={e => setForm({ ...form, discount: e.target.value })}
                    className="input-field !bg-surface-200/40 !text-surface-900 text-sm !pl-11"
                  />
                </div>
                <div className="relative">
                  <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 w-4 h-4" />
                  <input
                    type="number"
                    min="0"
                    placeholder="Min. Order ₹"
                    value={form.minOrder}
                    onChange={e => setForm({ ...form, minOrder: e.target.value })}
                    className="input-field !bg-surface-200/40 !text-surface-900 text-sm !pl-11"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 w-4 h-4" />
                  <input
                    type="number"
                    min="0"
                    placeholder="Max Discount ₹"
                    value={form.maxDiscount}
                    onChange={e => setForm({ ...form, maxDiscount: e.target.value })}
                    className="input-field !bg-surface-200/40 !text-surface-900 text-sm !pl-11"
                  />
                </div>
                <input
                  type="date"
                  value={form.expiryDate}
                  onChange={e => setForm({ ...form, expiryDate: e.target.value })}
                  className="input-field !bg-surface-200/40 !text-surface-900 text-sm"
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  className={`w-10 h-6 rounded-full transition-colors ${form.isActive ? 'bg-green-500' : 'bg-surface-300'}`}
                  onClick={() => setForm({ ...form, isActive: !form.isActive })}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow mt-0.5 transition-transform ${form.isActive ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-surface-700">
                  {form.isActive ? 'Active' : 'Inactive'}
                </span>
              </label>
              <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
                {saving ? <FiLoader className="animate-spin" /> : <FiSave />}
                {saving ? 'Saving...' : (editId ? 'Update Coupon' : 'Create Coupon')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCoupons;
