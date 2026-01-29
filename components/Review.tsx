'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Inbox,
  Wallet,
} from 'lucide-react';
import ProjectReviewCard from './ProjectReviewCard';
import RevisionRequestModal from './RevisionRequestModal';
import PaymentModal from './PaymentModal';

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

interface ReviewProps {
  onNavigateBack: () => void;
}

const mockProjects: Project[] = [
  {
    id: 1,
    title: 'Desain Landing Page Website',
    freelancer: 'Adi Pratama',
    status: 'pending_review',
    completedDate: '28 Januari 2026',
    amount: 5000000,
    description: 'Pembuatan design landing page untuk startup teknologi dengan modern UI/UX design.',
    deliverables: [
      'Design mockup Figma (desktop & mobile)',
      'Design system lengkap',
      'Interactive prototype',
      'Design documentation',
    ],
  },
  {
    id: 2,
    title: 'Development REST API Backend',
    freelancer: 'Budi Santoso',
    status: 'ready_payment',
    completedDate: '25 Januari 2026',
    amount: 8000000,
    description: 'Pengembangan REST API lengkap dengan authentication, validation, dan dokumentasi API.',
    deliverables: [
      'Implemented API endpoints',
      'Database schema & migrations',
      'Authentication & authorization',
      'API documentation (Swagger)',
      'Unit tests',
    ],
  },
  {
    id: 3,
    title: 'Mobile App UI Development',
    freelancer: 'Citra Wijaya',
    status: 'paid',
    completedDate: '20 Januari 2026',
    amount: 6500000,
    description: 'Implementasi UI untuk aplikasi mobile menggunakan React Native dengan responsive design.',
    deliverables: [
      'React Native components',
      'Responsive layouts',
      'Navigation setup',
      'State management',
    ],
  },
];

export default function Review({ onNavigateBack }: ReviewProps) {
  const [projects] = useState<Project[]>(mockProjects);
  const [revisionModal, setRevisionModal] = useState<{
    isOpen: boolean;
    projectId: number;
    projectTitle: string;
  }>({
    isOpen: false,
    projectId: 0,
    projectTitle: '',
  });

  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    projectId: number;
    projectTitle: string;
    amount: number;
  }>({
    isOpen: false,
    projectId: 0,
    projectTitle: '',
    amount: 0,
  });

  const handleRequestRevision = (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setRevisionModal({
        isOpen: true,
        projectId,
        projectTitle: project.title,
      });
    }
  };

  const handlePayment = (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setPaymentModal({
        isOpen: true,
        projectId,
        projectTitle: project.title,
        amount: project.amount,
      });
    }
  };

  const handleRevisionSubmit = (notes: string) => {
    console.log(`Revision submitted for project ${revisionModal.projectId}:`, notes);
    alert('Permintaan revisi telah dikirim ke freelancer!');
    setRevisionModal({ isOpen: false, projectId: 0, projectTitle: '' });
  };

  const handlePaymentSubmit = (walletAddress: string) => {
    console.log(`Payment submitted for project ${paymentModal.projectId} from wallet:`, walletAddress);
    alert('Pembayaran berhasil diproses!');
    setPaymentModal({ isOpen: false, projectId: 0, projectTitle: '', amount: 0 });
  };

  const pendingReviewCount = projects.filter(p => p.status === 'pending_review').length;
  const readyPaymentCount = projects.filter(p => p.status === 'ready_payment').length;
  const paidCount = projects.filter(p => p.status === 'paid').length;

  return (
    <div className="min-h-screen bg-[#F0F5FA] font-sans text-slate-800">
      {/* Header */}
      <div className="bg-white border-b border-blue-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 flex items-center gap-4">
          <button
            onClick={onNavigateBack}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            title="Kembali"
          >
            <ArrowLeft size={24} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Review Proyek</h1>
            <p className="text-sm text-slate-500 font-medium">Kelola review dan pembayaran proyek Anda</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Pending Review */}
          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Menunggu Review</h3>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Inbox size={20} className="text-blue-600" />
              </div>
            </div>
            <p className="text-4xl font-black text-slate-800">{pendingReviewCount}</p>
            <p className="text-xs text-slate-500 font-medium mt-2">Proyek menunggu persetujuan Anda</p>
          </div>

          {/* Ready for Payment */}
          <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Siap Dibayar</h3>
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <Wallet size={20} className="text-emerald-600" />
              </div>
            </div>
            <p className="text-4xl font-black text-slate-800">{readyPaymentCount}</p>
            <p className="text-xs text-slate-500 font-medium mt-2">Proyek siap untuk pembayaran</p>
          </div>

          {/* Paid */}
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Sudah Dibayar</h3>
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                <Wallet size={20} className="text-slate-600" />
              </div>
            </div>
            <p className="text-4xl font-black text-slate-800">{paidCount}</p>
            <p className="text-xs text-slate-500 font-medium mt-2">Transaksi sudah diselesaikan</p>
          </div>
        </div>

        {/* Projects List */}
        {projects.length > 0 ? (
          <div className="space-y-6">
            {/* Pending Review Section */}
            {pendingReviewCount > 0 && (
              <section>
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                  Menunggu Review Anda
                </h2>
                <div className="space-y-4">
                  {projects
                    .filter(p => p.status === 'pending_review')
                    .map(project => (
                      <ProjectReviewCard
                        key={project.id}
                        project={project}
                        onRequestRevision={handleRequestRevision}
                        onPayment={handlePayment}
                        onViewDetails={() => console.log('View details:', project.id)}
                      />
                    ))}
                </div>
              </section>
            )}

            {/* Ready for Payment Section */}
            {readyPaymentCount > 0 && (
              <section>
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
                  Siap Dibayar
                </h2>
                <div className="space-y-4">
                  {projects
                    .filter(p => p.status === 'ready_payment')
                    .map(project => (
                      <ProjectReviewCard
                        key={project.id}
                        project={project}
                        onRequestRevision={handleRequestRevision}
                        onPayment={handlePayment}
                        onViewDetails={() => console.log('View details:', project.id)}
                      />
                    ))}
                </div>
              </section>
            )}

            {/* Paid Section */}
            {paidCount > 0 && (
              <section>
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-slate-500 rounded-full"></div>
                  Sudah Dibayar
                </h2>
                <div className="space-y-4">
                  {projects
                    .filter(p => p.status === 'paid')
                    .map(project => (
                      <ProjectReviewCard
                        key={project.id}
                        project={project}
                        onRequestRevision={handleRequestRevision}
                        onPayment={handlePayment}
                        onViewDetails={() => console.log('View details:', project.id)}
                      />
                    ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-300 mb-4 shadow-sm">
              <Inbox size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Belum ada proyek untuk direview</h3>
            <p className="text-slate-500 font-medium">Proyek yang selesai akan muncul di sini</p>
          </div>
        )}
      </main>

      {/* Modals */}
      <RevisionRequestModal
        isOpen={revisionModal.isOpen}
        projectTitle={revisionModal.projectTitle}
        onClose={() => setRevisionModal({ isOpen: false, projectId: 0, projectTitle: '' })}
        onSubmit={handleRevisionSubmit}
      />

      <PaymentModal
        isOpen={paymentModal.isOpen}
        projectTitle={paymentModal.projectTitle}
        amount={paymentModal.amount}
        onClose={() => setPaymentModal({ isOpen: false, projectId: 0, projectTitle: '', amount: 0 })}
        onPayment={handlePaymentSubmit}
      />
    </div>
  );
}
