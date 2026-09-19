export type UserRole = 'customer' | 'admin' | 'manager' | 'owner';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  birthDate?: string;
  isAgeVerified?: boolean;
  savedAddresses?: SavedAddress[];
  totalOrders?: number;
  totalSpent?: number;
  accountStatus?: 'active' | 'suspended' | 'vip';
  createdAt: string;
  updatedAt?: string;
}

export interface SavedAddress {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export type BeverageCategory =
  | 'Whisky'
  | 'Vodka'
  | 'Gin'
  | 'Rum'
  | 'Tequila'
  | 'Wine'
  | 'Champagne'
  | 'Beer'
  | 'Liqueurs'
  | 'Non-alcoholic';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: BeverageCategory | string;
  volume: string; // e.g., "750ml", "1L"
  sku?: string;
  alcoholPercentage?: number; // e.g., 43.0%
  price: number;
  discountPrice?: number;
  stock: number;
  lowStockThreshold?: number;
  description: string;
  tastingNotes?: string;
  origin?: string;
  imageUrl: string;
  gallery?: string[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CategoryItem {
  id: string;
  name: BeverageCategory | string;
  slug: string;
  description: string;
  imageUrl: string;
  displayOrder: number;
  isActive?: boolean;
}

export interface BrandItem {
  id: string;
  name: string;
  country?: string;
  description?: string;
  logoUrl?: string;
  isActive: boolean;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  imageUrl: string;
  volume: string;
}

export type OrderStatus =
  | 'order_received'
  | 'order_confirmed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderTimelineEntry {
  status: OrderStatus;
  label: string;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  userId?: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discountTotal: number;
  total: number;
  couponCode?: string;
  deliveryMethod: 'delivery' | 'pickup';
  shippingAddress?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
    deliveryInstructions?: string;
  };
  customerNotes?: string;
  ageVerifiedAtCheckout: boolean;
  birthDateConfirmed?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'apple_pay' | 'google_pay' | 'cash_on_delivery';
  orderStatus: OrderStatus;
  estimatedDelivery?: string;
  trackingNumber: string;
  timeline?: OrderTimelineEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface InventoryHistoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  previousQuantity: number;
  newQuantity: number;
  changeDelta: number;
  reason: string;
  adminEmail: string;
  timestamp: string;
}

export interface CustomerReview {
  id: string;
  productId: string;
  productName?: string;
  userId: string;
  userName: string;
  customerName?: string;
  rating: number;
  title: string;
  comment: string;
  status: 'approved' | 'pending' | 'hidden';
  isApproved?: boolean;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountAmount: number;
  discountValue?: number;
  discountPercent?: number;
  startDate?: string;
  endDate?: string;
  expirationDate?: string;
  usageLimit?: number;
  usedCount?: number;
  minOrderAmount?: number;
  minimumSpend?: number;
  applicableCategory?: string;
  applicableProductId?: string;
  description?: string;
  isActive: boolean;
}

export interface DeliveryZone {
  id: string;
  name: string;
  description?: string;
  fee: number;
  minOrder: number;
  minimumOrderForFreeDelivery?: number;
  estimatedTime: string;
  isActive: boolean;
  allowPickup: boolean;
}

export interface StoreSettings {
  id: string;
  storeName: string;
  storeDescription?: string;
  email?: string;
  contactEmail?: string;
  phone?: string;
  contactPhone?: string;
  address?: string;
  openingHours?: string;
  currency?: string;
  taxRate?: number;
  deliveryFee?: number;
  freeShippingThreshold?: number;
  freeDeliveryThreshold?: number;
  minAge?: number;
  ageVerificationMinimum?: number;
  heroHeadline?: string;
  heroSubheadline?: string;
  heroBadge?: string;
  heroImageUrl?: string;
  heroCtaText?: string;
  announcementBar?: string;
  isAnnouncementActive?: boolean;
  announcementBanner?: string;
  showAnnouncementBanner?: boolean;
  instagramUrl?: string;
  twitterUrl?: string;
  facebookUrl?: string;
  updatedAt?: string;
}

export type AdminRole = 'owner' | 'admin' | 'manager';

export interface AdminUserItem {
  id: string;
  email: string;
  name?: string;
  displayName?: string;
  role: AdminRole;
  status?: 'active' | 'disabled';
  isActive?: boolean;
  lastLogin?: string;
  createdAt: string;
}

export type AdminUser = AdminUserItem;

export interface AuditLogItem {
  id: string;
  adminEmail: string;
  action: string;
  affectedItem?: string;
  details?: string;
  previousValue?: string;
  newValue?: string;
  timestamp: string;
}

export type AuditLog = AuditLogItem;

export interface AdminNotification {
  id: string;
  type: 'order' | 'low_stock' | 'out_of_stock' | 'customer' | 'review';
  title: string;
  message: string;
  isRead: boolean;
  referenceId?: string;
  timestamp: string;
}
