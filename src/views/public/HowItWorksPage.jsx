// src/views/public/HowItWorksPage.jsx
import React from 'react';
import PublicLayout from '../../components/layout/PublicLayout';

const HowItWorksPage = () => (
  <PublicLayout>
    <div className="min-h-screen pt-32 pb-20 max-w-3xl mx-auto px-6">
      <p className="section-label mb-4">Sistem</p>
      <h1 className="font-display text-5xl font-bold text-cream mb-8">Nasıl Çalışır?</h1>
      <div className="space-y-6">
        {[
          ['1. Kayıt ve Doğrulama', '.edu.tr uzantılı e-posta adresinizle kayıt olun. E-posta doğrulandıktan sonra hesabınız aktif olur.'],
          ['2. Profil Oluşturma', 'Üniversite, fakülte, aldığınız dersler ve müsait olduğunuz saatleri girin.'],
          ['3. Eşleşme', 'Sistem ortak ders, kampüs ve zaman dilimine göre en uyumlu arkadaşı önerir. Uyum skoru hesaplanır.'],
          ['4. Oturum Planlama', 'Eşleştiğiniz arkadaşınızla tarih ve saat belirleyerek oturum planlayın.'],
          ['5. Canlı Çalışma', 'Kronometre ve odak modu ile verimli çalışın.'],
          ['6. Değerlendirme ve Takip', 'Oturum sonunda odak, stres ve verimlilik değerlendirmesi yapın. Grafiklerle ilerlemenizi izleyin.'],
        ].map(([title, desc]) => (
          <div key={title} className="glass-card p-6">
            <h2 className="font-display text-xl font-semibold text-cream mb-2">{title}</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--mist)' }}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </PublicLayout>
);

export default HowItWorksPage;
