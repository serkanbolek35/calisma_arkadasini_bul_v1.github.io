// src/components/layout/PublicLayout.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Logo = () => (
  <Link to="/" className="flex items-center gap-2.5 group">
    <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
      style={{ background: 'var(--amber)' }}>
      <BookOpen size={16} color="var(--ink)" strokeWidth={2.5} />
    </div>
    <span className="font-display font-semibold text-cream text-lg tracking-tight leading-none">
      Çalışma<span style={{ color: 'var(--amber)' }}>.</span>
    </span>
  </Link>
);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  const navLinks = [
    { to: '/nasil-calisir', label: 'Nasıl Çalışır?' },
    { to: '/hakkimizda', label: 'Hakkımızda' },
    { to: '/sss', label: 'SSS' },
    { to: '/iletisim', label: 'İletişim' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'py-3' : 'py-5'
    }`}
      style={{
        background: scrolled
          ? 'rgba(13,13,13,0.92)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(245,237,216,0.08)' : 'none',
      }}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to}
              className="text-sm font-body font-medium transition-colors duration-200"
              style={{
                color: location.pathname === link.to ? 'var(--amber)' : 'var(--mist)',
              }}
              onMouseEnter={e => e.target.style.color = 'var(--cream)'}
              onMouseLeave={e => e.target.style.color = location.pathname === link.to ? 'var(--amber)' : 'var(--mist)'}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <Link to="/dashboard" className="btn-primary text-sm px-5 py-2.5">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/giris" className="btn-outline text-sm px-5 py-2.5">
                Giriş Yap
              </Link>
              <Link to="/kayit" className="btn-primary text-sm px-5 py-2.5">
                Kayıt Ol
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-cream p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 py-6 px-6 flex flex-col gap-4"
          style={{ background: 'rgba(13,13,13,0.98)', borderBottom: '1px solid rgba(245,237,216,0.08)' }}>
          {navLinks.map(link => (
            <Link key={link.to} to={link.to}
              className="text-base font-body font-medium py-1"
              style={{ color: location.pathname === link.to ? 'var(--amber)' : 'var(--cream)' }}>
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-3 pt-4 border-t" style={{ borderColor: 'rgba(245,237,216,0.1)' }}>
            {currentUser ? (
              <Link to="/dashboard" className="btn-primary text-center">Dashboard</Link>
            ) : (
              <>
                <Link to="/giris" className="btn-outline text-center">Giriş Yap</Link>
                <Link to="/kayit" className="btn-primary text-center">Kayıt Ol</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

const Footer = () => (
  <footer className="border-t py-12" style={{ borderColor: 'rgba(245,237,216,0.08)' }}>
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed max-w-xs" style={{ color: 'var(--mist)' }}>
            Üniversite öğrencilerini akademik çalışma amacıyla eşleştiren, 
            motivasyonu ve başarıyı artıran dijital platform.
          </p>
          <p className="mt-4 text-xs font-mono" style={{ color: 'rgba(138,154,170,0.5)' }}>
            Sadece .edu.tr e-posta ile
          </p>
        </div>
        <div>
          <h4 className="text-xs font-mono tracking-widest uppercase mb-4" style={{ color: 'var(--amber)' }}>Platform</h4>
          <div className="flex flex-col gap-2.5">
            {[['Nasıl Çalışır?','/nasil-calisir'],['Hakkımızda','/hakkimizda'],['SSS','/sss'],['İletişim','/iletisim']].map(([l,h]) => (
              <Link key={h} to={h} className="text-sm transition-colors" style={{ color: 'var(--mist)' }}
                onMouseEnter={e=>e.target.style.color='var(--cream)'}
                onMouseLeave={e=>e.target.style.color='var(--mist)'}>{l}</Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs font-mono tracking-widest uppercase mb-4" style={{ color: 'var(--amber)' }}>Hukuki</h4>
          <div className="flex flex-col gap-2.5">
            {[['Gizlilik Politikası','/gizlilik'],['KVKK','/kvkk'],['Kullanım Şartları','/kullanim-sartlari']].map(([l,h]) => (
              <Link key={h} to={h} className="text-sm transition-colors" style={{ color: 'var(--mist)' }}
                onMouseEnter={e=>e.target.style.color='var(--cream)'}
                onMouseLeave={e=>e.target.style.color='var(--mist)'}>{l}</Link>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between pt-8 gap-4 border-t" style={{ borderColor: 'rgba(245,237,216,0.06)' }}>
        <p className="text-xs" style={{ color: 'rgba(138,154,170,0.5)' }}>
          © 2024 Çalışma Arkadaşını Bul. Tüm hakları saklıdır.
        </p>
        <p className="text-xs" style={{ color: 'rgba(138,154,170,0.4)' }}>
          KVKK Uyumlu · Güvenli Akademik Platform
        </p>
      </div>
    </div>
  </footer>
);

const PublicLayout = ({ children, hideNav = false, hideFooter = false }) => (
  <div className="min-h-screen bg-ink flex flex-col">
    {!hideNav && <Navbar />}
    <main className="flex-1">{children}</main>
    {!hideFooter && <Footer />}
  </div>
);

export default PublicLayout;
export { Navbar, Footer, Logo };
