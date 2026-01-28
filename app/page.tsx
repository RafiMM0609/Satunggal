'use client';

import { useState, useEffect } from 'react';
import Dashboard from '@/components/Dashboard';

interface Job {
  id: number;
  title: string;
  client: string;
  status: 'in_progress' | 'revision' | 'pending_review' | 'done';
  deadline: string;
  reward: string;
  category: string;
}

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      const data = await res.json();
      setJobs(data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitWork = async (jobId: number) => {
    try {
      const res = await fetch('/api/jobs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, status: 'pending_review' }),
      });

      if (res.ok) {
        setJobs(jobs.map(job => job.id === jobId ? { ...job, status: 'pending_review', deadline: 'Selesai' } : job));
      }
    } catch (error) {
      console.error('Failed to submit work:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F5FA] flex items-center justify-center">
        <div className="text-slate-600 font-semibold">Loading...</div>
      </div>
    );
  }

  return <Dashboard jobs={jobs} onSubmitWork={handleSubmitWork} />;
}
