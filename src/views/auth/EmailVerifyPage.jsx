// src/views/auth/EmailVerifyPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, RefreshCw, CheckCircle2, LogOut } from 'lucide-react';
import { sendEmailVerification } from 'firebase/auth';
import { auth, logoutUser } from '../../services/auth.service';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/layout/AuthLayout';

const EmailVerifyPage = () => {
  const { currentUser } = useAuth();
  const [resent, setResent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleResend = async () => {
    if (!currentUser) return;
    setLoading(true);
    setError('');
    try {
      await sendEmailVerification(currentUser, {
        url: `${window.location.origin}/email-dogrulama-basarili`,
      });
      setResent(true);
      setTimeout(() => setResent(false), 30000);
    } catch (err) {
      if (err.code === 'auth/too-many-requests') {
        setError('Çok fazla istek gönderildi. Lütfen bekleyin.');
      } else {
        setError('E-posta gönderilemedi. Lütfen tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="E-postanı Doğrula" subtitle="">
      <div className="flex flex-col items-center text-center gap-6">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto animate-float"
          style={{ background: 'rgba(232,160,32,0.1)', border: '1px solid rgba(232,160,32,0.2)' }}>
          <Mail size={36} style={{ color: 'var(--amber)' }} />
        </div>

        <div>
          <p className="text-cream font-body leading-relaxed mb-1">
            Doğrulama e-postası şu adrese gönderildi:
          </p>
          <p className="font-mono text-sm px-3 py-1.5 rounded-lg inline-block"
            style={{ background: 'rgba(232,160,32,0.1)', color: 'var(--amber)' }}>
            {currentUser?.email || '...'}
          </p>
        </div>

        <p className="text-sm leading-relaxed" style={{ color: 'var(--mist)' }}>
          E-posta kutunuzu açın ve gelen doğrulama bağlantısına tıklayın.
          Bağlantı <strong className="text-cream">24 saat</strong> geçerlidir.
          Spam/Gereksiz klasörünüzü de kontrol etmeyi unutmayın.
        </p>

        {error && (
          <p className="text-sm px-4 py-3 rounded-xl w-full"
            style={{ background: 'rgba(200,64,64,0.1)', border: '1px solid rgba(200,64,64,0.2)', color: '#E87070' }}>
            {error}
          </p>
        )}

        {resent && (
          <div className="flex items-center gap-2 text-sm px-4 py-3 rounded-xl w-full"
            style={{ background: 'rgba(58,138,90,0.1)', border: '1px solid rgba(58,138,90,0.2)', color: '#5ABF8A' }}>
            <CheckCircle2 size={16} />
            E-posta tekrar gönderildi!
          </div>
        )}

        <button onClick={handleResend} disabled={loading || resent}
          className="btn-outline w-full py-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
              Gönderiliyor...
            </>
          ) : resent ? (
            <><CheckCircle2 size={16} /> Gönderildi</>
          ) : (
            <><RefreshCw size={16} /> Tekrar Gönder</>
          )}
        </button>

        <div className="w-full border-t pt-4" style={{ borderColor: 'rgba(245,237,216,0.08)' }}>
          <button onClick={() => logoutUser()}
            className="flex items-center gap-2 text-sm mx-auto transition-colors"
            style={{ color: 'var(--mist)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--cream)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--mist)'}>
            <LogOut size={15} /> Farklı hesapla giriş yap
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default EmailVerifyPage;
