'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import type { Job } from '@/lib/db';
import JobDetailModal from '@/components/JobDetailModal';
import AddEditJobModal from '@/components/AddEditJobModal';

export default function PekerjaanPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('open');
  const [user, setUser] = useState<any>(null);

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [addEditModalOpen, setAddEditModalOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm, activeFilter]);

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

  const filterJobs = () => {
    let filtered = [...jobs];

    if (searchTerm) {
      filtered = filtered.filter((job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.client.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeFilter === 'open') {
      filtered = filtered.filter((j) => j.status !== 'done');
    } else if (activeFilter === 'done') {
      filtered = filtered.filter((j) => j.status === 'done');
    }

    setFilteredJobs(filtered);
  };

  const handleViewDetails = (job: Job) => {
    setSelectedJob(job);
    setDetailModalOpen(true);
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setAddEditModalOpen(true);
  };

  const handleDeleteJob = async (jobId: number) => {
    if (!confirm('Yakin ingin menghapus pekerjaan ini?')) return;

    try {
      const endpoint = user?.role === 'client' ? `/api/projects/${jobId}` : `/api/jobs/${jobId}`;
      await fetch(endpoint, { method: 'DELETE' });
      setJobs(jobs.filter((j) => j.id !== jobId));
    } catch (error) {
      console.error('Failed to delete job:', error);
    }
  };

  const handleCreateJob = async (jobData: any) => {
    try {
      const endpoint = user?.role === 'client' ? '/api/projects' : '/api/jobs';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...jobData, userId: user?.id, userRole: user?.role }),
      });

      if (res.ok) {
        const newJob = await res.json();
        setJobs([newJob, ...jobs]);
        setAddEditModalOpen(false);
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to create job');
      }
    } catch (error) {
      console.error('Failed to create job:', error);
      alert('Gagal membuat pekerjaan');
    }
  };

  const handleSaveJob = async (updatedJobData: any) => {
    if (editingJob) {
      try {
        const endpoint = user?.role === 'client' ? `/api/projects/${editingJob.id}` : `/api/jobs/${editingJob.id}`;
        const res = await fetch(endpoint, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedJobData),
        });

        if (res.ok) {
          const updatedJob = await res.json();
          setJobs(jobs.map((j) => (j.id === editingJob.id ? updatedJob : j)));
          setAddEditModalOpen(false);
          setEditingJob(null);
        } else {
          const error = await res.json();
          alert(error.error || 'Failed to update job');
        }
      } catch (error) {
        console.error('Failed to save job:', error);
        alert('Gagal menyimpan pekerjaan');
      }
    }
  };

  const handleTakeProject = async (jobId: number) => {
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'take', freelancerId: user?.id }),
      });

      if (res.ok) {
        const updatedJob = await res.json();
        setJobs(jobs.map((j) => (j.id === jobId ? updatedJob : j)));
        setDetailModalOpen(false);
        alert('Project berhasil diambil!');
      } else {
        const error = await res.json();
        throw new Error(error.error || 'Failed to take project');
      }
    } catch (error) {
      console.error('Failed to take project:', error);
      throw error;
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div>
      {/* Search & Filter */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:flex-1">
            <Search size={20} className="absolute left-4 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari pekerjaan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-400"
            />
          </div>

          {user?.role === 'client' && (
            <button 
              onClick={() => {
                setEditingJob(null);
                setAddEditModalOpen(true);
              }}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
            >
              <Plus size={18} /> Tambah Pekerjaan
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3">
          {['open', 'done'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                activeFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {filter === 'open' ? 'Terbuka' : 'Selesai'}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-6 py-4 font-bold text-slate-700">Judul</th>
              <th className="text-left px-6 py-4 font-bold text-slate-700">Klien</th>
              <th className="text-left px-6 py-4 font-bold text-slate-700">Status</th>
              <th className="text-left px-6 py-4 font-bold text-slate-700">Deadline</th>
              <th className="text-left px-6 py-4 font-bold text-slate-700">Reward</th>
              <th className="text-center px-6 py-4 font-bold text-slate-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job) => (
              <tr key={job.id} className="border-b border-slate-100 hover:bg-blue-50/30 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-bold text-slate-800">{job.title}</p>
                    <p className="text-xs text-slate-400">{job.category}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">{job.client}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    job.status === 'done' ? 'bg-emerald-100 text-emerald-700' :
                    job.status === 'revision' ? 'bg-rose-100 text-rose-700' :
                    job.status === 'pending_review' ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {job.status === 'in_progress' ? 'Berlangsung' :
                     job.status === 'revision' ? 'Revisi' :
                     job.status === 'pending_review' ? 'Menunggu Review' :
                     job.status === 'done' ? 'Selesai' : job.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">{job.deadline}</td>
                <td className="px-6 py-4 font-bold text-slate-800">{job.reward}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleViewDetails(job)}
                      className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                      title="Lihat Detail"
                    >
                      <Eye size={18} />
                    </button>
                    {user?.role === 'client' && (
                      <>
                        <button
                          onClick={() => handleEditJob(job)}
                          className="p-2 hover:bg-amber-100 rounded-lg text-amber-600 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="p-2 hover:bg-rose-100 rounded-lg text-rose-600 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-16">
          <div className="text-slate-400 mb-2">Tidak ada pekerjaan</div>
          <p className="text-slate-500 text-sm">Mulai buat pekerjaan baru untuk memulai</p>
        </div>
      )}

      {/* Modals */}
      {detailModalOpen && selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setDetailModalOpen(false)}
          onTakeProject={user?.role === 'freelancer' ? handleTakeProject : undefined}
        />
      )}

      {addEditModalOpen && (
        <AddEditJobModal
          job={editingJob}
          onClose={() => {
            setAddEditModalOpen(false);
            setEditingJob(null);
          }}
          onSubmit={editingJob ? undefined : handleCreateJob}
          onSave={editingJob ? handleSaveJob : undefined}
        />
      )}
    </div>
  );
}
