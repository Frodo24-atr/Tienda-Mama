'use client';

import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { Filters } from '@/types';

const categories = [
  { value: '', label: 'Todas' },
  { value: 'remera', label: 'Remera' },
  { value: 'camisa', label: 'Camisa' },
  { value: 'pantalon', label: 'Pantalón' },
  { value: 'jean', label: 'Jean' },
  { value: 'vestido', label: 'Vestido' },
  { value: 'pollera', label: 'Pollera' },
  { value: 'shorts', label: 'Shorts' },
  { value: 'campera', label: 'Campera' },
  { value: 'abrigo', label: 'Abrigo' },
  { value: 'conjunto', label: 'Conjunto' },
  { value: 'calzado', label: 'Calzado' },
  { value: 'accesorio', label: 'Accesorio' },
  { value: 'otro', label: 'Otro' },
];

const genders = [
  { value: '', label: 'Todos' },
  { value: 'mujer', label: 'Mujer' },
  { value: 'hombre', label: 'Hombre' },
  { value: 'unisex', label: 'Unisex' },
  { value: 'nino', label: 'Niño' },
  { value: 'nina', label: 'Niña' },
];

const sizes = [
  '', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL',
  '34', '36', '38', '40', '42', '44', '46',
  '35', '37', '39', '41', 'unico',
];

const conditions = [
  { value: '', label: 'Todos' },
  { value: 'nuevo', label: 'Nuevo' },
  { value: 'como-nuevo', label: 'Como nuevo' },
  { value: 'muy-buen-estado', label: 'Muy buen estado' },
  { value: 'buen-estado', label: 'Buen estado' },
];

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
}

export default function ProductFilters({ filters, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const update = (key: keyof Filters, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const hasActive =
    filters.category || filters.gender || filters.size || filters.condition ||
    filters.minPrice || filters.maxPrice;

  const clear = () =>
    onChange({ category: '', gender: '', size: '', condition: '', minPrice: '', maxPrice: '', search: filters.search });

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-5 py-4 text-sm font-semibold text-stone-800"
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-amber-700" />
          Filtros
          {hasActive && (
            <span className="bg-amber-700 text-white text-[10px] font-bold rounded-full px-2 py-0.5">
              activos
            </span>
          )}
        </span>
        <span className="text-stone-400 text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="border-t border-stone-100 px-5 py-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-4">
          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-2">
              Categoría
            </label>
            <select
              value={filters.category}
              onChange={(e) => update('category', e.target.value)}
              className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-stone-50"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-2">
              Género
            </label>
            <select
              value={filters.gender}
              onChange={(e) => update('gender', e.target.value)}
              className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-stone-50"
            >
              {genders.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>

          {/* Size */}
          <div>
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-2">
              Talle
            </label>
            <select
              value={filters.size}
              onChange={(e) => update('size', e.target.value)}
              className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-stone-50"
            >
              {sizes.map((s) => (
                <option key={s} value={s}>{s || 'Todos'}</option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div>
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-2">
              Condición
            </label>
            <select
              value={filters.condition}
              onChange={(e) => update('condition', e.target.value)}
              className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-stone-50"
            >
              {conditions.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Price range */}
          <div className="col-span-2 lg:col-span-1">
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-2">
              Precio
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => update('minPrice', e.target.value)}
                className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-stone-50"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => update('maxPrice', e.target.value)}
                className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-stone-50"
              />
            </div>
          </div>

          {hasActive && (
            <button
              onClick={clear}
              className="flex items-center gap-1 text-xs text-stone-500 hover:text-red-600 transition-colors col-span-2 lg:col-span-1"
            >
              <X size={12} /> Limpiar filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
}
