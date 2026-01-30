'use client';

import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import Review from '@/components/Review';
import RevisionRequestModal from '@/components/RevisionRequestModal';

interface Job {
  id: number;
  title: string;
  client: string;
  freelancer: string;
  status: 'pending_review' | 'approved' | 'revision_requested';
  deadline: string;
  reward: string;
  submittedAt: string;
}

export default function ReviewPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [selectedJobForRevision, setSelectedJobForRevision] = useState<Job | null>(null);

  useEffect(() => {
    fetchReviewJobs();
  }, []);

  const fetchReviewJobs = async () => {
    try {
      const res = await fetch('/api/jobs?status=pending_review');
      const data = await res.json();
      setJobs(data);
    } catch (error) {
      console.error('Failed to fetch review jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (jobId: number) => {
    try {
      const res = await fetch('/api/jobs/[id]'.replace('[id]', jobId.toString()), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ready_payment' }),
      });

      if (res.ok) {
        setJobs(jobs.map(j => j.id === jobId ? { ...j, status: 'approved' as any } : j));
      }
    } catch (error) {
      console.error('Failed to approve job:', error);
    }
  };

  const handleRequestRevision = (job: Job) => {
    setSelectedJobForRevision(job);
    setRevisionModalOpen(true);
  };

  const handleSubmitRevision = async (jobId: number, message: string) => {
    try {
      const res = await fetch('/api/jobs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, status: 'revision_requested', revisionMessage: message }),
      });

      if (res.ok) {
        setJobs(jobs.map(j => j.id === jobId ? { ...j, status: 'revision_requested' } : j));
        setRevisionModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to request revision:', error);
    }
  };

  const filteredJobs = jobs.filter(job =>
    (activeTab === 'pending' && job.status === 'pending_review') ||
    (activeTab === 'approved' && job.status === 'approved') ||
    (activeTab === 'revision' && job.status === 'revision_requested')
  ).filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.freelancer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div>
      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <Search size={20} className="absolute left-4 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari review pekerjaan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-400"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-8 border-b border-slate-200">
        {[
          { id: 'pending', label: 'Menunggu Review', count: jobs.filter(j => j.status === 'pending_review').length },
          { id: 'approved', label: 'Disetujui', count: jobs.filter(j => j.status === 'approved').length },
          { id: 'revision', label: 'Revisi Diminta', count: jobs.filter(j => j.status === 'revision_requested').length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <div key={job.id} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-800 mb-1">{job.title}</h3>
                  <div className="flex gap-4 text-sm text-slate-600">
                    <span>Klien: {job.client}</span>
                    <span>Freelancer: {job.freelancer}</span>
                  </div>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                  job.status === 'pending_review' ? 'bg-amber-100 text-amber-700' :
                  job.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                  'bg-rose-100 text-rose-700'
                }`}>
                  {job.status === 'pending_review' ? 'Menunggu Review' :
                   job.status === 'approved' ? 'Disetujui' :
                   'Revisi Diminta'}
                </span>
              </div>

              <div className="flex gap-4 mb-4 text-sm">
                <div className="text-slate-600">Deadline: <span className="font-bold text-slate-800">{job.deadline}</span></div>
                <div className="text-slate-600">Reward: <span className="font-bold text-slate-800">{job.reward}</span></div>
              </div>

              {job.status === 'pending_review' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(job.id)}
                    className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    <CheckCircle2 size={18} /> Setujui
                  </button>
                  <button
                    onClick={() => handleRequestRevision(job)}
                    className="flex items-center gap-2 px-6 py-2 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors"
                  >
                    <AlertCircle size={18} /> Minta Revisi
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-slate-50 rounded-2xl">
            <MessageSquare size={48} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-600 font-semibold">Tidak ada pekerjaan</p>
            <p className="text-slate-400 text-sm mt-1">Belum ada pekerjaan yang perlu di-review</p>
          </div>
        )}
      </div>

      {/* Revision Modal */}
      {revisionModalOpen && selectedJobForRevision && (
        <RevisionRequestModal
          job={selectedJobForRevision}
          onClose={() => {
            setRevisionModalOpen(false);
            setSelectedJobForRevision(null);
          }}
          onSubmit={(message) => handleSubmitRevision(selectedJobForRevision.id, message)}
        />
      )}
    </div>
  );
}
