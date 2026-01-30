# Authentication System Documentation

## Overview
This project includes a complete authentication system with login and registration functionality using SQLite as the database.

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Jobs Table (Existing)
The jobs table has been preserved as-is for existing functionality.

## Setup & Migration

### Run Database Migration
To initialize the database tables (users and jobs), run:

```bash
npm run migrate
```

This script will:
- Create the `data` directory if it doesn't exist
- Create the `users` table with proper indexes
- Create the `jobs` table with sample data
- Display the migration status

The database file will be created at `data/app.db` using SQLite.

## Features

### Login Page (`/login`)
- Username and password authentication
- Minimal validation
- Redirects to home page on successful login
- User data stored in localStorage

**Endpoint:** `POST /api/auth/login`
```json
Request:
{
  "username": "string",
  "password": "string"
}

Response (Success):
{
  "success": true,
  "user": {
    "id": number,
    "username": "string",
    "email": "string"
  }
}

Response (Error):
{
  "error": "Username or password is incorrect"
}
```

### Register Page (`/register`)
- Username, email, and password registration
- Password confirmation validation
- Minimum 6 character password requirement
- Prevents duplicate usernames and emails
- Redirects to home page on successful registration
- User data stored in localStorage

**Endpoint:** `POST /api/auth/register`
```json
Request:
{
  "username": "string",
  "email": "string",
  "password": "string"
}

Response (Success):
{
  "success": true,
  "user": {
    "id": number,
    "username": "string",
    "email": "string"
  }
}

Response (Error - Duplicate):
{
  "error": "Username or email already exists"
}

Response (Error - Invalid):
{
  "error": "Password must be at least 6 characters"
}
```

## Security

- **Password Hashing:** Passwords are hashed using SHA256 before storage
- **Input Validation:** Basic validation on username, email, and password
- **Unique Constraints:** Username and email are enforced as unique in the database
- **Error Messages:** Generic error messages for security (doesn't reveal if username/email exists)

## File Structure

```
app/
├── login/
│   └── page.tsx           # Login page component
├── register/
│   └── page.tsx           # Register page component
├── api/auth/
│   ├── login/
│   │   └── route.ts       # Login API endpoint
│   └── register/
│       └── route.ts       # Register API endpoint
├── api/jobs/
│   └── route.ts           # Existing jobs API
└── page.tsx               # Home page

lib/
└── db.ts                  # Database functions and schemas

scripts/
└── migrate.ts             # Database migration script
```

## Usage

### Start Development Server
```bash
npm run dev
```
The application will run on `http://localhost:3030`

### Build for Production
```bash
npm run build
npm start
```

## Testing the Authentication Flow

1. **Register a new user:**
   - Go to http://localhost:3030/register
   - Fill in username, email, and password
   - Click "Register"

2. **Login with credentials:**
   - Go to http://localhost:3030/login
   - Enter username and password
   - Click "Login"

3. **View stored user data:**
   - After login/register, user data is stored in localStorage
   - Check browser DevTools → Application → Local Storage

## API Examples

### Register
```bash
curl -X POST http://localhost:3030/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3030/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123"
  }'
```

## Database File Location

The SQLite database is stored at:
```
data/app.db
```

This directory is automatically created when the migration script runs.

## Dependencies

- **better-sqlite3:** Synchronous SQLite3 database library
- **crypto:** Built-in Node.js module for password hashing
- **Next.js:** React framework for the application

## Notes

- Passwords are hashed with SHA256 (suitable for development/demo purposes)
- For production, consider using bcrypt or argon2
- User data in localStorage should be cleared on logout (implement logout functionality as needed)
- HTTPS is recommended for production deployments
- Implement token-based authentication (JWT) for better security in production

