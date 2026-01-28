import React, { useState } from 'react';
import { 
  LayoutGrid, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Wallet,
  MoreHorizontal,
  Plus,
  ArrowRight,
  User,
  Search,
  Bell,
  Briefcase // Mengganti Sparkles dengan Briefcase
} from 'lucide-react';

const App = () => {
  // Mock Data Awal
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Desain Maskot Brand Sereal",
      client: "Sereal Jaya Makmur",
      status: "in_progress",
      deadline: "2 hari lagi",
      reward: "Rp 2.500.000",
      category: "Illustration"
    },
    {
      id: 2,
      title: "Revisi Landing Page UI/UX",
      client: "Startup Kilat",
      status: "revision",
      deadline: "Besok",
      reward: "Rp 1.200.000",
      category: "Web Design"
    },
    {
      id: 3,
      title: "Optimasi SEO Artikel Blog",
      client: "Media Sehat",
      status: "pending_review",
      deadline: "Selesai",
      reward: "Rp 800.000",
      category: "SEO"
    },
    {
      id: 4,
      title: "Video Animasi Promosi",
      client: "EduKids",
      status: "pending_review",
      deadline: "Selesai",
      reward: "Rp 4.000.000",
      category: "Motion Graphic"
    }
  ]);

  // Fungsi untuk Submit Pekerjaan
  const handleSubmitWork = (id) => {
    setJobs(jobs.map(job => 
      job.id === id ? { ...job, status: 'pending_review', deadline: 'Selesai' } : job
    ));
  };

  const inProgressJobs = jobs.filter(j => j.status === 'in_progress' || j.status === 'revision');
  const waitingJobs = jobs.filter(j => j.status === 'pending_review');

  return (
    <div className="min-h-screen bg-[#F0F5FA] font-sans text-slate-800">
      {/* Sidebar - Sedikit lebih hangat dengan border yang tidak terlalu keras */}
      <aside className="fixed left-0 top-0 h-full w-20 md:w-64 bg-white/80 backdrop-blur-sm border-r border-blue-100 hidden md:flex flex-col py-8 z-20">
        <div className="px-8 mb-10 flex items-center gap-3">
          {/* Logo diganti menjadi Briefcase agar lebih 'freelance' */}
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <Briefcase size={20} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-xl text-slate-800 tracking-tight">WorkSpace</span>
        </div>
        
        <nav className="flex flex-col gap-2 w-full px-4">
          <NavItem icon={<LayoutGrid size={20} />} label="Overview" active />
          <NavItem icon={<Clock size={20} />} label="Pekerjaan" />
          <NavItem icon={<Wallet size={20} />} label="Keuangan" />
          <div className="mt-auto pt-8 border-t border-slate-100">
            <NavItem icon={<User size={20} />} label="Profil Saya" />
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 p-6 md:p-10 max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-amber-100 rounded-full overflow-hidden border-4 border-white shadow-sm">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Halo, Alex! 👋
              </h1>
              <p className="text-slate-500 font-medium">Semangat berkarya hari ini.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors shadow-sm">
              <Bell size={20} />
            </button>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 hover:-translate-y-0.5 transform duration-200">
              <Plus size={18} strokeWidth={3} /> Project Baru
            </button>
          </div>
        </header>

        {/* Stats Grid - Warna Warni & Tidak Putih Polos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard 
            label="Sedang Dikerjakan" 
            count={inProgressJobs.length} 
            theme="blue"
            icon={<Clock size={24} />}
          />
          <StatCard 
            label="Menunggu Review" 
            count={waitingJobs.length} 
            theme="amber"
            icon={<Clock size={24} />} // Atau icon wait
          />
          <StatCard 
            label="Total Selesai" 
            count="24" 
            theme="emerald"
            icon={<CheckCircle2 size={24} />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Section 1: In Progress - Nuansa Biru Muda */}
          <section className="bg-blue-50/50 p-6 rounded-[2rem]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                In Progress
              </h2>
              <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                {inProgressJobs.length} Aktif
              </span>
            </div>
            
            <div className="space-y-4">
              {inProgressJobs.map(job => (
                <div key={job.id} className="bg-white p-5 rounded-3xl shadow-sm border border-blue-100/50 hover:shadow-md hover:border-blue-200 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <span className="text-[11px] font-bold tracking-wider text-blue-400 uppercase mb-1 block">
                        {job.category}
                      </span>
                      <h3 className="font-bold text-lg text-slate-800 leading-tight mb-1">{job.title}</h3>
                      <p className="text-sm text-slate-400 font-medium">{job.client}</p>
                    </div>
                    {job.status === 'revision' ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold bg-rose-100 text-rose-600 px-3 py-1.5 rounded-xl animate-pulse">
                        <AlertCircle size={12} /> REVISI
                      </span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-blue-400 mt-2"></span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 mb-5">
                    <div className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg font-medium ${job.deadline === 'Besok' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                      <Clock size={14} /> 
                      <span>{job.deadline}</span>
                    </div>
                    <div className="text-slate-700 font-bold text-sm">{job.reward}</div>
                  </div>

                  <button 
                    onClick={() => handleSubmitWork(job.id)}
                    className="w-full py-3 rounded-2xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                  >
                    Kirim Hasil <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Waiting Payment - Nuansa Kuning/Amber Muda */}
          <section className="bg-amber-50/50 p-6 rounded-[2rem]">
             <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <div className="w-2 h-6 bg-amber-400 rounded-full"></div>
                Pending Payment
              </h2>
              <span className="bg-white text-amber-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                {waitingJobs.length} Menunggu
              </span>
            </div>

            <div className="space-y-4">
              {waitingJobs.map(job => (
                <div key={job.id} className="bg-[#FFFDF5] p-5 rounded-3xl border border-amber-100 shadow-sm relative overflow-hidden group">
                  {/* Pattern background decoration */}
                  <div className="absolute -right-4 -top-4 w-20 h-20 bg-amber-100/50 rounded-full blur-2xl group-hover:bg-amber-200/50 transition-colors"></div>

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-base text-slate-800">{job.title}</h3>
                        <p className="text-xs text-slate-400 font-medium mt-1">{job.client}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="px-3 py-1 bg-white border border-amber-100 rounded-xl text-[10px] font-bold text-amber-600 shadow-sm">
                          Review
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-amber-100">
                      <div className="text-lg font-black text-slate-700">{job.reward}</div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-100/50 px-3 py-1.5 rounded-full">
                         Menunggu Bayar
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {waitingJobs.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-3xl border-2 border-dashed border-amber-200 bg-amber-50/30">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-amber-300 mb-3 shadow-sm">
                    <Wallet size={20} />
                  </div>
                  <p className="text-slate-600 text-sm font-bold">Dompet aman!</p>
                  <p className="text-slate-400 text-xs mt-1">Belum ada tagihan yang nyangkut.</p>
                </div>
              )}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

// NavItem
const NavItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-300 ${
    active 
      ? 'bg-blue-50 text-blue-600 font-bold' 
      : 'text-slate-400 font-medium hover:text-slate-700 hover:bg-slate-50'
  }`}>
    <span className={active ? 'text-blue-600' : 'text-slate-400'}>{icon}</span>
    <span className="hidden md:block text-sm">{label}</span>
  </div>
);

// StatCard dengan Tema Warna
const StatCard = ({ label, count, theme, icon }) => {
  const themes = {
    blue: "bg-blue-100 text-blue-900 border-blue-200",
    amber: "bg-amber-100 text-amber-900 border-amber-200",
    emerald: "bg-emerald-100 text-emerald-900 border-emerald-200",
  };
  
  const iconThemes = {
    blue: "bg-white text-blue-600",
    amber: "bg-white text-amber-600",
    emerald: "bg-white text-emerald-600",
  };

  return (
    <div className={`${themes[theme]} p-6 rounded-[2rem] border transition-all hover:scale-[1.02] cursor-default flex flex-col justify-between h-32 relative overflow-hidden`}>
      {/* Background decoration */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
      
      <div className="flex justify-between items-start relative z-10">
        <div className="text-4xl font-black tracking-tight">{count}</div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${iconThemes[theme]}`}>
            {icon}
        </div>
      </div>
      <div className="text-sm font-bold opacity-80 uppercase tracking-wide relative z-10 mt-auto">
        {label}
      </div>
    </div>
  );
};

export default App;