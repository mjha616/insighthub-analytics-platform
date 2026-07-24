import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { TrendingUp, KeyRound, Sparkles } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      showToast('Your session has expired. Please log in again.', 'warning');
    }
  }, [searchParams, showToast]);

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email format is invalid.';
    }
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    try {
      await login(email, password);
      showToast('Welcome back to InsightHub!', 'success');
      navigate('/home');
    } catch (err) {
      showToast(err.message || 'Login failed. Check your credentials.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950 bg-dot-grid relative">
      {/* Decorative subtle ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-500/5 dark:bg-brand-500/10 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="w-full max-w-[400px] relative z-10">
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="h-9 w-9 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center mb-3">
            <TrendingUp className="h-4.5 w-4.5 text-white dark:text-zinc-950" />
          </div>
          <h2 className="text-lg font-bold font-display text-zinc-900 dark:text-white tracking-tight">
            InsightHub
          </h2>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
            Data Profiling & Aggregation Engine
          </p>
        </div>
        
        <Card className="p-6 bg-white dark:bg-zinc-900 shadow-premium-lg border border-zinc-200 dark:border-zinc-800">
          <CardHeader className="text-center pb-2 border-none">
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter credentials to access your data workspaces</CardDescription>
          </CardHeader>
          
          <CardContent className="mt-2">
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="name@company.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />
              
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
              />
              
              <Button
                type="submit"
                variant="primary"
                className="w-full mt-2"
                isLoading={isLoading}
              >
                Sign In
              </Button>
            </form>
            
            <div className="text-center mt-5">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
