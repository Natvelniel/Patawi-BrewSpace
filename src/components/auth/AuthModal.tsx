import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { DEMO_USERS } from '../../data/coffeeProducts';
import {
  X,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { showAuthModal, setShowAuthModal, login, currentUser, isLoggedIn, logout } = useStore();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const maskEmail = (em: string) => {
    const parts = em.split('@');
    if (parts.length !== 2) return em;
    const [usr, domain] = parts;
    if (usr.length <= 4) return `${usr[0]}••••@${domain}`;
    return `${usr.slice(0, 3)}••••••${usr.slice(-2)}@${domain}`;
  };

  if (!showAuthModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      login(email, password);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/65 backdrop-blur-xs transition-opacity animate-in fade-in select-none p-0 md:p-4">
      <div
        className="w-full max-w-[420px] bg-[#FAF7F2] rounded-t-[32px] md:rounded-[32px] max-h-[92vh] flex flex-col shadow-2xl border border-[#ECE4DA] overflow-hidden animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab Handle for Mobile */}
        <div className="pt-3 pb-1 flex justify-center md:hidden">
          <div className="w-12 h-1 bg-[#D9CEC5] rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-[#ECE4DA] bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#26160F] text-[#FDB882] flex items-center justify-center font-serif text-sm font-bold shadow-xs">
              P
            </div>
            <div>
              <h3 className="font-serif text-[17px] font-bold text-[#26160F] leading-tight">
                {isLoggedIn ? 'Akun Patawi Coffee' : authMode === 'login' ? 'Masuk ke Akun' : 'Daftar Akun Baru'}
              </h3>
              <p className="text-[11px] text-[#75645C]">
                {isLoggedIn ? 'Kelola keanggotaan & profil seduhan' : 'Akses diskon khusus member & lacak pesanan'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAuthModal(false)}
            className="w-8 h-8 rounded-full bg-[#EFE8E0] text-[#75645C] hover:text-[#26160F] hover:bg-[#E5DCD2] flex items-center justify-center transition-colors cursor-pointer active:scale-95"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 no-scrollbar">
          {/* If already logged in, show current user profile card with logout */}
          {isLoggedIn && currentUser ? (
            <div className="space-y-4">
              <div className="bg-white p-4.5 rounded-2xl depth-card space-y-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#C86826] bg-[#FAF7F2] shrink-0">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-serif text-[17px] font-bold text-[#26160F] truncate">
                        {currentUser.name}
                      </h4>
                      <Sparkles className="w-3.5 h-3.5 text-[#C86826] shrink-0" />
                    </div>
                    <p className="text-xs text-[#75645C] font-mono tracking-tight truncate">
                      {currentUser.role === 'customer' ? maskEmail(currentUser.email) : currentUser.email}
                    </p>
                    <span className="inline-flex items-center gap-1 mt-1 text-[10.5px] font-bold bg-[#FDF3EB] text-[#865225] px-2.5 py-0.5 rounded-full border border-[#FDB882]/40">
                      {currentUser.tier} • {currentUser.points.toLocaleString('id-ID')} Poin
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F4EFE9] flex items-center justify-between text-xs text-[#5C4D46]">
                  <span>Status Peran:</span>
                  <span className="font-bold uppercase tracking-wider text-[#26160F] bg-[#FAF7F2] px-2.5 py-0.5 rounded-md border border-[#ECE4DA]">
                    {currentUser.role}
                  </span>
                </div>
              </div>

              {/* Switch Role Quick Actions */}
              <div>
                <span className="text-[11px] font-bold text-[#75645C] uppercase tracking-wider block mb-2">
                  Ganti Akun Demo Seketika:
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {DEMO_USERS.map((u) => {
                    const isCurrent = currentUser?.id === u.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => login(u)}
                        className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-[#26160F] text-white border-[#26160F] shadow-xs'
                            : 'bg-white text-[#26160F] border-[#ECE4DA] hover:bg-[#FAF7F2]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-8 h-8 rounded-full object-cover shrink-0 border border-white/20"
                          />
                          <div className="truncate">
                            <span className="text-xs font-bold block truncate">{u.name}</span>
                            <span
                              className={`text-[10px] ${
                                isCurrent ? 'text-[#FDB882]' : 'text-[#75645C]'
                              }`}
                            >
                              {u.tier} ({u.role})
                            </span>
                          </div>
                        </div>
                        {isCurrent && <CheckCircle2 className="w-4 h-4 text-[#FDB882] shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="w-full py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer"
              >
                Keluar dari Akun
              </button>
            </div>
          ) : (
            <>
              {/* Tabs: Masuk vs Daftar */}
              <div className="bg-[#EFE8E0] p-1 rounded-2xl flex items-center text-xs font-bold">
                <button
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-white text-[#26160F] shadow-xs'
                      : 'text-[#75645C] hover:text-[#26160F]'
                  }`}
                >
                  Masuk
                </button>
                <button
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                    authMode === 'register'
                      ? 'bg-white text-[#26160F] shadow-xs'
                      : 'text-[#75645C] hover:text-[#26160F]'
                  }`}
                >
                  Daftar
                </button>
              </div>

              {/* Quick 1-Click Demo Login Bar */}
              <div className="bg-[#FDF3EB] p-3 rounded-2xl border border-[#FDB882]/40 space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#865225]">
                  <Sparkles className="w-3.5 h-3.5 text-[#C86826]" />
                  Akses Demo Langsung (1-Klik):
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-center text-[10.5px]">
                  <button
                    onClick={() => login(DEMO_USERS[0])}
                    className="bg-white hover:bg-[#FAF7F2] p-2 rounded-xl border border-[#ECE4DA] font-semibold text-[#26160F] transition-all cursor-pointer active:scale-95"
                  >
                    👤 Nathaniel
                    <span className="block text-[9px] text-[#75645C]">Customer</span>
                  </button>
                  <button
                    onClick={() => login(DEMO_USERS[1])}
                    className="bg-white hover:bg-[#FAF7F2] p-2 rounded-xl border border-[#ECE4DA] font-semibold text-[#26160F] transition-all cursor-pointer active:scale-95"
                  >
                    ☕ Budi
                    <span className="block text-[9px] text-[#75645C]">Roaster</span>
                  </button>
                  <button
                    onClick={() => login(DEMO_USERS[2])}
                    className="bg-white hover:bg-[#FAF7F2] p-2 rounded-xl border border-[#ECE4DA] font-semibold text-[#26160F] transition-all cursor-pointer active:scale-95"
                  >
                    🛵 Rian
                    <span className="block text-[9px] text-[#75645C]">Kurir</span>
                  </button>
                </div>
              </div>

              {/* Form Input */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {authMode === 'register' && (
                  <div>
                    <label className="text-[11px] font-semibold text-[#75645C] block mb-1">
                      Nama Lengkap
                    </label>
                    <div className="flex items-center bg-white rounded-xl px-3.5 py-2.5 border border-[#ECE4DA] focus-within:border-[#26160F] transition-colors">
                      <User className="w-4 h-4 text-[#75645C] mr-2 shrink-0" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Contoh: Nathaniel Christian"
                        className="w-full bg-transparent text-xs text-[#26160F] focus:outline-hidden"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-semibold text-[#75645C] block mb-1">
                    Email atau No. Handphone
                  </label>
                  <div className="flex items-center bg-white rounded-xl px-3.5 py-2.5 border border-[#ECE4DA] focus-within:border-[#26160F] transition-colors">
                    <Mail className="w-4 h-4 text-[#75645C] mr-2 shrink-0" />
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com atau 0812..."
                      className="w-full bg-transparent text-xs text-[#26160F] focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#75645C] block mb-1">
                    Kata Sandi
                  </label>
                  <div className="flex items-center bg-white rounded-xl px-3.5 py-2.5 border border-[#ECE4DA] focus-within:border-[#26160F] transition-colors">
                    <Lock className="w-4 h-4 text-[#75645C] mr-2 shrink-0" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="w-full bg-transparent text-xs text-[#26160F] focus:outline-hidden"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[#75645C] hover:text-[#26160F] cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#26160F] hover:bg-[#3E2419] active:scale-[0.98] text-white py-3 rounded-xl text-xs font-bold shadow-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {authMode === 'login' ? 'Masuk Sekarang' : 'Daftar Akun'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
