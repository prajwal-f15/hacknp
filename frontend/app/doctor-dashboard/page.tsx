'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function DoctorDashboard() {
  const router = useRouter();
  const [searchUID, setSearchUID] = useState('');
  const [patientData, setPatientData] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [doctorProfile, setDoctorProfile] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in and is a doctor
    const profile = localStorage.getItem('userProfile');
    if (!profile) {
      router.push('/login');
      return;
    }
    
    const userData = JSON.parse(profile);
    if (userData.role !== 'doctor') {
      router.push('/patient-dashboard');
      return;
    }
    
    setDoctorProfile(userData);
  }, [router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    // Search for patient in localStorage (in real app, this would be an API call)
    setTimeout(() => {
      const allUsers = Object.keys(localStorage)
        .filter(key => key.startsWith('patient_'))
        .map(key => JSON.parse(localStorage.getItem(key) || '{}'));
      
      const patient = allUsers.find(user => user.uniqueId === searchUID);
      
      if (patient) {
        setPatientData(patient);
      } else {
        alert('Patient not found with this UID');
        setPatientData(null);
      }
      setIsSearching(false);
    }, 500);
  };

  if (!doctorProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[100px] pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Doctor Dashboard</h1>
          <p className="text-slate-200 mt-2">Welcome, Dr. {doctorProfile.name}</p>
        </div>

        {/* Search Section */}
        <div className="bg-slate-700/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-slate-600/50 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Search Patient by UID</h2>
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              value={searchUID}
              onChange={(e) => setSearchUID(e.target.value)}
              placeholder="Enter Patient UID (e.g., UID-20260201-1234)"
              className="flex-1 px-4 py-3 rounded-lg border border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <button
              type="submit"
              disabled={isSearching}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {/* Patient Details */}
        {patientData && (
          <div className="bg-slate-700/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-slate-600/50 mb-6 animate-fadeIn">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Patient Found
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Patient ID</label>
                  <p className="text-white font-mono bg-slate-600/50 px-4 py-2 rounded-lg">{patientData.uniqueId}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                  <p className="text-white px-4 py-2 bg-slate-600/50 rounded-lg">{patientData.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Age</label>
                  <p className="text-white px-4 py-2 bg-slate-600/50 rounded-lg">{patientData.age} years</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Gender</label>
                  <p className="text-white px-4 py-2 bg-slate-600/50 rounded-lg capitalize">{patientData.gender}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Phone</label>
                  <p className="text-white px-4 py-2 bg-slate-600/50 rounded-lg">{patientData.phone}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                  <p className="text-white px-4 py-2 bg-slate-600/50 rounded-lg">{patientData.email || 'Not provided'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Username</label>
                  <p className="text-white px-4 py-2 bg-slate-600/50 rounded-lg">{patientData.username}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Registered On</label>
                  <p className="text-white px-4 py-2 bg-slate-600/50 rounded-lg">
                    {patientData.createdAt ? new Date(patientData.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-4">
              <button className="px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Medical Records
              </button>
              <button className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Send Message
              </button>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-slate-700/80 backdrop-blur-xl rounded-2xl p-6 shadow border border-slate-600/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Total Patients</div>
                <div className="text-2xl font-bold text-white mt-1">142</div>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div className="bg-slate-700/80 backdrop-blur-xl rounded-2xl p-6 shadow border border-slate-600/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Today's Appointments</div>
                <div className="text-2xl font-bold text-white mt-1">8</div>
              </div>
              <div className="text-4xl">📅</div>
            </div>
          </div>

          <div className="bg-slate-700/80 backdrop-blur-xl rounded-2xl p-6 shadow border border-slate-600/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Pending Reports</div>
                <div className="text-2xl font-bold text-white mt-1">5</div>
              </div>
              <div className="text-4xl">📋</div>
            </div>
          </div>

          <div className="bg-slate-700/80 backdrop-blur-xl rounded-2xl p-6 shadow border border-slate-600/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Messages</div>
                <div className="text-2xl font-bold text-white mt-1">12</div>
              </div>
              <div className="text-4xl">💬</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
