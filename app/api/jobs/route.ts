import { NextRequest, NextResponse } from 'next/server';
import { getAllJobs, updateJobStatus, createJob, updateJob, deleteJob, applyForJob } from '@/lib/db';

export async function GET() {
  try {
    const jobs = getAllJobs();
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { jobId, status } = await request.json();

    if (!jobId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    updateJobStatus(jobId, status);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, client, status, deadline, reward, category, description } = body;

    if (!title || !client || !status || !deadline || !reward || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const job = createJob({
      title,
      client,
      status,
      deadline,
      reward,
      category,
      description
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}
