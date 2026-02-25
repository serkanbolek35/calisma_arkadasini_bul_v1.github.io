// src/views/auth/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, UserPlus, CheckCircle2 } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import { registerUser, getAuthErrorMessage } from '../../services/auth.service';
import { isEduEmail, validatePassword, getPasswordStrength } from '../../utils/validators';

// ── Password strength bar ─────────────────────────────────────
const PasswordStrengthBar = ({ password }) => {
  if (!password) return null;
  const { level, label, color } = getPasswordStrength(password);
  const widths = { weak: '33%', medium: '66%', strong: '100%' };
  return (
    <div className="flex flex-col gap-1.5">
      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(245,237,216,0.1)' }}>
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width: widths[level], background: color }} />
      </div>
      <p className="text-xs" style={{ color }}>Şifre gücü: <span className="font-medium">{label}</span></p>
    </div>
  );
};

// ── Requirement pill ──────────────────────────────────────────
const Req = ({ met, text }) => (
  <div className="flex items-center gap-1.5 text-xs"
    style={{ color: met ? 'var(--success)' : 'var(--mist)' }}>
    <CheckCircle2 size={11} style={{ opacity: met ? 1 : 0.3 }} />
    {text}
  </div>
);

const InputGroup = ({ label, id, type, value, onChange, placeholder, error, icon: Icon, rightEl }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-xs font-mono tracking-wide uppercase" style={{ color: 'var(--mist)' }}>
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
        <Icon size={16} style={{ color: error ? 'var(--error)' : 'var(--mist)' }} />
      </div>
      <input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder}
        className={`input-field pl-10 ${rightEl ? 'pr-10' : 'pr-4'} ${error ? 'error' : ''}`} />
      {rightEl && <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightEl}</div>}
    </div>
    {error && (
      <p className="text-xs flex items-center gap-1.5" style={{ color: 'var(--error)' }}>
        <AlertCircle size={12} /> {error}
      </p>
    )}
  </div>
);

const Checkbox = ({ id, checked, onChange, children }) => (
  <label htmlFor={id} className="flex items-start gap-3 cursor-pointer group">
    <input id={id} type="checkbox" checked={checked} onChange={onChange}
      className="mt-0.5 w-4 h-4 flex-shrink-0 rounded cursor-pointer accent-yellow-500" />
    <span className="text-xs leading-relaxed" style={{ color: 'var(--mist)' }}>{children}</span>
  </label>
);

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ displayName: '', email: '', password: '', passwordConfirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [showPassConfirm, setShowPassConfirm] = useState(false);
  const [consents, setConsents] = useState({ terms: false, privacy: false, kvkk: false });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const pReqs = validatePassword(form.password);

  const validate = () => {
    const e = {};
    if (!form.displayName.trim()) e.displayName = 'Ad Soyad zorunludur.';
    if (!form.email) e.email = 'E-posta adresi zorunludur.';
    else if (!isEduEmail(form.email)) e.email = 'Sadece .edu.tr uzantılı e-postalar kabul edilir.';
    if (!form.password) e.password = 'Şifre zorunludur.';
    else if (pReqs.length > 0) e.password = 'Şifre gereksinimlerini karşılamıyor.';
    if (form.password !== form.passwordConfirm) e.passwordConfirm = 'Şifreler eşleşmiyor.';
    if (!consents.terms) e.terms = 'Kullanım şartlarını kabul etmelisiniz.';
    if (!consents.privacy) e.privacy = 'Gizlilik politikasını kabul etmelisiniz.';
    if (!consents.kvkk) e.kvkk = 'KVKK metnini kabul etmelisiniz.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await registerUser({ email: form.email, password: form.password, displayName: form.displayName.trim() });
      navigate('/email-dogrula');
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
      title="Hesap Oluştur"
      subtitle="Üniversite e-postanla kayıt ol ve çalışma arkadaşını bul."
      footerText="Zaten hesabın var mı?"
      footerLink="/giris"
      footerLinkText="Giriş Yap →"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        {apiError && (
          <div className="flex items-start gap-3 p-4 rounded-xl text-sm"
            style={{ background: 'rgba(200,64,64,0.1)', border: '1px solid rgba(200,64,64,0.25)', color: '#E87070' }}>
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            {apiError}
          </div>
        )}

        <InputGroup label="Ad Soyad" id="displayName" type="text"
          value={form.displayName} onChange={set('displayName')}
          placeholder="Ali Veli" error={errors.displayName} icon={User} />

        <InputGroup label="Üniversite E-postası" id="email" type="email"
          value={form.email} onChange={set('email')}
          placeholder="ali.veli@ogr.uni.edu.tr" error={errors.email} icon={Mail} />

        <div className="flex flex-col gap-2">
          <InputGroup label="Şifre" id="password"
            type={showPass ? 'text' : 'password'}
            value={form.password} onChange={set('password')}
            placeholder="En az 8 karakter" error={errors.password} icon={Lock}
            rightEl={
              <button type="button" onClick={() => setShowPass(s => !s)}
                className="p-1 transition-opacity hover:opacity-100 opacity-50">
                {showPass ? <EyeOff size={16} className="text-cream" /> : <Eye size={16} className="text-cream" />}
              </button>
            }
          />
          {form.password && (
            <div className="pl-1">
              <PasswordStrengthBar password={form.password} />
              <div className="mt-2 grid grid-cols-2 gap-1">
                <Req met={form.password.length >= 8} text="En az 8 karakter" />
                <Req met={/[A-Z]/.test(form.password)} text="Büyük harf" />
                <Req met={/[a-z]/.test(form.password)} text="Küçük harf" />
                <Req met={/[0-9]/.test(form.password)} text="Rakam" />
                <Req met={/[^A-Za-z0-9]/.test(form.password)} text="Özel karakter" />
              </div>
            </div>
          )}
        </div>

        <InputGroup label="Şifre Tekrar" id="passwordConfirm"
          type={showPassConfirm ? 'text' : 'password'}
          value={form.passwordConfirm} onChange={set('passwordConfirm')}
          placeholder="Şifrenizi tekrar girin" error={errors.passwordConfirm} icon={Lock}
          rightEl={
            <button type="button" onClick={() => setShowPassConfirm(s => !s)}
              className="p-1 transition-opacity hover:opacity-100 opacity-50">
              {showPassConfirm ? <EyeOff size={16} className="text-cream" /> : <Eye size={16} className="text-cream" />}
            </button>
          }
        />

        {/* Consent checkboxes */}
        <div className="flex flex-col gap-3 pt-2 pb-1">
          <Checkbox id="terms" checked={consents.terms}
            onChange={e => setConsents(c => ({ ...c, terms: e.target.checked }))}>
            <Link to="/kullanim-sartlari" target="_blank" className="underline hover:no-underline"
              style={{ color: 'var(--amber)' }}>Kullanım Şartları</Link>'nı okudum ve kabul ediyorum. *
            {errors.terms && <span className="block text-xs mt-0.5" style={{ color: 'var(--error)' }}>{errors.terms}</span>}
          </Checkbox>
          <Checkbox id="privacy" checked={consents.privacy}
            onChange={e => setConsents(c => ({ ...c, privacy: e.target.checked }))}>
            <Link to="/gizlilik" target="_blank" className="underline hover:no-underline"
              style={{ color: 'var(--amber)' }}>Gizlilik Politikası</Link>'nı okudum ve kabul ediyorum. *
            {errors.privacy && <span className="block text-xs mt-0.5" style={{ color: 'var(--error)' }}>{errors.privacy}</span>}
          </Checkbox>
          <Checkbox id="kvkk" checked={consents.kvkk}
            onChange={e => setConsents(c => ({ ...c, kvkk: e.target.checked }))}>
            <Link to="/kvkk" target="_blank" className="underline hover:no-underline"
              style={{ color: 'var(--amber)' }}>KVKK Aydınlatma Metni</Link>'ni okudum ve onaylıyorum. *
            {errors.kvkk && <span className="block text-xs mt-0.5" style={{ color: 'var(--error)' }}>{errors.kvkk}</span>}
          </Checkbox>
        </div>

        <button type="submit" disabled={loading}
          className="btn-primary w-full py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-ink border-t-transparent rounded-full animate-spin" />
              Kayıt oluşturuluyor...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <UserPlus size={18} /> Kayıt Ol
            </span>
          )}
        </button>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
