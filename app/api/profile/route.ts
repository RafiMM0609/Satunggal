import { NextRequest, NextResponse } from 'next/server';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  role: 'freelancer' | 'client';
  joinDate: string;
}

const mockUsers: UserProfile[] = [
  {
    id: 1,
    username: 'freelancer1',
    email: 'freelancer@example.com',
    phone: '+62 812-3456-7890',
    location: 'Jakarta, Indonesia',
    bio: 'Seorang profesional yang passionate',
    role: 'freelancer',
    joinDate: '2024-01-01',
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (userId) {
      const user = mockUsers.find(u => u.id === parseInt(userId));
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(user);
    }

    return NextResponse.json(mockUsers);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const user = mockUsers.find(u => u.id === body.id);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    Object.assign(user, body);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newUser: UserProfile = {
      id: Math.max(...mockUsers.map(u => u.id), 0) + 1,
      username: body.username,
      email: body.email,
      phone: body.phone || '',
      location: body.location || '',
      bio: body.bio || '',
      role: body.role || 'freelancer',
      joinDate: new Date().toISOString().split('T')[0],
    };

    mockUsers.push(newUser);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    );
  }
}
