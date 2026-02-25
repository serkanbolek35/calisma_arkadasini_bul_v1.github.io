// src/views/app/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from 'recharts';
import {
  BookOpen, Clock, Users, Plus,
  Bell, LogOut, Settings, ChevronRight, Flame, Target
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { logoutUser } from '../../services/auth.service';
import { Logo } from '../../components/layout/PublicLayout';
import { getUserSessions } from '../../services/session.service';
import { getMatches } from '../../services/matching.service';

// ── Helpers ───────────────────────────────────────────────────
const buildWeeklyData = (sessions) => {
  const days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
  const map = { Paz: 0, Pzt: 0, Sal: 0, Çar: 0, Per: 0, Cum: 0, Cmt: 0 };
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  sessions.forEach(s => {
    if (s.status !== 'completed' || !s.createdAt) return;
    const date = s.createdAt.toDate ? s.createdAt.toDate() : new Date(s.createdAt);
    if (date < weekAgo) return;
    const dayName = days[date.getDay()];
    map[dayName] += s.durationMinutes || 0;
  });

  return days.map(d => ({ day: d, minutes: map[d] }));
};

const buildMotivationData = (sessions) => {
  if (sessions.length === 0) return [];
  // Oturum puanlarından haftalık ortalama motivasyon
  const weeks = {};
  sessions.forEach(s => {
    if (!s.rating || !s.createdAt) return;
    const date = s.createdAt.toDate ? s.createdAt.toDate() : new Date(s.createdAt);
    const week = `H${Math.ceil((new Date() - date) / (7 * 24 * 60 * 60 * 1000))}`;
    if (!weeks[week]) weeks[week] = { total: 0, count: 0 };
    weeks[week].total += s.rating?.focusLevel || 3;
    weeks[week].count += 1;
  });
  return Object.entries(weeks)
    .slice(0, 5)
    .reverse()
    .map(([week, v]) => ({ week, score: +(v.total / v.count).toFixed(1) }));
};

// ── Sub-components ────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, color = 'var(--amber)' }) => (
  <div className="glass-card p-5 flex items-start gap-4 group hover:border-white/15 transition-all duration-300">
    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: `${color}18` }}>
      <Icon size={20} style={{ color }} />
    </div>
    <div className="min-w-0">
      <p className="text-2xl font-display font-bold text-cream leading-none mb-1">{value}</p>
      <p className="text-xs font-body font-medium text-cream/80">{label}</p>
      {sub && <p className="text-xs mt-0.5" style={{ color: 'var(--mist)' }}>{sub}</p>}
    </div>
  </div>
);

const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const mins = payload[0].value;
  return (
    <div className="px-3 py-2 rounded-xl text-xs"
      style={{ background: 'rgba(13,13,13,0.95)', border: '1px solid rgba(245,237,216,0.15)', color: 'var(--cream)' }}>
      <p className="font-mono" style={{ color: 'var(--amber)' }}>{label}</p>
      <p>{Math.floor(mins / 60)}s {mins % 60}dk</p>
    </div>
  );
};

// ── Sidebar ───────────────────────────────────────────────────
const AppSidebar = ({ user, userDoc }) => {
  const [loggingOut, setLoggingOut] = useState(false);
  const handleLogout = async () => { setLoggingOut(true); await logoutUser(); };

  const navItems = [
    { icon: '📊', label: 'Dashboard', to: '/dashboard', active: true },
    { icon: '🤝', label: 'Eşleşmeler', to: '/eslesmeler' },
    { icon: '⏱', label: 'Oturumlar', to: '/oturumlar' },
    { icon: '📈', label: 'İlerleme', to: '/ilerleme' },
    { icon: '🧠', label: 'Anket', to: '/anket' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-60 flex-shrink-0 border-r"
      style={{ borderColor: 'rgba(245,237,216,0.07)' }}>
      <div className="p-6 border-b" style={{ borderColor: 'rgba(245,237,216,0.07)' }}>
        <Logo />
      </div>
      <div className="px-4 py-4 border-b" style={{ borderColor: 'rgba(245,237,216,0.07)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-display font-bold flex-shrink-0"
            style={{ background: 'var(--amber)', color: 'var(--ink)' }}>
            {userDoc?.displayName?.charAt(0) || user?.email?.charAt(0) || '?'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-cream truncate">{userDoc?.displayName || 'Kullanıcı'}</p>
            <p className="text-xs truncate" style={{ color: 'var(--mist)' }}>{user?.email}</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map(({ icon, label, to, active }) => (
          <Link key={to} to={to}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body font-medium transition-all duration-200"
            style={{
              background: active ? 'rgba(232,160,32,0.1)' : 'transparent',
              color: active ? 'var(--amber)' : 'var(--mist)',
              border: active ? '1px solid rgba(232,160,32,0.2)' : '1px solid transparent',
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--cream)'; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.color = active ? 'var(--amber)' : 'var(--mist)'; }}>
            <span className="text-base">{icon}</span>{label}
          </Link>
        ))}
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
    </aside>
  );
};

// ── Empty state ───────────────────────────────────────────────
const EmptyState = ({ icon, title, desc, actionTo, actionLabel }) => (
  <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
    <div className="text-3xl">{icon}</div>
    <p className="font-display font-semibold text-cream">{title}</p>
    <p className="text-sm" style={{ color: 'var(--mist)' }}>{desc}</p>
    {actionTo && (
      <Link to={actionTo} className="btn-primary px-5 py-2 text-sm mt-1">{actionLabel}</Link>
    )}
  </div>
);

// ── Main Dashboard ────────────────────────────────────────────
const DashboardPage = () => {
  const { currentUser, userDoc } = useAuth();
  const displayName = userDoc?.displayName || currentUser?.email?.split('@')[0] || 'Öğrenci';

  const [sessions, setSessions] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const fetchData = async () => {
      try {
        const [s, m] = await Promise.all([
          getUserSessions(currentUser.uid, 20),
          getMatches(currentUser.uid),
        ]);
        setSessions(s);
        setMatches(m);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser]);

  // Hesaplamalar
  const completedSessions = sessions.filter(s => s.status === 'completed');
  const totalMinutes = completedSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
  const activeMatches = matches.filter(m => m.status === 'active').length;
  const pendingMatches = matches.filter(m => m.status === 'pending' && m.initiatedBy !== currentUser?.uid).length;

  // Bu haftaki toplam dakika
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const thisWeekSessions = completedSessions.filter(s => {
    const d = s.createdAt?.toDate ? s.createdAt.toDate() : new Date(s.createdAt || 0);
    return d > weekAgo;
  });
  const thisWeekMinutes = thisWeekSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
  const weeklyHours = Math.floor(thisWeekMinutes / 60);
  const weeklyMins = thisWeekMinutes % 60;

  const weeklyData = buildWeeklyData(completedSessions);
  const motivationData = buildMotivationData(completedSessions);
  const recentSessions = sessions.slice(0, 3);

  const hasWeeklyActivity = weeklyData.some(d => d.minutes > 0);
  const hasMotivation = motivationData.length > 0;

  return (
    <div className="min-h-screen bg-ink flex">
      <AppSidebar user={currentUser} userDoc={userDoc} />

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="px-6 py-4 border-b flex items-center justify-between"
          style={{ borderColor: 'rgba(245,237,216,0.07)' }}>
          <div>
            <h1 className="font-display text-xl font-semibold text-cream">
              Merhaba, {displayName.split(' ')[0]}! 👋
            </h1>
            <p className="text-xs mt-0.5" style={{ color: 'var(--mist)' }}>
              {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors glass-card hover:border-white/15 relative">
              <Bell size={16} className="text-cream/60" />
              {pendingMatches > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold"
                  style={{ background: 'var(--amber)', color: 'var(--ink)' }}>
                  {pendingMatches}
                </span>
              )}
            </button>
            <Link to="/oturumlar/planla" className="btn-primary px-4 py-2 text-sm flex items-center gap-1.5">
              <Plus size={15} /> Oturum Planla
            </Link>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Motivasyon banner */}
          <div className="mb-6 p-4 rounded-2xl flex items-center gap-4"
            style={{ background: 'linear-gradient(135deg, rgba(232,160,32,0.12) 0%, rgba(90,122,90,0.08) 100%)', border: '1px solid rgba(232,160,32,0.2)' }}>
            <div className="text-2xl animate-float">✨</div>
            <div>
              <p className="text-sm font-display font-semibold text-cream">
                "Küçük adımlar, büyük yolculukların başlangıcıdır."
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--mist)' }}>Günün motivasyon mesajı</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard icon={Clock} label="Bu Hafta"
              value={thisWeekMinutes === 0 ? '—' : `${weeklyHours > 0 ? weeklyHours + 's ' : ''}${weeklyMins}dk`}
              sub={thisWeekMinutes === 0 ? 'Henüz oturum yok' : `${thisWeekSessions.length} oturum tamamlandı`}
              color="var(--amber)" />
            <StatCard icon={Flame} label="Toplam Oturum"
              value={completedSessions.length || '—'}
              sub={completedSessions.length === 0 ? 'Henüz oturum yok' : `${Math.floor(totalMinutes / 60)}s ${totalMinutes % 60}dk toplam`}
              color="#E87070" />
            <StatCard icon={Users} label="Aktif Eşleşme"
              value={activeMatches || '—'}
              sub={pendingMatches > 0 ? `${pendingMatches} istek bekliyor` : 'Bekleyen istek yok'}
              color="var(--sage-light)" />
            <StatCard icon={Target} label="Bu Ay"
              value={completedSessions.filter(s => {
                const d = s.createdAt?.toDate ? s.createdAt.toDate() : new Date(s.createdAt || 0);
                return d.getMonth() === new Date().getMonth();
              }).length || '—'}
              sub="tamamlanan oturum"
              color="var(--mist)" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="lg:col-span-2 glass-card p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs font-mono tracking-widest uppercase mb-1" style={{ color: 'var(--amber)' }}>Haftalık Çalışma</p>
                  <h3 className="font-display text-lg font-semibold text-cream">Bu Hafta</h3>
                </div>
              </div>
              {hasWeeklyActivity ? (
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={weeklyData} barSize={24} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                    <XAxis dataKey="day" tick={{ fill: 'var(--mist)', fontSize: 11, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(245,237,216,0.04)' }} />
                    <Bar dataKey="minutes" fill="var(--amber)" radius={[6, 6, 0, 0]} opacity={0.85} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-40 flex items-center justify-center">
                  <EmptyState icon="📅" title="Bu hafta oturum yok"
                    desc="İlk oturumunu planla, grafik burada görünecek."
                    actionTo="/oturumlar/planla" actionLabel="Oturum Planla" />
                </div>
              )}
            </div>

            <div className="glass-card p-5">
              <div className="mb-5">
                <p className="text-xs font-mono tracking-widest uppercase mb-1" style={{ color: 'var(--amber)' }}>Motivasyon</p>
                <h3 className="font-display text-lg font-semibold text-cream">Trend</h3>
              </div>
              {hasMotivation ? (
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={motivationData} margin={{ top: 5, right: 5, bottom: 0, left: -30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(245,237,216,0.06)" />
                    <XAxis dataKey="week" tick={{ fill: 'var(--mist)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[1, 5]} tick={{ fill: 'var(--mist)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: 'rgba(13,13,13,0.95)', border: '1px solid rgba(245,237,216,0.15)', borderRadius: '12px', color: 'var(--cream)', fontSize: 12 }}
                      formatter={(v) => [v, 'Motivasyon']} />
                    <Line type="monotone" dataKey="score" stroke="var(--sage-light)" strokeWidth={2.5}
                      dot={{ fill: 'var(--sage-light)', strokeWidth: 0, r: 4 }}
                      activeDot={{ r: 6, fill: 'var(--amber)' }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-40 flex items-center justify-center">
                  <p className="text-xs text-center" style={{ color: 'var(--mist)' }}>
                    Oturum değerlendirmelerin<br />burada görünecek
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Recent sessions + Quick actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-base font-semibold text-cream">Son Oturumlar</h3>
                <Link to="/oturumlar" className="text-xs flex items-center gap-1"
                  style={{ color: 'var(--amber)' }}>
                  Tümünü Gör <ChevronRight size={14} />
                </Link>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 rounded-full animate-spin"
                    style={{ borderColor: 'rgba(245,237,216,0.2)', borderTopColor: 'var(--amber)' }} />
                </div>
              ) : recentSessions.length === 0 ? (
                <EmptyState icon="📚" title="Henüz oturum yok"
                  desc="İlk çalışma oturumunu planla."
                  actionTo="/oturumlar/planla" actionLabel="Oturum Planla" />
              ) : (
                <div className="flex flex-col gap-3">
                  {recentSessions.map((s, i) => {
                    const date = s.createdAt?.toDate ? s.createdAt.toDate() : new Date(s.createdAt || 0);
                    const dateStr = date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
                    return (
                      <div key={i} className="flex items-center gap-4 py-3 border-b last:border-0"
                        style={{ borderColor: 'rgba(245,237,216,0.07)' }}>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(232,160,32,0.1)' }}>
                          <BookOpen size={15} style={{ color: 'var(--amber)' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-cream">{s.subject || 'Genel Çalışma'}</p>
                          <p className="text-xs" style={{ color: 'var(--mist)' }}>
                            {s.durationMinutes ? `${s.durationMinutes} dk` : 'Süre yok'} ·{' '}
                            <span className="capitalize">{
                              s.status === 'completed' ? '✓ Tamamlandı' :
                              s.status === 'planned' ? '⏳ Planlandı' :
                              s.status === 'cancelled' ? '✗ İptal' : s.status
                            }</span>
                          </p>
                        </div>
                        <p className="text-xs flex-shrink-0" style={{ color: 'var(--mist)' }}>{dateStr}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="glass-card p-5">
              <h3 className="font-display text-base font-semibold text-cream mb-4">Hızlı Erişim</h3>
              <div className="flex flex-col gap-2.5">
                {[
                  { icon: '🤝', label: 'Eşleşme Bul', to: '/eslesmeler', sub: activeMatches > 0 ? `${activeMatches} aktif eşleşme` : 'Arkadaş bul' },
                  { icon: '⏱', label: 'Oturum Başlat', to: '/oturumlar', sub: 'Çalışmaya başla' },
                  { icon: '📊', label: 'İlerleme', to: '/ilerleme', sub: 'İstatistiklerin' },
                  { icon: '🧠', label: 'Anket', to: '/anket', sub: 'Değerlendirmeler' },
                ].map(({ icon, label, to, sub }) => (
                  <Link key={to} to={to}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group"
                    style={{ background: 'rgba(245,237,216,0.04)', border: '1px solid rgba(245,237,216,0.08)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,237,216,0.08)'; e.currentTarget.style.borderColor = 'rgba(245,237,216,0.15)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(245,237,216,0.04)'; e.currentTarget.style.borderColor = 'rgba(245,237,216,0.08)'; }}>
                    <span className="text-lg">{icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-cream">{label}</p>
                      <p className="text-xs" style={{ color: 'var(--mist)' }}>{sub}</p>
                    </div>
                    <ChevronRight size={15} className="text-cream/30 group-hover:text-cream/60 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
