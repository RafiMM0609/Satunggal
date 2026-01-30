import Database from 'better-sqlite3';
import path from 'path';
import crypto from 'crypto';

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'data', 'app.db');
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    initializeDatabase();
  }
  return db;
}

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function initializeDatabase() {
  const jobsQuery = db.prepare(`
    SELECT name FROM sqlite_master WHERE type='table' AND name='jobs'
  `);
  
  const usersQuery = db.prepare(`
    SELECT name FROM sqlite_master WHERE type='table' AND name='users'
  `);
  
  if (!jobsQuery.get()) {
    db.exec(`
      CREATE TABLE jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        client TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'open',
        deadline TEXT NOT NULL,
        reward TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT DEFAULT '',
        freelancerId INTEGER,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      INSERT INTO jobs (title, client, status, deadline, reward, category, description) VALUES
        ('Desain Maskot Brand Sereal', 'Sereal Jaya Makmur', 'in_progress', '2 hari lagi', 'Rp 2.500.000', 'Illustration', 'Buat desain maskot yang unik dan menarik'),
        ('Revisi Landing Page UI/UX', 'Startup Kilat', 'revision', 'Besok', 'Rp 1.200.000', 'Web Design', 'Revisi komponen UI berdasarkan feedback'),
        ('Optimasi SEO Artikel Blog', 'Media Sehat', 'pending', 'Selesai', 'Rp 800.000', 'SEO', 'Optimasi 10 artikel dengan keyword lokal'),
        ('Video Animasi Promosi', 'EduKids', 'pending', 'Selesai', 'Rp 4.000.000', 'Motion Graphic', 'Buat video animasi promosi produk'),
        ('Desain Flyer Event', 'Event Organizer Pro', 'open', '5 hari lagi', 'Rp 500.000', 'Graphic Design', 'Desain flyer untuk event besar'),
        ('Coding Website Toko Online', 'Toko Digital', 'open', '10 hari lagi', 'Rp 5.000.000', 'Web Development', 'Develop toko online dengan fitur lengkap');
    `);
  } else {
    const columns = db.prepare('PRAGMA table_info(jobs)').all() as any[];
    const hasDescription = columns.some(col => col.name === 'description');
    const hasFreelancerId = columns.some(col => col.name === 'freelancerId');
    
    if (!hasDescription) {
      db.exec(`ALTER TABLE jobs ADD COLUMN description TEXT DEFAULT '';`);
    }
    
    if (!hasFreelancerId) {
      db.exec(`ALTER TABLE jobs ADD COLUMN freelancerId INTEGER;`);
    }
  }

  if (!usersQuery.get()) {
    db.exec(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'freelancer',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }
}

export interface Job {
  id: number;
  title: string;
  client: string;
  status: 'open' | 'pending' | 'in_progress' | 'done' | 'revision' | 'pending_review' | 'approved' | 'ready_payment' | 'paid';
  deadline: string;
  reward: string;
  category: string;
  description?: string;
  freelancerId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: 'client' | 'freelancer';
  createdAt: string;
  updatedAt: string;
}

export function getAllJobs(): Job[] {
  const query = getDb().prepare('SELECT * FROM jobs ORDER BY createdAt DESC');
  return query.all() as Job[];
}

export function getJobById(id: number): Job | undefined {
  const query = getDb().prepare('SELECT * FROM jobs WHERE id = ?');
  return query.get(id) as Job | undefined;
}

export function updateJobStatus(id: number, status: string): void {
  const query = getDb().prepare('UPDATE jobs SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?');
  query.run(status, id);
}

export function createJob(job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Job {
  const insert = getDb().prepare(
    'INSERT INTO jobs (title, client, status, deadline, reward, category, description) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  const result = insert.run(job.title, job.client, job.status, job.deadline, job.reward, job.category, job.description || '');
  return getJobById(result.lastInsertRowid as number)!;
}

export function updateJob(id: number, job: Partial<Omit<Job, 'id' | 'createdAt' | 'updatedAt'>>): void {
  const fields = [];
  const values = [];
  
  if (job.title !== undefined) {
    fields.push('title = ?');
    values.push(job.title);
  }
  if (job.client !== undefined) {
    fields.push('client = ?');
    values.push(job.client);
  }
  if (job.status !== undefined) {
    fields.push('status = ?');
    values.push(job.status);
  }
  if (job.deadline !== undefined) {
    fields.push('deadline = ?');
    values.push(job.deadline);
  }
  if (job.reward !== undefined) {
    fields.push('reward = ?');
    values.push(job.reward);
  }
  if (job.category !== undefined) {
    fields.push('category = ?');
    values.push(job.category);
  }
  if (job.description !== undefined) {
    fields.push('description = ?');
    values.push(job.description);
  }
  
  if (fields.length === 0) return;
  
  fields.push('updatedAt = CURRENT_TIMESTAMP');
  values.push(id);
  
  const query = getDb().prepare(`UPDATE jobs SET ${fields.join(', ')} WHERE id = ?`);
  query.run(...values);
}

export function deleteJob(id: number): void {
  const query = getDb().prepare('DELETE FROM jobs WHERE id = ?');
  query.run(id);
}

export function takeProject(jobId: number, freelancerId: number): void {
  const query = getDb().prepare('UPDATE jobs SET status = ?, freelancerId = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ? AND status = ?');
  query.run('in_progress', freelancerId, jobId, 'open');
}

// User functions
export function createUser(username: string, email: string, password: string, role: 'client' | 'freelancer' = 'freelancer'): User {
  const hashedPassword = hashPassword(password);
  const insert = getDb().prepare(
    'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)'
  );
  
  try {
    const result = insert.run(username, email, hashedPassword, role);
    return getUserById(result.lastInsertRowid as number)!;
  } catch (error: any) {
    if (error.message.includes('UNIQUE constraint failed')) {
      throw new Error('Username or email already exists');
    }
    throw error;
  }
}

export function getUserByUsername(username: string): User | undefined {
  const query = getDb().prepare('SELECT * FROM users WHERE username = ?');
  return query.get(username) as User | undefined;
}

export function getUserByEmail(email: string): User | undefined {
  const query = getDb().prepare('SELECT * FROM users WHERE email = ?');
  return query.get(email) as User | undefined;
}

export function getUserById(id: number): User | undefined {
  const query = getDb().prepare('SELECT * FROM users WHERE id = ?');
  return query.get(id) as User | undefined;
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
  return hashPassword(password) === hashedPassword;
}

