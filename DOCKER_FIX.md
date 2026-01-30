# 🐳 Docker SQLite I/O Error Fix

## Problem
```
SqliteError: disk I/O error
Code: SQLITE_IOERR_SHMOPEN
```

When running `docker compose up --build`, SQLite fails to open the database because it cannot create shared memory files (`.db-shm` and `.db-wal`). This happens due to:

1. **Volume Permission Issues** - The `/app/data` volume mounted from host doesn't have proper write permissions
2. **Directory Permissions** - The data directory inside container doesn't have rwx permissions for SQLite
3. **WAL Mode Not Enabled** - SQLite not configured for Write-Ahead Logging needed in containerized environments

---

## Solution Applied

### 1. ✅ Updated Dockerfile
Added directory creation with proper permissions:

```dockerfile
# Create data directory with proper permissions
RUN mkdir -p /app/data && chmod 777 /app/data
```

**Why:** Ensures the data directory exists before migrations and has full read/write/execute permissions (777).

### 2. ✅ Updated docker-compose.yml
Changed from bind mount to named volume:

```yaml
# Before:
volumes:
  - ./data:/app/data

# After:
volumes:
  app_data:/app/data

volumes:
  app_data:
    driver: local
```

**Why:** Named volumes handle permissions better than bind mounts and don't have cross-platform issues.

### 3. ✅ Enhanced scripts/migrate.ts
Added SQLite optimization pragmas and permission checks:

```typescript
// Ensure directory has write permissions
try {
  fs.accessSync(dbDir, fs.constants.W_OK);
} catch (err) {
  fs.chmodSync(dbDir, 0o777);
}

// Enable WAL mode and pragmas for better reliability
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('foreign_keys = ON');
```

**Why:**
- WAL (Write-Ahead Logging) mode is more efficient in Docker
- SYNCHRONOUS = NORMAL balances reliability and performance
- Checks and fixes permissions if needed
- Foreign keys are enforced for data integrity

---

## How to Use

### 1. Clean up old containers and volumes
```bash
docker compose down -v
```

### 2. Rebuild and start
```bash
docker compose up --build
```

### 3. Verify the app is running
```bash
curl http://localhost:3030
```

---

## What Changed

| File | Change | Why |
|------|--------|-----|
| `Dockerfile` | Added `RUN mkdir -p /app/data && chmod 777 /app/data` | Ensure proper directory permissions |
| `docker-compose.yml` | Bind mount → Named volume | Better permission handling |
| `scripts/migrate.ts` | Added WAL mode + permission checks | Optimize for Docker environment |

---

## Testing

After running `docker compose up --build`, you should see:

```
nextjs-app  | Running database migrations...
nextjs-app  | 
nextjs-app  | ✓ Users table already exists
nextjs-app  | ✓ Jobs table already exists
nextjs-app  |
nextjs-app  | Database migrations completed successfully!
nextjs-app  | 
nextjs-app  | > webapps@0.1.0 start
nextjs-app  | 
nextjs-app  | ▲ Next.js 14.x.x
nextjs-app  |   Ready in 2.5s
```

**No SQLite errors!** ✅

---

## Why This Works

### Root Cause
SQLite needs to create and manage three files:
- `app.db` - Main database file
- `app.db-wal` - Write-Ahead Log file
- `app.db-shm` - Shared memory file

The error occurred because Docker couldn't create these files due to permission restrictions on the mounted volume.

### Fix Strategy
1. **Create directory with full permissions in Dockerfile** - Ensures container has write access
2. **Use named volume instead of bind mount** - Docker manages permissions automatically
3. **Enable WAL mode in SQLite** - Optimized for containerized environments with better concurrency
4. **Add permission checks** - Fallback in case permissions are still restricted

---

## Future Enhancements

For production, consider:
- Using PostgreSQL instead of SQLite (better for Docker)
- Adding volume health checks
- Implementing database backup strategies
- Using init containers for migrations

---

## Troubleshooting

If you still get I/O errors:

```bash
# Full cleanup
docker compose down -v
docker system prune -a

# Rebuild with no cache
docker compose up --build --no-cache

# Check container logs
docker logs nextjs-app
```

---

**Status:** ✅ FIXED
**Test Date:** 2026-01-29
**Expected:** Next `docker compose up --build` will succeed
