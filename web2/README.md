# WorkSpace - Next.js Monolith Application

A monolithic Next.js application for freelance project management with SQLite database integration and Tailwind CSS styling.

## Features

- 📊 Dashboard with job statistics
- ✅ Job status tracking (In Progress, Revision, Pending Review)
- 💰 Payment management interface
- 🎨 Modern UI built with Tailwind CSS and Lucide React icons
- 💾 SQLite database for persistent storage
- 🚀 Production-ready Docker setup

## Tech Stack

- **Framework**: Next.js 16+ with TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with better-sqlite3
- **UI Components**: React with Lucide icons
- **Deployment**: Docker & Docker Compose

## Local Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3030`

### Build for Production

```bash
npm run build
npm start
```

## API Endpoints

### GET /api/jobs
Fetch all jobs
```json
{
  "id": 1,
  "title": "Project Name",
  "client": "Client Name",
  "status": "in_progress|revision|pending_review|done",
  "deadline": "2 hari lagi",
  "reward": "Rp 2.500.000",
  "category": "Illustration"
}
```

### PUT /api/jobs
Update job status
```json
{
  "jobId": 1,
  "status": "pending_review"
}
```

## Docker Deployment

### Build and Run with Docker Compose

```bash
docker-compose up -d
```

The application will be accessible at `http://localhost:3030`

### Build Docker Image

```bash
docker build -t nextjs-app .
docker run -p 3030:3030 nextjs-app
```

## Project Structure

```
├── app/
│   ├── api/
│   │   └── jobs/
│   │       └── route.ts        # API endpoints
│   ├── layout.tsx
│   └── page.tsx                # Main page
├── components/
│   └── Dashboard.tsx           # Main dashboard component
├── lib/
│   └── db.ts                   # Database functions
├── data/
│   └── app.db                  # SQLite database (auto-created)
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## Environment Variables

The application runs on port 3030 by default. Configure via:
- Development: `npm run dev` (automatically uses port 3030)
- Production: Set `PORT=3030` environment variable

## Database

SQLite database is automatically initialized on first run. Initial data includes sample freelance jobs.

### Database Schema

**jobs table**
- id: INTEGER PRIMARY KEY
- title: TEXT
- client: TEXT
- status: TEXT
- deadline: TEXT
- reward: TEXT
- category: TEXT
- createdAt: DATETIME
- updatedAt: DATETIME

## Usage

1. **View Dashboard**: Home page shows overview of all jobs
2. **Track Progress**: Jobs are organized by status (In Progress, Pending Payment)
3. **Submit Work**: Click "Kirim Hasil" to submit completed work for review
4. **Payment Status**: View pending payments in the dedicated section

## Notes

- Database file is stored in `./data/app.db`
- All styling uses Tailwind CSS utility classes
- TypeScript for type safety
- API routes handle both GET (fetch) and PUT (update) operations
- Docker image includes SQLite support for embedded database

## License

MIT
