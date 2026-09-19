import React from 'react';
import { Heart, ShoppingBag, Star, Check } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const isWishlisted = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onSelect(product)}
      className="group relative bg-white border border-stone-200 hover:border-stone-400 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Top Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {product.discountPrice && (
          <span className="bg-stone-900 text-stone-100 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5">
            Special Offer
          </span>
        )}
        {product.isNewArrival && (
          <span className="bg-stone-100 border border-stone-300 text-stone-800 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5">
            New
          </span>
        )}
        {product.isBestSeller && !product.discountPrice && (
          <span className="bg-stone-800 text-stone-100 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5">
            Best Seller
          </span>
        )}
        {isLowStock && (
          <span className="bg-amber-50 border border-amber-300 text-amber-900 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5">
            Only {product.stock} Left
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        id={`wishlist-toggle-${product.id}`}
        onClick={handleWishlist}
        className="absolute top-3 right-3 z-10 p-2 bg-white/90 hover:bg-white text-stone-700 hover:text-stone-950 border border-stone-200 transition-all duration-200 cursor-pointer shadow-sm"
        aria-label="Add to wishlist"
      >
        <Heart
          className={`w-4 h-4 ${
            isWishlisted ? 'fill-rose-700 text-rose-700' : 'text-stone-600'
          }`}
        />
      </button>

      {/* Product Image Area */}
      <div className="relative w-full aspect-square bg-stone-50 overflow-hidden flex items-center justify-center p-6">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center">
            <span className="text-xs uppercase tracking-widest font-semibold text-stone-800 border border-stone-300 px-3 py-1 bg-white">
              Temporarily Allocated
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between border-t border-stone-100">
        <div>
          {/* Brand & Category & Volume */}
          <div className="flex items-center justify-between text-[11px] text-stone-600 uppercase tracking-widest font-medium mb-1">
            <span>{product.brand}</span>
            <span>{product.volume}</span>
          </div>

          {/* Product Name */}
          <h3 className="font-serif text-sm sm:text-base text-stone-900 line-clamp-2 leading-snug group-hover:text-stone-700 transition-colors">
            {product.name}
          </h3>

          {/* ABV & Origin */}
          <div className="mt-1 flex items-center gap-2 text-[11px] text-stone-600">
            {product.alcoholPercentage !== undefined && (
              <span>{product.alcoholPercentage}% ABV</span>
            )}
            {product.origin && (
              <>
                <span>•</span>
                <span className="truncate">{product.origin}</span>
              </>
            )}
          </div>

          {/* Rating */}
          <div className="mt-2 flex items-center gap-1.5 text-xs text-stone-600">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
            </div>
            <span className="font-medium text-stone-800">{product.rating.toFixed(1)}</span>
            <span className="text-stone-600 text-[11px]">({product.reviewCount})</span>
          </div>
        </div>

        {/* Pricing & Add to cart */}
        <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
          <div>
            {product.discountPrice ? (
              <div className="flex items-baseline gap-2">
                <span className="text-base font-medium text-stone-900">
                  ${product.discountPrice.toFixed(2)}
                </span>
                <span className="text-xs text-stone-600 line-through">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-base font-medium text-stone-900">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          <button
            id={`add-to-cart-${product.id}`}
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={`px-3 py-2 text-xs font-medium uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer ${
              isOutOfStock
                ? 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                : 'bg-stone-900 hover:bg-stone-800 text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
