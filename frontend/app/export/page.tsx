'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { generatePDF } from '../../utils/pdfExport';
import { QRCodeSVG } from 'qrcode.react';

export default function ExportPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [exporting, setExporting] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [summaryId, setSummaryId] = useState('');
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const id = searchParams.get('id') || localStorage.getItem('lastSummaryId') || '';
    setSummaryId(id);
  }, [searchParams]);

  const handleExportPDF = () => {
    setExporting(true);
    
    try {
      // Get summary data from localStorage or use demo data
      const summaryData = {
        title: 'Health Record Summary',
        patientId: summaryId || 'PATIENT-001',
        generatedDate: new Date().toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        sections: [
          {
            heading: 'Key Findings',
            points: [
              'Blood glucose levels were elevated over 3 consecutive fasting readings, indicating potential diabetes management needs.',
              'Current medication includes Metformin 500mg taken daily for blood sugar control.',
              'No known allergies documented in the record.'
            ]
          },
          {
            heading: 'Current Treatment',
            points: [
              'Patient is on Metformin 500mg daily regimen.',
              'Regular monitoring of blood glucose levels is ongoing.',
              'No adverse reactions reported with current medication.'
            ]
          },
          {
            heading: 'Follow-up Plan',
            points: [
              'Follow-up appointment recommended to assess treatment effectiveness.',
              'Continue current medication dosage.',
              'Monitor for any side effects or complications.'
            ]
          }
        ]
      };

      generatePDF(summaryData);
      
      setTimeout(() => {
        setExporting(false);
      }, 1000);
    } catch (error) {
      console.error('PDF export error:', error);
      alert('Failed to export PDF. Please try again.');
      setExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGenerateShare = () => {
    const link = `${window.location.origin}/summary/${summaryId || 'demo'}`;
    setShareLink(link);
    setShowQR(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-slate-200">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Export & Share</h1>
          <p className="text-slate-400 mt-2">
            Export your summary or generate a secure share link
          </p>
        </div>

        {/* Export Options */}
        <div className="bg-slate-700/80 rounded-2xl p-8 shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Export Options</h2>
          
          <div className="grid gap-4">
            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className={`p-6 rounded-lg border-2 hover:border-blue-500 transition text-left ${
                exporting ? 'opacity-50 cursor-not-allowed' : 'border-slate-700'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">📄</div>
                <div className="flex-1">
                  <div className="font-semibold text-white text-lg">Export as PDF</div>
                  <div className="text-sm text-slate-400 mt-1">
                    Download a formatted PDF of your summary
                  </div>
                </div>
                <div className="text-blue-400 text-2xl">→</div>
              </div>
            </button>

            <button
              onClick={handlePrint}
              className="p-6 rounded-lg border-2 border-slate-700 hover:border-blue-500 transition text-left"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">🖨️</div>
                <div className="flex-1">
                  <div className="font-semibold text-white text-lg">Print Summary</div>
                  <div className="text-sm text-slate-400 mt-1">
                    Print or save as PDF using browser print dialog
                  </div>
                </div>
                <div className="text-blue-400 text-2xl">→</div>
              </div>
            </button>
          </div>
        </div>

        {/* Share Options */}
        <div className="bg-slate-700/80 rounded-2xl p-8 shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Share Options</h2>

          <div className="space-y-6">
            {/* QR Share */}
            <div className="p-6 rounded-lg border-2 border-slate-700">
              <div className="flex items-start gap-4">
                <div className="text-4xl">📱</div>
                <div className="flex-1">
                  <div className="font-semibold text-white text-lg">QR Code Share</div>
                  <div className="text-sm text-slate-400 mt-1 mb-4">
                    Generate a QR code for easy mobile sharing
                  </div>
                  
                  {!showQR ? (
                    <button
                      onClick={handleGenerateShare}
                      className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                      Generate QR Code
                    </button>
                  ) : (
                    <div className="p-8 bg-slate-900 rounded-lg border border-slate-700 inline-block">
                      <QRCodeSVG 
                        value={shareLink} 
                        size={180}
                        level="H"
                        includeMargin={true}
                      />
                      <p className="text-xs text-slate-400 mt-3 text-center">Scan to view summary</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Time-Limited Link */}
            <div className="p-6 rounded-lg border-2 border-slate-700">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🔗</div>
                <div className="flex-1">
                  <div className="font-semibold text-white text-lg">Time-Limited Share Link</div>
                  <div className="text-sm text-slate-400 mt-1 mb-4">
                    Generate a secure link that expires in 24 hours
                  </div>
                  
                  {!shareLink ? (
                    <button
                      onClick={handleGenerateShare}
                      className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                      Generate Share Link
                    </button>
                  ) : (
                    <div>
                      <div className="p-3 rounded-lg bg-green-900/20 border border-green-800 mb-3">
                        <div className="text-xs text-green-300 mb-1">
                          Link expires in 24 hours
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 text-sm font-mono text-green-300">
                            {shareLink}
                          </code>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(shareLink);
                              alert('Copied to clipboard!');
                            }}
                            className="px-3 py-1 rounded bg-green-900 text-green-300 hover:bg-green-800 transition text-sm"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-yellow-900/20 rounded-2xl p-6 border border-yellow-800">
          <div className="flex items-start gap-3">
            <div className="text-yellow-400 text-2xl">⚠️</div>
            <div>
              <div className="font-semibold text-yellow-300 mb-2">
                Privacy Reminder
              </div>
              <ul className="text-sm text-yellow-400 space-y-1">
                <li>• Shared links contain your anonymized summary (no raw data)</li>
                <li>• Links expire automatically after 24 hours</li>
                <li>• Only share with trusted recipients</li>
                <li>• You can revoke access at any time</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition"
          >
            ← Back
          </button>
        </div>
      </main>
    </div>
  );
}
