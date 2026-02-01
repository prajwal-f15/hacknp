'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';

export default function SearchPage() {
  const [uid, setUid] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();

  const handleSearch = () => {
    setLoading(true);
    setError('');
    setSearchResult(null);

    // Validate UID
    if (!uid.trim()) {
      setError(t('enterValidUID') || 'Please enter a valid UID');
      setLoading(false);
      return;
    }

    // Search in localStorage
    try {
      const patientData = localStorage.getItem(`patient_${uid}`);
      
      if (patientData) {
        const data = JSON.parse(patientData);
        setSearchResult(data);
      } else {
        setError(t('patientNotFound') || 'No patient found with this UID');
      }
    } catch (err) {
      setError(t('searchError') || 'Error searching for patient');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
            {t('searchPatient') || 'Search Patient by UID'}
          </h1>
          <p className="text-gray-600">
            {t('searchDescription') || 'Enter the patient\'s unique ID to view their records'}
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="uid" className="block text-sm font-medium text-gray-700 mb-2">
                {t('patientUID') || 'Patient UID'}
              </label>
              <input
                type="text"
                id="uid"
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('enterUID') || 'Enter UID (e.g., PAT001)'}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-gray-800"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {t('searching') || 'Searching...'}
                  </span>
                ) : (
                  t('search') || 'Search'
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}
        </div>

        {/* Search Results */}
        {searchResult && (
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
            <div className="border-b pb-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {t('patientDetails') || 'Patient Details'}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Patient Info */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase">
                    {t('patientName') || 'Patient Name'}
                  </label>
                  <p className="text-lg font-medium text-gray-800 mt-1">
                    {searchResult.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase">
                    {t('patientUID') || 'Patient UID'}
                  </label>
                  <p className="text-lg font-medium text-gray-800 mt-1">
                    {searchResult.uid || uid}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase">
                    {t('age') || 'Age'}
                  </label>
                  <p className="text-lg font-medium text-gray-800 mt-1">
                    {searchResult.age || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase">
                    {t('gender') || 'Gender'}
                  </label>
                  <p className="text-lg font-medium text-gray-800 mt-1">
                    {searchResult.gender || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase">
                    {t('contact') || 'Contact'}
                  </label>
                  <p className="text-lg font-medium text-gray-800 mt-1">
                    {searchResult.contact || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase">
                    {t('lastVisit') || 'Last Visit'}
                  </label>
                  <p className="text-lg font-medium text-gray-800 mt-1">
                    {searchResult.lastVisit || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Medical Summary */}
            {searchResult.medicalHistory && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  {t('medicalHistory') || 'Medical History'}
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">{searchResult.medicalHistory}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/summary/${uid}`}
                className="flex-1 min-w-[200px] px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all text-center shadow-lg"
              >
                {t('viewSummary') || 'View Health Summary'}
              </Link>
              <Link
                href={`/recommendations/${uid}`}
                className="flex-1 min-w-[200px] px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all text-center shadow-lg"
              >
                {t('viewRecommendations') || 'View Recommendations'}
              </Link>
            </div>

            {/* Additional Info */}
            {searchResult.diagnosis && (
              <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                <h4 className="font-semibold text-blue-900 mb-2">
                  {t('currentDiagnosis') || 'Current Diagnosis'}
                </h4>
                <p className="text-blue-800">{searchResult.diagnosis}</p>
              </div>
            )}
          </div>
        )}

        {/* Quick Links */}
        <div className="mt-8 text-center">
          <Link
            href="/patient-dashboard"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('backToDashboard') || 'Back to Dashboard'}
          </Link>
        </div>
      </div>
    </div>
  );
}
