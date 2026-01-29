'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, LayoutGrid, Clock, FileCheck, Wallet, User, LogOut, Bell } from 'lucide-react';

interface SidebarProps {
  user: any;
  onLogout: () => void;
}

const NavItem = ({ 
  href, 
  icon, 
  label, 
  active = false, 
  onClick 
}: { 
  href?: string; 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean; 
  onClick?: () => void;
}) => {
  const className = `flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-300 ${
    active
      ? 'bg-blue-50 text-blue-600 font-bold'
      : 'text-slate-400 font-medium hover:text-slate-700 hover:bg-slate-50'
  }`;

  if (href) {
    return (
      <Link href={href} className={className}>
        <span className={active ? 'text-blue-600' : 'text-slate-400'}>{icon}</span>
        <span className="hidden md:block text-sm">{label}</span>
      </Link>
    );
  }

  return (
    <div onClick={onClick} className={className}>
      <span className={active ? 'text-blue-600' : 'text-slate-400'}>{icon}</span>
      <span className="hidden md:block text-sm">{label}</span>
    </div>
  );
};

export default function Sidebar({ user, onLogout }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-20 md:w-64 bg-white/80 backdrop-blur-sm border-r border-blue-100 hidden md:flex flex-col py-8 z-20">
      <div className="px-8 mb-10 flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
          <Briefcase size={20} strokeWidth={2.5} />
        </div>
        <span className="font-bold text-xl text-slate-800 tracking-tight">WorkSpace</span>
      </div>

      <nav className="flex flex-col gap-2 w-full px-4 flex-1">
        <NavItem 
          href="/dashboard" 
          icon={<LayoutGrid size={20} />} 
          label="Overview" 
          active={pathname === '/dashboard'}
        />
        {user?.role === 'freelancer' && (
          <NavItem 
            href="/dashboard/pekerjaan" 
            icon={<Clock size={20} />} 
            label="Pekerjaan" 
            active={pathname === '/dashboard/pekerjaan'}
          />
        )}
        {user?.role === 'client' && (
          <NavItem 
            href="/dashboard/review" 
            icon={<FileCheck size={20} />} 
            label="Review" 
            active={pathname === '/dashboard/review'}
          />
        )}
        <NavItem 
          href="/dashboard/keuangan" 
          icon={<Wallet size={20} />} 
          label="Keuangan" 
          active={pathname === '/dashboard/keuangan'}
        />
        <div className="mt-auto pt-8 border-t border-slate-100">
          <NavItem 
            href="/dashboard/profil" 
            icon={<User size={20} />} 
            label="Profil Saya" 
            active={pathname === '/dashboard/profil'}
          />
        </div>
      </nav>

      <div className="px-4 pt-4 border-t border-slate-100">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 font-medium hover:text-red-600 hover:bg-red-50 transition-all duration-300"
          title="Logout"
        >
          <LogOut size={20} />
          <span className="hidden md:block text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
