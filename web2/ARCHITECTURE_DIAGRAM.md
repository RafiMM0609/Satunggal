# 🔐 Authentication System Architecture

## User Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER REGISTRATION FLOW                        │
└─────────────────────────────────────────────────────────────────┘

  User visits /register
         │
         ▼
  ┌─────────────────────┐
  │  Register Page      │
  │ ├─ Username field   │
  │ ├─ Email field      │
  │ ├─ Password field   │
  │ └─ Confirm password │
  └────────┬────────────┘
           │
           ▼
  User submits form
           │
           ▼
  POST /api/auth/register
           │
           ├─ Validate input
           ├─ Check duplicates
           ├─ Hash password
           └─ Create user in DB
           │
           ▼
  ┌──────────────────────┐
  │  Success Response    │
  │  {user object}       │
  └────────┬─────────────┘
           │
           ▼
  Store user in localStorage
           │
           ▼
  Redirect to /


┌─────────────────────────────────────────────────────────────────┐
│                    USER LOGIN FLOW                               │
└─────────────────────────────────────────────────────────────────┘

  User visits /login
         │
         ▼
  ┌─────────────────────┐
  │  Login Page         │
  │ ├─ Username field   │
  │ └─ Password field   │
  └────────┬────────────┘
           │
           ▼
  User submits form
           │
           ▼
  POST /api/auth/login
           │
           ├─ Find user by username
           ├─ Verify password hash
           └─ Return user data
           │
           ▼
  ┌──────────────────────┐
  │  Success Response    │
  │  {user object}       │
  └────────┬─────────────┘
           │
           ▼
  Store user in localStorage
           │
           ▼
  Redirect to /
```

## System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                             │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    Next.js Frontend                          │  │
│  │  ┌────────────┐    ┌──────────────┐                         │  │
│  │  │   /login   │    │  /register   │                         │  │
│  │  │  page.tsx  │    │  page.tsx    │                         │  │
│  │  └─────┬──────┘    └───────┬──────┘                         │  │
│  │        │                   │                                 │  │
│  │        └───────────┬───────┘                                 │  │
│  │                    │                                         │  │
│  │                    ▼                                         │  │
│  │            localStorage (user data)                          │  │
│  └──────────────────────────────────────────────────────────────┘  │
└──────────────────┬─────────────────────────────────────────────────┘
                   │ HTTP Requests
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
   POST /api/auth/login   POST /api/auth/register
   POST /api/jobs         GET  /api/jobs
        │                     │
        └──────────┬──────────┘
                   │
┌──────────────────┴──────────────────────────────────────────────────┐
│                        SERVER (Node.js)                              │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │              Next.js API Routes                               │ │
│  │  ┌───────────────┐  ┌──────────────┐  ┌──────────────────┐  │ │
│  │  │  login/route  │  │register/route│  │  jobs/route      │  │ │
│  │  │  ├─ Validate  │  │ ├─ Validate  │  │  ├─ getAllJobs   │  │ │
│  │  │  ├─ Find user │  │ ├─ Check dup │  │  ├─ createJob    │  │ │
│  │  │  ├─ Verify PW │  │ ├─ Hash PW   │  │  ├─ updateJob    │  │ │
│  │  │  └─ Return    │  │ ├─ Create    │  │  └─ deleteJob    │  │ │
│  │  │                │  │ └─ Return    │  │                  │  │ │
│  │  └────────┬───────┘  └──────┬───────┘  └────────┬─────────┘  │ │
│  │           │                 │                   │            │ │
│  │           └─────────────────┼───────────────────┘            │ │
│  │                             │                                │ │
│  │                             ▼                                │ │
│  │                    lib/db.ts (Database)                      │ │
│  │              ┌─────────────────────────────┐                 │ │
│  │              │  getDb()                    │                 │ │
│  │              │  createUser()               │                 │ │
│  │              │  getUserByUsername()        │                 │ │
│  │              │  verifyPassword()           │                 │ │
│  │              │  getAllJobs()               │                 │ │
│  │              └────────────┬────────────────┘                 │ │
│  │                           │                                  │ │
│  └───────────────────────────┼──────────────────────────────────┘ │
└──────────────────────────────┼──────────────────────────────────────┘
                               │
                               ▼
                        ┌──────────────────┐
                        │   SQLite DB      │
                        │  (data/app.db)   │
                        │                  │
                        │  ┌────────────┐  │
                        │  │ users      │  │
                        │  │ ├─ id      │  │
                        │  │ ├─ username│  │
                        │  │ ├─ email   │  │
                        │  │ └─ password│  │
                        │  └────────────┘  │
                        │                  │
                        │  ┌────────────┐  │
                        │  │ jobs       │  │
                        │  │ ├─ id      │  │
                        │  │ ├─ title   │  │
                        │  │ ├─ status  │  │
                        │  │ └─ ...     │  │
                        │  └────────────┘  │
                        └──────────────────┘
```

## Data Flow - Registration

```
[User Input]
     │
     ▼
┌─────────────────────────┐
│ Validation              │
│ ✓ Username present?     │
│ ✓ Email format valid?   │
│ ✓ Password 6+ chars?    │
│ ✓ Passwords match?      │
└────────────┬────────────┘
             │
             ▼
┌──────────────────────────┐
│ Database Check           │
│ ✓ Username unique?       │
│ ✓ Email unique?          │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│ Password Processing      │
│ Hash with SHA256         │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│ Create User Record       │
│ INSERT INTO users (...)  │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│ Return User Data         │
│ {id, username, email}    │
└────────────┬─────────────┘
             │
             ▼
[Client: localStorage + redirect]
```

## Database Schema

```
┌─────────────────────────────────────────┐
│            USERS TABLE                   │
├─────────────────────────────────────────┤
│ Field       │ Type      │ Constraint    │
├─────────────┼───────────┼───────────────┤
│ id          │ INTEGER   │ PRIMARY KEY   │
│ username    │ TEXT      │ NOT NULL,     │
│             │           │ UNIQUE        │
│ email       │ TEXT      │ NOT NULL,     │
│             │           │ UNIQUE        │
│ password    │ TEXT      │ NOT NULL      │
│ createdAt   │ DATETIME  │ DEFAULT NOW   │
│ updatedAt   │ DATETIME  │ DEFAULT NOW   │
└─────────────────────────────────────────┘
         │                   ▲
         │                   │
    CREATE              UPDATE
    INSERT              SELECT
         │                   │
         └───────┬───────────┘
                 │
         ┌───────▼────────┐
         │   API Routes   │
         │  login/        │
         │  register/     │
         └────────────────┘
```

## Request/Response Example

### Registration Request
```
POST /api/auth/register HTTP/1.1
Host: localhost:3030
Content-Type: application/json
Content-Length: 68

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepass123"
}
```

### Registration Success Response
```
HTTP/1.1 201 Created
Content-Type: application/json

{
  "success": true,
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### Login Request
```
POST /api/auth/login HTTP/1.1
Host: localhost:3030
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securepass123"
}
```

### Login Success Response
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

---

**Architecture:** Client-Server with SQLite Database
**Framework:** Next.js 16 with React 19
**Database:** Better-sqlite3
**Authentication:** Username/Email + Password Hash (SHA256)
**Session:** localStorage (Browser-based)

