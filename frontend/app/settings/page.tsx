'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import { useLanguage, Language } from '../../contexts/LanguageContext';

const languageNames: Record<Language, string> = {
  en: 'English',
  hi: 'हिन्दी',
  bn: 'বাংলা',
  te: 'తెలుగు',
  mr: 'मराठी',
  ta: 'தமிழ்',
  gu: 'ગુજરાતી',
  kn: 'ಕನ್ನಡ',
  ml: 'മലയാളം',
  pa: 'ਪੰਜਾਬੀ',
  or: 'ଓଡ଼ିଆ',
};

export default function SettingsPage() {
  const [privacyMode, setPrivacyMode] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [autoDelete, setAutoDelete] = useState(30);
  const { language, setLanguage } = useLanguage();

  const handleDeleteAll = () => {
    if (confirm('Are you sure you want to delete all summaries? This action cannot be undone.')) {
      alert('All summaries deleted');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-[100px] pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Settings & Privacy</h1>
          <p className="text-slate-200 mt-2">
            Manage your privacy preferences and data
          </p>
        </div>

        {/* Language Settings */}
        <div className="bg-slate-700/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-slate-600/50 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Language</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-3">
                Select Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Select language"
              >
                {(Object.keys(languageNames) as Language[]).map((lang) => (
                  <option key={lang} value={lang}>
                    {languageNames[lang]}
                  </option>
                ))}
              </select>
              <p className="text-sm text-slate-400 mt-2">
                Change the application language to your preference
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Mode */}
        <div className="bg-slate-700/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-slate-600/50 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Privacy Settings</h2>
          
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-medium text-white">Privacy Mode</div>
                <div className="text-sm text-slate-400 mt-1">
                  When enabled, all processing happens locally. No data sent to servers.
                </div>
              </div>
              <button
                onClick={() => setPrivacyMode(!privacyMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  privacyMode ? 'bg-blue-600' : 'bg-slate-600'
                }`}
                aria-label="Toggle privacy mode"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    privacyMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-medium text-white">Offline Mode</div>
                <div className="text-sm text-slate-400 mt-1">
                  Use the app without internet connection (requires initial setup)
                </div>
              </div>
              <button
                onClick={() => setOfflineMode(!offlineMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  offlineMode ? 'bg-blue-600' : 'bg-slate-600'
                }`}
                aria-label="Toggle offline mode"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    offlineMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div>
              <div className="font-medium text-white mb-2">Auto-Delete Timer</div>
              <div className="text-sm text-slate-400 mb-3">
                Automatically delete summaries after a certain period
              </div>
              <select
                value={autoDelete}
                onChange={(e) => setAutoDelete(Number(e.target.value))}
                className="px-4 py-2 rounded-lg border border-slate-600 bg-slate-700 text-white"
                aria-label="Auto-delete timer"
              >
                <option value={7}>7 days</option>
                <option value={30}>30 days</option>
                <option value={90}>90 days</option>
                <option value={0}>Never</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-slate-700/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-slate-600/50 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Data Management</h2>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">Total Summaries</div>
                  <div className="text-sm text-slate-400 mt-1">3 summaries stored</div>
                </div>
                <div className="text-2xl">📝</div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-900 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">Storage Used</div>
                  <div className="text-sm text-slate-400 mt-1">125 KB (local only)</div>
                </div>
                <div className="text-2xl">💾</div>
              </div>
            </div>

            <button
              onClick={handleDeleteAll}
              className="w-full px-6 py-3 rounded-lg bg-red-900/20 text-red-300 hover:bg-red-900/40 transition font-medium"
            >
              🗑️ Delete All Summaries
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
