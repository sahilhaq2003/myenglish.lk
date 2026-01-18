import React, { useEffect } from 'react';
import { Shield, FileText, Cookie, X, Calendar } from 'lucide-react';

type LegalType = 'privacy' | 'terms' | 'cookie' | null;

interface LegalModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: LegalType;
}

export function LegalModal({ isOpen, onClose, type }: LegalModalProps) {
    if (!isOpen || !type) return null;

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto'; // Force auto which is default
        }
        return () => {
            document.body.style.overflow = 'auto'; // Ensure cleanup restores scrolling
        };
    }, [isOpen]);

    const getContent = () => {
        switch (type) {
            case 'privacy':
                return {
                    icon: Shield,
                    title: 'Privacy Policy',
                    content: (
                        <div className="space-y-6">
                            <section>
                                <h3 className="text-lg font-bold text-foreground mb-2">1. Introduction</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Welcome to MyEnglish.lk ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered English learning platform.
                                </p>
                            </section>
                            <section>
                                <h3 className="text-lg font-bold text-foreground mb-2">2. Information We Collect</h3>
                                <p className="text-muted-foreground mb-2">We collect information that you provide directly to us, including:</p>
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                                    <li>Name and email address</li>
                                    <li>Profile information (learning goals, preferences)</li>
                                    <li>Account credentials</li>
                                    <li>Payment information</li>
                                </ul>
                                <p className="text-muted-foreground mt-4 mb-2">To provide personalized learning experiences, we collect:</p>
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                                    <li>Voice recordings during practice sessions</li>
                                    <li>Text responses and exercises</li>
                                    <li>Progress metrics and assessment results</li>
                                </ul>
                            </section>
                            <section>
                                <h3 className="text-lg font-bold text-foreground mb-2">3. How We Use Your Information</h3>
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                                    <li>Providing and personalizing our AI-powered learning services</li>
                                    <li>Processing your assessments and generating customized learning paths</li>
                                    <li>Improving our AI models and teaching methodologies</li>
                                    <li>Communicating with you about your account and updates</li>
                                </ul>
                            </section>
                            <section>
                                <h3 className="text-lg font-bold text-foreground mb-2">4. AI and Voice Data</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Our platform uses Google's Gemini AI for voice interactions. Voice recordings are processed in real-time, may be temporarily stored for quality, and are encrypted. You can request deletion of your voice data.
                                </p>
                            </section>
                            <section>
                                <h3 className="text-lg font-bold text-foreground mb-2">5. Data Retention</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    We retain personal info as long as necessary. Learning data is retained to maintain your experience unless deletion is requested. Voice recordings are typically retained for 90 days.
                                </p>
                            </section>
                            <section>
                                <h3 className="text-lg font-bold text-foreground mb-2">6. Contact Us</h3>
                                <p className="text-muted-foreground">Email: sahilhaq2003@gmail.com</p>
                            </section>
                        </div>
                    )
                };
            case 'terms':
                return {
                    icon: FileText,
                    title: 'Terms of Service',
                    content: (
                        <div className="space-y-6">
                            <section>
                                <h3 className="text-lg font-bold text-foreground mb-2">1. Agreement to Terms</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    By accessing MyEnglish.lk, you agree to these Terms. If you do not agree, please do not use our Platform.
                                </p>
                            </section>
                            <section>
                                <h3 className="text-lg font-bold text-foreground mb-2">2. Eligibility</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    You must be at least 13 years old. If under 18, you need parental consent.
                                </p>
                            </section>
                            <section>
                                <h3 className="text-lg font-bold text-foreground mb-2">3. User Accounts</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    You are responsible for maintaining the confidentiality of your account. You must provide accurate registration information.
                                </p>
                            </section>
                            <section>
                                <h3 className="text-lg font-bold text-foreground mb-2">4. Services & Subscriptions</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    We offer Free and Pro plans. We reserve the right to modify services at any time.
                                </p>
                            </section>
                            <section>
                                <h3 className="text-lg font-bold text-foreground mb-2">5. Refund Policy</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    <strong>All sales are final.</strong> We do not offer refunds for subscription purchases. Please use the free plan to evaluate the service first.
                                </p>
                            </section>
                            <section>
                                <h3 className="text-lg font-bold text-foreground mb-2">6. Artificial Intelligence</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Our platform uses AI. While we strive for accuracy, AI content may contain errors and should not replace professional instruction.
                                </p>
                            </section>
                            <section>
                                <h3 className="text-lg font-bold text-foreground mb-2">7. Contact</h3>
                                <p className="text-muted-foreground">Email: sahilhaq2003@gmail.com</p>
                            </section>
                        </div>
                    )
                };
            case 'cookie':
                return {
                    icon: Cookie,
                    title: 'Cookie Policy',
                    content: (
                        <div className="space-y-6">
                            <section>
                                <h3 className="text-lg font-bold text-foreground mb-2">1. What Are Cookies?</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Cookies are small text files placed on your device to make websites work efficiently and provide information to owners.
                                </p>
                            </section>
                            <section>
                                <h3 className="text-lg font-bold text-foreground mb-2">2. How We Use Cookies</h3>
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                                    <li>Keep you logged in</li>
                                    <li>Remember preferences</li>
                                    <li>Provide personalized learning</li>
                                    <li>Analyze platform usage</li>
                                </ul>
                            </section>
                            <section>
                                <h3 className="text-lg font-bold text-foreground mb-2">3. Types of Cookies</h3>
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                                    <li><strong>Essential:</strong> For login and security. Cannot be disabled.</li>
                                    <li><strong>Functional:</strong> For preferences and learning data.</li>
                                    <li><strong>Analytics:</strong> To understand user behavior.</li>
                                </ul>
                            </section>
                            <section>
                                <h3 className="text-lg font-bold text-foreground mb-2">4. Third-Party Cookies</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    We use Google Analytics, Google AI, and payment processors which may set their own cookies.
                                </p>
                            </section>
                            <section>
                                <h3 className="text-lg font-bold text-foreground mb-2">5. Managing Cookies</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Most browsers allow you to control cookies through settings. Disabling essential cookies may break functionality.
                                </p>
                            </section>
                        </div>
                    )
                };
            default:
                return null;
        }
    };

    const data = getContent();
    if (!data) return null;

    const Icon = data.icon;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative bg-background w-full max-w-2xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-border flex items-center justify-between shrink-0 bg-muted/30 rounded-t-3xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Icon className="text-primary" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-foreground">{data.title}</h2>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar size={12} />
                                <span>Updated: Jan 1, 2026</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                    >
                        <X size={20} className="text-muted-foreground" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {data.content}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border bg-muted/30 rounded-b-3xl shrink-0 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
