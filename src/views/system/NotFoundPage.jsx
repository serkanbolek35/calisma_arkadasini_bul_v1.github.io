// src/views/system/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Logo } from '../../components/layout/PublicLayout';

const NotFoundPage = () => (
  <div className="min-h-screen bg-ink flex flex-col items-center justify-center px-6 text-center">
    <div className="fixed inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
    <div className="relative z-10">
      <Logo />
      <div className="mt-16 mb-8">
        <h1 className="font-display text-[120px] leading-none font-bold"
          style={{ color: 'rgba(232,160,32,0.15)' }}>404</h1>
        <p className="font-display text-3xl font-bold text-cream -mt-8">Sayfa Bulunamadı</p>
        <p className="mt-4 text-base" style={{ color: 'var(--mist)' }}>
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link to="/" className="btn-primary px-6 py-3 flex items-center gap-2">
          <ArrowLeft size={16} /> Ana Sayfaya Dön
        </Link>
        <Link to="/dashboard" className="btn-outline px-6 py-3">Dashboard'a Git</Link>
      </div>
    </div>
  </div>
);

export default NotFoundPage;
