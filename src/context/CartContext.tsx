import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product, Coupon } from '../types';
import { safeLocalStorage } from '../lib/storage';

interface CartContextType {
  cart: CartItem[];
  wishlist: Product[];
  appliedCoupon: Coupon | null;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  subtotal: number;
  discountTotal: number;
  deliveryFee: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const AVAILABLE_COUPONS: Coupon[] = [
  { id: 'c-1', code: 'PAZION10', discountType: 'percentage', discountAmount: 10, discountPercent: 10, isActive: true },
  { id: 'c-2', code: 'LUXURY25', discountType: 'fixed', discountAmount: 25, minOrderAmount: 200, isActive: true },
  { id: 'c-3', code: 'WELCOME50', discountType: 'fixed', discountAmount: 50, minOrderAmount: 350, isActive: true },
];

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = safeLocalStorage.getItem('pazion_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = safeLocalStorage.getItem('pazion_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    try {
      const saved = safeLocalStorage.getItem('pazion_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    safeLocalStorage.setItem('pazion_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    safeLocalStorage.setItem('pazion_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (appliedCoupon) {
      safeLocalStorage.setItem('pazion_coupon', JSON.stringify(appliedCoupon));
    } else {
      safeLocalStorage.removeItem('pazion_coupon');
    }
  }, [appliedCoupon]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) }
            : item
        );
      }
      return [...prev, { productId: product.id, product, quantity: Math.min(product.stock, quantity) }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.min(item.product.stock, quantity) }
          : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  const subtotal = cart.reduce((acc, item) => {
    const unitPrice = item.product.discountPrice ?? item.product.price;
    return acc + unitPrice * item.quantity;
  }, 0);

  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const found = AVAILABLE_COUPONS.find((c) => c.code === trimmed && c.isActive);
    if (!found) {
      return { success: false, message: 'Invalid or expired promotional code.' };
    }
    if (found.minOrderAmount && subtotal < found.minOrderAmount) {
      return {
        success: false,
        message: `Order must be at least $${found.minOrderAmount} to apply this promo code.`,
      };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Promo code ${found.code} successfully applied!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  let discountTotal = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discountTotal = (subtotal * appliedCoupon.discountPercent) / 100;
    } else if (appliedCoupon.discountAmount) {
      discountTotal = Math.min(subtotal, appliedCoupon.discountAmount);
    }
  }

  // Free delivery over $150, otherwise flat luxury white-glove fee of $15
  const deliveryFee = subtotal > 150 || subtotal === 0 ? 0 : 15;
  const total = Math.max(0, subtotal - discountTotal + deliveryFee);
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        appliedCoupon,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isInWishlist,
        applyCoupon,
        removeCoupon,
        subtotal,
        discountTotal,
        deliveryFee,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};
