// src/views/public/AboutPage.jsx
import React from 'react';
import PublicLayout from '../../components/layout/PublicLayout';

const AboutPage = () => (
  <PublicLayout>
    <div className="min-h-screen pt-32 pb-20 max-w-3xl mx-auto px-6">
      <p className="section-label mb-4">Platform</p>
      <h1 className="font-display text-5xl font-bold text-cream mb-8">Hakkımızda</h1>
      <div className="glass-card p-8 space-y-6 text-base leading-relaxed" style={{ color: 'var(--mist)' }}>
        <p><strong className="text-cream">Çalışma Arkadaşını Bul</strong>, üniversite öğrencilerinin akademik yalnızlık, motivasyon düşüklüğü ve düzensiz çalışma alışkanlıkları sorunlarını çözmek amacıyla geliştirilmiş bir dijital akran destek platformudur.</p>
        <p>Akran desteğinin öğrenmeye olumlu etkisi, sosyal bağların motivasyon üzerindeki rolü ve planlı çalışma sistemlerinin akademik başarıya katkısı akademik literatürde kanıtlanmış olgulardır. Bu platform bu bilimsel zeminden yola çıkarak tasarlanmıştır.</p>
        <h2 className="font-display text-2xl font-semibold text-cream">Vizyon</h2>
        <p>Üniversite öğrencileri için dijital bir akademik destek ağı oluşturmak.</p>
        <h2 className="font-display text-2xl font-semibold text-cream">Misyon</h2>
        <p>Öğrencilerin motivasyon, sosyal bağlılık ve çalışma disiplinini artırmak.</p>
      </div>
    </div>
  </PublicLayout>
);

export default AboutPage;
