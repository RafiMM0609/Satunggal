'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, Download, Filter, CreditCard, Wallet, Send } from 'lucide-react';

interface Transaction {
  id: number;
  jobTitle: string;
  amount: string;
  status: 'completed' | 'pending' | 'withdrawn';
  date: string;
  type: 'income' | 'withdrawal';
}

interface FinanceStats {
  totalEarned: string;
  totalPending: string;
  totalWithdrawn: string;
  monthlyIncome: string;
}

export default function KeuanganPage() {
  const [stats, setStats] = useState<FinanceStats>({
    totalEarned: 'Rp 50.000.000',
    totalPending: 'Rp 5.000.000',
    totalWithdrawn: 'Rp 45.000.000',
    monthlyIncome: 'Rp 8.500.000',
  });

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      jobTitle: 'Design Website Corporate',
      amount: 'Rp 15.000.000',
      status: 'completed',
      date: '2024-01-25',
      type: 'income',
    },
    {
      id: 2,
      jobTitle: 'Mobile App Development',
      amount: 'Rp 5.000.000',
      status: 'pending',
      date: '2024-01-20',
      type: 'income',
    },
    {
      id: 3,
      jobTitle: 'Withdrawal to Bank Account',
      amount: 'Rp 10.000.000',
      status: 'completed',
      date: '2024-01-15',
      type: 'withdrawal',
    },
  ]);

  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
    alert('Fitur withdraw akan segera tersedia. Hubungi support untuk bantuan.');
  };

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Penghasilan', value: stats.totalEarned, icon: '💰', color: 'blue' },
          { label: 'Menunggu Pembayaran', value: stats.totalPending, icon: '⏳', color: 'amber' },
          { label: 'Sudah Dicairkan', value: stats.totalWithdrawn, icon: '✅', color: 'emerald' },
          { label: 'Penghasilan Bulan Ini', value: stats.monthlyIncome, icon: '📈', color: 'purple' },
        ].map((stat, idx) => (
          <div key={idx} className={`p-6 rounded-2xl border ${
            stat.color === 'blue' ? 'bg-blue-50 border-blue-200' :
            stat.color === 'amber' ? 'bg-amber-50 border-amber-200' :
            stat.color === 'emerald' ? 'bg-emerald-50 border-emerald-200' :
            'bg-purple-50 border-purple-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              </div>
              <span className="text-4xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Withdraw Button */}
      <div className="mb-8">
        <button
          onClick={handleWithdraw}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-2xl font-semibold hover:shadow-lg transition-shadow"
        >
          <Send size={20} /> Tarik Dana
        </button>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Riwayat Transaksi</h2>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Filter">
              <Filter size={18} className="text-slate-600" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Download">
              <Download size={18} className="text-slate-600" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-6 py-4 font-bold text-slate-700">Deskripsi</th>
                <th className="text-left px-6 py-4 font-bold text-slate-700">Tipe</th>
                <th className="text-left px-6 py-4 font-bold text-slate-700">Jumlah</th>
                <th className="text-left px-6 py-4 font-bold text-slate-700">Status</th>
                <th className="text-left px-6 py-4 font-bold text-slate-700">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id} className="border-b border-slate-100 hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800">{tx.jobTitle}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 text-sm font-semibold ${
                      tx.type === 'income' ? 'text-emerald-700' : 'text-slate-700'
                    }`}>
                      {tx.type === 'income' ? (
                        <>
                          <TrendingUp size={16} /> Penghasilan
                        </>
                      ) : (
                        <>
                          <Send size={16} /> Pencairan
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-lg font-bold ${
                      tx.type === 'income' ? 'text-emerald-600' : 'text-slate-800'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'}{tx.amount}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      tx.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                      tx.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {tx.status === 'completed' ? 'Selesai' :
                       tx.status === 'pending' ? 'Menunggu' :
                       'Dicairkan'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {transactions.length === 0 && (
          <div className="text-center py-16">
            <Wallet size={48} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-600 font-semibold">Tidak ada transaksi</p>
            <p className="text-slate-400 text-sm mt-1">Mulai kerjakan pekerjaan untuk mendapatkan penghasilan</p>
          </div>
        )}
      </div>

      {/* Finance Tips */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
        <h3 className="text-lg font-bold text-slate-800 mb-3">💡 Tips Keuangan</h3>
        <ul className="space-y-2 text-slate-700">
          <li className="flex gap-2">
            <span>•</span>
            <span>Tarik dana setiap bulan untuk kelancaran arus kas Anda</span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span>Pantau penghasilan bulanan untuk merencanakan proyeksi masa depan</span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span>Bayar pajak tepat waktu sesuai peraturan pemerintah</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
