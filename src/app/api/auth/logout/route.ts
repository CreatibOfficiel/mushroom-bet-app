import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  cookies().delete('accessToken');
  cookies().delete('refreshToken');

  return NextResponse.json({ message: 'Logged out successfully' });
}
