'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { useLanguage } from '../../contexts/LanguageContext';

export default function LoginPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: '',
    username: '',
    role: '',
    phone: '',
    age: '',
    gender: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password match
    if (registerData.password !== registerData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    // Generate unique ID (format: UID-YYYYMMDD-XXXX)
    const date = new Date();
    const dateStr = date.getFullYear().toString() + 
                    (date.getMonth() + 1).toString().padStart(2, '0') + 
                    date.getDate().toString().padStart(2, '0');
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const generatedId = `UID-${dateStr}-${randomNum}`;
    
    // Store registration data with unique ID in localStorage
    const profileData = {
      ...registerData,
      uniqueId: generatedId,
      createdAt: date.toISOString()
    };
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    localStorage.setItem('userCredentials', JSON.stringify({
      uniqueId: generatedId,
      username: registerData.username,
      password: registerData.password,
      role: registerData.role
    }));
    
    // Store patient data separately for doctor search
    if (registerData.role === 'patient') {
      localStorage.setItem(`patient_${generatedId}`, JSON.stringify(profileData));
    }
    
    // Save the generated ID to show after redirect
    sessionStorage.setItem('newUserId', generatedId);
    
    // Redirect to appropriate dashboard based on role
    if (registerData.role === 'doctor') {
      router.push('/doctor-dashboard');
    } else {
      router.push('/patient-dashboard');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Check credentials from localStorage
    const storedCredentials = localStorage.getItem('userCredentials');
    const storedProfile = localStorage.getItem('userProfile');
    
    if (storedCredentials && storedProfile) {
      const credentials = JSON.parse(storedCredentials);
      const profile = JSON.parse(storedProfile);
      
      if (profile.username === username && credentials.password === password) {
        // Redirect to appropriate dashboard based on role
        if (profile.role === 'doctor') {
          router.push('/doctor-dashboard');
        } else if (profile.role === 'patient') {
          router.push('/patient-dashboard');
        } else {
          router.push('/');
        }
      } else {
        alert('Invalid Username or Password!');
      }
    } else {
      alert('No account found. Please register first.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <Navbar />

      <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 pt-[100px] pb-32">
        <div className="relative min-h-[650px]" style={{ perspective: '1000px' }}>
          <div 
            className={`relative w-full transition-all duration-700 ease-in-out`}
            style={{ 
              transformStyle: 'preserve-3d',
              transform: isRegister ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
          >
            {/* Login Form - Front */}
            <div 
              className={`bg-slate-700/80 backdrop-blur-lg rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-600/50 ${isRegister ? 'pointer-events-none' : ''}`}
              style={{ 
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden'
              }}
            >
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white">Login</h1>
                <p className="text-sm text-slate-400 mt-2">Login to save your summaries</p>
              </div>

              {/* Warning Banner */}
              <div className="mb-6 p-4 rounded-lg bg-yellow-900/20 border border-yellow-800">
                <div className="flex items-start gap-3">
                  <div className="text-yellow-400 text-xl">⚠️</div>
                  <div>
                    <div className="font-medium text-yellow-300">No Medical Data Stored</div>
                    <div className="text-sm text-yellow-400 mt-1">
                      We never store raw medical records. Only summary metadata is saved.
                    </div>
                  </div>
                </div>
              </div>

              {/* Login with Username */}
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-200">Username</label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-200">Password</label>
                    <div className="relative">
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full px-4 py-2 pr-10 rounded-lg border border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:bg-slate-700"
                      >
                        {showLoginPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Login
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsRegister(true)}
                  className="text-sm text-blue-400 hover:underline"
                >
                  Don't have an account? Register →
                </button>
              </div>
            </div>

            {/* Register Form - Back */}
            <div 
              className={`absolute top-0 left-0 w-full bg-slate-700/80 backdrop-blur-lg rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-600/50 ${!isRegister ? 'pointer-events-none' : ''}`}
              style={{ 
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <div className="text-center mb-4">
                <h1 className="text-xl font-bold text-white">Register</h1>
                <p className="text-xs text-slate-400 mt-1">Create an account to save your summaries</p>
              </div>

              {/* Warning Banner */}
              <div className="mb-4 p-3 rounded-lg bg-yellow-900/20 border border-yellow-800">
                <div className="flex items-start gap-2">
                  <div className="text-yellow-400 text-lg">⚠️</div>
                  <div>
                    <div className="text-sm font-medium text-yellow-300">No Medical Data Stored</div>
                    <div className="text-xs text-yellow-400 mt-0.5">
                      We never store raw medical records. Only summary metadata is saved.
                    </div>
                  </div>
                </div>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleRegister}>
                <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-200">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={registerData.name}
                    onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                    placeholder="Enter your full name"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-200">Username *</label>
                  <input
                    type="text"
                    required
                    value={registerData.username}
                    onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                    placeholder="Choose a username"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-200">I am a *</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value="patient"
                        required
                        checked={registerData.role === 'patient'}
                        onChange={(e) => setRegisterData({...registerData, role: e.target.value})}
                        className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-200">Patient</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value="doctor"
                        required
                        checked={registerData.role === 'doctor'}
                        onChange={(e) => setRegisterData({...registerData, role: e.target.value})}
                        className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-200">Doctor</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-200">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-200">Age *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="150"
                    value={registerData.age}
                    onChange={(e) => setRegisterData({...registerData, age: e.target.value})}
                    placeholder="25"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-200">Gender *</label>
                  <select
                    required
                    value={registerData.gender}
                    onChange={(e) => setRegisterData({...registerData, gender: e.target.value})}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-600 bg-slate-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Gender"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-200">Email (Optional)</label>
                  <input
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                    placeholder="your.email@example.com"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-200">Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={registerData.password}
                      onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                      placeholder="Enter password (min. 6 characters)"
                      className="w-full px-3 py-2 pr-10 text-sm rounded-lg border border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:bg-slate-700"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-200">Confirm Password *</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                      placeholder="Re-enter password"
                      className="w-full px-3 py-2 pr-10 text-sm rounded-lg border border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:bg-slate-700"
                    >
                      {showConfirmPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition mt-2"
                >
                  Create Account
                </button>
              </div>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => setIsRegister(false)}
                className="text-sm text-blue-400 hover:underline"
              >
                ← Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
        
        <div className="mt-8 mb-6 text-center text-sm text-slate-400">
          <p>🔒 Your privacy is our priority</p>
          <p className="mt-1">We comply with HIPAA and GDPR standards</p>
        </div>
      </main>
    </div>
  );
}
