import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { AdminLogin } from '../components/admin/AdminLogin';
import { AdminSidebar, AdminTab } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';

// Sub-page modular tabs
import { AdminOverviewTab } from '../components/admin/AdminOverviewTab';
import { AdminProductsTab } from '../components/admin/AdminProductsTab';
import { AdminCategoriesTab } from '../components/admin/AdminCategoriesTab';
import { AdminBrandsTab } from '../components/admin/AdminBrandsTab';
import { AdminOrdersTab } from '../components/admin/AdminOrdersTab';
import { AdminInventoryTab } from '../components/admin/AdminInventoryTab';
import { AdminCustomersTab } from '../components/admin/AdminCustomersTab';
import { AdminPromotionsTab } from '../components/admin/AdminPromotionsTab';
import { AdminDeliveryTab } from '../components/admin/AdminDeliveryTab';
import { AdminReviewsTab } from '../components/admin/AdminReviewsTab';
import { AdminAnalyticsTab } from '../components/admin/AdminAnalyticsTab';
import { AdminContentTab } from '../components/admin/AdminContentTab';
import { AdminSettingsTab } from '../components/admin/AdminSettingsTab';
import { AdminUsersTab } from '../components/admin/AdminUsersTab';
import { AdminAuditTab } from '../components/admin/AdminAuditTab';
import { Order } from '../types';

interface AdminDashboardProps {
  onNavigate: (view: string, param?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { currentUser, userProfile, isAdmin, isManager, isOwner } = useAuth();
  const [currentTab, setCurrentTab] = useState<AdminTab>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedOrderForInspection, setSelectedOrderForInspection] = useState<Order | null>(null);

  // Check if current user is an authenticated staff member
  const isAuthorized = Boolean((currentUser || userProfile) && (isAdmin || isManager || isOwner));

  // If not authenticated or not an authorized role, show the dedicated Admin Login portal
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-stone-100 flex flex-col justify-center">
        <AdminLogin onReturnToStore={() => onNavigate('home')} />
      </div>
    );
  }

  const handleSelectOrder = (order: Order) => {
    setSelectedOrderForInspection(order);
    setCurrentTab('orders');
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex font-sans antialiased">
      {/* Sidebar Navigation */}
      <AdminSidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onReturnToStore={() => onNavigate('home')}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Administrative Workplace */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Persistent Admin Header Bar */}
        <AdminHeader
          currentTab={currentTab}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onReturnToStore={() => onNavigate('home')}
          onNavigateTab={(tab) => setCurrentTab(tab)}
        />

        {/* Tab Workspace Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'overview' && (
            <AdminOverviewTab
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onSelectOrder={handleSelectOrder}
            />
          )}

          {currentTab === 'products' && <AdminProductsTab />}

          {currentTab === 'categories' && <AdminCategoriesTab />}

          {currentTab === 'brands' && <AdminBrandsTab />}

          {currentTab === 'orders' && (
            <AdminOrdersTab
              selectedOrderProp={selectedOrderForInspection}
              onClearSelectedOrder={() => setSelectedOrderForInspection(null)}
            />
          )}

          {currentTab === 'inventory' && <AdminInventoryTab />}

          {currentTab === 'customers' && <AdminCustomersTab />}

          {currentTab === 'promotions' && <AdminPromotionsTab />}

          {currentTab === 'delivery' && <AdminDeliveryTab />}

          {currentTab === 'reviews' && <AdminReviewsTab />}

          {currentTab === 'analytics' && <AdminAnalyticsTab />}

          {currentTab === 'content' && <AdminContentTab />}

          {currentTab === 'settings' && <AdminSettingsTab />}

          {currentTab === 'users' && <AdminUsersTab />}

          {currentTab === 'audit' && <AdminAuditTab />}
        </main>
      </div>
    </div>
  );
};
