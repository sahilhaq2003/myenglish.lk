import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, X, Sun, Moon, Laptop, LogIn } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
    onSignIn: () => void;
    onGetStarted: () => void;
    onExploreCourses?: () => void;
}

export function Header({ onSignIn, onGetStarted, onExploreCourses }: HeaderProps) {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();

    // Default handler if not provided
    const handleExploreCourses = onExploreCourses || (() => navigate('/courses'));
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (href: string) => {
        if (href.startsWith('/#')) {
            // If we're on home page, scroll to section
            if (window.location.pathname === '/') {
                const sectionId = href.substring(2); // Remove '/#'
                const element = document.getElementById(sectionId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                // Navigate to home page with hash
                navigate('/');
                setTimeout(() => {
                    const sectionId = href.substring(2);
                    const element = document.getElementById(sectionId);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
            }
        } else {
            // Scroll to top when navigating to a new page
            window.scrollTo({ top: 0, behavior: 'instant' });
            navigate(href);
        }
    };

    const navLinks = [
        { label: 'Home', href: '/#hero' },
        { label: 'Features', href: '/#features' },
        { label: 'Courses', href: '/#courses' },
        { label: 'Pricing', href: '/#pricing' },
    ];

    const toggleTheme = () => {
        if (theme === 'light') setTheme('dark');
        else setTheme('light');
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-background/80 backdrop-blur-md border-b border-border py-4 shadow-sm'
                : 'bg-transparent py-6'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
                {/* Logo */}
                <div
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 cursor-pointer group"
                >
                    <img
                        src="/logo.png"
                        alt="MyEnglish.lk Logo"
                        className="w-10 h-10 rounded-xl shadow-lg group-hover:scale-105 transition-transform"
                    />
                    <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                        MyEnglish.lk
                    </span>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <button
                            key={link.label}
                            onClick={() => handleNavClick(link.href)}
                            className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors bg-transparent border-none p-0 cursor-pointer"
                        >
                            {link.label}
                        </button>
                    ))}
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    {/* Theme Toggle - Compact */}
                    {/* Theme Toggle - 3-State Segmented */}
                    <div className="flex items-center p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-inner">
                        <button
                            onClick={() => setTheme('light')}
                            className={`p-1.5 rounded-full transition-all duration-300 ${theme === 'light'
                                ? 'bg-white text-orange-500 shadow-sm ring-1 ring-black/5 scale-100'
                                : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 scale-90 hover:scale-100'}`}
                            title="Light mode"
                        >
                            <Sun size={16} strokeWidth={2.5} />
                        </button>
                        <button
                            onClick={() => setTheme('system')}
                            className={`p-1.5 rounded-full transition-all duration-300 ${theme === 'system'
                                ? 'bg-white dark:bg-zinc-600 text-blue-500 dark:text-blue-400 shadow-sm ring-1 ring-black/5 dark:ring-white/10 scale-100'
                                : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 scale-90 hover:scale-100'}`}
                            title="System preference"
                        >
                            <Laptop size={16} strokeWidth={2.5} />
                        </button>
                        <button
                            onClick={() => setTheme('dark')}
                            className={`p-1.5 rounded-full transition-all duration-300 ${theme === 'dark'
                                ? 'bg-zinc-700 text-indigo-400 shadow-sm ring-1 ring-white/10 scale-100'
                                : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 scale-90 hover:scale-100'}`}
                            title="Dark mode"
                        >
                            <Moon size={16} strokeWidth={2.5} />
                        </button>
                    </div>

                    <div className="h-6 w-px bg-border/50" />

                    {localStorage.getItem('myenglish_token') === 'logged_in' ? (
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => navigate('/profile')}
                                className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary/20 transition-all overflow-hidden"
                            >
                                <img
                                    src={localStorage.getItem('myenglish_avatarUrl') || `https://ui-avatars.com/api/?name=${localStorage.getItem('myenglish_userName') || 'User'}&background=random`}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={onSignIn}
                                className="text-sm font-bold text-foreground hover:text-primary transition-colors"
                            >
                                Log In
                            </button>

                            <button
                                onClick={onGetStarted}
                                className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold text-sm shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
                            >
                                Get Started
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-foreground"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-background border-b border-border p-4 shadow-2xl md:hidden flex flex-col gap-4 animate-in slide-in-from-top-2">
                    {navLinks.map((link) => (
                        <button
                            key={link.label}
                            onClick={() => {
                                handleNavClick(link.href);
                                setIsMobileMenuOpen(false);
                            }}
                            className="px-4 py-3 rounded-xl hover:bg-secondary text-foreground font-medium transition-colors text-left"
                        >
                            {link.label}
                        </button>
                    ))}
                    <hr className="border-border" />
                    <div className="flex items-center justify-between px-4 py-2">
                        <span className="text-sm font-medium text-muted-foreground">Appearance</span>
                        <div className="flex bg-secondary p-1 rounded-lg">
                            <button
                                onClick={() => setTheme('light')}
                                className={`p-2 rounded-md ${theme === 'light' ? 'bg-background shadow-sm' : ''}`}
                            >
                                <Sun size={16} />
                            </button>
                            <button
                                onClick={() => setTheme('dark')}
                                className={`p-2 rounded-md ${theme === 'dark' ? 'bg-background shadow-sm' : ''}`}
                            >
                                <Moon size={16} />
                            </button>
                            <button
                                onClick={() => setTheme('system')}
                                className={`p-2 rounded-md ${theme === 'system' ? 'bg-background shadow-sm' : ''}`}
                            >
                                <Laptop size={16} />
                            </button>
                        </div>
                    </div>

                    {localStorage.getItem('myenglish_token') === 'logged_in' ? (
                        <>
                            <button
                                onClick={() => { navigate('/dashboard'); setIsMobileMenuOpen(false); }}
                                className="w-full py-3 text-center font-bold text-foreground border border-border rounded-xl hover:bg-secondary transition-colors"
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); }}
                                className="w-full py-3 text-center font-bold text-primary-foreground bg-primary rounded-xl shadow-lg shadow-primary/20"
                            >
                                My Profile
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => { onSignIn(); setIsMobileMenuOpen(false); }}
                                className="w-full py-3 text-center font-bold text-foreground border border-border rounded-xl hover:bg-secondary transition-colors"
                            >
                                Log In
                            </button>
                            <button
                                onClick={() => { onGetStarted(); setIsMobileMenuOpen(false); }}
                                className="w-full py-3 text-center font-bold text-primary-foreground bg-primary rounded-xl shadow-lg shadow-primary/20"
                            >
                                Get Started
                            </button>
                        </>
                    )}
                </div>
            )}
        </header>
    );
}
