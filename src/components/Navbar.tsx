import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  User as UserIcon,
  Heart,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Wine,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenSearch }) => {
  const { currentUser, userProfile, isAdmin, logout } = useAuth();
  const { itemCount, wishlist } = useCart();
  const { categories } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top micro-banner */}
      <div className="bg-stone-900 text-stone-300 text-[11px] tracking-widest uppercase py-1.5 px-4 text-center flex items-center justify-center gap-4">
        <span>Complimentary White-Glove Delivery on Orders Over $150</span>
        <span className="hidden sm:inline text-stone-500">•</span>
        <span className="hidden sm:inline text-stone-400">Legal Age Verification Required at Handover</span>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Mobile menu toggle + Desktop navigation links */}
          <div className="flex items-center gap-6">
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-800 hover:text-stone-950 focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Desktop Navigation links */}
            <nav className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-[0.18em] font-medium text-stone-700">
              <button
                id="nav-link-home"
                onClick={() => onNavigate('home')}
                className={`transition-colors hover:text-stone-950 cursor-pointer ${
                  currentView === 'home' ? 'text-stone-950 font-semibold border-b border-stone-950 pb-0.5' : ''
                }`}
              >
                Home
              </button>

              <button
                id="nav-link-shop"
                onClick={() => onNavigate('shop')}
                className={`transition-colors hover:text-stone-950 cursor-pointer ${
                  currentView === 'shop' ? 'text-stone-950 font-semibold border-b border-stone-950 pb-0.5' : ''
                }`}
              >
                Collection
              </button>

              {/* Categories dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setCategoriesDropdownOpen(true)}
                onMouseLeave={() => setCategoriesDropdownOpen(false)}
              >
                <button
                  id="nav-link-categories-dropdown"
                  onClick={() => onNavigate('shop')}
                  className="flex items-center gap-1 transition-colors hover:text-stone-950 cursor-pointer py-2"
                >
                  <span>Spirits & Wine</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>

                {categoriesDropdownOpen && (
                  <div className="absolute left-0 top-full w-64 bg-white border border-stone-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-4 py-2 border-b border-stone-100 text-[10px] uppercase tracking-wider text-stone-600 font-semibold">
                      Curated Categories
                    </div>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        id={`cat-nav-${cat.slug}`}
                        onClick={() => {
                          onNavigate('shop', cat.name);
                          setCategoriesDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs uppercase tracking-wider text-stone-700 hover:bg-stone-50 hover:text-stone-950 transition-colors flex items-center justify-between"
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] text-stone-600 font-sans">Explore</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                id="nav-link-about"
                onClick={() => onNavigate('about')}
                className={`transition-colors hover:text-stone-950 cursor-pointer ${
                  currentView === 'about' ? 'text-stone-950 font-semibold border-b border-stone-950 pb-0.5' : ''
                }`}
              >
                Maison Pazion
              </button>

              <button
                id="nav-link-track"
                onClick={() => onNavigate('track')}
                className={`transition-colors hover:text-stone-950 cursor-pointer ${
                  currentView === 'track' ? 'text-stone-950 font-semibold border-b border-stone-950 pb-0.5' : ''
                }`}
              >
                Track Order
              </button>
            </nav>
          </div>

          {/* Center: Brand Wordmark Logo */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <button
              id="brand-logo-btn"
              onClick={() => onNavigate('home')}
              className="inline-flex flex-col items-center group cursor-pointer text-left"
            >
              <span className="text-xl sm:text-2xl font-serif tracking-[0.2em] uppercase font-normal text-stone-950 group-hover:text-stone-700 transition-colors">
                PAZION
              </span>
              <span className="text-[9px] uppercase tracking-[0.38em] text-stone-500 font-sans -mt-0.5">
                LIQUOR STORE
              </span>
            </button>
          </div>

          {/* Right: Actions (Search, Wishlist, Account, Cart, Admin) */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Trigger */}
            <button
              id="nav-search-btn"
              onClick={onOpenSearch}
              className="p-2 text-stone-700 hover:text-stone-950 transition-colors cursor-pointer"
              title="Search collection"
              aria-label="Search collection"
            >
              <Search className="w-5 h-5 stroke-[1.75]" />
            </button>

            {/* Wishlist */}
            <button
              id="nav-wishlist-btn"
              onClick={() => onNavigate('wishlist')}
              className="relative p-2 text-stone-700 hover:text-stone-950 transition-colors cursor-pointer hidden sm:block"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.75]" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-stone-900 text-stone-100 text-[10px] rounded-full flex items-center justify-center font-medium">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Account / Auth dropdown */}
            <div className="relative">
              <button
                id="nav-account-btn"
                onClick={() => {
                  if (!currentUser) {
                    onNavigate('account');
                  } else {
                    setUserDropdownOpen(!userDropdownOpen);
                  }
                }}
                className="p-2 text-stone-700 hover:text-stone-950 transition-colors cursor-pointer flex items-center gap-1.5"
                title="Account"
                aria-label="Account"
              >
                <UserIcon className="w-5 h-5 stroke-[1.75]" />
                {currentUser && (
                  <span className="hidden md:inline text-[11px] font-medium tracking-wider text-stone-800 uppercase">
                    {userProfile?.displayName?.split(' ')[0] || 'Member'}
                  </span>
                )}
              </button>

              {userDropdownOpen && currentUser && (
                <div
                  className="absolute right-0 top-full mt-2 w-56 bg-white border border-stone-200 shadow-xl py-2 z-50"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-stone-100">
                    <p className="text-xs font-semibold text-stone-900">{userProfile?.displayName}</p>
                    <p className="text-[11px] text-stone-500 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-[9px] uppercase tracking-wider bg-stone-100 text-stone-700 font-medium">
                      Role: {userProfile?.role || 'Customer'}
                    </span>
                  </div>

                  <button
                    id="user-menu-profile"
                    onClick={() => {
                      onNavigate('account');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    My Account & Orders
                  </button>

                  <button
                    id="user-menu-wishlist"
                    onClick={() => {
                      onNavigate('wishlist');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    Saved Collection ({wishlist.length})
                  </button>

                  {isAdmin && (
                    <button
                      id="user-menu-admin"
                      onClick={() => {
                        onNavigate('admin');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-amber-800 bg-amber-50/70 hover:bg-amber-100/70 font-medium transition-colors flex items-center justify-between"
                    >
                      <span>Admin Dashboard</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                    </button>
                  )}

                  <div className="border-t border-stone-100 mt-1 pt-1">
                    <button
                      id="user-menu-logout"
                      onClick={async () => {
                        await logout();
                        setUserDropdownOpen(false);
                        onNavigate('home');
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-700 hover:bg-rose-50 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Admin Link for quick store management */}
            {isAdmin && (
              <button
                id="nav-admin-direct-btn"
                onClick={() => onNavigate('admin')}
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-[11px] font-medium tracking-wider uppercase text-stone-800 transition-colors cursor-pointer"
                title="Management Suite"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>Admin Suite</span>
              </button>
            )}

            {/* Shopping Cart Bag */}
            <button
              id="nav-cart-btn"
              onClick={() => onNavigate('cart')}
              className="p-2 relative bg-stone-900 hover:bg-stone-800 text-stone-100 transition-colors flex items-center gap-2 px-3 py-2 cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs tracking-wider uppercase font-medium hidden sm:inline">Cart</span>
              <span className="w-5 h-5 bg-stone-800 border border-stone-700 text-stone-100 text-[11px] flex items-center justify-center font-medium">
                {itemCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-nav-drawer" className="lg:hidden border-t border-stone-200 bg-white px-4 py-6 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-4">
            <div className="text-[11px] uppercase tracking-[0.2em] text-stone-600 font-semibold mb-2">
              Navigation
            </div>
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-sm uppercase tracking-wider font-medium text-stone-900 border-b border-stone-100"
            >
              Home
            </button>
            <button
              onClick={() => {
                onNavigate('shop');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-sm uppercase tracking-wider font-medium text-stone-900 border-b border-stone-100"
            >
              All Spirits & Wines
            </button>
            <button
              onClick={() => {
                onNavigate('about');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-sm uppercase tracking-wider font-medium text-stone-900 border-b border-stone-100"
            >
              About Pazion
            </button>
            <button
              onClick={() => {
                onNavigate('track');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-sm uppercase tracking-wider font-medium text-stone-900 border-b border-stone-100"
            >
              Track Your Order
            </button>
            <button
              onClick={() => {
                onNavigate('contact');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-sm uppercase tracking-wider font-medium text-stone-900 border-b border-stone-100"
            >
              Concierge & Contact
            </button>
            <button
              onClick={() => {
                onNavigate('faq');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-sm uppercase tracking-wider font-medium text-stone-900 border-b border-stone-100"
            >
              Frequently Asked Questions
            </button>

            {/* Categories list in mobile menu */}
            <div className="pt-2">
              <div className="text-[11px] uppercase tracking-[0.2em] text-stone-600 font-semibold mb-2">
                Browse Categories
              </div>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onNavigate('shop', c.name);
                      setMobileMenuOpen(false);
                    }}
                    className="text-left text-xs text-stone-700 py-1.5 px-2 bg-stone-50 hover:bg-stone-100 uppercase tracking-wider"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* User status */}
            <div className="pt-4 border-t border-stone-200">
              {currentUser ? (
                <div className="space-y-2">
                  <div className="text-xs text-stone-600">
                    Signed in as <span className="font-semibold text-stone-900">{currentUser.email}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        onNavigate('account');
                        setMobileMenuOpen(false);
                      }}
                      className="flex-1 py-2 bg-stone-900 text-white text-xs uppercase font-medium text-center"
                    >
                      Account
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => {
                          onNavigate('admin');
                          setMobileMenuOpen(false);
                        }}
                        className="flex-1 py-2 bg-amber-900 text-white text-xs uppercase font-medium text-center"
                      >
                        Admin Suite
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onNavigate('account');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-stone-900 text-white text-xs uppercase tracking-wider font-medium text-center"
                >
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
