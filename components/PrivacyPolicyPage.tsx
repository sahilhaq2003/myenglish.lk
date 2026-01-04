import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Calendar, ArrowLeft } from 'lucide-react';

export function PrivacyPolicyPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background">
            {/* Back Button */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back to Home</span>
                </button>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-primary to-secondary rounded-full mb-6">
                        <Shield className="text-white" size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">
                        Privacy Policy
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Calendar size={16} />
                        <span>Last Updated: January 1, 2026</span>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-8 md:p-12 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Welcome to MyEnglish.lk ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered English learning platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">2. Information We Collect</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-semibold text-foreground mb-2">2.1 Personal Information</h3>
                                <p className="text-muted-foreground leading-relaxed mb-2">
                                    We collect information that you provide directly to us, including:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                    <li>Name and email address</li>
                                    <li>Profile information (learning goals, preferences)</li>
                                    <li>Account credentials</li>
                                    <li>Payment information (processed securely through third-party providers)</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-foreground mb-2">2.2 Learning Data</h3>
                                <p className="text-muted-foreground leading-relaxed mb-2">
                                    To provide personalized learning experiences, we collect:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                    <li>Voice recordings during practice sessions</li>
                                    <li>Text responses and exercises</li>
                                    <li>Progress metrics and assessment results</li>
                                    <li>Learning patterns and performance data</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-foreground mb-2">2.3 Usage Information</h3>
                                <p className="text-muted-foreground leading-relaxed mb-2">
                                    We automatically collect certain information about your device and usage:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                    <li>Device information (browser type, operating system)</li>
                                    <li>IP address and location data</li>
                                    <li>Usage statistics (time spent, features used)</li>
                                    <li>Cookies and similar tracking technologies</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">3. How We Use Your Information</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We use your information for the following purposes:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                            <li>Providing and personalizing our AI-powered learning services</li>
                            <li>Processing your assessments and generating customized learning paths</li>
                            <li>Improving our AI models and teaching methodologies</li>
                            <li>Communicating with you about your account and updates</li>
                            <li>Analyzing usage patterns to enhance user experience</li>
                            <li>Detecting and preventing fraud or security issues</li>
                            <li>Complying with legal obligations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">4. AI and Voice Data Processing</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Our platform uses Google's Gemini AI for voice interactions and assessments:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                            <li>Voice recordings are processed in real-time for immediate feedback</li>
                            <li>Audio data may be temporarily stored for quality improvement</li>
                            <li>We use industry-standard encryption for all voice transmissions</li>
                            <li>You can request deletion of your voice data at any time</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">5. Information Sharing and Disclosure</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We do not sell your personal information. We may share your information in the following circumstances:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                            <li><strong>Service Providers:</strong> Third-party vendors who assist in operating our platform (Google AI, payment processors, hosting services)</li>
                            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                            <li><strong>With Your Consent:</strong> When you explicitly authorize us to share information</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">6. Data Retention</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. Learning data and progress metrics are retained indefinitely to maintain your personalized learning experience, unless you request deletion. Voice recordings are typically retained for 90 days for quality assurance purposes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">7. Your Privacy Rights</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Depending on your location, you may have the following rights:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                            <li><strong>Access:</strong> Request a copy of your personal data</li>
                            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                            <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                            <li><strong>Portability:</strong> Receive your data in a structured format</li>
                            <li><strong>Objection:</strong> Object to certain processing activities</li>
                            <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing</li>
                        </ul>
                        <p className="text-muted-foreground leading-relaxed mt-4">
                            To exercise these rights, please contact us at sahilhaq2003@gmail.com.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">8. Data Security</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We implement industry-standard security measures to protect your information, including encryption, secure servers, and access controls. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">9. Children's Privacy</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Our services are not intended for children under 13 years old. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">10. International Data Transfers</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your data in compliance with applicable laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">11. Changes to This Policy</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on our platform and updating the "Last Updated" date. Your continued use of our services after changes constitutes acceptance of the updated policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">12. Contact Us</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            If you have questions or concerns about this Privacy Policy, please contact us:
                        </p>
                        <div className="bg-secondary/30 rounded-lg p-6 space-y-2">
                            <p className="text-foreground"><strong>Email:</strong> sahilhaq2003@gmail.com</p>

                            <p className="text-foreground"><strong>Address:</strong> MyEnglish.lk, Sri Lanka</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
