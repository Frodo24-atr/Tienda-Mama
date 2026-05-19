import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, Timestamp, serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';
import { Product, Filters } from '@/types';

const COLLECTION = 'products';

export async function getProducts(filters?: Partial<Filters>): Promise<Product[]> {
  const q = query(
    collection(db, COLLECTION),
    where('available', '==', true),
    where('stock', '>', 0),
    orderBy('stock'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  let products = snapshot.docs.map((doc) => ({
    id: doc.id, ...doc.data(),
    createdAt: (doc.data().createdAt as Timestamp)?.toDate() ?? new Date(),
    updatedAt: (doc.data().updatedAt as Timestamp)?.toDate() ?? new Date(),
  })) as Product[];

  if (filters) {
    if (filters.category) products = products.filter((p) => p.category === filters.category);
    if (filters.gender) products = products.filter((p) => p.gender === filters.gender);
    if (filters.size) products = products.filter((p) => p.size === filters.size);
    if (filters.condition) products = products.filter((p) => p.condition === filters.condition);
    if (filters.search) {
      const s = filters.search.toLowerCase();
      products = products.filter((p) =>
        p.name.toLowerCase().includes(s) || p.brand.toLowerCase().includes(s) || p.description.toLowerCase().includes(s)
      );
    }
    if (filters.minPrice) products = products.filter((p) => p.price >= Number(filters.minPrice));
    if (filters.maxPrice) products = products.filter((p) => p.price <= Number(filters.maxPrice));
  }
  return products;
}

export async function getAllProductsAdmin(): Promise<Product[]> {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id, ...doc.data(),
    createdAt: (doc.data().createdAt as Timestamp)?.toDate() ?? new Date(),
    updatedAt: (doc.data().updatedAt as Timestamp)?.toDate() ?? new Date(),
  })) as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return {
    id: docSnap.id, ...docSnap.data(),
    createdAt: (docSnap.data().createdAt as Timestamp)?.toDate() ?? new Date(),
    updatedAt: (docSnap.data().updatedAt as Timestamp)?.toDate() ?? new Date(),
  } as Product;
}

export async function uploadProductImages(files: File[], productId: string): Promise<string[]> {
  const urls: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const storageRef = ref(storage, `products/${productId}/${Date.now()}_${i}_${file.name}`);
    await uploadBytes(storageRef, file);
    urls.push(await getDownloadURL(storageRef));
  }
  return urls;
}

export async function createProduct(
  data: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'images'>,
  imageFiles: File[]
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data, images: [], createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  });
  if (imageFiles.length > 0) {
    const urls = await uploadProductImages(imageFiles, docRef.id);
    await updateDoc(docRef, { images: urls });
  }
  return docRef.id;
}

export async function updateProduct(
  id: string,
  data: Partial<Omit<Product, 'id' | 'createdAt'>>,
  newImageFiles?: File[]
): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  const updates: Record<string, unknown> = { ...data, updatedAt: serverTimestamp() };
  if (newImageFiles && newImageFiles.length > 0) {
    const newUrls = await uploadProductImages(newImageFiles, id);
    updates.images = [...(data.images ?? []), ...newUrls];
  }
  await updateDoc(docRef, updates);
}

export async function deleteProduct(id: string, images: string[]): Promise<void> {
  for (const url of images) {
    try { await deleteObject(ref(storage, url)); } catch {}
  }
  await deleteDoc(doc(db, COLLECTION, id));
}

export async function markProductSold(id: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { available: false, stock: 0, updatedAt: serverTimestamp() });
}

export async function decrementStock(id: string, currentStock: number): Promise<void> {
  const newStock = currentStock - 1;
  await updateDoc(doc(db, COLLECTION, id), { stock: newStock, available: newStock > 0, updatedAt: serverTimestamp() });
}
