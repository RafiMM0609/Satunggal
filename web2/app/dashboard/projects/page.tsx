'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Calendar,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import AddEditJobModal from '@/components/AddEditJobModal';

interface Project {
  id: number;
  title: string;
  client: string;
  status: 'open' | 'pending' | 'in_progress' | 'done' | 'revision' | 'pending_review';
  deadline: string;
  reward: string;
  category: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('open');
  const [user, setUser] = useState<any>(null);

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [addEditModalOpen, setAddEditModalOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, activeFilter]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = [...projects];

    if (searchTerm) {
      filtered = filtered.filter((project) =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeFilter !== 'all') {
      filtered = filtered.filter((p) => p.status === activeFilter);
    }

    setFilteredProjects(filtered);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setAddEditModalOpen(true);
  };

  const handleDeleteProject = async (projectId: number) => {
    if (!confirm('Yakin ingin menghapus project ini?')) return;

    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== projectId));
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const handleCreateProject = async (projectData: any) => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...projectData, userId: user?.id, userRole: user?.role }),
      });

      if (res.ok) {
        const newProject = await res.json();
        setProjects([newProject, ...projects]);
        setAddEditModalOpen(false);
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to create project');
      }
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Gagal membuat project');
    }
  };

  const handleSaveProject = async (projectData: any) => {
    if (editingProject) {
      try {
        const res = await fetch(`/api/projects/${editingProject.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData),
        });

        if (res.ok) {
          const updatedProject = await res.json();
          setProjects(projects.map((p) => (p.id === editingProject.id ? updatedProject : p)));
          setAddEditModalOpen(false);
          setEditingProject(null);
        } else {
          const error = await res.json();
          alert(error.error || 'Failed to update project');
        }
      } catch (error) {
        console.error('Failed to save project:', error);
        alert('Gagal menyimpan project');
      }
    }
  };

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
      default:
        return status;
    }
  };

  const filterTabs = [
    { id: 'open', label: 'Terbuka', count: projects.filter((p) => p.status === 'open').length },
    { id: 'pending', label: 'Menunggu', count: projects.filter((p) => p.status === 'pending').length },
    { id: 'in_progress', label: 'Sedang Dikerjakan', count: projects.filter((p) => p.status === 'in_progress').length },
    { id: 'done', label: 'Selesai', count: projects.filter((p) => p.status === 'done').length },
    { id: 'all', label: 'Semua', count: projects.length },
  ];

  if (!user?.role || user.role !== 'client') {
    return (
      <div className="min-h-screen bg-[#F0F5FA] font-sans text-slate-800">
        <main className="p-6 md:p-10 max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50">
            <AlertCircle size={48} className="text-slate-400 mb-4" />
            <p className="text-slate-600 text-lg font-bold">Akses Ditolak</p>
            <p className="text-slate-400 text-sm mt-1">Hanya klien yang dapat mengelola projects</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F5FA] font-sans text-slate-800">
      <main className="p-6 md:p-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Daftar Project</h1>
            <p className="text-slate-500 font-medium">Kelola semua project Anda di sini</p>
          </div>

          <button
            onClick={() => {
              setEditingProject(null);
              setAddEditModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold shadow-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors transform duration-200 hover:-translate-y-0.5"
          >
            <Plus size={18} strokeWidth={3} /> Buat Project
          </button>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Cari project, klien, atau kategori..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3 rounded-2xl border-2 border-slate-200 font-medium focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-5 py-2.5 rounded-full font-bold whitespace-nowrap transition-all text-sm ${
                activeFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                  : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-blue-300'
              }`}
            >
              {tab.label} <span className="ml-1 opacity-70">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-slate-600 font-semibold">Loading...</div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50">
            <AlertCircle size={48} className="text-slate-400 mb-3" />
            <p className="text-slate-600 text-sm font-bold">Tidak ada project</p>
            <p className="text-slate-400 text-xs mt-1">Coba gunakan pencarian atau filter lain</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white p-6 rounded-3xl shadow-sm border border-blue-100/50 hover:shadow-md hover:border-blue-200 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap inline-block ${getStatusColor(project.status)}`}>
                      {getStatusLabel(project.status)}
                    </span>
                    <h3 className="font-bold text-lg text-slate-800 leading-tight mb-1 mt-2">{project.title}</h3>
                    <p className="text-sm text-slate-500 font-medium">{project.client}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditProject(project)}
                      className="p-2 hover:bg-amber-100 rounded-lg text-amber-600 transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="p-2 hover:bg-rose-100 rounded-lg text-rose-600 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <p className="text-[11px] font-bold tracking-wider text-blue-400 uppercase mb-4">{project.category}</p>

                <div className="space-y-2 mb-4 pb-4 border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Calendar size={14} className="text-amber-600" />
                    <span>{project.deadline}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <DollarSign size={14} className="text-emerald-600" />
                    <span>{project.reward}</span>
                  </div>
                </div>

                {project.description && (
                  <p className="text-xs text-slate-500 line-clamp-2">{project.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      <AddEditJobModal
        job={editingProject}
        isOpen={addEditModalOpen}
        onClose={() => {
          setAddEditModalOpen(false);
          setEditingProject(null);
        }}
        onSubmit={editingProject ? undefined : handleCreateProject}
        onSave={editingProject ? handleSaveProject : undefined}
        isProject={true}
      />
    </div>
  );
}
