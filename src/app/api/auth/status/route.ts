import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token');

  if (accessToken) {
    // In a real application, you would validate the token with your backend
    // For now, we'll assume a token means authenticated.
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
      });

      if (response.ok) {
        const user = await response.json();
        return NextResponse.json({ isAuthenticated: true, user });
      } else {
        // Token might be expired or invalid, clear it
        const cookieStoreForDelete = await cookies();
        cookieStoreForDelete.delete('access_token');
        return NextResponse.json({ isAuthenticated: false }, { status: 401 });
      }
    } catch (error) {
      console.error('Error validating token with backend:', error);
      const cookieStoreForDelete = await cookies();
      cookieStoreForDelete.delete('access_token');
      return NextResponse.json({ isAuthenticated: false }, { status: 500 });
    }
  } else {
    return NextResponse.json({ isAuthenticated: false });
  }
}
