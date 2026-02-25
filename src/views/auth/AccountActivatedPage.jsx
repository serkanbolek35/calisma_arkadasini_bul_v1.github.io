// src/views/auth/AccountActivatedPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';

const AccountActivatedPage = () => {
  const [count, setCount] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(c => {
        if (c <= 1) {
          clearInterval(timer);
          window.location.href = '/giris';
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <AuthLayout title="" subtitle="">
      <div className="flex flex-col items-center text-center gap-8 py-4">
        {/* Animated check */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(58,138,90,0.12)', border: '2px solid rgba(58,138,90,0.3)' }}>
            <CheckCircle2 size={48} style={{ color: '#3A8A5A' }} />
          </div>
          <div className="absolute inset-0 rounded-full animate-ping"
            style={{ background: 'rgba(58,138,90,0.08)', animationDuration: '2s' }} />
        </div>

        <div>
          <h1 className="font-display text-3xl font-bold text-cream mb-3">
            E-posta Doğrulandı! 🎉
          </h1>
          <p className="text-base leading-relaxed" style={{ color: 'var(--mist)' }}>
            Hesabın başarıyla aktif edildi. Artık çalışma arkadaşını
            bulabilir ve akademik yolculuğuna başlayabilirsin.
          </p>
        </div>

        <Link to="/giris" className="btn-primary px-8 py-3.5 text-base group">
          Giriş Yap
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </Link>

        <p className="text-xs" style={{ color: 'rgba(138,154,170,0.5)' }}>
          {count > 0 ? `${count} saniye sonra otomatik yönlendirileceksin` : 'Yönlendiriliyor...'}
        </p>
      </div>
    </AuthLayout>
  );
};

export default AccountActivatedPage;
