'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SectionHeading from '../components/SectionHeading';
import FeatureCard from '../components/FeatureCard';
import ScrollToDemo from '../components/ScrollToDemo';
import ScrollToAbout from '../components/ScrollToAbout';
import ScrollTopButton from '../components/ScrollTopButton';
import AnimatedBackground from '../components/AnimatedBackground';
import { useLanguage } from '../contexts/LanguageContext';

export default function Home() {
  const { t } = useLanguage();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<Array<{role: 'patient' | 'doctor', text: string, time: string}>>([
    { role: 'doctor', text: 'Hello! How can I help you today?', time: '10:30 AM' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Show welcome message for new registrations
  useEffect(() => {
    const newUserId = sessionStorage.getItem('newUserId');
    if (newUserId) {
      // Show the ID in a non-blocking way
      setTimeout(() => {
        alert(`Welcome! Your Unique ID is: ${newUserId}\n\nPlease save this ID for future reference.`);
        sessionStorage.removeItem('newUserId');
      }, 100);
    }

    // Check user role
    const profile = localStorage.getItem('userProfile');
    if (profile) {
      const userData = JSON.parse(profile);
      setUserRole(userData.role || '');
    }
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setChatMessages(prev => [...prev, { role: 'patient', text: newMessage, time }]);
    setNewMessage('');

    // Simulate doctor response
    setTimeout(() => {
      const responses = [
        "I'll review your medical history and get back to you shortly.",
        "Thank you for reaching out. Let me check your records.",
        "I understand your concern. Can you provide more details?",
        "I recommend scheduling an appointment to discuss this further.",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const responseTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      setChatMessages(prev => [...prev, { role: 'doctor', text: randomResponse, time: responseTime }]);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 relative">
      <AnimatedBackground />
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-[90px] sm:pt-[100px] pb-8 sm:pb-12">{/* pt-[100px] accounts for fixed navbar */}
        {/* HERO */}
        <section className="bg-slate-700/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-12 lg:p-16 shadow-2xl border border-slate-600/50 hover:shadow-[0_20px_80px_rgba(0,0,0,0.15)] transition-all duration-500">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-700/20 border border-slate-700/50 mb-6">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-medium text-slate-200">Privacy-First AI Platform</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4 sm:mb-6" style={{ fontFamily: 'Righteous, sans-serif' }}>{t('tagline')}</h1>
            <p className="mt-4 text-base sm:text-lg lg:text-xl text-slate-200 max-w-2xl mx-auto">{t('subtitle')}</p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/summarize" className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-700 text-white font-semibold hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 shadow-xl">
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                {t('startSummarizing')}
              </Link>
            </div>
          </div>
        </section>

        {/* TRUST STATS */}
        <section className="mt-8 sm:mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="group relative rounded-2xl bg-gradient-to-br from-blue-600/20 to-blue-700/20 backdrop-blur-lg p-6 border border-slate-600/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/10 group-hover:to-blue-600/10 rounded-2xl transition-all duration-300"></div>
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white mb-4 shadow-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">100% Private</h3>
                <p className="text-sm text-slate-200">Zero-storage architecture. Your data never leaves your device.</p>
              </div>
            </div>

            <div className="group relative rounded-2xl bg-gradient-to-br from-purple-600/20 to-purple-700/20 backdrop-blur-lg p-6 border border-slate-600/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-600/0 group-hover:from-purple-500/10 group-hover:to-purple-600/10 rounded-2xl transition-all duration-300"></div>
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white mb-4 shadow-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">AI-Powered</h3>
                <p className="text-sm text-slate-200">Advanced summarization with source citations and explanations.</p>
              </div>
            </div>

            <div className="group relative rounded-2xl bg-gradient-to-br from-pink-600/20 to-pink-700/20 backdrop-blur-lg p-6 border border-slate-600/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-pink-600/0 group-hover:from-pink-500/10 group-hover:to-pink-600/10 rounded-2xl transition-all duration-300"></div>
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center text-white mb-4 shadow-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">HIPAA Ready</h3>
                <p className="text-sm text-slate-200">Compliant architecture designed for healthcare privacy standards.</p>
              </div>
            </div>
          </div>
        </section>

        {/* HEALTH DASHBOARD - Hidden for doctors */}
        {userRole !== 'doctor' && (
          <section id="dashboard" className="mt-12 sm:mt-16 lg:mt-20">
            <div className="mb-8 sm:mb-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-700/50 mb-4">
                <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                <span className="text-sm font-medium text-slate-200">Health Dashboard</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">Your Health Overview</h2>
              <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto">
                Track your diseases, treatments, progress, and stay on top of your medication schedule
              </p>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Diseases Card */}
            <div className="bg-slate-700/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-slate-600/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white shadow-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Diseases</h3>
                  <p className="text-sm text-slate-400">Active conditions</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="p-3 bg-slate-600/50 rounded-lg">
                  <p className="text-sm font-medium text-white">Type 2 Diabetes</p>
                  <p className="text-xs text-slate-400 mt-1">Since 2024</p>
                </div>
                <div className="p-3 bg-slate-600/50 rounded-lg">
                  <p className="text-sm font-medium text-white">Hypertension</p>
                  <p className="text-xs text-slate-400 mt-1">Since 2023</p>
                </div>
              </div>
            </div>

            {/* Treatments History Card */}
            <div className="bg-slate-700/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-slate-600/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Treatments</h3>
                  <p className="text-sm text-slate-400">Recent history</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="p-3 bg-slate-600/50 rounded-lg">
                  <p className="text-sm font-medium text-white">Blood Work Analysis</p>
                  <p className="text-xs text-slate-400 mt-1">Jan 30, 2026</p>
                </div>
                <div className="p-3 bg-slate-600/50 rounded-lg">
                  <p className="text-sm font-medium text-white">Chest X-Ray</p>
                  <p className="text-xs text-slate-400 mt-1">Jan 28, 2026</p>
                </div>
              </div>
            </div>

            {/* Progress Card */}
            <div className="bg-slate-700/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-slate-600/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Progress</h3>
                  <p className="text-sm text-slate-400">Health trends</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">Blood Sugar Control</span>
                    <span className="text-green-400 font-medium">85%</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full" style={{width: '85%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">Medication Adherence</span>
                    <span className="text-blue-400 font-medium">92%</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full" style={{width: '92%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Medicine Timing Reminder Card */}
            <div className="bg-slate-700/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-slate-600/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Medicine Reminders</h3>
                  <p className="text-sm text-slate-400">Today's schedule</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-slate-600/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-white">Metformin 500mg</p>
                    <p className="text-xs text-slate-400">After breakfast</p>
                  </div>
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Taken</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-white">Lisinopril 10mg</p>
                    <p className="text-xs text-purple-400">In 2 hours</p>
                  </div>
                  <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded animate-pulse">Pending</span>
                </div>
              </div>
            </div>

            {/* Alerts Card */}
            <div className="bg-slate-700/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-slate-600/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-white shadow-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Alerts</h3>
                  <p className="text-sm text-slate-400">Important notices</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-sm font-medium text-yellow-300">Upcoming Appointment</p>
                  <p className="text-xs text-yellow-400/80 mt-1">Dr. Smith - Feb 5, 2026</p>
                </div>
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-sm font-medium text-red-300">Lab Results Ready</p>
                  <p className="text-xs text-red-400/80 mt-1">View your recent test results</p>
                </div>
              </div>
            </div>

            {/* Health Summary Card */}
            <div className="bg-slate-700/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-slate-600/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center text-white shadow-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Health Score</h3>
                  <p className="text-sm text-slate-400">Overall wellness</p>
                </div>
              </div>
              <div className="text-center py-4">
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-2">78</div>
                <p className="text-sm text-slate-300">Good - Keep it up!</p>
                <div className="mt-4 flex justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                </div>
              </div>
            </div>

            {/* Chat with Doctor Card */}
            <div className="bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/20 hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg animate-pulse">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Chat with Doctor</h3>
                  <p className="text-sm text-slate-300">Get instant help</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-200">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Dr. Smith is online</span>
                </div>
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Start Chat
                </button>
                <p className="text-xs text-slate-400 text-center">Average response time: 2 min</p>
              </div>
            </div>
          </div>
        </section>
        )}

      </main>

      <Footer />
      <ScrollTopButton />

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-2xl h-[600px] flex flex-col shadow-2xl border border-slate-600 animate-fadeIn">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Dr. Smith</h3>
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700 rounded-lg"
                aria-label="Close chat"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === 'patient' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'doctor' && (
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  <div className={`max-w-[70%] ${msg.role === 'patient' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-slate-700'} rounded-2xl p-3 shadow-lg`}>
                    <p className="text-white text-sm">{msg.text}</p>
                    <p className="text-xs text-slate-300 mt-1">{msg.time}</p>
                  </div>
                  {msg.role === 'patient' && (
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-600">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
