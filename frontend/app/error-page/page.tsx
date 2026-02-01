'use client';

import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function ErrorPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-slate-200">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center min-h-[70vh]">
        <div className="bg-slate-700/80 rounded-2xl p-12 shadow-2xl text-center w-full">
          {/* Warning Icon */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-900/20">
              <div className="text-6xl">⚠️</div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">
            PHI Detected - Processing Stopped
          </h1>
          
          <p className="text-lg text-slate-400 mb-8">
            Our system detected sensitive Personal Health Information (PHI) that cannot be properly redacted. For your safety, we've halted processing.
          </p>

          {/* Detected Issues */}
          <div className="mb-8 p-6 rounded-lg bg-red-900/20 border border-red-800 text-left">
            <h2 className="font-semibold text-red-300 mb-3">Detected Issues:</h2>
            <ul className="space-y-2 text-sm text-red-300">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Multiple patient identifiers found</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Unredactable sensitive medical information</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Document may contain protected health data</span>
              </li>
            </ul>
          </div>

          {/* Safe Actions */}
          <div className="space-y-4">
            <h2 className="font-semibold text-white mb-3">What you can do:</h2>
            
            <button
              onClick={() => router.push('/summarize')}
              className="w-full px-6 py-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-left flex items-center gap-4"
            >
              <div className="text-3xl">📝</div>
              <div className="flex-1">
                <div className="font-semibold">Try with a different document</div>
                <div className="text-sm opacity-90">Upload a new file or paste different text</div>
              </div>
              <div className="text-2xl">→</div>
            </button>

            <button
              onClick={() => router.push('/about')}
              className="w-full px-6 py-4 rounded-lg bg-slate-700 hover:bg-slate-600 transition text-left flex items-center gap-4"
            >
              <div className="text-3xl">ℹ️</div>
              <div className="flex-1">
                <div className="font-semibold text-white">Learn about our privacy approach</div>
                <div className="text-sm text-slate-400">Understand how we protect your data</div>
              </div>
              <div className="text-2xl">→</div>
            </button>

            <button
              onClick={() => router.push('/')}
              className="w-full px-6 py-4 rounded-lg border-2 border-slate-700 hover:border-blue-500 transition text-left flex items-center gap-4"
            >
              <div className="text-3xl">🏠</div>
              <div className="flex-1">
                <div className="font-semibold text-white">Return to home</div>
                <div className="text-sm text-slate-400">Go back to the main page</div>
              </div>
              <div className="text-2xl">→</div>
            </button>
          </div>

          {/* Support Info */}
          <div className="mt-8 p-4 rounded-lg bg-blue-900/20 border border-blue-800 text-sm">
            <div className="font-medium text-blue-300 mb-1">
              Need help?
            </div>
            <div className="text-blue-400">
              Contact our privacy team at <span className="font-mono">privacy@healthsummarizer.com</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
