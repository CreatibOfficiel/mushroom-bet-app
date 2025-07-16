import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    // In a real application, you would call your backend authentication API here.
    // For now, we'll simulate a successful login.
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json({ message: errorData.message || 'Authentication failed' }, { status: backendResponse.status });
    }

    const { accessToken, user } = await backendResponse.json();

    // Set the Http-Only cookie
    cookies().set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return NextResponse.json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
