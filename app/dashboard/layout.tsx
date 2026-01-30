'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, LogOut, Plus } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import AddEditJobModal from '@/components/AddEditJobModal';

interface LayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [projectModalOpen, setProjectModalOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleSubmitProject = async (projectData: any) => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...projectData, userId: user?.id, userRole: user?.role }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || 'Failed to create project');
        return;
      }

      setProjectModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Gagal membuat project');
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#F0F5FA] flex items-center justify-center">
        <div className="text-slate-600 font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F5FA] font-sans text-slate-800">
      <Sidebar user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="md:ml-64 p-6 md:p-10 max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-amber-100 rounded-full overflow-hidden border-4 border-white shadow-sm">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Halo, {user?.username}! 👋</h1>
              <p className="text-slate-500 font-medium">Semangat berkarya hari ini.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors shadow-sm">
              <Bell size={20} />
            </button>
            <button 
              onClick={handleLogout}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors shadow-sm"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
            {user?.role === 'client' && (
              <button 
                onClick={() => setProjectModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 hover:-translate-y-0.5 transform duration-200">
                <Plus size={18} strokeWidth={3} /> Project Baru
              </button>
            )}
          </div>
        </header>

        {children}
      </main>

      <AddEditJobModal
        job={null}
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        onSubmit={handleSubmitProject}
        isProject={true}
      />
    </div>
  );
}
