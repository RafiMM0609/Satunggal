'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, FileText, Edit2, Save, X, Shield } from 'lucide-react';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  role: 'freelancer' | 'client';
  profileImage?: string;
  joinDate: string;
}

export default function ProfilPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser({
        id: parsedUser.id || 1,
        username: parsedUser.username || 'User',
        email: parsedUser.email || 'user@example.com',
        phone: parsedUser.phone || '+62 812-3456-7890',
        location: parsedUser.location || 'Jakarta, Indonesia',
        bio: parsedUser.bio || 'Seorang profesional yang passionate',
        role: parsedUser.role || 'freelancer',
        profileImage: parsedUser.profileImage,
        joinDate: parsedUser.joinDate || '2024-01-01',
      });
      setFormData({
        username: parsedUser.username,
        email: parsedUser.email,
        phone: parsedUser.phone || '+62 812-3456-7890',
        location: parsedUser.location || 'Jakarta, Indonesia',
        bio: parsedUser.bio || 'Seorang profesional yang passionate',
      });
    }
    setLoading(false);
  }, []);

  const handleEditChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser as UserProfile);
      setIsEditing(false);
      alert('Profil berhasil diperbarui!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Gagal memperbarui profil');
    }
  };

  if (loading || !user) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="max-w-3xl">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

        <div className="px-6 pb-6 relative">
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-16 mb-6">
            <div className="w-32 h-32 bg-amber-100 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-5xl overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" className="w-full h-full object-cover" />
            </div>

            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={formData.username || ''}
                  onChange={(e) => handleEditChange('username', e.target.value)}
                  className="text-3xl font-bold text-slate-800 border-b-2 border-blue-400 focus:outline-none mb-2 w-full"
                />
              ) : (
                <h1 className="text-3xl font-bold text-slate-800 mb-2">{user.username}</h1>
              )}
              <div className="flex items-center gap-2 text-slate-600">
                <Shield size={16} />
                <span className="text-sm font-semibold capitalize">
                  {user.role === 'freelancer' ? 'Freelancer' : 'Klien'}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                if (isEditing) {
                  handleSave();
                } else {
                  setIsEditing(true);
                }
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors ${
                isEditing
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isEditing ? (
                <>
                  <Save size={18} /> Simpan
                </>
              ) : (
                <>
                  <Edit2 size={18} /> Edit Profil
                </>
              )}
            </button>

            {isEditing && (
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    username: user.username,
                    email: user.email,
                    phone: user.phone,
                    location: user.location,
                    bio: user.bio,
                  });
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
              >
                <X size={18} /> Batal
              </button>
            )}
          </div>

          {/* Profile Info */}
          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                <Mail size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-500">Email</p>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleEditChange('email', e.target.value)}
                    className="text-slate-800 font-medium w-full border-b border-blue-300 focus:outline-none py-1"
                  />
                ) : (
                  <p className="text-slate-800 font-medium">{user.email}</p>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                <Phone size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-500">Nomor Telepon</p>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handleEditChange('phone', e.target.value)}
                    className="text-slate-800 font-medium w-full border-b border-blue-300 focus:outline-none py-1"
                  />
                ) : (
                  <p className="text-slate-800 font-medium">{user.phone}</p>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
                <MapPin size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-500">Lokasi</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => handleEditChange('location', e.target.value)}
                    className="text-slate-800 font-medium w-full border-b border-blue-300 focus:outline-none py-1"
                  />
                ) : (
                  <p className="text-slate-800 font-medium">{user.location}</p>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                <FileText size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-500">Bio</p>
                {isEditing ? (
                  <textarea
                    value={formData.bio || ''}
                    onChange={(e) => handleEditChange('bio', e.target.value)}
                    className="text-slate-800 font-medium w-full border border-blue-300 focus:outline-none p-2 rounded-lg resize-none"
                    rows={3}
                  />
                ) : (
                  <p className="text-slate-800 font-medium">{user.bio}</p>
                )}
              </div>
            </div>

            {/* Join Date */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                📅
              </div>
              <div>
                <p className="text-sm text-slate-500">Bergabung sejak</p>
                <p className="text-slate-800 font-medium">{new Date(user.joinDate).toLocaleDateString('id-ID')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Shield size={24} /> Keamanan
        </h2>
        <button className="w-full px-6 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold text-slate-700 transition-colors text-left">
          Ubah Password
        </button>
      </div>
    </div>
  );
}
