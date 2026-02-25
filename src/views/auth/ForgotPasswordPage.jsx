// src/views/auth/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, AlertCircle, CheckCircle2, Send } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import { requestPasswordReset } from '../../services/auth.service';
import { isEduEmail } from '../../utils/validators';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('E-posta adresi zorunludur.'); return; }
    if (!isEduEmail(email)) { setError('Sadece .edu.tr uzantılı e-postalar kabul edilir.'); return; }
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      // Güvenlik: Kayıtlı olmasa da aynı mesajı göster
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout title="E-posta Gönderildi" subtitle="">
        <div className="flex flex-col items-center text-center gap-6">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center"
            style={{ background: 'rgba(58,138,90,0.1)', border: '1px solid rgba(58,138,90,0.2)' }}>
            <CheckCircle2 size={36} style={{ color: '#3A8A5A' }} />
          </div>
          <div>
            <p className="text-cream leading-relaxed mb-2">
              Eğer <strong style={{ color: 'var(--amber)' }}>{email}</strong> sistemde kayıtlıysa,
              şifre sıfırlama bağlantısı gönderilmiştir.
            </p>
            <p className="text-sm" style={{ color: 'var(--mist)' }}>
              Spam/Gereksiz klasörünüzü kontrol etmeyi unutmayın.
              Bağlantı 1 saat geçerlidir.
            </p>
          </div>
          <Link to="/giris" className="btn-primary px-6 py-3 flex items-center gap-2">
            <ArrowLeft size={16} /> Giriş Sayfasına Dön
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Şifreni Sıfırla"
      subtitle="Üniversite e-postanı gir, sıfırlama bağlantısı gönderelim."
      footerText="Şifreni hatırladın mı?"
      footerLink="/giris"
      footerLinkText="Giriş Yap →"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl text-sm"
            style={{ background: 'rgba(200,64,64,0.1)', border: '1px solid rgba(200,64,64,0.25)', color: '#E87070' }}>
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs font-mono tracking-wide uppercase" style={{ color: 'var(--mist)' }}>
            E-posta Adresi
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <Mail size={16} style={{ color: 'var(--mist)' }} />
            </div>
            <input id="email" type="email" value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              placeholder="ali.veli@ogr.uni.edu.tr"
              className="input-field pl-10" />
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="btn-primary w-full py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-ink border-t-transparent rounded-full animate-spin" />
              Gönderiliyor...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Send size={16} /> Sıfırlama Bağlantısı Gönder
            </span>
          )}
        </button>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
