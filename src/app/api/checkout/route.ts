import { NextRequest, NextResponse } from 'next/server';
import { CartItem, ShippingInfo } from '@/types';

// MercadoPago checkout API
// Documentación: https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/landing
//
// Para activar pagos reales:
// 1. Creá una cuenta en mercadopago.com.ar
// 2. Obtené tus credenciales en: https://www.mercadopago.com.ar/developers/panel/app
// 3. Completá MERCADOPAGO_ACCESS_TOKEN en tu .env.local
// 4. Cambiá las URLs de back_urls por las de tu dominio real

const MP_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

export async function POST(req: NextRequest) {
  if (!MP_ACCESS_TOKEN) {
    return NextResponse.json(
      { error: 'MercadoPago no configurado. Agregá MERCADOPAGO_ACCESS_TOKEN al .env.local' },
      { status: 503 }
    );
  }

  const body = await req.json() as { items: CartItem[]; shipping: ShippingInfo };
  const { items, shipping } = body;

  const preference = {
    items: items.map(({ product, quantity }) => ({
      id: product.id,
      title: `${product.brand} - ${product.name}`,
      quantity,
      unit_price: product.price,
      currency_id: 'ARS',
      picture_url: product.images[0] ?? undefined,
      description: `Talle: ${product.size} | Color: ${product.color}`,
    })),
    payer: {
      name: shipping.name,
      email: shipping.email,
      phone: { number: shipping.phone },
      address: {
        street_name: shipping.address,
        city: shipping.city,
        zip_code: shipping.postalCode,
      },
    },
    back_urls: {
      success: `${BASE_URL}/checkout/exito`,
      failure: `${BASE_URL}/checkout/error`,
      pending: `${BASE_URL}/checkout/pendiente`,
    },
    auto_return: 'approved',
    // No installments — solo pago único
    payment_methods: {
      installments: 1,
    },
    statement_descriptor: 'Solano Moda',
    external_reference: `${Date.now()}-${shipping.email}`,
    metadata: {
      shipping_method: shipping.shippingMethod,
      shipping_city: shipping.city,
      shipping_province: shipping.province,
      buyer_phone: shipping.phone,
      buyer_notes: shipping.notes,
    },
  };

  try {
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(preference),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('MercadoPago error:', error);
      return NextResponse.json({ error: 'Error al crear preferencia de pago' }, { status: 502 });
    }

    const data = await response.json();
    return NextResponse.json({ init_point: data.init_point, id: data.id });
  } catch (err) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
