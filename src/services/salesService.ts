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
import type { Sale, SaleFormData } from '../types/sales';

const COLLECTION = 'sales';

export const getSales = async (): Promise<Sale[]> => {
  const q = query(collection(db, COLLECTION), orderBy('date', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      date: (data.date as Timestamp)?.toDate?.() || new Date(data.date),
    };
  }) as Sale[];
};

export const subscribeToSales = (callback: (sales: Sale[]) => void) => {
  const q = query(collection(db, COLLECTION), orderBy('date', 'desc'));
  return onSnapshot(q, snapshot => {
    const sales = snapshot.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        date: (data.date as Timestamp)?.toDate?.() || new Date(data.date),
      };
    }) as Sale[];
    callback(sales);
  });
};

export const addSale = async (data: SaleFormData): Promise<string> => {
  const total = data.quantity * data.sellingPrice;
  const docRef = await addDoc(collection(db, COLLECTION), {
    productId: data.productId,
    quantity: data.quantity,
    sellingPrice: data.sellingPrice,
    total,
    date: Timestamp.fromDate(new Date(data.date)),
  });
  return docRef.id;
};

export const deleteSale = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTION, id));
};

export const clearAllSales = async (): Promise<void> => {
  const snapshot = await getDocs(collection(db, COLLECTION));
  const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, COLLECTION, d.id)));
  await Promise.all(deletePromises);
};
