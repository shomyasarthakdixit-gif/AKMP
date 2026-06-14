import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:8000/api/v1/auth/signin', {
        username,
        password
      });
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('email', res.data.email);
      localStorage.setItem('role', res.data.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full animate-in fade-in duration-700">
      {/* Left Panel - Branding & Illustration */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-slate-900 p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-blue-900 to-slate-900 z-0"></div>
        
        {/* Animated decorative blobs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse delay-700"></div>

        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-20 z-0" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

        <div className="relative z-10 flex items-center gap-3 slide-in-from-left-4 duration-500 delay-100 fill-mode-both animate-in fade-in">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white to-blue-100 text-primary flex items-center justify-center font-bold text-2xl shadow-lg">
            A
          </div>
          <span className="text-2xl font-bold tracking-tight">Access Portal</span>
        </div>

        <div className="relative z-10 max-w-lg mb-20 slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both animate-in fade-in">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
            Manage your knowledge <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">efficiently.</span>
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed border-l-4 border-blue-400 pl-4">
            A centralized platform for organizing, sharing, and discovering critical documents and categories within your enterprise.
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between text-sm text-blue-200/80 animate-in fade-in duration-1000 delay-500 fill-mode-both">
          <span>© 2026 Access Knowledge Management Portal</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background relative overflow-hidden">
        {/* Decorative subtle background circle */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>

        <div className="w-full max-w-md space-y-8 z-10 slide-in-from-bottom-8 duration-500 delay-100 fill-mode-both animate-in fade-in">
          <div className="text-center lg:text-left">
            <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-600 text-primary-foreground flex items-center justify-center font-bold text-2xl shadow-md">
                A
              </div>
              <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Access Portal</span>
            </div>
            
            <h2 className="text-4xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-muted-foreground mt-3 text-lg">Sign in to your account to continue</p>
          </div>
          
          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm font-medium border border-destructive/20 animate-in shake">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6 bg-card/50 p-6 md:p-8 rounded-2xl border border-border shadow-sm backdrop-blur-sm">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-semibold">Username</Label>
              <Input 
                id="username"
                type="text" 
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
                className="h-12 bg-background border-input focus:border-primary focus:ring-primary/20 transition-all rounded-xl"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
                <a href="#" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">Forgot password?</a>
              </div>
              <Input 
                id="password"
                type="password" 
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="h-12 bg-background border-input focus:border-primary focus:ring-primary/20 transition-all rounded-xl"
              />
            </div>
            
            <Button type="submit" className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all rounded-xl" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-primary hover:text-primary/80 transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
