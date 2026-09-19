import React, { useState } from 'react';
import {
  CheckCircle,
  PackageCheck,
  Truck,
  MapPin,
  Clock,
  Search,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Order, OrderStatus } from '../types';

interface OrderTrackingPageProps {
  initialOrder?: Order | null;
  onNavigate: (view: string, param?: string) => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  initialOrder,
  onNavigate,
}) => {
  const [orderNumberInput, setOrderNumberInput] = useState(initialOrder?.id || '');
  const [emailInput, setEmailInput] = useState(initialOrder?.customerEmail || '');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(initialOrder || null);
  const [isSearching, setIsSearching] = useState(false);
  const [errorNotice, setErrorNotice] = useState('');

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice('');
    if (!orderNumberInput.trim()) {
      setErrorNotice('Please provide your order reference number (e.g., PZ-102934).');
      return;
    }

    setIsSearching(true);
    try {
      const docRef = doc(db, 'orders', orderNumberInput.trim());
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const orderData = snap.data() as Order;
        if (
          emailInput.trim() &&
          orderData.customerEmail.toLowerCase() !== emailInput.trim().toLowerCase()
        ) {
          setErrorNotice('Email does not match the record for this order reference.');
          setTrackedOrder(null);
        } else {
          setTrackedOrder(orderData);
        }
      } else {
        // Mock fallback if order was placed locally or not yet synced
        setErrorNotice('No consignment record located with this identifier. Please verify and try again.');
        setTrackedOrder(null);
      }
    } catch (err) {
      console.warn('Tracking query notice:', err);
      setErrorNotice('Consignment search query encountered an error. Please try again in a moment.');
    } finally {
      setIsSearching(false);
    }
  };

  const steps: { key: OrderStatus; label: string; desc: string }[] = [
    {
      key: 'order_received',
      label: 'Order Received',
      desc: 'Cellar allocation initiated & payment confirmed.',
    },
    {
      key: 'order_confirmed',
      label: 'Order Confirmed',
      desc: 'Age verification record validated by concierge.',
    },
    {
      key: 'preparing',
      label: 'Preparing Packaging',
      desc: 'Vintages carefully retrieved from climate cellar.',
    },
    {
      key: 'out_for_delivery',
      label: 'Out For Delivery',
      desc: 'White-glove insulated courier en route to destination.',
    },
    {
      key: 'delivered',
      label: 'Delivered & Signed',
      desc: 'Handover complete with adult ID physical signature.',
    },
  ];

  const getStepIndex = (status: OrderStatus) => {
    const idx = steps.findIndex((s) => s.key === status);
    return idx === -1 ? 0 : idx;
  };

  const currentIdx = trackedOrder ? getStepIndex(trackedOrder.orderStatus) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-[11px] uppercase tracking-[0.25em] text-stone-600 font-semibold mb-1">
          Real-Time Consignment Intelligence
        </p>
        <h1 className="text-3xl font-serif text-stone-950">
          Track Your Cellar Consignment
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm mt-2 max-w-lg mx-auto">
          Enter your order reference number and associated email to review active cellar dispatch and courier progression.
        </p>
      </div>

      {/* Lookup Form */}
      <div className="bg-stone-50 border border-stone-200 p-6 sm:p-8 max-w-2xl mx-auto mb-12 shadow-sm">
        <form onSubmit={handleLookup} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Order Reference *
              </label>
              <input
                type="text"
                placeholder="e.g. PZ-582910"
                value={orderNumberInput}
                onChange={(e) => setOrderNumberInput(e.target.value)}
                className="w-full bg-white border border-stone-300 p-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Customer Email (Optional)
              </label>
              <input
                type="email"
                placeholder="patron@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-white border border-stone-300 p-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSearching}
              className="px-8 py-3 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white text-xs uppercase tracking-[0.2em] font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>{isSearching ? 'Locating...' : 'Track Consignment'}</span>
            </button>
          </div>
        </form>

        {errorNotice && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorNotice}</span>
          </div>
        )}
      </div>

      {/* Results View */}
      {trackedOrder && (
        <div className="bg-white border border-stone-200 p-6 sm:p-10 space-y-8 animate-in fade-in duration-300">
          {/* Order Details Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xl font-serif text-stone-950 font-normal">
                  Order {trackedOrder.id}
                </span>
                <span className="px-2.5 py-0.5 bg-stone-100 border border-stone-300 text-stone-800 text-[10px] uppercase font-semibold tracking-wider">
                  {trackedOrder.orderStatus.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-1">
                Placed on {new Date(trackedOrder.createdAt).toLocaleString()} • Recipient: {trackedOrder.customerName}
              </p>
            </div>

            <div className="text-right sm:text-right">
              <p className="text-[11px] uppercase tracking-wider text-stone-600">Tracking Code</p>
              <p className="font-mono text-sm font-semibold text-stone-900">
                {trackedOrder.trackingNumber}
              </p>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="py-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
              {steps.map((s, idx) => {
                const isCompleted = idx <= currentIdx;
                const isCurrent = idx === currentIdx;
                return (
                  <div key={s.key} className="flex md:flex-col items-start gap-3 relative">
                    <div
                      className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        isCompleted
                          ? 'bg-stone-900 border-stone-900 text-white'
                          : 'bg-stone-50 border-stone-300 text-stone-400'
                      }`}
                    >
                      {isCompleted ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                    </div>
                    <div>
                      <h4
                        className={`text-xs uppercase tracking-wider font-semibold ${
                          isCurrent ? 'text-stone-950 font-bold' : isCompleted ? 'text-stone-800' : 'text-stone-400'
                        }`}
                      >
                        {s.label}
                      </h4>
                      <p className="text-[11px] text-stone-600 mt-0.5 leading-snug">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Consignment Specs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-stone-200 text-xs">
            <div className="space-y-1">
              <p className="uppercase tracking-wider text-stone-600 font-semibold">Dispatch Address</p>
              {trackedOrder.deliveryMethod === 'pickup' ? (
                <p className="text-stone-800">
                  Store Pickup at Pazion Flagship Boutique No. 12, NY 10012.
                </p>
              ) : (
                <p className="text-stone-800">
                  {trackedOrder.shippingAddress?.street}, {trackedOrder.shippingAddress?.city},{' '}
                  {trackedOrder.shippingAddress?.postalCode}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <p className="uppercase tracking-wider text-stone-600 font-semibold">Estimated Handover</p>
              <p className="text-stone-800">
                {trackedOrder.estimatedDelivery || 'Within 2-4 hours (Local climate dispatch)'}
              </p>
            </div>

            <div className="space-y-1">
              <p className="uppercase tracking-wider text-stone-600 font-semibold">Legal Age Handover</p>
              <div className="flex items-center gap-1.5 text-stone-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Physical ID Signature Required</span>
              </div>
            </div>
          </div>

          {/* Items Preview */}
          <div className="pt-6 border-t border-stone-200">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-900 mb-3">
              Consigned Items
            </h4>
            <div className="divide-y divide-stone-100">
              {trackedOrder.items.map((i, index) => (
                <div key={index} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={i.imageUrl}
                      alt={i.name}
                      className="w-10 h-10 object-contain mix-blend-multiply bg-stone-50 border p-1"
                    />
                    <div>
                      <p className="font-serif text-stone-900">{i.name}</p>
                      <p className="text-stone-600 text-[11px]">{i.brand} • {i.volume} • Qty: {i.quantity}</p>
                    </div>
                  </div>
                  <span className="font-medium text-stone-900">
                    ${(i.price * i.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-stone-200 flex justify-between text-sm font-serif">
              <span>Total Consignment Value</span>
              <span className="font-sans font-semibold">${trackedOrder.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
