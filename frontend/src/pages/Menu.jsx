import React, { useState, useEffect, useMemo, useCallback } from 'react';
import FoodCard from '../components/FoodCard.jsx';
import { FoodCardSkeleton } from '../components/SkeletonLoader.jsx';
import { FiSearch, FiLoader, FiChevronDown, FiZap } from 'react-icons/fi';
import { getByCategory, localizeItem } from '../externalApi.js';
import { useAuth } from '../context/AuthContext';

const SHUFFLE_KEY = 'pizzavibe_menu_shuffle';
const SHUFFLE_INTERVAL_MS = 12 * 60 * 60 * 1000; // 12 hours

const seededShuffle = (array, seed) => {
  const shuffled = [...array];
  let currentSeed = seed;
  const nextRandom = () => {
    currentSeed = (currentSeed * 16807 + 0) % 2147483647;
    return (currentSeed - 1) / 2147483646;
  };
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(nextRandom() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const getShuffleSeed = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(SHUFFLE_KEY));
    if (stored && Date.now() - stored.timestamp < SHUFFLE_INTERVAL_MS) {
      return stored.seed;
    }
  } catch { /* ignore corrupt data */ }
  const newSeed = Math.floor(Math.random() * 2147483646) + 1;
  localStorage.setItem(SHUFFLE_KEY, JSON.stringify({ seed: newSeed, timestamp: Date.now() }));
  return newSeed;
};

const Menu = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState({ field: '', order: '' });
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState(null);

  const sortOptions = [
    { label: 'Featured', field: '', order: '' },
    { label: 'Price: Low to High', field: 'price', order: 'asc' },
    { label: 'Price: High to Low', field: 'price', order: 'desc' },
    { label: 'Customer Favorite', field: 'rate', order: 'desc' },
  ];

  // Generate a new shuffle seed on login; reuse within 12-hour window
  useEffect(() => {
    if (user) {
      setShuffleSeed(getShuffleSeed());
    } else {
      setShuffleSeed(null);
    }
  }, [user]);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const data = await getByCategory('pizzas');
        let finalItems = [];

        if (data && Array.isArray(data) && data.length > 0) {
          finalItems = data.map(item => localizeItem(item));
        } else {
          // --- HIGH-FIDELITY FALLBACK (Ensures Menu Always Shows) ---
          const fallback = [
            { id: 'f1', name: 'Classic Margherita', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80', price: 299, category: 'veg', description: 'Fresh mozzarella, tomato sauce, and aromatic basil.' },
            { id: 'f2', name: 'Truffle Mushroom Italian', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&q=80', price: 589, category: 'premium', description: 'Wild mushrooms with truffle oil and fresh thyme.' },
            { id: 'f3', name: 'Prawn Pesto', image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=800&q=80', price: 649, category: 'premium', description: 'Tiger prawns, house-made basil pesto, and goat cheese.' },
            { id: 'f4', name: 'Seafood Sensation', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80', price: 699, category: 'premium', description: 'Squid, mussels, prawns, and tuna.' },
            { id: 'f5', name: 'Burrata & Prosciutto', image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=800&q=80', price: 749, category: 'premium', description: 'Whole burrata cheese and premium prosciutto.' },
            { id: 'f6', name: 'Spiced Lamb Kofta', image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&q=80', price: 619, category: 'non-veg', description: 'Moroccan-spiced lamb and mint yogurt.' },
            { id: 'f7', name: 'Butter Chicken Special', image: 'https://images.unsplash.com/photo-1613564834361-9436948817d1?w=800&q=80', price: 599, category: 'non-veg', description: 'Classic butter chicken gravy base.' },
            { id: 'f8', name: 'Peri-Peri Poultry', image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800&q=80', price: 529, category: 'non-veg', description: 'Peri-peri marinated chicken and red peppers.' },
            { id: 'f9', name: 'Four Cheese Bliss', image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&q=80', price: 519, category: 'premium', description: 'Mozzarella, gorgonzola, parmesan, and cheddar.' }
          ];
          finalItems = fallback.map(item => localizeItem(item));
        }
        
        // --- UNIVERSAL UNIQUENESS GUARD ---
        const uniqueItems = [];
        const seenNames = new Set();
        const seenImages = new Set();
        const seenPrices = new Set();

        finalItems.forEach(item => {
          const normalizedName = item.name.toLowerCase().trim();
          const normalizedImage = item.image.split('?')[0].trim();
          const priceKey = String(item.price);
          
          if (!seenNames.has(normalizedName) && !seenImages.has(normalizedImage) && !seenPrices.has(priceKey)) {
            seenNames.add(normalizedName);
            seenImages.add(normalizedImage);
            seenPrices.add(priceKey);
            uniqueItems.push(item);
          }
        });
        
        setItems(uniqueItems);
      } catch (error) {
        console.error("Failed to fetch menu:", error);
      }
      setLoading(false);
    };
    fetchItems();
  }, []);

  const processedItems = useMemo(() => {
    let result = [...items];

    // Shuffle positions for logged-in users (changes every 12 hours)
    if (shuffleSeed && !sortBy.field && !searchQuery) {
      result = seededShuffle(result, shuffleSeed);
    }

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
  }, [items, searchQuery, sortBy, shuffleSeed]);

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <FoodCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {processedItems.map((food, idx) => (
            <div key={food.id} className={`animate-slide-up stagger-${(idx % 5) + 1}`}>
              <FoodCard food={food} />
            </div>
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
