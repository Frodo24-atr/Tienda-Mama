'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const IS_DEMO = !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === 'placeholder-project';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push('/panel-sm-9274/dashboard');
      } else {
        toast.error('Contraseña incorrecta');
      }
    } catch {
      toast.error('Error al conectar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-stone-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Panel Administración</h1>
          <p className="text-stone-500 text-sm mt-1">Solano Moda</p>
          {IS_DEMO && (
            <span className="inline-block mt-2 text-xs bg-amber-100 text-amber-800 font-semibold px-3 py-1 rounded-full">
              Modo demo — contraseña: solanomoda2024
            </span>
          )}
        </div>

        <form onSubmit={handleLogin} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-8 space-y-5">
          <div>
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="••••••••"
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 text-white font-semibold py-3.5 rounded-xl hover:bg-amber-700 transition-colors disabled:opacity-60 flex items-center justify-center"
          >
            {loading
              ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
