'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-[100px] pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">About & Ethics</h1>
          <p className="text-slate-200 mt-2">
            Understanding our privacy-safe approach to health record summarization
          </p>
        </div>

        {/* What We Store */}
        <div className="bg-slate-700/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-slate-600/50 mb-6">
          <h2 className="text-2xl font-semibold text-white mb-6">What We Store vs. Don't Store</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg bg-red-900/20 border-2 border-red-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">❌</div>
                <h3 className="text-lg font-semibold text-red-300">We NEVER Store</h3>
              </div>
              <ul className="space-y-2 text-sm text-red-300">
                <li>• Raw medical documents</li>
                <li>• Patient names or IDs</li>
                <li>• Contact information</li>
                <li>• Detailed medical history</li>
                <li>• Lab results (actual values)</li>
                <li>• Prescription details</li>
              </ul>
            </div>

            <div className="p-6 rounded-lg bg-green-900/20 border-2 border-green-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">✓</div>
                <h3 className="text-lg font-semibold text-green-300">We MAY Store</h3>
              </div>
              <ul className="space-y-2 text-sm text-green-300">
                <li>• Summary bullets (anonymized)</li>
                <li>• Metadata (date, category)</li>
                <li>• User preferences</li>
                <li>• Citation labels (Labs, Meds, etc.)</li>
                <li>• App usage analytics (no PHI)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Ethical AI */}
        <div className="bg-slate-700/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-slate-600/50 mb-6">
          <h2 className="text-2xl font-semibold text-white mb-6">Ethical AI Explanation</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">1. Privacy by Design</h3>
              <p className="text-sm text-slate-400">
                Our system is built with privacy as the foundation. All processing happens locally in your browser before any data leaves your device. PII is redacted automatically using rule-based patterns (not sent to AI).
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-2">2. Explainability (Mutation B)</h3>
              <p className="text-sm text-slate-400">
                Every summary point includes a citation linking back to the source text. This ensures transparency and allows users to verify the AI's interpretation.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-2">3. Zero-Storage Architecture (Mutation A)</h3>
              <p className="text-sm text-slate-400">
                Raw medical data never touches our servers. The summarization process runs entirely in your browser using client-side AI models.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-2">4. Compliance</h3>
              <p className="text-sm text-slate-400">
                Our architecture complies with HIPAA, GDPR, and other privacy regulations by design. We cannot access your medical data even if we wanted to.
              </p>
            </div>
          </div>
        </div>

        {/* Architecture Diagram */}
        <div className="bg-slate-700/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-slate-600/50 mb-6">
          <h2 className="text-2xl font-semibold text-white mb-6">System Architecture</h2>
          
          <div className="bg-slate-900 rounded-lg p-8">
            <div className="space-y-4 text-center">
              <div className="p-4 rounded-lg bg-blue-900 text-blue-300 font-medium">
                📄 Upload Document
              </div>
              <div className="text-2xl">↓</div>
              <div className="p-4 rounded-lg bg-yellow-900 text-yellow-300 font-medium">
                🔒 Redact PII (Client-Side)
              </div>
              <div className="text-2xl">↓</div>
              <div className="p-4 rounded-lg bg-purple-900 text-purple-300 font-medium">
                🧠 Extract Key Info (Local AI)
              </div>
              <div className="text-2xl">↓</div>
              <div className="p-4 rounded-lg bg-green-900 text-green-300 font-medium">
                📋 Generate Summary + Citations
              </div>
              <div className="text-2xl">↓</div>
              <div className="p-4 rounded-lg bg-indigo-900 text-indigo-300 font-medium">
                💾 Store Summary Only (Optional)
              </div>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-red-900/20 border border-red-800 text-center">
              <div className="text-sm font-medium text-red-300">
                🚫 Raw Document Never Stored or Transmitted
              </div>
            </div>
          </div>
        </div>

        {/* Mutation Explanation */}
        <div className="bg-slate-700/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-slate-600/50">
          <h2 className="text-2xl font-semibold text-white mb-6">Mutation A & B Compliance</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg border-2 border-blue-800">
              <h3 className="text-lg font-semibold text-blue-300 mb-3">
                Mutation A: Zero-Storage
              </h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>• Client-side processing only</li>
                <li>• Automatic PII redaction</li>
                <li>• No raw data on servers</li>
                <li>• Transparent redaction preview</li>
              </ul>
            </div>

            <div className="p-6 rounded-lg border-2 border-purple-800">
              <h3 className="text-lg font-semibold text-purple-300 mb-3">
                Mutation B: Explainable AI
              </h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>• Source citations for each point</li>
                <li>• Category labels (Labs, Meds, etc.)</li>
                <li>• Confidence scores</li>
                <li>• Expandable explanations</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
