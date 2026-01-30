'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Job {
  id: number;
  title: string;
  client: string;
  status: 'open' | 'pending' | 'in_progress' | 'done' | 'revision' | 'pending_review' | 'approved' | 'ready_payment' | 'paid';
  deadline: string;
  reward: string;
  category: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface AddEditJobModalProps {
  job: Job | null;
  isOpen?: boolean;
  onClose: () => void;
  onSubmit?: (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onSave?: (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => void;
  isProject?: boolean;
}

export default function AddEditJobModal({ job, isOpen = true, onClose, onSubmit, onSave, isProject = false }: AddEditJobModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    status: 'open' as const,
    deadline: '',
    reward: '',
    category: '',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        client: job.client,
        status: job.status as any,
        deadline: job.deadline,
        reward: job.reward,
        category: job.category,
        description: job.description || '',
      });
    } else {
      setFormData({
        title: '',
        client: '',
        status: 'open',
        deadline: '',
        reward: '',
        category: '',
        description: '',
      });
    }
    setErrors({});
  }, [job, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Judul harus diisi';
    if (!formData.client.trim()) newErrors.client = 'Klien harus diisi';
    if (!formData.deadline.trim()) newErrors.deadline = 'Deadline harus diisi';
    if (!formData.reward.trim()) newErrors.reward = 'Kompensasi harus diisi';
    if (!formData.category.trim()) newErrors.category = 'Kategori harus diisi';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (onSave && job) {
      onSave(formData);
    } else if (onSubmit) {
      onSubmit(formData);
    }
    
    setFormData({
      title: '',
      client: '',
      status: 'open',
      deadline: '',
      reward: '',
      category: '',
      description: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">
            {job ? (isProject ? 'Edit Project' : 'Edit Pekerjaan') : (isProject ? 'Buat Project Baru' : 'Tambah Pekerjaan Baru')}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{isProject ? 'Nama Project' : 'Judul Pekerjaan'} *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder={isProject ? 'Masukkan nama project' : 'Masukkan judul pekerjaan'}
              className={`w-full px-4 py-3 rounded-2xl border-2 font-medium focus:outline-none transition-colors ${
                errors.title
                  ? 'border-red-400 bg-red-50 text-red-700'
                  : 'border-slate-200 focus:border-blue-500'
              }`}
            />
            {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Client */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Klien *</label>
            <input
              type="text"
              name="client"
              value={formData.client}
              onChange={handleChange}
              placeholder="Nama klien atau perusahaan"
              className={`w-full px-4 py-3 rounded-2xl border-2 font-medium focus:outline-none transition-colors ${
                errors.client
                  ? 'border-red-400 bg-red-50 text-red-700'
                  : 'border-slate-200 focus:border-blue-500'
              }`}
            />
            {errors.client && <p className="text-red-600 text-sm mt-1">{errors.client}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Kategori *</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Contoh: Graphic Design, Web Development"
              className={`w-full px-4 py-3 rounded-2xl border-2 font-medium focus:outline-none transition-colors ${
                errors.category
                  ? 'border-red-400 bg-red-50 text-red-700'
                  : 'border-slate-200 focus:border-blue-500'
              }`}
            />
            {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 font-medium focus:outline-none focus:border-blue-500 transition-colors bg-white"
            >
              <option value="open">Terbuka</option>
              <option value="pending">Menunggu</option>
              <option value="in_progress">Sedang Dikerjakan</option>
              <option value="done">Selesai</option>
            </select>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Deadline *</label>
            <input
              type="text"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              placeholder="Contoh: 5 hari lagi, Besok"
              className={`w-full px-4 py-3 rounded-2xl border-2 font-medium focus:outline-none transition-colors ${
                errors.deadline
                  ? 'border-red-400 bg-red-50 text-red-700'
                  : 'border-slate-200 focus:border-blue-500'
              }`}
            />
            {errors.deadline && <p className="text-red-600 text-sm mt-1">{errors.deadline}</p>}
          </div>

          {/* Reward */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Kompensasi *</label>
            <input
              type="text"
              name="reward"
              value={formData.reward}
              onChange={handleChange}
              placeholder="Contoh: Rp 2.500.000"
              className={`w-full px-4 py-3 rounded-2xl border-2 font-medium focus:outline-none transition-colors ${
                errors.reward
                  ? 'border-red-400 bg-red-50 text-red-700'
                  : 'border-slate-200 focus:border-blue-500'
              }`}
            />
            {errors.reward && <p className="text-red-600 text-sm mt-1">{errors.reward}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Deskripsi detail pekerjaan (opsional)"
              rows={4}
              className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 font-medium focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-2xl border-2 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
            >
              {job ? (isProject ? 'Simpan Perubahan Project' : 'Simpan Perubahan') : (isProject ? 'Buat Project' : 'Tambah Pekerjaan')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
