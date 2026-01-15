import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Successful login
            localStorage.setItem('myenglish_token', 'logged_in'); // Simple flag or token
            localStorage.setItem('myenglish_userName', data.user.username);
            localStorage.setItem('myenglish_userEmail', data.user.email);

            if (data.user.avatar_url) {
                localStorage.setItem('myenglish_avatarUrl', data.user.avatar_url);
            }
            // Store subscription info
            localStorage.setItem('myenglish_subscriptionStatus', data.user.subscription_status || 'free');
            localStorage.setItem('myenglish_trialEndAt', data.user.trial_end_at || '');
            localStorage.setItem('myenglish_proEndAt', data.user.pro_end_at || '');

            navigate('/dashboard');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-60" />

            <button
                onClick={() => navigate('/')}
                className="absolute top-8 left-8 p-2 text-muted-foreground hover:text-foreground transition-colors z-20 flex items-center gap-2 font-medium"
            >
                <ArrowRight className="rotate-180" size={20} />
                Back to Home
            </button>

            <div className="w-full max-w-[420px] bg-card border border-border rounded-3xl p-8 sm:p-10 shadow-2xl shadow-primary/5 relative z-10 transition-all">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl text-primary mb-6">
                        <Lock size={24} />
                    </div>
                    <h1 className="text-3xl font-black text-foreground mb-2 tracking-tight">Welcome Back</h1>
                    <p className="text-muted-foreground">Sign in to continue your progress</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                        <AlertCircle size={18} className="mt-0.5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Email</label>
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-4 pr-10 py-3 bg-muted/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl outline-none font-medium transition-all"
                                placeholder="name@example.com"
                                required
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                                <Mail size={18} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-foreground">Password</label>
                            <a href="#" className="text-xs font-medium text-primary hover:text-primary/80">Forgot password?</a>
                        </div>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-4 pr-10 py-3 bg-muted/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl outline-none font-medium transition-all"
                                placeholder="••••••••"
                                required
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                                <Lock size={18} />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <button
                            onClick={() => navigate('/signup')}
                            className="text-primary hover:text-primary/80 font-bold transition-colors"
                        >
                            Create account
                        </button>
                    </p>
                </div>
            </div>

            <p className="mt-8 text-xs text-muted-foreground text-center">
                &copy; {new Date().getFullYear()} MyEnglish.lk. Protected by reCAPTCHA and subject to the Privacy Policy and Terms of Service.
            </p>
        </div>
    );
}
