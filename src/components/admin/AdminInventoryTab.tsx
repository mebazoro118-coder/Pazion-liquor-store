import React, { useState, useMemo } from 'react';
import {
  Boxes,
  Search,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle,
  XCircle,
  History,
  X,
  Save,
  RotateCcw,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { Product } from '../../types';

export const AdminInventoryTab: React.FC = () => {
  const { products, inventoryHistory, adjustStock, setStockQuantity } = useStore();
  const { userProfile } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'low' | 'out' | 'in'>('all');
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');

  // Adjust Modal
  const [adjustModalProduct, setAdjustModalProduct] = useState<Product | null>(null);
  const [adjustDelta, setAdjustDelta] = useState<number>(1);
  const [adjustReason, setAdjustReason] = useState('New Shipment Receipt');
  const [customReason, setCustomReason] = useState('');
  const [newThreshold, setNewThreshold] = useState<number>(5);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));

      const threshold = p.lowStockThreshold ?? 5;
      let matchesFilter = true;
      if (filterStatus === 'low') matchesFilter = p.stock > 0 && p.stock <= threshold;
      else if (filterStatus === 'out') matchesFilter = p.stock === 0;
      else if (filterStatus === 'in') matchesFilter = p.stock > threshold;

      return matchesSearch && matchesFilter;
    });
  }, [products, searchQuery, filterStatus]);

  const lowStockCount = products.filter(
    (p) => p.stock > 0 && p.stock <= (p.lowStockThreshold ?? 5)
  ).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  const handleOpenAdjust = (p: Product) => {
    setAdjustModalProduct(p);
    setAdjustDelta(1);
    setAdjustReason('New Shipment Receipt');
    setCustomReason('');
    setNewThreshold(p.lowStockThreshold ?? 5);
  };

  const handleExecuteAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustModalProduct) return;
    const adminEmail = userProfile?.email || 'admin@pazionliquor.com';
    const reasonToLog = adjustReason === 'Other' ? (customReason || 'Manual adjustment') : adjustReason;

    await adjustStock(adjustModalProduct.id, adjustDelta, reasonToLog, adminEmail);
    if (newThreshold !== (adjustModalProduct.lowStockThreshold ?? 5)) {
      await setStockQuantity(adjustModalProduct.id, Math.max(0, adjustModalProduct.stock + adjustDelta), newThreshold, adminEmail);
    }
    setAdjustModalProduct(null);
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-lg border border-stone-200">
        <div>
          <h2 className="text-sm font-semibold text-stone-900">
            Vault Stock & Inventory Management
          </h2>
          <p className="text-xs text-stone-500">
            Real-time bottle counting, reorder warnings, and audit logging of physical stock movements
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded">
          <button
            onClick={() => setActiveTab('current')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
              activeTab === 'current'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Live Stock Table
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Adjustment Log ({inventoryHistory.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'current' ? (
        <>
          {/* Quick Filter Counters */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <button
              onClick={() => setFilterStatus('all')}
              className={`p-3 rounded-lg border text-left transition ${
                filterStatus === 'all'
                  ? 'border-stone-900 bg-stone-900 text-white'
                  : 'border-stone-200 bg-white hover:border-stone-300 text-stone-800'
              }`}
            >
              <p className="text-[10px] uppercase font-bold tracking-wider opacity-80">All SKUs</p>
              <p className="text-lg font-serif font-bold mt-0.5">{products.length}</p>
            </button>

            <button
              onClick={() => setFilterStatus('low')}
              className={`p-3 rounded-lg border text-left transition ${
                filterStatus === 'low'
                  ? 'border-amber-600 bg-amber-600 text-white'
                  : 'border-amber-200 bg-amber-50/50 hover:bg-amber-50 text-amber-900'
              }`}
            >
              <p className="text-[10px] uppercase font-bold tracking-wider opacity-80">Low Stock Alert</p>
              <p className="text-lg font-serif font-bold mt-0.5">{lowStockCount}</p>
            </button>

            <button
              onClick={() => setFilterStatus('out')}
              className={`p-3 rounded-lg border text-left transition ${
                filterStatus === 'out'
                  ? 'border-rose-600 bg-rose-600 text-white'
                  : 'border-rose-200 bg-rose-50/50 hover:bg-rose-50 text-rose-900'
              }`}
            >
              <p className="text-[10px] uppercase font-bold tracking-wider opacity-80">Out of Stock</p>
              <p className="text-lg font-serif font-bold mt-0.5">{outOfStockCount}</p>
            </button>

            <button
              onClick={() => setFilterStatus('in')}
              className={`p-3 rounded-lg border text-left transition ${
                filterStatus === 'in'
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-900'
              }`}
            >
              <p className="text-[10px] uppercase font-bold tracking-wider opacity-80">Well Stocked</p>
              <p className="text-lg font-serif font-bold mt-0.5">
                {products.length - lowStockCount - outOfStockCount}
              </p>
            </button>
          </div>

          {/* Search bar */}
          <div className="bg-white p-3 rounded-lg border border-stone-200 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by bottle name, maison, or SKU..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-stone-300 rounded focus:outline-none focus:border-stone-900"
            />
          </div>

          {/* Stock Table */}
          <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase tracking-wider text-[10px] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Bottle / Brand</th>
                    <th className="py-3 px-4">SKU</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Current Stock</th>
                    <th className="py-3 px-4">Reorder Level</th>
                    <th className="py-3 px-4">Stock Status</th>
                    <th className="py-3 px-4 text-right">Quick Adjust</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredProducts.map((p) => {
                    const threshold = p.lowStockThreshold ?? 5;
                    const isLow = p.stock > 0 && p.stock <= threshold;
                    const isOut = p.stock === 0;

                    return (
                      <tr key={p.id} className="hover:bg-stone-50/60 transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              className="w-9 h-9 object-cover rounded bg-stone-100 shrink-0 border border-stone-200"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <p className="font-semibold text-stone-900">{p.name}</p>
                              <p className="text-[11px] text-stone-500">{p.brand} • {p.volume}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-stone-700">
                          {p.sku || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-stone-700">{p.category}</td>
                        <td className="py-3 px-4 font-mono text-sm font-bold text-stone-900">
                          {p.stock} bottles
                        </td>
                        <td className="py-3 px-4 text-stone-500 font-mono">
                          ≤ {threshold} units
                        </td>
                        <td className="py-3 px-4">
                          {isOut ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-100 text-rose-800 rounded text-[10px] font-bold uppercase">
                              <XCircle className="w-3 h-3" /> Out of stock
                            </span>
                          ) : isLow ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-bold uppercase">
                              <AlertTriangle className="w-3 h-3" /> Low stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-semibold uppercase">
                              <CheckCircle className="w-3 h-3" /> In stock
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleOpenAdjust(p)}
                            className="px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded font-medium text-[11px] transition shadow-xs"
                          >
                            Adjust Stock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Inventory History Audit Table */
        <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-stone-200 flex justify-between items-center">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
                Stock Adjustment History & Audit Trail
              </h3>
              <p className="text-[11px] text-stone-500">All changes logged with reason and staff attribution</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase tracking-wider text-[10px] font-semibold">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Bottle</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Prev Qty</th>
                  <th className="py-3 px-4">Change</th>
                  <th className="py-3 px-4">New Qty</th>
                  <th className="py-3 px-4">Reason / Notes</th>
                  <th className="py-3 px-4">Authorized By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {inventoryHistory.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-stone-400">
                      No stock adjustments have been recorded yet.
                    </td>
                  </tr>
                ) : (
                  inventoryHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50/60 transition">
                      <td className="py-3 px-4 text-stone-500 font-mono text-[11px]">
                        {new Date(item.timestamp).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-4 font-semibold text-stone-900">{item.productName}</td>
                      <td className="py-3 px-4 font-mono text-stone-600">{item.sku}</td>
                      <td className="py-3 px-4 font-mono">{item.previousQuantity}</td>
                      <td className="py-3 px-4 font-mono font-bold">
                        <span
                          className={
                            item.changeDelta > 0
                              ? 'text-emerald-700'
                              : item.changeDelta < 0
                              ? 'text-rose-700'
                              : 'text-stone-700'
                          }
                        >
                          {item.changeDelta > 0 ? `+${item.changeDelta}` : item.changeDelta}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-stone-900">
                        {item.newQuantity}
                      </td>
                      <td className="py-3 px-4 text-stone-700">{item.reason}</td>
                      <td className="py-3 px-4 text-stone-500 text-[11px] font-mono">
                        {item.adminEmail}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {adjustModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-lg max-w-md w-full p-5 shadow-xl text-xs">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-semibold text-stone-900">Adjust Bottle Stock</h3>
                <p className="text-[11px] text-stone-500">{adjustModalProduct.name}</p>
              </div>
              <button
                onClick={() => setAdjustModalProduct(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExecuteAdjust} className="space-y-4">
              <div className="bg-stone-50 p-3 rounded border border-stone-200 flex justify-between items-center">
                <span className="text-stone-600">Current In Vault:</span>
                <span className="font-mono text-sm font-bold text-stone-900">
                  {adjustModalProduct.stock} bottles
                </span>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Quantity Adjustment Delta (+ or -)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustDelta((prev) => prev - 1)}
                    className="p-2 border border-stone-300 rounded hover:bg-stone-100"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={adjustDelta}
                    onChange={(e) => setAdjustDelta(parseInt(e.target.value, 10) || 0)}
                    required
                    className="flex-1 px-3 py-2 border border-stone-300 rounded text-center font-mono font-bold text-sm focus:border-stone-900 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setAdjustDelta((prev) => prev + 1)}
                    className="p-2 border border-stone-300 rounded hover:bg-stone-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[10px] text-stone-500 mt-1 text-center">
                  New stock will be:{' '}
                  <strong className="text-stone-900">
                    {Math.max(0, adjustModalProduct.stock + adjustDelta)} bottles
                  </strong>
                </p>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Reason for Adjustment *
                </label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none bg-white"
                >
                  <option value="New Shipment Receipt">New Shipment Delivery Inbound</option>
                  <option value="Physical Vault Count Reconciliation">Physical Count Reconciliation</option>
                  <option value="Damaged / Broken Bottle During Storage">Damaged / Broken Bottle</option>
                  <option value="VIP Tasting Room Sample Pour">VIP Tasting Room Sample Pour</option>
                  <option value="Supplier Return / Defect">Supplier Return / Defect</option>
                  <option value="Other">Other (Specify below)</option>
                </select>
              </div>

              {adjustReason === 'Other' && (
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Custom Operational Reason
                  </label>
                  <input
                    type="text"
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Enter audit notes..."
                    required
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Low Stock Alert Threshold (Bottles)
                </label>
                <input
                  type="number"
                  value={newThreshold}
                  onChange={(e) => setNewThreshold(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setAdjustModalProduct(null)}
                  className="px-3 py-1.5 border border-stone-300 hover:bg-stone-100 rounded text-stone-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded font-semibold flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Apply & Audit</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
