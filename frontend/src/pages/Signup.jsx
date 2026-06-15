import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

const GRAD  = 'linear-gradient(135deg, #5B4BFF 0%, #00BFA6 100%)';
const PRIMARY = '#5B4BFF';
const TEAL    = '#00BFA6';

const perks = [
  'Access to all course materials',
  'Collaborate with your team',
  'Personalised dashboard & reviews',
  'Role-based, secure access control',
];

export default function Signup() {
  const [username,     setUsername]     = useState('');
  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role,         setRole]         = useState('USER');
  const [error,        setError]        = useState('');
  const [success,      setSuccess]      = useState(false);
  const [isLoading,    setIsLoading]    = useState(false);
  const [visible,      setVisible]      = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem('token')) navigate('/dashboard');
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, [navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/signup`, { username, email, password, role });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden p-12 text-white"
        style={{ background: 'linear-gradient(160deg, #070B14 0%, #0a1a28 50%, #1a1040 100%)' }}>

        {/* Animated orbs */}
        <div className="absolute top-[-80px] right-[-80px] w-[420px] h-[420px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,191,166,0.22) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'floatSlow 10s ease-in-out infinite' }} />
        <div className="absolute bottom-[-100px] left-[-60px] w-[360px] h-[360px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,122,89,0.18) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'floatMedium 8s ease-in-out infinite' }} />
        <div className="absolute top-1/2 left-1/3 w-[200px] h-[200px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(91,75,255,0.15) 0%, transparent 70%)', filter: 'blur(40px)', animation: 'floatFast 6s ease-in-out infinite 1.5s' }} />

        {/* Grid */}
        <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-30px)', transition: 'all 0.7s cubic-bezier(0.22,1,0.36,1)' }}>
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg" style={{ background: GRAD }}>A</div>
          <div>
            <span className="text-lg font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>AKMP</span>
            <p className="text-white/40 text-xs leading-none mt-0.5">Knowledge Management Portal</p>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: 'rgba(0,191,166,0.2)', border: '1px solid rgba(0,191,166,0.4)', color: '#2DD4BF',
              opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-40px)',
              transition: 'all 0.7s cubic-bezier(0.22,1,0.36,1) 150ms' }}>
            <Sparkles size={12} /> Join 1,200+ learners today
          </div>

          <h1 className="text-5xl font-bold mb-5 leading-tight"
            style={{ fontFamily: "'Poppins', sans-serif",
              opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-50px)',
              transition: 'all 0.8s cubic-bezier(0.22,1,0.36,1) 250ms' }}>
            Join the{' '}
            <span style={{ background: 'linear-gradient(135deg, #2DD4BF, #8B7CFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Knowledge Hub
            </span>
          </h1>

          <p className="text-white/55 text-lg leading-relaxed mb-10"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-40px)', transition: 'all 0.7s cubic-bezier(0.22,1,0.36,1) 350ms' }}>
            Create your account and start collaborating on shared learning journeys.
          </p>

          <div className="space-y-4"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.7s cubic-bezier(0.22,1,0.36,1) 450ms' }}>
            {perks.map((perk, i) => (
              <div key={perk} className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-white/5"
                style={{ transitionDelay: `${i * 60}ms` }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(0,191,166,0.25)', border: '1px solid rgba(0,191,166,0.3)' }}>
                  <CheckCircle2 size={13} style={{ color: '#2DD4BF' }} />
                </div>
                <span className="text-sm text-white/75">{perk}</span>
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
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 bg-[#F8FAFC] dark:bg-background relative overflow-y-auto">
        {/* Subtle blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,191,166,0.08) 0%, transparent 70%)', transform: 'translate(-30%, -30%)' }} />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(91,75,255,0.08) 0%, transparent 70%)', transform: 'translate(30%, 30%)' }} />

        <div className="w-full max-w-md z-10 py-8 page-enter">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg text-white" style={{ background: GRAD }}>A</div>
            <span className="text-xl font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>AKMP</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#0F172A] dark:text-foreground mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Create an account ✨
            </h2>
            <p className="text-[#475569] dark:text-muted-foreground">Enter your details to get started</p>
          </div>

          {error && (
            <div className="mb-5 p-4 rounded-2xl text-sm font-medium flex items-center gap-2.5 animate-fade-in"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#DC2626' }}
              role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}
          {success && (
            <div className="mb-5 p-4 rounded-2xl text-sm font-medium flex items-center gap-2.5 animate-fade-in"
              style={{ background: 'rgba(0,191,166,0.08)', border: '1px solid rgba(0,191,166,0.2)', color: '#00897B' }}
              role="status">
              <CheckCircle2 size={16} />
              Account created! Redirecting to sign in…
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4" aria-label="Create account form">
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-sm font-semibold text-[#0F172A] dark:text-foreground">Username</Label>
              <Input id="username" type="text" placeholder="Choose a username" value={username}
                onChange={(e) => setUsername(e.target.value)} required autoComplete="username"
                className="h-12 rounded-2xl border-[#E2E8F0] bg-white dark:bg-card text-sm shadow-sm transition-all" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-semibold text-[#0F172A] dark:text-foreground">Email Address</Label>
              <Input id="email" type="email" placeholder="name@example.com" value={email}
                onChange={(e) => setEmail(e.target.value)} required autoComplete="email"
                className="h-12 rounded-2xl border-[#E2E8F0] bg-white dark:bg-card text-sm shadow-sm transition-all" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-semibold text-[#0F172A] dark:text-foreground">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Create a strong password"
                  value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password"
                  className="h-12 rounded-2xl border-[#E2E8F0] bg-white dark:bg-card text-sm shadow-sm pr-12 transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-foreground transition-colors p-1 rounded-lg"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="role" className="text-sm font-semibold text-[#0F172A] dark:text-foreground">Account Type</Label>
              <select id="role" value={role} onChange={(e) => setRole(e.target.value)}
                className="flex h-12 w-full rounded-2xl border border-[#E2E8F0] bg-white dark:bg-card px-4 py-2 text-sm text-[#0F172A] dark:text-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:border-[#5B4BFF]"
                style={{ '--tw-ring-color': 'rgba(91,75,255,0.15)' }}>
                <option value="USER">User – Standard access</option>
                <option value="MEMBER">Member – Extended access</option>
                <option value="ADMIN">Admin – Full access</option>
              </select>
            </div>

            <button type="submit" id="signup-submit-btn" disabled={isLoading || success}
              className="shine-on-hover w-full h-12 rounded-2xl text-sm font-semibold text-white transition-all duration-300 btn-glow disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              style={{ background: (isLoading || success) ? '#64748B' : GRAD }}>
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="spinner w-4 h-4" />
                  Creating account…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Create account <ArrowRight size={16} />
                </span>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[#475569] mt-6">
            Already have an account?{' '}
            <Link to="/login" id="login-link" className="font-semibold transition-colors hover:opacity-80" style={{ color: PRIMARY }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

