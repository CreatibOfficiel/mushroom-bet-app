import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken');

  if (accessToken) {
    // In a real application, you would validate the token with your backend
    // For now, we'll assume a token means authenticated.
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken.value}`,
        },
      });

      if (response.ok) {
        const user = await response.json();
        return NextResponse.json({ isAuthenticated: true, user });
      } else {
        // Token might be expired or invalid, clear it
        cookies().delete('accessToken');
        return NextResponse.json({ isAuthenticated: false }, { status: 401 });
      }
    } catch (error) {
      console.error('Error validating token with backend:', error);
      cookies().delete('accessToken');
      return NextResponse.json({ isAuthenticated: false }, { status: 500 });
    }
  } else {
    return NextResponse.json({ isAuthenticated: false });
  }
}
