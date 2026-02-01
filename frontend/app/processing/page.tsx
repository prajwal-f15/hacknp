'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function ProcessingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const steps = [
    { id: 1, label: 'Redacting PII', icon: '🔒' },
    { id: 2, label: 'Extracting key information', icon: '📑' },
    { id: 3, label: 'Generating summary', icon: '🧠' },
    { id: 4, label: 'Adding citations', icon: '🔖' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(prev => {
        if (prev >= 4) {
          clearInterval(interval);
          setTimeout(() => {
            router.push('/summary/1');
          }, 1000);
          return 4;
        }
        return prev + 1;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 flex items-center justify-center">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-slate-700/80 border border-slate-600/50 rounded-2xl p-12 shadow-2xl text-center">
          {/* Animated Loader */}
          <div className="mb-8">
            <div className="inline-block animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600"></div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">Processing Your Report</h1>
          <p className="text-slate-200 mb-8">
            Please wait while we generate your privacy-safe summary
          </p>

          {/* Privacy Badge */}
          <div className="mb-8 p-4 rounded-lg bg-green-900/20 border border-green-800 inline-flex items-center gap-3">
            <div className="text-green-400 text-2xl">🔒</div>
            <div className="text-left">
              <div className="font-medium text-green-300">Data Not Stored</div>
              <div className="text-sm text-green-400">
                Processing happens locally. No data leaves your device.
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="space-y-4">
            {steps.map((s) => (
              <div
                key={s.id}
                className={`flex items-center gap-4 p-4 rounded-lg transition ${
                  step >= s.id
                    ? 'bg-blue-900/20 border-2 border-blue-500'
                    : 'bg-slate-900 border-2 border-transparent'
                }`}
              >
                <div className={`text-3xl ${step >= s.id ? 'animate-bounce' : 'opacity-30'}`}>
                  {s.icon}
                </div>
                <div className="flex-1 text-left">
                  <div className={`font-medium ${step >= s.id ? 'text-blue-300' : 'text-slate-400'}`}>
                    {s.label}
                  </div>
                </div>
                {step > s.id && (
                  <div className="text-green-400 text-2xl">✓</div>
                )}
                {step === s.id && (
                  <div className="animate-pulse text-blue-400">⏳</div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 text-sm text-slate-200">
            Estimated time: ~5 seconds
          </div>
        </div>
      </main>
    </div>
  );
}
