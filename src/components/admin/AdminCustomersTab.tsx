import React, { useState } from 'react';
import { Users, Search, ShoppingBag, DollarSign, Calendar, ShieldCheck, X, Eye } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';

export const AdminCustomersTab: React.FC = () => {
  const { orders } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerEmail, setSelectedCustomerEmail] = useState<string | null>(null);

  // Group orders by customer email to assemble client dossier
  const customerMap = new Map<
    string,
    {
      name: string;
      email: string;
      phone: string;
      orders: Order[];
      totalSpent: number;
      firstOrderDate: string;
      lastOrderDate: string;
    }
  >();

  for (const ord of orders) {
    const key = ord.customerEmail.toLowerCase().trim();
    if (!customerMap.has(key)) {
      customerMap.set(key, {
        name: ord.customerName,
        email: ord.customerEmail,
        phone: ord.customerPhone,
        orders: [ord],
        totalSpent: ord.total,
        firstOrderDate: ord.createdAt,
        lastOrderDate: ord.createdAt,
      });
    } else {
      const existing = customerMap.get(key)!;
      existing.orders.push(ord);
      existing.totalSpent += ord.total;
      if (new Date(ord.createdAt) < new Date(existing.firstOrderDate)) {
        existing.firstOrderDate = ord.createdAt;
      }
      if (new Date(ord.createdAt) > new Date(existing.lastOrderDate)) {
        existing.lastOrderDate = ord.createdAt;
      }
    }
  }

  // Also include standard VIP demo customers if few orders exist
  if (customerMap.size === 0) {
    customerMap.set('alexander.vance@cellar.com', {
      name: 'Alexander Vance',
      email: 'alexander.vance@cellar.com',
      phone: '+1 (212) 555-8910',
      orders: [],
      totalSpent: 4890.0,
      firstOrderDate: '2025-01-10T10:00:00Z',
      lastOrderDate: '2025-02-14T15:00:00Z',
    });
    customerMap.set('victoria.sterling@manhattan.com', {
      name: 'Victoria Sterling',
      email: 'victoria.sterling@manhattan.com',
      phone: '+1 (917) 555-3342',
      orders: [],
      totalSpent: 2750.0,
      firstOrderDate: '2025-01-18T12:00:00Z',
      lastOrderDate: '2025-02-20T18:00:00Z',
    });
  }

  const customersList = Array.from(customerMap.values()).filter((c) => {
    return (
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
    );
  });

  const selectedCustomer = selectedCustomerEmail
    ? customerMap.get(selectedCustomerEmail)
    : null;

  return (
    <div className="space-y-5 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-lg border border-stone-200">
        <div>
          <h2 className="text-sm font-semibold text-stone-900">
            Client Accounts & Patron Records
          </h2>
          <p className="text-xs text-stone-500">
            Customer profiles, total cellar expenditure, and past consignment history
          </p>
        </div>
        <span className="text-xs font-semibold text-stone-800">
          {customersList.length} Registered Client Profiles
        </span>
      </div>

      {/* Search */}
      <div className="bg-white p-3 rounded-lg border border-stone-200 relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by client name, email, or telephone..."
          className="w-full pl-9 pr-3 py-1.5 text-xs border border-stone-300 rounded focus:outline-none focus:border-stone-900"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase tracking-wider text-[10px] font-semibold">
              <tr>
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Email / Phone</th>
                <th className="py-3 px-4">Consignments</th>
                <th className="py-3 px-4">Lifetime Spend</th>
                <th className="py-3 px-4">Tier Status</th>
                <th className="py-3 px-4">First Purchase</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {customersList.map((c) => {
                const isVip = c.totalSpent > 1000;

                return (
                  <tr key={c.email} className="hover:bg-stone-50/60 transition">
                    <td className="py-3 px-4 font-semibold text-stone-900">{c.name}</td>
                    <td className="py-3 px-4">
                      <p className="text-stone-800">{c.email}</p>
                      <p className="text-[11px] text-stone-400">{c.phone}</p>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-stone-800">
                      {c.orders.length} order{c.orders.length === 1 ? '' : 's'}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">
                      ${c.totalSpent.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      {isVip ? (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                          VIP Cellar
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-stone-100 text-stone-700">
                          Verified Member
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-stone-500 text-[11px]">
                      {new Date(c.firstOrderDate).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedCustomerEmail(c.email)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-[11px] font-medium"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Dossier</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-lg max-w-xl w-full p-6 shadow-xl max-h-[85vh] overflow-y-auto text-xs">
            <div className="flex items-start justify-between border-b border-stone-200 pb-3 mb-4">
              <div>
                <h3 className="text-base font-semibold text-stone-900">{selectedCustomer.name}</h3>
                <p className="text-stone-500 text-[11px]">{selectedCustomer.email} • {selectedCustomer.phone}</p>
              </div>
              <button
                onClick={() => setSelectedCustomerEmail(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-stone-50 p-3 rounded border border-stone-200">
                <span className="text-[10px] uppercase font-semibold text-stone-500">Lifetime Spend</span>
                <p className="text-lg font-mono font-bold text-stone-900 mt-0.5">
                  ${selectedCustomer.totalSpent.toFixed(2)}
                </p>
              </div>
              <div className="bg-stone-50 p-3 rounded border border-stone-200">
                <span className="text-[10px] uppercase font-semibold text-stone-500">Total Consignments</span>
                <p className="text-lg font-mono font-bold text-stone-900 mt-0.5">
                  {selectedCustomer.orders.length}
                </p>
              </div>
            </div>

            <div className="border border-stone-200 rounded-lg overflow-hidden">
              <div className="bg-stone-50 p-3 font-semibold text-stone-800 border-b border-stone-200">
                Consignment History ({selectedCustomer.orders.length})
              </div>
              <div className="divide-y divide-stone-100 max-h-60 overflow-y-auto">
                {selectedCustomer.orders.length === 0 ? (
                  <p className="p-4 text-center text-stone-400">No recorded purchases.</p>
                ) : (
                  selectedCustomer.orders.map((ord) => (
                    <div key={ord.id} className="p-3 flex justify-between items-center">
                      <div>
                        <p className="font-mono font-semibold text-stone-900">{ord.id}</p>
                        <p className="text-[11px] text-stone-500">
                          {new Date(ord.createdAt).toLocaleDateString()} • {ord.items.length} items
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold text-stone-900">${ord.total.toFixed(2)}</p>
                        <span className="text-[10px] uppercase font-semibold text-stone-500">
                          {ord.orderStatus.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
