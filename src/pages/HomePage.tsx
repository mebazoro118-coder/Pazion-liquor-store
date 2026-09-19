import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Award,
  CheckCircle,
  Clock,
  Wine,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';

interface HomePageProps {
  onNavigate: (view: string, param?: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectProduct }) => {
  const { products, categories } = useStore();

  const featured = products.filter((p) => p.isFeatured).slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);
  const specialOffers = products.filter((p) => Boolean(p.discountPrice)).slice(0, 4);

  const luxuryBrands = [
    'The Macallan',
    'Dom Pérignon',
    'Clase Azul',
    'Château Margaux',
    'Monkey 47',
    'Belvedere',
    'Suntory Yamazaki',
    'Louis Roederer',
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative bg-stone-950 text-white min-h-[620px] flex items-center overflow-hidden">
        {/* Editorial Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=2000&q=85"
            alt="Pazion Fine Spirits and Wine Cellar"
            className="w-full h-full object-cover object-center opacity-40 filter brightness-75 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 text-stone-300 text-[11px] uppercase tracking-[0.25em] font-medium backdrop-blur-xs">
              <span>International Fine Cellar Collection</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-white leading-[1.1]">
              DISCOVER <br />
              <span className="italic font-light text-stone-300">YOUR POUR.</span>
            </h1>

            <p className="text-stone-300 text-base sm:text-lg leading-relaxed font-light max-w-xl">
              Premium spirits, rare vintage wines, and celebratory champagnes—rigorously authenticated and delivered with white-glove care for discerning occasions.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                id="hero-shop-now-btn"
                onClick={() => onNavigate('shop')}
                className="px-8 py-4 bg-stone-100 hover:bg-white text-stone-950 text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-200 flex items-center gap-3 cursor-pointer shadow-lg hover:shadow-xl"
              >
                <span>Shop The Cellar</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-explore-collection-btn"
                onClick={() => onNavigate('shop', 'Whisky')}
                className="px-8 py-4 bg-transparent hover:bg-white/10 text-stone-200 border border-stone-600 hover:border-stone-300 text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-200 cursor-pointer"
              >
                Explore Whiskies
              </button>
            </div>

            {/* Micro value props */}
            <div className="pt-8 border-t border-white/10 grid grid-cols-3 gap-6 text-stone-400 text-xs">
              <div>
                <p className="text-white font-medium">100% Verified</p>
                <p className="text-[11px] text-stone-400 mt-0.5">Authentic Cellar Origins</p>
              </div>
              <div>
                <p className="text-white font-medium">Climate-Controlled</p>
                <p className="text-[11px] text-stone-400 mt-0.5">White-Glove Courier</p>
              </div>
              <div>
                <p className="text-white font-medium">Discrete Pack</p>
                <p className="text-[11px] text-stone-400 mt-0.5">Signed ID Verification</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-stone-200">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-stone-600 font-semibold mb-1">
              Curated Taxonomy
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif text-stone-950 tracking-tight">
              Explore by Spirit & Cellar
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="mt-3 md:mt-0 text-xs uppercase tracking-[0.2em] font-medium text-stone-700 hover:text-stone-950 flex items-center gap-1.5 transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('shop', cat.name)}
              className="group relative bg-stone-100 border border-stone-200 hover:border-stone-400 overflow-hidden cursor-pointer transition-all duration-300"
            >
              <div className="aspect-4/5 w-full overflow-hidden bg-stone-200">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 group-hover:brightness-100"
                />
              </div>
              <div className="p-4 bg-white border-t border-stone-100 text-center">
                <h3 className="font-serif text-sm sm:text-base text-stone-950 tracking-wide font-normal">
                  {cat.name}
                </h3>
                <span className="text-[10px] uppercase tracking-widest text-stone-600 font-medium group-hover:text-stone-900 transition-colors inline-block mt-1">
                  Discover →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-stone-200">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-stone-600 font-semibold mb-1">
              Curator’s Selection
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif text-stone-950 tracking-tight">
              Featured Spirits of the Month
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs uppercase tracking-[0.2em] font-medium text-stone-700 hover:text-stone-950 flex items-center gap-1.5"
          >
            <span>See Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} onSelect={onSelectProduct} />
          ))}
        </div>
      </section>

      {/* 4. EDITORIAL CALLOUT: THE PAZION STANDARD */}
      <section className="bg-stone-100 border-y border-stone-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-white border border-stone-300 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6 stroke-[1.5] text-stone-900" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-base text-stone-950 font-normal">
                  Authentic Provenance
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Every vintage and bottle is sourced directly through licensed châteaux, distilleries, and verified international distributors.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-white border border-stone-300 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6 stroke-[1.5] text-stone-900" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-base text-stone-950 font-normal">
                  Temperature-Secured Transit
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Climate-sensitive wines and aged spirits are transported in insulated, shock-absorbent packaging with express courier dispatch.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-white border border-stone-300 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 stroke-[1.5] text-stone-900" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-base text-stone-950 font-normal">
                  Verified Legal Handover
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Responsible age verification protects our community at both digital checkout and upon physical delivery confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BEST SELLERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-stone-200">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-stone-600 font-semibold mb-1">
              Customer Acclaim
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif text-stone-950 tracking-tight">
              Best Selling Bottles
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs uppercase tracking-[0.2em] font-medium text-stone-700 hover:text-stone-950 flex items-center gap-1.5"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} onSelect={onSelectProduct} />
          ))}
        </div>
      </section>

      {/* 6. SPECIAL OFFERS BANNER */}
      {specialOffers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-stone-900 text-white p-8 sm:p-12 border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <span className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-semibold">
                Limited Time Allocation
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal">
                Curator’s Seasonal Cellar Reductions
              </h3>
              <p className="text-stone-300 text-xs sm:text-sm font-light leading-relaxed">
                Enjoy preferential pricing on rare reserves, second growths, and single barrel releases. Enter promo code <strong className="text-white font-mono">PAZION10</strong> at checkout for an additional 10% privilege.
              </p>
            </div>
            <button
              onClick={() => onNavigate('shop')}
              className="px-8 py-3.5 bg-white text-stone-950 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-stone-100 transition-colors shrink-0"
            >
              Explore Special Offers
            </button>
          </div>
        </section>
      )}

      {/* 7. POPULAR BRANDS MARQUEE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-[11px] uppercase tracking-[0.25em] text-stone-600 font-semibold mb-1">
            Distilleries & Maisons
          </p>
          <h2 className="text-xl sm:text-2xl font-serif text-stone-900">
            Partner Houses & Prestigious Brands
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {luxuryBrands.map((b) => (
            <div
              key={b}
              onClick={() => onNavigate('shop', b)}
              className="p-6 bg-white border border-stone-200 hover:border-stone-400 flex items-center justify-center text-center cursor-pointer transition-colors"
            >
              <span className="font-serif text-stone-800 tracking-wider text-sm sm:text-base font-normal">
                {b}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 8. RESPONSIBLE DRINKING STATEMENT */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="p-8 sm:p-12 border border-stone-200 bg-stone-50/50">
          <Wine className="w-8 h-8 mx-auto text-stone-500 mb-3 stroke-[1.2]" />
          <h3 className="font-serif text-xl sm:text-2xl text-stone-900 mb-3">
            Mindful Enjoyment & Responsible Drinking
          </h3>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
            Pazion Liquor Store is committed to the culture of moderation, fine appreciation, and responsible sales. We never sell or deliver alcohol to minors. We encourage savoring every bottle with care, respect, and company.
          </p>
          <div className="mt-4 flex justify-center gap-4 text-xs text-stone-500 underline">
            <a href="https://www.responsibility.org/" target="_blank" rel="noreferrer" className="hover:text-stone-900">
              Responsibility.org
            </a>
            <span>•</span>
            <a href="https://www.drinkaware.co.uk/" target="_blank" rel="noreferrer" className="hover:text-stone-900">
              Drinkaware
            </a>
          </div>
        </div>
      </section>

      {/* 9. RECENT REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-[11px] uppercase tracking-[0.25em] text-stone-600 font-semibold mb-1">
            Connoisseur Reviews
          </p>
          <h2 className="text-2xl sm:text-3xl font-serif text-stone-900">
            Patron Reflections
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-stone-200 p-8 flex flex-col justify-between">
            <p className="font-serif italic text-stone-700 text-sm sm:text-base leading-relaxed mb-6">
              "The Macallan 18 arrived in pristine, temperature-secure packaging within three hours of ordering. The ID check at the door was smooth and discreet. True luxury retail."
            </p>
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-stone-900">
                Charles V. St. Clair
              </p>
              <p className="text-[11px] text-stone-600">Verified Collector • New York</p>
            </div>
          </div>

          <div className="bg-white border border-stone-200 p-8 flex flex-col justify-between">
            <p className="font-serif italic text-stone-700 text-sm sm:text-base leading-relaxed mb-6">
              "Pazion’s curation of Champagnes is unparalleled. Secured two bottles of Dom Pérignon Vintage for our anniversary dinner, perfectly chilled upon handover."
            </p>
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-stone-900">
                Éléonore Moreau
              </p>
              <p className="text-[11px] text-stone-600">Verified Sommelier • Paris & Boston</p>
            </div>
          </div>

          <div className="bg-white border border-stone-200 p-8 flex flex-col justify-between">
            <p className="font-serif italic text-stone-700 text-sm sm:text-base leading-relaxed mb-6">
              "Outstanding customer service. When I sought advice on small-batch Japanese whiskies, their concierge assisted immediately with genuine expertise."
            </p>
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-stone-900">
                Kenji Takahashi
              </p>
              <p className="text-[11px] text-stone-600">Verified Patron • San Francisco</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
