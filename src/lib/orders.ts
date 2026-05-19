import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { CartItem } from '@/types';

export type ShippingZone =
  | 'caba'
  | 'gba-norte'
  | 'gba-sur'
  | 'gba-oeste'
  | 'gba-este'
  | 'la-plata'
  | 'interior';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'shipped'
  | 'delivered';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  buyer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
  };
  shippingMethod: 'uber-moto' | 'correo-argentino';
  shippingZone: ShippingZone;
  status: OrderStatus;
  trackingInfo: string;
  paymentId: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const COLLECTION = 'orders';

// GBA zone detection by city name
const GBA_NORTE = [
  'san isidro', 'vicente lopez', 'tigre', 'san martin', 'san fernando',
  'escobar', 'pilar', 'tres de febrero', 'malvinas argentinas', 'jose c paz',
  'moreno norte', 'hurlingham', 'ituzaingo norte', 'merlo norte',
];
const GBA_SUR = [
  'avellaneda', 'quilmes', 'berazategui', 'lanus', 'lomas de zamora',
  'almirante brown', 'esteban echeverria', 'ezeiza', 'presidente peron',
  'florencio varela', 'san vicente',
];
const GBA_OESTE = [
  'la matanza', 'merlo', 'moreno', 'moron', 'ituzaingo', 'hurlingham',
  'general rodriguez', 'marcos paz', 'lujan', 'general las heras',
];
const GBA_ESTE = ['quilmes este', 'berazategui', 'florencio varela'];

export function detectShippingZone(city: string, province: string): ShippingZone {
  const c = city.toLowerCase().trim();
  const p = province.toLowerCase().trim();

  if (p === 'caba' || p === 'ciudad autónoma de buenos aires' || p === 'ciudad autonoma de buenos aires') {
    return 'caba';
  }

  if (c === 'la plata' || c === 'berisso' || c === 'ensenada') {
    return 'la-plata';
  }

  if (GBA_NORTE.some((z) => c.includes(z))) return 'gba-norte';
  if (GBA_SUR.some((z) => c.includes(z))) return 'gba-sur';
  if (GBA_OESTE.some((z) => c.includes(z))) return 'gba-oeste';
  if (GBA_ESTE.some((z) => c.includes(z))) return 'gba-este';

  if (p === 'buenos aires') return 'gba-sur'; // fallback for GBA
  return 'interior';
}

export const zoneLabel: Record<ShippingZone, string> = {
  caba: 'CABA',
  'gba-norte': 'GBA Norte',
  'gba-sur': 'GBA Sur',
  'gba-oeste': 'GBA Oeste',
  'gba-este': 'GBA Este',
  'la-plata': 'La Plata',
  interior: 'Interior del País',
};

export const zoneColor: Record<ShippingZone, string> = {
  caba: 'bg-blue-100 text-blue-800',
  'gba-norte': 'bg-emerald-100 text-emerald-800',
  'gba-sur': 'bg-amber-100 text-amber-800',
  'gba-oeste': 'bg-purple-100 text-purple-800',
  'gba-este': 'bg-teal-100 text-teal-800',
  'la-plata': 'bg-indigo-100 text-indigo-800',
  interior: 'bg-stone-100 text-stone-700',
};

export const statusLabel: Record<OrderStatus, string> = {
  pending: 'Pago pendiente',
  confirmed: 'Pago confirmado',
  preparing: 'En preparación',
  shipped: 'Enviado',
  delivered: 'Entregado',
};

export const statusColor: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-amber-100 text-amber-800',
  shipped: 'bg-emerald-100 text-emerald-800',
  delivered: 'bg-stone-100 text-stone-700',
};

export async function createOrder(data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getOrderById(id: string): Promise<Order | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return fromDoc(snap.id, snap.data());
}

export async function getOrdersByEmail(email: string): Promise<Order[]> {
  const q = query(
    collection(db, COLLECTION),
    where('buyer.email', '==', email.toLowerCase()),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => fromDoc(d.id, d.data()));
}

export async function getAllOrders(): Promise<Order[]> {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => fromDoc(d.id, d.data()));
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  trackingInfo?: string
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    status,
    ...(trackingInfo !== undefined ? { trackingInfo } : {}),
    updatedAt: serverTimestamp(),
  });
}

function fromDoc(id: string, data: Record<string, unknown>): Order {
  return {
    id,
    ...data,
    createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate() ?? new Date(),
  } as Order;
}
