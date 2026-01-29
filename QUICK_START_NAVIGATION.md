# Quick Start Guide - UI Navigation

## 🚀 Getting Started

### 1. Install & Run
```bash
npm install
npm run dev
```
Server runs on `http://localhost:3030`

### 2. Access Application
- **Home:** http://localhost:3030
  - Redirects to `/login` if not authenticated
  - Redirects to `/dashboard` if authenticated

### 3. Login
Use test credentials (or register new account):
```
Username: freelancer1
Email: freelancer@example.com
Password: (check auth API)
```

## 📍 Navigation Routes

### For Freelancers
```
/dashboard              → Overview & Active Jobs
/dashboard/pekerjaan   → Jobs Management
/dashboard/keuangan    → Earnings & Transactions
/dashboard/profil      → User Profile
```

### For Clients
```
/dashboard            → Project Overview
/dashboard/review     → Job Reviews & Approvals
/dashboard/keuangan   → Project Budget & Payments
/dashboard/profil     → Account Settings
```

### General Routes
```
/login                 → Login page
/register              → User registration
/api/*                 → API endpoints
```

## 🔧 Key Features

### 1. **Persistent Sidebar**
- Always visible on desktop (hidden on mobile)
- Shows active page with blue highlight
- Role-based menu items
- One-click logout

### 2. **Dashboard Pages**
Each page has:
- Search/filter capabilities
- Data tables with actions
- Modal dialogs for details
- Responsive design

### 3. **API Endpoints**

#### Profile Management
```
GET  /api/profile?userId=1        → Get user profile
PUT  /api/profile                 → Update profile
POST /api/profile                 → Create profile
```

#### Transactions
```
GET  /api/transactions?userId=1   → Get transactions
POST /api/transactions            → Create transaction
PUT  /api/transactions            → Update transaction status
```

#### Reviews
```
GET  /api/reviews?status=pending_review     → Get reviews
POST /api/reviews                           → Create review
PUT  /api/reviews                           → Update review (approve/reject)
```

#### Jobs (Existing)
```
GET  /api/jobs                    → Get all jobs
POST /api/jobs                    → Create job
PUT  /api/jobs                    → Update job status
DELETE /api/jobs/[id]             → Delete job
```

## 🎨 Sidebar Menu

The sidebar displays different menus based on user role:

**All Users:**
- Overview (Dashboard home)
- Keuangan (Finance/Transactions)
- Profil Saya (Profile)
- Logout

**Freelancers Only:**
- Pekerjaan (Jobs/Work)

**Clients Only:**
- Review (Review submissions)

## 📊 Dashboard Components

### Overview Page
- Statistics cards (Jobs in progress, pending review, completed)
- Active jobs section with submission buttons
- Pending payments section
- Quick actions

### Jobs Page
- Search by title or client name
- Filter: Open / Completed
- Action buttons: View, Edit, Delete
- Create new job button (clients only)
- Status indicators

### Review Page
- Tabs: Pending / Approved / Revision Requested
- Job details display
- Approve button
- Request revision button with message input
- Transaction tracking

### Finance Page
- Revenue statistics
- Monthly income summary
- Transaction history table
- Withdrawal functionality
- Export/filter options
- Financial tips section

### Profile Page
- User information display
- Editable fields
- Join date
- Security settings
- Password change option

## 🔄 Authentication Flow

```
1. User visits /
   ↓
2. Check localStorage for 'user' data
   ↓
3. If no user → Redirect to /login
   ↓
4. If user exists → Redirect to /dashboard
   ↓
5. All dashboard pages protected by dashboard/layout.tsx
```

## 📝 Common Tasks

### To Navigate Between Pages
```typescript
// Click sidebar items - they use Next.js Link components
// No page reload, smooth navigation
// Active item highlighted in blue
```

### To Fetch Data
```typescript
// Example: Get user profile
const response = await fetch('/api/profile?userId=1');
const profile = await response.json();

// Example: Get transactions
const response = await fetch('/api/transactions?userId=1&type=income');
const transactions = await response.json();
```

### To Update User Data
```typescript
// Example: Update profile
const response = await fetch('/api/profile', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ id: 1, username: 'newname' })
});
const updated = await response.json();
```

## 🛠️ Development

### Add New Page
1. Create folder: `app/dashboard/newpage/`
2. Create file: `page.tsx`
3. Use hooks to fetch data
4. Sidebar automatically includes in layout

### Modify Sidebar
Edit `components/Sidebar.tsx`:
- Add/remove menu items
- Update navigation links
- Change styling

### Add New API
1. Create folder: `app/api/newfeature/`
2. Create file: `route.ts`
3. Export handlers: `GET`, `POST`, `PUT`, `DELETE`

## 📱 Responsive Behavior

- **Desktop:** Full sidebar with text labels
- **Tablet:** Full sidebar visible
- **Mobile:** Sidebar hidden (icons only in header)
- All pages fully responsive

## 🔒 Security Notes

- Authentication checked on layout level
- User data in localStorage (replace with secure token in production)
- API routes are public (add auth middleware in production)

## 🐛 Troubleshooting

### Sidebar Not Showing
- Check if on `/dashboard` or child routes
- Verify user data in localStorage
- Check browser console for errors

### Pages Not Loading
- Verify dev server running on port 3030
- Clear browser cache
- Check network tab in DevTools

### API Not Responding
- Check if endpoint exists in `/app/api/`
- Verify request method (GET/POST/PUT)
- Check request body format for POST/PUT

## 📚 File Structure
```
app/
├── dashboard/layout.tsx          → Persistent layout
├── dashboard/page.tsx            → Overview
├── dashboard/pekerjaan/page.tsx  → Jobs
├── dashboard/review/page.tsx     → Reviews
├── dashboard/keuangan/page.tsx   → Finance
├── dashboard/profil/page.tsx     → Profile
└── api/                          → API endpoints

components/
├── Sidebar.tsx                   → Navigation
└── [Modals]                      → Modal dialogs
```

---

**Build Status:** ✅ Successful
**Dev Server:** ✅ Running on port 3030
**TypeScript:** ✅ No errors
**Routes:** ✅ All configured
