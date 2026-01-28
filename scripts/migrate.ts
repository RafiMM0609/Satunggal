#!/usr/bin/env node

import Database from 'better-sqlite3';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';

const dbDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dbDir, 'app.db');

// Create data directory if it doesn't exist
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

console.log('Running database migrations...\n');

// Create users table
const usersTableExists = db.prepare(`
  SELECT name FROM sqlite_master WHERE type='table' AND name='users'
`).get();

if (!usersTableExists) {
  console.log('Creating users table...');
  db.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✓ Users table created\n');
} else {
  console.log('✓ Users table already exists\n');
}

// Create jobs table if it doesn't exist
const jobsTableExists = db.prepare(`
  SELECT name FROM sqlite_master WHERE type='table' AND name='jobs'
`).get();

if (!jobsTableExists) {
  console.log('Creating jobs table...');
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
  console.log('✓ Jobs table created\n');
} else {
  console.log('✓ Jobs table already exists');
  
  // Check if description column exists, if not add it
  const descriptionColumnExists = db.prepare(`
    PRAGMA table_info(jobs);
  `).all().some((col: any) => col.name === 'description');
  
  if (!descriptionColumnExists) {
    console.log('  Adding missing description column...');
    db.exec(`ALTER TABLE jobs ADD COLUMN description TEXT DEFAULT '';`);
    console.log('  ✓ Description column added');
  }
  console.log();
}

console.log('Database migrations completed successfully!');
db.close();
