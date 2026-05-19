'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
  getAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  markProductSold,
} from '@/lib/products';
import { DEMO_PRODUCTS } from '@/lib/demo-data';
import {
  getAllOrders,
  updateOrderStatus,
  Order,
  OrderStatus,
  statusLabel,
  statusColor,
  zoneLabel,
  zoneColor,
} from '@/lib/orders';
import { Product, ProductCategory, ProductGender, ProductCondition } from '@/types';
import Image from 'next/image';
import {
  Plus, LogOut, Edit2, Trash2, EyeOff, Package,
  Upload, X, Check, ShoppingBag, Truck, Bell,
  ChevronDown, ChevronUp,
} from 'lucide-react';
import toast from 'react-hot-toast';

const IS_DEMO = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === 'placeholder-project' ||
  !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

type Tab = 'products' | 'orders';
type FormMode = 'none' | 'create' | 'edit';

interface ProductForm {
  name: string;
  brand: string;
  category: ProductCategory;
  gender: ProductGender;
  size: string;
  color: string;
  condition: ProductCondition;
  price: string;
  description: string;
  stock: string;
  featured: boolean;
  available: boolean;
}

const emptyForm: ProductForm = {
  name: '', brand: '', category: 'remera', gender: 'mujer', size: 'M',
  color: '', condition: 'nuevo', price: '', description: '', stock: '1',
  featured: false, available: true,
};

const categories = ['remera','camisa','pantalon','jean','vestido','pollera','shorts','campera','abrigo','conjunto','calzado','accesorio','otro'];
const genders = ['mujer','hombre','unisex','nino','nina'];
const conditions = ['nuevo','como-nuevo','muy-buen-estado','buen-estado'];
const sizes = ['XS','S','M','L','XL','XXL','XXXL','34','36','38','40','42','44','46','35','37','39','41','unico'];

const orderStatuses: OrderStatus[] = ['pending','confirmed','preparing','shipped','delivered'];

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('products');

  // Products
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [formMode, setFormMode] = useState<FormMode>('none');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [productFilter, setProductFilter] = useState<'all'|'available'|'sold'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (IS_DEMO) {
      if (sessionStorage.getItem('demo-admin') !== '1') router.replace('/admin');
      return;
    }
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.replace('/admin');
    });
    return unsub;
  }, [router]);

  useEffect(() => { loadProducts(); }, []);
  useEffect(() => { if (tab === 'orders') loadOrders(); }, [tab]);

  const loadProducts = async () => {
    setLoadingProducts(true);
    try { setProducts(await getAllProductsAdmin()); }
    finally { setLoadingProducts(false); }
  };

  const loadOrders = async () => {
    setLoadingOrders(true);
    try { setOrders(await getAllOrders()); }
    finally { setLoadingOrders(false); }
  };

  /* ─── Product form ─── */

  const openCreate = () => {
    setForm(emptyForm); setImageFiles([]); setImagePreviews([]);
    setExistingImages([]); setEditingProduct(null); setFormMode('create');
    setTimeout(() => document.getElementById('product-form')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const openEdit = (p: Product) => {
    setForm({
      name: p.name, brand: p.brand, category: p.category, gender: p.gender,
      size: p.size, color: p.color, condition: p.condition,
      price: String(p.price), description: p.description,
      stock: String(p.stock), featured: p.featured, available: p.available,
    });
    setExistingImages(p.images); setImageFiles([]); setImagePreviews([]);
    setEditingProduct(p); setFormMode('edit');
    setTimeout(() => document.getElementById('product-form')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setImageFiles((prev) => [...prev, ...files]);
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreviews((prev) => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.brand || !form.price) { toast.error('Completá los campos obligatorios'); return; }
    setSaving(true);
    try {
      const data = {
        name: form.name, brand: form.brand, category: form.category, gender: form.gender,
        size: form.size, color: form.color, condition: form.condition,
        price: Number(form.price), description: form.description,
        stock: Number(form.stock), featured: form.featured,
        available: form.available && Number(form.stock) > 0,
      };
      if (formMode === 'create') {
        await createProduct(data, imageFiles);
        toast.success('Prenda publicada');
      } else if (editingProduct) {
        await updateProduct(editingProduct.id, { ...data, images: existingImages }, imageFiles);
        toast.success('Prenda actualizada');
      }
      setFormMode('none');
      loadProducts();
    } catch { toast.error('Error al guardar'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (p: Product) => {
    if (!confirm(`¿Eliminás "${p.name}"?`)) return;
    try { await deleteProduct(p.id, p.images); toast.success('Eliminada'); loadProducts(); }
    catch { toast.error('Error al eliminar'); }
  };

  /* ─── Order management ─── */

  const handleStatusUpdate = async (order: Order, status: OrderStatus) => {
    setStatusUpdating(order.id);
    const tracking = trackingInputs[order.id] ?? order.trackingInfo;
    try {
      await updateOrderStatus(order.id, status, tracking);
      toast.success(`Estado actualizado: ${statusLabel[status]}`);
      loadOrders();
    } catch { toast.error('Error al actualizar el estado'); }
    finally { setStatusUpdating(null); }
  };

  const filteredProducts = products.filter((p) => {
    if (productFilter === 'available') return p.available && p.stock > 0;
    if (productFilter === 'sold') return !p.available || p.stock === 0;
    return true;
  });

  const pendingOrders = orders.filter((o) => o.status === 'confirmed' || o.status === 'preparing');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Panel de Administración</h1>
          <p className="text-stone-500 text-sm mt-0.5">Solano Moda</p>
        </div>
        <div className="flex items-center gap-3">
          {tab === 'products' && (
            <button onClick={openCreate} className="flex items-center gap-2 bg-stone-900 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-amber-700 transition-colors text-sm">
              <Plus size={16} /> Nueva prenda
            </button>
          )}
          <button onClick={() => { if (IS_DEMO) { sessionStorage.removeItem('demo-admin'); } else { signOut(auth); } router.push('/admin'); }} className="flex items-center gap-2 text-stone-500 hover:text-stone-800 text-sm transition-colors px-3 py-2.5 rounded-xl border border-stone-200">
            <LogOut size={16} /> Salir
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Prendas', value: products.length, color: 'bg-stone-100 text-stone-700' },
          { label: 'Disponibles', value: products.filter((p) => p.available && p.stock > 0).length, color: 'bg-emerald-50 text-emerald-700' },
          { label: 'Órdenes totales', value: orders.length, color: 'bg-blue-50 text-blue-700' },
          { label: 'Pendientes', value: pendingOrders.length, color: pendingOrders.length > 0 ? 'bg-amber-50 text-amber-700' : 'bg-stone-100 text-stone-500' },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl p-5 ${s.color}`}>
            <p className="text-3xl font-bold mb-1">{s.value}</p>
            <p className="text-sm font-medium opacity-80">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setTab('products')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === 'products' ? 'bg-stone-900 text-white' : 'bg-white text-stone-600 border border-stone-200'}`}
        >
          <Package size={16} /> Prendas
        </button>
        <button
          onClick={() => setTab('orders')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === 'orders' ? 'bg-stone-900 text-white' : 'bg-white text-stone-600 border border-stone-200'}`}
        >
          <ShoppingBag size={16} /> Ventas
          {pendingOrders.length > 0 && (
            <span className="bg-amber-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {pendingOrders.length}
            </span>
          )}
        </button>
      </div>

      {/* ─── PRODUCTS TAB ─── */}
      {tab === 'products' && (
        <>
          {/* Product form */}
          {formMode !== 'none' && (
            <div id="product-form" className="bg-white rounded-2xl border border-stone-100 shadow-sm mb-8 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50">
                <h2 className="font-bold text-stone-900">
                  {formMode === 'create' ? '+ Nueva prenda' : `Editando: ${editingProduct?.name}`}
                </h2>
                <button onClick={() => setFormMode('none')} className="text-stone-400 hover:text-stone-700"><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="field-label">Nombre de la prenda *</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({...form,name:e.target.value})} placeholder="Ej: Remera básica algodón" className="field-input" />
                </div>
                <div>
                  <label className="field-label">Marca *</label>
                  <input type="text" required value={form.brand} onChange={(e) => setForm({...form,brand:e.target.value})} placeholder="Ej: Zara, Levi's..." className="field-input" />
                </div>
                <div>
                  <label className="field-label">Precio (ARS) *</label>
                  <input type="number" required min="0" value={form.price} onChange={(e) => setForm({...form,price:e.target.value})} placeholder="Ej: 5000" className="field-input" />
                </div>
                <div>
                  <label className="field-label">Categoría</label>
                  <select value={form.category} onChange={(e) => setForm({...form,category:e.target.value as ProductCategory})} className="field-input">
                    {categories.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Género</label>
                  <select value={form.gender} onChange={(e) => setForm({...form,gender:e.target.value as ProductGender})} className="field-input">
                    {genders.map((g) => <option key={g} value={g}>{g.charAt(0).toUpperCase()+g.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Talle</label>
                  <select value={form.size} onChange={(e) => setForm({...form,size:e.target.value})} className="field-input">
                    {sizes.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Color</label>
                  <input type="text" value={form.color} onChange={(e) => setForm({...form,color:e.target.value})} placeholder="Ej: Azul marino" className="field-input" />
                </div>
                <div>
                  <label className="field-label">Condición</label>
                  <select value={form.condition} onChange={(e) => setForm({...form,condition:e.target.value as ProductCondition})} className="field-input">
                    {conditions.map((c) => <option key={c} value={c}>{c.replace(/-/g,' ').replace(/\b\w/g,(l)=>l.toUpperCase())}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Stock</label>
                  <input type="number" min="0" value={form.stock} onChange={(e) => setForm({...form,stock:e.target.value})} className="field-input" />
                </div>
                <div className="sm:col-span-2">
                  <label className="field-label">Descripción</label>
                  <textarea rows={3} value={form.description} onChange={(e) => setForm({...form,description:e.target.value})} placeholder="Descripción detallada..." className="field-input resize-none" />
                </div>
                <div className="sm:col-span-2 flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-stone-700">
                    <input type="checkbox" checked={form.available} onChange={(e) => setForm({...form,available:e.target.checked})} className="w-4 h-4 accent-amber-600" />
                    Disponible en catálogo
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-stone-700">
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm({...form,featured:e.target.checked})} className="w-4 h-4 accent-amber-600" />
                    Destacada
                  </label>
                </div>

                {/* Images */}
                <div className="sm:col-span-2">
                  <label className="field-label">Fotos</label>
                  <div className="flex gap-3 flex-wrap mb-3">
                    {existingImages.map((url,i) => (
                      <div key={url} className="relative">
                        <div className="w-20 h-20 rounded-xl overflow-hidden border border-stone-200">
                          <Image src={url} alt="foto" width={80} height={80} className="object-cover w-full h-full" />
                        </div>
                        <button type="button" onClick={() => setExistingImages((p) => p.filter((_,idx)=>idx!==i))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"><X size={10}/></button>
                      </div>
                    ))}
                    {imagePreviews.map((src,i) => (
                      <div key={i} className="relative">
                        <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-amber-400 border-dashed">
                          <Image src={src} alt="nueva" width={80} height={80} className="object-cover w-full h-full" />
                        </div>
                        <button type="button" onClick={() => { setImageFiles((p)=>p.filter((_,idx)=>idx!==i)); setImagePreviews((p)=>p.filter((_,idx)=>idx!==i)); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"><X size={10}/></button>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 border-2 border-dashed border-stone-300 rounded-xl px-6 py-4 text-sm text-stone-500 hover:border-amber-400 hover:text-amber-600 transition-colors w-full justify-center">
                    <Upload size={18}/> Subir fotos (podés seleccionar varias)
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                </div>

                <div className="sm:col-span-2 flex gap-3">
                  <button type="submit" disabled={saving} className="flex items-center gap-2 bg-stone-900 text-white font-semibold px-8 py-3 rounded-xl hover:bg-amber-700 transition-colors disabled:opacity-60">
                    {saving ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"/> : <Check size={16}/>}
                    {formMode === 'create' ? 'Publicar prenda' : 'Guardar cambios'}
                  </button>
                  <button type="button" onClick={() => setFormMode('none')} className="px-6 py-3 text-sm text-stone-500 hover:text-stone-800 border border-stone-200 rounded-xl">Cancelar</button>
                </div>
              </form>
            </div>
          )}

          {/* Product filter */}
          <div className="flex gap-2 mb-5">
            {(['all','available','sold'] as const).map((f) => (
              <button key={f} onClick={() => setProductFilter(f)} className={`text-sm font-medium px-4 py-2 rounded-lg transition-all ${productFilter===f?'bg-stone-900 text-white':'bg-white text-stone-600 border border-stone-200'}`}>
                {f==='all'?'Todas':f==='available'?'Disponibles':'Vendidas/Ocultas'}
              </button>
            ))}
          </div>

          {/* Products list */}
          {loadingProducts ? (
            <div className="flex items-center justify-center py-20"><span className="animate-spin rounded-full h-8 w-8 border-2 border-stone-300 border-t-stone-900"/></div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 text-stone-500"><Package size={40} className="mx-auto mb-4 opacity-30"/><p>No hay prendas aquí.</p></div>
          ) : (
            <div className="space-y-3">
              {filteredProducts.map((p) => (
                <div key={p.id} className={`bg-white rounded-2xl border shadow-sm p-4 flex items-center gap-4 ${(!p.available||p.stock===0)?'border-stone-100 opacity-70':'border-stone-100'}`}>
                  <div className="w-16 h-16 bg-stone-100 rounded-xl overflow-hidden flex-shrink-0">
                    {p.images[0]?<Image src={p.images[0]} alt={p.name} width={64} height={64} className="object-cover w-full h-full"/>:<div className="w-full h-full flex items-center justify-center text-stone-300 text-xl">👗</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-stone-900 text-sm truncate">{p.name}</p>
                      {p.featured&&<span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">Destacada</span>}
                      {(!p.available||p.stock===0)&&<span className="text-[10px] bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">Sin stock</span>}
                    </div>
                    <p className="text-xs text-stone-400 mt-0.5">{p.brand} · Talle {p.size} · {p.color} · Stock: {p.stock}</p>
                    <p className="text-sm font-bold text-stone-900 mt-1">${p.price.toLocaleString('es-AR')}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => openEdit(p)} className="p-2 text-stone-400 hover:text-amber-600 transition-colors" title="Editar"><Edit2 size={16}/></button>
                    {p.available&&p.stock>0&&<button onClick={() => markProductSold(p.id).then(loadProducts)} className="p-2 text-stone-400 hover:text-orange-500 transition-colors" title="Marcar vendida"><EyeOff size={16}/></button>}
                    <button onClick={() => handleDelete(p)} className="p-2 text-stone-400 hover:text-red-500 transition-colors" title="Eliminar"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ─── ORDERS TAB ─── */}
      {tab === 'orders' && (
        <>
          {loadingOrders ? (
            <div className="flex items-center justify-center py-20"><span className="animate-spin rounded-full h-8 w-8 border-2 border-stone-300 border-t-stone-900"/></div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 text-stone-500"><ShoppingBag size={40} className="mx-auto mb-4 opacity-30"/><p>Todavía no hay ventas.</p></div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const isExpanded = expandedOrder === order.id;
                return (
                  <div key={order.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
                    {/* Order row header */}
                    <button
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      className="w-full flex items-center gap-4 px-5 py-4 hover:bg-stone-50 transition-colors text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <p className="font-semibold text-stone-900 text-sm">
                            {order.buyer.name}
                          </p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor[order.status]}`}>
                            {statusLabel[order.status]}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${zoneColor[order.shippingZone]}`}>
                            {zoneLabel[order.shippingZone]}
                          </span>
                          {order.shippingMethod === 'uber-moto' && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-700">Uber Moto</span>
                          )}
                        </div>
                        <p className="text-xs text-stone-400 mt-0.5">
                          {order.buyer.email} · {order.buyer.phone} ·{' '}
                          {new Date(order.createdAt).toLocaleDateString('es-AR', { day:'2-digit', month:'short', year:'numeric' })}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0 mr-2">
                        <p className="font-bold text-stone-900">${order.total.toLocaleString('es-AR')}</p>
                        <p className="text-xs text-stone-400">{order.items.length} prenda{order.items.length!==1?'s':''}</p>
                      </div>
                      {isExpanded ? <ChevronUp size={16} className="text-stone-400 flex-shrink-0"/> : <ChevronDown size={16} className="text-stone-400 flex-shrink-0"/>}
                    </button>

                    {/* Expanded order detail */}
                    {isExpanded && (
                      <div className="border-t border-stone-100 px-5 py-5 space-y-5">
                        {/* Buyer & shipping info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-stone-50 rounded-xl p-4">
                            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">Comprador</p>
                            <p className="text-sm font-semibold text-stone-900">{order.buyer.name}</p>
                            <p className="text-xs text-stone-600">{order.buyer.email}</p>
                            <p className="text-xs text-stone-600">{order.buyer.phone}</p>
                          </div>
                          <div className="bg-stone-50 rounded-xl p-4">
                            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">Dirección de envío</p>
                            <p className="text-sm font-semibold text-stone-900">{order.buyer.address}</p>
                            <p className="text-xs text-stone-600">{order.buyer.city}, {order.buyer.province} {order.buyer.postalCode}</p>
                            <p className="text-xs text-amber-700 font-semibold mt-1">
                              {order.shippingMethod === 'uber-moto' ? '🏍️ Uber Moto' : '📦 Correo Argentino'} · {zoneLabel[order.shippingZone]}
                            </p>
                          </div>
                        </div>

                        {/* Items */}
                        <div>
                          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">Prendas</p>
                          <div className="space-y-2">
                            {order.items.map(({ product }) => (
                              <div key={product.id} className="flex items-center gap-3 bg-stone-50 rounded-xl p-3">
                                <div className="w-10 h-10 bg-stone-200 rounded-lg overflow-hidden flex-shrink-0">
                                  {product.images?.[0]?<Image src={product.images[0]} alt={product.name} width={40} height={40} className="object-cover w-full h-full"/>:<span className="flex items-center justify-center w-full h-full text-stone-400 text-sm">👗</span>}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-stone-900 truncate">{product.name}</p>
                                  <p className="text-xs text-stone-400">Talle: {product.size} · {product.color}</p>
                                </div>
                                <p className="text-sm font-bold text-stone-900 whitespace-nowrap">${product.price.toLocaleString('es-AR')}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {order.notes && (
                          <div className="bg-amber-50 rounded-xl p-3">
                            <p className="text-xs font-semibold text-amber-800 mb-1">Notas del comprador</p>
                            <p className="text-sm text-amber-900">{order.notes}</p>
                          </div>
                        )}

                        {/* Status management */}
                        <div className="bg-stone-50 rounded-xl p-4">
                          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Gestión del envío</p>
                          <div className="flex flex-col sm:flex-row gap-3 mb-3">
                            <input
                              type="text"
                              placeholder={order.shippingMethod==='uber-moto' ? 'Link de seguimiento Uber Moto' : 'Código de seguimiento'}
                              value={trackingInputs[order.id] ?? order.trackingInfo ?? ''}
                              onChange={(e) => setTrackingInputs((p) => ({...p, [order.id]: e.target.value}))}
                              className="flex-1 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                            />
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {orderStatuses.filter((s) => s !== 'pending').map((s) => (
                              <button
                                key={s}
                                onClick={() => handleStatusUpdate(order, s)}
                                disabled={statusUpdating === order.id || order.status === s}
                                className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all disabled:opacity-50 ${
                                  order.status === s
                                    ? 'bg-stone-900 text-white cursor-default'
                                    : 'bg-white border border-stone-200 text-stone-700 hover:border-amber-400'
                                }`}
                              >
                                {statusUpdating===order.id ? '...' : statusLabel[s]}
                              </button>
                            ))}
                          </div>
                          <p className="text-xs text-stone-400 mt-3 flex items-center gap-1">
                            <Bell size={12}/> Al marcar &quot;Enviado&quot;, el comprador puede ver el seguimiento desde su email en la página de seguimiento.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* CSS helpers via style tag */}
      <style>{`
        .field-label { display:block; font-size:11px; font-weight:600; color:#78716c; text-transform:uppercase; letter-spacing:.05em; margin-bottom:6px; }
        .field-input { width:100%; border:1px solid #e7e5e4; border-radius:12px; padding:10px 14px; font-size:14px; outline:none; background:#fafaf8; }
        .field-input:focus { box-shadow:0 0 0 2px #fbbf24; border-color:#fbbf24; }
      `}</style>
    </div>
  );
}
