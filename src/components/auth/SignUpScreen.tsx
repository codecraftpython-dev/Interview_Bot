import React, { useState } from 'react';
import { Lock, Mail, User, ArrowRight, AlertCircle, ShieldCheck, Briefcase } from 'lucide-react';
import appLogo from '../../assets/images/regenerated_image_1786251258890.png';

interface SignUpScreenProps {
  onSignUpSuccess: () => void;
  onNavigateToLogin: () => void;
  onNavigateToHome: () => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onSignUpSuccess,
  onNavigateToLogin,
  onNavigateToHome,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('AI Systems Engineer');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onSignUpSuccess();
    }, 500);
  };

  return (
    <div className="min-h-screen w-full bg-[#09090B] text-[#F4F4F5] flex flex-col justify-center items-center p-4 antialiased selection:bg-[#8B5CF6]/30 selection:text-purple-200">
      {/* Background ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Top Back Link */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onNavigateToHome}
            className="text-xs text-[#A1A1AA] hover:text-white transition-colors flex items-center gap-1"
          >
            ← Back to Home
          </button>
          <span className="text-[10px] text-[#8B5CF6] font-mono bg-[#8B5CF6]/10 px-2 py-0.5 rounded border border-[#8B5CF6]/30">
            Platform Access
          </span>
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <div className="w-11 h-11 rounded-2xl overflow-hidden shrink-0 shadow-lg shadow-purple-500/25">
              <img 
                src={appLogo} 
                alt="IntervViewForge logo" 
                className="w-full h-full object-cover scale-[1.30]" 
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            IntervViewForge
          </h1>
          <p className="text-xs text-[#A1A1AA] max-w-xs mx-auto">
            Where every interview is forged around you.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[#111113] border border-[#27272A] rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
            <h2 className="text-sm font-semibold text-[#F4F4F5]">Candidate Details</h2>
            <span className="text-[10px] text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded font-mono">
              Instant Setup
            </span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#A1A1AA] block">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#71717A]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  required
                  className="w-full bg-[#18181B] border border-[#27272A] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#F4F4F5] placeholder-[#52525B] focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#A1A1AA] block">
                Work Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#71717A]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  required
                  className="w-full bg-[#18181B] border border-[#27272A] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#F4F4F5] placeholder-[#52525B] focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all"
                />
              </div>
            </div>

            {/* Role Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#A1A1AA] block">
                Target Engineering Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#71717A]">
                  <Briefcase className="w-4 h-4" />
                </div>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#18181B] border border-[#27272A] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#F4F4F5] focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all appearance-none"
                >
                  <option value="AI Systems Engineer">AI Systems Engineer</option>
                  <option value="Full-Stack AI Developer">Full-Stack AI Developer</option>
                  <option value="RAG & LLM Architect">RAG & LLM Architect</option>
                  <option value="Agentic Workflows Engineer">Agentic Workflows Engineer</option>
                  <option value="Machine Learning Platform Engineer">Machine Learning Platform Engineer</option>
                </select>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#A1A1AA] block">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#71717A]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="w-full bg-[#18181B] border border-[#27272A] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#F4F4F5] placeholder-[#52525B] focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white font-medium text-sm py-2.5 px-4 rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2 group min-h-[44px]"
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account & Start Practice</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="pt-3 border-t border-[#27272A]/60 text-center text-xs text-[#71717A]">
            <span>Already have an account? </span>
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="text-[#C4B5FD] hover:text-white font-semibold underline underline-offset-2 ml-1"
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
