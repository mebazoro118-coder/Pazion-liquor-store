import React, { useState, useMemo, useEffect } from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Product, BeverageCategory } from '../types';

interface ShopPageProps {
  initialCategory?: string;
  onSelectProduct: (product: Product) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ initialCategory, onSelectProduct }) => {
  const { products, categories } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedVolume, setSelectedVolume] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-asc' | 'price-desc' | 'popularity'>('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    if (initialCategory) {
      // Check if it's a category or brand
      const isCat = categories.some((c) => c.name.toLowerCase() === initialCategory.toLowerCase());
      if (isCat) {
        setSelectedCategory(initialCategory);
      } else {
        setSelectedBrand(initialCategory);
      }
    }
  }, [initialCategory, categories]);

  // Derive unique brands and volumes
  const allBrands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.brand));
    return Array.from(set).sort();
  }, [products]);

  const allVolumes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.volume));
    return Array.from(set).sort();
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (!p.isActive) return false;
        if (selectedCategory !== 'all' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
        if (selectedBrand !== 'all' && p.brand !== selectedBrand) {
          return false;
        }
        if (selectedVolume !== 'all' && p.volume !== selectedVolume) {
          return false;
        }
        const effectivePrice = p.discountPrice ?? p.price;
        if (effectivePrice > priceRange) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchOrigin = p.origin?.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchOrigin) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const priceA = a.discountPrice ?? a.price;
        const priceB = b.discountPrice ?? b.price;
        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'popularity') return b.reviewCount - a.reviewCount;
        // default featured
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, selectedBrand, selectedVolume, priceRange, sortBy, searchQuery]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSelectedVolume('all');
    setPriceRange(1000);
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header banner */}
      <div className="mb-8 border-b border-stone-200 pb-6">
        <p className="text-[11px] uppercase tracking-[0.25em] text-stone-600 font-semibold mb-1">
          The Vault & Catalog
        </p>
        <h1 className="text-3xl sm:text-4xl font-serif text-stone-950 tracking-tight">
          {selectedCategory !== 'all' ? `${selectedCategory} Collection` : 'All Spirits & Cellar Selections'}
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-xl">
          Browse authenticated single malts, prestige cuvées, fine Bordeaux, botanical spirits, and zero-proof artisanal beverages.
        </p>
      </div>

      {/* Control bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 bg-stone-50 border border-stone-200 p-4">
        {/* Search input in shop */}
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by bottle name, vintage, or distillery..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-stone-300 text-xs px-3.5 py-2.5 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-500"
          />
        </div>

        <div className="flex items-center gap-3 justify-between sm:justify-end">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="lg:hidden px-4 py-2.5 bg-white border border-stone-300 text-xs uppercase tracking-wider font-medium flex items-center gap-2 text-stone-800"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-600 uppercase tracking-wider text-[11px] hidden sm:inline">
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-stone-300 text-stone-900 text-xs px-3 py-2.5 focus:outline-none uppercase tracking-wider"
            >
              <option value="featured">Featured Curations</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="popularity">Most Acclaimed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main layout: Sidebar filters + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters for Desktop */}
        <aside className={`lg:block ${mobileFiltersOpen ? 'block' : 'hidden'} lg:static space-y-8 bg-white lg:bg-transparent p-4 lg:p-0 border lg:border-none border-stone-200`}>
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900">
              Refine Collection
            </h3>
            <button
              onClick={resetFilters}
              className="text-[11px] uppercase tracking-wider text-stone-600 hover:text-stone-900 underline"
            >
              Reset All
            </button>
          </div>

          {/* Category Filter */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-800 mb-3">
              Category
            </h4>
            <div className="space-y-1.5 text-xs">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left py-1.5 px-2 rounded-xs flex items-center justify-between transition-colors ${
                  selectedCategory === 'all' ? 'bg-stone-900 text-white font-medium' : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <span>All Categories</span>
                <span>{products.length}</span>
              </button>
              {categories.map((c) => {
                const count = products.filter((p) => p.category.toLowerCase() === c.name.toLowerCase()).length;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.name)}
                    className={`w-full text-left py-1.5 px-2 rounded-xs flex items-center justify-between transition-colors ${
                      selectedCategory.toLowerCase() === c.name.toLowerCase()
                        ? 'bg-stone-900 text-white font-medium'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-[10px] opacity-70">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brand Filter */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-800 mb-3">
              Distillery / Maison
            </h4>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full bg-white border border-stone-300 text-xs p-2 text-stone-800 focus:outline-none"
            >
              <option value="all">All Brands</option>
              {allBrands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Volume Filter */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-800 mb-3">
              Volume / Size
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedVolume('all')}
                className={`px-3 py-1 text-xs border ${
                  selectedVolume === 'all'
                    ? 'border-stone-900 bg-stone-900 text-white'
                    : 'border-stone-300 text-stone-700 hover:bg-stone-100'
                }`}
              >
                All
              </button>
              {allVolumes.map((v) => (
                <button
                  key={v}
                  onClick={() => setSelectedVolume(v)}
                  className={`px-3 py-1 text-xs border ${
                    selectedVolume === v
                      ? 'border-stone-900 bg-stone-900 text-white'
                      : 'border-stone-300 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-stone-800 mb-2">
              <span className="uppercase tracking-wider">Maximum Price</span>
              <span>${priceRange}</span>
            </div>
            <input
              type="range"
              min={20}
              max={1000}
              step={10}
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-stone-900 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-stone-600 mt-1">
              <span>$20</span>
              <span>$1,000+</span>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between text-xs text-stone-600">
            <span>
              Showing <strong className="text-stone-900">{filteredProducts.length}</strong> authenticated bottles
            </span>
            {(selectedCategory !== 'all' || selectedBrand !== 'all' || selectedVolume !== 'all' || searchQuery) && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-stone-600">Filters active</span>
                <button
                  onClick={resetFilters}
                  className="text-stone-900 underline font-medium hover:text-stone-600"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} onSelect={onSelectProduct} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center border border-dashed border-stone-300 bg-stone-50/50 p-8">
              <p className="font-serif text-xl text-stone-800 mb-2">No selections match your criteria</p>
              <p className="text-xs text-stone-600 max-w-sm mx-auto mb-6">
                Try widening your price range or clearing category and brand filters.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-stone-900 text-white text-xs uppercase tracking-wider font-medium"
              >
                Reset Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
