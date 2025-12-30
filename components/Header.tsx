import React, { useState } from 'react';
import {
    GraduationCap, Menu, X, BookOpen, Target, Users,
    MessageSquare, BarChart3, User, LogOut, Settings
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
    isAuthenticated?: boolean;
    userName?: string;
    onLogin?: () => void;
    onSignup?: () => void;
    onLogout?: () => void;
    onNavigate?: (page: string) => void;
}

export function Header({
    isAuthenticated = false,
    userName,
    onLogin,
    onSignup,
    onLogout,
    onNavigate
}: HeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    const navigation = [
        { name: 'Courses', href: '/courses', icon: BookOpen },
        { name: 'Speaking Practice', href: '/speaking', icon: MessageSquare },
        { name: 'Exam Prep', href: '/exam-prep', icon: Target },
        { name: 'Community', href: '/community', icon: Users },
    ];

    return (
        <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-xl border-b border-border shadow-sm">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate?.('home')}>
                        <div className="w-12 h-12 bg-gradient-to-tr from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                            <GraduationCap size={28} className="text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <div className="text-2xl font-black text-primary">MyEnglish</div>
                            <div className="text-xs text-muted-foreground font-medium -mt-1">.lk</div>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navigation.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => onNavigate?.(item.href)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-foreground hover:bg-muted transition-all font-medium"
                            >
                                <item.icon size={18} />
                                <span>{item.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {isAuthenticated ? (
                            /* Authenticated User Menu */
                            <div className="relative">
                                <button
                                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                    className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-muted transition-all"
                                >
                                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                                        {userName?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <span className="hidden md:block font-medium text-foreground">{userName || 'User'}</span>
                                </button>

                                {/* Profile Dropdown */}
                                {profileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-64 bg-card rounded-2xl shadow-2xl border border-border p-2">
                                        <div className="px-4 py-3 border-b border-border">
                                            <div className="font-bold text-foreground">{userName || 'User'}</div>
                                            <div className="text-sm text-muted-foreground">Free Plan</div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                onNavigate?.('/dashboard');
                                                setProfileMenuOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-all text-left"
                                        >
                                            <BarChart3 size={18} />
                                            <span>Dashboard</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                onNavigate?.('/settings');
                                                setProfileMenuOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-all text-left"
                                        >
                                            <Settings size={18} />
                                            <span>Settings</span>
                                        </button>
                                        <div className="border-t border-border my-2" />
                                        <button
                                            onClick={() => {
                                                onLogout?.();
                                                setProfileMenuOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-all text-left"
                                        >
                                            <LogOut size={18} />
                                            <span>Log Out</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Guest Actions */
                            <div className="hidden md:flex items-center gap-3">
                                <button
                                    onClick={onLogin}
                                    className="px-6 py-2.5 rounded-xl font-semibold text-foreground hover:bg-muted transition-all"
                                >
                                    Log In
                                </button>
                                <button
                                    onClick={onSignup}
                                    className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold shadow-lg shadow-primary/20 transition-all"
                                >
                                    Sign Up Free
                                </button>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 rounded-xl hover:bg-muted transition-all"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden py-4 border-t border-border">
                        <div className="space-y-1">
                            {navigation.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => {
                                        onNavigate?.(item.href);
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-muted transition-all font-medium text-left"
                                >
                                    <item.icon size={20} />
                                    <span>{item.name}</span>
                                </button>
                            ))}
                        </div>

                        {!isAuthenticated && (
                            <div className="mt-4 pt-4 border-t border-border space-y-2">
                                <button
                                    onClick={() => {
                                        onLogin?.();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full px-6 py-3 rounded-xl font-semibold text-foreground hover:bg-muted transition-all"
                                >
                                    Log In
                                </button>
                                <button
                                    onClick={() => {
                                        onSignup?.();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold shadow-lg shadow-primary/20 transition-all"
                                >
                                    Sign Up Free
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </nav>
        </header>
    );
}
