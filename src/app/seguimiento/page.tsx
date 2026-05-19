'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';
import { Order, getOrdersByEmail, statusLabel, statusColor, zoneLabel } from '@/lib/orders';
import toast from 'react-hot-toast';

const statusSteps = ['confirmed', 'preparing', 'shipped', 'delivered'] as const;

const stepIcon = (status: string) => {
  switch (status) {
    case 'confirmed': return <CheckCircle size={16} />;
    case 'preparing': return <Package size={16} />;
    case 'shipped': return <Truck size={16} />;
    case 'delivered': return <MapPin size={16} />;
    default: return <Clock size={16} />;
  }
};

export default function SeguimientoPage() {
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const data = await getOrdersByEmail(email.trim());
      setOrders(data);
      setSearched(true);
      if (data.length === 0) {
        toast('No encontramos órdenes para ese email.', { icon: '🔍' });
      }
    } catch {
      toast.error('Error al buscar. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <p className="text-xs tracking-[0.3em] text-amber-700 font-semibold uppercase mb-3">Mi pedido</p>
        <h1 className="text-4xl font-bold text-stone-900 mb-4">Seguimiento de envío</h1>
        <p className="text-stone-500">Ingresá tu email para ver el estado de tus compras.</p>
      </div>

      <form onSubmit={handleSearch} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 mb-8">
        <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-2">
          Email con el que compraste
        </label>
        <div className="flex gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="flex-1 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-stone-900 text-white font-semibold px-6 py-3 rounded-xl hover:bg-amber-700 transition-colors disabled:opacity-60"
          >
            {loading ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <Search size={16} />
            )}
            Buscar
          </button>
        </div>
      </form>

      {searched && orders.length === 0 && (
        <div className="text-center py-12 text-stone-500">
          <Package size={48} className="mx-auto mb-4 opacity-20" />
          <p>No encontramos órdenes para <strong>{email}</strong></p>
          <p className="text-xs mt-2 text-stone-400">
            Verificá que sea el mismo email con el que pagaste en MercadoPago.
          </p>
        </div>
      )}

      {orders.map((order) => {
        const currentStep = statusSteps.indexOf(order.status as typeof statusSteps[number]);

        return (
          <div key={order.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm mb-6 overflow-hidden">
            {/* Order header */}
            <div className="px-6 py-4 border-b border-stone-100 bg-stone-50 flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-xs text-stone-400 mb-0.5">Orden #{order.id.slice(-8).toUpperCase()}</p>
                <p className="text-sm text-stone-600">
                  {new Date(order.createdAt).toLocaleDateString('es-AR', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor[order.status]}`}>
                  {statusLabel[order.status]}
                </span>
                <p className="font-bold text-stone-900">${order.total.toLocaleString('es-AR')}</p>
              </div>
            </div>

            <div className="p-6">
              {/* Progress steps */}
              {order.status !== 'pending' && (
                <div className="mb-6">
                  <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 right-0 top-4 h-0.5 bg-stone-100 -z-0" />
                    {statusSteps.map((step, i) => {
                      const done = i <= currentStep;
                      return (
                        <div key={step} className="flex flex-col items-center gap-2 z-10">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                            done ? 'bg-amber-600 border-amber-600 text-white' : 'bg-white border-stone-200 text-stone-300'
                          }`}>
                            {stepIcon(step)}
                          </div>
                          <p className={`text-[10px] font-medium text-center leading-tight ${done ? 'text-stone-700' : 'text-stone-400'}`}>
                            {statusLabel[step]}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tracking info */}
              {order.trackingInfo && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
                  {order.shippingMethod === 'uber-moto' ? (
                    <div>
                      <p className="text-sm font-semibold text-amber-900 mb-1 flex items-center gap-2">
                        <Truck size={16} /> Seguí tu envío en vivo
                      </p>
                      <a
                        href={order.trackingInfo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-amber-700 underline break-all"
                      >
                        {order.trackingInfo}
                      </a>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-semibold text-amber-900 mb-1 flex items-center gap-2">
                        <Package size={16} /> Código de seguimiento
                      </p>
                      <p className="text-lg font-bold text-amber-800 tracking-widest">{order.trackingInfo}</p>
                      <a
                        href="https://www.correoargentino.com.ar/formularios/seg"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-amber-700 underline mt-1 block"
                      >
                        Rastrear en Correo Argentino
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Items */}
              <div>
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Productos</p>
                <div className="space-y-3">
                  {order.items.map(({ product }) => (
                    <div key={product.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-stone-100 rounded-xl overflow-hidden flex-shrink-0">
                        {product.images?.[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-300">👗</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-900 truncate">{product.name}</p>
                        <p className="text-xs text-stone-400">Talle: {product.size} · {product.color}</p>
                      </div>
                      <p className="text-sm font-semibold text-stone-900 whitespace-nowrap">
                        ${product.price.toLocaleString('es-AR')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping address */}
              <div className="mt-5 pt-5 border-t border-stone-100">
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">Dirección de entrega</p>
                <p className="text-sm text-stone-700">
                  {order.buyer.address}, {order.buyer.city}, {order.buyer.province}
                  {order.buyer.postalCode ? ` (CP: ${order.buyer.postalCode})` : ''}
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  Método: {order.shippingMethod === 'uber-moto' ? 'Uber Moto' : 'Correo Argentino'} · Zona: {zoneLabel[order.shippingZone]}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
