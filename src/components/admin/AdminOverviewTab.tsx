import React from 'react';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  AlertTriangle,
  XCircle,
  Users,
  TrendingUp,
  ArrowUpRight,
  Package,
  Eye,
  Plus,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminTab } from './AdminSidebar';
import { Order, OrderStatus } from '../../types';

interface AdminOverviewTabProps {
  onNavigateTab: (tab: AdminTab) => void;
  onSelectOrder: (order: Order) => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  onNavigateTab,
  onSelectOrder,
}) => {
  const { products, orders, categories } = useStore();

  // Metrics calculations
  const totalSales = orders
    .filter((o) => o.paymentStatus === 'paid' || o.orderStatus !== 'cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const today = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter((o) => o.createdAt.startsWith(today));
  const pendingOrders = orders.filter(
    (o) => o.orderStatus === 'order_received' || o.orderStatus === 'order_confirmed'
  );

  const lowStockItems = products.filter(
    (p) => p.stock > 0 && p.stock <= (p.lowStockThreshold ?? 5)
  );
  const outOfStockItems = products.filter((p) => p.stock === 0);

  // Simulated daily revenue for the past 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayOrders = orders.filter((o) => o.createdAt.startsWith(dateStr));
    const revenue = dayOrders.reduce((sum, o) => sum + o.total, 0);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    return { date: dateStr, day: dayName, revenue, orders: dayOrders.length };
  });

  const maxRevenue = Math.max(...last7Days.map((d) => d.revenue), 500);

  // Top products
  const topProducts = [...products]
    .sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount))
    .slice(0, 5);

  const recentOrders = [...orders].slice(0, 8);

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
    <div className="space-y-6 font-sans">
      {/* Action Banner / Quick Alerts */}
      {(lowStockItems.length > 0 || pendingOrders.length > 0) && (
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-amber-900">
                Operational Attention Required
              </p>
              <p className="text-amber-800 mt-0.5">
                {pendingOrders.length} pending orders waiting for fulfillment • {lowStockItems.length} bottles below reorder threshold.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {pendingOrders.length > 0 && (
              <button
                onClick={() => onNavigateTab('orders')}
                className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-medium rounded transition"
              >
                View Orders Queue
              </button>
            )}
            {lowStockItems.length > 0 && (
              <button
                onClick={() => onNavigateTab('inventory')}
                className="px-3 py-1.5 bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 font-medium rounded transition"
              >
                Stock Refill
              </button>
            )}
          </div>
        </div>
      )}

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Sales */}
        <div className="bg-white border border-stone-200 p-4 rounded-lg">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Sales</span>
            <DollarSign className="w-4 h-4 text-stone-400" />
          </div>
          <p className="text-xl font-serif font-bold text-stone-900">
            ${totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[10px] text-emerald-600 font-medium mt-1 flex items-center">
            <TrendingUp className="w-3 h-3 mr-0.5" /> Lifetime verified
          </p>
        </div>

        {/* Today's Orders */}
        <div className="bg-white border border-stone-200 p-4 rounded-lg">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Today's Orders</span>
            <ShoppingBag className="w-4 h-4 text-stone-400" />
          </div>
          <p className="text-xl font-serif font-bold text-stone-900">
            {todayOrders.length}
          </p>
          <p className="text-[10px] text-stone-500 mt-1">
            {orders.length} total consignments
          </p>
        </div>

        {/* Pending Orders */}
        <div className="bg-white border border-stone-200 p-4 rounded-lg">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Pending Orders</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl font-serif font-bold text-stone-900">
            {pendingOrders.length}
          </p>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-[10px] text-stone-600 hover:text-stone-900 font-medium mt-1 underline"
          >
            Review queue →
          </button>
        </div>

        {/* Low Stock Items */}
        <div className="bg-white border border-stone-200 p-4 rounded-lg">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Low Stock</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl font-serif font-bold text-amber-700">
            {lowStockItems.length}
          </p>
          <button
            onClick={() => onNavigateTab('inventory')}
            className="text-[10px] text-stone-600 hover:text-stone-900 font-medium mt-1 underline"
          >
            Manage alerts →
          </button>
        </div>

        {/* Out of Stock */}
        <div className="bg-white border border-stone-200 p-4 rounded-lg">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Out of Stock</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-xl font-serif font-bold text-rose-700">
            {outOfStockItems.length}
          </p>
          <p className="text-[10px] text-stone-500 mt-1">
            {products.length} live SKUs
          </p>
        </div>

        {/* Total Catalog Vintages */}
        <div className="bg-white border border-stone-200 p-4 rounded-lg">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Categories</span>
            <Package className="w-4 h-4 text-stone-400" />
          </div>
          <p className="text-xl font-serif font-bold text-stone-900">
            {categories.length}
          </p>
          <p className="text-[10px] text-stone-500 mt-1">
            {products.length} catalog items
          </p>
        </div>
      </div>

      {/* Two Column Layout: Sales Trend Chart & Top Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-stone-200 p-5 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-stone-900">Revenue Performance</h2>
              <p className="text-xs text-stone-500">Consignment volume past 7 days</p>
            </div>
            <span className="text-xs font-medium text-stone-500">USD ($)</span>
          </div>

          <div className="h-48 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-stone-100">
            {last7Days.map((item) => {
              const heightPct = Math.max(8, (item.revenue / maxRevenue) * 100);
              return (
                <div key={item.date} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-[10px] font-mono text-stone-500 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                    ${item.revenue.toFixed(0)}
                  </div>
                  <div className="w-full max-w-[36px] bg-stone-100 rounded-t overflow-hidden relative h-36 flex items-end">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full bg-stone-900 rounded-t transition-all duration-300 group-hover:bg-amber-700"
                    />
                  </div>
                  <span className="text-[11px] font-medium text-stone-600">{item.day}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-stone-500">
            <span>Average Order Value: $192.40</span>
            <span>Delivery Fulfillment Rate: 98.4%</span>
          </div>
        </div>

        {/* Top-Selling Spirits (1 Col) */}
        <div className="bg-white border border-stone-200 p-5 rounded-lg flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-stone-900">Top Spirits & Vintages</h2>
              <p className="text-xs text-stone-500">Highest rated client selections</p>
            </div>
            <button
              onClick={() => onNavigateTab('products')}
              className="text-xs text-stone-600 hover:text-stone-900 underline"
            >
              Catalog →
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {topProducts.map((prod) => (
              <div key={prod.id} className="flex items-center gap-3 p-2 rounded hover:bg-stone-50 transition border border-transparent hover:border-stone-200">
                <img
                  src={prod.imageUrl}
                  alt={prod.name}
                  className="w-10 h-10 object-cover rounded bg-stone-100 shrink-0 border border-stone-200"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-stone-900 truncate">{prod.name}</p>
                  <p className="text-[11px] text-stone-500">
                    {prod.brand} • {prod.volume}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-stone-900">${prod.price.toFixed(2)}</p>
                  <p className="text-[10px] text-stone-400">{prod.stock} in stock</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-stone-900">Recent Customer Orders</h2>
            <p className="text-xs text-stone-500">Real-time cellar purchase log and handover queue</p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded transition"
          >
            View All Orders ({orders.length})
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase tracking-wider text-[10px] font-semibold">
              <tr>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Bottles</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-400">
                    No orders recorded yet. Placing a test order from the shop will populate this queue immediately.
                  </td>
                </tr>
              ) : (
                recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-50/60 transition">
                    <td className="py-3 px-4 font-mono font-semibold text-stone-900">{ord.id}</td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-stone-900">{ord.customerName}</p>
                      <p className="text-[11px] text-stone-500 truncate max-w-[150px]">{ord.customerEmail}</p>
                    </td>
                    <td className="py-3 px-4 text-stone-700">
                      {ord.items.reduce((s, i) => s + i.quantity, 0)} bottles
                    </td>
                    <td className="py-3 px-4 font-bold text-stone-900">${ord.total.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${getStatusBadge(ord.orderStatus)}`}>
                        {ord.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-500 text-[11px]">
                      {new Date(ord.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onSelectOrder(ord)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded transition"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
