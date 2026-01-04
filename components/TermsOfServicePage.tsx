import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, ArrowLeft } from 'lucide-react';

export function TermsOfServicePage() {
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
                        <FileText className="text-white" size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">
                        Terms of Service
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Calendar size={16} />
                        <span>Last Updated: January 1, 2026</span>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-8 md:p-12 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">1. Agreement to Terms</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            By accessing or using MyEnglish.lk ("the Platform," "we," "us," or "our"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Platform. These Terms constitute a legally binding agreement between you and MyEnglish.lk.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">2. Eligibility</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            To use our Platform, you must:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                            <li>Be at least 13 years of age or older</li>
                            <li>Have the legal capacity to enter into a binding contract</li>
                            <li>Provide accurate and complete registration information</li>
                            <li>Comply with all applicable laws and regulations</li>
                        </ul>
                        <p className="text-muted-foreground leading-relaxed mt-4">
                            If you are under 18, you must have parental or guardian consent to use our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">3. User Accounts</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-semibold text-foreground mb-2">3.1 Account Creation</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to immediately notify us of any unauthorized use of your account.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-foreground mb-2">3.2 Account Security</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    You must provide accurate, current, and complete information during registration and keep your account information updated. We reserve the right to suspend or terminate accounts that contain false or misleading information.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">4. Services and Subscriptions</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-semibold text-foreground mb-2">4.1 Service Description</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    MyEnglish.lk provides AI-powered English language learning services, including but not limited to: personalized assessments, interactive lessons, AI conversations, grammar instruction, pronunciation training, and progress tracking.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-foreground mb-2">4.2 Subscription Plans</h3>
                                <p className="text-muted-foreground leading-relaxed mb-2">
                                    We offer various subscription plans with different features and pricing:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                    <li>Free Plan: Limited access to basic features</li>
                                    <li>Premium Plan: Full access to all learning features</li>
                                    <li>Pro Plan: Advanced features with priority support</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-foreground mb-2">4.3 Service Modifications</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    We reserve the right to modify, suspend, or discontinue any part of our services at any time with or without notice. We are not liable for any modification, suspension, or discontinuation of services.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">5. Payment and Billing</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-semibold text-foreground mb-2">5.1 Pricing</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    All prices are listed in the currency specified on our pricing page. We reserve the right to change our pricing at any time but will provide advance notice of price changes for existing subscribers.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-foreground mb-2">5.2 Billing Cycle</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Subscription fees are billed in advance on a recurring basis (monthly or annually, depending on your plan). Your subscription automatically renews unless cancelled before the renewal date.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-foreground mb-2">5.3 Payment Methods</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    We accept various payment methods including credit cards, debit cards, and other electronic payment services. You authorize us to charge your chosen payment method for all fees.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">6. Refund Policy</h2>
                        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
                            <h3 className="text-xl font-semibold text-amber-900 dark:text-amber-100 mb-3">No Refund Policy</h3>
                            <p className="text-amber-800 dark:text-amber-200 leading-relaxed mb-3">
                                <strong>All sales are final.</strong> We do not offer refunds for any subscription purchases, whether monthly or annual. This includes but is not limited to:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-amber-800 dark:text-amber-200 ml-4 mb-3">
                                <li>Partial month refunds if you cancel mid-billing cycle</li>
                                <li>Refunds for unused portions of your subscription</li>
                                <li>Refunds due to dissatisfaction with the service</li>
                                <li>Refunds if you forget to cancel before renewal</li>
                                <li>Refunds for duplicate or erroneous charges (except in cases of billing errors on our part)</li>
                            </ul>
                            <p className="text-amber-800 dark:text-amber-200 leading-relaxed">
                                By subscribing to our service, you acknowledge and accept this no-refund policy. We encourage you to take advantage of our free trial or free plan to evaluate our services before committing to a paid subscription.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">7. Cancellation</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            You may cancel your subscription at any time through your account settings. Cancellation will take effect at the end of your current billing period. You will retain access to paid features until the end of your billing period, but no refund will be provided for the remaining time.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">8. User Conduct</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            You agree not to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                            <li>Use the Platform for any illegal purpose or in violation of any laws</li>
                            <li>Violate or infringe upon the rights of others</li>
                            <li>Attempt to gain unauthorized access to our systems or networks</li>
                            <li>Interfere with or disrupt the Platform's functionality</li>
                            <li>Upload malicious code, viruses, or harmful content</li>
                            <li>Harass, abuse, or harm other users</li>
                            <li>Share your account credentials with others</li>
                            <li>Use automated systems to access the Platform without permission</li>
                            <li>Reverse engineer or attempt to extract source code</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">9. Intellectual Property</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-semibold text-foreground mb-2">9.1 Our Content</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    All content on the Platform, including text, graphics, logos, software, and AI-generated content, is the property of MyEnglish.lk and is protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works without our express written permission.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-foreground mb-2">9.2 Your Content</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    You retain ownership of any content you create or submit through the Platform (such as voice recordings, written exercises). By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and process your content solely for the purpose of providing and improving our services.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">10. AI Technology and Limitations</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Our Platform uses artificial intelligence technology (Google Gemini AI) to provide personalized learning experiences. While we strive for accuracy, AI-generated content and assessments may not always be perfect. You acknowledge that:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                            <li>AI responses are generated algorithmically and may contain errors</li>
                            <li>Our assessments provide guidance but are not professional certifications</li>
                            <li>The Platform is a learning aid and should not replace professional language instruction</li>
                            <li>We continuously improve our AI models but cannot guarantee 100% accuracy</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">11. Disclaimer of Warranties</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT GUARANTEE THAT THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">12. Limitation of Liability</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            TO THE MAXIMUM EXTENT PERMITTED BY LAW, MYENGLISH.LK SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM YOUR USE OF THE PLATFORM.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">13. Indemnification</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            You agree to indemnify and hold harmless MyEnglish.lk, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the Platform, violation of these Terms, or infringement of any third-party rights.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">14. Termination</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We reserve the right to suspend or terminate your account and access to the Platform at any time, with or without cause or notice, including for violation of these Terms. Upon termination, your right to use the Platform will immediately cease, and we may delete your account and data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">15. Governing Law and Dispute Resolution</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            These Terms are governed by the laws of Sri Lanka. Any disputes arising from these Terms or your use of the Platform shall be resolved through binding arbitration in accordance with Sri Lankan law, except where prohibited by law.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">16. Changes to Terms</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated Terms on our Platform and updating the "Last Updated" date. Your continued use of the Platform after changes constitutes acceptance of the modified Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">17. Severability</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will remain in full force and effect.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">18. Contact Information</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            For questions about these Terms of Service, please contact us:
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
