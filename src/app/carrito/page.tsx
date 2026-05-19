'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';

export default function CartPage() {
  const { cart, removeFromCart } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center px-4">
        <ShoppingBag size={64} className="text-stone-200 mb-6" />
        <h2 className="text-2xl font-bold text-stone-800 mb-2">Tu carrito está vacío</h2>
        <p className="text-stone-500 mb-8 text-sm">Explorá nuestro catálogo y encontrá algo que te guste.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-stone-900 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-amber-700 transition-colors text-sm"
        >
          Ver catálogo <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-stone-900 mb-8">Tu carrito</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Items */}
        <div className="flex-1 space-y-4">
          {cart.items.map(({ product }) => (
            <div key={product.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4 flex gap-4">
              <Link href={`/productos/${product.id}`} className="relative w-24 h-32 bg-stone-100 rounded-xl overflow-hidden flex-shrink-0">
                {product.images[0] ? (
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-300 text-2xl">👗</div>
                )}
              </Link>

              <div className="flex-1 min-w-0">
                <p className="text-[10px] tracking-widest text-amber-700 font-bold uppercase mb-0.5">{product.brand}</p>
                <Link href={`/productos/${product.id}`} className="font-semibold text-stone-900 hover:text-amber-700 transition-colors line-clamp-2 text-sm">
                  {product.name}
                </Link>
                <p className="text-xs text-stone-400 mt-1">Talle: {product.size} · {product.color}</p>
                <p className="text-lg font-bold text-stone-900 mt-2">
                  ${product.price.toLocaleString('es-AR')}
                </p>
              </div>

              <button
                onClick={() => removeFromCart(product.id)}
                className="p-2 text-stone-300 hover:text-red-500 transition-colors self-start"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 sticky top-24">
            <h2 className="font-bold text-stone-900 text-lg mb-6">Resumen</h2>

            <div className="space-y-3 mb-6">
              {cart.items.map(({ product }) => (
                <div key={product.id} className="flex justify-between text-sm">
                  <span className="text-stone-600 truncate mr-2">{product.name}</span>
                  <span className="font-medium text-stone-900 whitespace-nowrap">
                    ${product.price.toLocaleString('es-AR')}
                  </span>
                </div>
              ))}
              <div className="flex justify-between text-sm text-stone-400 pt-2 border-t border-stone-100">
                <span>Envío</span>
                <span>A calcular</span>
              </div>
            </div>

            <div className="flex justify-between font-bold text-stone-900 text-lg mb-6 pt-4 border-t border-stone-200">
              <span>Total</span>
              <span>${cart.total.toLocaleString('es-AR')}</span>
            </div>

            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 bg-stone-900 text-white font-semibold py-4 rounded-2xl hover:bg-amber-700 transition-colors text-sm"
            >
              Continuar con el pago <ArrowRight size={16} />
            </Link>

            <Link
              href="/"
              className="w-full text-center block mt-4 text-sm text-stone-400 hover:text-stone-700 transition-colors"
            >
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
