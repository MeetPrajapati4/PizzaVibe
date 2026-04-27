import React, { useState, useEffect, useMemo } from 'react';
import FoodCard from '../components/FoodCard.jsx';
import { FiSearch, FiLoader, FiChevronDown, FiZap } from 'react-icons/fi';
import { getByCategory, localizeItem } from '../externalApi.js';

const Menu = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState({ field: '', order: '' });
  const [isSortOpen, setIsSortOpen] = useState(false);

  const sortOptions = [
    { label: 'Featured', field: '', order: '' },
    { label: 'Price: Low to High', field: 'price', order: 'asc' },
    { label: 'Price: High to Low', field: 'price', order: 'desc' },
    { label: 'Customer Favorite', field: 'rate', order: 'desc' },
  ];

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const data = await getByCategory('pizzas');
        if (data) {
          const localized = data.map(item => localizeItem(item));
          setItems(localized);
        }
      } catch (error) {
        console.error("Failed to fetch menu:", error);
      }
      setLoading(false);
    };
    fetchItems();
  }, []);

  const processedItems = useMemo(() => {
    let result = [...items];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query)
      );
    }

    if (sortBy.field) {
      result.sort((a, b) => {
        const valA = a[sortBy.field];
        const valB = b[sortBy.field];
        if (sortBy.order === 'asc') return valA - valB;
        return valB - valA;
      });
    }

    return result;
  }, [items, searchQuery, sortBy]);

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <section className="container mx-auto px-6">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/10 border border-brand-500/20 rounded-full">
              <FiZap className="text-brand-500 w-3 h-3" />
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-500">Premium Pizza Gallery</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-black tracking-tighter text-surface-900 uppercase">
              The <span className="text-gradient">Vibe Menu</span>
            </h1>
            <p className="text-surface-500 font-medium text-lg leading-relaxed">
              Discover our handcrafted selection of artisan pizzas. Every dish is prepared with fresh ingredients and unique Vibe seasonings.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
             <div className="relative flex-grow md:w-64">
                <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-surface-400" />
                <input 
                  type="text" 
                  placeholder="Search our flavors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface-100 border border-surface-200 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-surface-900 focus:outline-none focus:border-brand-500 transition-all"
                />
             </div>

             <div className="relative w-full sm:w-auto">
                <button 
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="w-full sm:w-48 bg-surface-100 border border-surface-200 rounded-2xl py-4 px-6 flex items-center justify-between text-sm font-black uppercase tracking-widest text-surface-900 hover:border-brand-500 transition-all"
                >
                  <span className="truncate">{sortOptions.find(o => o.field === sortBy.field && o.order === sortBy.order)?.label || 'Sort By'}</span>
                  <FiChevronDown className={`transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
                </button>

                {isSortOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 glass rounded-2xl p-2 z-20 animate-slide-down shadow-2xl">
                    {sortOptions.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSortBy({ field: opt.field, order: opt.order });
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-colors ${sortBy.field === opt.field && sortBy.order === opt.order ? 'bg-brand-500 text-white' : 'text-surface-500 hover:bg-surface-200 hover:text-surface-900'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-12">
          <div className="px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest bg-brand-500 text-white shadow-brand">
            🍕 Signature Specials
          </div>
          <div className="h-[1px] flex-grow bg-surface-200/50" />
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <FiLoader className="w-12 h-12 text-brand-500 animate-spin" />
            <p className="text-surface-500 font-black uppercase tracking-[0.2em] text-[10px]">Filtering Best Flavors...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
            {processedItems.map((item) => (
              <FoodCard key={item.id} food={item} />
            ))}
          </div>
        )}

        {!loading && processedItems.length === 0 && (
          <div className="text-center py-20 card">
            <h3 className="text-xl font-black text-surface-900 mb-2">No vibe found</h3>
            <p className="text-surface-500 font-medium">Try another search or reset your filters.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Menu;
