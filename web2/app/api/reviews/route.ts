import { NextRequest, NextResponse } from 'next/server';

interface Review {
  id: number;
  jobId: number;
  clientId: number;
  freelancerId: number;
  jobTitle: string;
  status: 'pending_review' | 'approved' | 'revision_requested';
  submittedAt: string;
  revisionMessage?: string;
  rating?: number;
  comment?: string;
}

const mockReviews: Review[] = [
  {
    id: 1,
    jobId: 1,
    clientId: 2,
    freelancerId: 1,
    jobTitle: 'Design Website Corporate',
    status: 'pending_review',
    submittedAt: '2024-01-25',
  },
  {
    id: 2,
    jobId: 2,
    clientId: 2,
    freelancerId: 1,
    jobTitle: 'Mobile App Development',
    status: 'approved',
    submittedAt: '2024-01-20',
    rating: 5,
    comment: 'Excellent work!',
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const clientId = searchParams.get('clientId');
    const freelancerId = searchParams.get('freelancerId');

    let filtered = mockReviews;

    if (status) {
      filtered = filtered.filter(r => r.status === status);
    }

    if (clientId) {
      filtered = filtered.filter(r => r.clientId === parseInt(clientId));
    }

    if (freelancerId) {
      filtered = filtered.filter(r => r.freelancerId === parseInt(freelancerId));
    }

    return NextResponse.json(filtered);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newReview: Review = {
      id: Math.max(...mockReviews.map(r => r.id), 0) + 1,
      jobId: body.jobId,
      clientId: body.clientId,
      freelancerId: body.freelancerId,
      jobTitle: body.jobTitle,
      status: 'pending_review',
      submittedAt: new Date().toISOString().split('T')[0],
    };

    mockReviews.push(newReview);
    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const review = mockReviews.find(r => r.id === body.id);

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    review.status = body.status || review.status;
    review.revisionMessage = body.revisionMessage || review.revisionMessage;
    review.rating = body.rating || review.rating;
    review.comment = body.comment || review.comment;

    return NextResponse.json(review);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    );
  }
}
