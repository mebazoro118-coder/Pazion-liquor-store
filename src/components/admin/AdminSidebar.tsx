import React from 'react';
import {
  LayoutDashboard,
  Wine,
  Package,
  FolderTree,
  Tag,
  ShoppingBag,
  Boxes,
  Users,
  TicketPercent,
  Truck,
  Star,
  BarChart3,
  Globe,
  Settings,
  ShieldCheck,
  History,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';

export type AdminTab =
  | 'overview'
  | 'products'
  | 'categories'
  | 'brands'
  | 'orders'
  | 'inventory'
  | 'customers'
  | 'promotions'
  | 'delivery'
  | 'reviews'
  | 'analytics'
  | 'content'
  | 'settings'
  | 'users'
  | 'audit';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onReturnToStore: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  onReturnToStore,
  isOpen = false,
  onClose,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const { userProfile, isOwner, isAdmin, isManager, logout } = useAuth();
  const { orders, products, reviews } = useStore();

  const openState = isOpen || isMobileOpen;
  const handleClose = () => {
    if (onClose) onClose();
    if (onCloseMobile) onCloseMobile();
  };

  const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'order_received' || o.orderStatus === 'order_confirmed').length;
  const lowStockCount = products.filter((p) => p.stock <= (p.lowStockThreshold ?? 5)).length;
  const pendingReviewsCount = reviews.filter((r) => r.status === 'pending').length;

  const navItems: {
    id: AdminTab;
    label: string;
    icon: React.ElementType;
    badge?: number;
    badgeColor?: string;
    requiresOwner?: boolean;
    requiresAdmin?: boolean;
  }[] = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package, badge: products.length },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'brands', label: 'Brands', icon: Tag },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: pendingOrdersCount, badgeColor: 'bg-amber-600 text-white' },
    { id: 'inventory', label: 'Inventory', icon: Boxes, badge: lowStockCount > 0 ? lowStockCount : undefined, badgeColor: 'bg-rose-600 text-white' },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'promotions', label: 'Promotions', icon: TicketPercent },
    { id: 'delivery', label: 'Delivery & Zones', icon: Truck },
    { id: 'reviews', label: 'Customer Reviews', icon: Star, badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined, badgeColor: 'bg-stone-800 text-white' },
    { id: 'analytics', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'content', label: 'Website Content', icon: Globe, requiresAdmin: true },
    { id: 'settings', label: 'Store Settings', icon: Settings, requiresAdmin: true },
    { id: 'users', label: 'Admin Users & Roles', icon: ShieldCheck, requiresOwner: true },
    { id: 'audit', label: 'Audit Logs', icon: History, requiresAdmin: true },
  ];

  const roleLabel = isOwner ? 'Store Owner' : isAdmin ? 'Administrator' : isManager ? 'Store Manager' : 'Staff';
  const roleBadgeColor = isOwner
    ? 'bg-amber-100 text-amber-900 border-amber-300'
    : isAdmin
    ? 'bg-stone-900 text-stone-100 border-stone-800'
    : 'bg-stone-200 text-stone-800 border-stone-300';

  return (
    <>
      {/* Mobile Backdrop */}
      {openState && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={handleClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-stone-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          openState ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-stone-900 text-white flex items-center justify-center">
              <Wine className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif font-bold text-xs uppercase tracking-wider text-stone-900 block leading-tight">
                Pazion Admin
              </span>
              <span className="text-[10px] text-stone-500 block leading-tight">
                Cellar Operations
              </span>
            </div>
          </div>
          <button
            onClick={onReturnToStore}
            title="View Live Customer Store"
            className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-200/50 rounded transition"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        {/* User Profile Bar */}
        <div className="p-3 border-b border-stone-100 bg-stone-50/50">
          <div className="flex items-center justify-between">
            <div className="overflow-hidden pr-2">
              <p className="text-xs font-semibold text-stone-900 truncate">
                {userProfile?.displayName || userProfile?.email || 'Staff Member'}
              </p>
              <p className="text-[10px] text-stone-500 truncate font-mono">
                {userProfile?.email}
              </p>
            </div>
            <span
              className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border shrink-0 ${roleBadgeColor}`}
            >
              {roleLabel}
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {navItems.map((item) => {
            if (item.requiresOwner && !isOwner) return null;
            if (item.requiresAdmin && !isAdmin) return null;

            const isActive = currentTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  handleClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded transition ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-stone-500'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full ml-2 ${
                      item.badgeColor
                        ? item.badgeColor
                        : isActive
                        ? 'bg-stone-800 text-stone-200'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-stone-200 space-y-1 bg-stone-50">
          <button
            onClick={onReturnToStore}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-200/50 rounded transition"
          >
            <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
            <span>Open Customer Store</span>
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-700 hover:bg-rose-50 rounded transition font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>End Staff Session</span>
          </button>
        </div>
      </aside>
    </>
  );
};
