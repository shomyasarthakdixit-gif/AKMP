import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Brain, Users, Shield, Zap, Sparkles, ArrowRight } from 'lucide-react';

const features = [
  { icon: Brain,  label: 'AI-Powered Learning',  desc: 'Smart course recommendations & insights' },
  { icon: Users,  label: 'Team Collaboration',    desc: 'Connect educators and learners seamlessly' },
  { icon: Shield, label: 'Role-Based Access',      desc: 'Secure, tiered access for every user type' },
  { icon: Zap,    label: 'Real-time Analytics',   desc: 'Live insights across your knowledge base' },
];

const PRIMARY = '#5B4BFF';
const TEAL    = '#00BFA6';
const CORAL   = '#FF7A59';
const GRAD    = 'linear-gradient(135deg, #5B4BFF 0%, #00BFA6 100%)';

export default function Login() {
  const [username, setUsername]       = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]             = useState('');
  const [isLoading, setIsLoading]     = useState(false);
  const [visible, setVisible]         = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem('token')) navigate('/dashboard');
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/signin`, { username, password });
      sessionStorage.setItem('token',    res.data.accessToken);
      sessionStorage.setItem('username', res.data.username);
      sessionStorage.setItem('email',    res.data.email);
      sessionStorage.setItem('role',     res.data.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const delay = (ms) => ({ transitionDelay: `${ms}ms` });

  return (
    <div className="min-h-screen flex w-full" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden p-12 text-white"
        style={{ background: 'linear-gradient(160deg, #070B14 0%, #1a1040 45%, #0a1628 100%)' }}>

        {/* Animated orbs */}
        <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, rgba(91,75,255,0.22) 0%, transparent 70%)`, filter: 'blur(60px)', animation: 'floatSlow 12s ease-in-out infinite' }} />
        <div className="absolute bottom-[-120px] right-[-80px] w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, rgba(0,191,166,0.18) 0%, transparent 70%)`, filter: 'blur(60px)', animation: 'floatMedium 9s ease-in-out infinite' }} />
        <div className="absolute top-1/2 right-1/4 w-[220px] h-[220px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, rgba(255,122,89,0.14) 0%, transparent 70%)`, filter: 'blur(40px)', animation: 'floatFast 6s ease-in-out infinite 2s' }} />

        {/* Grid overlay */}
        <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />

        {/* Decorative ring */}
        <div className="absolute top-1/3 right-1/3 w-48 h-48 rounded-full pointer-events-none"
          style={{ border: '1px solid rgba(91,75,255,0.15)', animation: 'floatSlow 14s ease-in-out infinite 3s' }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-30px)', transition: 'all 0.7s cubic-bezier(0.22,1,0.36,1)' }}>
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg" style={{ background: GRAD }}>A</div>
          <div>
            <span className="text-lg font-bold tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>AKMP</span>
            <p className="text-white/40 text-xs leading-none mt-0.5">Knowledge Management Portal</p>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative z-10 max-w-lg">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: 'rgba(91,75,255,0.2)', border: '1px solid rgba(91,75,255,0.4)', color: '#8B7CFF',
              opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-40px)', transition: 'all 0.7s cubic-bezier(0.22,1,0.36,1) 150ms' }}>
            <Sparkles size={12} /> Premium EdTech · AI Architecture
          </div>

          <h1 className="text-5xl font-bold mb-5 leading-tight"
            style={{ fontFamily: "'Poppins', sans-serif",
              opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-50px)',
              transition: 'all 0.8s cubic-bezier(0.22,1,0.36,1) 250ms' }}>
            Manage Your{' '}
            <span style={{ background: 'linear-gradient(135deg, #8B7CFF, #2DD4BF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Knowledge
            </span>
            {' '}Efficiently
          </h1>

          <p className="text-white/55 text-lg leading-relaxed mb-10"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-40px)', transition: 'all 0.7s cubic-bezier(0.22,1,0.36,1) 350ms' }}>
            A centralised, AI-powered platform for organising, sharing, and discovering knowledge across your enterprise.
          </p>

          <div className="grid grid-cols-2 gap-3"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.7s cubic-bezier(0.22,1,0.36,1) 450ms' }}>
            {features.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3 p-4 rounded-2xl group hover:bg-white/5 transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200"
                  style={{ background: 'rgba(91,75,255,0.3)' }}>
                  <Icon size={15} style={{ color: '#8B7CFF' }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/90" style={{ fontFamily: "'Poppins', sans-serif" }}>{label}</p>
                  <p className="text-xs text-white/40 mt-0.5 leading-snug">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-white/25">
          <span>© {new Date().getFullYear()} AKMP. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 bg-[#F8FAFC] dark:bg-background relative overflow-hidden">
        {/* Subtle glow blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(91,75,255,0.1) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,191,166,0.08) 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />

        <div className="w-full max-w-md z-10 page-enter">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg text-white" style={{ background: GRAD }}>A</div>
            <span className="text-xl font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>AKMP</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#0F172A] dark:text-foreground mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Welcome back 👋
            </h2>
            <p className="text-[#475569] dark:text-muted-foreground">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl text-sm font-medium flex items-center gap-2.5 animate-fade-in"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#DC2626' }}
              role="alert" aria-live="assertive">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5" aria-label="Sign in form">
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-sm font-semibold text-[#0F172A] dark:text-foreground">Username</Label>
              <Input id="username" type="text" placeholder="Enter your username" value={username}
                onChange={(e) => setUsername(e.target.value)} required autoComplete="username"
                className="h-12 rounded-2xl border-[#E2E8F0] bg-white dark:bg-card text-sm shadow-sm transition-all focus:border-[#5B4BFF] focus:ring-2"
                style={{ '--tw-ring-color': 'rgba(91,75,255,0.15)' }} />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-semibold text-[#0F172A] dark:text-foreground">Password</Label>
                <button type="button" className="text-xs font-medium transition-colors hover:opacity-80" style={{ color: PRIMARY }}>
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password"
                  value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password"
                  className="h-12 rounded-2xl border-[#E2E8F0] bg-white dark:bg-card text-sm shadow-sm pr-12 transition-all focus:border-[#5B4BFF]" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-foreground transition-colors p-1 rounded-lg"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" id="login-submit-btn" disabled={isLoading}
              className="shine-on-hover w-full h-12 rounded-2xl text-sm font-semibold text-white transition-all duration-300 btn-glow disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: isLoading ? '#64748B' : GRAD }}>
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="spinner w-4 h-4" />
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign in <ArrowRight size={16} />
                </span>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, #E2E8F0, transparent)' }} />
            <span className="text-xs text-[#94A3B8] font-medium">or</span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, #E2E8F0, transparent)' }} />
          </div>

          <p className="text-center text-sm text-[#475569] dark:text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" id="signup-link" className="font-semibold transition-colors hover:opacity-80" style={{ color: PRIMARY }}>
              Create one free →
            </Link>
          </p>

          {/* Tech stack badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {['Spring Boot', 'Node.js', 'FastAPI', 'PostgreSQL', 'MongoDB'].map(t => (
              <span key={t} className="px-3 py-1.5 rounded-full text-xs font-medium mono"
                style={{ background: 'rgba(91,75,255,0.07)', color: PRIMARY, border: '1px solid rgba(91,75,255,0.15)' }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

