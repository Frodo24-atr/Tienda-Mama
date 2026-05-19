import { Bike, Package, MapPin, Clock, DollarSign, Phone } from 'lucide-react';

export default function EnviosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-14">
        <p className="text-xs tracking-[0.3em] text-amber-700 font-semibold uppercase mb-3">Información</p>
        <h1 className="text-4xl font-bold text-stone-900 mb-4">Envíos</h1>
        <p className="text-stone-500 text-lg max-w-xl mx-auto">
          Llegamos a donde estés. Conocé nuestras opciones de envío.
        </p>
      </div>

      {/* Shipping options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Uber Moto */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-8">
          <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-5">
            <Bike size={28} className="text-amber-700" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 mb-2">Uber Moto</h2>
          <p className="text-stone-500 text-sm mb-5 leading-relaxed">
            La opción más rápida para CABA y Gran Buenos Aires. El pedido sale el mismo día en muchos casos.
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <span className="text-stone-700">CABA y Gran Buenos Aires</span>
            </li>
            <li className="flex items-start gap-3">
              <Clock size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <span className="text-stone-700">Entrega el mismo día o al siguiente hábil</span>
            </li>
            <li className="flex items-start gap-3">
              <DollarSign size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <span className="text-stone-700">El costo lo abona el comprador directamente en la app</span>
            </li>
          </ul>
          <div className="mt-6 bg-amber-50 rounded-xl p-3 text-xs text-amber-800">
            Una vez confirmado el pago, te enviamos los datos para coordinar el Uber Moto.
          </div>
        </div>

        {/* Correo Argentino */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-8">
          <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center mb-5">
            <Package size={28} className="text-stone-600" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 mb-2">Correo Argentino / Agencia</h2>
          <p className="text-stone-500 text-sm mb-5 leading-relaxed">
            Para envíos al interior del país. Coordinamos la agencia más conveniente según tu zona.
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={16} className="text-stone-500 mt-0.5 flex-shrink-0" />
              <span className="text-stone-700">Todo el país</span>
            </li>
            <li className="flex items-start gap-3">
              <Clock size={16} className="text-stone-500 mt-0.5 flex-shrink-0" />
              <span className="text-stone-700">2 a 7 días hábiles según distancia</span>
            </li>
            <li className="flex items-start gap-3">
              <DollarSign size={16} className="text-stone-500 mt-0.5 flex-shrink-0" />
              <span className="text-stone-700">El costo varía por distancia y peso — te avisamos el total</span>
            </li>
          </ul>
          <div className="mt-6 bg-stone-50 rounded-xl p-3 text-xs text-stone-600">
            Coordinamos el envío por WhatsApp una vez confirmado el pago.
          </div>
        </div>
      </div>

      {/* Process */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-8 mb-8">
        <h2 className="text-xl font-bold text-stone-900 mb-6">¿Cómo funciona?</h2>
        <div className="space-y-5">
          {[
            { n: '01', title: 'Elegís tu prenda', desc: 'Navegá el catálogo, filtrá por lo que necesitás y agregá al carrito.' },
            { n: '02', title: 'Completás el checkout', desc: 'Ingresás tus datos de envío y elegís el método de entrega.' },
            { n: '03', title: 'Pagás con MercadoPago', desc: 'Pago único, seguro. No aceptamos pagos en cuotas.' },
            { n: '04', title: 'Te contactamos', desc: 'Una vez confirmado el pago, te escribimos por WhatsApp para coordinar el envío.' },
            { n: '05', title: 'Recibís tu prenda', desc: '¡Listo! Tu compra llega a tu puerta.' },
          ].map((step) => (
            <div key={step.n} className="flex gap-5">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-amber-700">{step.n}</span>
              </div>
              <div>
                <p className="font-semibold text-stone-900 text-sm mb-0.5">{step.title}</p>
                <p className="text-sm text-stone-500">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 rounded-2xl p-8 text-white text-center">
        <Phone size={28} className="text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">¿Tenés alguna duda?</h2>
        <p className="text-stone-300 text-sm mb-6">
          Contactános por WhatsApp y te respondemos a la brevedad.
        </p>
        <a
          href="https://wa.me/5491100000000"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold px-8 py-3.5 rounded-full transition-colors text-sm"
        >
          Escribínos al WhatsApp
        </a>
      </div>
    </div>
  );
}
