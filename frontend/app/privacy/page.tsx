'use client';

import Navbar from '../../components/Navbar';
import { useLanguage } from '../../contexts/LanguageContext';

export default function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-[100px] pb-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-slate-400 text-sm">Last Updated: February 1, 2026</p>
        </div>

        <div className="bg-slate-700/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-600/50 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Our Privacy Commitment</h2>
            <ul className="space-y-3 text-slate-200">
              <li className="flex items-start gap-3">
                <div className="text-green-400 text-xl">✓</div>
                <div>No raw medical data is ever stored on our servers</div>
              </li>
              <li className="flex items-start gap-3">
                <div className="text-green-400 text-xl">✓</div>
                <div>All processing happens in your browser (client-side)</div>
              </li>
              <li className="flex items-start gap-3">
                <div className="text-green-400 text-xl">✓</div>
                <div>PII is automatically redacted before any analysis</div>
              </li>
              <li className="flex items-start gap-3">
                <div className="text-green-400 text-xl">✓</div>
                <div>HIPAA and GDPR compliant architecture</div>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Introduction</h2>
            <p className="text-slate-200 leading-relaxed">
              At Health Summarizer, privacy is not just a feature—it's our foundation. This privacy policy explains how we handle your data and why we believe in a zero-storage architecture.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">What We Store vs. Don't Store</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="group p-6 rounded-xl bg-gradient-to-br from-red-900/20 to-red-900/10 border-2 border-red-800 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform">✗</div>
                  <h4 className="text-xl font-bold text-red-300">We NEVER Store</h4>
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

              <div className="group p-6 rounded-xl bg-gradient-to-br from-green-900/20 to-green-900/10 border-2 border-green-800 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform">✓</div>
                  <h4 className="text-xl font-bold text-green-300">We MAY Store</h4>
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
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Data Collection</h2>
            <div className="space-y-3 text-slate-200">
              <h3 className="text-lg font-medium text-blue-300">What We Never Collect:</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Raw medical records or documents</li>
                <li>Patient names, IDs, or contact information</li>
                <li>Detailed medical history or diagnoses</li>
                <li>Lab results with actual values</li>
                <li>Prescription details or medication lists</li>
                <li>Any Protected Health Information (PHI)</li>
              </ul>

              <h3 className="text-lg font-medium text-green-300 mt-4">What We May Collect:</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Anonymized summary metadata (dates, categories)</li>
                <li>User preferences and settings</li>
                <li>Anonymous usage analytics (no PHI)</li>
                <li>Citation labels (e.g., "Labs", "Medications")</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">How We Process Data</h2>
            <p className="text-slate-200 leading-relaxed mb-3">
              All medical document processing happens entirely in your browser using client-side AI models. Your health records never leave your device during the summarization process.
            </p>
            <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
              <p className="text-blue-300 text-sm">
                <strong>Zero-Storage Architecture:</strong> Raw medical data never touches our servers. We cannot access your health information even if we wanted to.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Data Sharing</h2>
            <p className="text-slate-200 leading-relaxed">
              We do not share, sell, or transfer your health information to any third parties. Since we don't collect raw medical data, there's nothing to share.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Your Rights</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-200 ml-4">
              <li>Access: Your data stays on your device, under your control</li>
              <li>Deletion: Clear browser data to remove all local summaries</li>
              <li>Export: Download your summaries as PDF anytime</li>
              <li>Portability: All data is stored locally in standard formats</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Security Measures</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-200 ml-4">
              <li>Automatic PII redaction using rule-based patterns</li>
              <li>Client-side encryption for local storage</li>
              <li>No server-side storage of medical documents</li>
              <li>HIPAA-compliant architecture by design</li>
              <li>Regular security audits and updates</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Cookies & Tracking</h2>
            <p className="text-slate-200 leading-relaxed">
              We use minimal cookies only for essential functionality (user preferences, session management). We do not use third-party tracking cookies or advertising pixels.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">HIPAA Compliance</h2>
            <p className="text-slate-200 leading-relaxed">
              Our zero-storage architecture ensures compliance with HIPAA regulations. Since no PHI is transmitted or stored on our servers, we operate as a privacy-first platform that exceeds standard compliance requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Changes to This Policy</h2>
            <p className="text-slate-200 leading-relaxed">
              We may update this privacy policy to reflect changes in our practices. Any updates will be posted on this page with a revised "Last Updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Contact Us</h2>
            <p className="text-slate-200 leading-relaxed">
              If you have questions about this privacy policy or our practices, please contact us at: <a href="/contact" className="text-blue-400 hover:underline">Contact Page</a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
