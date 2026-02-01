'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default function RecommendationsPage() {
  const params = useParams();
  const router = useRouter();

  const recommendations = {
    lifestyle: [
      {
        icon: '🥗',
        title: 'Dietary Modifications',
        advice: 'Follow a balanced diet low in refined sugars and high in fiber. Include whole grains, vegetables, and lean proteins. Limit processed foods and sugary beverages.',
        priority: 'high'
      },
      {
        icon: '🏃',
        title: 'Physical Activity',
        advice: 'Aim for at least 150 minutes of moderate aerobic activity per week. Regular exercise helps control blood sugar levels and improves overall health.',
        priority: 'high'
      },
      {
        icon: '💧',
        title: 'Hydration',
        advice: 'Drink plenty of water throughout the day. Proper hydration helps maintain blood sugar levels and supports kidney function.',
        priority: 'medium'
      },
      {
        icon: '😴',
        title: 'Sleep Hygiene',
        advice: 'Maintain a regular sleep schedule with 7-8 hours of quality sleep. Poor sleep can affect blood sugar control.',
        priority: 'medium'
      }
    ],
    medical: [
      {
        icon: '💊',
        title: 'Medication Adherence',
        advice: 'Take Metformin 500mg daily as prescribed. Set reminders if needed and never skip doses without consulting your doctor.',
        priority: 'high'
      },
      {
        icon: '📊',
        title: 'Blood Sugar Monitoring',
        advice: 'Monitor fasting blood glucose levels regularly. Keep a log to track patterns and share with your healthcare provider.',
        priority: 'high'
      },
      {
        icon: '👨‍⚕️',
        title: 'Regular Check-ups',
        advice: 'Schedule follow-up appointments as recommended. Regular monitoring helps adjust treatment plans effectively.',
        priority: 'high'
      },
      {
        icon: '🩺',
        title: 'Comprehensive Testing',
        advice: 'Consider HbA1c testing every 3 months to assess long-term blood sugar control. Discuss with your doctor.',
        priority: 'medium'
      }
    ],
    preventive: [
      {
        icon: '👁️',
        title: 'Eye Examinations',
        advice: 'Schedule annual comprehensive eye exams to detect early signs of diabetic retinopathy.',
        priority: 'medium'
      },
      {
        icon: '🦶',
        title: 'Foot Care',
        advice: 'Inspect feet daily for cuts, blisters, or sores. Maintain proper foot hygiene and wear comfortable shoes.',
        priority: 'medium'
      },
      {
        icon: '🫀',
        title: 'Cardiovascular Health',
        advice: 'Monitor blood pressure and cholesterol levels. Diabetes increases cardiovascular risk, so preventive care is essential.',
        priority: 'high'
      },
      {
        icon: '🚭',
        title: 'Avoid Smoking',
        advice: 'If you smoke, seek support to quit. Smoking significantly increases diabetes complications.',
        priority: 'high'
      }
    ]
  };

  const getPriorityColor = (priority: string) => {
    return priority === 'high' 
      ? 'border-red-800 bg-red-900/20' 
      : 'border-yellow-800 bg-yellow-900/20';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Care Recommendations</h1>
          <p className="text-slate-200 mt-2">
            Personalized advice for treatment and lifestyle management based on your health summary
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mb-8 p-4 rounded-lg bg-yellow-900/20 border border-yellow-800">
          <div className="flex items-start gap-3">
            <div className="text-yellow-400 text-xl">⚠️</div>
            <div>
              <div className="font-medium text-yellow-300">Medical Disclaimer</div>
              <div className="text-sm text-yellow-400 mt-1">
                These recommendations are AI-generated suggestions based on your health summary. Always consult with your healthcare provider before making any changes to your treatment plan.
              </div>
            </div>
          </div>
        </div>

        {/* Lifestyle Recommendations */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
            <span>🌟</span> Lifestyle Modifications
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {recommendations.lifestyle.map((rec, index) => (
              <div key={index} className={`p-6 rounded-xl border-2 ${getPriorityColor(rec.priority)} transition hover:shadow-lg`}>
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{rec.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{rec.title}</h3>
                    <p className="text-sm text-slate-200 leading-relaxed">{rec.advice}</p>
                    {rec.priority === 'high' && (
                      <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-red-800 text-red-200">
                        High Priority
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Medical Care Recommendations */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
            <span>💉</span> Medical Care & Treatment
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {recommendations.medical.map((rec, index) => (
              <div key={index} className={`p-6 rounded-xl border-2 ${getPriorityColor(rec.priority)} transition hover:shadow-lg`}>
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{rec.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{rec.title}</h3>
                    <p className="text-sm text-slate-200 leading-relaxed">{rec.advice}</p>
                    {rec.priority === 'high' && (
                      <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-red-800 text-red-200">
                        High Priority
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preventive Care */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
            <span>🛡️</span> Preventive Care
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {recommendations.preventive.map((rec, index) => (
              <div key={index} className={`p-6 rounded-xl border-2 ${getPriorityColor(rec.priority)} transition hover:shadow-lg`}>
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{rec.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{rec.title}</h3>
                    <p className="text-sm text-slate-200 leading-relaxed">{rec.advice}</p>
                    {rec.priority === 'high' && (
                      <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-red-800 text-red-200">
                        High Priority
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl p-8 border border-blue-800 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">📋 Next Steps</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-blue-400 mt-1">1.</span>
              <p className="text-slate-200">Share this summary and recommendations with your healthcare provider</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 mt-1">2.</span>
              <p className="text-slate-200">Schedule a follow-up appointment to discuss these recommendations</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 mt-1">3.</span>
              <p className="text-slate-200">Start implementing lifestyle changes gradually with medical supervision</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 mt-1">4.</span>
              <p className="text-slate-200">Keep track of your progress and report any concerns to your doctor</p>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => router.push(`/summary/${params.id}`)}
            className="px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition"
          >
            ← Back to Summary
          </button>
          <Link
            href="/export"
            className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Export PDF
          </Link>
        </div>
      </main>
    </div>
  );
}
