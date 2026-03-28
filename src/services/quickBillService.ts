import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { QuickEntry, QuickEntryFormData } from '../types/quickBill';

const SALES_COLLECTION = 'quickSales';
const PURCHASES_COLLECTION = 'quickPurchases';

const mapDoc = (d: any): QuickEntry => {
  const data = d.data();
  return {
    id: d.id,
    ...data,
    date: (data.date as Timestamp)?.toDate?.() || new Date(data.date),
  } as QuickEntry;
};

export const subscribeToQuickSales = (
  callback: (entries: QuickEntry[]) => void,
  onError?: (error: any) => void
) => {
  const q = query(collection(db, SALES_COLLECTION), orderBy('date', 'desc'));
  return onSnapshot(q, snapshot => {
    callback(snapshot.docs.map(mapDoc));
  }, error => {
    console.error("Quick Sales listener error:", error);
    onError?.(error);
  });
};

export const subscribeToQuickPurchases = (
  callback: (entries: QuickEntry[]) => void,
  onError?: (error: any) => void
) => {
  const q = query(collection(db, PURCHASES_COLLECTION), orderBy('date', 'desc'));
  return onSnapshot(q, snapshot => {
    callback(snapshot.docs.map(mapDoc));
  }, error => {
    console.error("Quick Purchases listener error:", error);
    onError?.(error);
  });
};

export const addQuickSale = async (data: QuickEntryFormData): Promise<string> => {
  const total = data.quantity * data.price;
  const docRef = await addDoc(collection(db, SALES_COLLECTION), {
    ...data,
    total,
    date: Timestamp.fromDate(new Date(data.date)),
  });
  return docRef.id;
};

export const addQuickPurchase = async (data: QuickEntryFormData): Promise<string> => {
  const total = data.quantity * data.price;
  const docRef = await addDoc(collection(db, PURCHASES_COLLECTION), {
    ...data,
    total,
    date: Timestamp.fromDate(new Date(data.date)),
  });
  return docRef.id;
};

export const deleteQuickSale = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, SALES_COLLECTION, id));
};

export const deleteQuickPurchase = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, PURCHASES_COLLECTION, id));
};

export const clearAllQuickSales = async (): Promise<void> => {
  const snapshot = await getDocs(collection(db, SALES_COLLECTION));
  const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, SALES_COLLECTION, d.id)));
  await Promise.all(deletePromises);
};

export const clearAllQuickPurchases = async (): Promise<void> => {
  const snapshot = await getDocs(collection(db, PURCHASES_COLLECTION));
  const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, PURCHASES_COLLECTION, d.id)));
  await Promise.all(deletePromises);
};

export const getQuickSales = async (): Promise<QuickEntry[]> => {
  const q = query(collection(db, SALES_COLLECTION), orderBy('date', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(mapDoc);
};

export const getQuickPurchases = async (): Promise<QuickEntry[]> => {
  const q = query(collection(db, PURCHASES_COLLECTION), orderBy('date', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(mapDoc);
};
