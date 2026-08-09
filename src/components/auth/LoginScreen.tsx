import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import appLogo from '../../assets/images/regenerated_image_1786251258890.png';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onNavigateToSignUp?: () => void;
  onNavigateToHome?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onNavigateToSignUp,
  onNavigateToHome,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFillDemo = () => {
    setEmail('demo@interview.ai');
    setPassword('interview123');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in both email and password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Allow demo account or any valid input to login for test candidates
      if (email.trim().length > 0 && password.length > 0) {
        onLoginSuccess();
      } else {
        setError('Invalid email or password.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen w-full bg-[#09090B] text-[#F4F4F5] flex flex-col justify-center items-center p-4 antialiased selection:bg-[#8B5CF6]/30 selection:text-purple-200">
      {/* Background ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Top Back Link if provided */}
        {onNavigateToHome && (
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onNavigateToHome}
              className="text-xs text-[#A1A1AA] hover:text-white transition-colors flex items-center gap-1"
            >
              ← Back to Home
            </button>
            <span className="text-[10px] text-[#8B5CF6] font-mono bg-[#8B5CF6]/10 px-2 py-0.5 rounded border border-[#8B5CF6]/30">
              Evaluator Portal
            </span>
          </div>
        )}

        {/* Brand Title */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-1">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 shadow-lg shadow-purple-500/25">
              <img 
                src={appLogo} 
                alt="IntervViewForge logo" 
                className="w-full h-full object-cover scale-[1.30]" 
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            IntervViewForge
          </h1>
          <p className="text-xs text-[#A1A1AA] max-w-xs mx-auto font-medium">
            Where every interview is forged around you.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#111113] border border-[#27272A] rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#27272A]/80">
            <div>
              <h2 className="text-base font-semibold text-[#F4F4F5]">Sign In</h2>
              <p className="text-xs text-[#71717A]">Access your evaluator session workspace</p>
            </div>
            <span className="text-[10px] font-mono font-semibold text-[#8B5CF6] bg-[#8B5CF6]/10 px-2.5 py-1 rounded-full border border-[#8B5CF6]/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Interview Agent
            </span>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="demo@interview.ai"
                  required
                  className="w-full bg-[#18181B] border border-[#27272A] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#F4F4F5] placeholder-[#52525B] focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-[#A1A1AA] block">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#71717A]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-[#18181B] border border-[#27272A] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#F4F4F5] placeholder-[#52525B] focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all"
                />
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white font-medium text-sm py-2.5 px-4 rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2 group min-h-[44px]"
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Platform</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Helper Badge */}
          <div className="mt-5 pt-4 border-t border-[#27272A]/60 flex items-center justify-between text-xs">
            <span className="text-[#71717A]">Demo Account:</span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[#C4B5FD] hover:text-white font-mono bg-[#8B5CF6]/15 px-2.5 py-1 rounded-lg border border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/25 transition-all text-[11px]"
            >
              Fill Demo Credentials
            </button>
          </div>

          {/* Switch to Sign Up if provided */}
          {onNavigateToSignUp && (
            <div className="mt-4 pt-3 border-t border-[#27272A]/60 text-center text-xs text-[#71717A]">
              <span>Don't have an account? </span>
              <button
                type="button"
                onClick={onNavigateToSignUp}
                className="text-[#C4B5FD] hover:text-white font-semibold underline underline-offset-2 ml-1"
              >
                Sign up
              </button>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-[#52525B]">
          Demo Access · Enterprise AI Engineering
        </p>
      </div>
    </div>
  );
};
