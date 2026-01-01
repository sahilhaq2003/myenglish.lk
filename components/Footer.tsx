import React from 'react';
import { NavLink } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, GraduationCap } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-card border-t border-border pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-gradient-to-tr from-primary to-secondary rounded-xl text-white shadow-lg">
                                <GraduationCap size={24} />
                            </div>
                            <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                                MyEnglish.lk
                            </span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Empowering learners worldwide with AI-driven English education. Join the future of language learning today.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 bg-secondary hover:bg-primary hover:text-white rounded-full flex items-center justify-center transition-all text-muted-foreground"
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-foreground text-lg mb-6">Platform</h4>
                        <ul className="space-y-4">
                            {['Features', 'Courses', 'Pricing', 'Success Stories', 'For Business'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-bold text-foreground text-lg mb-6">Resources</h4>
                        <ul className="space-y-4">
                            {['Blog', 'Community', 'Grammar Guide', 'Vocabulary List', 'Help Center'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-foreground text-lg mb-6">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-muted-foreground">
                                <Mail size={20} className="text-primary mt-1 shrink-0" />
                                <span>sahilhaq2003@gmail.com</span>
                            </li>
                            <li className="flex items-start gap-3 text-muted-foreground">
                                <Phone size={20} className="text-primary mt-1 shrink-0" />
                                <span>0767589002</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                    <p className="text-sm text-muted-foreground font-medium">
                        © {new Date().getFullYear()} MyEnglish.lk. All rights reserved.
                    </p>
                    <div className="flex gap-8 text-sm text-muted-foreground font-medium">
                        <NavLink to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</NavLink>
                        <NavLink to="/terms" className="hover:text-primary transition-colors">Terms of Service</NavLink>
                        <NavLink to="/cookies" className="hover:text-primary transition-colors">Cookie Policy</NavLink>
                    </div>
                </div>
            </div>
        </footer>
    );
}
