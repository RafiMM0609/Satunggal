# Freelancer Take Project - Quick Start Guide

## What is This Feature?
Freelancers can now browse available projects and take them. When a freelancer takes a project:
- Project status changes from `open` → `in_progress`
- Freelancer ID is assigned to the project
- Project is now associated with that freelancer

## How to Use (Freelancer)

### 1. View Available Projects
- Go to **Dashboard → Pekerjaan (Jobs)**
- See all available projects from clients

### 2. View Project Details
- Click the **Eye icon** next to a project to see details
- Opens a modal with:
  - Project title
  - Client name
  - Deadline
  - Budget/Reward
  - Project description
  - Project status

### 3. Take a Project
- In the detail modal, if project status is **"Terbuka" (Open)**:
  - Click **"Ambil Project"** button
  - System will:
    - Change status to **"Sedang Dikerjakan" (In Progress)**
    - Record your freelancer ID
    - Show success message: "Project berhasil diambil!"
  - Modal closes automatically

### 4. What Happens After Taking a Project
- Project appears in your dashboard with **"Sedang Dikerjakan"** status
- You are now responsible for this project
- Client can see that you've taken the project

## What Projects Can You Take?

✅ **Can Take:**
- Projects with **"Terbuka" (Open)** status
- Any open project that interests you

❌ **Cannot Take:**
- Projects already in progress
- Projects in revision
- Projects already completed
- Projects pending review

## Button Behavior

### "Ambil Project" Button
- **Visible**: Only when project status is "open"
- **Enabled**: Normally active
- **During Click**: Changes to "Mengambil Project..." (disabled)
- **After Success**: Modal closes, project list updates
- **On Error**: Shows error message, button stays available

## Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| "Freelancer ID is required" | System error with your login | Log out and log in again |
| "Job not found" | Project was deleted | Refresh page to see updated list |
| "Project must have open status to be taken" | Project is no longer available | Another freelancer took it |
| "Failed to take project" | General error | Try again |

## Project Status Meanings

| Status | Display Name | Can You Take It? |
|--------|--------------|------------------|
| open | Terbuka (Open) | ✅ Yes |
| in_progress | Sedang Dikerjakan | ❌ No |
| pending_review | Menunggu Review | ❌ No |
| revision | Revisi (Revision) | ❌ No |
| done | Selesai (Done) | ❌ No |
| pending | Menunggu | ❌ No |

## Things You CANNOT Do (Client Only)

❌ Create new projects
❌ Edit existing projects
❌ Delete projects

## Tips & Best Practices

1. **Check Deadlines**: Always check the deadline before taking a project
2. **Read Description**: Look at the full description to understand requirements
3. **Budget Check**: Verify the reward/payment amount matches your expectations
4. **One at a Time**: Focus on completing one project before taking another
5. **Communicate**: Once you take a project, communicate with the client about timeline

## Workflow Example

```
1. Open Dashboard → Pekerjaan
2. See list of open projects
3. Click Eye icon on a project you like
4. Review all details in modal
5. Click "Ambil Project"
6. Wait for confirmation (modal closes)
7. Project now shows as "Sedang Dikerjakan"
8. Start working on the project
```

## What Happens on the Client Side?

When you take a project:
- Client's project list updates
- Project status changes to "in progress"
- Client knows someone is working on it
- Your freelancer ID is recorded

## Technical Details (For Developers)

**API Call Made:**
```
PATCH /api/jobs/{projectId}
Body: {
  "action": "take",
  "freelancerId": {your_user_id}
}
```

**Database Update:**
- Table: `jobs`
- Updates: `status`, `freelancerId`, `updatedAt`
- Old status: `open`
- New status: `in_progress`

## Troubleshooting

### Button Doesn't Show
- Verify you're logged in as a freelancer
- Check project status is "Terbuka (Open)"
- Refresh page if still not visible

### Button Disabled After Click
- Normal behavior - wait for action to complete
- Shows "Mengambil Project..." text
- Should complete in 1-2 seconds

### Error After Clicking
- Check internet connection
- Try again
- Contact support if problem persists

### Project Already Taken
- Another freelancer took it first
- Choose a different project
- Refresh to see updated list

## Next Features (Coming Soon)

- Ability to release a project you're working on
- Project history showing who worked on it
- Notifications when project status changes
- "My Projects" view showing only your taken projects
