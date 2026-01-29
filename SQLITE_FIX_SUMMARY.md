# SQLite Database Schema Fix

## Problem
The application was failing with the error:
```
SqliteError: table users has no column named role
```

This occurred because the migration script (`scripts/migrate.ts`) was creating the `users` table without the `role` column, while the application code (`lib/db.ts`) expected the `role` column to exist.

## Root Cause
- The migration script had an outdated schema definition for the `users` table
- It was missing the `role` column that the application requires
- Existing databases with the old schema would cause registration failures

## Solution
Updated `scripts/migrate.ts` to:

1. **Add `role` column to new tables**: When creating a fresh `users` table, the schema now includes:
   ```sql
   role TEXT NOT NULL DEFAULT 'freelancer'
   ```

2. **Migrate existing databases**: Added automatic migration logic that:
   - Detects if the `role` column exists using `PRAGMA table_info(users)`
   - If missing, adds the column with `ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'freelancer'`
   - This is idempotent - it only runs if the column is missing

## Changes Made
- **File**: `scripts/migrate.ts`
- **Changes**:
  - Added `role TEXT NOT NULL DEFAULT 'freelancer'` to users table creation (line 33)
  - Added migration check for existing databases to add the missing `role` column if needed (lines 42-50)

## How It Works in Docker
The Dockerfile already runs migrations at startup:
```dockerfile
CMD ["sh", "-c", "npm run migrate && npm start"]
```

This ensures:
1. On first deployment: Fresh database is created with correct schema
2. On subsequent deployments: Existing databases are automatically upgraded with missing columns
3. No manual database intervention needed

## Testing
The migration script was tested successfully:
- ✅ Creates users table with role column on fresh database
- ✅ Database migration runs without errors
- ✅ Compatible with existing Docker build process

## No Breaking Changes
- Existing applications will auto-migrate on next startup
- New deployments get the correct schema immediately
- Default role is 'freelancer' for backward compatibility
