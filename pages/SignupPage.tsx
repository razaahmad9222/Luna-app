
import React, { useState } from 'react';
import { Mail, Lock, User, Loader2, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { authService } from '../services/auth';
import { useToast } from '../components/ui/Toast';
import { cn } from '../lib/utils';

interface SignupPageProps {
  onNavigate: (view: 'login') => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast({ type: 'error', title: 'Missing fields', description: 'Please fill in all fields.' });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({ type: 'error', title: 'Passwords mismatch', description: 'Your passwords do not match.' });
      return;
    }

    if (!termsAccepted) {
      toast({ type: 'error', title: 'Terms Required', description: 'Please accept the Terms of Service.' });
      return;
    }

    setIsLoading(true);
    const { error } = await authService.signUp(email, password, name);
    
    if (error) {
      toast({ type: 'error', title: 'Signup Failed', description: error.message });
      setIsLoading(false);
    } else {
      toast({ type: 'success', title: 'Account Created', description: 'Please check your email to verify your account.' });
      onNavigate('login');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await authService.signInWithGoogle();
    if (error) {
      toast({ type: 'error', title: 'Google Login Failed', description: error.message });
    }
  };

  // Simple password strength calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score++;
    if (/[^a-zA-Z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getPasswordStrength(password);
  const strengthColors = ['bg-gray-200', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];
  const strengthText = ['Enter password', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-luna-amethyst-100/50 blur-3xl" />
        <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] rounded-full bg-blue-50/50 blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 relative z-10 border border-white/20"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-500">Join Luna to sync your life with your cycle.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-luna-amethyst-500 focus:ring-2 focus:ring-luna-amethyst-200 outline-none transition-all bg-gray-50/50 focus:bg-white"
                placeholder="Elena Fisher"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-luna-amethyst-500 focus:ring-2 focus:ring-luna-amethyst-200 outline-none transition-all bg-gray-50/50 focus:bg-white"
                placeholder="elena@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-luna-amethyst-500 focus:ring-2 focus:ring-luna-amethyst-200 outline-none transition-all bg-gray-50/50 focus:bg-white"
                placeholder="Create a password"
              />
            </div>
            {/* Strength Meter */}
            {password && (
              <div className="flex items-center gap-2 mt-1 px-1">
                <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className={cn("h-full transition-all duration-300", strengthColors[strength])} style={{ width: `${(strength / 4) * 100}%` }} />
                </div>
                <span className="text-xs font-medium text-gray-500 min-w-[60px] text-right">{strengthText[strength]}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 ml-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-luna-amethyst-500 focus:ring-2 focus:ring-luna-amethyst-200 outline-none transition-all bg-gray-50/50 focus:bg-white"
                placeholder="Confirm password"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input 
              type="checkbox" 
              id="terms" 
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-luna-amethyst-600 focus:ring-luna-amethyst-500"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to the <a href="#" className="text-luna-amethyst-600 hover:underline">Terms</a> and <a href="#" className="text-luna-amethyst-600 hover:underline">Privacy Policy</a>
            </label>
          </div>

          <Button 
            type="submit" 
            variant="luna" 
            className="w-full h-12 text-base font-medium shadow-lg shadow-luna-amethyst-500/20 mt-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">Create Account <ArrowRight className="h-4 w-4" /></span>
            )}
          </Button>
        </form>

        <div className="mt-6">
          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium text-gray-700"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button onClick={() => onNavigate('login')} className="font-semibold text-luna-amethyst-600 hover:text-luna-amethyst-700">
            Sign in
          </button>
        </p>
      </motion.div>
    </div>
  );
};
