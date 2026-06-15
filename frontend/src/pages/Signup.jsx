import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, CheckCircle2, Sparkles } from 'lucide-react';

const GRAD = 'linear-gradient(135deg, #6366F1 0%, #60A5FA 100%)';
const INDIGO = '#6366F1';

const perks = [
  'Access to all course materials',
  'Collaborate with your team',
  'Personalised dashboard & reviews',
  'Role-based, secure access control',
];

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:8002/api/v1/auth/signup', { username, email, password, role });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden p-12 text-white"
        style={{ background: 'linear-gradient(160deg, #0F172A 0%, #0c1a3a 50%, #1e1b4b 100%)' }}>
        <div className="absolute top-[-60px] right-[-60px] w-80 h-80 rounded-full opacity-20 animate-float-slow"
          style={{ background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-80px] left-[-60px] w-72 h-72 rounded-full opacity-20 animate-float-medium"
          style={{ background: 'radial-gradient(circle, #F97316 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg" style={{ background: GRAD }}>A</div>
          <div>
            <span className="text-lg font-bold tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>AKMP</span>
            <p className="text-white/40 text-xs">Knowledge Management Portal</p>
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{ background: 'rgba(6,182,212,0.2)', border: '1px solid rgba(6,182,212,0.4)', color: '#67E8F9' }}>
            <Sparkles size={12} />
            Join 500+ learners today
          </div>
          <h1 className="text-5xl font-extrabold mb-5 leading-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
            Join the{' '}
            <span className="gradient-text">Knowledge Hub</span>
          </h1>
          <p className="text-white/55 text-lg leading-relaxed mb-10">
            Create your account and start collaborating on shared learning journeys.
          </p>
          <div className="space-y-3">
            {perks.map(perk => (
              <div key={perk} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(6,182,212,0.25)' }}>
                  <CheckCircle2 size={12} style={{ color: '#67E8F9' }} />
                </div>
                <span className="text-sm text-white/70">{perk}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-white/25">
          <span>© 2026 AKMP. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 bg-[#FAFAFB] dark:bg-background relative overflow-y-auto">
        <div className="absolute top-0 left-0 w-72 h-72 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 70%)', transform: 'translate(-30%, -30%)' }} />

        <div className="w-full max-w-md z-10 py-8 page-enter">
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg text-white" style={{ background: GRAD }}>A</div>
            <span className="text-xl font-bold" style={{ fontFamily: "'Sora', sans-serif" }}>AKMP</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#0F172A] dark:text-foreground mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>
              Create an account ✨
            </h2>
            <p className="text-[#64748B] dark:text-muted-foreground">Enter your details to get started</p>
          </div>

          {error && (
            <div className="mb-5 p-4 rounded-xl text-sm font-medium flex items-center gap-2.5 animate-in slide-in-from-top-2 duration-300"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#DC2626' }}
              role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}
          {success && (
            <div className="mb-5 p-4 rounded-xl text-sm font-medium flex items-center gap-2.5 animate-in slide-in-from-top-2 duration-300"
              style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', color: '#0891B2' }}
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
                className="h-12 rounded-xl border-[#E5E7EB] bg-white dark:bg-[#1E293B] text-sm shadow-sm transition-all" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-semibold text-[#0F172A] dark:text-foreground">Email Address</Label>
              <Input id="email" type="email" placeholder="name@example.com" value={email}
                onChange={(e) => setEmail(e.target.value)} required autoComplete="email"
                className="h-12 rounded-xl border-[#E5E7EB] bg-white dark:bg-[#1E293B] text-sm shadow-sm transition-all" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-semibold text-[#0F172A] dark:text-foreground">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Create a strong password"
                  value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password"
                  className="h-12 rounded-xl border-[#E5E7EB] bg-white dark:bg-[#1E293B] text-sm shadow-sm pr-12 transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A] transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="role" className="text-sm font-semibold text-[#0F172A] dark:text-foreground">Account Type</Label>
              <select id="role" value={role} onChange={(e) => setRole(e.target.value)}
                className="flex h-12 w-full rounded-xl border border-[#E5E7EB] bg-white dark:bg-[#1E293B] px-3 py-2 text-sm text-[#0F172A] dark:text-foreground shadow-sm transition-all focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': 'rgba(79,70,229,0.2)' }}>
                <option value="USER">User – Standard access</option>
                <option value="MEMBER">Member – Extended access</option>
                <option value="ADMIN">Admin – Full access</option>
              </select>
            </div>
            <button type="submit" disabled={isLoading || success}
              className="shine-on-hover w-full h-12 rounded-xl text-sm font-semibold text-white transition-all duration-200 btn-glow disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              style={{ background: (isLoading || success) ? '#64748B' : GRAD }}>
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : 'Create account →'}
            </button>
          </form>

          <p className="text-center text-sm text-[#64748B] mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold transition-colors" style={{ color: INDIGO }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}


