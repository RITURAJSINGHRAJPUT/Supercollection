import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Category, CategoryFormData } from '../types/category';

const COLLECTION = 'categories';

export const getCategories = async (): Promise<Category[]> => {
  const q = query(collection(db, COLLECTION), orderBy('name', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({
    id: d.id,
    ...d.data(),
  })) as Category[];
};

export const subscribeToCategories = (callback: (categories: Category[]) => void) => {
  const q = query(collection(db, COLLECTION), orderBy('name', 'asc'));
  return onSnapshot(q, snapshot => {
    const categories = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
    })) as Category[];
    callback(categories);
  });
};

export const addCategory = async (data: CategoryFormData): Promise<string> => {
  const docRef = await addDoc(collection(db, COLLECTION), data);
  return docRef.id;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTION, id));
};
