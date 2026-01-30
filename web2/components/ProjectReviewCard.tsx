'use client';

import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Edit3,
  Wallet,
  ChevronRight,
} from 'lucide-react';

interface Project {
  id: number;
  title: string;
  freelancer: string;
  status: 'pending_review' | 'ready_payment' | 'paid';
  completedDate: string;
  amount: number;
  description: string;
  deliverables: string[];
}

interface ProjectReviewCardProps {
  project: Project;
  onRequestRevision: (projectId: number) => void;
  onPayment: (projectId: number) => void;
  onViewDetails: (projectId: number) => void;
}

const statusConfig = {
  pending_review: {
    label: 'Menunggu Review',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    icon: <Clock size={16} />,
  },
  ready_payment: {
    label: 'Siap Dibayar',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-700',
    icon: <CheckCircle2 size={16} />,
  },
  paid: {
    label: 'Sudah Dibayar',
    bgColor: 'bg-slate-100',
    textColor: 'text-slate-700',
    icon: <CheckCircle2 size={16} />,
  },
};

export default function ProjectReviewCard({
  project,
  onRequestRevision,
  onPayment,
  onViewDetails,
}: ProjectReviewCardProps) {
  const config = statusConfig[project.status];

  return (
    <div className="bg-white rounded-3xl border border-blue-100/50 overflow-hidden shadow-sm hover:shadow-md hover:border-blue-200 transition-all">
      {/* Header */}
      <div className="p-6 border-b border-blue-50">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-800 mb-1">{project.title}</h3>
            <p className="text-sm text-slate-500">Dikerjakan oleh: <span className="font-semibold text-slate-700">{project.freelancer}</span></p>
          </div>
          <div className={`${config.bgColor} ${config.textColor} px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2`}>
            {config.icon}
            {config.label}
          </div>
        </div>

        <p className="text-slate-600 text-sm leading-relaxed">{project.description}</p>
      </div>

      {/* Deliverables */}
      <div className="px-6 py-4 border-b border-blue-50 bg-blue-50/30">
        <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Deliverables</h4>
        <div className="space-y-2">
          {project.deliverables.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 text-sm text-slate-700">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Details & Actions */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-xs text-slate-500 font-medium mb-1">TOTAL BAYARAN</p>
            <p className="text-2xl font-black text-slate-800">Rp {project.amount.toLocaleString('id-ID')}</p>
            <p className="text-xs text-slate-400 mt-2">Diselesaikan: {project.completedDate}</p>
          </div>
          <div className="text-right">
            <button
              onClick={() => onViewDetails(project.id)}
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all"
            >
              Lihat Detail <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {project.status === 'pending_review' && (
            <>
              <button
                onClick={() => onRequestRevision(project.id)}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-amber-200 text-amber-700 font-semibold hover:bg-amber-50 transition-colors text-sm"
              >
                <Edit3 size={16} />
                <span className="hidden sm:block">Revisi</span>
              </button>
              <button
                onClick={() => onPayment(project.id)}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors text-sm"
              >
                <CheckCircle2 size={16} />
                <span className="hidden sm:block">Setujui</span>
              </button>
            </>
          )}

          {project.status === 'ready_payment' && (
            <button
              onClick={() => onPayment(project.id)}
              className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-sm shadow-lg shadow-blue-200"
            >
              <Wallet size={18} />
              Bayar Sekarang
            </button>
          )}

          {project.status === 'paid' && (
            <button
              disabled
              className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-200 text-slate-600 font-semibold text-sm cursor-default"
            >
              <CheckCircle2 size={18} />
              Pembayaran Selesai
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
