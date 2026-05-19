'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';

export default function ExitoPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="flex flex-col items-center justify-center py-32 text-center px-4">
      <CheckCircle size={72} className="text-emerald-500 mb-6" />
      <h1 className="text-3xl font-bold text-stone-900 mb-3">¡Compra realizada!</h1>
      <p className="text-stone-500 mb-4 max-w-sm">
        Tu pago fue procesado con éxito. En breve te contactamos por WhatsApp para coordinar el envío.
      </p>
      <p className="text-xs text-stone-400 mb-8">
        Revisá tu email para el comprobante de MercadoPago.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-stone-900 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-amber-700 transition-colors text-sm"
      >
        Seguir comprando
      </Link>
    </div>
  );
}
