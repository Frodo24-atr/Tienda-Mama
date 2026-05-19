'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Truck, MapPin, User } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';
import { ShippingInfo } from '@/types';
import toast from 'react-hot-toast';

const initialInfo: ShippingInfo = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  province: '',
  postalCode: '',
  shippingMethod: 'uber-moto',
  notes: '',
};

const provinces = [
  'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba',
  'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja',
  'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan',
  'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero',
  'Tierra del Fuego', 'Tucumán',
];

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const [info, setInfo] = useState<ShippingInfo>(initialInfo);
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [loading, setLoading] = useState(false);

  const update = (key: keyof ShippingInfo, value: string) =>
    setInfo((prev) => ({ ...prev, [key]: value }));

  const isCABA = info.province === 'CABA' || info.province === 'Buenos Aires';

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!info.name || !info.email || !info.phone || !info.address || !info.city || !info.province) {
      toast.error('Completá todos los campos obligatorios');
      return;
    }
    setStep('payment');
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.items,
          shipping: info,
        }),
      });
      const data = await res.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        toast.error('Error al procesar el pago. Intentá de nuevo.');
      }
    } catch {
      toast.error('Error de conexión. Verificá tu internet.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center px-4">
        <h2 className="text-xl font-bold text-stone-800 mb-4">Tu carrito está vacío</h2>
        <Link href="/" className="text-sm font-semibold text-amber-700 hover:underline">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/carrito" className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 mb-8 transition-colors">
        <ArrowLeft size={16} /> Volver al carrito
      </Link>

      <h1 className="text-3xl font-bold text-stone-900 mb-8">Finalizar compra</h1>

      {/* Steps indicator */}
      <div className="flex items-center gap-3 mb-10">
        <div className={`flex items-center gap-2 text-sm font-semibold ${step === 'shipping' ? 'text-amber-700' : 'text-stone-400'}`}>
          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === 'shipping' ? 'bg-amber-700 text-white' : 'bg-stone-200 text-stone-500'}`}>1</span>
          Datos de envío
        </div>
        <div className="flex-1 h-px bg-stone-200" />
        <div className={`flex items-center gap-2 text-sm font-semibold ${step === 'payment' ? 'text-amber-700' : 'text-stone-400'}`}>
          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === 'payment' ? 'bg-amber-700 text-white' : 'bg-stone-200 text-stone-500'}`}>2</span>
          Pago
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form */}
        <div className="flex-1">
          {step === 'shipping' ? (
            <form onSubmit={handleShippingSubmit} className="space-y-6">
              {/* Personal info */}
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
                <h2 className="font-bold text-stone-900 mb-5 flex items-center gap-2">
                  <User size={18} className="text-amber-600" /> Datos personales
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1.5">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={info.name}
                      onChange={(e) => update('name', e.target.value)}
                      className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1.5">Email *</label>
                    <input
                      type="email"
                      required
                      value={info.email}
                      onChange={(e) => update('email', e.target.value)}
                      className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    <p className="text-xs text-stone-400 mt-1.5">
                      📦 Usamos tu email para enviarte el seguimiento del envío y para que puedas consultar el estado de tu pedido en nuestra página.
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1.5">Teléfono *</label>
                    <input
                      type="tel"
                      required
                      value={info.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
                <h2 className="font-bold text-stone-900 mb-5 flex items-center gap-2">
                  <MapPin size={18} className="text-amber-600" /> Dirección de entrega
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1.5">Dirección *</label>
                    <input
                      type="text"
                      required
                      placeholder="Calle y número"
                      value={info.address}
                      onChange={(e) => update('address', e.target.value)}
                      className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1.5">Ciudad *</label>
                    <input
                      type="text"
                      required
                      value={info.city}
                      onChange={(e) => update('city', e.target.value)}
                      className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1.5">Provincia *</label>
                    <select
                      required
                      value={info.province}
                      onChange={(e) => {
                        update('province', e.target.value);
                        if (e.target.value !== 'CABA' && e.target.value !== 'Buenos Aires') {
                          update('shippingMethod', 'correo-argentino');
                        } else {
                          update('shippingMethod', 'uber-moto');
                        }
                      }}
                      className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                      <option value="">Selecioná</option>
                      {provinces.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1.5">Código postal</label>
                    <input
                      type="text"
                      value={info.postalCode}
                      onChange={(e) => update('postalCode', e.target.value)}
                      className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping method */}
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
                <h2 className="font-bold text-stone-900 mb-5 flex items-center gap-2">
                  <Truck size={18} className="text-amber-600" /> Método de envío
                </h2>
                <div className="space-y-3">
                  <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${isCABA && info.shippingMethod === 'uber-moto' ? 'border-amber-500 bg-amber-50' : 'border-stone-200'} ${!isCABA ? 'opacity-40 cursor-not-allowed' : ''}`}>
                    <input
                      type="radio"
                      name="shipping"
                      value="uber-moto"
                      checked={info.shippingMethod === 'uber-moto'}
                      onChange={() => update('shippingMethod', 'uber-moto')}
                      disabled={!isCABA}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-semibold text-sm text-stone-900">Uber Moto</p>
                      <p className="text-xs text-stone-500 mt-0.5">Solo CABA y GBA · Rápido y seguro · El costo lo abona el comprador al finalizar el pedido</p>
                    </div>
                  </label>
                  <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${info.shippingMethod === 'correo-argentino' ? 'border-amber-500 bg-amber-50' : 'border-stone-200'}`}>
                    <input
                      type="radio"
                      name="shipping"
                      value="correo-argentino"
                      checked={info.shippingMethod === 'correo-argentino'}
                      onChange={() => update('shippingMethod', 'correo-argentino')}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-semibold text-sm text-stone-900">Correo Argentino / Agencia</p>
                      <p className="text-xs text-stone-500 mt-0.5">Todo el país · El costo varía según distancia · Te informamos el total por WhatsApp</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-2">
                  Notas adicionales (opcional)
                </label>
                <textarea
                  rows={3}
                  value={info.notes}
                  onChange={(e) => update('notes', e.target.value)}
                  placeholder="Instrucciones especiales, horarios, etc."
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-stone-900 text-white font-semibold py-4 rounded-2xl hover:bg-amber-700 transition-colors"
              >
                Continuar al pago
              </button>
            </form>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-8">
              <h2 className="font-bold text-stone-900 text-xl mb-2 flex items-center gap-2">
                <CreditCard size={20} className="text-amber-600" /> Pago seguro
              </h2>
              <p className="text-sm text-stone-500 mb-8">
                Vas a ser redirigido a MercadoPago para completar el pago de forma segura.
              </p>

              {/* Summary before pay */}
              <div className="bg-stone-50 rounded-xl p-4 mb-6 space-y-2">
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Confirmá tu pedido</p>
                {cart.items.map(({ product }) => (
                  <div key={product.id} className="flex justify-between text-sm">
                    <span className="text-stone-700">{product.name}</span>
                    <span className="font-semibold">${product.price.toLocaleString('es-AR')}</span>
                  </div>
                ))}
                <div className="border-t border-stone-200 pt-2 flex justify-between font-bold text-stone-900">
                  <span>Total productos</span>
                  <span>${cart.total.toLocaleString('es-AR')}</span>
                </div>
                <p className="text-xs text-stone-400">* El costo de envío se coordina aparte</p>
              </div>

              <div className="mb-6 bg-amber-50 rounded-xl p-4 text-sm text-amber-800">
                <strong>Enviando a:</strong> {info.name} — {info.address}, {info.city}, {info.province}
                {' '}· <strong>Envío:</strong> {info.shippingMethod === 'uber-moto' ? 'Uber Moto' : 'Correo Argentino'}
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-[#009EE3] text-white font-bold py-4 rounded-2xl hover:bg-[#0088cc] transition-colors flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {loading ? (
                  <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <svg viewBox="0 0 80 22" className="h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
                      <text x="0" y="17" fontSize="16" fontWeight="bold">MercadoPago</text>
                    </svg>
                    Pagar ${cart.total.toLocaleString('es-AR')}
                  </>
                )}
              </button>

              <p className="text-xs text-stone-400 text-center mt-4">
                No se aceptan pagos en cuotas. Pago único.
              </p>

              <button
                onClick={() => setStep('shipping')}
                className="w-full mt-4 text-sm text-stone-400 hover:text-stone-700 transition-colors"
              >
                ← Volver a datos de envío
              </button>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 sticky top-24">
            <h3 className="font-bold text-stone-900 mb-4">Tu pedido</h3>
            <div className="space-y-3 mb-4">
              {cart.items.map(({ product }) => (
                <div key={product.id} className="flex justify-between text-sm">
                  <span className="text-stone-600 truncate mr-2 text-xs">{product.name}</span>
                  <span className="font-semibold text-stone-900 whitespace-nowrap text-xs">
                    ${product.price.toLocaleString('es-AR')}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-stone-100 pt-4 flex justify-between font-bold text-stone-900">
              <span>Total</span>
              <span>${cart.total.toLocaleString('es-AR')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
