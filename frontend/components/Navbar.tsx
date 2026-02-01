'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import gsap from 'gsap';
import { useLanguage } from '../contexts/LanguageContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const { t, language } = useLanguage();

  useEffect(() => {
    // Check if user is logged in by checking localStorage
    const checkLoginStatus = () => {
      const credentials = localStorage.getItem('userCredentials');
      const profile = localStorage.getItem('userProfile');
      setIsLoggedIn(!!credentials);
      
      if (profile) {
        const userData = JSON.parse(profile);
        setUserRole(userData.role || '');
      }
    };
    
    checkLoginStatus();
    // Listen for storage changes to update login status
    window.addEventListener('storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleIconHover = (iconClass: string) => {
    gsap.to(`${iconClass} svg`, {
      rotation: 360,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  const handleIconLeave = (iconClass: string) => {
    gsap.to(`${iconClass} svg`, {
      rotation: 0,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <header className="fixed top-0 w-full z-50 h-[70px] px-4 sm:px-6 lg:px-10 bg-slate-900/70 backdrop-blur-2xl border-b border-slate-700/30 shadow-lg shadow-slate-900/50">
      {/* Shine Effect */}
      <div className="absolute top-0 left-0 w-3/5 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine pointer-events-none"></div>
      
      <div className="relative h-full max-w-7xl mx-auto">
        <nav className="flex items-center justify-between h-full w-full">
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <img 
                src="/LOGO NOBGN.png" 
                alt="Health Summarizer Logo" 
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain flex-shrink-0"
              />
              <span className="text-sm sm:text-base md:text-xl truncate max-w-[120px] sm:max-w-none tracking-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                <span className="text-[#4169E1] font-bold">CARE</span>
                <span className="text-[#DC4C64] font-normal">INSIGHT</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4 lg:gap-6 ml-auto" style={{ fontFamily: 'Jost, sans-serif' }}>
            <Link href="/" className="relative text-slate-200 hover:text-white text-sm lg:text-[0.95rem] whitespace-nowrap group">
              {t('home')}
              <span className="absolute left-0 bottom-[-6px] w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/#dashboard" className="relative text-slate-200 hover:text-white text-sm lg:text-[0.95rem] whitespace-nowrap group">
              {t('dashboard')}
              <span className="absolute left-0 bottom-[-6px] w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/search" className="relative text-slate-200 hover:text-white text-sm lg:text-[0.95rem] whitespace-nowrap group">
              {t('search')}
              <span className="absolute left-0 bottom-[-6px] w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/about" className="relative text-slate-200 hover:text-white text-sm lg:text-[0.95rem] whitespace-nowrap group">
              {t('about')}
              <span className="absolute left-0 bottom-[-6px] w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
            {!isLoggedIn && (
              <Link href="/login" className="relative text-slate-200 hover:text-white text-sm lg:text-[0.95rem] whitespace-nowrap group">
                {t('login')}
                <span className="absolute left-0 bottom-[-6px] w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3 lg:gap-4 ml-4 lg:ml-6 flex-shrink-0" style={{ fontFamily: 'Jost, sans-serif' }}>
            {/* Profile Icon */}
            {isLoggedIn && (
              <Link href="/profile" className="profile-icon hidden md:flex items-center justify-center w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-slate-700/50 hover:bg-slate-600 transition-all duration-300 group" aria-label="Profile" onMouseEnter={() => handleIconHover('.profile-icon')} onMouseLeave={() => handleIconLeave('.profile-icon')}>
                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-slate-200 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}

            {/* Settings Icon */}
            <Link href="/settings" className="settings-icon hidden md:flex items-center justify-center w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-slate-700/50 hover:bg-slate-600 transition-all duration-300 group" aria-label="Settings" onMouseEnter={() => handleIconHover('.settings-icon')} onMouseLeave={() => handleIconLeave('.settings-icon')}>
              <svg className="w-4 h-4 lg:w-5 lg:h-5 text-slate-200 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>

            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-200 hover:bg-slate-700/50 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </nav>

        {open && (
          <div className="absolute top-[70px] left-0 right-0 md:hidden bg-slate-900/95 backdrop-blur-2xl border-b border-slate-700/30 shadow-2xl" style={{ fontFamily: 'Jost, sans-serif' }}>
            <div className="flex flex-col py-4 px-4">
              <Link href="/" className="px-4 py-3 rounded-lg text-slate-200 hover:bg-slate-700/50 transition-all" onClick={() => setOpen(false)}>{t('home')}</Link>
              <Link href="/#dashboard" className="px-4 py-3 rounded-lg text-slate-200 hover:bg-slate-700/50 transition-all" onClick={() => setOpen(false)}>{t('dashboard')}</Link>
              <Link href="/about" className="px-4 py-3 rounded-lg text-slate-200 hover:bg-slate-700/50 transition-all" onClick={() => setOpen(false)}>{t('about')}</Link>
              <Link href="/settings" className="px-4 py-3 rounded-lg text-slate-200 hover:bg-slate-700/50 transition-all" onClick={() => setOpen(false)}>{t('settings')}</Link>
              {isLoggedIn && (
                <Link href="/profile" className="px-4 py-3 rounded-lg text-slate-200 hover:bg-slate-700/50 transition-all" onClick={() => setOpen(false)}>{t('profile')}</Link>
              )}
              {!isLoggedIn && (
                <Link href="/login" className="px-4 py-3 rounded-lg text-slate-200 hover:bg-slate-700/50 transition-all" onClick={() => setOpen(false)}>{t('login')}</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
