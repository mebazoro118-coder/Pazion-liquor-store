import React, { useState } from 'react';
import {
  Heart,
  ShoppingBag,
  Star,
  Truck,
  ShieldCheck,
  CheckCircle,
  ArrowLeft,
  Share2,
  AlertCircle,
  Wine,
} from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailsPageProps {
  product: Product;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onNavigate: (view: string, param?: string) => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  product,
  onBack,
  onSelectProduct,
  onNavigate,
}) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { products } = useStore();

  const [selectedImage, setSelectedImage] = useState<string>(product.imageUrl);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'tasting' | 'provenance' | 'delivery'>('tasting');
  const [addedToast, setAddedToast] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const galleryImages = [
    product.imageUrl,
    ...(product.gallery || []),
  ];

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart(product, quantity);
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 3000);
    }
  };

  const handleBuyNow = () => {
    if (!isOutOfStock) {
      addToCart(product, quantity);
      onNavigate('checkout');
    }
  };

  // Related products from the same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id && p.isActive)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs & Back */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-200">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-medium text-stone-700 hover:text-stone-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Collection</span>
        </button>

        <div className="text-xs text-stone-600 hidden sm:flex items-center gap-2">
          <span>Cellar</span>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-stone-900 font-medium truncate max-w-xs">{product.brand}</span>
        </div>
      </div>

      {/* Main Grid: Gallery + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Left: Product Imagery Gallery */}
        <div className="space-y-4">
          {/* Main Showcase Image */}
          <div className="relative aspect-square w-full bg-stone-50 border border-stone-200 flex items-center justify-center p-8 overflow-hidden">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 hover:scale-105"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center">
                <span className="text-xs uppercase tracking-widest font-semibold text-stone-800 border border-stone-300 px-4 py-2 bg-white">
                  Temporarily Allocated
                </span>
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          {galleryImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 bg-stone-50 border p-1 shrink-0 cursor-pointer transition-all ${
                    selectedImage === img ? 'border-stone-900 ring-1 ring-stone-900' : 'border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-contain mix-blend-multiply" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Purchase Details */}
        <div className="flex flex-col justify-between">
          <div>
            {/* Badges / Brand */}
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-stone-600">
                {product.brand} • {product.category}
              </span>
              <button
                onClick={() => toggleWishlist(product)}
                className="p-2 border border-stone-200 hover:border-stone-900 transition-colors cursor-pointer"
                title="Save to Wishlist"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isWishlisted ? 'fill-rose-700 text-rose-700' : 'text-stone-600'
                  }`}
                />
              </button>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-stone-950 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Specifications Row */}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-stone-600 pb-4 border-b border-stone-200">
              <span className="font-medium text-stone-800">Volume: {product.volume}</span>
              {product.alcoholPercentage !== undefined && (
                <>
                  <span>•</span>
                  <span>{product.alcoholPercentage}% ABV</span>
                </>
              )}
              {product.origin && (
                <>
                  <span>•</span>
                  <span>Origin: {product.origin}</span>
                </>
              )}
              <div className="flex items-center gap-1 text-amber-500 ml-auto">
                <Star className="w-4 h-4 fill-amber-400 stroke-amber-500" />
                <span className="font-semibold text-stone-900">{product.rating.toFixed(1)}</span>
                <span className="text-stone-600">({product.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="py-6">
              {product.discountPrice ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-serif font-normal text-stone-950">
                    ${product.discountPrice.toFixed(2)}
                  </span>
                  <span className="text-lg text-stone-600 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5">
                    Save ${(product.price - product.discountPrice).toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-serif font-normal text-stone-950">
                  ${product.price.toFixed(2)}
                </span>
              )}
              <p className="text-[11px] text-stone-600 mt-1">
                Taxes calculated at checkout. White-glove delivery available.
              </p>
            </div>

            {/* Stock Notification */}
            <div className="mb-6">
              {isOutOfStock ? (
                <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 p-3">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>This rare vintage is currently fully allocated. Check back soon.</span>
                </div>
              ) : isLowStock ? (
                <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 p-3">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Limited Cellar Stock: Only {product.stock} bottles remaining.</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 p-3">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>In Stock & Ready for Temperature-Controlled Dispatch</span>
                </div>
              )}
            </div>

            {/* Actions: Quantity Selector & Add to Cart & Buy Now */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-4">
                {/* Quantity */}
                <div className="flex items-center border border-stone-300 bg-white">
                  <button
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3.5 py-3 text-stone-700 hover:bg-stone-100 disabled:opacity-40 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-3 text-xs font-medium text-stone-900 w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    disabled={quantity >= product.stock}
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-3.5 py-3 text-stone-700 hover:bg-stone-100 disabled:opacity-40 transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  id="product-details-add-to-cart"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className="flex-1 px-6 py-3.5 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white text-xs font-semibold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cellar Bag</span>
                </button>
              </div>

              {/* Buy Now Direct Button */}
              <button
                id="product-details-buy-now"
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                className="w-full py-3.5 bg-stone-100 hover:bg-stone-200 disabled:opacity-50 text-stone-900 border border-stone-300 text-xs font-semibold uppercase tracking-[0.2em] transition-colors cursor-pointer"
              >
                Instant Checkout
              </button>
            </div>

            {/* Added Toast */}
            {addedToast && (
              <div className="mt-3 p-3 bg-stone-900 text-white text-xs flex items-center justify-between">
                <span>{quantity}x bottle(s) added to your shopping cart.</span>
                <button
                  onClick={() => onNavigate('cart')}
                  className="underline font-semibold text-stone-200 hover:text-white"
                >
                  View Cart
                </button>
              </div>
            )}

            {/* Micro Guarantees */}
            <div className="mt-8 pt-6 border-t border-stone-200 grid grid-cols-2 gap-4 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-stone-900" />
                <span>Original Estate Authentication</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-stone-900" />
                <span>Express Insulated Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Tasting Notes, Provenance, Delivery */}
      <div className="mt-16 pt-8 border-t border-stone-200">
        <div className="flex gap-8 border-b border-stone-200 text-xs uppercase tracking-[0.2em]">
          <button
            onClick={() => setActiveTab('tasting')}
            className={`pb-3 font-semibold transition-colors ${
              activeTab === 'tasting' ? 'text-stone-950 border-b-2 border-stone-950' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Tasting Notes & Profile
          </button>
          <button
            onClick={() => setActiveTab('provenance')}
            className={`pb-3 font-semibold transition-colors ${
              activeTab === 'provenance' ? 'text-stone-950 border-b-2 border-stone-950' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Estate & Production
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`pb-3 font-semibold transition-colors ${
              activeTab === 'delivery' ? 'text-stone-950 border-b-2 border-stone-950' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Delivery & Age Compliance
          </button>
        </div>

        <div className="py-6 max-w-3xl text-stone-700 text-sm leading-relaxed">
          {activeTab === 'tasting' && (
            <div className="space-y-4">
              <p>{product.description}</p>
              {product.tastingNotes && (
                <div className="p-4 bg-stone-50 border-l-2 border-stone-900 my-4">
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-900 mb-1">
                    Sommelier Palate Notes
                  </h4>
                  <p className="italic text-stone-800">{product.tastingNotes}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'provenance' && (
            <div className="space-y-3">
              <p>
                <strong>Maison/Distillery:</strong> {product.brand}
              </p>
              <p>
                <strong>Geographical Origin:</strong> {product.origin || 'International Reserve'}
              </p>
              <p>
                <strong>Standard Cask / Aging:</strong> Cellar aged in temperature-controlled oak conditions to guarantee aromatic stability and refinement.
              </p>
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="space-y-3">
              <p>
                All deliveries are managed via Pazion Express climate-controlled vehicles or our bonded national courier partners.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-stone-600">
                <li>Local courier delivery available within 2-4 hours for eligible zip codes.</li>
                <li>Complimentary signature delivery on all orders exceeding $150.</li>
                <li><strong>Age Verification Requirement:</strong> Valid physical government ID required at door. Packages cannot be left unattended.</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 pt-10 border-t border-stone-200">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-stone-600 font-semibold mb-1">
                Complementary Selections
              </p>
              <h2 className="text-2xl font-serif text-stone-950">
                More From {product.category}
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} onSelect={onSelectProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
