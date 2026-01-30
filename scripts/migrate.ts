#!/usr/bin/env node

import Database from 'better-sqlite3';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';

const dbDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dbDir, 'app.db');

// Create data directory if it doesn't exist with proper permissions
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true, mode: 0o777 });
}

// Ensure directory has write permissions
try {
  fs.accessSync(dbDir, fs.constants.W_OK);
} catch (err) {
  fs.chmodSync(dbDir, 0o777);
}

// Open database with settings optimized for WAL mode
const db = new Database(dbPath);

// Enable WAL mode and pragmas for better reliability
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('foreign_keys = ON');

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
      role TEXT NOT NULL DEFAULT 'freelancer',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✓ Users table created\n');
} else {
  console.log('✓ Users table already exists');

  // Check if role column exists, if not add it
  const roleColumnExists = db.prepare(`
    PRAGMA table_info(users);
  `).all().some((col: any) => col.name === 'role');

  if (!roleColumnExists) {
    console.log('  Adding missing role column...');
    db.exec(`ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'freelancer';`);
    console.log('  ✓ Role column added');
  }
  console.log();
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

// Create payments table if it doesn't exist
const paymentsTableExists = db.prepare(`
  SELECT name FROM sqlite_master WHERE type='table' AND name='payments'
`).get();

if (!paymentsTableExists) {
  console.log('Creating payments table...');
  db.exec(`
    CREATE TABLE payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      projectId INTEGER NOT NULL,
      clientId INTEGER NOT NULL,
      freelancerId INTEGER NOT NULL,
      amount TEXT NOT NULL,
      walletAddress TEXT,
      status TEXT NOT NULL DEFAULT 'completed',
      paymentMethod TEXT DEFAULT 'wallet',
      transactionHash TEXT,
      notes TEXT DEFAULT '',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(projectId) REFERENCES jobs(id)
    );
  `);
  console.log('✓ Payments table created\n');
} else {
  console.log('✓ Payments table already exists\n');
}

console.log('Database migrations completed successfully!');
db.close();
