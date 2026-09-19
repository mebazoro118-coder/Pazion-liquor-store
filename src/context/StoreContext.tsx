import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db, testFirestoreConnection } from '../lib/firebase';
import {
  Product,
  CategoryItem,
  BrandItem,
  Order,
  OrderStatus,
  InventoryHistoryItem,
  Coupon,
  DeliveryZone,
  CustomerReview,
  StoreSettings,
  AdminUserItem,
  AuditLogItem,
  AdminNotification,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_BRANDS,
  INITIAL_DELIVERY_ZONES,
  INITIAL_COUPONS,
  INITIAL_SETTINGS,
} from '../data/initialData';

interface StoreContextType {
  products: Product[];
  categories: CategoryItem[];
  brands: BrandItem[];
  orders: Order[];
  inventoryHistory: InventoryHistoryItem[];
  coupons: Coupon[];
  deliveryZones: DeliveryZone[];
  reviews: CustomerReview[];
  settings: StoreSettings;
  adminUsers: AdminUserItem[];
  auditLogs: AuditLogItem[];
  notifications: AdminNotification[];
  unreadNotificationCount: number;
  loading: boolean;

  // Product Actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>, adminEmail?: string) => Promise<string>;
  updateProduct: (id: string, product: Partial<Product>, adminEmail?: string) => Promise<void>;
  deleteProduct: (id: string, adminEmail?: string) => Promise<void>;
  duplicateProduct: (id: string, adminEmail?: string) => Promise<string>;

  // Category Actions
  addCategory: (category: Omit<CategoryItem, 'id'>, adminEmail?: string) => Promise<string>;
  updateCategory: (id: string, category: Partial<CategoryItem>, adminEmail?: string) => Promise<void>;
  deleteCategory: (id: string, adminEmail?: string) => Promise<void>;
  reorderCategories: (orderedIds: string[], adminEmail?: string) => Promise<void>;

  // Brand Actions
  addBrand: (brand: Omit<BrandItem, 'id'>, adminEmail?: string) => Promise<string>;
  updateBrand: (id: string, brand: Partial<BrandItem>, adminEmail?: string) => Promise<void>;
  deleteBrand: (id: string, adminEmail?: string) => Promise<void>;

  // Order Actions
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'trackingNumber'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string, adminEmail?: string) => Promise<void>;

  // Inventory Actions
  adjustStock: (productId: string, quantityDelta: number, reason?: string, adminEmail?: string) => Promise<void>;
  setStockQuantity: (productId: string, newQuantity: number, lowStockThreshold?: number, adminEmail?: string) => Promise<void>;

  // Coupon Actions
  addCoupon: (coupon: Omit<Coupon, 'id'>, adminEmail?: string) => Promise<string>;
  updateCoupon: (id: string, coupon: Partial<Coupon>, adminEmail?: string) => Promise<void>;
  deleteCoupon: (id: string, adminEmail?: string) => Promise<void>;

  // Delivery Zone Actions
  addDeliveryZone: (zone: Omit<DeliveryZone, 'id'>, adminEmail?: string) => Promise<string>;
  updateDeliveryZone: (id: string, zone: Partial<DeliveryZone>, adminEmail?: string) => Promise<void>;
  deleteDeliveryZone: (id: string, adminEmail?: string) => Promise<void>;

  // Review Actions
  addReview: (review: Omit<CustomerReview, 'id' | 'createdAt'>) => Promise<string>;
  updateReviewStatus: (reviewId: string, status: 'approved' | 'pending' | 'hidden', adminEmail?: string) => Promise<void>;
  approveReview: (reviewId: string, adminEmail?: string) => Promise<void>;
  deleteReview: (reviewId: string, adminEmail?: string) => Promise<void>;

  // Store Settings & Website Content Actions
  updateSettings: (newSettings: Partial<StoreSettings>, adminEmail?: string) => Promise<void>;
  storeSettings: StoreSettings;
  updateStoreSettings: (newSettings: Partial<StoreSettings>, adminEmail?: string) => Promise<void>;

  // Admin User Actions
  addAdminUser: (user: Omit<AdminUserItem, 'id' | 'createdAt'>, adminEmail?: string) => Promise<string>;
  updateAdminUser: (id: string, updates: Partial<AdminUserItem>, adminEmail?: string) => Promise<void>;
  deleteAdminUser: (id: string, adminEmail?: string) => Promise<void>;

  // Notifications & Audits
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  logAuditAction: (adminEmail: string, action: string, affectedItem: string, prevValue?: string, newValue?: string) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [brands, setBrands] = useState<BrandItem[]>(INITIAL_BRANDS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventoryHistory, setInventoryHistory] = useState<InventoryHistoryItem[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(INITIAL_DELIVERY_ZONES);
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  const [adminUsers, setAdminUsers] = useState<AdminUserItem[]>([
    {
      id: 'admin-owner-1',
      email: 'mebazoro118@gmail.com',
      name: 'Pazion Store Owner',
      role: 'owner',
      status: 'active',
      lastLogin: new Date().toISOString(),
      createdAt: '2025-01-01T00:00:00Z',
    },
    {
      id: 'admin-main-2',
      email: 'admin@pazionliquor.com',
      name: 'Senior Cellarmaster',
      role: 'admin',
      status: 'active',
      lastLogin: new Date().toISOString(),
      createdAt: '2025-01-05T00:00:00Z',
    },
  ]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize and listen to Firestore
  useEffect(() => {
    testFirestoreConnection();

    // 1. Products listener
    const unsubProducts = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Product[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...(docSnap.data() as Omit<Product, 'id'>) });
          });
          setProducts(list);
        } else {
          seedInitialDataIfEmpty();
        }
        setLoading(false);
      },
      (err) => {
        console.warn('Products fallback to offline:', err);
        setProducts(INITIAL_PRODUCTS);
        setLoading(false);
      }
    );

    // 2. Categories listener
    const unsubCategories = onSnapshot(
      collection(db, 'categories'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: CategoryItem[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...(docSnap.data() as Omit<CategoryItem, 'id'>) });
          });
          list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
          setCategories(list);
        }
      },
      (err) => console.warn('Categories fallback:', err)
    );

    // 3. Brands listener
    const unsubBrands = onSnapshot(
      collection(db, 'brands'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: BrandItem[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...(docSnap.data() as Omit<BrandItem, 'id'>) });
          });
          setBrands(list);
        }
      },
      (err) => console.warn('Brands fallback:', err)
    );

    // 4. Orders listener
    const unsubOrders = onSnapshot(
      collection(db, 'orders'),
      (snapshot) => {
        const list: Order[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as Omit<Order, 'id'>) });
        });
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(list);
      },
      (err) => console.warn('Orders fallback:', err)
    );

    // 5. Inventory history listener
    const unsubInv = onSnapshot(
      collection(db, 'inventoryHistory'),
      (snapshot) => {
        const list: InventoryHistoryItem[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as Omit<InventoryHistoryItem, 'id'>) });
        });
        list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setInventoryHistory(list);
      },
      (err) => console.warn('Inventory history fallback:', err)
    );

    // 6. Coupons listener
    const unsubCoupons = onSnapshot(
      collection(db, 'coupons'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Coupon[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...(docSnap.data() as Omit<Coupon, 'id'>) });
          });
          setCoupons(list);
        }
      },
      (err) => console.warn('Coupons fallback:', err)
    );

    // 7. Delivery zones listener
    const unsubDelivery = onSnapshot(
      collection(db, 'deliveryZones'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: DeliveryZone[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...(docSnap.data() as Omit<DeliveryZone, 'id'>) });
          });
          setDeliveryZones(list);
        }
      },
      (err) => console.warn('Delivery zones fallback:', err)
    );

    // 8. Reviews listener
    const unsubReviews = onSnapshot(
      collection(db, 'reviews'),
      (snapshot) => {
        const list: CustomerReview[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as Omit<CustomerReview, 'id'>) });
        });
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setReviews(list);
      },
      (err) => console.warn('Reviews fallback:', err)
    );

    // 9. Settings listener
    const unsubSettings = onSnapshot(
      doc(db, 'settings', 'store_config'),
      (docSnap) => {
        if (docSnap.exists()) {
          setSettings(docSnap.data() as StoreSettings);
        }
      },
      (err) => console.warn('Settings fallback:', err)
    );

    // 10. Admin users listener
    const unsubAdminUsers = onSnapshot(
      collection(db, 'adminUsers'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: AdminUserItem[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...(docSnap.data() as Omit<AdminUserItem, 'id'>) });
          });
          setAdminUsers(list);
        }
      },
      (err) => console.warn('Admin users fallback:', err)
    );

    // 11. Audit logs listener
    const unsubAudit = onSnapshot(
      collection(db, 'auditLogs'),
      (snapshot) => {
        const list: AuditLogItem[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as Omit<AuditLogItem, 'id'>) });
        });
        list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setAuditLogs(list);
      },
      (err) => console.warn('Audit logs fallback:', err)
    );

    // 12. Notifications listener
    const unsubNotifications = onSnapshot(
      collection(db, 'notifications'),
      (snapshot) => {
        const list: AdminNotification[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as Omit<AdminNotification, 'id'>) });
        });
        list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setNotifications(list);
      },
      (err) => console.warn('Notifications fallback:', err)
    );

    return () => {
      unsubProducts();
      unsubCategories();
      unsubBrands();
      unsubOrders();
      unsubInv();
      unsubCoupons();
      unsubDelivery();
      unsubReviews();
      unsubSettings();
      unsubAdminUsers();
      unsubAudit();
      unsubNotifications();
    };
  }, []);

  const seedInitialDataIfEmpty = async () => {
    try {
      const prodSnap = await getDocs(collection(db, 'products'));
      if (prodSnap.empty) {
        for (const p of INITIAL_PRODUCTS) {
          await setDoc(doc(db, 'products', p.id), p);
        }
      }
      const catSnap = await getDocs(collection(db, 'categories'));
      if (catSnap.empty) {
        for (const c of INITIAL_CATEGORIES) {
          await setDoc(doc(db, 'categories', c.id), c);
        }
      }
      const brandSnap = await getDocs(collection(db, 'brands'));
      if (brandSnap.empty) {
        for (const b of INITIAL_BRANDS) {
          await setDoc(doc(db, 'brands', b.id), b);
        }
      }
      const zoneSnap = await getDocs(collection(db, 'deliveryZones'));
      if (zoneSnap.empty) {
        for (const z of INITIAL_DELIVERY_ZONES) {
          await setDoc(doc(db, 'deliveryZones', z.id), z);
        }
      }
      const coupSnap = await getDocs(collection(db, 'coupons'));
      if (coupSnap.empty) {
        for (const cp of INITIAL_COUPONS) {
          await setDoc(doc(db, 'coupons', cp.id), cp);
        }
      }
      const setSnap = await getDocs(collection(db, 'settings'));
      if (setSnap.empty) {
        await setDoc(doc(db, 'settings', 'store_config'), INITIAL_SETTINGS);
      }
    } catch (e) {
      console.warn('Auto-seeding skipped:', e);
    }
  };

  // AUDIT LOG HELPER
  const logAuditAction = async (
    adminEmail: string,
    action: string,
    affectedItem: string,
    prevValue?: string,
    newValue?: string
  ) => {
    const id = `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const logItem: AuditLogItem = {
      id,
      adminEmail: adminEmail || 'admin@pazionliquor.com',
      action,
      affectedItem,
      previousValue: prevValue || 'N/A',
      newValue: newValue || 'N/A',
      timestamp: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'auditLogs', id), logItem);
    } catch (err) {
      console.warn('Failed to persist audit log to Firestore:', err);
      setAuditLogs((prev) => [logItem, ...prev]);
    }
  };

  // NOTIFICATION HELPER
  const createAdminNotification = async (
    type: 'order' | 'low_stock' | 'out_of_stock' | 'customer' | 'review',
    title: string,
    message: string,
    referenceId?: string
  ) => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const notifItem: AdminNotification = {
      id,
      type,
      title,
      message,
      isRead: false,
      referenceId,
      timestamp: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'notifications', id), notifItem);
    } catch (err) {
      console.warn('Failed to persist notification:', err);
      setNotifications((prev) => [notifItem, ...prev]);
    }
  };

  // ================= PRODUCTS =================
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt'>, adminEmail = 'admin@pazionliquor.com') => {
    const id = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'products', id), newProduct);
    await logAuditAction(adminEmail, 'Product Added', `${newProduct.name} (${newProduct.sku || id})`, 'None', `$${newProduct.price}`);
    return id;
  };

  const updateProduct = async (id: string, updates: Partial<Product>, adminEmail = 'admin@pazionliquor.com') => {
    const existing = products.find((p) => p.id === id);
    const dataToSave = { ...updates, updatedAt: new Date().toISOString() };
    await updateDoc(doc(db, 'products', id), dataToSave);
    await logAuditAction(
      adminEmail,
      'Product Updated',
      `${existing?.name || id}`,
      `Price: $${existing?.price}, Stock: ${existing?.stock}`,
      `Price: $${updates.price ?? existing?.price}, Stock: ${updates.stock ?? existing?.stock}`
    );
  };

  const deleteProduct = async (id: string, adminEmail = 'admin@pazionliquor.com') => {
    const existing = products.find((p) => p.id === id);
    await deleteDoc(doc(db, 'products', id));
    await logAuditAction(adminEmail, 'Product Deleted', `${existing?.name || id}`, `Active: ${existing?.isActive}`, 'DELETED');
  };

  const duplicateProduct = async (id: string, adminEmail = 'admin@pazionliquor.com') => {
    const source = products.find((p) => p.id === id);
    if (!source) throw new Error('Product not found');
    const newId = `prod-${Date.now()}`;
    const duplicated: Product = {
      ...source,
      id: newId,
      name: `${source.name} (Copy)`,
      sku: source.sku ? `${source.sku}-COPY` : `SKU-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'products', newId), duplicated);
    await logAuditAction(adminEmail, 'Product Duplicated', `From ${source.name} -> ${duplicated.name}`, source.id, newId);
    return newId;
  };

  // ================= INVENTORY =================
  const adjustStock = async (productId: string, quantityDelta: number, reason = 'Stock adjustment', adminEmail = 'admin@pazionliquor.com') => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) throw new Error('Product not found');
    const prevStock = prod.stock;
    const newStock = Math.max(0, prevStock + quantityDelta);

    await updateDoc(doc(db, 'products', productId), { stock: newStock, updatedAt: new Date().toISOString() });

    // Record inventory history
    const historyId = `inv-${Date.now()}`;
    const histItem: InventoryHistoryItem = {
      id: historyId,
      productId,
      productName: prod.name,
      sku: prod.sku || productId,
      previousQuantity: prevStock,
      newQuantity: newStock,
      changeDelta: quantityDelta,
      reason,
      adminEmail,
      timestamp: new Date().toISOString(),
    };
    await setDoc(doc(db, 'inventoryHistory', historyId), histItem);
    await logAuditAction(adminEmail, 'Stock Adjusted', `${prod.name}`, `Stock: ${prevStock}`, `Stock: ${newStock} (${reason})`);

    // Check low stock alert
    const threshold = prod.lowStockThreshold ?? 5;
    if (newStock === 0) {
      await createAdminNotification('out_of_stock', 'Out of Stock Alert', `${prod.name} is now completely out of stock.`, productId);
    } else if (newStock <= threshold) {
      await createAdminNotification('low_stock', 'Low Stock Warning', `${prod.name} has only ${newStock} units left (threshold: ${threshold}).`, productId);
    }
  };

  const setStockQuantity = async (productId: string, newQuantity: number, lowStockThreshold?: number, adminEmail = 'admin@pazionliquor.com') => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) throw new Error('Product not found');
    const prev = prod.stock;
    const updates: Partial<Product> = { stock: Math.max(0, newQuantity), updatedAt: new Date().toISOString() };
    if (lowStockThreshold !== undefined) {
      updates.lowStockThreshold = lowStockThreshold;
    }
    await updateDoc(doc(db, 'products', productId), updates);

    const historyId = `inv-${Date.now()}`;
    const histItem: InventoryHistoryItem = {
      id: historyId,
      productId,
      productName: prod.name,
      sku: prod.sku || productId,
      previousQuantity: prev,
      newQuantity,
      changeDelta: newQuantity - prev,
      reason: 'Manual Stock Count Adjustment',
      adminEmail,
      timestamp: new Date().toISOString(),
    };
    await setDoc(doc(db, 'inventoryHistory', historyId), histItem);
    await logAuditAction(adminEmail, 'Stock Set', `${prod.name}`, `${prev}`, `${newQuantity}`);
  };

  // ================= CATEGORIES =================
  const addCategory = async (catData: Omit<CategoryItem, 'id'>, adminEmail = 'admin@pazionliquor.com') => {
    const id = `cat-${Date.now()}`;
    const newCat: CategoryItem = { ...catData, id, isActive: true };
    await setDoc(doc(db, 'categories', id), newCat);
    await logAuditAction(adminEmail, 'Category Created', newCat.name, 'None', newCat.slug);
    return id;
  };

  const updateCategory = async (id: string, updates: Partial<CategoryItem>, adminEmail = 'admin@pazionliquor.com') => {
    const existing = categories.find((c) => c.id === id);
    await updateDoc(doc(db, 'categories', id), updates);
    await logAuditAction(adminEmail, 'Category Updated', existing?.name || id, 'Updated fields', JSON.stringify(updates));
  };

  const deleteCategory = async (id: string, adminEmail = 'admin@pazionliquor.com') => {
    const existing = categories.find((c) => c.id === id);
    await deleteDoc(doc(db, 'categories', id));
    await logAuditAction(adminEmail, 'Category Deleted', existing?.name || id, 'Active', 'DELETED');
  };

  const reorderCategories = async (orderedIds: string[], adminEmail = 'admin@pazionliquor.com') => {
    for (let index = 0; index < orderedIds.length; index++) {
      const id = orderedIds[index];
      await updateDoc(doc(db, 'categories', id), { displayOrder: index + 1 });
    }
    await logAuditAction(adminEmail, 'Categories Reordered', 'Taxonomy order', 'Previous order', orderedIds.join(', '));
  };

  // ================= BRANDS =================
  const addBrand = async (brandData: Omit<BrandItem, 'id'>, adminEmail = 'admin@pazionliquor.com') => {
    const id = `brand-${Date.now()}`;
    const newBrand: BrandItem = { ...brandData, id };
    await setDoc(doc(db, 'brands', id), newBrand);
    await logAuditAction(adminEmail, 'Brand Created', newBrand.name, 'None', newBrand.country || 'N/A');
    return id;
  };

  const updateBrand = async (id: string, updates: Partial<BrandItem>, adminEmail = 'admin@pazionliquor.com') => {
    const existing = brands.find((b) => b.id === id);
    await updateDoc(doc(db, 'brands', id), updates);
    await logAuditAction(adminEmail, 'Brand Updated', existing?.name || id, 'Previous', JSON.stringify(updates));
  };

  const deleteBrand = async (id: string, adminEmail = 'admin@pazionliquor.com') => {
    const existing = brands.find((b) => b.id === id);
    await deleteDoc(doc(db, 'brands', id));
    await logAuditAction(adminEmail, 'Brand Deleted', existing?.name || id, 'Active', 'DELETED');
  };

  // ================= ORDERS =================
  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'trackingNumber'>): Promise<Order> => {
    const id = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const trackingNumber = `PZN-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id,
      trackingNumber,
      timeline: [
        {
          status: 'order_received',
          label: 'Order Consignment Placed',
          timestamp: now,
          note: 'Consignment authenticated and registered in warehouse queue.',
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(doc(db, 'orders', id), newOrder);

    // Deduct stock for items
    for (const item of newOrder.items) {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        const newStock = Math.max(0, prod.stock - item.quantity);
        await updateDoc(doc(db, 'products', prod.id), { stock: newStock });
      }
    }

    // Trigger admin alert notification
    await createAdminNotification(
      'order',
      'New Order Received',
      `Order ${id} placed by ${newOrder.customerName} for $${newOrder.total.toFixed(2)}.`,
      id
    );

    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus, note?: string, adminEmail = 'admin@pazionliquor.com') => {
    const ord = orders.find((o) => o.id === orderId);
    if (!ord) throw new Error('Order not found');

    const statusLabels: Record<OrderStatus, string> = {
      order_received: 'Order Received',
      order_confirmed: 'Confirmed & Payment Authorized',
      preparing: 'Cellarmaster Bottle Allocation & Packaging',
      ready_for_pickup: 'Ready for Flagship Concierge Handover',
      out_for_delivery: 'Climate Courier Out For Handover',
      delivered: 'Delivered & Government ID Verified',
      cancelled: 'Consignment Cancelled',
    };

    const newEntry = {
      status: newStatus,
      label: statusLabels[newStatus] || newStatus,
      timestamp: new Date().toISOString(),
      note: note || `Status updated to ${statusLabels[newStatus]} by staff.`,
    };

    const updatedTimeline = [...(ord.timeline || []), newEntry];

    await updateDoc(doc(db, 'orders', orderId), {
      orderStatus: newStatus,
      timeline: updatedTimeline,
      updatedAt: new Date().toISOString(),
    });

    await logAuditAction(adminEmail, 'Order Status Updated', `Order ${orderId}`, ord.orderStatus, newStatus);
  };

  // ================= COUPONS =================
  const addCoupon = async (couponData: Omit<Coupon, 'id'>, adminEmail = 'admin@pazionliquor.com') => {
    const id = `coup-${Date.now()}`;
    const newCoupon: Coupon = { ...couponData, id, usedCount: 0 };
    await setDoc(doc(db, 'coupons', id), newCoupon);
    await logAuditAction(adminEmail, 'Coupon Created', newCoupon.code, 'None', `${newCoupon.discountAmount} (${newCoupon.discountType})`);
    return id;
  };

  const updateCoupon = async (id: string, updates: Partial<Coupon>, adminEmail = 'admin@pazionliquor.com') => {
    const existing = coupons.find((c) => c.id === id);
    await updateDoc(doc(db, 'coupons', id), updates);
    await logAuditAction(adminEmail, 'Coupon Updated', existing?.code || id, 'Previous', JSON.stringify(updates));
  };

  const deleteCoupon = async (id: string, adminEmail = 'admin@pazionliquor.com') => {
    const existing = coupons.find((c) => c.id === id);
    await deleteDoc(doc(db, 'coupons', id));
    await logAuditAction(adminEmail, 'Coupon Deleted', existing?.code || id, 'Active', 'DELETED');
  };

  // ================= DELIVERY ZONES =================
  const addDeliveryZone = async (zoneData: Omit<DeliveryZone, 'id'>, adminEmail = 'admin@pazionliquor.com') => {
    const id = `zone-${Date.now()}`;
    const newZone: DeliveryZone = { ...zoneData, id };
    await setDoc(doc(db, 'deliveryZones', id), newZone);
    await logAuditAction(adminEmail, 'Delivery Zone Created', newZone.name, 'None', `$${newZone.fee}`);
    return id;
  };

  const updateDeliveryZone = async (id: string, updates: Partial<DeliveryZone>, adminEmail = 'admin@pazionliquor.com') => {
    const existing = deliveryZones.find((z) => z.id === id);
    await updateDoc(doc(db, 'deliveryZones', id), updates);
    await logAuditAction(adminEmail, 'Delivery Zone Updated', existing?.name || id, 'Previous', JSON.stringify(updates));
  };

  const deleteDeliveryZone = async (id: string, adminEmail = 'admin@pazionliquor.com') => {
    const existing = deliveryZones.find((z) => z.id === id);
    await deleteDoc(doc(db, 'deliveryZones', id));
    await logAuditAction(adminEmail, 'Delivery Zone Deleted', existing?.name || id, 'Active', 'DELETED');
  };

  // ================= REVIEWS =================
  const addReview = async (reviewData: Omit<CustomerReview, 'id' | 'createdAt'>) => {
    const id = `rev-${Date.now()}`;
    const newReview: CustomerReview = {
      ...reviewData,
      id,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'reviews', id), newReview);
    await createAdminNotification('review', 'New Product Review', `${newReview.userName} rated a product ${newReview.rating}/5 stars.`, id);
    return id;
  };

  const updateReviewStatus = async (reviewId: string, status: 'approved' | 'pending' | 'hidden', adminEmail = 'admin@pazionliquor.com') => {
    const existing = reviews.find((r) => r.id === reviewId);
    await updateDoc(doc(db, 'reviews', reviewId), { status });
    await logAuditAction(adminEmail, 'Review Status Updated', `Review ${reviewId}`, existing?.status || 'pending', status);
  };

  const approveReview = async (reviewId: string, adminEmail = 'admin@pazionliquor.com') => {
    await updateReviewStatus(reviewId, 'approved', adminEmail);
  };

  const deleteReview = async (reviewId: string, adminEmail = 'admin@pazionliquor.com') => {
    await deleteDoc(doc(db, 'reviews', reviewId));
    await logAuditAction(adminEmail, 'Review Deleted', `Review ${reviewId}`, 'Existing', 'DELETED');
  };

  // ================= STORE SETTINGS & WEBSITE CONTENT =================
  const updateSettings = async (newSettings: Partial<StoreSettings>, adminEmail = 'admin@pazionliquor.com') => {
    const merged = { ...settings, ...newSettings, updatedAt: new Date().toISOString() };
    await setDoc(doc(db, 'settings', 'store_config'), merged, { merge: true });
    setSettings(merged);
    await logAuditAction(adminEmail, 'Settings & Content Modified', 'Global Store Configuration', 'Previous', 'Updated website values');
  };

  // ================= ADMIN USERS =================
  const addAdminUser = async (userData: Omit<AdminUserItem, 'id' | 'createdAt'>, adminEmail = 'admin@pazionliquor.com') => {
    const id = `admin-${Date.now()}`;
    const newAdmin: AdminUserItem = {
      ...userData,
      id,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'adminUsers', id), newAdmin);
    await logAuditAction(adminEmail, 'Admin User Added', `${newAdmin.email} (${newAdmin.role})`, 'None', newAdmin.status);
    return id;
  };

  const updateAdminUser = async (id: string, updates: Partial<AdminUserItem>, adminEmail = 'admin@pazionliquor.com') => {
    const existing = adminUsers.find((u) => u.id === id);
    await updateDoc(doc(db, 'adminUsers', id), updates);
    await logAuditAction(adminEmail, 'Admin User Updated', existing?.email || id, existing?.role || 'N/A', updates.role || 'Updated');
  };

  const deleteAdminUser = async (id: string, adminEmail = 'admin@pazionliquor.com') => {
    const existing = adminUsers.find((u) => u.id === id);
    await deleteDoc(doc(db, 'adminUsers', id));
    await logAuditAction(adminEmail, 'Admin User Removed', existing?.email || id, existing?.role || 'N/A', 'DELETED');
  };

  // ================= NOTIFICATIONS =================
  const markNotificationAsRead = async (id: string) => {
    await updateDoc(doc(db, 'notifications', id), { isRead: true });
  };

  const markAllNotificationsAsRead = async () => {
    for (const n of notifications.filter((item) => !item.isRead)) {
      await updateDoc(doc(db, 'notifications', n.id), { isRead: true });
    }
  };

  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        brands,
        orders,
        inventoryHistory,
        coupons,
        deliveryZones,
        reviews,
        settings,
        adminUsers,
        auditLogs,
        notifications,
        unreadNotificationCount,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        addBrand,
        updateBrand,
        deleteBrand,
        createOrder,
        updateOrderStatus,
        adjustStock,
        setStockQuantity,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        addDeliveryZone,
        updateDeliveryZone,
        deleteDeliveryZone,
        addReview,
        updateReviewStatus,
        approveReview,
        deleteReview,
        updateSettings,
        storeSettings: settings,
        updateStoreSettings: updateSettings,
        addAdminUser,
        updateAdminUser,
        deleteAdminUser,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        logAuditAction,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within a StoreProvider');
  return ctx;
};
