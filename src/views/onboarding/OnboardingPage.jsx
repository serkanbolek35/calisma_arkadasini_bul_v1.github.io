// src/views/onboarding/OnboardingPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, MapPin, Clock, CheckCircle2, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile, updateUserPreferences, completeOnboarding } from '../../services/user.service';
import { Logo } from '../../components/layout/PublicLayout';

// ── Data ──────────────────────────────────────────────────────
const UNIVERSITIES = [
  'Ankara Üniversitesi', 'Boğaziçi Üniversitesi', 'Ege Üniversitesi',
  'Gazi Üniversitesi', 'Hacettepe Üniversitesi', 'İstanbul Teknik Üniversitesi',
  'İstanbul Üniversitesi', 'Koç Üniversitesi', 'METU (ODTÜ)', 'Sabancı Üniversitesi',
  'Diğer'
];

const FACULTIES = [
  'Mühendislik', 'Tıp', 'Hukuk', 'İktisadi ve İdari Bilimler',
  'Fen-Edebiyat', 'Mimarlık', 'Eğitim', 'İletişim', 'Diğer'
];

const SUBJECTS_POOL = [
  'Matematik', 'Fizik', 'Kimya', 'Biyoloji', 'Türk Dili',
  'Algoritma', 'Veri Yapıları', 'Lineer Cebir', 'Olasılık ve İstatistik',
  'Mikro İktisat', 'Makro İktisat', 'Hukuka Giriş', 'Tıbbi Biyokimya',
  'Tasarım İlkeleri', 'Eğitim Psikolojisi', 'Medya ve İletişim'
];

const TIME_SLOTS = [
  { id: 'morning', label: 'Sabah', sub: '08:00 – 12:00' },
  { id: 'afternoon', label: 'Öğleden Sonra', sub: '12:00 – 17:00' },
  { id: 'evening', label: 'Akşam', sub: '17:00 – 21:00' },
  { id: 'night', label: 'Gece', sub: '21:00 – 00:00' },
];

const DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const FREQ_OPTIONS = [
  { value: 'daily', label: 'Her Gün' },
  { value: '3x_week', label: 'Haftada 3-4 Gün' },
  { value: 'weekly', label: 'Haftada 1-2 Gün' },
];

// ── Step indicator ────────────────────────────────────────────
const StepDot = ({ active, done, num }) => (
  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all duration-300 ${
    done ? '' : active ? '' : ''
  }`}
    style={{
      background: done ? 'var(--sage)' : active ? 'var(--amber)' : 'rgba(245,237,216,0.1)',
      color: done || active ? 'var(--ink)' : 'var(--mist)',
      border: done || active ? 'none' : '1px solid rgba(245,237,216,0.2)',
    }}>
    {done ? <CheckCircle2 size={14} /> : num}
  </div>
);

// ── Pill select ───────────────────────────────────────────────
const Pill = ({ selected, onClick, children }) => (
  <button type="button" onClick={onClick}
    className="px-4 py-2 rounded-full text-sm font-body font-medium transition-all duration-200"
    style={{
      background: selected ? 'var(--amber)' : 'rgba(245,237,216,0.06)',
      color: selected ? 'var(--ink)' : 'var(--cream)',
      border: selected ? 'none' : '1px solid rgba(245,237,216,0.15)',
      transform: selected ? 'scale(1.03)' : 'scale(1)',
    }}>
    {children}
  </button>
);

// ── Main ──────────────────────────────────────────────────────
const OnboardingPage = () => {
  const navigate = useNavigate();
  const { currentUser, refreshUserDoc } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    university: '', faculty: '', department: '', grade: '',
  });
  const [subjects, setSubjects] = useState([]);
  const [schedule, setSchedule] = useState({ timeSlots: [], days: [], frequency: '' });
  const [campus, setCampus] = useState('');

  const totalSteps = 4;

  const toggleSubject = (s) =>
    setSubjects(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const toggleTimeSlot = (s) =>
    setSchedule(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.includes(s)
        ? prev.timeSlots.filter(x => x !== s)
        : [...prev.timeSlots, s]
    }));
  const toggleDay = (d) =>
    setSchedule(prev => ({
      ...prev,
      days: prev.days.includes(d)
        ? prev.days.filter(x => x !== d)
        : [...prev.days, d]
    }));

  const canProceed = () => {
    if (step === 1) return profile.university && profile.faculty && profile.grade;
    if (step === 2) return subjects.length >= 1;
    if (step === 3) return schedule.timeSlots.length >= 1 && schedule.days.length >= 1;
    if (step === 4) return campus.trim().length >= 2;
    return false;
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await updateUserProfile(currentUser.uid, { ...profile });
      await updateUserPreferences(currentUser.uid, {
        subjects,
        availableHours: { days: schedule.days, slots: schedule.timeSlots },
        studyFrequency: schedule.frequency,
        campus,
      });
      await completeOnboarding(currentUser.uid);
      await refreshUserDoc();
      navigate('/dashboard');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      icon: BookOpen,
      title: 'Üniversite Bilgilerin',
      sub: 'Seni daha iyi eşleştirebilmek için akademik bilgilerini gir.',
      content: (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono tracking-widest uppercase" style={{ color: 'var(--mist)' }}>Üniversite *</label>
            <select value={profile.university} onChange={e => setProfile(p => ({ ...p, university: e.target.value }))}
              className="input-field"
              style={{ background: 'rgba(245,237,216,0.06)', color: profile.university ? 'var(--cream)' : 'var(--mist)' }}>
              <option value="" disabled>Üniversiteni seç</option>
              {UNIVERSITIES.map(u => <option key={u} value={u} style={{ background: 'var(--ink-50)', color: 'var(--cream)' }}>{u}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono tracking-widest uppercase" style={{ color: 'var(--mist)' }}>Fakülte *</label>
            <select value={profile.faculty} onChange={e => setProfile(p => ({ ...p, faculty: e.target.value }))}
              className="input-field"
              style={{ background: 'rgba(245,237,216,0.06)', color: profile.faculty ? 'var(--cream)' : 'var(--mist)' }}>
              <option value="" disabled>Fakülteni seç</option>
              {FACULTIES.map(f => <option key={f} value={f} style={{ background: 'var(--ink-50)', color: 'var(--cream)' }}>{f}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono tracking-widest uppercase" style={{ color: 'var(--mist)' }}>Bölüm (İsteğe Bağlı)</label>
            <input value={profile.department} onChange={e => setProfile(p => ({ ...p, department: e.target.value }))}
              placeholder="Örn: Bilgisayar Mühendisliği" className="input-field" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono tracking-widest uppercase" style={{ color: 'var(--mist)' }}>Sınıf *</label>
            <div className="flex gap-3">
              {['1', '2', '3', '4', '5+'].map(g => (
                <Pill key={g} selected={profile.grade === g} onClick={() => setProfile(p => ({ ...p, grade: g }))}>
                  {g}. Sınıf
                </Pill>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: BookOpen,
      title: 'Aldığın Dersler',
      sub: 'Bu dönem çalışmak istediğin dersleri seç. (En az 1)',
      content: (
        <div>
          <div className="flex flex-wrap gap-2.5 mb-4">
            {SUBJECTS_POOL.map(s => (
              <Pill key={s} selected={subjects.includes(s)} onClick={() => toggleSubject(s)}>{s}</Pill>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono tracking-widest uppercase" style={{ color: 'var(--mist)' }}>
              Listede Olmayan Ders Ekle
            </label>
            <div className="flex gap-2">
              <input placeholder="Ders adı yaz, Enter'a bas" className="input-field flex-1"
                onKeyDown={e => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    toggleSubject(e.target.value.trim());
                    e.target.value = '';
                    e.preventDefault();
                  }
                }} />
            </div>
          </div>
          {subjects.length > 0 && (
            <p className="mt-3 text-xs" style={{ color: 'var(--sage-light)' }}>
              {subjects.length} ders seçildi: {subjects.join(', ')}
            </p>
          )}
        </div>
      ),
    },
    {
      icon: Clock,
      title: 'Çalışma Saatlerin',
      sub: 'Hangi zaman dilimlerinde ve günlerde çalışıyorsun?',
      content: (
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: 'var(--mist)' }}>Tercih Ettiğin Saatler *</p>
            <div className="grid grid-cols-2 gap-3">
              {TIME_SLOTS.map(({ id, label, sub }) => (
                <button key={id} type="button" onClick={() => toggleTimeSlot(id)}
                  className="p-3 rounded-xl text-left transition-all duration-200"
                  style={{
                    background: schedule.timeSlots.includes(id) ? 'rgba(232,160,32,0.12)' : 'rgba(245,237,216,0.04)',
                    border: schedule.timeSlots.includes(id) ? '1.5px solid var(--amber)' : '1.5px solid rgba(245,237,216,0.1)',
                  }}>
                  <div className="font-body font-medium text-sm text-cream">{label}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--mist)' }}>{sub}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: 'var(--mist)' }}>Müsait Günler *</p>
            <div className="flex flex-wrap gap-2">
              {DAYS.map(d => (
                <Pill key={d} selected={schedule.days.includes(d)} onClick={() => toggleDay(d)}>{d}</Pill>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: 'var(--mist)' }}>Çalışma Sıklığı</p>
            <div className="flex flex-col gap-2">
              {FREQ_OPTIONS.map(({ value, label }) => (
                <Pill key={value} selected={schedule.frequency === value}
                  onClick={() => setSchedule(p => ({ ...p, frequency: value }))}>
                  {label}
                </Pill>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: MapPin,
      title: 'Kampüs & Konum',
      sub: 'Hangi kampüste veya bölgede çalışmayı tercih edersin?',
      content: (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono tracking-widest uppercase" style={{ color: 'var(--mist)' }}>Kampüs Adı *</label>
            <input value={campus} onChange={e => setCampus(e.target.value)}
              placeholder="Örn: Ana Kampüs, Kuzey Kampüsü" className="input-field" />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {['Ana Kampüs', 'Kuzey Kampüsü', 'Güney Kampüsü', 'Şehir Merkezi', 'Uzaktan/Online'].map(c => (
              <Pill key={c} selected={campus === c} onClick={() => setCampus(c)}>{c}</Pill>
            ))}
          </div>
          <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(90,122,90,0.1)', border: '1px solid rgba(90,122,90,0.2)' }}>
            <div className="flex items-start gap-3">
              <Sparkles size={16} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--sage-light)' }} />
              <p className="text-sm leading-relaxed" style={{ color: 'var(--sage-light)' }}>
                Kampüs bilgin, fiziksel olarak yakın çalışma arkadaşları bulmanı sağlar. 
                "Uzaktan/Online" seçersen tüm Türkiye'den eşleşme yapılır.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const currentStep = steps[step - 1];
  const StepIcon = currentStep.icon;

  return (
    <div className="min-h-screen bg-ink flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 px-6 py-5 flex items-center justify-between max-w-2xl mx-auto w-full">
        <Logo />
        <p className="text-xs font-mono" style={{ color: 'var(--mist)' }}>
          {step}/{totalSteps} Tamamlandı
        </p>
      </header>

      {/* Progress bar */}
      <div className="h-0.5 relative z-10" style={{ background: 'rgba(245,237,216,0.08)' }}>
        <div className="h-full transition-all duration-500"
          style={{ width: `${(step / totalSteps) * 100}%`, background: 'var(--amber)' }} />
      </div>

      {/* Content */}
      <main className="flex-1 flex items-start justify-center px-6 py-10 relative z-10">
        <div className="w-full max-w-lg">
          {/* Step indicators */}
          <div className="flex items-center justify-between mb-10">
            {steps.map((_, i) => (
              <React.Fragment key={i}>
                <StepDot num={i + 1} active={step === i + 1} done={step > i + 1} />
                {i < steps.length - 1 && (
                  <div className="flex-1 h-px mx-2 transition-all duration-500"
                    style={{ background: step > i + 1 ? 'var(--sage)' : 'rgba(245,237,216,0.1)' }} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step card */}
          <div className="rounded-2xl p-8"
            style={{ background: 'rgba(245,237,216,0.04)', border: '1px solid rgba(245,237,216,0.1)' }}>
            <div className="mb-7">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(232,160,32,0.12)' }}>
                  <StepIcon size={18} style={{ color: 'var(--amber)' }} />
                </div>
                <span className="text-xs font-mono tracking-widest uppercase" style={{ color: 'var(--amber)' }}>
                  Adım {step}
                </span>
              </div>
              <h1 className="font-display text-2xl font-bold text-cream mb-1">{currentStep.title}</h1>
              <p className="text-sm" style={{ color: 'var(--mist)' }}>{currentStep.sub}</p>
            </div>

            {currentStep.content}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}
              className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed btn-outline">
              <ArrowLeft size={16} /> Geri
            </button>

            {step < totalSteps ? (
              <button onClick={() => setStep(s => s + 1)} disabled={!canProceed()}
                className="btn-primary px-6 py-2.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed group">
                Devam Et
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            ) : (
              <button onClick={handleFinish} disabled={!canProceed() || loading}
                className="btn-primary px-6 py-2.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed group">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-ink border-t-transparent rounded-full animate-spin" />
                    Kaydediliyor...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles size={16} /> Başla!
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OnboardingPage;
