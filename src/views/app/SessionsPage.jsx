// src/views/app/SessionsPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Clock, Play, Square, Plus, CheckCircle2, BookOpen } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { getUserSessions, createSession, updateSessionStatus, addSessionRating } from '../../services/session.service';
import { getUserPreferences } from '../../services/user.service';
import { serverTimestamp } from 'firebase/firestore';

// ── Timer hook ────────────────────────────────────────────────
const useTimer = () => {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  const start = () => {
    setRunning(true);
    intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
  };
  const stop = () => {
    setRunning(false);
    clearInterval(intervalRef.current);
  };
  const reset = () => { stop(); setSeconds(0); };

  const format = () => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return { seconds, running, start, stop, reset, format };
};

// ── Rating Modal ──────────────────────────────────────────────
const RatingModal = ({ onSubmit, onSkip }) => {
  const [ratings, setRatings] = useState({ focusLevel: 3, stressLevel: 3, productivity: 3 });
  const fields = [
    { key: 'focusLevel', label: 'Odaklanma Düzeyi' },
    { key: 'stressLevel', label: 'Stres Seviyesi' },
    { key: 'productivity', label: 'Verimlilik' },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-md rounded-2xl p-8"
        style={{ background: 'var(--ink-50)', border: '1px solid rgba(245,237,216,0.12)' }}>
        <h2 className="font-display text-2xl font-bold text-cream mb-2">Oturum Tamamlandı! 🎉</h2>
        <p className="text-sm mb-6" style={{ color: 'var(--mist)' }}>Bu oturumu değerlendir</p>
        <div className="flex flex-col gap-5">
          {fields.map(({ key, label }) => (
            <div key={key}>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-cream">{label}</span>
                <span className="text-sm font-mono" style={{ color: 'var(--amber)' }}>{ratings[key]}/5</span>
              </div>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(v => (
                  <button key={v} onClick={() => setRatings(r => ({ ...r, [key]: v }))}
                    className="flex-1 h-8 rounded-lg text-sm font-mono font-bold transition-all"
                    style={{
                      background: ratings[key] >= v ? 'var(--amber)' : 'rgba(245,237,216,0.08)',
                      color: ratings[key] >= v ? 'var(--ink)' : 'var(--mist)',
                    }}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-8">
          <button onClick={() => onSubmit(ratings)} className="btn-primary flex-1 py-3">Kaydet</button>
          <button onClick={onSkip} className="btn-outline flex-1 py-3">Atla</button>
        </div>
      </div>
    </div>
  );
};

// ── Plan Modal ────────────────────────────────────────────────
const PlanModal = ({ subjects, onClose, onSave }) => {
  const [form, setForm] = useState({ subject: subjects[0] || '', plannedDuration: 25 });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-sm rounded-2xl p-8"
        style={{ background: 'var(--ink-50)', border: '1px solid rgba(245,237,216,0.12)' }}>
        <h2 className="font-display text-xl font-bold text-cream mb-6">Yeni Oturum</h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono tracking-widest uppercase" style={{ color: 'var(--mist)' }}>Ders</label>
            {subjects.length > 0 ? (
              <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                className="input-field" style={{ background: 'rgba(245,237,216,0.06)', color: 'var(--cream)' }}>
                {subjects.map(s => <option key={s} value={s} style={{ background: 'var(--ink-50)' }}>{s}</option>)}
                <option value="Genel Çalışma" style={{ background: 'var(--ink-50)' }}>Genel Çalışma</option>
              </select>
            ) : (
              <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                placeholder="Ders adı gir" className="input-field" />
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono tracking-widest uppercase" style={{ color: 'var(--mist)' }}>Süre (dakika)</label>
            <div className="flex gap-2">
              {[25, 45, 60, 90].map(d => (
                <button key={d} type="button" onClick={() => setForm(f => ({ ...f, plannedDuration: d }))}
                  className="flex-1 py-2 rounded-xl text-sm font-mono transition-all"
                  style={{
                    background: form.plannedDuration === d ? 'var(--amber)' : 'rgba(245,237,216,0.06)',
                    color: form.plannedDuration === d ? 'var(--ink)' : 'var(--mist)',
                    border: form.plannedDuration === d ? 'none' : '1px solid rgba(245,237,216,0.1)',
                  }}>
                  {d}dk
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => onSave(form)} className="btn-primary flex-1 py-3">Başlat</button>
          <button onClick={onClose} className="btn-outline flex-1 py-3">İptal</button>
        </div>
      </div>
    </div>
  );
};

// ── Main SessionsPage ─────────────────────────────────────────
const SessionsPage = () => {
  const { currentUser } = useAuth();
  const timer = useTimer();
  const [sessions, setSessions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSession, setActiveSession] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [completedSessionId, setCompletedSessionId] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    const fetchData = async () => {
      const [s, prefs] = await Promise.all([
        getUserSessions(currentUser.uid, 20),
        getUserPreferences(currentUser.uid),
      ]);
      setSessions(s);
      setSubjects(prefs?.subjects || []);
      setLoading(false);
    };
    fetchData();
  }, [currentUser]);

  const handleStartSession = async (form) => {
    setShowPlanModal(false);
    const sessionId = await createSession(currentUser.uid, {
      subject: form.subject,
      plannedDuration: form.plannedDuration,
      startedAt: serverTimestamp(),
      status: 'active',
    });
    setActiveSession({ id: sessionId, subject: form.subject, plannedDuration: form.plannedDuration });
    timer.reset();
    timer.start();
  };

  const handleStopSession = async () => {
    timer.stop();
    const durationMinutes = Math.floor(timer.seconds / 60);
    await updateSessionStatus(activeSession.id, 'completed', { durationMinutes, endedAt: serverTimestamp() });
    setCompletedSessionId(activeSession.id);
    setActiveSession(null);
    setShowRating(true);
    const s = await getUserSessions(currentUser.uid, 20);
    setSessions(s);
  };

  const handleRatingSubmit = async (rating) => {
    if (completedSessionId) {
      await addSessionRating(completedSessionId, currentUser.uid, rating);
    }
    setShowRating(false);
    setCompletedSessionId(null);
  };

  return (
    <AppLayout title="Çalışma Oturumları">
      {showPlanModal && (
        <PlanModal subjects={subjects} onClose={() => setShowPlanModal(false)} onSave={handleStartSession} />
      )}
      {showRating && (
        <RatingModal onSubmit={handleRatingSubmit} onSkip={() => { setShowRating(false); setCompletedSessionId(null); }} />
      )}

      {/* Active session panel */}
      {activeSession ? (
        <div className="mb-8 p-8 rounded-2xl text-center"
          style={{ background: 'linear-gradient(135deg, rgba(232,160,32,0.1) 0%, rgba(90,122,90,0.06) 100%)', border: '1px solid rgba(232,160,32,0.25)' }}>
          <p className="text-xs font-mono tracking-widest uppercase mb-2" style={{ color: 'var(--amber)' }}>
            Aktif Oturum — {activeSession.subject}
          </p>
          <div className="font-mono text-6xl font-bold text-cream my-6 tracking-tight">
            {timer.format()}
          </div>
          <p className="text-sm mb-6" style={{ color: 'var(--mist)' }}>
            Odak modunda çalışıyorsun. Hedef: {activeSession.plannedDuration} dakika
          </p>
          <button onClick={handleStopSession}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold transition-all"
            style={{ background: 'rgba(200,64,64,0.15)', color: '#E87070', border: '1px solid rgba(200,64,64,0.3)' }}>
            <Square size={16} /> Oturumu Tamamla
          </button>
        </div>
      ) : (
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold text-cream">Oturumların</h2>
            <p className="text-sm mt-0.5" style={{ color: 'var(--mist)' }}>
              {sessions.filter(s => s.status === 'completed').length} oturum tamamlandı
            </p>
          </div>
          <button onClick={() => setShowPlanModal(true)} className="btn-primary px-5 py-2.5 flex items-center gap-2">
            <Play size={15} /> Oturum Başlat
          </button>
        </div>
      )}

      {/* Sessions list */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 rounded-full animate-spin"
            style={{ borderColor: 'rgba(245,237,216,0.15)', borderTopColor: 'var(--amber)' }} />
        </div>
      ) : sessions.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <div className="text-5xl mb-4">⏱</div>
          <h3 className="font-display text-2xl font-bold text-cream mb-2">İlk oturumunu başlat</h3>
          <p className="text-sm mb-8" style={{ color: 'var(--mist)' }}>
            Odak modunda çalış, sonunda değerlendir ve ilerlemeyi takip et.
          </p>
          <button onClick={() => setShowPlanModal(true)} className="btn-primary px-8 py-3 inline-flex items-center gap-2">
            <Play size={16} /> Şimdi Başlat
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sessions.map((s, i) => {
            const date = s.createdAt?.toDate ? s.createdAt.toDate() : new Date(s.createdAt || 0);
            return (
              <div key={i} className="glass-card p-4 flex items-center gap-4 hover:border-white/15 transition-all">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: s.status === 'completed' ? 'rgba(58,138,90,0.12)' : 'rgba(232,160,32,0.1)' }}>
                  {s.status === 'completed'
                    ? <CheckCircle2 size={18} style={{ color: '#5ABF8A' }} />
                    : <BookOpen size={18} style={{ color: 'var(--amber)' }} />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body font-medium text-cream">{s.subject || 'Genel Çalışma'}</p>
                  <p className="text-xs" style={{ color: 'var(--mist)' }}>
                    {date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  {s.durationMinutes > 0 && (
                    <p className="text-sm font-mono font-bold text-cream">{s.durationMinutes}dk</p>
                  )}
                  <p className="text-xs mt-0.5" style={{
                    color: s.status === 'completed' ? '#5ABF8A' : s.status === 'active' ? 'var(--amber)' : 'var(--mist)'
                  }}>
                    {s.status === 'completed' ? 'Tamamlandı' : s.status === 'active' ? 'Devam ediyor' : 'Planlandı'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
};

export default SessionsPage;
