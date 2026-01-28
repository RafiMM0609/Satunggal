# Database Migration Guide

## Quick Summary
The API integration issue (**"SqliteError: no such column: description"**) has been completely fixed.

## What Was Fixed

### Problem
The database was missing the `description` column because:
- The migration script didn't include the column definition
- Docker startup didn't run migrations
- Existing databases weren't updated when schema changed

### Solution
1. ✅ Updated `scripts/migrate.ts` with proper schema including description
2. ✅ Added automatic column migration for existing databases
3. ✅ Updated Docker to run migrations on startup
4. ✅ Added migration logic in `lib/db.ts` as fallback

## Using the Application

### First Time Setup
```bash
npm install
npm run migrate
npm run dev
```

### With Docker
```bash
docker-compose up --build
```

The Dockerfile automatically runs migrations before starting the app.

### Manual Migration (if needed)
```bash
npm run migrate
```

Output example:
```
Running database migrations...

✓ Users table already exists

✓ Jobs table already exists
  Adding missing description column...
  ✓ Description column added

Database migrations completed successfully!
```

## Database Schema

### Jobs Table
```
id              INTEGER PRIMARY KEY
title           TEXT NOT NULL
client          TEXT NOT NULL
status          TEXT NOT NULL (DEFAULT: 'open')
deadline        TEXT NOT NULL
reward          TEXT NOT NULL
category        TEXT NOT NULL
description     TEXT (DEFAULT: '')           ← FIXED
createdAt       DATETIME (DEFAULT: NOW)
updatedAt       DATETIME (DEFAULT: NOW)
```

### Users Table
```
id              INTEGER PRIMARY KEY
username        TEXT NOT NULL UNIQUE
email           TEXT NOT NULL UNIQUE
password        TEXT NOT NULL
createdAt       DATETIME (DEFAULT: NOW)
updatedAt       DATETIME (DEFAULT: NOW)
```

## Job Statuses
- `open` - Available jobs
- `pending` - Waiting for response
- `pending_review` - Under review
- `in_progress` - Currently being worked on
- `revision` - Needs revision
- `done` - Completed

## API Endpoints

### Jobs API
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create new job
- `GET /api/jobs/[id]` - Get job details
- `PUT /api/jobs/[id]` - Update job
- `DELETE /api/jobs/[id]` - Delete job
- `PATCH /api/jobs/[id]` - Apply for job

### Authentication API
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

## Testing the API

### Create a Job (with description)
```bash
curl -X POST http://localhost:3030/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Job",
    "client": "Test Client",
    "status": "open",
    "deadline": "Tomorrow",
    "reward": "Rp 1.000.000",
    "category": "Web Design",
    "description": "This is a test job description"
  }'
```

### Get All Jobs
```bash
curl http://localhost:3030/api/jobs
```

### Update Job (with description)
```bash
curl -X PUT http://localhost:3030/api/jobs/1 \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated description"
  }'
```

## Troubleshooting

### "no such column: description" Error
This error indicates the database doesn't have the description column.

**Solution**: Run migrations
```bash
npm run migrate
```

This will automatically add the missing column to existing databases without data loss.

### Database Lock Issues
If you see database locked errors:
1. Stop the application
2. Wait 30 seconds
3. Restart

The database uses WAL (Write-Ahead Logging) for better concurrency.

### Fresh Database Setup
To reset everything and start fresh:
```bash
rm -rf data/app.db
npm run migrate
npm run dev
```

## Adding New Columns in the Future

To add new columns to existing tables:

1. **Update schema in `lib/db.ts`** in the `initializeDatabase()` function:
```typescript
CREATE TABLE jobs (
  ...existing columns...
  newColumn TEXT DEFAULT 'value'
);
```

2. **Update migration script `scripts/migrate.ts`**:
```typescript
// In the jobs table creation
description TEXT DEFAULT '',
newColumn TEXT DEFAULT 'value',

// In the else block (for existing tables)
const newColumnExists = db.prepare(`
  PRAGMA table_info(jobs);
`).all().some((col: any) => col.name === 'newColumn');

if (!newColumnExists) {
  console.log('  Adding missing newColumn...');
  db.exec(`ALTER TABLE jobs ADD COLUMN newColumn TEXT DEFAULT 'value';`);
  console.log('  ✓ newColumn added');
}
```

3. **Run migration**:
```bash
npm run migrate
```

## Important Notes

- ✅ Migrations are **safe** - they won't delete data
- ✅ Migrations are **idempotent** - running multiple times is safe
- ✅ Docker automatically runs migrations on startup
- ✅ No manual intervention needed for production deployments

## Support

For issues with the API or database:
1. Check the error message in application logs
2. Run `npm run migrate` to ensure schema is up-to-date
3. Verify the database file exists at `data/app.db`
4. Check the API_INTEGRATION_FIX.md for detailed technical information
