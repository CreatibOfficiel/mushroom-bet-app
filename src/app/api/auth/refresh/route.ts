import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get('refreshToken'); // Assuming you'll also store a refresh token

  if (!refreshToken) {
    return NextResponse.json({ message: 'No refresh token found' }, { status: 401 });
  }

  try {
    // Call your backend's token refresh endpoint
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: refreshToken.value }),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      // If refresh fails, clear tokens and force re-login
      cookies().delete('accessToken');
      cookies().delete('refreshToken');
      return NextResponse.json({ message: errorData.message || 'Failed to refresh token' }, { status: backendResponse.status });
    }

    const { accessToken, newRefreshToken } = await backendResponse.json();

    // Update access token cookie
    cookies().set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    // Update refresh token cookie if a new one is provided
    if (newRefreshToken) {
      cookies().set('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 30, // 1 month for refresh token
        path: '/',
      });
    }

    return NextResponse.json({ message: 'Token refreshed successfully' });
  } catch (error) {
    console.error('Token refresh API error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
