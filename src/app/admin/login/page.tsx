"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        setError('Geçersiz şifre. Lütfen tekrar deneyin.');
      }
    } catch {
      setError('Bağlantı hatası.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#1a2332] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 border-2 border-[#b8860b] flex items-center justify-center">
              <span className="text-[#b8860b] font-serif text-xl font-bold">L</span>
            </div>
            <span className="text-white font-serif text-xl font-bold tracking-wide">
              LEGAL<span className="font-light text-[#b8860b]">INSIGHTS</span>
            </span>
          </div>
          <p className="text-white/40 text-sm">Yönetim Paneli</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#b8860b]/20 flex items-center justify-center">
              <Lock className="w-5 h-5 text-[#b8860b]" />
            </div>
            <div>
              <h1 className="text-lg font-serif font-bold text-white">Giriş</h1>
              <p className="text-white/40 text-xs">Devam etmek için şifrenizi girin</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">
                Şifre
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoFocus
                  required
                  className="w-full bg-white/5 border border-white/20 text-white placeholder:text-white/20 px-4 py-3 text-sm focus:outline-none focus:border-[#b8860b] transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-[#b8860b] hover:bg-[#d4a843] disabled:opacity-50 text-white py-3 text-sm font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              {loading ? 'Giriş yapılıyor...' : (
                <>Giriş Yap <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          © {new Date().getFullYear()} LegalInsights
        </p>
      </div>
    </div>
  );
}
