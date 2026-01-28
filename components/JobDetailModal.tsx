'use client';

import React from 'react';
import { X, Briefcase, MapPin, Calendar, DollarSign } from 'lucide-react';

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

interface JobDetailModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (jobId: number) => void;
}

export default function JobDetailModal({ job, isOpen, onClose, onApply }: JobDetailModalProps) {
  if (!isOpen || !job) return null;

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">Detail Pekerjaan</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title & Status */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="text-2xl font-bold text-slate-800">{job.title}</h3>
              <span className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${getStatusColor(job.status)}`}>
                {getStatusLabel(job.status)}
              </span>
            </div>
            <p className="text-slate-500 font-medium">{job.category}</p>
          </div>

          {/* Client Info */}
          <div className="bg-blue-50 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-slate-600 mb-1">
              <Briefcase size={18} className="text-blue-600" />
              <span className="text-sm font-medium">Klien</span>
            </div>
            <p className="text-lg font-bold text-slate-800">{job.client}</p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-slate-600 mb-2">
                <Calendar size={18} className="text-amber-600" />
                <span className="text-sm font-medium">Deadline</span>
              </div>
              <p className="text-lg font-bold text-slate-800">{job.deadline}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-slate-600 mb-2">
                <DollarSign size={18} className="text-emerald-600" />
                <span className="text-sm font-medium">Kompensasi</span>
              </div>
              <p className="text-lg font-bold text-slate-800">{job.reward}</p>
            </div>
          </div>

          {/* Description */}
          {job.description && (
            <div>
              <h4 className="text-sm font-bold text-slate-600 uppercase mb-2">Deskripsi</h4>
              <p className="text-slate-700 leading-relaxed">{job.description}</p>
            </div>
          )}

          {/* Action Button */}
          {job.status === 'open' && (
            <button
              onClick={() => {
                onApply(job.id);
                onClose();
              }}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-2xl hover:bg-blue-700 transition-colors"
            >
              Ajukan Penawaran
            </button>
          )}

          {job.status !== 'open' && (
            <div className="bg-slate-100 p-4 rounded-2xl text-center text-slate-600 font-medium">
              Pekerjaan ini tidak tersedia untuk diajukan
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
