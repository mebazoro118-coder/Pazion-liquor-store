import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { CartProvider } from './context/CartContext';
import { AgeVerificationProvider } from './context/AgeVerificationContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { AgeVerificationModal } from './components/AgeVerificationModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AccountPage } from './pages/AccountPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AboutPage, ContactPage } from './pages/EditorialPages';
import { FaqPage } from './pages/FaqPage';

import { Product, Order } from './types';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <StoreProvider>
        <CartProvider>
          <AgeVerificationProvider>
            {children}
          </AgeVerificationProvider>
        </CartProvider>
      </StoreProvider>
    </AuthProvider>
  );
};

export const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname.startsWith('/admin') || window.location.hash.startsWith('#admin')) {
        return 'admin';
      }
    }
    return 'home';
  });
  const [viewParam, setViewParam] = useState<string | undefined>(undefined);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const handleLocationChange = () => {
      if (window.location.pathname.startsWith('/admin') || window.location.hash.startsWith('#admin')) {
        setCurrentView('admin');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const handleNavigate = (view: string, param?: string) => {
    setCurrentView(view);
    setViewParam(param);
    if (view === 'admin') {
      try {
        window.history.pushState(null, '', '#admin');
      } catch (e) {
        // Safe fallback in restricted environments
      }
    } else {
      if (window.location.hash === '#admin') {
        try {
          window.history.pushState(null, '', window.location.pathname);
        } catch (e) {
          // Safe fallback
        }
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (order: Order) => {
    setLastCompletedOrder(order);
    setCurrentView('order-success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dedicated Administrative Portal
  if (currentView === 'admin') {
    return <AdminDashboard onNavigate={handleNavigate} />;
  }

  const isKnownNonHomeView = [
    'shop',
    'product-details',
    'cart',
    'checkout',
    'order-success',
    'track',
    'account',
    'about',
    'contact',
    'faq',
  ].includes(currentView);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-stone-900 selection:text-white">
      {/* Age Verification Modal Gate */}
      <AgeVerificationModal />

      {/* Universal Header Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Dynamic View Content */}
      <main className="flex-1">
        {(!isKnownNonHomeView || currentView === 'home') && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentView === 'shop' && (
          <ShopPage
            initialCategory={viewParam}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentView === 'product-details' && selectedProduct && (
          <ProductDetailsPage
            product={selectedProduct}
            onBack={() => handleNavigate('shop')}
            onSelectProduct={handleSelectProduct}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'cart' && (
          <CartPage
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            onNavigate={handleNavigate}
            onOrderSuccess={handleOrderSuccess}
          />
        )}

        {currentView === 'order-success' && lastCompletedOrder && (
          <div className="max-w-3xl mx-auto px-4 py-16 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold">✓</span>
            </div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-stone-600 font-semibold mb-1">
              Consignment Authorized
            </p>
            <h1 className="text-3xl font-serif text-stone-950 mb-3">
              Thank You, Your Cellar Allocation is Confirmed
            </h1>
            <p className="text-stone-600 text-xs sm:text-sm max-w-lg mx-auto mb-6 leading-relaxed">
              Order reference <strong className="font-mono text-stone-900">{lastCompletedOrder.id}</strong>. A climate courier dispatch team is currently assembling your insulated bottle consignment.
            </p>

            <div className="bg-white border border-stone-200 p-6 max-w-md mx-auto mb-8 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-600">Tracking Code:</span>
                <span className="font-mono font-semibold text-stone-900">{lastCompletedOrder.trackingNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Total Billed:</span>
                <span className="font-semibold text-stone-900">${lastCompletedOrder.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Handover Method:</span>
                <span className="capitalize font-semibold text-stone-900">{lastCompletedOrder.deliveryMethod}</span>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleNavigate('track', lastCompletedOrder.id)}
                className="px-6 py-3 bg-stone-900 text-white text-xs uppercase tracking-wider font-semibold hover:bg-stone-800"
              >
                Track Delivery
              </button>
              <button
                onClick={() => handleNavigate('shop')}
                className="px-6 py-3 border border-stone-300 text-stone-800 text-xs uppercase tracking-wider font-semibold hover:bg-stone-100"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        )}

        {currentView === 'track' && (
          <OrderTrackingPage
            initialOrder={lastCompletedOrder}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'account' && (
          <AccountPage
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentView === 'about' && <AboutPage />}

        {currentView === 'contact' && <ContactPage />}

        {currentView === 'faq' && <FaqPage />}
      </main>

      {/* Global Search Dialog Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={handleSelectProduct}
      />

      {/* Universal Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}

