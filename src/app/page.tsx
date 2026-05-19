'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/Filters';
import { Product, Filters } from '@/types';
import { getProducts } from '@/lib/products';

const defaultFilters: Filters = {
  category: '',
  gender: '',
  size: '',
  condition: '',
  minPrice: '',
  maxPrice: '',
  search: '',
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProducts(filters);
      setProducts(data);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_70%_30%,#b8956a,transparent_50%)]" />
        <div className="relative max-w-2xl mx-auto">
          <p className="text-amber-500 text-xs tracking-[0.4em] uppercase font-semibold mb-4">
            Solano, Buenos Aires
          </p>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-4">
            Solano Moda
          </h1>
          <p className="text-stone-300 text-lg mb-8 leading-relaxed">
            Indumentaria nueva y seleccionada con estilo.<br />
            Cada prenda tiene historia.
          </p>
          <a
            href="#catalogo"
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-200 text-sm tracking-wide"
          >
            Ver catálogo
            <ChevronRight size={16} />
          </a>
        </div>
      </section>

      {/* Category pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[
            { label: 'Todo', gender: '', category: '' },
            { label: 'Mujer', gender: 'mujer', category: '' },
            { label: 'Hombre', gender: 'hombre', category: '' },
            { label: 'Niños', gender: 'nino', category: '' },
            { label: 'Remeras', gender: '', category: 'remera' },
            { label: 'Jeans', gender: '', category: 'jean' },
            { label: 'Vestidos', gender: '', category: 'vestido' },
            { label: 'Camperas', gender: '', category: 'campera' },
            { label: 'Accesorios', gender: '', category: 'accesorio' },
          ].map((pill) => (
            <button
              key={pill.label}
              onClick={() =>
                setFilters({ ...defaultFilters, gender: pill.gender, category: pill.category })
              }
              className={`whitespace-nowrap text-sm font-medium px-5 py-2 rounded-full border transition-all duration-150 flex-shrink-0 ${
                filters.gender === pill.gender && filters.category === pill.category && !filters.search
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-amber-400'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </section>

      {/* Main catalog */}
      <section id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="relative mb-4">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Buscar prenda, marca..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-9 pr-4 py-3 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
              />
            </div>
            <ProductFilters filters={filters} onChange={setFilters} />
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-stone-500">
                {loading
                  ? 'Cargando...'
                  : `${products.length} prenda${products.length !== 1 ? 's' : ''} disponible${products.length !== 1 ? 's' : ''}`}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                    <div className="aspect-[3/4] bg-stone-200" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-stone-200 rounded w-1/2" />
                      <div className="h-4 bg-stone-200 rounded w-3/4" />
                      <div className="h-3 bg-stone-200 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-6xl mb-4">👗</div>
                <h3 className="text-xl font-semibold text-stone-800 mb-2">
                  No hay prendas disponibles
                </h3>
                <p className="text-stone-500 text-sm max-w-xs">
                  No encontramos prendas con esos filtros. Probá con otros criterios.
                </p>
                <button
                  onClick={() => setFilters(defaultFilters)}
                  className="mt-6 text-sm font-semibold text-amber-700 hover:underline"
                >
                  Ver todo el catálogo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Envíos banner */}
      <section className="bg-amber-50 border-y border-amber-100 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-stone-900 mb-3">Enviamos a todo el país</h2>
          <p className="text-stone-600 mb-6">
            Envíos por Uber Moto en CABA y GBA, y Correo Argentino para el interior.
          </p>
          <Link
            href="/envios"
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-800 transition-colors"
          >
            Ver más sobre envíos <ChevronRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
