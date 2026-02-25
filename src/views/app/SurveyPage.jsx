// src/views/app/SurveyPage.jsx
import React, { useState, useEffect } from 'react';
import { CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';

const SCALES = [
  {
    id: 'loneliness',
    title: 'UCLA Yalnızlık Ölçeği',
    desc: 'Son iki haftayı düşünerek yanıtlayın.',
    questions: [
      'Etrafınızda insanlar olmasına rağmen yalnız hissediyorsunuz.',
      'Arkadaşlarınızın olmadığını hissediyorsunuz.',
      'Çevrenizdekilerle iletişim kurmakta güçlük çekiyorsunuz.',
      'Anlaşabileceğiniz kimse olmadığını hissediyorsunuz.',
      'Sosyal ortamlarda dışlanmış hissediyorsunuz.',
    ]
  },
  {
    id: 'motivation',
    title: 'Akademik Motivasyon',
    desc: 'Akademik çalışmalarınızla ilgili son durumunuzu değerlendirin.',
    questions: [
      'Derslerinize karşı istekli hissediyorsunuz.',
      'Ödevlerinizi zamanında tamamlıyorsunuz.',
      'Çalışma hedeflerinize ulaşabileceğinize inanıyorsunuz.',
      'Öğrenmeye karşı meraklı ve isteklisiniz.',
      'Akademik başarılarınızdan memnunsunuz.',
    ]
  },
  {
    id: 'procrastination',
    title: 'Akademik Erteleme',
    desc: 'Çalışma alışkanlıklarınızı değerlendirin.',
    questions: [
      'Çalışmayı genellikle son dakikaya erteliyorsunuz.',
      'Ödevleri başlamakta güçlük çekiyorsunuz.',
      'Çalışırken dikkatinizin dağıldığını fark ediyorsunuz.',
      'Planladığınız çalışma süresini genellikle kısaltıyorsunuz.',
      'Önemli görevleri erteleyip daha kolay işlerle zaman geçiriyorsunuz.',
    ]
  },
];

const LABELS = ['Hiçbir Zaman', 'Nadiren', 'Bazen', 'Sıklıkla', 'Her Zaman'];

const SurveyPage = () => {
  const { currentUser } = useAuth();
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentScale, setCurrentScale] = useState(0);
  const [answers, setAnswers] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    getDoc(doc(db, 'surveys', currentUser.uid)).then(snap => {
      if (snap.exists() && snap.data()?.preTest?.completedAt) setCompleted(true);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [currentUser]);

  const scale = SCALES[currentScale];
  const scaleAnswers = answers[scale.id] || {};
  const allAnswered = scale.questions.every((_, i) => scaleAnswers[i] !== undefined);
  const totalProgress = SCALES.reduce((sum, s, idx) => {
    if (idx < currentScale) return sum + s.questions.length;
    if (idx === currentScale) return sum + Object.keys(scaleAnswers).length;
    return sum;
  }, 0);
  const totalQuestions = SCALES.reduce((sum, s) => sum + s.questions.length, 0);

  const handleAnswer = (questionIdx, value) => {
    setAnswers(prev => ({
      ...prev,
      [scale.id]: { ...(prev[scale.id] || {}), [questionIdx]: value }
    }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const data = {};
      SCALES.forEach(s => {
        data[s.id] = Object.values(answers[s.id] || {});
      });
      await setDoc(doc(db, 'surveys', currentUser.uid), {
        preTest: { ...data, completedAt: serverTimestamp() }
      }, { merge: true });
      setCompleted(true);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <AppLayout title="Anket">
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 rounded-full animate-spin"
          style={{ borderColor: 'rgba(245,237,216,0.15)', borderTopColor: 'var(--amber)' }} />
      </div>
    </AppLayout>
  );

  if (completed) return (
    <AppLayout title="Anket">
      <div className="glass-card p-16 text-center max-w-lg mx-auto">
        <CheckCircle2 size={56} className="mx-auto mb-4" style={{ color: '#5ABF8A' }} />
        <h2 className="font-display text-2xl font-bold text-cream mb-3">Anket Tamamlandı!</h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--mist)' }}>
          Ön test yanıtların kaydedildi. Platform kullanımı sonrası son test de senden istenecek.
          Sonuçların ilerleme sayfanda karşılaştırmalı olarak gösterilecek.
        </p>
      </div>
    </AppLayout>
  );

  return (
    <AppLayout title="Ön Test Anketi">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-xs mb-2" style={{ color: 'var(--mist)' }}>
          <span>{scale.title}</span>
          <span>{totalProgress}/{totalQuestions} soru</span>
        </div>
        <div className="h-1.5 rounded-full" style={{ background: 'rgba(245,237,216,0.1)' }}>
          <div className="h-full rounded-full transition-all duration-300"
            style={{ width: `${(totalProgress / totalQuestions) * 100}%`, background: 'var(--amber)' }} />
        </div>
        <div className="flex gap-2 mt-3">
          {SCALES.map((s, i) => (
            <div key={i} className="flex-1 h-1 rounded-full"
              style={{
                background: i < currentScale ? 'var(--sage)' :
                  i === currentScale ? 'var(--amber)' : 'rgba(245,237,216,0.1)'
              }} />
          ))}
        </div>
      </div>

      {/* Scale */}
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="font-display text-2xl font-bold text-cream mb-1">{scale.title}</h2>
          <p className="text-sm" style={{ color: 'var(--mist)' }}>{scale.desc}</p>
        </div>

        <div className="flex flex-col gap-4 mb-8">
          {scale.questions.map((q, qi) => (
            <div key={qi} className="glass-card p-5">
              <p className="text-sm text-cream mb-4 leading-relaxed">
                <span className="font-mono text-xs mr-2" style={{ color: 'var(--amber)' }}>
                  {qi + 1}.
                </span>
                {q}
              </p>
              <div className="flex gap-2">
                {LABELS.map((label, val) => (
                  <button key={val} onClick={() => handleAnswer(qi, val + 1)}
                    className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all text-xs"
                    style={{
                      background: scaleAnswers[qi] === val + 1 ? 'var(--amber)' : 'rgba(245,237,216,0.05)',
                      color: scaleAnswers[qi] === val + 1 ? 'var(--ink)' : 'var(--mist)',
                      border: scaleAnswers[qi] === val + 1 ? 'none' : '1px solid rgba(245,237,216,0.1)',
                    }}>
                    <span className="font-mono font-bold">{val + 1}</span>
                    <span className="hidden sm:block text-center leading-tight" style={{ fontSize: '10px' }}>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <button onClick={() => setCurrentScale(s => Math.max(0, s - 1))}
            disabled={currentScale === 0}
            className="btn-outline px-6 py-2.5 flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed">
            <ArrowLeft size={16} /> Geri
          </button>

          {currentScale < SCALES.length - 1 ? (
            <button onClick={() => setCurrentScale(s => s + 1)} disabled={!allAnswered}
              className="btn-primary px-6 py-2.5 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
              Devam Et <ArrowRight size={16} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={!allAnswered || saving}
              className="btn-primary px-6 py-2.5 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
              {saving ? 'Kaydediliyor...' : <><CheckCircle2 size={16} /> Tamamla</>}
            </button>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default SurveyPage;
