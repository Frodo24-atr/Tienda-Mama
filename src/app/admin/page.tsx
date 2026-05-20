'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Lock, FlaskConical } from 'lucide-react';
import toast from 'react-hot-toast';

const IS_DEMO = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === 'placeholder-project' ||
  !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

const DEMO_PASSWORD = 'solanomoda2024';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (IS_DEMO) {
        // Modo demo: contraseña fija para pruebas locales
        if (password === DEMO_PASSWORD) {
          sessionStorage.setItem('demo-admin', '1');
          router.push('/admin/dashboard');
        } else {
          toast.error(`Contraseña demo incorrecta. Usá: ${DEMO_PASSWORD}`);
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        localStorage.setItem('solano-admin', '1');
        router.push('/admin/dashboard');
      }
    } catch {
      toast.error('Email o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  const enterDemo = () => {
    sessionStorage.setItem('demo-admin', '1');
    router.push('/admin/dashboard');
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
              Modo demo — Firebase no configurado
            </span>
          )}
        </div>

        <form onSubmit={handleLogin} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-8 space-y-5">
          {!IS_DEMO && (
            <div>
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="tu@email.com"
              />
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1.5">
              {IS_DEMO ? 'Contraseña demo' : 'Contraseña'}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder={IS_DEMO ? 'solanomoda2024' : '••••••••'}
            />
            {IS_DEMO && (
              <p className="text-xs text-stone-400 mt-1">
                Contraseña de prueba: <code className="bg-stone-100 px-1 rounded">solanomoda2024</code>
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 text-white font-semibold py-3.5 rounded-xl hover:bg-amber-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              'Ingresar'
            )}
          </button>

          {IS_DEMO && (
            <button
              type="button"
              onClick={enterDemo}
              className="w-full flex items-center justify-center gap-2 border border-stone-200 text-stone-600 font-medium py-3 rounded-xl hover:bg-stone-50 transition-colors text-sm"
            >
              <FlaskConical size={15} />
              Entrar directo al demo
            </button>
          )}
        </form>

        {IS_DEMO && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
            <strong>Modo demo activo.</strong> Los cambios no se guardan. Configurá Firebase para activar el admin real.
          </div>
        )}
      </div>
    </div>
  );
}
