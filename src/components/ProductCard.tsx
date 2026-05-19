'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Check } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from './providers/CartProvider';

const conditionLabel: Record<string, string> = {
  nuevo: 'Nuevo',
  'como-nuevo': 'Como nuevo',
  'muy-buen-estado': 'Muy buen estado',
  'buen-estado': 'Buen estado',
};

const conditionColor: Record<string, string> = {
  nuevo: 'bg-emerald-100 text-emerald-800',
  'como-nuevo': 'bg-sky-100 text-sky-800',
  'muy-buen-estado': 'bg-amber-100 text-amber-800',
  'buen-estado': 'bg-stone-100 text-stone-700',
};

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(product.id);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-stone-100">
      <Link href={`/productos/${product.id}`} className="block relative">
        <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <span className={`absolute top-3 left-3 text-[10px] font-semibold px-2 py-1 rounded-full tracking-wide ${conditionColor[product.condition]}`}>
            {conditionLabel[product.condition]}
          </span>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/productos/${product.id}`}>
          <p className="text-[11px] text-amber-700 font-semibold tracking-widest uppercase mb-1">{product.brand}</p>
          <h3 className="text-stone-900 font-medium text-sm leading-tight mb-1 line-clamp-2">{product.name}</h3>
          <p className="text-xs text-stone-400 mb-3">Talle: {product.size} · {product.color}</p>
        </Link>

        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-stone-900">
            ${product.price.toLocaleString('es-AR')}
          </p>
          <button
            onClick={() => !inCart && addToCart(product)}
            disabled={inCart}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all duration-200 ${
              inCart
                ? 'bg-emerald-50 text-emerald-700 cursor-default'
                : 'bg-stone-900 text-white hover:bg-amber-700'
            }`}
          >
            {inCart ? (
              <>
                <Check size={13} />
                En carrito
              </>
            ) : (
              <>
                <ShoppingBag size={13} />
                Agregar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
