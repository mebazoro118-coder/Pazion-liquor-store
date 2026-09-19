import React from 'react';
import { Wine, Printer, X } from 'lucide-react';
import { Order } from '../../types';

interface AdminInvoiceModalProps {
  order: Order;
  onClose: () => void;
}

export const AdminInvoiceModal: React.FC<AdminInvoiceModalProps> = ({ order, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-stone-200 rounded-lg max-w-2xl w-full p-8 shadow-2xl my-8 text-stone-900 font-sans print:m-0 print:p-0 print:border-none print:shadow-none">
        {/* Controls - Hidden on Print */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-6 print:hidden">
          <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
            Official Cellar Invoice & Packing Slip
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Document */}
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-stone-200 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Wine className="w-6 h-6 text-stone-900" />
                <h1 className="text-xl font-serif tracking-wider uppercase font-bold text-stone-950">
                  PAZION LIQUOR STORE
                </h1>
              </div>
              <p className="text-xs text-stone-500">Purveyors of Fine Spirits & Grand Cru Cellars</p>
              <p className="text-xs text-stone-500">482 West Broadway, SoHo, New York, NY 10012</p>
              <p className="text-xs text-stone-500">concierge@pazionliquor.com | +1 (212) 555-7294</p>
            </div>

            <div className="text-right">
              <span className="inline-block px-2.5 py-1 bg-stone-100 text-stone-800 font-mono text-xs font-bold uppercase tracking-wider rounded border border-stone-200 mb-1">
                {order.orderStatus.replace(/_/g, ' ')}
              </span>
              <p className="text-xs text-stone-500">Invoice Ref:</p>
              <p className="font-mono text-sm font-bold text-stone-900">{order.id}</p>
              <p className="text-xs text-stone-500 mt-1">
                Date: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Customer & Delivery Details */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            <div className="bg-stone-50 p-4 rounded border border-stone-200">
              <p className="font-semibold uppercase tracking-wider text-[10px] text-stone-500 mb-2">
                Client Consignment Info
              </p>
              <p className="font-bold text-stone-900 text-sm">{order.customerName}</p>
              <p className="text-stone-600">{order.customerEmail}</p>
              <p className="text-stone-600">{order.customerPhone}</p>
              <p className="text-stone-500 mt-2">
                Age Verification: <strong className="text-stone-900">VERIFIED (21+)</strong>
              </p>
            </div>

            <div className="bg-stone-50 p-4 rounded border border-stone-200">
              <p className="font-semibold uppercase tracking-wider text-[10px] text-stone-500 mb-2">
                Fulfillment & Handover
              </p>
              <p className="font-bold text-stone-900 capitalize">Method: {order.deliveryMethod}</p>
              {order.shippingAddress ? (
                <div className="text-stone-600 mt-1 leading-relaxed">
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              ) : (
                <p className="text-stone-600 mt-1">SoHo Flagship Vault Concierge Collection</p>
              )}
              <p className="font-mono text-[11px] text-stone-700 mt-2">
                Tracking: <strong>{order.trackingNumber}</strong>
              </p>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-stone-200 text-stone-600 uppercase tracking-wider text-[10px] font-semibold">
                <th className="py-2">Item Description</th>
                <th className="py-2">Brand / Volume</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Unit Price</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-2.5 font-semibold text-stone-900">{item.name}</td>
                  <td className="py-2.5 text-stone-600">{item.brand} ({item.volume})</td>
                  <td className="py-2.5 text-center font-bold text-stone-900">{item.quantity}</td>
                  <td className="py-2.5 text-right font-mono">${item.price.toFixed(2)}</td>
                  <td className="py-2.5 text-right font-mono font-bold text-stone-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Financial Summary */}
          <div className="flex justify-end pt-4 border-t border-stone-200">
            <div className="w-64 space-y-1.5 text-xs text-stone-700">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono font-semibold">${order.subtotal.toFixed(2)}</span>
              </div>
              {order.discountTotal > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Promotional Discount:</span>
                  <span className="font-mono font-semibold">-${order.discountTotal.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Insulated Climate Delivery:</span>
                <span className="font-mono font-semibold">${order.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t-2 border-stone-900 text-sm font-bold text-stone-950">
                <span>Total Amount:</span>
                <span className="font-mono">${order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-stone-500 pt-1">
                <span>Payment Status:</span>
                <span className="uppercase font-semibold text-emerald-700">{order.paymentStatus}</span>
              </div>
            </div>
          </div>

          {/* Legal Alcohol Compliance Disclaimer */}
          <div className="pt-6 border-t border-stone-100 text-[10px] text-stone-400 leading-relaxed">
            <p>
              Alcohol Beverage Control Compliance: Pazion Liquor Store certifies that all bottles are tax-paid and legally acquired from licensed distributors. Recipient must present valid government photo identification proving age 21 or older at time of physical handover.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
