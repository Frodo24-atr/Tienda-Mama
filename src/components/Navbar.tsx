'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { useCart } from './providers/CartProvider';

export default function Navbar() {
  const { cart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const itemCount = cart.items.length;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none">
            <span className="text-xl font-bold tracking-[0.15em] text-stone-900 uppercase">
              Solano & Co.
            </span>
            <span className="text-[10px] tracking-[0.2em] text-amber-700 uppercase font-medium">
              Indumentaria
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm tracking-wide text-stone-700 hover:text-amber-700 transition-colors">
              Inicio
            </Link>
            <Link href="/?category=mujer" className="text-sm tracking-wide text-stone-700 hover:text-amber-700 transition-colors">
              Mujer
            </Link>
            <Link href="/?category=hombre" className="text-sm tracking-wide text-stone-700 hover:text-amber-700 transition-colors">
              Hombre
            </Link>
            <Link href="/envios" className="text-sm tracking-wide text-stone-700 hover:text-amber-700 transition-colors">
              Envíos
            </Link>
            <Link href="/seguimiento" className="text-sm tracking-wide text-stone-700 hover:text-amber-700 transition-colors">
              Mi pedido
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/carrito" className="relative p-2 text-stone-700 hover:text-amber-700 transition-colors">
              <ShoppingBag size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-700 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              className="md:hidden p-2 text-stone-700"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-stone-50 border-t border-stone-200 px-4 py-4 flex flex-col gap-4">
          <Link href="/" onClick={() => setMenuOpen(false)} className="text-sm tracking-wide text-stone-700">Inicio</Link>
          <Link href="/?gender=mujer" onClick={() => setMenuOpen(false)} className="text-sm tracking-wide text-stone-700">Mujer</Link>
          <Link href="/?gender=hombre" onClick={() => setMenuOpen(false)} className="text-sm tracking-wide text-stone-700">Hombre</Link>
          <Link href="/envios" onClick={() => setMenuOpen(false)} className="text-sm tracking-wide text-stone-700">Envíos</Link>
          <Link href="/seguimiento" onClick={() => setMenuOpen(false)} className="text-sm tracking-wide text-stone-700">Mi pedido</Link>
          <Link href="/carrito" onClick={() => setMenuOpen(false)} className="text-sm tracking-wide text-stone-700">Carrito ({itemCount})</Link>
        </div>
      )}
    </header>
  );
}
