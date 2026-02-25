// src/views/public/KvkkPage.jsx
import React from 'react';
import PublicLayout from '../../components/layout/PublicLayout';

const KvkkPage = () => (
  <PublicLayout>
    <div className="min-h-screen pt-32 pb-20 max-w-3xl mx-auto px-6">
      <p className="section-label mb-4">Hukuki</p>
      <h1 className="font-display text-4xl font-bold text-cream mb-10">KVKK Aydınlatma Metni</h1>
      <div className="glass-card p-8 space-y-6 text-sm leading-relaxed" style={{ color: 'var(--mist)' }}>
        <div><h2 className="font-display text-lg font-semibold text-cream mb-2">Veri Sorumlusu</h2>
          <p>Çalışma Arkadaşını Bul Platformu, 6698 sayılı KVKK kapsamında veri sorumlusu sıfatıyla hareket etmektedir.</p></div>
        <div><h2 className="font-display text-lg font-semibold text-cream mb-2">İşlenen Kişisel Veriler</h2>
          <p>Kimlik bilgisi, iletişim bilgisi ve akademik tercih bilgisi işlenmektedir.</p></div>
        <div><h2 className="font-display text-lg font-semibold text-cream mb-2">Hukuki Dayanak</h2>
          <p>Açık rıza ve hizmet sözleşmesi hukuki dayanağı ile veri işleme gerçekleştirilmektedir.</p></div>
        <div><h2 className="font-display text-lg font-semibold text-cream mb-2">Veri Aktarımı</h2>
          <p>Üçüncü taraflarla veri paylaşımı yasal zorunluluklar dışında yapılmamaktadır.</p></div>
        <div><h2 className="font-display text-lg font-semibold text-cream mb-2">İlgili Kişi Hakları</h2>
          <p>KVKK madde 11 kapsamında; kişisel verilerinizin işlenip işlenmediğini öğrenme, düzeltme isteme ve silme hakkına sahipsiniz.</p></div>
      </div>
    </div>
  </PublicLayout>
);

export default KvkkPage;
