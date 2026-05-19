import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/components/providers/CartProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });

export const metadata: Metadata = {
  title: 'Solano Moda | Indumentaria',
  description: 'Tienda de indumentaria nueva y seleccionada. Encontrá tu estilo en Solano Moda.',
  keywords: 'ropa, indumentaria, moda, solano, comprar ropa online, ropa usada, ropa nueva',
  openGraph: {
    title: 'Solano Moda | Indumentaria',
    description: 'Tienda de indumentaria nueva y seleccionada.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-stone-50">
        <CartProvider>
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
          <Toaster
            position="bottom-right"
            toastOptions={{ style: { background: '#1c1c1c', color: '#fff', borderRadius: '12px', fontSize: '13px' } }}
          />
        </CartProvider>
      </body>
    </html>
  );
}
