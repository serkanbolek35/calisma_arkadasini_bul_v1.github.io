// src/components/layout/AppLayout.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, Settings, Menu, X } from 'lucide-react';
import { Logo } from './PublicLayout';
import { useAuth } from '../../context/AuthContext';
import { logoutUser } from '../../services/auth.service';

const navItems = [
  { icon: '📊', label: 'Dashboard', to: '/dashboard' },
  { icon: '🤝', label: 'Eşleşmeler', to: '/eslesmeler' },
  { icon: '⏱', label: 'Oturumlar', to: '/oturumlar' },
  { icon: '📈', label: 'İlerleme', to: '/ilerleme' },
  { icon: '🧠', label: 'Anket', to: '/anket' },
];

const AppLayout = ({ children, title }) => {
  const { currentUser, userDoc } = useAuth();
  const location = useLocation();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => { setLoggingOut(true); await logoutUser(); };

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b" style={{ borderColor: 'rgba(245,237,216,0.07)' }}>
        <Logo />
      </div>
      <div className="px-4 py-4 border-b" style={{ borderColor: 'rgba(245,237,216,0.07)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-display font-bold flex-shrink-0"
            style={{ background: 'var(--amber)', color: 'var(--ink)' }}>
            {userDoc?.displayName?.charAt(0) || currentUser?.email?.charAt(0) || '?'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-cream truncate">{userDoc?.displayName || 'Kullanıcı'}</p>
            <p className="text-xs truncate" style={{ color: 'var(--mist)' }}>{currentUser?.email}</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map(({ icon, label, to }) => {
          const active = location.pathname.startsWith(to);
          return (
            <Link key={to} to={to} onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body font-medium transition-all duration-200"
              style={{
                background: active ? 'rgba(232,160,32,0.1)' : 'transparent',
                color: active ? 'var(--amber)' : 'var(--mist)',
                border: active ? '1px solid rgba(232,160,32,0.2)' : '1px solid transparent',
              }}>
              <span className="text-base">{icon}</span>{label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t flex flex-col gap-1" style={{ borderColor: 'rgba(245,237,216,0.07)' }}>
        <Link to="/profil" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
          style={{ color: 'var(--mist)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--cream)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--mist)'}>
          <Settings size={16} /> Ayarlar
        </Link>
        <button onClick={handleLogout} disabled={loggingOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all w-full text-left"
          style={{ color: 'var(--mist)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--error)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--mist)'}>
          <LogOut size={16} /> {loggingOut ? 'Çıkılıyor...' : 'Çıkış Yap'}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-ink flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 flex-shrink-0 border-r"
        style={{ borderColor: 'rgba(245,237,216,0.07)' }}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 flex flex-col border-r"
            style={{ background: 'var(--ink-50)', borderColor: 'rgba(245,237,216,0.1)' }}>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="px-6 py-4 border-b flex items-center justify-between"
          style={{ borderColor: 'rgba(245,237,216,0.07)' }}>
          <div className="flex items-center gap-3">
            <button className="md:hidden p-1" onClick={() => setMobileOpen(true)}>
              <Menu size={20} className="text-cream" />
            </button>
            <h1 className="font-display text-xl font-semibold text-cream">{title}</h1>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
