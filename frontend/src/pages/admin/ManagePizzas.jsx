import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FiPlus, FiEdit2, FiTrash2, FiLoader, FiX, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';

const API = 'http://localhost:5001/api';

const emptyForm = {
  name: '', image: '', price: '', category: 'veg', description: '', isAvailable: true
};

const ManagePizzas = () => {
  const { token } = useAuth();
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchPizzas = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/pizzas`);
      setPizzas(res.data.pizzas || res.data);
    } catch {
      toast.error('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPizzas(); }, []);

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowModal(true); };
  const openEdit = (p) => {
    setForm({ name: p.name, image: p.image, price: p.price, category: p.category, description: p.description || '', isAvailable: p.isAvailable });
    setEditId(p.id);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await axios.put(`${API}/pizzas/${editId}`, form, { headers: { Authorization: `Bearer ${token}` } });
        toast.success('Pizza updated!');
      } else {
        await axios.post(`${API}/pizzas`, form, { headers: { Authorization: `Bearer ${token}` } });
        toast.success('Pizza added to menu!');
      }
      setShowModal(false);
      fetchPizzas();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to save pizza');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this pizza from the menu?')) return;
    try {
      await axios.delete(`${API}/pizzas/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Pizza removed from menu');
      fetchPizzas();
    } catch {
      toast.error('Failed to delete pizza');
    }
  };

  return (
    <div className="pt-28 pb-20 container mx-auto px-6 min-h-screen max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-500/10 border border-brand-500/20 rounded-full">
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-500">🍕 Menu Management</span>
          </div>
          <h1 className="text-4xl font-display font-black text-surface-900 uppercase tracking-tighter">
            Manage <span className="text-gradient">Pizzas</span>
          </h1>
        </div>
        <button onClick={openAdd} className="btn-primary !py-2.5 !text-xs flex items-center gap-2">
          <FiPlus /> Add New Pizza
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pizzas.map(p => (
            <div key={p.id} className="card group overflow-hidden hover:scale-[1.02] transition-transform duration-300">
              <div className="relative h-44 overflow-hidden">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    p.category === 'veg' ? 'bg-green-500/90 text-white' :
                    p.category === 'non-veg' ? 'bg-red-500/90 text-white' :
                    'bg-amber-500/90 text-white'
                  }`}>{p.category}</span>
                </div>
                {!p.isAvailable && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white text-[10px] font-black uppercase tracking-widest">Unavailable</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-black text-surface-900 text-sm truncate">{p.name}</h3>
                <p className="text-xs text-surface-500 mt-1 line-clamp-2">{p.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-lg font-black text-brand-500">₹{Number(p.price).toFixed(2)}</span>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 rounded-xl transition-all" title="Edit">
                      <FiEdit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all" title="Delete">
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
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
                {editId ? 'Edit Pizza' : 'Add New Pizza'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 bg-surface-200/50 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all">
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <input required placeholder="Pizza Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="input-field !bg-surface-200/40 !text-surface-900 text-sm" />
              <input required placeholder="Image URL" value={form.image} onChange={e => setForm({...form, image: e.target.value})}
                className="input-field !bg-surface-200/40 !text-surface-900 text-sm" />
              <div className="grid grid-cols-2 gap-4">
                <input required type="number" placeholder="Price (₹)" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                  className="input-field !bg-surface-200/40 !text-surface-900 text-sm" />
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                  className="input-field !bg-surface-200/40 !text-surface-900 text-sm">
                  <option value="veg">Veg</option>
                  <option value="non-veg">Non-Veg</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
              <textarea placeholder="Description" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                className="input-field !bg-surface-200/40 !text-surface-900 text-sm resize-none" />
              <label className="flex items-center gap-3 cursor-pointer">
                <div className={`w-10 h-6 rounded-full transition-colors ${form.isAvailable ? 'bg-brand-500' : 'bg-surface-300'}`}
                  onClick={() => setForm({...form, isAvailable: !form.isAvailable})}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow mt-0.5 transition-transform ${form.isAvailable ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-surface-700">
                  {form.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </label>
              <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
                {saving ? <FiLoader className="animate-spin" /> : <FiSave />}
                {saving ? 'Saving...' : (editId ? 'Update Pizza' : 'Add to Menu')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePizzas;
