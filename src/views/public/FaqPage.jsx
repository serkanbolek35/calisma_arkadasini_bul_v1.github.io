// src/views/public/FaqPage.jsx
import React, { useState } from 'react';
import PublicLayout from '../../components/layout/PublicLayout';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: 'Gerçek öğrenci doğrulaması nasıl yapılıyor?', a: 'Sadece .edu.tr uzantılı e-posta adresleri kabul edilir. Kayıt sonrası e-posta doğrulama linki gönderilir.' },
  { q: 'Aynı üniversiteden biriyle mi eşleşiyorum?', a: 'Öncelik aynı üniversite ve kampüsteki öğrencilere verilir, ancak uzaktan çalışma seçeneği varsa diğer üniversitelerden eşleşme de mümkündür.' },
  { q: 'Eşleşmeyi iptal edebilir miyim?', a: 'Evet, her zaman eşleşmeyi sonlandırabilirsiniz. Sebep belirtmek zorunlu değildir.' },
  { q: 'Oturumu kaçırırsam ne olur?', a: 'Oturum "iptal" olarak işaretlenir. Yeni oturum planlayabilirsiniz.' },
  { q: 'Platform ücretsiz mi?', a: 'Evet, platform tamamen ücretsizdir.' },
  { q: 'Verilerim kimlerle paylaşılır?', a: 'Kişisel verileriniz üçüncü taraflarla paylaşılmaz. KVKK kapsamında işlenir.' },
];

const FaqPage = () => {
  const [open, setOpen] = useState(null);
  return (
    <PublicLayout>
      <div className="min-h-screen pt-32 pb-20 max-w-2xl mx-auto px-6">
        <p className="section-label mb-4">Yardım</p>
        <h1 className="font-display text-5xl font-bold text-cream mb-10">Sıkça Sorulan Sorular</h1>
        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-card overflow-hidden">
              <button className="w-full px-6 py-4 text-left flex items-center justify-between gap-4"
                onClick={() => setOpen(open === i ? null : i)}>
                <span className="font-display font-semibold text-cream text-base">{faq.q}</span>
                <ChevronDown size={18} className="flex-shrink-0 transition-transform duration-200"
                  style={{ color: 'var(--amber)', transform: open === i ? 'rotate(180deg)' : 'none' }} />
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-sm leading-relaxed" style={{ color: 'var(--mist)', borderTop: '1px solid rgba(245,237,216,0.07)' }}>
                  <div className="pt-4">{faq.a}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
};

export default FaqPage;
