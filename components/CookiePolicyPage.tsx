import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Cookie, Calendar, ArrowLeft } from 'lucide-react';

export function CookiePolicyPage() {
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
                        <Cookie className="text-white" size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">
                        Cookie Policy
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Calendar size={16} />
                        <span>Last Updated: January 1, 2026</span>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-8 md:p-12 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">1. What Are Cookies?</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Cookies are small text files that are placed on your device (computer, tablet, or mobile phone) when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners. Cookies help us enhance your experience on MyEnglish.lk by remembering your preferences and understanding how you use our platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">2. How We Use Cookies</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            MyEnglish.lk uses cookies and similar technologies to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                            <li>Keep you logged in to your account</li>
                            <li>Remember your preferences and settings</li>
                            <li>Provide personalized learning experiences</li>
                            <li>Analyze how you use our platform to improve our services</li>
                            <li>Deliver relevant content and features</li>
                            <li>Ensure security and prevent fraud</li>
                            <li>Measure the effectiveness of our marketing campaigns</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">3. Types of Cookies We Use</h2>
                        <div className="space-y-6">
                            <div className="bg-secondary/30 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-foreground mb-3">3.1 Essential Cookies</h3>
                                <p className="text-muted-foreground leading-relaxed mb-2">
                                    These cookies are necessary for the platform to function properly and cannot be disabled. They include:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                    <li><strong>Authentication:</strong> Keep you logged in to your account</li>
                                    <li><strong>Security:</strong> Protect against unauthorized access and fraud</li>
                                    <li><strong>Load Balancing:</strong> Distribute traffic across our servers</li>
                                    <li><strong>Session Management:</strong> Maintain your session state as you navigate</li>
                                </ul>
                                <p className="text-sm text-muted-foreground mt-3 italic">
                                    Duration: Session cookies (deleted when you close your browser) or up to 30 days
                                </p>
                            </div>

                            <div className="bg-secondary/30 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-foreground mb-3">3.2 Functional Cookies</h3>
                                <p className="text-muted-foreground leading-relaxed mb-2">
                                    These cookies enable enhanced functionality and personalization:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                    <li><strong>Preferences:</strong> Remember your language, theme, and display settings</li>
                                    <li><strong>Learning Data:</strong> Store your progress, completed modules, and assessment results</li>
                                    <li><strong>Audio Settings:</strong> Remember your AI speaking rate preferences</li>
                                    <li><strong>Dashboard Layout:</strong> Save your customized dashboard configuration</li>
                                </ul>
                                <p className="text-sm text-muted-foreground mt-3 italic">
                                    Duration: Up to 1 year
                                </p>
                            </div>

                            <div className="bg-secondary/30 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-foreground mb-3">3.3 Analytics Cookies</h3>
                                <p className="text-muted-foreground leading-relaxed mb-2">
                                    These cookies help us understand how users interact with our platform:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                    <li><strong>Usage Analytics:</strong> Track which features are used most frequently</li>
                                    <li><strong>Performance Monitoring:</strong> Identify technical issues and loading times</li>
                                    <li><strong>User Behavior:</strong> Understand learning patterns and engagement</li>
                                    <li><strong>A/B Testing:</strong> Test different versions of features to improve user experience</li>
                                </ul>
                                <p className="text-sm text-muted-foreground mt-3 italic">
                                    Duration: Up to 2 years
                                </p>
                            </div>

                            <div className="bg-secondary/30 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-foreground mb-3">3.4 Marketing Cookies</h3>
                                <p className="text-muted-foreground leading-relaxed mb-2">
                                    These cookies are used to deliver relevant advertisements and track campaign effectiveness:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                    <li><strong>Advertising:</strong> Show you relevant ads on other websites</li>
                                    <li><strong>Retargeting:</strong> Display personalized ads based on your interests</li>
                                    <li><strong>Conversion Tracking:</strong> Measure the success of marketing campaigns</li>
                                    <li><strong>Social Media:</strong> Enable sharing and social media integration</li>
                                </ul>
                                <p className="text-sm text-muted-foreground mt-3 italic">
                                    Duration: Up to 1 year
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">4. Third-Party Cookies</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We use services from trusted third-party providers who may also set cookies on your device:
                        </p>
                        <div className="space-y-4">
                            <div className="border-l-4 border-primary pl-4">
                                <h3 className="text-lg font-semibold text-foreground mb-2">Google Analytics</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Helps us understand user behavior and improve our platform. <a href="https://policies.google.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                                </p>
                            </div>
                            <div className="border-l-4 border-primary pl-4">
                                <h3 className="text-lg font-semibold text-foreground mb-2">Google AI (Gemini)</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Powers our AI conversations and assessments. <a href="https://policies.google.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                                </p>
                            </div>
                            <div className="border-l-4 border-primary pl-4">
                                <h3 className="text-lg font-semibold text-foreground mb-2">Payment Processors</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Process subscription payments securely (e.g., Stripe, PayPal)
                                </p>
                            </div>
                            <div className="border-l-4 border-primary pl-4">
                                <h3 className="text-lg font-semibold text-foreground mb-2">Social Media Platforms</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Enable social sharing features (Facebook, Twitter, LinkedIn)
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">5. Local Storage and Session Storage</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            In addition to cookies, we use browser local storage and session storage technologies to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                            <li><strong>Learning Progress:</strong> Store your course progress, points, streak, and completed modules locally</li>
                            <li><strong>User Preferences:</strong> Save your theme selection (light/dark mode), language preferences, and UI customizations</li>
                            <li><strong>Assessment Data:</strong> Temporarily store assessment results and learning paths</li>
                            <li><strong>Session State:</strong> Maintain your current learning session and active module</li>
                            <li><strong>Performance:</strong> Cache data to reduce loading times and improve responsiveness</li>
                        </ul>
                        <p className="text-muted-foreground leading-relaxed mt-4">
                            Local storage data persists until explicitly cleared, while session storage is cleared when you close the browser tab.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">6. Managing Your Cookie Preferences</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-semibold text-foreground mb-2">6.1 Browser Controls</h3>
                                <p className="text-muted-foreground leading-relaxed mb-3">
                                    Most web browsers allow you to control cookies through their settings. You can:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                    <li>View and delete cookies</li>
                                    <li>Block third-party cookies</li>
                                    <li>Block all cookies (this may affect platform functionality)</li>
                                    <li>Delete cookies when you close your browser</li>
                                </ul>
                                <div className="mt-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                    <p className="text-blue-900 dark:text-blue-100 text-sm">
                                        <strong>Learn how to manage cookies in popular browsers:</strong>
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200 text-sm ml-4 mt-2">
                                        <li><a href="https://support.google.com/chrome/answer/95647" className="hover:underline" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
                                        <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" className="hover:underline" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
                                        <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" className="hover:underline" target="_blank" rel="noopener noreferrer">Safari</a></li>
                                        <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="hover:underline" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
                                    </ul>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-foreground mb-2">6.2 Platform Settings</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    You can manage certain cookie preferences directly in your MyEnglish.lk account settings. Note that disabling essential cookies may prevent the platform from functioning correctly.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-foreground mb-2">6.3 Opt-Out Tools</h3>
                                <p className="text-muted-foreground leading-relaxed mb-2">
                                    You can opt out of certain tracking through these tools:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                    <li><a href="https://tools.google.com/dlpage/gaoptout" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a></li>
                                    <li><a href="https://www.networkadvertising.org/choices/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Network Advertising Initiative Opt-out</a></li>
                                    <li><a href="https://optout.aboutads.info/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Digital Advertising Alliance Opt-out</a></li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">7. Impact of Disabling Cookies</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            If you disable or refuse cookies, please note that:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                            <li>You may not be able to access certain features of the platform</li>
                            <li>Your preferences and settings will not be saved</li>
                            <li>You may need to manually adjust settings each visit</li>
                            <li>Some personalized learning features may not work properly</li>
                            <li>Your learning progress may not be tracked accurately</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">8. Do Not Track (DNT)</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Some browsers include a "Do Not Track" (DNT) feature that signals to websites that you do not want to be tracked. Currently, there is no industry standard for responding to DNT signals. We do not currently respond to DNT browser signals, but we respect your privacy choices and provide cookie management options as described in this policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">9. Cookies and Children</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Our platform is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13 through cookies or any other means. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">10. Updates to This Cookie Policy</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our practices. We will notify you of any significant changes by posting the updated policy on our platform and updating the "Last Updated" date at the top of this page. We encourage you to review this policy periodically.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">11. More Information</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            For more information about how we process your personal data, please see our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            If you have questions about our use of cookies, please contact us:
                        </p>
                        <div className="bg-secondary/30 rounded-lg p-6 space-y-2">
                            <p className="text-foreground"><strong>Email:</strong> sahilhaq2003@gmail.com</p>
                            <p className="text-foreground"><strong>Phone:</strong> 0767589002</p>
                            <p className="text-foreground"><strong>Address:</strong> MyEnglish.lk, Sri Lanka</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
