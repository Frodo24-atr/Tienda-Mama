import { NextRequest, NextResponse } from 'next/server';
import { createOrder, detectShippingZone } from '@/lib/orders';
import { decrementStock } from '@/lib/products';
import { CartItem, ShippingInfo } from '@/types';

// MercadoPago IPN/Webhook
// Configurálo en: https://www.mercadopago.com.ar/developers/panel/app
// URL a registrar: https://tudominio.com/api/mp-webhook
// Tipo: Merchant Orders o Payments

const MP_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type, data } = body;

  if (type !== 'payment') {
    return NextResponse.json({ ok: true });
  }

  if (!MP_ACCESS_TOKEN) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  try {
    const paymentId = data?.id;
    if (!paymentId) return NextResponse.json({ ok: true });

    // Fetch payment details from MercadoPago
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
    });
    const payment = await mpRes.json();

    if (payment.status !== 'approved') {
      return NextResponse.json({ ok: true });
    }

    // Extract metadata stored during checkout preference creation
    const meta = payment.metadata ?? {};
    const items: CartItem[] = JSON.parse(meta.items ?? '[]');
    const shipping: ShippingInfo = {
      name: payment.payer?.first_name ?? meta.buyer_name ?? '',
      email: payment.payer?.email ?? '',
      phone: meta.buyer_phone ?? payment.payer?.phone?.number ?? '',
      address: payment.payer?.address?.street_name ?? '',
      city: payment.payer?.address?.city ?? meta.shipping_city ?? '',
      province: meta.shipping_province ?? '',
      postalCode: payment.payer?.address?.zip_code ?? '',
      shippingMethod: meta.shipping_method ?? 'correo-argentino',
      notes: meta.buyer_notes ?? '',
    };

    const zone = detectShippingZone(shipping.city, shipping.province);

    // Create order in Firestore
    const orderId = await createOrder({
      items,
      total: payment.transaction_amount,
      buyer: {
        name: shipping.name,
        email: shipping.email.toLowerCase(),
        phone: shipping.phone,
        address: shipping.address,
        city: shipping.city,
        province: shipping.province,
        postalCode: shipping.postalCode,
      },
      shippingMethod: shipping.shippingMethod as 'uber-moto' | 'correo-argentino',
      shippingZone: zone,
      status: 'confirmed',
      trackingInfo: '',
      paymentId: String(paymentId),
      notes: shipping.notes,
    });

    // Decrement stock for each product
    for (const { product } of items) {
      try {
        await decrementStock(product.id, product.stock);
      } catch {
        // Don't fail the webhook if stock update fails
      }
    }

    console.log(`Order ${orderId} created — payment ${paymentId}`);
    return NextResponse.json({ ok: true, orderId });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'webhook ok' });
}
