import { NextRequest, NextResponse } from 'next/server';

interface Transaction {
  id: number;
  userId: number;
  jobId: number;
  amount: number;
  type: 'income' | 'withdrawal';
  status: 'pending' | 'completed';
  date: string;
  jobTitle: string;
}

const mockTransactions: Transaction[] = [
  {
    id: 1,
    userId: 1,
    jobId: 1,
    amount: 15000000,
    type: 'income',
    status: 'completed',
    date: '2024-01-25',
    jobTitle: 'Design Website Corporate',
  },
  {
    id: 2,
    userId: 1,
    jobId: 2,
    amount: 5000000,
    type: 'income',
    status: 'pending',
    date: '2024-01-20',
    jobTitle: 'Mobile App Development',
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');

    let filtered = mockTransactions;

    if (userId) {
      filtered = filtered.filter(t => t.userId === parseInt(userId));
    }

    if (type) {
      filtered = filtered.filter(t => t.type === type);
    }

    return NextResponse.json(filtered);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newTransaction: Transaction = {
      id: Math.max(...mockTransactions.map(t => t.id), 0) + 1,
      userId: body.userId,
      jobId: body.jobId,
      amount: body.amount,
      type: body.type,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      jobTitle: body.jobTitle,
    };

    mockTransactions.push(newTransaction);
    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const transaction = mockTransactions.find(t => t.id === body.id);

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    transaction.status = body.status;
    return NextResponse.json(transaction);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}
