import React, { useState } from 'react';
import {
    GraduationCap, Mail, Facebook, Twitter, Linkedin,
    Instagram, Youtube, Send
} from 'lucide-react';

interface FooterProps {
    onNavigate?: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setTimeout(() => {
                setEmail('');
                setSubscribed(false);
            }, 3000);
        }
    };

    const footerSections = {
        company: [
            { name: 'About Us', href: '/about' },
            { name: 'Careers', href: '/careers' },
            { name: 'Press', href: '/press' },
            { name: 'Blog', href: '/blog' },
        ],
        learn: [
            { name: 'All Courses', href: '/courses' },
            { name: 'Learning Paths', href: '/paths' },
            { name: 'Exam Prep', href: '/exam-prep' },
            { name: 'Business English', href: '/business-english' },
        ],
        support: [
            { name: 'Help Center', href: '/help' },
            { name: 'Contact Us', href: '/contact' },
            { name: 'Community', href: '/community' },
            { name: 'System Status', href: '/status' },
        ],
        legal: [
            { name: 'Terms of Service', href: '/terms' },
            { name: 'Privacy Policy', href: '/privacy' },
            { name: 'Cookie Policy', href: '/cookies' },
            { name: 'Accessibility', href: '/accessibility' },
        ],
    };

    const socialLinks = [
        { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com', color: 'hover:text-blue-600' },
        { name: 'Twitter', icon: Twitter, href: 'https://twitter.com', color: 'hover:text-sky-500' },
        { name: 'Facebook', icon: Facebook, href: 'https://facebook.com', color: 'hover:text-blue-700' },
        { name: 'Instagram', icon: Instagram, href: 'https://instagram.com', color: 'hover:text-pink-600' },
        { name: 'YouTube', icon: Youtube, href: 'https://youtube.com', color: 'hover:text-red-600' },
    ];

    return (
        <footer className="bg-muted/50 border-t border-border">
            {/* Newsletter Section */}
            <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl mx-auto text-center">
                        <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-foreground mb-2">
                            Get Weekly English Tips & Exclusive Offers
                        </h3>
                        <p className="text-muted-foreground mb-6">
                            Join 50,000+ learners receiving expert tips, study resources, and special discounts
                        </p>

                        <form onSubmit={handleSubscribe} className="flex gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
                            >
                                <Send size={18} />
                                <span className="hidden sm:inline">Subscribe</span>
                            </button>
                        </form>

                        {subscribed && (
                            <p className="mt-4 text-sm text-secondary font-medium">
                                ✓ Thank you for subscribing! Check your inbox for a welcome email.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-4 lg:col-span-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-tr from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                                <GraduationCap size={28} className="text-white" />
                            </div>
                            <div>
                                <div className="text-xl font-black text-primary">MyEnglish</div>
                                <div className="text-xs text-muted-foreground font-medium">.lk</div>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-6">
                            Master English, Unlock Opportunities. AI-powered learning for everyone.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground ${social.color} transition-all hover:scale-110`}
                                    aria-label={social.name}
                                >
                                    <social.icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-bold text-foreground mb-4">Company</h4>
                        <ul className="space-y-3">
                            {footerSections.company.map((link) => (
                                <li key={link.name}>
                                    <button
                                        onClick={() => onNavigate?.(link.href)}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {link.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Learn */}
                    <div>
                        <h4 className="font-bold text-foreground mb-4">Learn</h4>
                        <ul className="space-y-3">
                            {footerSections.learn.map((link) => (
                                <li key={link.name}>
                                    <button
                                        onClick={() => onNavigate?.(link.href)}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {link.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-bold text-foreground mb-4">Support</h4>
                        <ul className="space-y-3">
                            {footerSections.support.map((link) => (
                                <li key={link.name}>
                                    <button
                                        onClick={() => onNavigate?.(link.href)}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {link.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-bold text-foreground mb-4">Legal</h4>
                        <ul className="space-y-3">
                            {footerSections.legal.map((link) => (
                                <li key={link.name}>
                                    <button
                                        onClick={() => onNavigate?.(link.href)}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {link.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © 2025 MyEnglish.lk. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span>Made with ❤️ for English learners worldwide</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
