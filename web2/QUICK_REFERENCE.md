# 🔐 Authentication System - Quick Reference

## Getting Started

### Step 1: Install & Migrate
```bash
npm install
npm run migrate
```

### Step 2: Run Development Server
```bash
npm run dev
```
Visit: http://localhost:3030

## Access Points

| Page | URL | Purpose |
|------|-----|---------|
| **Login** | `/login` | Sign in with username & password |
| **Register** | `/register` | Create new account with email |
| **Home** | `/` | Main dashboard (requires login data in localStorage) |

## API Endpoints

### 1. Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

**Error Response (409):**
```json
{
  "error": "Username or email already exists"
}
```

---

### 2. Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securepass123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

**Error Response (401):**
```json
{
  "error": "Username or password is incorrect"
}
```

---

## Database

### Tables
- **users** - Authentication and user information
- **jobs** - Job listings (existing feature)

### Location
```
data/app.db
```

### Connection
Automatic via `lib/db.ts` using better-sqlite3

---

## File Locations

| File | Purpose |
|------|---------|
| `app/login/page.tsx` | Login UI component |
| `app/register/page.tsx` | Registration UI component |
| `app/api/auth/login/route.ts` | Login API handler |
| `app/api/auth/register/route.ts` | Registration API handler |
| `lib/db.ts` | Database functions & schemas |
| `scripts/migrate.ts` | Database migration script |

---

## Password Rules

- **Minimum Length:** 6 characters
- **Hashing:** SHA256 algorithm
- **Confirmation:** Required on registration

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:3030/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"test123"}'
```

### Login
```bash
curl -X POST http://localhost:3030/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'
```

---

## Browser Console

After login/registration, check localStorage:
```javascript
console.log(localStorage.getItem('user'))
// Output: {"id":1,"username":"testuser","email":"test@example.com"}
```

Clear session:
```javascript
localStorage.removeItem('user')
```

---

## Common Issues

### Q: Database file not found
**A:** Run `npm run migrate` to create it

### Q: Port 3030 already in use
**A:** Edit `package.json` scripts to use different port

### Q: "Username or email already exists"
**A:** Use unique credentials or check database for existing user

---

## Security Notes

✅ Passwords are hashed before storage
✅ Unique constraints on username & email
✅ Input validation enabled
⚠️  For production: Use bcrypt instead of SHA256
⚠️  For production: Implement JWT tokens instead of localStorage

---

## NPM Scripts

```bash
npm run dev       # Start development server on port 3030
npm run build     # Production build
npm start         # Run production build
npm run migrate   # Initialize/verify database schema
npm run lint      # Run ESLint
```

---

**Need help?** Check `AUTH_DOCUMENTATION.md` for detailed docs
