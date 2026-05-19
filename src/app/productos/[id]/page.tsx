'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Check, ArrowLeft, Truck, Shield } from 'lucide-react';
import { Product } from '@/types';
import { getProductById } from '@/lib/products';
import { useCart } from '@/components/providers/CartProvider';
import toast from 'react-hot-toast';

const conditionLabel: Record<string, string> = {
  nuevo: 'Nuevo',
  'como-nuevo': 'Como nuevo',
  'muy-buen-estado': 'Muy buen estado',
  'buen-estado': 'Buen estado',
};

const categoryLabel: Record<string, string> = {
  remera: 'Remera', camisa: 'Camisa', pantalon: 'Pantalón', jean: 'Jean',
  vestido: 'Vestido', pollera: 'Pollera', shorts: 'Shorts', campera: 'Campera',
  abrigo: 'Abrigo', conjunto: 'Conjunto', calzado: 'Calzado', accesorio: 'Accesorio', otro: 'Otro',
};

const genderLabel: Record<string, string> = {
  mujer: 'Mujer', hombre: 'Hombre', unisex: 'Unisex', nino: 'Niño', nina: 'Niña',
};

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { addToCart, isInCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const inCart = product ? isInCart(product.id) : false;

  useEffect(() => {
    if (!id) return;
    getProductById(id).then((p) => {
      setProduct(p);
      setLoading(false);
    });
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
    toast.success(`"${product.name}" agregado al carrito`);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-[3/4] bg-stone-200 rounded-2xl" />
          <div className="space-y-4 py-4">
            <div className="h-4 bg-stone-200 rounded w-1/3" />
            <div className="h-8 bg-stone-200 rounded w-2/3" />
            <div className="h-6 bg-stone-200 rounded w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="text-4xl mb-4">🔍</p>
        <h2 className="text-xl font-semibold text-stone-800 mb-2">Prenda no encontrada</h2>
        <p className="text-stone-500 mb-6 text-sm">Es posible que ya haya sido vendida.</p>
        <Link href="/" className="text-sm font-semibold text-amber-700 hover:underline">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 mb-8 transition-colors"
      >
        <ArrowLeft size={16} /> Volver
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Images */}
        <div>
          <div className="relative aspect-[3/4] bg-stone-100 rounded-2xl overflow-hidden mb-3">
            {product.images[activeImage] ? (
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === i ? 'border-amber-600' : 'border-transparent'
                  }`}
                >
                  <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <p className="text-xs tracking-widest text-amber-700 font-bold uppercase mb-2">
            {product.brand}
          </p>
          <h1 className="text-3xl font-bold text-stone-900 mb-3">{product.name}</h1>
          <p className="text-4xl font-bold text-stone-900 mb-6">
            ${product.price.toLocaleString('es-AR')}
          </p>

          {/* Attributes */}
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 mb-6 text-sm">
            <div>
              <dt className="text-stone-400 text-xs uppercase tracking-wider mb-0.5">Categoría</dt>
              <dd className="font-medium text-stone-800">{categoryLabel[product.category]}</dd>
            </div>
            <div>
              <dt className="text-stone-400 text-xs uppercase tracking-wider mb-0.5">Género</dt>
              <dd className="font-medium text-stone-800">{genderLabel[product.gender]}</dd>
            </div>
            <div>
              <dt className="text-stone-400 text-xs uppercase tracking-wider mb-0.5">Talle</dt>
              <dd className="font-medium text-stone-800">{product.size}</dd>
            </div>
            <div>
              <dt className="text-stone-400 text-xs uppercase tracking-wider mb-0.5">Color</dt>
              <dd className="font-medium text-stone-800">{product.color}</dd>
            </div>
            <div>
              <dt className="text-stone-400 text-xs uppercase tracking-wider mb-0.5">Condición</dt>
              <dd className="font-medium text-stone-800">{conditionLabel[product.condition]}</dd>
            </div>
            <div>
              <dt className="text-stone-400 text-xs uppercase tracking-wider mb-0.5">Unidades</dt>
              <dd className="font-medium text-stone-800">{product.stock} disponible{product.stock !== 1 ? 's' : ''}</dd>
            </div>
          </dl>

          {product.description && (
            <p className="text-sm text-stone-600 leading-relaxed mb-6 border-t border-stone-100 pt-6">
              {product.description}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={inCart}
              className={`flex-1 flex items-center justify-center gap-2 font-semibold py-4 rounded-2xl transition-all duration-200 ${
                inCart
                  ? 'bg-emerald-50 text-emerald-700 cursor-default'
                  : 'bg-stone-900 text-white hover:bg-amber-700'
              }`}
            >
              {inCart ? (
                <>
                  <Check size={18} /> En carrito
                </>
              ) : (
                <>
                  <ShoppingBag size={18} /> Agregar al carrito
                </>
              )}
            </button>
            {inCart && (
              <Link
                href="/carrito"
                className="flex items-center justify-center gap-2 font-semibold py-4 px-6 rounded-2xl bg-stone-900 text-white hover:bg-amber-700 transition-colors text-sm"
              >
                Ver carrito
              </Link>
            )}
          </div>

          {/* Trust badges */}
          <div className="space-y-3 border-t border-stone-100 pt-6">
            <div className="flex items-center gap-3 text-sm text-stone-600">
              <Truck size={16} className="text-amber-600 flex-shrink-0" />
              <span>Envío por Uber Moto (CABA/GBA) o Correo Argentino</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-stone-600">
              <Shield size={16} className="text-amber-600 flex-shrink-0" />
              <span>Pago seguro a través de MercadoPago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
