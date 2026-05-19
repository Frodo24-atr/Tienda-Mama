import Link from 'next/link';
import { Clock } from 'lucide-react';

export default function PendientePage() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center px-4">
      <Clock size={72} className="text-amber-400 mb-6" />
      <h1 className="text-3xl font-bold text-stone-900 mb-3">Pago pendiente</h1>
      <p className="text-stone-500 mb-4 max-w-sm">
        Tu pago está siendo procesado. Una vez confirmado, te contactamos para coordinar el envío.
      </p>
      <p className="text-xs text-stone-400 mb-8">
        Revisá tu email o la app de MercadoPago para el estado del pago.
      </p>
      <Link
        href="/"
        className="inline-flex items-center bg-stone-900 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-amber-700 transition-colors text-sm"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
