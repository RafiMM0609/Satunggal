'use client';

import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  Paperclip,
  Send,
} from 'lucide-react';

interface RevisionRequestModalProps {
  isOpen: boolean;
  projectTitle: string;
  onClose: () => void;
  onSubmit: (notes: string) => void;
}

export default function RevisionRequestModal({
  isOpen,
  projectTitle,
  onClose,
  onSubmit,
}: RevisionRequestModalProps) {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!notes.trim()) {
      alert('Mohon masukkan catatan revisi');
      return;
    }

    setIsSubmitting(true);
    try {
      onSubmit(notes);
      setNotes('');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <MessageSquare size={20} className="text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Ajukan Revisi</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{projectTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
            <p className="text-sm text-amber-800 font-medium">
              💡 <span className="ml-2">Jelaskan dengan detail apa yang perlu direvisi atau diperbaiki</span>
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">
                Catatan Revisi
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Ubah warna background menjadi biru, tambahkan fitur search, dll..."
                className="w-full p-4 rounded-2xl border border-slate-200 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-medium text-sm"
                rows={6}
              />
              <p className="text-xs text-slate-400 mt-2">
                {notes.length} karakter
              </p>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-sm font-bold text-slate-700 mb-3">Lampiran (Opsional)</h3>
              <button className="w-full border-2 border-dashed border-slate-300 rounded-2xl p-6 hover:border-slate-400 hover:bg-slate-50 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer group">
                <Paperclip size={24} className="text-slate-400 group-hover:text-slate-500" />
                <p className="text-sm font-semibold text-slate-600 group-hover:text-slate-700">
                  Klik atau drag file ke sini
                </p>
                <p className="text-xs text-slate-400">
                  Gambar, PDF, atau dokumen (Max: 10MB)
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-100 px-8 py-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-3 rounded-2xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !notes.trim()}
            className="px-6 py-3 rounded-2xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send size={16} />
            Kirim Revisi
          </button>
        </div>
      </div>
    </div>
  );
}
