import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  CheckCircle,
  Truck,
  Clock,
  Printer,
  X,
  AlertCircle,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { Order, OrderStatus } from '../../types';
import { AdminInvoiceModal } from './AdminInvoiceModal';

interface AdminOrdersTabProps {
  selectedOrderProp?: Order | null;
  onClearSelectedOrder?: () => void;
}

export const AdminOrdersTab: React.FC<AdminOrdersTabProps> = ({
  selectedOrderProp,
  onClearSelectedOrder,
}) => {
  const { orders, updateOrderStatus } = useStore();
  const { userProfile } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeOrder, setActiveOrder] = useState<Order | null>(selectedOrderProp || null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [statusUpdateNote, setStatusUpdateNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerPhone.includes(searchQuery) ||
        o.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = selectedStatus === 'all' || o.orderStatus === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, selectedStatus]);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!activeOrder) return;
    setIsUpdating(true);
    try {
      await updateOrderStatus(activeOrder.id, newStatus, statusUpdateNote, userProfile?.email);
      // Update local activeOrder copy
      const updated = orders.find((o) => o.id === activeOrder.id);
      if (updated) {
        setActiveOrder(updated);
      }
      setStatusUpdateNote('');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'out_for_delivery':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'preparing':
      case 'order_confirmed':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'ready_for_pickup':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'order_received':
      default:
        return 'bg-stone-100 text-stone-800 border-stone-300';
    }
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-lg border border-stone-200">
        <div>
          <h2 className="text-sm font-semibold text-stone-900">
            Order Fulfillment & Courier Dispatch
          </h2>
          <p className="text-xs text-stone-500">
            Track client allocations, verify adult ID at handover, and update dispatch milestones
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-stone-800">{orders.length} Total Consignments</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg border border-stone-200 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, client name, email, phone, or tracking..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded focus:outline-none focus:border-stone-900"
          />
        </div>

        <div className="sm:w-64">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none focus:border-stone-900 bg-white"
          >
            <option value="all">All Order Statuses</option>
            <option value="order_received">Order Received (Pending)</option>
            <option value="order_confirmed">Confirmed & Payment Verified</option>
            <option value="preparing">Cellarmaster Allocation (Preparing)</option>
            <option value="ready_for_pickup">Ready For Flagship Pickup</option>
            <option value="out_for_delivery">Out For Courier Handover</option>
            <option value="delivered">Delivered & ID Verified</option>
            <option value="cancelled">Cancelled Consignment</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase tracking-wider text-[10px] font-semibold">
              <tr>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Bottles / Method</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Fulfillment Status</th>
                <th className="py-3 px-4">Date Placed</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    No orders match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const itemCount = ord.items.reduce((s, i) => s + i.quantity, 0);

                  return (
                    <tr key={ord.id} className="hover:bg-stone-50/70 transition">
                      <td className="py-3 px-4 font-mono font-bold text-stone-900">
                        {ord.id}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-stone-900">{ord.customerName}</p>
                        <p className="text-[11px] text-stone-500">{ord.customerEmail}</p>
                        <p className="text-[10px] text-stone-400">{ord.customerPhone}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-stone-800 font-medium">{itemCount} bottle{itemCount === 1 ? '' : 's'}</p>
                        <p className="text-[10px] text-stone-500 capitalize">{ord.deliveryMethod}</p>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-stone-900">
                        ${ord.total.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {ord.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${getStatusBadge(
                            ord.orderStatus
                          )}`}
                        >
                          {ord.orderStatus.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-stone-500 text-[11px]">
                        {new Date(ord.createdAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setActiveOrder(ord)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded font-medium text-[11px] transition shadow-xs"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Drawer / Modal */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-stone-200 rounded-lg max-w-3xl w-full p-6 my-8 shadow-2xl max-h-[90vh] overflow-y-auto text-xs">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-stone-200 pb-4 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-stone-900">{activeOrder.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${getStatusBadge(
                      activeOrder.orderStatus
                    )}`}
                  >
                    {activeOrder.orderStatus.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-stone-500 text-[11px] mt-0.5">
                  Placed {new Date(activeOrder.createdAt).toLocaleString()} • Tracking: <span className="font-mono font-semibold text-stone-800">{activeOrder.trackingNumber}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsInvoiceOpen(true)}
                  className="px-3 py-1.5 border border-stone-300 hover:bg-stone-100 rounded text-stone-800 font-semibold flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Invoice Slip</span>
                </button>
                <button
                  onClick={() => {
                    setActiveOrder(null);
                    if (onClearSelectedOrder) onClearSelectedOrder();
                  }}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Status Updater */}
            <div className="bg-stone-50 border border-stone-200 p-4 rounded-lg mb-5">
              <p className="font-semibold text-stone-900 uppercase tracking-wider text-[10px] mb-2">
                Update Fulfillment Status
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => handleStatusChange('order_confirmed')}
                  disabled={isUpdating}
                  className="px-3 py-2 bg-white border border-stone-300 hover:border-stone-900 rounded font-semibold text-stone-800 text-left transition"
                >
                  1. Confirm Consignment
                </button>
                <button
                  onClick={() => handleStatusChange('preparing')}
                  disabled={isUpdating}
                  className="px-3 py-2 bg-white border border-stone-300 hover:border-stone-900 rounded font-semibold text-stone-800 text-left transition"
                >
                  2. Bottle Allocation (Pack)
                </button>
                <button
                  onClick={() => handleStatusChange('out_for_delivery')}
                  disabled={isUpdating}
                  className="px-3 py-2 bg-white border border-stone-300 hover:border-stone-900 rounded font-semibold text-stone-800 text-left transition"
                >
                  3. Out For Courier Handover
                </button>
                <button
                  onClick={() => handleStatusChange('delivered')}
                  disabled={isUpdating}
                  className="px-3 py-2 bg-white border border-emerald-300 hover:border-emerald-600 rounded font-semibold text-emerald-800 text-left transition"
                >
                  4. Mark Delivered (ID Verified)
                </button>
                <button
                  onClick={() => handleStatusChange('ready_for_pickup')}
                  disabled={isUpdating}
                  className="px-3 py-2 bg-white border border-purple-300 hover:border-purple-600 rounded font-semibold text-purple-800 text-left transition"
                >
                  Flagship Pickup Ready
                </button>
                <button
                  onClick={() => handleStatusChange('cancelled')}
                  disabled={isUpdating}
                  className="px-3 py-2 bg-white border border-rose-300 hover:border-rose-600 rounded font-semibold text-rose-800 text-left transition"
                >
                  Cancel Consignment
                </button>
              </div>
            </div>

            {/* Grid: Customer & Delivery */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div className="border border-stone-200 p-4 rounded-lg">
                <h4 className="font-semibold uppercase tracking-wider text-[10px] text-stone-500 mb-2">
                  Client Dossier
                </h4>
                <p className="font-bold text-stone-900 text-sm">{activeOrder.customerName}</p>
                <p className="text-stone-600 mt-0.5">{activeOrder.customerEmail}</p>
                <p className="text-stone-600">{activeOrder.customerPhone}</p>
                <div className="mt-2 pt-2 border-t border-stone-100 flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Age Verified 21+ at Checkout</span>
                </div>
              </div>

              <div className="border border-stone-200 p-4 rounded-lg">
                <h4 className="font-semibold uppercase tracking-wider text-[10px] text-stone-500 mb-2">
                  Handover Address & Method
                </h4>
                <p className="font-bold text-stone-900 capitalize">
                  {activeOrder.deliveryMethod === 'pickup' ? 'Flagship Boutique Pickup' : 'Climate Courier Delivery'}
                </p>
                {activeOrder.shippingAddress ? (
                  <div className="text-stone-600 mt-1 leading-relaxed">
                    <p>{activeOrder.shippingAddress.street}</p>
                    <p>{activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.postalCode}</p>
                    <p>{activeOrder.shippingAddress.country}</p>
                    {activeOrder.shippingAddress.deliveryInstructions && (
                      <p className="mt-1 text-stone-500 italic">
                        "{activeOrder.shippingAddress.deliveryInstructions}"
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-stone-600 mt-1">482 West Broadway, SoHo, NY</p>
                )}
              </div>
            </div>

            {/* Bottles Breakdown */}
            <div className="border border-stone-200 rounded-lg overflow-hidden mb-5">
              <div className="bg-stone-50 p-3 font-semibold text-stone-800 border-b border-stone-200">
                Consigned Bottles ({activeOrder.items.length})
              </div>
              <div className="divide-y divide-stone-100">
                {activeOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded border border-stone-200 bg-stone-100"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="font-semibold text-stone-900">{item.name}</p>
                        <p className="text-[11px] text-stone-500">{item.brand} • {item.volume}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-stone-900">
                        {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                      <p className="text-[11px] text-stone-500 font-mono">
                        ${(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Financials */}
              <div className="bg-stone-50 p-4 border-t border-stone-200 space-y-1 text-right">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal:</span>
                  <span className="font-mono font-semibold">${activeOrder.subtotal.toFixed(2)}</span>
                </div>
                {activeOrder.discountTotal > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount ({activeOrder.couponCode || 'Promo'}):</span>
                    <span className="font-mono font-semibold">-${activeOrder.discountTotal.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Delivery Courier:</span>
                  <span className="font-mono font-semibold">${activeOrder.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-950 font-bold text-sm pt-2 border-t border-stone-200">
                  <span>Total Billed:</span>
                  <span className="font-mono">${activeOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            {activeOrder.timeline && activeOrder.timeline.length > 0 && (
              <div className="border border-stone-200 p-4 rounded-lg">
                <h4 className="font-semibold uppercase tracking-wider text-[10px] text-stone-500 mb-3">
                  Consignment Milestone History
                </h4>
                <div className="space-y-3">
                  {activeOrder.timeline.map((entry, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-stone-900 mt-1.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-stone-900">{entry.label}</p>
                          <span className="text-[10px] text-stone-400">
                            {new Date(entry.timestamp).toLocaleString()}
                          </span>
                        </div>
                        {entry.note && (
                          <p className="text-[11px] text-stone-600 mt-0.5">{entry.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Invoice Slip Modal */}
      {isInvoiceOpen && activeOrder && (
        <AdminInvoiceModal order={activeOrder} onClose={() => setIsInvoiceOpen(false)} />
      )}
    </div>
  );
};
