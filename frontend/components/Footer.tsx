'use client';

import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="relative bg-slate-900/70 backdrop-blur-2xl border-t border-slate-700/30 mt-12 sm:mt-16 shadow-lg shadow-slate-900/50 overflow-hidden" style={{ fontFamily: 'Jost, sans-serif' }}>
      {/* Shine Effect */}
      <div className="absolute top-0 right-0 w-3/5 h-full bg-gradient-to-l from-transparent via-white/30 to-transparent animate-shine-reverse pointer-events-none"></div>
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">{t('product')}</h4>
            <ul className="space-y-2 text-sm sm:text-base text-slate-400">
              <li><Link href="/" className="hover:text-blue-400 transition-colors">{t('home')}</Link></li>
              <li><Link href="/summarize" className="hover:text-blue-400 transition-colors">{t('startSummarizing')}</Link></li>
              <li><Link href="/#dashboard" className="hover:text-blue-400 transition-colors">{t('dashboard')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">{t('resources')}</h4>
            <ul className="space-y-2 text-sm sm:text-base text-slate-400">
              <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">{t('privacyPolicy')}</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">{t('contactFooter')}</Link></li>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">{t('github')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">{t('legal')}</h4>
            <ul className="space-y-2 text-sm sm:text-base text-slate-400">
              <li><Link href="/terms" className="hover:text-blue-400 transition-colors">{t('terms')}</Link></li>
              <li><Link href="/data-policy" className="hover:text-blue-400 transition-colors">{t('data')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 border-t border-slate-700/30 pt-4 sm:pt-6 text-center text-xs sm:text-sm text-slate-400">
          {t('footerCopyright')}
        </div>
      </div>
    </footer>
  );
}
