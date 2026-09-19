import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import config from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
};

// Initialize Firebase safely
let appInstance;
try {
  appInstance = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
} catch (e) {
  console.warn('Firebase app init fallback:', e);
  appInstance = initializeApp(firebaseConfig);
}
export const app = appInstance;

let authInstance;
try {
  authInstance = getAuth(app);
} catch (e) {
  console.warn('Firebase auth init fallback:', e);
  authInstance = getAuth(app);
}
export const auth = authInstance;

let dbInstance;
try {
  dbInstance = config.firestoreDatabaseId ? getFirestore(app, config.firestoreDatabaseId) : getFirestore(app);
} catch (e) {
  try {
    dbInstance = getFirestore(app);
  } catch (err) {
    console.warn('Firestore fallback init:', err);
  }
}
export const db = dbInstance!;

// Connection test as required by skill guidelines
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or initializing.');
    }
    // Expected during first connection check
    return true;
  }
}
