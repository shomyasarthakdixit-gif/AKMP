import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:8000/api/v1/auth/signup', {
        username,
        email,
        password,
        role
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full animate-in fade-in duration-700">
      {/* Left Panel - Branding & Illustration */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-slate-900 p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-blue-900 to-slate-800 z-0"></div>
        
        {/* Animated decorative blobs */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-blue-500/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse delay-700"></div>

        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-20 z-0" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

        <div className="relative z-10 flex items-center gap-3 slide-in-from-left-4 duration-500 delay-100 fill-mode-both animate-in fade-in">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white to-blue-100 text-slate-900 flex items-center justify-center font-bold text-2xl shadow-lg">
            A
          </div>
          <span className="text-2xl font-bold tracking-tight">Access Portal</span>
        </div>

        <div className="relative z-10 max-w-lg mb-20 slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both animate-in fade-in">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">knowledge hub.</span>
          </h1>
          <p className="text-slate-200 text-lg leading-relaxed border-l-4 border-emerald-400 pl-4">
            Create an account to start discovering documents, connecting with team members, and contributing to your organization's success.
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between text-sm text-slate-400 animate-in fade-in duration-1000 delay-500 fill-mode-both">
          <span>© 2026 Access Knowledge Management Portal</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background overflow-y-auto relative">
        {/* Decorative subtle background circle */}
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>

        <div className="w-full max-w-md space-y-8 my-auto z-10 slide-in-from-bottom-8 duration-500 delay-100 fill-mode-both animate-in fade-in">
          <div className="text-center lg:text-left pt-8 lg:pt-0">
            <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-600 text-primary-foreground flex items-center justify-center font-bold text-2xl shadow-md">
                A
              </div>
              <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Access Portal</span>
            </div>
            
            <h2 className="text-4xl font-bold tracking-tight">Create an account</h2>
            <p className="text-muted-foreground mt-3 text-lg">Enter your details to get started</p>
          </div>
          
          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm font-medium border border-destructive/20 animate-in shake">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-success/10 text-success rounded-lg text-sm font-medium border border-success/20 animate-in slide-in-from-top-2">
              Account created successfully! Redirecting to login...
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5 bg-card/50 p-6 md:p-8 rounded-2xl border border-border shadow-sm backdrop-blur-sm">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-semibold">Username</Label>
              <Input 
                id="username"
                type="text" 
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
                className="h-12 bg-background border-input focus:border-primary focus:ring-primary/20 transition-all rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
              <Input 
                id="email"
                type="email" 
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="h-12 bg-background border-input focus:border-primary focus:ring-primary/20 transition-all rounded-xl"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
              <Input 
                id="password"
                type="password" 
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="h-12 bg-background border-input focus:border-primary focus:ring-primary/20 transition-all rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-semibold">Account Type</Label>
              <select 
                id="role"
                className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="USER">User</option>
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            
            <Button type="submit" className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all rounded-xl mt-4" disabled={isLoading || success}>
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
          
          <div className="text-center text-sm text-muted-foreground pb-8 lg:pb-0">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
