import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, Wine } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const { products, categories } = useStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          (p.origin && p.origin.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <div
      id="search-modal-backdrop"
      className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="search-modal-container"
        className="w-full max-w-2xl bg-white border border-stone-200 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input bar */}
        <div className="flex items-center px-6 py-4 border-b border-stone-200 gap-3">
          <Search className="w-5 h-5 text-stone-400" />
          <input
            id="global-search-input"
            type="text"
            autoFocus
            placeholder="Search whiskies, champagnes, rare vintages, brands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-base font-normal text-stone-900 placeholder:text-stone-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6">
          {query.trim() === '' ? (
            <div>
              <p className="text-xs uppercase tracking-widest text-stone-600 font-semibold mb-3">
                Suggested Categories
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 6).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setQuery(c.name)}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs tracking-wider uppercase transition-colors"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          ) : filtered.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest text-stone-600 font-semibold mb-2">
                {filtered.length} Rare Bottles Found
              </p>
              {filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectProduct(item);
                    onClose();
                  }}
                  className="flex items-center gap-4 p-3 hover:bg-stone-50 transition-colors border border-stone-100 cursor-pointer group"
                >
                  <div className="w-14 h-14 bg-stone-50 border border-stone-200 p-1 shrink-0 flex items-center justify-center">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-[10px] text-stone-600 uppercase tracking-widest">
                      <span>{item.brand}</span>
                      <span>•</span>
                      <span>{item.volume}</span>
                    </div>
                    <p className="font-serif text-sm text-stone-900 truncate group-hover:text-stone-700">
                      {item.name}
                    </p>
                    <p className="text-xs font-medium text-stone-800 mt-0.5">
                      ${(item.discountPrice ?? item.price).toFixed(2)}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-800 group-hover:translate-x-0.5 transition-transform" />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-stone-500">
              <Wine className="w-8 h-8 mx-auto stroke-[1.2] text-stone-400 mb-2" />
              <p className="font-serif text-stone-800 text-base">No spirit found matching "{query}"</p>
              <p className="text-xs text-stone-500 mt-1">
                Try searching for "Macallan", "Dom Pérignon", "Tequila", or "Wine".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
