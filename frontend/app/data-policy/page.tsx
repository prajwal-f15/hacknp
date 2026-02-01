'use client';

import Navbar from '../../components/Navbar';
import { useLanguage } from '../../contexts/LanguageContext';

export default function DataPolicyPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-[100px] pb-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Data Policy</h1>
          <p className="text-slate-400 text-sm">Last Updated: February 1, 2026</p>
        </div>

        <div className="bg-slate-700/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-600/50 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Our Data Philosophy</h2>
            <p className="text-slate-200 leading-relaxed">
              Health Summarizer is built on a zero-storage architecture. This means your health data stays on your device, under your control. This policy explains in detail how we handle data throughout our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Data Processing Flow</h2>
            <div className="space-y-4">
              <div className="bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="text-lg font-semibold text-blue-300 mb-2">Step 1: Upload (Client-Side Only)</h3>
                <p className="text-slate-200 text-sm">
                  When you upload a health document, it is processed entirely in your browser. The file never leaves your device during this stage.
                </p>
              </div>

              <div className="bg-purple-900/20 border-l-4 border-purple-500 p-4 rounded">
                <h3 className="text-lg font-semibold text-purple-300 mb-2">Step 2: PII Redaction (Local)</h3>
                <p className="text-slate-200 text-sm">
                  Personal Identifiable Information (names, IDs, dates) is automatically detected and redacted using rule-based algorithms that run locally.
                </p>
              </div>

              <div className="bg-green-900/20 border-l-4 border-green-500 p-4 rounded">
                <h3 className="text-lg font-semibold text-green-300 mb-2">Step 3: Summarization (Browser AI)</h3>
                <p className="text-slate-200 text-sm">
                  AI models running in your browser generate summaries from the redacted text. No raw data is sent to external servers.
                </p>
              </div>

              <div className="bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded">
                <h3 className="text-lg font-semibold text-yellow-300 mb-2">Step 4: Storage (Your Device)</h3>
                <p className="text-slate-200 text-sm">
                  Summaries and metadata are stored locally in your browser's storage. You can delete this data anytime by clearing browser data.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">What Data We Process</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-900/20 border-2 border-red-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-red-300 mb-3 flex items-center gap-2">
                  <span className="text-2xl">❌</span> Never Processed on Servers
                </h3>
                <ul className="space-y-2 text-sm text-slate-200">
                  <li>• Raw medical documents</li>
                  <li>• Patient names and IDs</li>
                  <li>• Detailed medical records</li>
                  <li>• Lab result values</li>
                  <li>• Prescription information</li>
                  <li>• Any PHI (Protected Health Information)</li>
                </ul>
              </div>

              <div className="bg-green-900/20 border-2 border-green-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-300 mb-3 flex items-center gap-2">
                  <span className="text-2xl">✓</span> Processed Locally Only
                </h3>
                <ul className="space-y-2 text-sm text-slate-200">
                  <li>• Document text (in browser)</li>
                  <li>• Generated summaries</li>
                  <li>• User preferences</li>
                  <li>• Category labels</li>
                  <li>• Anonymized metadata</li>
                  <li>• Citation markers</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Data Storage Locations</h2>
            <div className="space-y-3">
              <div className="bg-slate-600/50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-2">📱 Your Device (Browser Storage)</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-200 ml-4">
                  <li>Generated summaries and their metadata</li>
                  <li>User preferences and settings</li>
                  <li>Authentication tokens (if logged in)</li>
                  <li>Local cache for performance</li>
                </ul>
                <p className="text-xs text-slate-400 mt-2">
                  Control: You can delete this anytime via browser settings
                </p>
              </div>

              <div className="bg-slate-600/50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-2">☁️ Our Servers (Minimal)</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-200 ml-4">
                  <li>User account information (username, email)</li>
                  <li>Anonymous usage analytics</li>
                  <li>System logs (no PHI)</li>
                  <li>Application metadata</li>
                </ul>
                <p className="text-xs text-slate-400 mt-2">
                  Control: Request deletion via contact page
                </p>
              </div>

              <div className="bg-slate-600/50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-2">🚫 Never Stored Anywhere</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-200 ml-4">
                  <li>Raw uploaded medical documents</li>
                  <li>Unredacted patient information</li>
                  <li>Original document files</li>
                  <li>Complete medical histories</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Data Retention</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-200 ml-4">
              <li><strong>Summaries:</strong> Stored locally indefinitely until you delete them</li>
              <li><strong>Account Data:</strong> Retained while your account is active</li>
              <li><strong>Analytics:</strong> Aggregated data retained for 24 months</li>
              <li><strong>Logs:</strong> System logs retained for 90 days</li>
              <li><strong>Medical Documents:</strong> Never retained (processed in-browser only)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Data Security Measures</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium text-blue-300 mb-2">Technical Safeguards</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-200 ml-4">
                  <li>End-to-end encryption</li>
                  <li>Secure HTTPS connections</li>
                  <li>Client-side AI processing</li>
                  <li>Automatic PII redaction</li>
                  <li>Regular security audits</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-purple-300 mb-2">Organizational Measures</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-200 ml-4">
                  <li>Privacy-by-design architecture</li>
                  <li>Minimal data collection policy</li>
                  <li>Employee training on privacy</li>
                  <li>Incident response procedures</li>
                  <li>Compliance monitoring</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Your Data Rights</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 text-white font-bold">1</div>
                <div>
                  <h4 className="font-medium text-white">Right to Access</h4>
                  <p className="text-sm text-slate-300">View all data we have about you (minimal account info only)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0 text-white font-bold">2</div>
                <div>
                  <h4 className="font-medium text-white">Right to Deletion</h4>
                  <p className="text-sm text-slate-300">Request deletion of your account and associated data</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center flex-shrink-0 text-white font-bold">3</div>
                <div>
                  <h4 className="font-medium text-white">Right to Portability</h4>
                  <p className="text-sm text-slate-300">Export your summaries as PDF or JSON format</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-yellow-600 flex items-center justify-center flex-shrink-0 text-white font-bold">4</div>
                <div>
                  <h4 className="font-medium text-white">Right to Correction</h4>
                  <p className="text-sm text-slate-300">Update or correct your account information</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Third-Party Services</h2>
            <p className="text-slate-200 leading-relaxed mb-3">
              We use minimal third-party services, and none have access to your health data:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-200 ml-4">
              <li>Hosting providers (for application delivery, not data storage)</li>
              <li>Analytics services (anonymized, no PHI)</li>
              <li>CDN for static assets</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Data Breach Protocol</h2>
            <p className="text-slate-200 leading-relaxed mb-3">
              In the unlikely event of a data breach:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-200 ml-4">
              <li>We will notify affected users within 72 hours</li>
              <li>Regulatory authorities will be informed as required</li>
              <li>A full investigation will be conducted</li>
              <li>Remediation steps will be implemented immediately</li>
            </ul>
            <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 mt-3">
              <p className="text-blue-300 text-sm">
                <strong>Note:</strong> Since we don't store raw medical data, the risk of PHI exposure is virtually eliminated.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Compliance</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-slate-600/50 rounded-lg p-3 text-center">
                <p className="font-semibold text-white">HIPAA</p>
                <p className="text-xs text-slate-400">Compliant</p>
              </div>
              <div className="bg-slate-600/50 rounded-lg p-3 text-center">
                <p className="font-semibold text-white">GDPR</p>
                <p className="text-xs text-slate-400">Compliant</p>
              </div>
              <div className="bg-slate-600/50 rounded-lg p-3 text-center">
                <p className="font-semibold text-white">CCPA</p>
                <p className="text-xs text-slate-400">Compliant</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Contact & Questions</h2>
            <p className="text-slate-200 leading-relaxed">
              For questions about our data practices or to exercise your data rights, contact us at: <a href="/contact" className="text-blue-400 hover:underline">Contact Page</a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
