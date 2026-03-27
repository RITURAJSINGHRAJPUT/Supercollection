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
import type { Purchase, PurchaseFormData } from '../types/purchase';

const COLLECTION = 'purchases';

export const getPurchases = async (): Promise<Purchase[]> => {
  const q = query(collection(db, COLLECTION), orderBy('date', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      date: (data.date as Timestamp)?.toDate?.() || new Date(data.date),
    };
  }) as Purchase[];
};

export const subscribeToPurchases = (callback: (purchases: Purchase[]) => void) => {
  const q = query(collection(db, COLLECTION), orderBy('date', 'desc'));
  return onSnapshot(q, snapshot => {
    const purchases = snapshot.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        date: (data.date as Timestamp)?.toDate?.() || new Date(data.date),
      };
    }) as Purchase[];
    callback(purchases);
  });
};

export const addPurchase = async (data: PurchaseFormData): Promise<string> => {
  const total = data.quantity * data.costPrice;
  const docRef = await addDoc(collection(db, COLLECTION), {
    productId: data.productId,
    quantity: data.quantity,
    costPrice: data.costPrice,
    total,
    date: Timestamp.fromDate(new Date(data.date)),
  });
  return docRef.id;
};

export const deletePurchase = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTION, id));
};

export const clearAllPurchases = async (): Promise<void> => {
  const snapshot = await getDocs(collection(db, COLLECTION));
  const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, COLLECTION, d.id)));
  await Promise.all(deletePromises);
};
