import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  ShoppingBag,
  Heart,
  MapPin,
  Lock,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Package,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Order, SavedAddress } from '../types';

interface AccountPageProps {
  onNavigate: (view: string, param?: string) => void;
  onSelectProduct: (product: any) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onNavigate, onSelectProduct }) => {
  const { currentUser, userProfile, login, register, logout, resetPassword, updateProfileData } = useAuth();
  const { wishlist, removeFromCart, addToCart } = useCart();

  // Auth toggle
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Profile tabs
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses' | 'wishlist'>('orders');
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Address edit state
  const [newAddrLabel, setNewAddrLabel] = useState('');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('');
  const [newAddrPostal, setNewAddrPostal] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Fetch orders for current user
  useEffect(() => {
    if (currentUser) {
      fetchUserOrders();
    }
  }, [currentUser]);

  const fetchUserOrders = async () => {
    if (!currentUser) return;
    setLoadingOrders(true);
    try {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', currentUser.uid)
      );
      const snap = await getDocs(q);
      const list: Order[] = [];
      snap.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...(docSnap.data() as Omit<Order, 'id'>) });
      });
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setUserOrders(list);
    } catch (err) {
      console.warn('Orders query fallback:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setSubmitting(true);

    try {
      if (authMode === 'login') {
        await login(email, password);
      } else if (authMode === 'register') {
        if (!name.trim()) throw new Error('Please enter your full name.');
        await register(email, password, name);
      } else if (authMode === 'forgot') {
        await resetPassword(email);
        setAuthSuccess('Password reset link has been dispatched to your email.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrStreet || !newAddrCity || !newAddrPostal) return;
    const newAddress: SavedAddress = {
      id: 'addr-' + Date.now(),
      label: newAddrLabel || 'Home Cellar',
      fullName: userProfile?.displayName || 'Patron',
      phone: userProfile?.phone || '',
      street: newAddrStreet,
      city: newAddrCity,
      postalCode: newAddrPostal,
      country: 'United States',
    };
    const updated = [...(userProfile?.savedAddresses || []), newAddress];
    await updateProfileData({ savedAddresses: updated });
    setShowAddressForm(false);
    setNewAddrStreet('');
    setNewAddrCity('');
    setNewAddrPostal('');
    setNewAddrLabel('');
  };

  // If user is not logged in, show luxury auth modal/card
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white border border-stone-200 p-8 sm:p-10 shadow-xl text-center">
          <p className="text-[11px] uppercase tracking-[0.25em] text-stone-600 font-semibold mb-1">
            Maison Pazion
          </p>
          <h1 className="text-2xl font-serif text-stone-950 mb-2">
            {authMode === 'login' && 'Sign In to Your Cellar'}
            {authMode === 'register' && 'Enroll in the Private Reserve'}
            {authMode === 'forgot' && 'Reset Account Password'}
          </h1>
          <p className="text-xs text-stone-600 mb-6">
            Access your order history, expedited concierge allocations, and saved addresses.
          </p>

          {authError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs text-left">
              {authError}
            </div>
          )}

          {authSuccess && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-left">
              {authSuccess}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4 text-left">
            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Eleanor Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-stone-300 p-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="patron@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-stone-300 p-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
              />
            </div>

            {authMode !== 'forgot' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-stone-300 p-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white text-xs uppercase tracking-[0.2em] font-semibold transition-colors mt-2"
            >
              {submitting ? (
                'Authenticating...'
              ) : authMode === 'login' ? (
                'Sign In'
              ) : authMode === 'register' ? (
                'Create Account'
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          {/* Switch modes */}
          <div className="mt-6 pt-4 border-t border-stone-100 flex flex-col gap-2 text-xs text-stone-600">
            {authMode === 'login' ? (
              <>
                <button
                  onClick={() => {
                    setAuthMode('register');
                    setAuthError('');
                  }}
                  className="hover:text-stone-950 underline"
                >
                  New patron? Enroll for exclusive member access
                </button>
                <button
                  onClick={() => {
                    setAuthMode('forgot');
                    setAuthError('');
                  }}
                  className="text-stone-600 hover:text-stone-700 text-[11px]"
                >
                  Forgot your password?
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setAuthMode('login');
                  setAuthError('');
                }}
                className="hover:text-stone-950 underline"
              >
                Already registered? Sign in here
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Logged-in Patron Dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4 mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-stone-600 font-semibold mb-1">
            Private Member Cellar
          </p>
          <h1 className="text-2xl sm:text-3xl font-serif text-stone-950">
            Welcome, {userProfile?.displayName}
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Member status: <span className="font-semibold text-stone-800 uppercase">{userProfile?.role || 'Customer'}</span> • {currentUser.email}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {userProfile?.role === 'admin' && (
            <button
              onClick={() => onNavigate('admin')}
              className="px-4 py-2 bg-amber-900 hover:bg-amber-800 text-white text-xs uppercase tracking-wider font-medium flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Suite</span>
            </button>
          )}
          <button
            onClick={logout}
            className="px-4 py-2 border border-stone-300 hover:border-stone-900 text-stone-800 text-xs uppercase tracking-wider font-medium flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Account Navigation Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="space-y-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-between ${
              activeTab === 'orders' ? 'bg-stone-900 text-white' : 'hover:bg-stone-100 text-stone-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span>Orders & Consignments</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`w-full text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-between ${
              activeTab === 'wishlist' ? 'bg-stone-900 text-white' : 'hover:bg-stone-100 text-stone-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span>Saved Cellar Wishlist ({wishlist.length})</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-between ${
              activeTab === 'addresses' ? 'bg-stone-900 text-white' : 'hover:bg-stone-100 text-stone-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Saved Delivery Addresses</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-between ${
              activeTab === 'profile' ? 'bg-stone-900 text-white' : 'hover:bg-stone-100 text-stone-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <UserIcon className="w-4 h-4" />
              <span>Patron Profile & Age Record</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-3 bg-white border border-stone-200 p-6 sm:p-8">
          {/* TAB 1: Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl text-stone-900 pb-3 border-b border-stone-200">
                Order History & Live Consignments
              </h2>

              {loadingOrders ? (
                <div className="py-12 text-center text-xs text-stone-600">
                  Retrieving your consignment records...
                </div>
              ) : userOrders.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-stone-200 p-6">
                  <Package className="w-8 h-8 mx-auto text-stone-600 mb-2 stroke-[1.2]" />
                  <p className="font-serif text-base text-stone-800 mb-1">No Orders Recorded Yet</p>
                  <p className="text-xs text-stone-600 mb-4">
                    Your luxury spirit purchases and delivery updates will appear here.
                  </p>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="px-6 py-2.5 bg-stone-900 text-white text-xs uppercase tracking-wider font-medium"
                  >
                    Explore Catalog
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userOrders.map((order) => (
                    <div key={order.id} className="border border-stone-200 p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                        <div>
                          <span className="font-serif text-base text-stone-900 font-semibold">
                            Order {order.id}
                          </span>
                          <span className="text-xs text-stone-600 ml-3">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-0.5 bg-stone-100 text-stone-800 text-[10px] uppercase font-semibold">
                            {order.orderStatus.replace(/_/g, ' ')}
                          </span>
                          <button
                            onClick={() => onNavigate('track', order.id)}
                            className="text-xs uppercase font-medium text-stone-900 underline hover:text-stone-600"
                          >
                            Live Tracking
                          </button>
                        </div>
                      </div>

                      <div className="divide-y divide-stone-100 text-xs">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="py-2 flex items-center justify-between">
                            <span className="text-stone-800">
                              {it.quantity}x {it.name} ({it.volume})
                            </span>
                            <span className="font-medium text-stone-900">
                              ${(it.price * it.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-stone-100 flex justify-between items-center text-xs">
                        <span className="text-stone-600">
                          Total Value: <strong className="text-stone-900">${order.total.toFixed(2)}</strong>
                        </span>
                        <span className="text-[11px] text-stone-600">
                          Tracking code: <code className="font-mono font-bold text-stone-800">{order.trackingNumber}</code>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Wishlist */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl text-stone-900 pb-3 border-b border-stone-200">
                Your Saved Cellar ({wishlist.length})
              </h2>

              {wishlist.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-stone-200 p-6">
                  <Heart className="w-8 h-8 mx-auto text-stone-600 mb-2 stroke-[1.2]" />
                  <p className="font-serif text-base text-stone-800 mb-1">Your Wishlist is Empty</p>
                  <p className="text-xs text-stone-600 mb-4">
                    Save rare bottles while browsing to monitor stock and allocations.
                  </p>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="px-6 py-2.5 bg-stone-900 text-white text-xs uppercase tracking-wider font-medium"
                  >
                    Browse Spirits
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlist.map((prod) => (
                    <div key={prod.id} className="border border-stone-200 p-4 flex gap-4 items-center">
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        onClick={() => onSelectProduct(prod)}
                        className="w-16 h-16 object-contain mix-blend-multiply bg-stone-50 border p-1 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <h4
                          onClick={() => onSelectProduct(prod)}
                          className="font-serif text-xs sm:text-sm text-stone-900 truncate hover:underline cursor-pointer"
                        >
                          {prod.name}
                        </h4>
                        <p className="text-xs font-semibold text-stone-900 mt-0.5">
                          ${(prod.discountPrice ?? prod.price).toFixed(2)}
                        </p>
                        <button
                          onClick={() => addToCart(prod, 1)}
                          className="mt-2 text-[10px] uppercase tracking-wider font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 px-2.5 py-1"
                        >
                          Move to Bag
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Addresses */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <h2 className="font-serif text-xl text-stone-900">Saved Delivery Destinations</h2>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="px-3 py-1.5 bg-stone-900 text-white text-xs uppercase tracking-wider font-medium flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Destination</span>
                </button>
              </div>

              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="p-4 bg-stone-50 border border-stone-200 space-y-4">
                  <h3 className="text-xs uppercase tracking-wider font-bold text-stone-900">
                    New Destination Address
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Label (e.g. Primary Residence, Hamptons Villa)"
                      value={newAddrLabel}
                      onChange={(e) => setNewAddrLabel(e.target.value)}
                      className="bg-white border border-stone-300 p-2 text-xs"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Street Address *"
                      value={newAddrStreet}
                      onChange={(e) => setNewAddrStreet(e.target.value)}
                      className="bg-white border border-stone-300 p-2 text-xs"
                    />
                    <input
                      type="text"
                      required
                      placeholder="City *"
                      value={newAddrCity}
                      onChange={(e) => setNewAddrCity(e.target.value)}
                      className="bg-white border border-stone-300 p-2 text-xs"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Postal Code *"
                      value={newAddrPostal}
                      onChange={(e) => setNewAddrPostal(e.target.value)}
                      className="bg-white border border-stone-300 p-2 text-xs"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-stone-900 text-white text-xs uppercase font-medium"
                    >
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="px-4 py-2 bg-stone-200 text-stone-800 text-xs uppercase font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(userProfile?.savedAddresses || []).map((addr) => (
                  <div key={addr.id} className="border border-stone-200 p-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold uppercase tracking-wider text-stone-900">
                        {addr.label}
                      </span>
                    </div>
                    <p className="text-stone-700">{addr.street}</p>
                    <p className="text-stone-700">
                      {addr.city}, {addr.postalCode}, {addr.country}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Profile */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl text-stone-900 pb-3 border-b border-stone-200">
                Patron Information & Security
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-stone-50 border border-stone-200 space-y-1">
                  <span className="uppercase text-stone-600 tracking-wider font-semibold">
                    Full Legal Name
                  </span>
                  <p className="font-medium text-stone-900 text-sm">{userProfile?.displayName}</p>
                </div>

                <div className="p-4 bg-stone-50 border border-stone-200 space-y-1">
                  <span className="uppercase text-stone-600 tracking-wider font-semibold">
                    Email Account
                  </span>
                  <p className="font-medium text-stone-900 text-sm">{currentUser.email}</p>
                </div>

                <div className="p-4 bg-stone-50 border border-stone-200 space-y-1">
                  <span className="uppercase text-stone-600 tracking-wider font-semibold">
                    Age Verification Status
                  </span>
                  <p className="font-medium text-emerald-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Verified Legal Drinking Age</span>
                  </p>
                </div>

                <div className="p-4 bg-stone-50 border border-stone-200 space-y-1">
                  <span className="uppercase text-stone-600 tracking-wider font-semibold">
                    Enrolled Since
                  </span>
                  <p className="font-medium text-stone-900 text-sm">
                    {new Date(userProfile?.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
