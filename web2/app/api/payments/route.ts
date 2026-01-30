import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

interface Payment {
  id: number;
  projectId: number;
  clientId: number;
  freelancerId: number;
  amount: string;
  walletAddress?: string;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  transactionHash?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const clientId = searchParams.get('clientId');
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status');

    const db = getDb();

    let query = `
      SELECT p.*, j.title as projectTitle, j.reward as projectReward
      FROM payments p
      LEFT JOIN jobs j ON p.projectId = j.id
      WHERE 1=1
    `;

    if (clientId) {
      query += ` AND p.clientId = ${parseInt(clientId)}`;
    }

    if (projectId) {
      query += ` AND p.projectId = ${parseInt(projectId)}`;
    }

    if (status) {
      query += ` AND p.status = '${status}'`;
    }

    query += ` ORDER BY p.createdAt DESC`;

    const payments = db.prepare(query).all();
    return NextResponse.json(payments);
  } catch (error) {
    console.error('Failed to fetch payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      projectId,
      clientId,
      freelancerId,
      amount,
      walletAddress,
      paymentMethod = 'wallet',
      notes = '',
    } = body;

    // Validate required fields
    if (!projectId || !clientId || !freelancerId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = getDb();

    // Insert payment record
    const result = db
      .prepare(
        `
      INSERT INTO payments (projectId, clientId, freelancerId, amount, walletAddress, status, paymentMethod, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `
      )
      .run(
        projectId,
        clientId,
        freelancerId,
        amount,
        walletAddress || null,
        'completed',
        paymentMethod,
        notes
      );

    // Update project status to 'paid'
    db.prepare(`UPDATE jobs SET status = 'paid' WHERE id = ?`).run(projectId);

    const payment = db.prepare(`SELECT * FROM payments WHERE id = ?`).get(result.lastInsertRowid) as Payment;

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('Failed to create payment:', error);
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, transactionHash } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    const db = getDb();

    // Update payment status
    if (status) {
      db.prepare(`UPDATE payments SET status = ? WHERE id = ?`).run(status, id);
    }

    // Update transaction hash if provided
    if (transactionHash) {
      db.prepare(`UPDATE payments SET transactionHash = ? WHERE id = ?`).run(
        transactionHash,
        id
      );
    }

    const payment = db.prepare(`SELECT * FROM payments WHERE id = ?`).get(id) as Payment;

    return NextResponse.json(payment);
  } catch (error) {
    console.error('Failed to update payment:', error);
    return NextResponse.json(
      { error: 'Failed to update payment' },
      { status: 500 }
    );
  }
}
