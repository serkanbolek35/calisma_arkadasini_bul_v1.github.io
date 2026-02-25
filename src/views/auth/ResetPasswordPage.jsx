// src/views/auth/ResetPasswordPage.jsx
import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '../../services/firebase';
import AuthLayout from '../../components/layout/AuthLayout';
import { validatePassword } from '../../utils/validators';

const ResetPasswordPage = () => {
  const [params] = useSearchParams();
  const oobCode = params.get('oobCode');
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const pErrs = validatePassword(form.password);
    if (pErrs.length > 0) { setError(pErrs[0]); return; }
    if (form.password !== form.confirm) { setError('Şifreler eşleşmiyor.'); return; }
    if (!oobCode) { setError('Geçersiz veya süresi dolmuş bağlantı.'); return; }
    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, form.password);
      setSuccess(true);
    } catch (err) {
      if (err.code === 'auth/expired-action-code') setError('Bağlantının süresi dolmuş. Yeni sıfırlama talebi oluşturun.');
      else if (err.code === 'auth/invalid-action-code') setError('Geçersiz bağlantı. Yeni sıfırlama talebi oluşturun.');
      else setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout title="Şifre Güncellendi" subtitle="">
        <div className="flex flex-col items-center text-center gap-6 py-4">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center"
            style={{ background: 'rgba(58,138,90,0.1)', border: '1px solid rgba(58,138,90,0.2)' }}>
            <CheckCircle2 size={36} style={{ color: '#3A8A5A' }} />
          </div>
          <p className="text-cream">Şifreniz başarıyla güncellendi. Yeni şifrenizle giriş yapabilirsiniz.</p>
          <Link to="/giris" className="btn-primary px-8 py-3">Giriş Yap</Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Yeni Şifre Belirle" subtitle="Güvenli ve hatırlanabilir bir şifre seçin.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl text-sm"
            style={{ background: 'rgba(200,64,64,0.1)', border: '1px solid rgba(200,64,64,0.25)', color: '#E87070' }}>
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {[
          { id: 'password', label: 'Yeni Şifre', ph: 'En az 8 karakter', show: showPass, toggle: () => setShowPass(s => !s), field: 'password' },
          { id: 'confirm', label: 'Yeni Şifre Tekrar', ph: 'Şifrenizi tekrar girin', show: showPass, toggle: () => setShowPass(s => !s), field: 'confirm' },
        ].map(({ id, label, ph, show, toggle, field }) => (
          <div key={id} className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-xs font-mono tracking-wide uppercase" style={{ color: 'var(--mist)' }}>
              {label}
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <Lock size={16} style={{ color: 'var(--mist)' }} />
              </div>
              <input id={id} type={show ? 'text' : 'password'}
                value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                placeholder={ph} className="input-field pl-10 pr-10" />
              <button type="button" onClick={toggle}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity">
                {show ? <EyeOff size={16} className="text-cream" /> : <Eye size={16} className="text-cream" />}
              </button>
            </div>
          </div>
        ))}

        <button type="submit" disabled={loading}
          className="btn-primary w-full py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-ink border-t-transparent rounded-full animate-spin" />
              Güncelleniyor...
            </span>
          ) : 'Şifremi Güncelle'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
