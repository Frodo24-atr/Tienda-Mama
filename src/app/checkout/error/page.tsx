import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center px-4">
      <XCircle size={72} className="text-red-400 mb-6" />
      <h1 className="text-3xl font-bold text-stone-900 mb-3">El pago no se pudo procesar</h1>
      <p className="text-stone-500 mb-8 max-w-sm">
        Hubo un problema con tu pago. No se realizó ningún cargo. Podés intentarlo de nuevo.
      </p>
      <div className="flex gap-4">
        <Link
          href="/carrito"
          className="inline-flex items-center bg-stone-900 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-amber-700 transition-colors text-sm"
        >
          Volver al carrito
        </Link>
        <a
          href="https://wa.me/5491100000000"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center bg-green-500 text-white font-semibold px-6 py-3.5 rounded-full hover:bg-green-400 transition-colors text-sm"
        >
          Contactar por WhatsApp
        </a>
      </div>
    </div>
  );
}
