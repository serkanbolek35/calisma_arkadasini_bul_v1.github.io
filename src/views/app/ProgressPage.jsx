// src/views/app/ProgressPage.jsx
import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, PieChart, Pie, Cell, Legend
} from 'recharts';
import AppLayout from '../../components/layout/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { getCompletedSessions } from '../../services/session.service';

const COLORS = ['#E8A020', '#5A7A5A', '#8A9AAA', '#C07010', '#7A9E7A'];

const ProgressPage = () => {
  const { currentUser } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    getCompletedSessions(currentUser.uid).then(s => {
      setSessions(s);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [currentUser]);

  // Haftalık veri (son 8 hafta)
  const buildWeekly = () => {
    const weeks = {};
    sessions.forEach(s => {
      if (!s.createdAt) return;
      const d = s.createdAt.toDate ? s.createdAt.toDate() : new Date(s.createdAt);
      const weekNum = Math.floor((Date.now() - d.getTime()) / (7 * 24 * 60 * 60 * 1000));
      if (weekNum > 7) return;
      const key = weekNum === 0 ? 'Bu Hafta' : `${weekNum}h önce`;
      weeks[key] = (weeks[key] || 0) + (s.durationMinutes || 0);
    });
    return Object.entries(weeks).reverse().map(([week, minutes]) => ({ week, minutes }));
  };

  // Ders bazlı dağılım
  const buildSubjectData = () => {
    const map = {};
    sessions.forEach(s => {
      const subject = s.subject || 'Genel';
      map[subject] = (map[subject] || 0) + (s.durationMinutes || 0);
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  };

  // Motivasyon trendi
  const buildMotivation = () => {
    return sessions
      .filter(s => s.rating?.focusLevel)
      .slice(0, 10)
      .reverse()
      .map((s, i) => ({
        idx: i + 1,
        odak: s.rating.focusLevel,
        stres: s.rating.stressLevel,
        verim: s.rating.productivity,
      }));
  };

  const weeklyData = buildWeekly();
  const subjectData = buildSubjectData();
  const motivationData = buildMotivation();
  const totalMinutes = sessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
  const avgDuration = sessions.length ? Math.round(totalMinutes / sessions.length) : 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="px-3 py-2 rounded-xl text-xs"
        style={{ background: 'rgba(13,13,13,0.95)', border: '1px solid rgba(245,237,216,0.15)', color: 'var(--cream)' }}>
        <p style={{ color: 'var(--amber)' }}>{label}</p>
        {payload.map((p, i) => <p key={i}>{p.name}: {p.value}</p>)}
      </div>
    );
  };

  if (loading) return (
    <AppLayout title="İlerleme">
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 rounded-full animate-spin"
          style={{ borderColor: 'rgba(245,237,216,0.15)', borderTopColor: 'var(--amber)' }} />
      </div>
    </AppLayout>
  );

  if (sessions.length === 0) return (
    <AppLayout title="İlerleme">
      <div className="glass-card p-16 text-center">
        <div className="text-5xl mb-4">📊</div>
        <h3 className="font-display text-2xl font-bold text-cream mb-2">Henüz veri yok</h3>
        <p className="text-sm" style={{ color: 'var(--mist)' }}>
          Oturumları tamamladıkça ilerleme grafiklerin burada görünecek.
        </p>
      </div>
    </AppLayout>
  );

  return (
    <AppLayout title="İlerleme ve Analiz">
      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Toplam Oturum', value: sessions.length },
          { label: 'Toplam Süre', value: `${Math.floor(totalMinutes / 60)}s ${totalMinutes % 60}dk` },
          { label: 'Ort. Oturum', value: `${avgDuration}dk` },
          { label: 'Farklı Ders', value: new Set(sessions.map(s => s.subject)).size },
        ].map(({ label, value }) => (
          <div key={label} className="glass-card p-5 text-center">
            <p className="font-display text-2xl font-bold text-cream">{value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--mist)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly */}
        {weeklyData.length > 0 && (
          <div className="glass-card p-6">
            <p className="text-xs font-mono tracking-widest uppercase mb-1" style={{ color: 'var(--amber)' }}>Haftalık</p>
            <h3 className="font-display text-lg font-semibold text-cream mb-4">Çalışma Süresi</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={weeklyData} barSize={28} margin={{ left: -20 }}>
                <XAxis dataKey="week" tick={{ fill: 'var(--mist)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(245,237,216,0.04)' }} />
                <Bar dataKey="minutes" fill="var(--amber)" radius={[6, 6, 0, 0]} name="Dakika" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Subject breakdown */}
        {subjectData.length > 0 && (
          <div className="glass-card p-6">
            <p className="text-xs font-mono tracking-widest uppercase mb-1" style={{ color: 'var(--amber)' }}>Ders Bazlı</p>
            <h3 className="font-display text-lg font-semibold text-cream mb-4">Dağılım</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={subjectData} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                  dataKey="value" nameKey="name">
                  {subjectData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => [`${v}dk`, '']} contentStyle={{ background: 'rgba(13,13,13,0.95)', border: '1px solid rgba(245,237,216,0.15)', borderRadius: '12px', color: 'var(--cream)', fontSize: 12 }} />
                <Legend formatter={(v) => <span style={{ color: 'var(--mist)', fontSize: 12 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Motivation trend */}
        {motivationData.length > 0 && (
          <div className="glass-card p-6 lg:col-span-2">
            <p className="text-xs font-mono tracking-widest uppercase mb-1" style={{ color: 'var(--amber)' }}>Değerlendirme Trendi</p>
            <h3 className="font-display text-lg font-semibold text-cream mb-4">Odak · Stres · Verimlilik</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={motivationData} margin={{ left: -20, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(245,237,216,0.06)" />
                <XAxis dataKey="idx" tick={{ fill: 'var(--mist)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[1, 5]} tick={{ fill: 'var(--mist)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="odak" stroke="var(--amber)" strokeWidth={2} dot={{ r: 3 }} name="Odak" />
                <Line type="monotone" dataKey="stres" stroke="#E87070" strokeWidth={2} dot={{ r: 3 }} name="Stres" />
                <Line type="monotone" dataKey="verim" stroke="var(--sage-light)" strokeWidth={2} dot={{ r: 3 }} name="Verim" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ProgressPage;
