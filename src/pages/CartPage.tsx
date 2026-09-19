import React, { useState } from 'react';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck, ArrowLeft, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartPageProps {
  onNavigate: (view: string, param?: string) => void;
  onSelectProduct: (product: any) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate, onSelectProduct }) => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discountTotal,
    deliveryFee,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponMessage({ text: res.message, isError: !res.success });
    if (res.success) {
      setCouponInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 bg-stone-100 mx-auto flex items-center justify-center mb-4 text-stone-400">
          <ShoppingBag className="w-8 h-8 stroke-[1.2]" />
        </div>
        <h2 className="text-2xl font-serif text-stone-900 mb-2">Your Cellar Bag is Empty</h2>
        <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto mb-8 leading-relaxed">
          Discover our curated collection of vintage Champagnes, single malt Whiskies, and exceptional spirits.
        </p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-8 py-3.5 bg-stone-900 hover:bg-stone-800 text-white text-xs uppercase tracking-[0.2em] font-semibold transition-colors"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-200">
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-stone-600 font-semibold mb-1">
            Review Selection
          </p>
          <h1 className="text-2xl sm:text-3xl font-serif text-stone-950">
            Your Cellar Bag ({cart.length} item{cart.length > 1 ? 's' : ''})
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs uppercase tracking-wider text-stone-600 hover:text-stone-900 underline"
        >
          Empty Bag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="divide-y divide-stone-200 border-y border-stone-200">
            {cart.map((item) => {
              const unitPrice = item.product.discountPrice ?? item.product.price;
              const itemTotal = unitPrice * item.quantity;
              return (
                <div key={item.productId} className="py-6 flex gap-4 sm:gap-6 items-center">
                  {/* Thumbnail */}
                  <div
                    onClick={() => onSelectProduct(item.product)}
                    className="w-20 h-20 sm:w-24 sm:h-24 bg-stone-50 border border-stone-200 p-2 shrink-0 cursor-pointer flex items-center justify-center"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] uppercase tracking-widest text-stone-600 font-semibold">
                        {item.product.brand}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-stone-600 hover:text-rose-600 transition-colors p-1"
                        title="Remove bottle"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3
                      onClick={() => onSelectProduct(item.product)}
                      className="font-serif text-sm sm:text-base text-stone-900 hover:text-stone-700 truncate cursor-pointer"
                    >
                      {item.product.name}
                    </h3>

                    <p className="text-xs text-stone-600 mt-0.5">
                      {item.product.volume} • ${unitPrice.toFixed(2)} each
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity control */}
                      <div className="flex items-center border border-stone-300 bg-white">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="px-2.5 py-1 text-xs text-stone-700 hover:bg-stone-100"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs font-medium text-stone-900 w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          disabled={item.quantity >= item.product.stock}
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="px-2.5 py-1 text-xs text-stone-700 hover:bg-stone-100 disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-serif text-base text-stone-950 font-normal">
                        ${itemTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => onNavigate('shop')}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-stone-800 hover:text-stone-950 pt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>

        {/* Order Summary & Checkout */}
        <div className="bg-stone-50 border border-stone-200 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-950 pb-4 border-b border-stone-200 mb-4">
              Consignment Summary
            </h3>

            {/* Price lines */}
            <div className="space-y-3 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-stone-900 font-medium">${subtotal.toFixed(2)}</span>
              </div>

              {discountTotal > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-${discountTotal.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>White-Glove Insulated Delivery</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-medium">Complimentary</span>
                  ) : (
                    `$${deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>

              <p className="text-[11px] text-stone-600 pt-1">
                {subtotal < 150
                  ? `Add $${(150 - subtotal).toFixed(2)} more to qualify for complimentary delivery.`
                  : 'You have unlocked complimentary insured delivery.'}
              </p>
            </div>

            {/* Total */}
            <div className="mt-6 pt-4 border-t border-stone-200 flex justify-between items-baseline">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-stone-900 block">
                  Estimated Total
                </span>
                <span className="text-[10px] text-stone-600">State and federal excise included</span>
              </div>
              <span className="text-2xl font-serif text-stone-950">
                ${total.toFixed(2)}
              </span>
            </div>

            {/* Promo Code Input */}
            <div className="mt-6 pt-4 border-t border-stone-200">
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon: {appliedCoupon.code}</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-[11px] underline hover:text-emerald-950"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <label className="block text-[11px] uppercase tracking-wider font-medium text-stone-700">
                    Promotional Code
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="e.g. PAZION10"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 bg-white border border-stone-300 text-xs px-3 py-2 uppercase placeholder:normal-case focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider"
                    >
                      Apply
                    </button>
                  </div>
                  {couponMessage && (
                    <p
                      className={`text-[11px] ${
                        couponMessage.isError ? 'text-rose-600' : 'text-emerald-700'
                      }`}
                    >
                      {couponMessage.text}
                    </p>
                  )}
                  <p className="text-[10px] text-stone-600">
                    Hint: Use code <strong className="font-mono">PAZION10</strong> for 10% off.
                  </p>
                </form>
              )}
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <button
              id="cart-proceed-checkout-btn"
              onClick={() => onNavigate('checkout')}
              className="w-full py-4 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-[11px] text-stone-600 text-center flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-stone-900" />
              <span>Age verification legally mandated upon delivery handover</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
