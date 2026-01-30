'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  CreditCard,
  AlertCircle,
  Clock,
  CheckCircle2,
  DollarSign,
  ChevronDown,
} from 'lucide-react';

interface Project {
  id: number;
  title: string;
  client: string;
  status: 'approved' | 'ready_payment' | 'paid';
  deadline: string;
  reward: string;
  category: string;
  description?: string;
}

interface Payment {
  id: number;
  projectId: number;
  amount: string;
  status: 'completed' | 'pending' | 'failed';
  walletAddress?: string;
  createdAt: string;
  projectTitle: string;
}

export default function PembayaranPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'ready' | 'history'>('ready');
  const [user, setUser] = useState<any>(null);
  const [paymentModal, setPaymentModal] = useState({
    isOpen: false,
    project: null as Project | null,
  });
  const [step, setStep] = useState<'confirmation' | 'wallet' | 'processing' | 'success'>('confirmation');
  const [walletAddress, setWalletAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchProjects();
    fetchPayments();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, activeTab]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(
        data.filter((p: Project) => p.status === 'approved' || p.status === 'ready_payment' || p.status === 'paid')
      );
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      if (!user?.id) return;
      const res = await fetch(`/api/payments?clientId=${user.id}`);
      const data = await res.json();
      setPayments(data);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    }
  };

  const filterProjects = () => {
    let filtered = projects;

    if (activeTab === 'ready') {
      filtered = filtered.filter(p => p.status === 'approved' || p.status === 'ready_payment');
    } else {
      filtered = filtered.filter(p => p.status === 'paid');
    }

    if (searchTerm) {
      filtered = filtered.filter(
        p =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.client.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProjects(filtered);
  };

  const handlePaymentClick = (project: Project) => {
    setPaymentModal({ isOpen: true, project });
    setStep('confirmation');
    setWalletAddress('');
  };

  const handleConfirmPayment = () => {
    setStep('wallet');
  };

  const handleProcessPayment = async () => {
    if (!walletAddress.trim()) {
      alert('Mohon masukkan alamat wallet');
      return;
    }

    if (!paymentModal.project) return;

    setIsProcessing(true);
    try {
      setStep('processing');

      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create payment record
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: paymentModal.project.id,
          clientId: user?.id,
          freelancerId: 1, // TODO: Get actual freelancer ID from project
          amount: paymentModal.project.reward,
          walletAddress,
          paymentMethod: 'wallet',
        }),
      });

      if (!response.ok) throw new Error('Payment failed');

      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStep('success');

      // Refresh data
      setTimeout(() => {
        fetchProjects();
        fetchPayments();
        setPaymentModal({ isOpen: false, project: null });
      }, 2000);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Pembayaran gagal. Silakan coba lagi.');
      setStep('wallet');
    } finally {
      setIsProcessing(false);
    }
  };

  const closePaymentModal = () => {
    if (step !== 'processing') {
      setPaymentModal({ isOpen: false, project: null });
      setStep('confirmation');
      setWalletAddress('');
    }
  };

  const readyCount = projects.filter(p => p.status === 'approved' || p.status === 'ready_payment').length;
  const paidCount = projects.filter(p => p.status === 'paid').length;
  const totalPending = projects
    .filter(p => p.status === 'approved' || p.status === 'ready_payment')
    .reduce((sum, p) => {
      const match = p.reward.match(/\d+/);
      return sum + (match ? parseInt(match[0]) : 0);
    }, 0);

  if (user?.role !== 'client') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Akses Ditolak</h2>
          <p className="text-slate-600">Hanya klien yang dapat mengakses halaman pembayaran</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Siap Dibayar</p>
              <p className="text-2xl font-bold text-slate-800">{readyCount} Proyek</p>
              <p className="text-xs text-amber-700 mt-2">Total: Rp {totalPending.toLocaleString('id-ID')}</p>
            </div>
            <Clock size={40} className="text-amber-500 opacity-20" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Sudah Dibayar</p>
              <p className="text-2xl font-bold text-slate-800">{paidCount} Proyek</p>
            </div>
            <CheckCircle2 size={40} className="text-emerald-500 opacity-20" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Riwayat Pembayaran</p>
              <p className="text-2xl font-bold text-slate-800">{payments.length}</p>
            </div>
            <CreditCard size={40} className="text-blue-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('ready')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'ready'
              ? 'text-amber-600 border-b-2 border-amber-600'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Siap Dibayar ({readyCount})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'history'
              ? 'text-emerald-600 border-b-2 border-emerald-600'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Riwayat ({paidCount})
        </button>
      </div>

      {activeTab === 'ready' ? (
        <>
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-4 top-3 text-slate-400"
              />
              <input
                type="text"
                placeholder="Cari proyek..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
              <p className="text-slate-600 font-semibold">Memuat proyek...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl">
              <CreditCard size={48} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-600 font-semibold">Tidak ada proyek siap dibayar</p>
              <p className="text-slate-400 text-sm mt-1">Tunggu freelancer menyelesaikan pekerjaan</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProjects.map(project => (
                <div
                  key={project.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-800 mb-1">
                        {project.title}
                      </h3>
                      <p className="text-sm text-slate-600">{project.client}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                      <Clock size={12} /> Siap Bayar
                    </span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Kategori:</span>
                      <span className="font-semibold text-slate-800">
                        {project.category}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Jumlah:</span>
                      <span className="font-bold text-lg text-amber-600">
                        {project.reward}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Deadline:</span>
                      <span className="font-semibold text-slate-800">
                        {project.deadline}
                      </span>
                    </div>
                  </div>

                  {project.description && (
                    <p className="text-sm text-slate-600 mb-6 line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  <button
                    onClick={() => handlePaymentClick(project)}
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
                  >
                    <DollarSign size={18} /> Bayar Sekarang
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {/* Payment History */}
          {payments.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl">
              <CheckCircle2 size={48} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-600 font-semibold">Tidak ada riwayat pembayaran</p>
              <p className="text-slate-400 text-sm mt-1">Pembayaran Anda akan muncul di sini</p>
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map(payment => (
                <div
                  key={payment.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-between hover:shadow-lg transition-shadow"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-800">
                      {payment.projectTitle}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {new Date(payment.createdAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-600">
                      {payment.amount}
                    </p>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 mt-2">
                      <CheckCircle2 size={12} /> Selesai
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Payment Modal */}
      {paymentModal.isOpen && paymentModal.project && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-100 px-8 py-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <CreditCard size={20} className="text-amber-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Pembayaran</h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {paymentModal.project.title}
                  </p>
                </div>
              </div>
              {step !== 'processing' && (
                <button
                  onClick={closePaymentModal}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Content */}
            <div className="px-8 py-8">
              {step === 'confirmation' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-800">
                    Konfirmasi Pembayaran
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <span className="text-slate-600">Proyek</span>
                      <span className="font-semibold text-slate-800">
                        {paymentModal.project.title}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <span className="text-slate-600">Jumlah</span>
                      <span className="text-2xl font-bold text-amber-600">
                        {paymentModal.project.reward}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <span className="text-slate-600">Kategori</span>
                      <span className="font-semibold text-slate-800">
                        {paymentModal.project.category}
                      </span>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-900">
                      ℹ️ Pembayaran akan diproses melalui wallet Solana Anda
                    </p>
                  </div>

                  <button
                    onClick={handleConfirmPayment}
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-4 rounded-xl font-bold hover:shadow-lg transition-shadow"
                  >
                    Lanjutkan Pembayaran
                  </button>
                </div>
              )}

              {step === 'wallet' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-800">
                    Masukkan Wallet Address
                  </h3>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Solana Wallet Address
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 7xLk... atau wallet pubkey Anda"
                      value={walletAddress}
                      onChange={e => setWalletAddress(e.target.value)}
                      disabled={isProcessing}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-50 disabled:text-slate-400"
                    />
                    <p className="text-xs text-slate-500 mt-2">
                      Pastikan address sudah benar sebelum melanjutkan
                    </p>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <p className="text-sm text-emerald-900">
                      ✓ Wallet Anda aman dan terenkripsi
                    </p>
                  </div>

                  <button
                    onClick={handleProcessPayment}
                    disabled={isProcessing || !walletAddress.trim()}
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-4 rounded-xl font-bold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Memproses...' : 'Proses Pembayaran'}
                  </button>

                  <button
                    onClick={() => setStep('confirmation')}
                    disabled={isProcessing}
                    className="w-full border-2 border-slate-200 text-slate-800 py-4 rounded-xl font-bold hover:bg-slate-50 transition-colors disabled:opacity-50"
                  >
                    Kembali
                  </button>
                </div>
              )}

              {step === 'processing' && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-200 border-t-amber-600 mx-auto mb-6"></div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">
                    Memproses Pembayaran
                  </h3>
                  <p className="text-slate-600">
                    Mohon tunggu, jangan tutup halaman ini...
                  </p>
                </div>
              )}

              {step === 'success' && (
                <div className="text-center py-12 space-y-6">
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="animate-bounce absolute inset-0 bg-emerald-400 rounded-full opacity-20"></div>
                      <CheckCircle2 size={80} className="text-emerald-600 relative" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">
                      Pembayaran Berhasil!
                    </h3>
                    <p className="text-slate-600">
                      Terima kasih telah membayar. Proyek status diperbarui.
                    </p>
                  </div>
                  <div className="text-center text-sm text-slate-500">
                    Menutup modal dalam beberapa detik...
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
