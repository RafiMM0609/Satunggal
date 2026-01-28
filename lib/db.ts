import Database from 'better-sqlite3';
import path from 'path';

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

function initializeDatabase() {
  const query = db.prepare(`
    SELECT name FROM sqlite_master WHERE type='table' AND name='jobs'
  `);
  
  if (!query.get()) {
    db.exec(`
      CREATE TABLE jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        client TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'in_progress',
        deadline TEXT NOT NULL,
        reward TEXT NOT NULL,
        category TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      INSERT INTO jobs (title, client, status, deadline, reward, category) VALUES
        ('Desain Maskot Brand Sereal', 'Sereal Jaya Makmur', 'in_progress', '2 hari lagi', 'Rp 2.500.000', 'Illustration'),
        ('Revisi Landing Page UI/UX', 'Startup Kilat', 'revision', 'Besok', 'Rp 1.200.000', 'Web Design'),
        ('Optimasi SEO Artikel Blog', 'Media Sehat', 'pending_review', 'Selesai', 'Rp 800.000', 'SEO'),
        ('Video Animasi Promosi', 'EduKids', 'pending_review', 'Selesai', 'Rp 4.000.000', 'Motion Graphic');
    `);
  }
}

export interface Job {
  id: number;
  title: string;
  client: string;
  status: 'in_progress' | 'revision' | 'pending_review' | 'done';
  deadline: string;
  reward: string;
  category: string;
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
    'INSERT INTO jobs (title, client, status, deadline, reward, category) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const result = insert.run(job.title, job.client, job.status, job.deadline, job.reward, job.category);
  return getJobById(result.lastInsertRowid as number)!;
}
