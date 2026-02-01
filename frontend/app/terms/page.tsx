'use client';

import Navbar from '../../components/Navbar';
import { useLanguage } from '../../contexts/LanguageContext';

export default function TermsPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-[100px] pb-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Terms & Conditions</h1>
          <p className="text-slate-400 text-sm">Last Updated: February 1, 2026</p>
        </div>

        <div className="bg-slate-700/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-600/50 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p className="text-slate-200 leading-relaxed">
              By accessing and using Health Summarizer, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">2. Use of Service</h2>
            <div className="space-y-3 text-slate-200">
              <h3 className="text-lg font-medium text-blue-300">Permitted Use:</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Personal health record summarization</li>
                <li>Educational and informational purposes</li>
                <li>Professional healthcare documentation</li>
                <li>Research with properly anonymized data</li>
              </ul>

              <h3 className="text-lg font-medium text-red-300 mt-4">Prohibited Use:</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Attempting to compromise system security</li>
                <li>Using the service for illegal activities</li>
                <li>Sharing others' health information without consent</li>
                <li>Automated scraping or data mining</li>
                <li>Reverse engineering our technology</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">3. Medical Disclaimer</h2>
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-3">
              <p className="text-red-300 font-medium mb-2">IMPORTANT NOTICE:</p>
              <p className="text-slate-200 text-sm leading-relaxed">
                Health Summarizer is a documentation tool and does NOT provide medical advice, diagnosis, or treatment. Summaries are for informational purposes only and should not replace professional medical consultation.
              </p>
            </div>
            <ul className="list-disc list-inside space-y-2 text-slate-200 ml-4">
              <li>Always consult qualified healthcare professionals for medical decisions</li>
              <li>AI-generated summaries may contain errors or omissions</li>
              <li>Do not use summaries as a substitute for reading original medical documents</li>
              <li>In case of medical emergency, contact emergency services immediately</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">4. User Responsibilities</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-200 ml-4">
              <li>You are responsible for maintaining the confidentiality of your account</li>
              <li>You must ensure you have the right to upload and process health documents</li>
              <li>You agree to use the service in compliance with all applicable laws</li>
              <li>You are responsible for backing up your own data</li>
              <li>You must notify us immediately of any unauthorized account access</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">5. Intellectual Property</h2>
            <p className="text-slate-200 leading-relaxed mb-3">
              The Health Summarizer platform, including its design, code, algorithms, and documentation, is protected by intellectual property laws.
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-200 ml-4">
              <li>You retain all rights to your uploaded health documents</li>
              <li>Generated summaries belong to you</li>
              <li>Our AI models and algorithms remain our property</li>
              <li>You may not copy, modify, or distribute our software</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">6. Limitation of Liability</h2>
            <p className="text-slate-200 leading-relaxed mb-3">
              To the maximum extent permitted by law:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-200 ml-4">
              <li>We are not liable for any medical decisions made based on our summaries</li>
              <li>We do not guarantee 100% accuracy of AI-generated content</li>
              <li>We are not responsible for data loss on your local device</li>
              <li>Service is provided "as is" without warranties of any kind</li>
              <li>Our total liability is limited to the amount you paid for the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">7. Privacy & Data</h2>
            <p className="text-slate-200 leading-relaxed">
              Our privacy-first architecture means your raw health data never reaches our servers. Please review our <a href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</a> and <a href="/data-policy" className="text-blue-400 hover:underline">Data Policy</a> for complete details.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">8. Service Modifications</h2>
            <p className="text-slate-200 leading-relaxed">
              We reserve the right to modify, suspend, or discontinue any aspect of the service at any time. We will provide reasonable notice of significant changes when possible.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">9. Termination</h2>
            <p className="text-slate-200 leading-relaxed mb-3">
              We may terminate or suspend your access to the service:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-200 ml-4">
              <li>For violation of these terms</li>
              <li>For illegal or harmful activity</li>
              <li>At our discretion with or without notice</li>
              <li>You may terminate your account at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">10. Governing Law</h2>
            <p className="text-slate-200 leading-relaxed">
              These terms are governed by applicable healthcare privacy laws including HIPAA, GDPR, and the laws of the jurisdiction where you reside. Any disputes will be resolved through binding arbitration.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">11. Updates to Terms</h2>
            <p className="text-slate-200 leading-relaxed">
              We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the new terms. Material changes will be communicated via email or in-app notification.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">12. Contact Information</h2>
            <p className="text-slate-200 leading-relaxed">
              For questions about these terms, please contact us at: <a href="/contact" className="text-blue-400 hover:underline">Contact Page</a>
            </p>
          </section>

          <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 mt-6">
            <p className="text-blue-300 text-sm">
              By using Health Summarizer, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
