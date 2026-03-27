import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Product, ProductFormData } from '../types/product';

const COLLECTION = 'products';

export const getProducts = async (): Promise<Product[]> => {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({
    id: d.id,
    ...d.data(),
    createdAt: (d.data().createdAt as Timestamp)?.toDate?.() || new Date(),
  })) as Product[];
};

export const subscribeToProducts = (callback: (products: Product[]) => void) => {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
  return onSnapshot(q, snapshot => {
    const products = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
      createdAt: (d.data().createdAt as Timestamp)?.toDate?.() || new Date(),
    })) as Product[];
    callback(products);
  });
};

export const addProduct = async (data: ProductFormData): Promise<string> => {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateProduct = async (id: string, data: Partial<ProductFormData>): Promise<void> => {
  await updateDoc(doc(db, COLLECTION, id), data);
};

export const deleteProduct = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTION, id));
};

export const updateStock = async (id: string, stock: number): Promise<void> => {
  await updateDoc(doc(db, COLLECTION, id), { stock });
};
