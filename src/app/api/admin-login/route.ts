import { NextResponse } from 'next/server';

const IS_DEMO = !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === 'placeholder-project';

export async function POST(req: Request) {
  const { password } = await req.json();
  const expected = IS_DEMO ? 'solanomoda2024' : process.env.ADMIN_PASSWORD;

  if (!password || password !== expected) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set('solano-session', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
  return res;
}
