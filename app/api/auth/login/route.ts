import { NextRequest, NextResponse } from 'next/server';
import { getUserByUsername, getUserByEmail, verifyPassword } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Try to find user by username or email
    let user = getUserByUsername(username);
    if (!user) {
      user = getUserByEmail(username);
    }

    if (!user) {
      return NextResponse.json({ error: 'Username/email or password is incorrect' }, { status: 401 });
    }

    const isPasswordValid = verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Username/email or password is incorrect' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error: any) {
    console.error('Error logging in:', error);
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
  }
}
