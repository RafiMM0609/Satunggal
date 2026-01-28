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
import JobDetailModal from './JobDetailModal';
import AddEditJobModal from './AddEditJobModal';

interface Job {
  id: number;
  title: string;
  client: string;
  status: string;
  deadline: string;
  reward: string;
  category: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface PekerjaanProps {
  onNavigateBack?: () => void;
}

export default function Pekerjaan({ onNavigateBack }: PekerjaanProps) {
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
  }, []);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, activeFilter, searchTerm]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
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
    let filtered = jobs;

    if (activeFilter !== 'all') {
      filtered = filtered.filter((job) => job.status === activeFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(term) ||
          job.client.toLowerCase().includes(term) ||
          job.category.toLowerCase().includes(term)
      );
    }

    setFilteredJobs(filtered);
  };

  const handleViewDetail = (job: Job) => {
    setSelectedJob(job);
    setDetailModalOpen(true);
  };

  const handleApplyJob = async (jobId: number) => {
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'apply' }),
      });

      if (res.ok) {
        const updatedJob = await res.json();
        setJobs(jobs.map((j) => (j.id === jobId ? updatedJob : j)));
      }
    } catch (error) {
      console.error('Failed to apply for job:', error);
    }
  };

  const handleAddJob = () => {
    setEditingJob(null);
    setAddEditModalOpen(true);
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setAddEditModalOpen(true);
  };

  const handleSubmitJob = async (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingJob) {
        const res = await fetch(`/api/jobs/${editingJob.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(jobData),
        });

        if (res.ok) {
          const updatedJob = await res.json();
          setJobs(jobs.map((j) => (j.id === editingJob.id ? updatedJob : j)));
        }
      } else {
        const res = await fetch('/api/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...jobData, userId: user?.id, userRole: user?.role }),
        });

        if (!res.ok) {
          const error = await res.json();
          alert(error.error || 'Failed to create job');
          return;
        }

        const newJob = await res.json();
        setJobs([newJob, ...jobs]);
      }

      setAddEditModalOpen(false);
      setEditingJob(null);
    } catch (error) {
      console.error('Failed to save job:', error);
    }
  };

  const handleDeleteJob = async (jobId: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pekerjaan ini?')) return;

    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setJobs(jobs.filter((j) => j.id !== jobId));
      }
    } catch (error) {
      console.error('Failed to delete job:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700';
      case 'done':
        return 'bg-emerald-100 text-emerald-700';
      case 'revision':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open':
        return 'Terbuka';
      case 'pending':
        return 'Menunggu';
      case 'in_progress':
        return 'Sedang Dikerjakan';
      case 'done':
        return 'Selesai';
      case 'revision':
        return 'Revisi';
      case 'pending_review':
        return 'Menunggu Review';
      default:
        return status;
    }
  };

  const filterTabs = [
    { id: 'open', label: 'Terbuka', count: jobs.filter((j) => j.status === 'open').length },
    { id: 'pending', label: 'Menunggu', count: jobs.filter((j) => j.status === 'pending').length },
    {
      id: 'in_progress',
      label: 'Sedang Dikerjakan',
      count: jobs.filter((j) => j.status === 'in_progress').length,
    },
    { id: 'done', label: 'Selesai', count: jobs.filter((j) => j.status === 'done').length },
    { id: 'all', label: 'Semua', count: jobs.length },
  ];

  return (
    <div className="min-h-screen bg-[#F0F5FA] font-sans text-slate-800">
      <main className="p-6 md:p-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Daftar Pekerjaan</h1>
            <p className="text-slate-500 font-medium">Kelola semua pekerjaan Anda di sini</p>
          </div>

          <button
            onClick={handleAddJob}
            disabled={user?.role === 'freelancer'}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold shadow-lg transform duration-200 ${
              user?.role === 'freelancer'
                ? 'bg-gray-400 text-white cursor-not-allowed opacity-50'
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-0.5'
            } transition-colors`}
            title={user?.role === 'freelancer' ? 'Freelancers cannot create projects' : ''}
          >
            <Plus size={18} strokeWidth={3} /> Tambah Pekerjaan
          </button>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Cari pekerjaan, klien, atau kategori..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3 rounded-2xl border-2 border-slate-200 font-medium focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-5 py-2.5 rounded-full font-bold whitespace-nowrap transition-all text-sm ${
                activeFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                  : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-blue-300'
              }`}
            >
              {tab.label} <span className="ml-1 opacity-70">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-slate-600 font-semibold">Loading...</div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50">
            <div className="w-12 h-12 bg-slate-300 rounded-full flex items-center justify-center text-slate-400 mb-3 shadow-sm">
              <AlertCircle size={24} />
            </div>
            <p className="text-slate-600 text-sm font-bold">Tidak ada pekerjaan</p>
            <p className="text-slate-400 text-xs mt-1">Coba gunakan pencarian atau filter lain</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white p-6 rounded-3xl shadow-sm border border-blue-100/50 hover:shadow-md hover:border-blue-200 transition-all group"
              >
                {/* Status Badge */}
                <div className="flex items-start justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${getStatusColor(job.status)}`}>
                    {getStatusLabel(job.status)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-lg text-slate-800 leading-tight mb-2 line-clamp-2">
                  {job.title}
                </h3>

                {/* Client */}
                <p className="text-sm text-slate-500 font-medium mb-4">{job.client}</p>

                {/* Category */}
                <p className="text-[11px] font-bold tracking-wider text-blue-400 uppercase mb-4">
                  {job.category}
                </p>

                {/* Info */}
                <div className="space-y-2 mb-5 pb-5 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs text-slate-600 pt-3">
                    <Calendar size={14} className="text-amber-600" />
                    <span>{job.deadline}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <DollarSign size={14} className="text-emerald-600" />
                    <span>{job.reward}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetail(job)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors font-medium text-sm"
                  >
                    <Eye size={16} /> Lihat
                  </button>

                  <button
                    onClick={() => handleEditJob(job)}
                    className="py-2 px-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>

                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="py-2 px-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <JobDetailModal
        job={selectedJob}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        onApply={handleApplyJob}
      />

      <AddEditJobModal
        job={editingJob}
        isOpen={addEditModalOpen}
        onClose={() => setAddEditModalOpen(false)}
        onSubmit={handleSubmitJob}
      />
    </div>
  );
}
