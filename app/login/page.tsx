'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Briefcase, Github } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F5FA] flex items-center justify-center p-4 md:p-6 font-sans">
      <div className="bg-white rounded-[2.5rem] shadow-xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-blue-50">
        
        {/* Left Side: Form Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
          
          {/* Logo Header */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Briefcase size={20} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-2xl text-slate-800 tracking-tight">WorkSpace</span>
          </div>

          <div className="max-w-sm w-full mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Selamat Datang Kembali!
            </h2>
            <p className="text-slate-500 mb-8">
              Siap untuk menyelesaikan target hari ini?
            </p>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl mb-6 text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 ml-3">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="alex@workspace.com"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-2xl px-12 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center ml-3 mr-1">
                  <label className="text-xs font-bold text-slate-600">Password</label>
                  <Link href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700">Lupa password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-2xl px-12 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 font-medium"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold rounded-2xl py-4 shadow-lg shadow-blue-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group mt-4"
              >
                {loading ? 'Memproses...' : 'Masuk Sekarang'}
                {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            {/* Social Login / Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-slate-400 font-medium">Atau lanjut dengan</span>
              </div>
            </div>

            <div className="flex gap-4">
              <SocialButton icon={<Github size={20} />} label="Github" />
              <SocialButton icon={<div className="font-bold text-lg">G</div>} label="Google" />
            </div>

            {/* Toggle Link */}
            <p className="text-center mt-8 text-slate-600 text-sm font-medium">
              Belum punya akun?{' '}
              <Link 
                href="/register"
                className="text-blue-600 hover:text-blue-800 font-bold transition-colors"
              >
                Daftar disini
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side: Visual / Quote Section */}
        <div className="hidden md:flex w-1/2 bg-[#F8FAFC] p-12 relative items-center justify-center overflow-hidden">
          
          {/* Abstract Decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          {/* Testimonial Card */}
          <div className="relative z-10 max-w-sm">
            <div className="bg-white/80 backdrop-blur-md border border-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50">
              <div className="flex gap-1 text-amber-400 mb-4">
                 {[1,2,3,4,5].map(i => (
                   <span key={i} className="text-lg">★</span>
                 ))}
              </div>
              <p className="text-slate-700 font-medium text-lg leading-relaxed mb-6">
                "WorkSpace mengubah cara saya mengelola proyek freelance. Tampilannya bersih, tidak membingungkan, dan membuat mood kerja jadi lebih positif!"
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                    alt="User" 
                    className="w-full h-full object-cover bg-amber-100" 
                  />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Felix Januar</h4>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">UI Designer</p>
                </div>
              </div>
            </div>

            {/* Floating Elements decoration */}
            <div className="absolute -right-8 -top-8 bg-blue-600 text-white p-4 rounded-2xl shadow-lg shadow-blue-300 animate-bounce">
              <Briefcase size={24} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Simple Footer */}
      <div className="fixed bottom-6 text-center w-full text-slate-400 text-xs font-medium pointer-events-none">
        &copy; 2024 WorkSpace Inc.
      </div>
    </div>
  );
}

const SocialButton = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <button 
    type="button"
    className="flex-1 flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-700 py-3 rounded-2xl transition-all font-semibold text-sm"
  >
    {icon} {label}
  </button>
);
