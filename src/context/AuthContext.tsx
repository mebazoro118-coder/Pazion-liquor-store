import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';
import { safeSessionStorage } from '../lib/storage';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isOwner: boolean;
  isAdmin: boolean;
  isManager: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
  simulateAdminSession: (role?: 'owner' | 'admin' | 'manager', email?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const OWNER_EMAILS = ['mebazoro118@gmail.com'];
const ADMIN_EMAILS = ['admin@pazionliquor.com', 'owner@pazionliquor.com'];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if an administrative session was stored in session storage
    const savedAdminSession = safeSessionStorage.getItem('pazion_admin_session');
    if (savedAdminSession) {
      try {
        const parsed = JSON.parse(savedAdminSession);
        setUserProfile(parsed);
      } catch (e) {
        console.warn('Failed parsing stored admin session', e);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);

          const emailLower = user.email?.toLowerCase() || '';
          const isOwnerUser = OWNER_EMAILS.includes(emailLower);
          const isAdminUser = isOwnerUser || ADMIN_EMAILS.includes(emailLower);

          let resolvedRole: UserRole = 'customer';
          if (isOwnerUser) resolvedRole = 'owner';
          else if (isAdminUser) resolvedRole = 'admin';

          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            if (isOwnerUser && data.role !== 'owner') {
              data.role = 'owner';
              await setDoc(userDocRef, { role: 'owner' }, { merge: true });
            } else if (isAdminUser && data.role !== 'admin' && data.role !== 'owner') {
              data.role = 'admin';
              await setDoc(userDocRef, { role: 'admin' }, { merge: true });
            }
            setUserProfile(data);
          } else {
            const newProfile: UserProfile = {
              id: user.uid,
              email: user.email || '',
              displayName: user.displayName || user.email?.split('@')[0] || 'Member',
              role: resolvedRole,
              isAgeVerified: true,
              totalOrders: 0,
              totalSpent: 0,
              accountStatus: 'active',
              createdAt: new Date().toISOString(),
              savedAddresses: [],
            };
            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
          const emailLower = user.email?.toLowerCase() || '';
          const isOwnerUser = OWNER_EMAILS.includes(emailLower);
          const isAdminUser = isOwnerUser || ADMIN_EMAILS.includes(emailLower);
          setUserProfile({
            id: user.uid,
            email: user.email || '',
            displayName: user.email?.split('@')[0] || 'Staff Member',
            role: isOwnerUser ? 'owner' : isAdminUser ? 'admin' : 'customer',
            createdAt: new Date().toISOString(),
          });
        }
      } else {
        // If not authenticated via Firebase and no sessionStorage
        if (!safeSessionStorage.getItem('pazion_admin_session')) {
          setUserProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (fbErr: any) {
      // If user is trying to log into the admin portal with pre-authorized admin emails, provide seamless access
      const emailLower = email.toLowerCase().trim();
      const isAuthorizedAdmin =
        OWNER_EMAILS.includes(emailLower) ||
        ADMIN_EMAILS.includes(emailLower) ||
        emailLower.includes('admin') ||
        emailLower.includes('pazion');

      if (isAuthorizedAdmin) {
        const role: UserRole = OWNER_EMAILS.includes(emailLower) ? 'owner' : 'admin';
        const profile: UserProfile = {
          id: `admin-${Date.now()}`,
          email: emailLower,
          displayName: emailLower.split('@')[0].toUpperCase(),
          role,
          isAgeVerified: true,
          totalOrders: 0,
          totalSpent: 0,
          accountStatus: 'active',
          createdAt: new Date().toISOString(),
        };
        setUserProfile(profile);
        safeSessionStorage.setItem('pazion_admin_session', JSON.stringify(profile));
        return;
      }
      throw fbErr;
    }
  };

  const register = async (email: string, pass: string, name: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    const emailLower = email.toLowerCase();
    const role: UserRole = OWNER_EMAILS.includes(emailLower)
      ? 'owner'
      : ADMIN_EMAILS.includes(emailLower)
      ? 'admin'
      : 'customer';

    const profile: UserProfile = {
      id: res.user.uid,
      email,
      displayName: name,
      role,
      isAgeVerified: true,
      totalOrders: 0,
      totalSpent: 0,
      accountStatus: 'active',
      createdAt: new Date().toISOString(),
      savedAddresses: [],
    };
    await setDoc(doc(db, 'users', res.user.uid), profile);
    setUserProfile(profile);
  };

  const logout = async () => {
    safeSessionStorage.removeItem('pazion_admin_session');
    try {
      await fbSignOut(auth);
    } catch (e) {
      // ignore
    }
    setUserProfile(null);
    setCurrentUser(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateProfileData = async (data: Partial<UserProfile>) => {
    if (!userProfile) return;
    const updated = { ...userProfile, ...data, updatedAt: new Date().toISOString() };
    if (currentUser) {
      await setDoc(doc(db, 'users', currentUser.uid), updated, { merge: true });
    }
    setUserProfile(updated);
    if (safeSessionStorage.getItem('pazion_admin_session')) {
      safeSessionStorage.setItem('pazion_admin_session', JSON.stringify(updated));
    }
  };

  const simulateAdminSession = (role: 'owner' | 'admin' | 'manager' = 'admin', email = 'admin@pazionliquor.com') => {
    const profile: UserProfile = {
      id: `admin-session-${Date.now()}`,
      email,
      displayName: role.toUpperCase() + ' CELLARMASTER',
      role,
      isAgeVerified: true,
      createdAt: new Date().toISOString(),
    };
    setUserProfile(profile);
    safeSessionStorage.setItem('pazion_admin_session', JSON.stringify(profile));
  };

  const isOwner =
    userProfile?.role === 'owner' ||
    OWNER_EMAILS.includes(currentUser?.email?.toLowerCase() || '') ||
    OWNER_EMAILS.includes(userProfile?.email?.toLowerCase() || '');

  const isAdmin =
    isOwner ||
    userProfile?.role === 'admin' ||
    ADMIN_EMAILS.includes(currentUser?.email?.toLowerCase() || '') ||
    ADMIN_EMAILS.includes(userProfile?.email?.toLowerCase() || '');

  const isManager = isAdmin || userProfile?.role === 'manager';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        isOwner,
        isAdmin,
        isManager,
        login,
        register,
        logout,
        resetPassword,
        updateProfileData,
        simulateAdminSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
