import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <p className="text-white font-bold tracking-[0.15em] uppercase text-lg mb-1">Solano Moda</p>
            <p className="text-xs tracking-widest text-amber-600 uppercase mb-4">Indumentaria</p>
            <p className="text-sm leading-relaxed">Prendas seleccionadas con estilo. Nuevas y usadas en perfecto estado.</p>
          </div>
          <div>
            <p className="text-white font-semibold mb-4 text-sm tracking-wide uppercase">Navegación</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-amber-500 transition-colors">Inicio</Link></li>
              <li><Link href="/?gender=mujer" className="hover:text-amber-500 transition-colors">Mujer</Link></li>
              <li><Link href="/?gender=hombre" className="hover:text-amber-500 transition-colors">Hombre</Link></li>
              <li><Link href="/envios" className="hover:text-amber-500 transition-colors">Envíos</Link></li>
              <li><Link href="/carrito" className="hover:text-amber-500 transition-colors">Carrito</Link></li>
              <li><Link href="/seguimiento" className="hover:text-amber-500 transition-colors">Mi pedido</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-white font-semibold mb-4 text-sm tracking-wide uppercase">Contacto</p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MessageCircle size={16} className="text-amber-600" />
                <a href="https://wa.me/5491100000000" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors">WhatsApp</a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-600">📸</span>
                <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors">Instagram</a>
              </li>
            </ul>
            <p className="mt-6 text-xs text-stone-600">Solano, Buenos Aires, Argentina</p>
          </div>
        </div>
        <div className="border-t border-stone-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-stone-600">
          <p>© {new Date().getFullYear()} Solano Moda. Todos los derechos reservados.</p>
          <Link href="/admin" className="hover:text-stone-400 transition-colors">·</Link>
        </div>
      </div>
    </footer>
  );
}
