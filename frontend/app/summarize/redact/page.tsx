'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default function RedactPage() {
  const router = useRouter();
  const [showOriginal, setShowOriginal] = useState(false);
  const [processing, setProcessing] = useState(false);

  const originalText = `Patient: John Doe | Phone: +91-9876543210 | Report: Blood glucose elevated over 3 consecutive fasting readings; medication: metformin 500mg daily; no allergy documented; follow-up recommended.`;
  
  const redactedText = `Patient: [PATIENT] | Phone: [PHONE] | Report: Blood glucose elevated over 3 consecutive fasting readings; medication: metformin 500mg daily; no allergy documented; follow-up recommended.`;

  const handleContinue = () => {
    setProcessing(true);
    setTimeout(() => {
      router.push('/processing');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Redaction Preview</h1>
          <p className="text-slate-400 mt-2">
            Review what information will be masked for privacy (Mutation A)
          </p>
        </div>

        {/* Privacy Info */}
        <div className="mb-6 p-4 rounded-lg bg-green-900/20 border border-green-800">
          <div className="flex items-start gap-3">
            <div className="text-green-300 text-xl">✓</div>
            <div>
              <div className="font-medium text-green-300">Privacy Protection Active</div>
              <div className="text-sm text-green-300 mt-1">
                Personally Identifiable Information (PII) has been detected and masked
              </div>
            </div>
          </div>
        </div>

        {/* Redacted Preview */}
        <div className="bg-slate-700/80 border border-slate-600/50 rounded-2xl p-8 shadow-lg mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Redacted Text</h2>
            <button
              onClick={() => setShowOriginal(!showOriginal)}
              className="px-4 py-2 rounded-lg bg-blue-900 text-blue-300 hover:bg-blue-800 transition text-sm"
            >
              {showOriginal ? '👁️ Hide Original' : '👁️ Show Original (Local Only)'}
            </button>
          </div>

          <div className="bg-slate-900 rounded-lg p-6 font-mono text-sm">
            {showOriginal ? (
              <div>
                {originalText.split(/(\[PATIENT\]|\[PHONE\])/).map((part, i) => {
                  if (part === '[PATIENT]') {
                    return <span key={i} className="bg-yellow-800 px-1">John Doe</span>;
                  } else if (part === '[PHONE]') {
                    return <span key={i} className="bg-yellow-800 px-1">+91-9876543210</span>;
                  }
                  return <span key={i}>{part}</span>;
                })}
              </div>
            ) : (
              <div>
                {redactedText.split(/(\[PATIENT\]|\[PHONE\])/).map((part, i) => {
                  if (part === '[PATIENT]' || part === '[PHONE]') {
                    return <span key={i} className="bg-red-900 text-red-300 px-2 py-1 rounded font-bold">{part}</span>;
                  }
                  return <span key={i} className="text-slate-200">{part}</span>;
                })}
              </div>
            )}
          </div>

          <div className="mt-4 text-xs text-slate-400">
            <div className="font-medium mb-2">Redacted Fields:</div>
            <div className="flex gap-3 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-red-900 text-red-300">
                [PATIENT] - Patient Name
              </span>
              <span className="px-3 py-1 rounded-full bg-red-900 text-red-300">
                [PHONE] - Phone Number
              </span>
            </div>
          </div>
        </div>

        {/* Manual Redaction (Optional) */}
        <div className="bg-slate-700/80 border border-slate-600/50 rounded-2xl p-8 shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Manual Redaction (Optional)</h2>
          <p className="text-sm text-slate-400 mb-4">
            Select additional text to redact if our AI missed anything
          </p>
          <div className="bg-slate-900 rounded-lg p-4">
            <button className="text-sm text-blue-400 hover:underline">
              + Add Custom Redaction
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition text-slate-200"
          >
            ← Back
          </button>
          <button
            onClick={handleContinue}
            disabled={processing}
            className={`px-8 py-3 rounded-lg text-white font-medium transition shadow-lg hover:shadow-xl ${
              processing
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
            }`}
          >
            {processing ? 'Processing...' : 'Continue to Summarize →'}
          </button>
        </div>
      </main>
    </div>
  );
}
