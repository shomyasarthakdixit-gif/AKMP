import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, BookOpen, Users, Shield, Sparkles, Zap, Brain } from 'lucide-react';

const features = [
  { icon: Brain, label: 'AI-Powered Learning', desc: 'Smart course recommendations and insights' },
  { icon: Users, label: 'Team Collaboration', desc: 'Connect educators and learners seamlessly' },
  { icon: Shield, label: 'Role-Based Access', desc: 'Secure, tiered access for every user type' },
  { icon: Zap, label: 'Real-time Analytics', desc: 'Live insights across your knowledge base' },
];

const INDIGO = '#6366F1';
const CYAN = '#60A5FA';
const ORANGE = '#A5B4FC';
const GRAD = 'linear-gradient(135deg, #6366F1 0%, #60A5FA 100%)';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:8002/api/v1/auth/signin', { username, password });
      sessionStorage.setItem('token', res.data.accessToken);
      sessionStorage.setItem('username', res.data.username);
      sessionStorage.setItem('email', res.data.email);
      sessionStorage.setItem('role', res.data.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden p-12 text-white"
        style={{ background: 'linear-gradient(160deg, #0F172A 0%, #1e1b4b 45%, #0c1a3a 100%)' }}>
        {/* Animated orbs */}
        <div className="absolute top-[-80px] left-[-80px] w-96 h-96 rounded-full opacity-25 animate-float-slow"
          style={{ background: `radial-gradient(circle, ${INDIGO} 0%, transparent 70%)` }} />
        <div className="absolute bottom-[-100px] right-[-60px] w-80 h-80 rounded-full opacity-20 animate-float-medium"
          style={{ background: `radial-gradient(circle, ${CYAN} 0%, transparent 70%)` }} />
        <div className="absolute top-1/2 right-20 w-48 h-48 rounded-full opacity-15 animate-float-slow"
          style={{ background: `radial-gradient(circle, ${ORANGE} 0%, transparent 70%)`, animationDelay: '3s' }} />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg" style={{ background: GRAD }}>
            A
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>AKMP</span>
            <p className="text-white/40 text-xs">Knowledge Management Portal</p>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{ background: 'rgba(79,70,229,0.25)', border: `1px solid rgba(79,70,229,0.4)`, color: '#A5B4FC' }}>
            <Sparkles size={12} />
            Premium EdTech · AI Architecture
          </div>
          <h1 className="text-5xl font-extrabold mb-5 leading-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
            Manage Your{' '}
            <span className="gradient-text">Knowledge</span>{' '}
            Efficiently
          </h1>
          <p className="text-white/55 text-lg leading-relaxed mb-10">
            A centralized, AI-powered platform for organizing, sharing, and discovering knowledge across your enterprise.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {features.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: 'rgba(79,70,229,0.3)' }}>
                  <Icon size={15} style={{ color: '#A5B4FC' }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/90">{label}</p>
                  <p className="text-xs text-white/40 mt-0.5 leading-snug">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-white/25">
          <span>© 2026 AKMP. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 bg-[#FAFAFB] dark:bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-30 pointer-events-none"
          style={{ background: `radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 70%)`, transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-20 pointer-events-none"
          style={{ background: `radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)`, transform: 'translate(-30%, 30%)' }} />

        <div className="w-full max-w-md z-10 page-enter">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg text-white" style={{ background: GRAD }}>A</div>
            <span className="text-xl font-bold" style={{ fontFamily: "'Sora', sans-serif" }}>AKMP</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#0F172A] dark:text-foreground mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>
              Welcome back 👋
            </h2>
            <p className="text-[#64748B] dark:text-muted-foreground">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl text-sm font-medium flex items-center gap-2.5 animate-in slide-in-from-top-2 duration-300"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#DC2626' }}
              role="alert" aria-live="assertive">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5" aria-label="Sign in form">
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-sm font-semibold text-[#0F172A] dark:text-foreground">Username</Label>
              <Input id="username" type="text" placeholder="Enter your username" value={username}
                onChange={(e) => setUsername(e.target.value)} required autoComplete="username"
                className="h-12 rounded-xl border-[#E5E7EB] bg-white dark:bg-[#1E293B] text-sm shadow-sm transition-all"
                style={{ '--tw-ring-color': 'rgba(79,70,229,0.2)' }} />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-semibold text-[#0F172A] dark:text-foreground">Password</Label>
                <button type="button" className="text-xs font-medium transition-colors" style={{ color: INDIGO }}>Forgot password?</button>
              </div>
              <div className="relative">
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password"
                  value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password"
                  className="h-12 rounded-xl border-[#E5E7EB] bg-white dark:bg-[#1E293B] text-sm shadow-sm pr-12 transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A] dark:hover:text-foreground transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading}
              className="shine-on-hover w-full h-12 rounded-xl text-sm font-semibold text-white transition-all duration-200 btn-glow disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: isLoading ? '#64748B' : GRAD }}>
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : 'Sign in →'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-[#E5E7EB] dark:bg-[#334155]" />
            <span className="text-xs text-[#64748B]">or</span>
            <div className="flex-1 h-px bg-[#E5E7EB] dark:bg-[#334155]" />
          </div>

          <p className="text-center text-sm text-[#64748B]">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold transition-colors" style={{ color: INDIGO }}>
              Create one free →
            </Link>
          </p>

          {/* Tech stack badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {['Spring Boot', 'Node.js', 'FastAPI', 'PostgreSQL', 'MongoDB'].map(t => (
              <span key={t} className="px-2.5 py-1 rounded-full text-xs font-medium mono"
                style={{ background: 'rgba(79,70,229,0.07)', color: INDIGO, border: `1px solid rgba(79,70,229,0.15)` }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


