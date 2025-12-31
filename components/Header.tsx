import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, X, Sun, Moon, Laptop, LogIn } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
    onSignIn: () => void;
    onGetStarted: () => void;
}

export function Header({ onSignIn, onGetStarted }: HeaderProps) {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
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

    const navLinks = [
        { label: 'Features', href: '/#features' },
        { label: 'Courses', href: '/courses' },
        { label: 'How it Works', href: '/#how-it-works' },
        { label: 'Pricing', href: '/pricing' },
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
                    <div className="p-2 bg-gradient-to-tr from-primary to-secondary rounded-xl text-white shadow-lg group-hover:scale-105 transition-transform">
                        <GraduationCap size={24} />
                    </div>
                    <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                        MyEnglish.lk
                    </span>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        link.href.startsWith('/#') ? (
                            <a
                                key={link.label}
                                href={link.href}
                                className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
                            >
                                {link.label}
                            </a>
                        ) : (
                            <button
                                key={link.label}
                                onClick={() => navigate(link.href)}
                                className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors bg-transparent border-none p-0 cursor-pointer"
                            >
                                {link.label}
                            </button>
                        )
                    ))}
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    {/* Theme Toggle - Compact */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary rounded-full transition-all"
                        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>

                    <div className="h-6 w-px bg-border/50" />

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
                        link.href.startsWith('/#') ? (
                            <a
                                key={link.label}
                                href={link.href}
                                className="px-4 py-3 rounded-xl hover:bg-secondary text-foreground font-medium transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.label}
                            </a>
                        ) : (
                            <button
                                key={link.label}
                                onClick={() => {
                                    navigate(link.href);
                                    setIsMobileMenuOpen(false);
                                }}
                                className="px-4 py-3 rounded-xl hover:bg-secondary text-foreground font-medium transition-colors text-left"
                            >
                                {link.label}
                            </button>
                        )
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
                </div>
            )}
        </header>
    );
}
