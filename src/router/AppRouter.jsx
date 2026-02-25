// src/router/AppRouter.jsx
import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Public Pages
const LandingPage = lazy(() => import('../views/public/LandingPage'));
const AboutPage = lazy(() => import('../views/public/AboutPage'));
const HowItWorksPage = lazy(() => import('../views/public/HowItWorksPage'));
const FaqPage = lazy(() => import('../views/public/FaqPage'));
const ContactPage = lazy(() => import('../views/public/ContactPage'));
const PrivacyPage = lazy(() => import('../views/public/PrivacyPage'));
const TermsPage = lazy(() => import('../views/public/TermsPage'));
const KvkkPage = lazy(() => import('../views/public/KvkkPage'));

// Auth Pages
const LoginPage = lazy(() => import('../views/auth/LoginPage'));
const RegisterPage = lazy(() => import('../views/auth/RegisterPage'));
const EmailVerifyPage = lazy(() => import('../views/auth/EmailVerifyPage'));
const ForgotPasswordPage = lazy(() => import('../views/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../views/auth/ResetPasswordPage'));
const AccountActivatedPage = lazy(() => import('../views/auth/AccountActivatedPage'));

// Onboarding
const OnboardingPage = lazy(() => import('../views/onboarding/OnboardingPage'));

// App - Protected Pages
const DashboardPage = lazy(() => import('../views/app/DashboardPage'));
const MatchesPage = lazy(() => import('../views/app/MatchesPage'));
const SessionsPage = lazy(() => import('../views/app/SessionsPage'));
const ProgressPage = lazy(() => import('../views/app/ProgressPage'));
const SurveyPage = lazy(() => import('../views/app/SurveyPage'));

// System
const NotFoundPage = lazy(() => import('../views/system/NotFoundPage'));

// Loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen bg-ink flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div
        className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: 'rgba(232,160,32,0.3)', borderTopColor: 'var(--amber)' }}
      />
      <p className="text-sm font-body" style={{ color: 'var(--mist)' }}>Yükleniyor...</p>
    </div>
  </div>
);

// Protected Route
const ProtectedRoute = ({ children, requireOnboarding = true }) => {
  const { currentUser, isOnboardingComplete, loading } = useAuth();
  if (loading) return <LoadingFallback />;
  if (!currentUser) return <Navigate to="/giris" replace />;
  if (requireOnboarding && !isOnboardingComplete) return <Navigate to="/onboarding" replace />;
  return children;
};

// Auth Route (login/register)
const AuthRoute = ({ children }) => {
  const { currentUser, isOnboardingComplete, loading } = useAuth();
  if (loading) return <LoadingFallback />;
  if (currentUser) {
    if (!isOnboardingComplete) return <Navigate to="/onboarding" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

// AppRouter
const AppRouter = () => (
  <HashRouter>
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/hakkimizda" element={<AboutPage />} />
        <Route path="/nasil-calisir" element={<HowItWorksPage />} />
        <Route path="/sss" element={<FaqPage />} />
        <Route path="/iletisim" element={<ContactPage />} />
        <Route path="/gizlilik" element={<PrivacyPage />} />
        <Route path="/kullanim-sartlari" element={<TermsPage />} />
        <Route path="/kvkk" element={<KvkkPage />} />

        {/* Auth */}
        <Route path="/giris" element={<AuthRoute><LoginPage /></AuthRoute>} />
        <Route path="/kayit" element={<AuthRoute><RegisterPage /></AuthRoute>} />
        <Route path="/email-dogrula" element={<EmailVerifyPage />} />
        <Route path="/email-dogrulama-basarili" element={<AccountActivatedPage />} />
        <Route path="/sifremi-unuttum" element={<ForgotPasswordPage />} />
        <Route path="/sifre-sifirla" element={<ResetPasswordPage />} />

        {/* Onboarding */}
        <Route path="/onboarding" element={
          <ProtectedRoute requireOnboarding={false}><OnboardingPage /></ProtectedRoute>
        } />

        {/* App - Protected */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/eslesmeler" element={<ProtectedRoute><MatchesPage /></ProtectedRoute>} />
        <Route path="/oturumlar" element={<ProtectedRoute><SessionsPage /></ProtectedRoute>} />
        <Route path="/oturumlar/planla" element={<ProtectedRoute><SessionsPage /></ProtectedRoute>} />
        <Route path="/ilerleme" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
        <Route path="/anket" element={<ProtectedRoute><SurveyPage /></ProtectedRoute>} />

        {/* System */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  </HashRouter>
);

export default AppRouter;