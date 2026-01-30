import { NextRequest, NextResponse } from 'next/server';
import { getJobById, updateJob, deleteJob, takeProject } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const job = getJobById(parseInt(id));

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    updateJob(parseInt(id), body);
    const job = getJobById(parseInt(id));

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    deleteJob(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { action, freelancerId } = await request.json();
    const jobId = parseInt(id);

    if (action === 'take') {
      if (!freelancerId) {
        return NextResponse.json({ error: 'Freelancer ID is required' }, { status: 400 });
      }
      
      const job = getJobById(jobId);
      if (!job) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 });
      }
      
      const takeable = job.status === 'open' || job.status === 'revision_requested';
      if (!takeable) {
        return NextResponse.json({ error: 'Project must have open or revision_requested status to be taken' }, { status: 400 });
      }
      
      takeProject(jobId, freelancerId);
      const updatedJob = getJobById(jobId);
      return NextResponse.json(updatedJob);
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('Error processing job action:', error);
    return NextResponse.json({ error: 'Failed to process action' }, { status: 500 });
  }
}
