import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    // In a real application, you would call your backend registration API here.
    // For now, we'll simulate a successful registration.
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json({ message: errorData.message || 'Registration failed' }, { status: backendResponse.status });
    }

    return NextResponse.json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
