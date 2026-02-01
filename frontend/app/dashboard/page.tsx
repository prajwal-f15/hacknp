'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { useLanguage } from '../../contexts/LanguageContext';

interface Summary {
  id: string;
  title: string;
  date: string;
  type: string;
  preview: string;
}

export default function DashboardPage() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('all');
  const [summaries, setSummaries] = useState<Summary[]>([
    {
      id: '1',
      title: 'Blood Glucose Report',
      date: '2026-01-30',
      type: 'Labs',
      preview: 'High blood sugar detected. Metformin listed...'
    },
    {
      id: '2',
      title: 'Chest X-Ray Summary',
      date: '2026-01-28',
      type: 'Imaging',
      preview: 'No acute findings. Cardiac silhouette normal...'
    },
    {
      id: '3',
      title: 'Annual Checkup Notes',
      date: '2026-01-25',
      type: 'General',
      preview: 'Vitals within normal range. No concerns...'
    }
  ]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this summary?')) {
      setSummaries(summaries.filter(s => s.id !== id));
    }
  };

  const filteredSummaries = filter === 'all' 
    ? summaries 
    : summaries.filter(s => s.type === filter);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 transition-colors">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-slate-400 mt-1">
              Manage your health record summaries
            </p>
          </div>
          <Link
            href="/summarize"
            className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-lg hover:shadow-xl hover:scale-105 duration-300"
          >
            + New Summary
          </Link>
        </div>

        {/* Privacy Mode Indicator */}
        <div className="mb-6 p-4 rounded-lg bg-green-900/20 border border-green-800 flex items-center gap-3">
          <div className="text-green-400 text-xl">🔒</div>
          <div>
            <div className="font-medium text-green-300">Privacy Mode Active</div>
            <div className="text-sm text-green-400">
              All data is stored locally. No cloud uploads.
            </div>
          </div>
        </div>

        {/* Filter Options */}
        <div className="mb-6 flex gap-3 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700/80 hover:bg-slate-600 text-slate-200'
            }`}
          >
            All ({summaries.length})
          </button>
          <button
            onClick={() => setFilter('Labs')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'Labs'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200'
            }`}
          >
            Labs
          </button>
          <button
            onClick={() => setFilter('Imaging')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'Imaging'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200'
            }`}
          >
            Imaging
          </button>
          <button
            onClick={() => setFilter('General')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'General'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200'
            }`}
          >
            General
          </button>
        </div>

        {/* Summaries List */}
        {filteredSummaries.length === 0 ? (
          <div className="text-center py-12 bg-slate-700/80 rounded-2xl">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-medium text-white mb-2">No summaries yet</h3>
            <p className="text-slate-400 mb-6">
              Create your first health record summary
            </p>
            <Link
              href="/summarize"
              className="inline-block px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Start Summarizing
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredSummaries.map((summary) => (
              <div
                key={summary.id}
                className="bg-slate-700/80 rounded-2xl p-6 shadow hover:shadow-lg transition group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-white">
                        {summary.title}
                      </h3>
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-900 text-blue-300">
                        {summary.type}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mb-2">
                      {summary.preview}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(summary.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                    <Link
                      href={`/summary/${summary.id}`}
                      className="px-3 py-2 rounded-lg bg-blue-900 text-blue-300 hover:bg-blue-800 transition"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(summary.id)}
                      className="px-3 py-2 rounded-lg bg-red-900 text-red-300 hover:bg-red-800 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
