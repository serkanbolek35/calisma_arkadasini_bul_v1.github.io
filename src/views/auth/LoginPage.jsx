// src/views/auth/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle, LogIn } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import { loginUser, getAuthErrorMessage } from '../../services/auth.service';
import { updateLastLogin } from '../../services/user.service';
import { isEduEmail } from '../../utils/validators';

const InputGroup = ({ label, id, type, value, onChange, placeholder, error, icon: Icon, rightEl }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-xs font-mono tracking-wide uppercase"
      style={{ color: 'var(--mist)' }}>{label}</label>
    <div className="relative">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
        <Icon size={16} style={{ color: error ? 'var(--error)' : 'var(--mist)' }} />
      </div>
      <input
        id={id} type={type} value={value} onChange={onChange}
        placeholder={placeholder}
        className={`input-field pl-10 pr-${rightEl ? '10' : '4'} ${error ? 'error' : ''}`}
      />
      {rightEl && (
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightEl}</div>
      )}
    </div>
    {error && (
      <p className="text-xs flex items-center gap-1.5" style={{ color: 'var(--error)' }}>
        <AlertCircle size={12} /> {error}
      </p>
    )}
  </div>
);

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'E-posta adresi zorunludur.';
    else if (!isEduEmail(form.email)) e.email = 'Sadece .edu.tr uzantılı e-postalar kabul edilir.';
    if (!form.password) e.password = 'Şifre zorunludur.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await loginUser(form);
      await updateLastLogin(user.uid);

      if (!user.emailVerified) {
        navigate('/email-dogrula');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setApiError(getAuthErrorMessage(err.code) || err.message);
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(er => ({ ...er, [field]: '' }));
    setApiError('');
  };

  return (
    <AuthLayout
      title="Tekrar hoş geldin."
      subtitle="Akademik çalışma arkadaşlarınla buluşmak için giriş yap."
      footerText="Hesabın yok mu?"
      footerLink="/kayit"
      footerLinkText="Kayıt Ol →"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        {/* API Error */}
        {apiError && (
          <div className="flex items-start gap-3 p-4 rounded-xl text-sm"
            style={{ background: 'rgba(200,64,64,0.1)', border: '1px solid rgba(200,64,64,0.25)', color: '#E87070' }}>
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            {apiError}
          </div>
        )}

        <InputGroup
          label="E-posta Adresi" id="email" type="email"
          value={form.email} onChange={set('email')}
          placeholder="ad.soyad@uni.edu.tr"
          error={errors.email} icon={Mail}
        />

        <InputGroup
          label="Şifre" id="password"
          type={showPass ? 'text' : 'password'}
          value={form.password} onChange={set('password')}
          placeholder="••••••••"
          error={errors.password} icon={Lock}
          rightEl={
            <button type="button" onClick={() => setShowPass(s => !s)} className="p-1 transition-opacity hover:opacity-100 opacity-50">
              {showPass ? <EyeOff size={16} className="text-cream" /> : <Eye size={16} className="text-cream" />}
            </button>
          }
        />

        {/* Remember & Forgot */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: 'var(--mist)' }}>
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
              className="w-4 h-4 rounded accent-amber-500 cursor-pointer" />
            Beni Hatırla
          </label>
          <Link to="/sifremi-unuttum" className="text-sm transition-colors"
            style={{ color: 'var(--amber)' }}
            onMouseEnter={e => e.target.style.color = 'var(--amber-light)'}
            onMouseLeave={e => e.target.style.color = 'var(--amber)'}>
            Şifremi Unuttum
          </Link>
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading}
          className="btn-primary w-full py-3.5 text-base mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-ink border-t-transparent rounded-full animate-spin" />
              Giriş yapılıyor...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <LogIn size={18} /> Giriş Yap
            </span>
          )}
        </button>

        {/* Divider */}
        <div className="relative flex items-center gap-4 my-1">
          <div className="flex-1 border-t" style={{ borderColor: 'rgba(245,237,216,0.1)' }} />
          <span className="text-xs" style={{ color: 'rgba(138,154,170,0.5)' }}>veya</span>
          <div className="flex-1 border-t" style={{ borderColor: 'rgba(245,237,216,0.1)' }} />
        </div>

        {/* Register CTA */}
        <Link to="/kayit"
          className="btn-outline w-full py-3.5 text-sm text-center hover:bg-cream/5 transition-all">
          Yeni hesap oluştur
        </Link>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
