'use client';

import React, { useState } from 'react';
import {
  X,
  Wallet,
  Copy,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  projectTitle: string;
  amount: number;
  onClose: () => void;
  onPayment: (walletAddress: string) => void;
}

export default function PaymentModal({
  isOpen,
  projectTitle,
  amount,
  onClose,
  onPayment,
}: PaymentModalProps) {
  const [step, setStep] = useState<'confirmation' | 'wallet' | 'processing' | 'success'>('confirmation');
  const [walletAddress, setWalletAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirmPayment = () => {
    setStep('wallet');
  };

  const handleConnectWallet = async () => {
    if (!walletAddress.trim()) {
      alert('Mohon masukkan alamat wallet');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStep('processing');

      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStep('success');

      onPayment(walletAddress);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (step !== 'processing') {
      setStep('confirmation');
      setWalletAddress('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Wallet size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Pembayaran</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{projectTitle}</p>
            </div>
          </div>
          {step !== 'processing' && (
            <button
              onClick={handleClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={20} className="text-slate-500" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Confirmation Step */}
          {step === 'confirmation' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
                <p className="text-sm text-slate-600 font-medium mb-2">Total Pembayaran</p>
                <p className="text-4xl font-black text-slate-800 mb-1">
                  Rp {amount.toLocaleString('id-ID')}
                </p>
                <p className="text-xs text-slate-500">
                  Jaringan: Solana (SOL)
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-700">Detail Pembayaran</h3>
                <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Project</span>
                    <span className="text-sm font-semibold text-slate-800">{projectTitle}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                    <span className="text-sm text-slate-600">Jumlah</span>
                    <span className="text-sm font-bold text-slate-800">Rp {amount.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                <p className="text-sm text-emerald-900 font-medium">
                  ✓ Pastikan semua detail pembayaran sudah benar sebelum melanjutkan
                </p>
              </div>
            </div>
          )}

          {/* Wallet Step */}
          {step === 'wallet' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-slate-800 mb-4">Pilih Metode Pembayaran</h3>
                
                <div className="space-y-3">
                  <button className="w-full border-2 border-blue-300 bg-blue-50 rounded-2xl p-4 hover:bg-blue-100 transition-colors flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-lg">
                      🔗
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-slate-800 text-sm">Phantom Wallet</p>
                      <p className="text-xs text-slate-500">Dompet Solana favorit</p>
                    </div>
                    <ArrowRight size={18} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </button>

                  <button className="w-full border-2 border-slate-300 rounded-2xl p-4 hover:border-slate-400 transition-colors flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-lg">
                      💳
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-slate-800 text-sm">Sollet Wallet</p>
                      <p className="text-xs text-slate-500">Wallet Solana web</p>
                    </div>
                    <ArrowRight size={18} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </button>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500 font-medium">atau</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">
                  Masukkan Alamat Wallet Solana
                </label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Contoh: 9B5X6..."
                  className="w-full p-4 rounded-2xl border border-slate-200 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium text-sm"
                />
                <p className="text-xs text-slate-400 mt-2">
                  Alamat Solana publik Anda (dimulai dengan huruf atau angka)
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <p className="text-sm text-amber-900 font-medium">
                  ⚠️ Pastikan Anda menggunakan alamat wallet yang benar. Transaksi tidak dapat dibatalkan.
                </p>
              </div>
            </div>
          )}

          {/* Processing Step */}
          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <Wallet size={32} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Memproses Pembayaran</h3>
              <p className="text-sm text-slate-500 text-center mb-6">
                Menghubungkan ke blockchain Solana...
              </p>
              <div className="w-full max-w-sm h-1 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{
                  animation: 'pulse 1.5s ease-in-out infinite'
                }}></div>
              </div>
            </div>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <CheckCircle2 size={32} className="text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Pembayaran Berhasil!</h3>
              <p className="text-sm text-slate-500 text-center mb-6">
                Transaksi Anda telah dikonfirmasi di blockchain Solana
              </p>
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 w-full mb-6">
                <p className="text-xs text-slate-500 font-medium mb-2">Wallet Address:</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-mono text-slate-800 break-all">{walletAddress.substring(0, 10)}...{walletAddress.substring(-10)}</p>
                  <button className="p-1 hover:bg-slate-200 rounded transition-colors">
                    <Copy size={16} className="text-slate-500" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-100 px-8 py-6 flex gap-3 justify-end">
          {step === 'confirmation' && (
            <>
              <button
                onClick={handleClose}
                className="px-6 py-3 rounded-2xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmPayment}
                className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Lanjutkan <ArrowRight size={16} />
              </button>
            </>
          )}

          {step === 'wallet' && (
            <>
              <button
                onClick={() => setStep('confirmation')}
                disabled={isProcessing}
                className="px-6 py-3 rounded-2xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                Kembali
              </button>
              <button
                onClick={handleConnectWallet}
                disabled={!walletAddress.trim() || isProcessing}
                className="px-6 py-3 rounded-2xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Wallet size={16} />
                Bayar Sekarang
              </button>
            </>
          )}

          {step === 'success' && (
            <button
              onClick={handleClose}
              className="px-6 py-3 rounded-2xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors w-full"
            >
              Selesai
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
