# Navigation & API Quick Reference Card

## 🎯 Routes at a Glance

```
HOME ROUTES
/                  → Redirects to /login (if not auth) or /dashboard
/login            → User login page
/register         → User registration page

DASHBOARD ROUTES (All have persistent sidebar)
/dashboard              → Overview & Active Jobs
/dashboard/pekerjaan   → Jobs Management (Freelancer)
/dashboard/review      → Job Reviews (Client)
/dashboard/keuangan    → Financial Management
/dashboard/profil      → User Profile & Settings

API ROUTES
/api/auth/login       → User authentication
/api/auth/register    → User registration
/api/jobs             → Job management
/api/jobs/[id]        → Single job operations
/api/profile          → User profile management
/api/transactions     → Finance & transactions
/api/reviews          → Job reviews
```

---

## 🔌 API Quick Commands

### Profile
```bash
# Get profile
curl http://localhost:3030/api/profile?userId=1

# Update profile  
curl -X PUT http://localhost:3030/api/profile \
  -H "Content-Type: application/json" \
  -d '{"id":1,"username":"newname"}'

# Create profile
curl -X POST http://localhost:3030/api/profile \
  -H "Content-Type: application/json" \
  -d '{"username":"user","email":"user@test.com","role":"freelancer"}'
```

### Transactions
```bash
# Get income transactions
curl http://localhost:3030/api/transactions?userId=1&type=income

# Create transaction
curl -X POST http://localhost:3030/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"jobId":1,"amount":1000000,"type":"income"}'

# Update transaction status
curl -X PUT http://localhost:3030/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"id":1,"status":"completed"}'
```

### Reviews
```bash
# Get pending reviews
curl http://localhost:3030/api/reviews?status=pending_review

# Get client reviews
curl http://localhost:3030/api/reviews?clientId=2

# Create review
curl -X POST http://localhost:3030/api/reviews \
  -H "Content-Type: application/json" \
  -d '{"jobId":1,"clientId":2,"freelancerId":1,"jobTitle":"Project"}'

# Approve review
curl -X PUT http://localhost:3030/api/reviews \
  -H "Content-Type: application/json" \
  -d '{"id":1,"status":"approved","rating":5,"comment":"Great!"}'
```

---

## 📊 UI Components Cheat Sheet

### Sidebar Menu Items
```typescript
Overview          (All users)
Pekerjaan        (Freelancer only)
Review           (Client only)
Keuangan         (All users)
Profil Saya      (All users)
Logout           (All users)
```

### Page Features

**Overview**
- Stats cards (Jobs, Pending, Completed)
- Active jobs list
- Pending payments

**Jobs Page**
- Search bar
- Status filters
- Create button
- Action buttons: View, Edit, Delete
- Modal dialogs

**Review Page**
- Status tabs
- Search box
- Approve/Reject buttons
- Revision request modal

**Finance Page**
- Revenue cards
- Transaction table
- Filter/Export buttons
- Withdrawal button

**Profile Page**
- User info display
- Editable fields
- Security section
- Edit/Save buttons

---

## 🔄 Component Props

### Sidebar
```typescript
interface SidebarProps {
  user: { role: 'freelancer' | 'client', username: string }
  onLogout: () => void
}
```

### JobDetailModal
```typescript
interface JobDetailModalProps {
  job: Job | null
  isOpen?: boolean              // Optional now
  onClose: () => void
  onApply?: (jobId: number) => void  // Optional now
}
```

### AddEditJobModal
```typescript
interface AddEditJobModalProps {
  job: Job | null
  isOpen?: boolean              // Optional now
  onClose: () => void
  onSubmit?: (job: any) => void  // Optional now
  onSave?: (job: Job) => void    // New prop
}
```

### RevisionRequestModal
```typescript
interface RevisionRequestModalProps {
  isOpen?: boolean              // Optional now
  projectTitle?: string
  job?: Job                     // Can use job instead
  onClose: () => void
  onSubmit: (message: string) => void
}
```

---

## 🎯 Common Use Cases

### Navigate Between Pages (Client)
```typescript
// From any page, click sidebar:
// Overview → view stats
// Review → see job submissions  
// Keuangan → check earnings
// Profil Saya → edit profile
```

### Create New Job (Client)
```
1. Go to /dashboard/pekerjaan
2. Click "Tambah Pekerjaan"
3. Fill form in modal
4. Click "Simpan"
```

### Review Submission (Client)
```
1. Go to /dashboard/review
2. Click on "Menunggu Review" tab
3. Click "Setujui" or "Minta Revisi"
4. If revising, add message and submit
```

### Check Earnings (Freelancer)
```
1. Go to /dashboard/keuangan
2. View stats at top
3. Check transaction history
4. Click "Tarik Dana" to withdraw
```

### Update Profile (All)
```
1. Go to /dashboard/profil
2. Click "Edit Profil"
3. Update fields
4. Click "Simpan"
```

---

## 🚀 Development Commands

```bash
# Install dependencies
npm install

# Start dev server (port 3030)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## 📱 Responsive Breakpoints

```
Mobile    < 768px   → Sidebar icons only
Tablet    768-1024  → Full sidebar
Desktop   > 1024    → Full sidebar + content
```

---

## 🔐 Auth Flow

```
User visits /
  ↓
Check localStorage['user']
  ↓
No user? → Redirect to /login
  ↓
Has user? → Redirect to /dashboard
  ↓
Login → Save user to localStorage
  ↓
Logout → Remove from localStorage
```

---

## ⚙️ Environment & Config

```javascript
// Development
- Port: 3030
- URL: http://localhost:3030
- Browser: Auto-refresh on changes

// Files
- .env.local → Environment variables
- next.config.ts → Next.js configuration
- tsconfig.json → TypeScript config
- package.json → Dependencies & scripts
```

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Sidebar not showing | Check if on /dashboard route |
| Page not loading | Clear cache, check console |
| API 404 | Verify endpoint exists in /api/ |
| Auth fails | Check localStorage for 'user' key |
| Styles broken | Clear .next folder, rebuild |

---

## 📦 Tech Stack

```
Frontend: Next.js 16.1.6
Language: TypeScript
UI Components: React 19.2.3
Icons: Lucide React
Styling: Tailwind CSS
Database: SQLite (with better-sqlite3)
```

---

## 🎨 Colors Used

```
Primary:   Blue (#3b82f6)
Secondary: Amber (#f59e0b)
Success:   Emerald (#10b981)
Error:     Rose (#f43f5e)
Neutral:   Slate (#64748b)
```

---

## 📏 Spacing System

```
xs: 4px (0.25rem)
sm: 8px (0.5rem)
md: 16px (1rem)
lg: 24px (1.5rem)
xl: 32px (2rem)
2xl: 48px (3rem)
```

---

## 🔗 File Locations

```
Components:  ./components/*.tsx
Pages:       ./app/dashboard/*/page.tsx
APIs:        ./app/api/*/route.ts
Styles:      ./app/globals.css
Config:      ./package.json, ./tsconfig.json
```

---

## ⭐ Key Features Summary

✨ **Persistent Sidebar** - Always visible on desktop
🔒 **Protected Routes** - Auth check on layout
📱 **Responsive** - Works on all devices
🎯 **Role-Based** - Different views for users
⚡ **Fast** - Next.js optimization
📊 **Data-Ready** - API endpoints configured
🎨 **Styled** - Tailwind CSS design system
♿ **Accessible** - Semantic HTML, ARIA labels

---

## 🆘 Quick Help

Need help? Check these in order:
1. `QUICK_START_NAVIGATION.md` - Getting started guide
2. `UI_NAVIGATION_SUMMARY.md` - Technical details
3. `IMPLEMENTATION_COMPLETE_NAVIGATION.md` - Full documentation
4. Browser DevTools Console - Error messages
5. Source code comments - Implementation details

---

**Last Updated:** 2024-01-29
**Status:** ✅ Production Ready
