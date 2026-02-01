'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [profile, setProfile] = useState({
    uniqueId: '',
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    username: '',
    role: ''
  });

  // Load profile from localStorage on mount and trigger animations
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    const savedPic = localStorage.getItem('profilePic');
    if (savedPic) {
      setProfilePic(savedPic);
    }
    
    // Trigger animation after component mounts
    setTimeout(() => setIsMounted(true), 50);
  }, []);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfilePic(result);
        localStorage.setItem('profilePic', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(profile));
    alert('Profile updated successfully!');
  };

  const handleLogout = () => {
    // Clear all user data from localStorage
    localStorage.removeItem('userCredentials');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('profilePic');
    
    // Trigger storage event to update navbar
    window.dispatchEvent(new Event('storage'));
    
    // Redirect to home page
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-[100px] pb-12">
        {/* Logo Section */}
        <div 
          className={`flex justify-center mb-8 transition-all duration-700 ${
            isMounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative bg-slate-800/90 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 flex items-center gap-4 shadow-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">HealthGuard</h2>
                <p className="text-sm text-slate-400">Medical Record System</p>
              </div>
            </div>
          </div>
        </div>

        {/* Page Header with fade-in animation */}
        <div 
          className={`mb-8 transition-all duration-700 delay-100 ${
            isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          <p className="text-slate-200 mt-2">
            Manage your account information and preferences
          </p>
        </div>

        {/* Profile Card with delayed fade-in */}
        <div 
          className={`bg-slate-700/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-slate-600/50 mb-6 transition-all duration-700 delay-100 ${
            isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="relative group">
                {profilePic ? (
                  <img 
                    src={profilePic} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                    SJ
                  </div>
                )}
                {isEditing && (
                  <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePicChange}
                      className="hidden"
                      aria-label="Upload profile picture"
                    />
                  </label>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
                <p className="text-slate-400 mt-1">ID: {profile.uniqueId}</p>
                {profile.username && (
                  <p className="text-slate-400 flex items-center gap-2 mt-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    @{profile.username}
                  </p>
                )}
                {profile.role && (
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                    profile.role === 'doctor' 
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                      : 'bg-green-500/20 text-green-400 border border-green-500/30'
                  }`}>
                    {profile.role === 'doctor' ? '👨‍⚕️ Doctor' : '🏥 Patient'}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-200">Unique ID</label>
                <p className="text-white font-mono bg-slate-700 px-4 py-2 rounded-lg">{profile.uniqueId || 'Not assigned'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-200">Username</label>
                <p className="text-white font-mono bg-slate-700 px-4 py-2 rounded-lg flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  @{profile.username || 'Not set'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-200">Role</label>
                <div className="bg-slate-700 px-4 py-2 rounded-lg">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    profile.role === 'doctor' 
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                      : 'bg-green-500/20 text-green-400 border border-green-500/30'
                  }`}>
                    {profile.role === 'doctor' ? '👨‍⚕️ Doctor' : '🏥 Patient'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-200">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Full Name"
                    placeholder="Enter your name"
                  />
                ) : (
                  <p className="text-slate-200">{profile.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-200">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Phone"
                    placeholder="Enter phone number"
                  />
                ) : (
                  <p className="text-slate-200">{profile.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-200">Age</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={profile.age}
                    onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Age"
                    placeholder="Enter age"
                  />
                ) : (
                  <p className="text-slate-200">{profile.age}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-200">Gender</label>
                {isEditing ? (
                  <select
                    value={profile.gender}
                    onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Gender"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                ) : (
                  <p className="text-slate-200 capitalize">{profile.gender}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-200">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Email"
                    placeholder="Enter email (optional)"
                  />
                ) : (
                  <p className="text-slate-200">{profile.email || 'Not provided'}</p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="pt-6 flex justify-end gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Account Statistics */}
        <div 
          className={`grid md:grid-cols-3 gap-6 mb-6 transition-all duration-700 delay-200 ${
            isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="bg-slate-700/80 backdrop-blur-xl rounded-2xl p-6 shadow border border-slate-600/50 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Total Summaries</div>
                <div className="text-2xl font-bold text-white mt-1">24</div>
              </div>
              <div className="text-4xl">📝</div>
            </div>
          </div>

          <div className="bg-slate-700/80 backdrop-blur-xl rounded-2xl p-6 shadow border border-slate-600/50 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">This Month</div>
                <div className="text-2xl font-bold text-white mt-1">8</div>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>

          <div className="bg-slate-700/80 backdrop-blur-xl rounded-2xl p-6 shadow border border-slate-600/50 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Storage Used</div>
                <div className="text-2xl font-bold text-white mt-1">125 KB</div>
              </div>
              <div className="text-4xl">💾</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div 
          className={`bg-slate-700/80 backdrop-blur-xl rounded-2xl p-8 shadow border border-slate-600/50 transition-all duration-700 delay-300 ${
            isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-1 gap-4">
            <button
              onClick={handleLogout}
              className="p-4 rounded-lg border-2 border-red-700 hover:border-red-500 bg-red-900/20 hover:bg-red-900/40 transition-all duration-300 hover:scale-105 flex items-center gap-3 text-left"
            >
              <div className="text-3xl">🚪</div>
              <div>
                <div className="font-medium text-white">Logout</div>
                <div className="text-sm text-slate-400">Sign out of your account</div>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
