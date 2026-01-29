'use client';

import { useState, useEffect } from 'react';
import { Clock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

interface Job {
  id: number;
  title: string;
  client: string;
  status: 'in_progress' | 'revision' | 'pending_review' | 'done';
  deadline: string;
  reward: string;
  category: string;
}

const StatCard = ({ label, count, theme, icon }: { label: string; count: string | number; theme: 'blue' | 'amber' | 'emerald'; icon: React.ReactNode }) => {
  const themes = {
    blue: 'bg-blue-100 text-blue-900 border-blue-200',
    amber: 'bg-amber-100 text-amber-900 border-amber-200',
    emerald: 'bg-emerald-100 text-emerald-900 border-emerald-200',
  };

  const iconThemes = {
    blue: 'bg-white text-blue-600',
    amber: 'bg-white text-amber-600',
    emerald: 'bg-white text-emerald-600',
  };

  return (
    <div className={`${themes[theme]} p-6 rounded-[2rem] border transition-all hover:scale-[1.02] cursor-default flex flex-col justify-between h-32 relative overflow-hidden`}>
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>

      <div className="flex justify-between items-start relative z-10">
        <div className="text-4xl font-black tracking-tight">{count}</div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${iconThemes[theme]}`}>
          {icon}
        </div>
      </div>
      <div className="text-sm font-bold opacity-80 uppercase tracking-wide relative z-10 mt-auto">
        {label}
      </div>
    </div>
  );
};

const JobCardComp = ({ job, onSubmit }: { job: Job; onSubmit: () => void }) => (
  <div className="bg-white p-5 rounded-3xl shadow-sm border border-blue-100/50 hover:shadow-md hover:border-blue-200 transition-all">
    <div className="flex justify-between items-start mb-3">
      <div className="flex-1">
        <span className="text-[11px] font-bold tracking-wider text-blue-400 uppercase mb-1 block">
          {job.category}
        </span>
        <h3 className="font-bold text-lg text-slate-800 leading-tight mb-1">{job.title}</h3>
        <p className="text-sm text-slate-400 font-medium">{job.client}</p>
      </div>
      {job.status === 'revision' ? (
        <span className="flex items-center gap-1 text-[10px] font-bold bg-rose-100 text-rose-600 px-3 py-1.5 rounded-xl animate-pulse">
          <AlertCircle size={12} /> REVISI
        </span>
      ) : (
        <span className="w-2 h-2 rounded-full bg-blue-400 mt-2"></span>
      )}
    </div>

    <div className="flex items-center gap-4 mb-5">
      <div className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg font-medium ${job.deadline === 'Besok' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
        <Clock size={14} />
        <span>{job.deadline}</span>
      </div>
      <div className="text-slate-700 font-bold text-sm">{job.reward}</div>
    </div>

    <button
      onClick={onSubmit}
      className="w-full py-3 rounded-2xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
    >
      Kirim Hasil <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
    </button>
  </div>
);

const WaitingCardComp = ({ job }: { job: Job }) => (
  <div className="bg-[#FFFDF5] p-5 rounded-3xl border border-amber-100 shadow-sm relative overflow-hidden group">
    <div className="absolute -right-4 -top-4 w-20 h-20 bg-amber-100/50 rounded-full blur-2xl group-hover:bg-amber-200/50 transition-colors"></div>

    <div className="relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-base text-slate-800">{job.title}</h3>
          <p className="text-xs text-slate-400 font-medium mt-1">{job.client}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="px-3 py-1 bg-white border border-amber-100 rounded-xl text-[10px] font-bold text-amber-600 shadow-sm">
            Review
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-amber-100">
        <div className="text-lg font-black text-slate-700">{job.reward}</div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-100/50 px-3 py-1.5 rounded-full">
          Menunggu Bayar
        </div>
      </div>
    </div>
  </div>
);

export default function OverviewPage() {
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
        setJobs(jobs.map(job => job.id === jobId ? { ...job, status: 'pending_review' } : job));
      }
    } catch (error) {
      console.error('Failed to submit work:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-slate-600 font-semibold">Loading...</div>
      </div>
    );
  }

  const inProgressJobs = jobs.filter((j) => j.status === 'in_progress' || j.status === 'revision');
  const waitingJobs = jobs.filter((j) => j.status === 'pending_review');

  return (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard label="Sedang Dikerjakan" count={inProgressJobs.length} theme="blue" icon={<Clock size={24} />} />
        <StatCard label="Menunggu Review" count={waitingJobs.length} theme="amber" icon={<Clock size={24} />} />
        <StatCard label="Total Selesai" count="24" theme="emerald" icon={<CheckCircle2 size={24} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* In Progress Section */}
        <section className="bg-blue-50/50 p-6 rounded-[2rem]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
              In Progress
            </h2>
            <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
              {inProgressJobs.length} Aktif
            </span>
          </div>

          <div className="space-y-4">
            {inProgressJobs.map((job) => (
              <JobCardComp key={job.id} job={job} onSubmit={() => handleSubmitWork(job.id)} />
            ))}
          </div>
        </section>

        {/* Waiting Payment Section */}
        <section className="bg-amber-50/50 p-6 rounded-[2rem]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <div className="w-2 h-6 bg-amber-400 rounded-full"></div>
              Pending Payment
            </h2>
            <span className="bg-white text-amber-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
              {waitingJobs.length} Menunggu
            </span>
          </div>

          <div className="space-y-4">
            {waitingJobs.length > 0 ? (
              waitingJobs.map((job) => <WaitingCardComp key={job.id} job={job} />)
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-3xl border-2 border-dashed border-amber-200 bg-amber-50/30">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-amber-300 mb-3 shadow-sm">
                  💰
                </div>
                <p className="text-slate-600 text-sm font-bold">Dompet aman!</p>
                <p className="text-slate-400 text-xs mt-1">Belum ada tagihan yang nyangkut.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
