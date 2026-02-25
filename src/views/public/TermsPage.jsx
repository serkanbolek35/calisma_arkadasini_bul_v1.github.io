// src/views/public/TermsPage.jsx
import React from 'react';
import PublicLayout from '../../components/layout/PublicLayout';

const TermsPage = () => (
  <PublicLayout>
    <div className="min-h-screen pt-32 pb-20 max-w-3xl mx-auto px-6">
      <p className="section-label mb-4">Hukuki</p>
      <h1 className="font-display text-4xl font-bold text-cream mb-10">Kullanım Şartları</h1>
      <div className="glass-card p-8 space-y-6 text-sm leading-relaxed" style={{ color: 'var(--mist)' }}>
        <div><h2 className="font-display text-lg font-semibold text-cream mb-2">Hizmet Tanımı</h2>
          <p>Bu platform; üniversite öğrencilerini akademik çalışma amacıyla eşleştiren bir dijital sistemdir.</p></div>
        <div><h2 className="font-display text-lg font-semibold text-cream mb-2">Kullanıcı Sorumlulukları</h2>
          <p>Doğru bilgi girme, saygılı iletişim ve akademik etik kurallara uyma zorunludur.</p></div>
        <div><h2 className="font-display text-lg font-semibold text-cream mb-2">Yasak Davranışlar</h2>
          <p>Sahte hesap açma, taciz, spam ve veri manipülasyonu kesinlikle yasaktır.</p></div>
        <div><h2 className="font-display text-lg font-semibold text-cream mb-2">Hesap Sonlandırma</h2>
          <p>Kural ihlali durumunda hesabınız uyarı yapılmaksızın askıya alınabilir.</p></div>
      </div>
    </div>
  </PublicLayout>
);

export default TermsPage;
