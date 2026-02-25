// src/views/public/LandingPage.jsx
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Users, Clock, BarChart3, Shield, BookOpen,
  CheckCircle2, ChevronDown, Zap, Target, Brain
} from 'lucide-react';
import PublicLayout from '../../components/layout/PublicLayout';

// ── Animated counter hook ─────────────────────────────────────
const useCounter = (target, duration = 1500, start = false) => {
  const [count, setCount] = React.useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration, start]);
  return count;
};

// ── Intersection observer hook ────────────────────────────────
const useInView = (threshold = 0.2) => {
  const ref = useRef(null);
  const [inView, setInView] = React.useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
};

// ── Stat counter component ────────────────────────────────────
const StatCounter = ({ value, suffix, label, start }) => {
  const count = useCounter(value, 1500, start);
  return (
    <div className="flex flex-col items-center text-center">
      <span className="font-display text-4xl font-bold" style={{ color: 'var(--amber)' }}>
        {count.toLocaleString('tr-TR')}{suffix}
      </span>
      <span className="text-sm mt-1 font-body" style={{ color: 'var(--mist)' }}>{label}</span>
    </div>
  );
};

// ── Problem card ──────────────────────────────────────────────
const ProblemCard = ({ icon: Icon, title, desc, delay }) => (
  <div className="glass-card p-6 group hover:border-amber-brand/30 transition-all duration-300"
    style={{ animationDelay: `${delay}ms`, animation: 'fadeUp 0.6s ease forwards', opacity: 0 }}>
    <div className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center transition-transform group-hover:scale-110"
      style={{ background: 'rgba(232,160,32,0.12)' }}>
      <Icon size={20} style={{ color: 'var(--amber)' }} />
    </div>
    <h3 className="font-display text-lg font-semibold text-cream mb-2">{title}</h3>
    <p className="text-sm leading-relaxed" style={{ color: 'var(--mist)' }}>{desc}</p>
  </div>
);

// ── Step card ─────────────────────────────────────────────────
const StepCard = ({ number, title, desc, delay }) => (
  <div className="flex gap-5 group"
    style={{ animationDelay: `${delay}ms`, animation: 'fadeUp 0.6s ease forwards', opacity: 0 }}>
    <div className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-mono font-bold text-lg transition-all duration-300 group-hover:scale-105"
      style={{ background: 'var(--amber)', color: 'var(--ink)' }}>
      {number}
    </div>
    <div>
      <h3 className="font-display text-lg font-semibold text-cream mb-1">{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--mist)' }}>{desc}</p>
    </div>
  </div>
);

// ── Feature pill ──────────────────────────────────────────────
const FeaturePill = ({ text, icon: Icon }) => (
  <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-body font-medium"
    style={{ background: 'rgba(245,237,216,0.06)', border: '1px solid rgba(245,237,216,0.12)', color: 'var(--cream)' }}>
    <Icon size={14} style={{ color: 'var(--amber)' }} />
    {text}
  </div>
);

// ── Floating decoration ───────────────────────────────────────
const FloatingDot = ({ style }) => (
  <div className="absolute rounded-full animate-float"
    style={{
      width: '6px', height: '6px',
      background: 'var(--amber)',
      opacity: 0.4,
      ...style
    }} />
);

// ── Main LandingPage ──────────────────────────────────────────
const LandingPage = () => {
  const [statsRef, statsInView] = useInView(0.3);

  return (
    <PublicLayout>
      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(232,160,32,0.08) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(90,122,90,0.06) 0%, transparent 70%)' }} />
        <FloatingDot style={{ top: '30%', left: '15%', animationDelay: '0s' }} />
        <FloatingDot style={{ top: '60%', right: '12%', animationDelay: '2s' }} />
        <FloatingDot style={{ top: '20%', right: '25%', animationDelay: '1s' }} />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-medium mb-8"
            style={{
              background: 'rgba(232,160,32,0.1)',
              border: '1px solid rgba(232,160,32,0.25)',
              color: 'var(--amber)',
              animation: 'fadeIn 0.5s ease forwards',
            }}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-soft" />
            Sadece .edu.tr e-posta ile üye olunur
          </div>

          {/* Heading */}
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-6"
            style={{ animation: 'fadeUp 0.7s ease 0.1s forwards', opacity: 0 }}>
            <span className="text-cream">Çalışma Arkadaşını</span>
            <br />
            <span style={{
              background: 'linear-gradient(135deg, var(--amber) 0%, var(--amber-light) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Bul, Motivasyonunu</span>
            <br />
            <span className="text-cream">Artır.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10 font-body font-light"
            style={{ color: 'var(--mist)', animation: 'fadeUp 0.7s ease 0.25s forwards', opacity: 0 }}>
            Üniversite öğrencileri için tasarlanmış akademik eşleştirme platformu.
            Aynı dersleri alan, benzer saatlerde çalışan arkadaşını bul ve birlikte ilerle.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            style={{ animation: 'fadeUp 0.7s ease 0.4s forwards', opacity: 0 }}>
            <Link to="/kayit" className="btn-primary px-8 py-4 text-base group">
              Hemen Kayıt Ol
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/nasil-calisir" className="btn-outline px-8 py-4 text-base">
              Nasıl Çalışır?
            </Link>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-3"
            style={{ animation: 'fadeUp 0.7s ease 0.55s forwards', opacity: 0 }}>
            <FeaturePill text="Akıllı Eşleştirme" icon={Users} />
            <FeaturePill text="Canlı Oturum" icon={Clock} />
            <FeaturePill text="İlerleme Takibi" icon={BarChart3} />
            <FeaturePill text="KVKK Uyumlu" icon={Shield} />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce"
          style={{ opacity: 0.4 }}>
          <ChevronDown size={20} className="text-cream" />
        </div>
      </section>

      {/* ─── STATS ────────────────────────────────────────── */}
      <section ref={statsRef} className="py-20 border-y" style={{ borderColor: 'rgba(245,237,216,0.07)' }}>
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10">
          <StatCounter value={1200} suffix="+" label="Kayıtlı Öğrenci" start={statsInView} />
          <StatCounter value={85} suffix="%" label="Eşleşme Başarısı" start={statsInView} />
          <StatCounter value={4800} suffix="+" label="Tamamlanan Oturum" start={statsInView} />
          <StatCounter value={48} suffix="" label="Üniversite" start={statsInView} />
        </div>
      </section>

      {/* ─── PROBLEMS ─────────────────────────────────────── */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="section-label mb-3 block">Problemi Tanıyoruz</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-cream">
            Yalnız çalışmak
            <span style={{ color: 'var(--amber)', fontStyle: 'italic' }}> zor.</span>
          </h2>
          <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: 'var(--mist)' }}>
            Her üniversite öğrencisinin yaşadığı, ama konuşulmayan problemler.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <ProblemCard icon={Brain} title="Motivasyon Eksikliği"
            desc="Tek başına çalışırken odaklanmak ve istekli kalmak giderek zorlaşıyor."
            delay={0} />
          <ProblemCard icon={Clock} title="Akademik Erteleme"
            desc="Ödev ve çalışmaları sürekli ertelemek, sınav dönemlerinde kriz yaratıyor."
            delay={100} />
          <ProblemCard icon={Target} title="Düzensiz Çalışma"
            desc="Plan olmadan çalışmak, verimliliği düşürüyor ve zamanı israf ediyor."
            delay={200} />
          <ProblemCard icon={Users} title="Sosyal İzolasyon"
            desc="Kampüste sosyal bağ kuramamak, akademik motivasyonu olumsuz etkiliyor."
            delay={300} />
          <ProblemCard icon={Zap} title="Odak Dağınıklığı"
            desc="Telefon, sosyal medya ve çevresel etkenler konsantrasyonu bozuyor."
            delay={400} />
          <ProblemCard icon={BarChart3} title="İlerleme Görünmüyor"
            desc="Ne kadar çalıştığını takip etmemek, motivasyonu daha da düşürüyor."
            delay={500} />
        </div>
      </section>

      {/* ─── SOLUTION ─────────────────────────────────────── */}
      <section className="py-24" style={{ background: 'rgba(245,237,216,0.025)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="section-label mb-3 block">Çözümümüz</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-cream">
              Birlikte çalışmak her şeyi
              <span style={{ color: 'var(--amber)', fontStyle: 'italic' }}> değiştirir.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: '🎯', title: 'Akıllı Akran Eşleştirme', desc: 'Ortak ders, kampüs ve çalışma saatlerine göre en uyumlu arkadaşı bul.' },
              { icon: '⏱', title: 'Planlı Çalışma Oturumları', desc: 'Tarih, saat ve ders belirleyerek oturum planla, hatırlatma al.' },
              { icon: '🔴', title: 'Canlı Kronometre', desc: 'Odak modunda, bildirimler kapalıyken zamanlayıcıyla verimli çalış.' },
              { icon: '📊', title: 'İlerleme Grafikleri', desc: 'Haftalık çalışma süren, motivasyon ve stres düzeyin grafiksel olarak izle.' },
              { icon: '🧠', title: 'Motivasyon Takibi', desc: 'Her oturum sonunda değerlendirme yap, zaman içindeki gelişimini gör.' },
              { icon: '🔒', title: 'Güvenli ve Doğrulanmış', desc: 'Sadece .edu.tr e-postasıyla kayıt. Gerçek üniversite öğrencileri.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-2xl group hover:bg-cream/5 transition-all duration-200">
                <div className="text-2xl mt-0.5">{item.icon}</div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-cream mb-1">{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--mist)' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────── */}
      <section className="py-24 max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="section-label mb-3 block">Başlamak Kolay</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-cream">
            3 adımda hazırsın.
          </h2>
        </div>

        <div className="flex flex-col gap-10">
          <StepCard number="01"
            title=".edu.tr e-posta ile kayıt ol"
            desc="Üniversite e-postanla üye ol, kimliğini doğrula. 2 dakika sürer."
            delay={0} />
          <StepCard number="02"
            title="Profilini oluştur ve eşleşeni bul"
            desc="Aldığın dersler, boş saatlerin ve kampüsünü gir. Sistem sana en uygun arkadaşı bulur."
            delay={100} />
          <StepCard number="03"
            title="Oturum başlat ve ilerlemeni takip et"
            desc="Planlı oturum başlat, odak modunda çalış, sonunda değerlendirme yap."
            delay={200} />
        </div>
      </section>

      {/* ─── TRUST SECTION ────────────────────────────────── */}
      <section className="py-20" style={{ background: 'rgba(245,237,216,0.02)' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="section-label mb-4 block">Güven & Güvenlik</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-cream mb-12">
            Verilerini güvende tutuyoruz.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'KVKK Uyumlu', desc: 'Kişisel veriler KVKK kapsamında korunur ve işlenir.' },
              { icon: CheckCircle2, title: 'Gerçek Öğrenci', desc: 'Sadece .edu.tr uzantılı e-posta ile kayıt yapılabilir.' },
              { icon: BookOpen, title: 'Akademik Odaklı', desc: 'Yalnızca akademik çalışma amacıyla tasarlandı.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="glass-card p-6 text-center">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'rgba(232,160,32,0.1)' }}>
                  <Icon size={22} style={{ color: 'var(--amber)' }} />
                </div>
                <h3 className="font-display font-semibold text-cream mb-2">{title}</h3>
                <p className="text-sm" style={{ color: 'var(--mist)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ────────────────────────────────────── */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(232,160,32,0.07) 0%, transparent 65%)' }} />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <h2 className="font-display text-4xl md:text-6xl font-bold text-cream mb-6 leading-tight">
            Bugün başla,<br />
            <span style={{ color: 'var(--amber)', fontStyle: 'italic' }}>birlikte</span> ilerle.
          </h2>
          <p className="text-lg mb-10" style={{ color: 'var(--mist)' }}>
            Binlerce üniversite öğrencisiyle aynı platformda. Ücretsiz.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/kayit" className="btn-primary px-10 py-4 text-lg group">
              Ücretsiz Kayıt Ol
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/giris" className="btn-outline px-10 py-4 text-lg">
              Giriş Yap
            </Link>
          </div>
          <p className="mt-6 text-xs font-mono" style={{ color: 'rgba(138,154,170,0.5)' }}>
            Sadece .edu.tr uzantılı e-posta gereklidir
          </p>
        </div>
      </section>
    </PublicLayout>
  );
};

export default LandingPage;
