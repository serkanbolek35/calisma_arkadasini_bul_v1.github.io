// src/views/public/PrivacyPage.jsx
import React from 'react';
import PublicLayout from '../../components/layout/PublicLayout';

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="font-display text-xl font-semibold text-cream mb-3">{title}</h2>
    <div className="text-sm leading-relaxed space-y-2" style={{ color: 'var(--mist)' }}>{children}</div>
  </div>
);

const PrivacyPage = () => (
  <PublicLayout>
    <div className="min-h-screen pt-32 pb-20 max-w-3xl mx-auto px-6">
      <p className="section-label mb-4">Hukuki</p>
      <h1 className="font-display text-4xl font-bold text-cream mb-2">Gizlilik Politikası</h1>
      <p className="text-sm mb-10" style={{ color: 'var(--mist)' }}>Son güncelleme: Ocak 2024</p>
      <div className="glass-card p-8">
        <Section title="Toplanan Veriler">
          <p>Ad, e-posta adresi, üniversite bilgisi, çalışma tercihleri ve anket sonuçları toplanmaktadır.</p>
        </Section>
        <Section title="Veri İşleme Amacı">
          <p>Verileriniz; eşleşme yapılması, ilerleme analizi ve akademik araştırma amacıyla işlenmektedir.</p>
        </Section>
        <Section title="Veri Saklama Süresi">
          <p>Hesabınız aktif olduğu sürece verileriniz saklanır. Hesap silme talebinde tüm veriler kalıcı olarak silinir.</p>
        </Section>
        <Section title="Kullanıcı Hakları">
          <p>Verilerinize erişim, düzeltme ve silme hakkına sahipsiniz. Talepleriniz için iletişim sayfamızı kullanabilirsiniz.</p>
        </Section>
        <Section title="Üçüncü Taraflarla Paylaşım">
          <p>Kişisel verileriniz, yasal zorunluluklar dışında üçüncü taraflarla paylaşılmaz.</p>
        </Section>
      </div>
    </div>
  </PublicLayout>
);

export default PrivacyPage;
