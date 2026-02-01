'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { useLanguage } from '../../contexts/LanguageContext';

export default function SummarizePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setError('');
    
    // Validate file type
    const validTypes = ['application/pdf', 'text/plain', 'image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload PDF, TXT, JPG, or PNG files.');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File too large. Maximum size is 10MB.');
      return;
    }

    setFile(file);
  };

  const handleLoadSample = () => {
    setText(`Patient: [PATIENT] | Phone: [PHONE] | Report: Blood glucose elevated over 3 consecutive fasting readings; medication: metformin 500mg daily; no allergy documented; follow-up recommended.`);
  };

  const handleSubmit = () => {
    if (!file && !text) {
      setError('Please upload a file or enter text to summarize.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Generate a random summary ID and go directly to summary page
            const summaryId = 'sum-' + Date.now();
            router.push(`/summary/${summaryId}`);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 transition-colors">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-[100px] pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Upload & Summarize</h1>
          <p className="text-slate-200 mt-2">
            Upload your health record to generate a privacy-safe summary
          </p>
        </div>

        {/* Privacy Notice */}
        <div className="mb-6 p-4 rounded-lg bg-blue-900/30 backdrop-blur-sm border border-blue-800/50">
          <div className="flex items-start gap-3">
            <div className="text-blue-400 text-xl">🔒</div>
            <div>
              <div className="font-medium text-blue-300">Privacy-First Processing</div>
              <div className="text-sm text-blue-400 mt-1">
                All processing happens in your browser. No data is sent to our servers.
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-900/20 border border-red-800">
            <div className="text-red-300">{error}</div>
          </div>
        )}

        {/* Drag & Drop Upload */}
        <div className="bg-slate-700/80 backdrop-blur-xl rounded-2xl p-8 shadow border border-slate-600/50">
          <h2 className="text-xl font-semibold text-white mb-4">Upload File</h2>
          
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition ${
              dragActive
                ? 'border-blue-500 bg-blue-900/20'
                : 'border-slate-600'
            }`}
          >
            <div className="text-6xl mb-4">📄</div>
            <p className="text-lg font-medium text-white mb-2">
              Drag & drop your file here
            </p>
            <p className="text-sm text-slate-400 mb-4">
              or click to browse
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
              aria-label="Upload file"
              title="Upload file"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Select File
            </button>
            <p className="text-xs text-slate-400 mt-4">
              Supported: PDF, TXT, JPG, PNG (Max 10MB)
            </p>
          </div>

          {file && (
            <div className="mt-4 p-4 rounded-lg bg-green-900/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-green-400 text-2xl">✓</div>
                <div>
                  <div className="font-medium text-green-300">{file.name}</div>
                  <div className="text-sm text-green-400">
                    {(file.size / 1024).toFixed(2)} KB
                  </div>
                </div>
              </div>
              <button
                onClick={() => setFile(null)}
                className="px-3 py-1 rounded bg-green-900 text-green-300 hover:bg-green-800 transition"
              >
                Remove
              </button>
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-200">Processing...</span>
                <span className="text-sm text-slate-400">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Description Field */}
        <div className="mt-6 bg-slate-700/80 backdrop-blur-xl rounded-2xl p-6 shadow border border-slate-600/50">
          <h2 className="text-xl font-semibold text-white mb-4">Description (Optional)</h2>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add any notes or context about this health record..."
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <p className="text-xs text-slate-400 mt-2">
            This description will be saved with your summary for future reference
          </p>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className={`px-8 py-3 rounded-lg text-white font-medium transition shadow-lg hover:shadow-xl ${
              uploading
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
            }`}
          >
            {uploading ? 'Processing...' : 'Start Summarization'}
          </button>
        </div>
      </main>
    </div>
  );
}
