import React, { useState } from 'react';
import { Shield, Search, Filter, Clock, User, FileText } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AuditLog } from '../../types';

export const AdminAuditTab: React.FC = () => {
  const { auditLogs } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');

  const filteredLogs = auditLogs.filter((log) => {
    const detailsText = log.details || log.affectedItem || '';
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      detailsText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.adminEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = actionFilter === 'all' || log.action === actionFilter;

    return matchesSearch && matchesFilter;
  });

  const getActionBadgeColor = (action: string) => {
    if (action.includes('delete') || action.includes('cancel')) {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    if (action.includes('add') || action.includes('create')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (action.includes('status') || action.includes('stock')) {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    return 'bg-stone-100 text-stone-800 border-stone-300';
  };

  return (
    <div className="space-y-5 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-lg border border-stone-200">
        <div>
          <h2 className="text-sm font-semibold text-stone-900">
            Immutable Cellar Operations Audit Trail
          </h2>
          <p className="text-xs text-stone-500">
            Chronological ledger of inventory updates, price modifications, order transitions, and administrative actions
          </p>
        </div>
        <span className="text-xs font-semibold text-stone-800">
          {filteredLogs.length} Recorded Operational Events
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-lg border border-stone-200 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit trail by keyword, bottle, or staff email..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-stone-300 rounded focus:outline-none focus:border-stone-900"
          />
        </div>

        <div className="sm:w-60">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded focus:outline-none focus:border-stone-900 bg-white"
          >
            <option value="all">All Action Types</option>
            <option value="order_status_updated">Order Status Changed</option>
            <option value="stock_adjusted">Stock Adjusted</option>
            <option value="product_created">Product Created</option>
            <option value="product_updated">Product Updated</option>
            <option value="product_deleted">Product Deleted</option>
            <option value="store_settings_updated">Settings Updated</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase tracking-wider text-[10px] font-semibold">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Details / Metadata</th>
                <th className="py-3 px-4">Staff Attribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-stone-400">
                    No operational audit events match your search.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/60 transition">
                    <td className="py-3 px-4 font-mono text-[11px] text-stone-500 whitespace-nowrap">
                      {new Date(item.timestamp).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${getActionBadgeColor(
                          item.action
                        )}`}
                      >
                        {item.action.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-800 font-medium">
                      {item.details}
                    </td>
                    <td className="py-3 px-4 font-mono text-stone-600 text-[11px]">
                      {item.adminEmail}
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
