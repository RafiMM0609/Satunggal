# Take Project Feature - Flow Verification

## Feature: Freelancer takes a project with "open" status

### Happy Path Flow

1. **Freelancer Navigation**
   - Freelancer logs in
   - Navigates to "Pekerjaan" (Jobs) section
   - Sees list of available jobs with "open" status

2. **View Job Details**
   - Clicks "Lihat" (View) button on a job card
   - JobDetailModal opens showing:
     - Job title, client, deadline, reward
     - Category and description
     - Status badge showing "Terbuka" (Open)
     - "Ambil Project" (Take Project) button

3. **Take Project Action**
   - Clicks "Ambil Project" button
   - Client component (`Pekerjaan.tsx`):
     - Calls `handleTakeProject(jobId)`
     - Extracts user ID from localStorage
     - Calls API hook: `takeProject(jobId, userId)`
   
4. **API Request**
   - Method: PATCH `/api/jobs/{id}`
   - Body: `{ action: "take", freelancerId: 1 }`
   - Route Handler (`app/api/jobs/[id]/route.ts`):
     - Validates action === "take"
     - Validates freelancerId provided
     - Gets job from database
     - Validates job exists
     - Validates job.status === "open"

5. **Database Update**
   - Function (`lib/db.ts`): `takeProject(jobId, freelancerId)`
   - SQL Query:
     ```sql
     UPDATE jobs 
     SET status = 'in_progress', 
         freelancerId = 1, 
         updatedAt = CURRENT_TIMESTAMP 
     WHERE id = ? AND status = 'open'
     ```

6. **Success Response**
   - API returns updated job object
   - Status changed to "in_progress"
   - freelancerId set to 1
   - Modal closes
   - Job list refreshes
   - User sees success message

### Error Handling

#### Missing Freelancer ID
```
Request: { action: "take" }
Response: 400 - { error: "Freelancer ID is required" }
```

#### Job Not Found
```
Request: { action: "take", freelancerId: 1 }
Response: 404 - { error: "Job not found" }
```

#### Job Already Taken
```
Request: { action: "take", freelancerId: 2 }
Job Status: "in_progress"
Response: 400 - { error: "Project must have open status to be taken" }
```

### UI States

#### Button States
- **Idle**: "Ambil Project" - Blue background, clickable
- **Loading**: "Mengambil Project..." - Gray background, disabled
- **Error**: Button remains visible, error message displayed

#### Modal States
- **With Job**: Show all details + action button
- **Loading**: Button disabled, text updating
- **Error**: Error message in red box
- **Success**: Modal closes automatically

### Data Flow Diagram

```
Pekerjaan Component
    ↓
handleTakeProject(jobId)
    ↓
useProjectAPI Hook
    ↓
takeProject(jobId, freelancerId)
    ↓
PATCH /api/jobs/[id]
    ↓
app/api/jobs/[id]/route.ts
    ↓
Validation Checks
  - freelancerId exists
  - job exists
  - job.status === "open"
    ↓
lib/db.ts - takeProject()
    ↓
Database Update
    ↓
Return Updated Job
    ↓
Update UI (jobs state)
    ↓
Show Success Message
    ↓
Close Modal
```

## Key Guarantees

✅ Only open projects can be taken
✅ Freelancer ID is always recorded
✅ Cannot take same project twice (status check)
✅ All API calls validated
✅ User gets clear feedback (success/error)
✅ UI properly handles loading states
✅ Modal closes on success
✅ Job list updates immediately

## Code Entry Points

### For Freelancer Taking Project
1. **UI Entry**: `components/Pekerjaan.tsx`
2. **Hook**: `hooks/useProjectAPI.ts`
3. **API Route**: `app/api/jobs/[id]/route.ts`
4. **Database**: `lib/db.ts` - `takeProject()`

### For Verification
1. Check freelancer ID: `localStorage.getItem('user')`
2. Check button state: `isLoading` state
3. Check error state: `error` state
4. Check job taken: `job.freelancerId !== null`
5. Check status: `job.status === 'in_progress'`

## Test Cases

### TC1: Valid Project Take
- User: freelancer (role: "freelancer")
- Job: open project
- Expected: Success, project taken, modal closes

### TC2: Non-Open Project
- User: freelancer
- Job: in_progress project
- Expected: Error message "Project must have open status to be taken"

### TC3: Missing User ID
- User: No user data in localStorage
- Job: open project
- Expected: Alert "User information not found"

### TC4: Network Error
- User: freelancer
- Job: open project
- Network: Offline
- Expected: Error message from catch block

### TC5: Concurrent Takes
- User A & B: Both freelancers
- Job: Same open project
- Expected: First succeeds, second gets "wrong status" error

## Database State After Take

Before:
```
id | title | status | freelancerId
1  | Job1  | open   | NULL
```

After:
```
id | title | status       | freelancerId | updatedAt
1  | Job1  | in_progress  | 1            | 2024-01-30 ...
```
