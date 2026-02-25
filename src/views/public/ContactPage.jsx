// src/views/public/ContactPage.jsx
import React, { useState } from 'react';
import PublicLayout from '../../components/layout/PublicLayout';
import { Send, CheckCircle2 } from 'lucide-react';

const ContactPage = () => {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const s = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Firebase'e kaydet veya e-posta servisi entegre et
    setSent(true);
  };

  return (
    <PublicLayout>
      <div className="min-h-screen pt-32 pb-20 max-w-xl mx-auto px-6">
        <p className="section-label mb-4">Destek</p>
        <h1 className="font-display text-5xl font-bold text-cream mb-8">İletişim</h1>
        {sent ? (
          <div className="glass-card p-10 flex flex-col items-center text-center gap-4">
            <CheckCircle2 size={48} style={{ color: 'var(--sage-light)' }} />
            <h2 className="font-display text-2xl font-bold text-cream">Mesajınız Alındı</h2>
            <p style={{ color: 'var(--mist)' }}>En kısa sürede size dönüş yapacağız.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-card p-8 flex flex-col gap-5">
            {[['name','Ad Soyad','text'],['email','E-posta Adresi','email'],['subject','Konu','text']].map(([f, l, t]) => (
              <div key={f} className="flex flex-col gap-1.5">
                <label className="text-xs font-mono tracking-widest uppercase" style={{ color: 'var(--mist)' }}>{l}</label>
                <input type={t} value={form[f]} onChange={s(f)} required className="input-field" />
              </div>
            ))}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono tracking-widest uppercase" style={{ color: 'var(--mist)' }}>Mesaj</label>
              <textarea value={form.message} onChange={s('message')} rows={5} required
                className="input-field resize-none" />
            </div>
            <button type="submit" className="btn-primary flex items-center justify-center gap-2 py-3.5">
              <Send size={16} /> Gönder
            </button>
          </form>
        )}
      </div>
    </PublicLayout>
  );
};

export default ContactPage;
