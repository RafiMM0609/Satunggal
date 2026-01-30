import { NextRequest, NextResponse } from 'next/server';
import { getAllJobs, createJob } from '@/lib/db';

export async function GET() {
  try {
    const projects = getAllJobs();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, client, status, deadline, reward, category, description, userId, userRole } = body;

    if (!title || !client || !status || !deadline || !reward || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (userRole === 'freelancer') {
      return NextResponse.json({ error: 'Freelancers cannot create projects' }, { status: 403 });
    }

    const project = createJob({
      title,
      client,
      status,
      deadline,
      reward,
      category,
      description
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
