import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Info, HelpCircle } from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';

interface PricingPageProps {
    onGetStarted: () => void;
    onSignIn: () => void;
}

export function PricingPage({ onGetStarted, onSignIn }: PricingPageProps) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoggedIn(localStorage.getItem('myenglish_token') === 'logged_in');
        setUserEmail(localStorage.getItem('myenglish_userEmail') || '');
    }, []);

    const handleUpgrade = async () => {
        if (!userEmail) return;
        try {
            const res = await fetch('/api/upgrade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail })
            });
            const data = await res.json();
            if (res.ok) {
                alert('Rank Upgraded to PRO! All courses unlocked.');
                // Update local storage
                localStorage.setItem('myenglish_subscriptionStatus', 'pro');
                // Navigate to dashboard
                navigate('/dashboard');
            } else {
                alert('Upgrade failed: ' + data.message);
            }
        } catch (e) {
            alert('Error upgrading subscription');
        }
    };


    const plans = [
        {
            name: 'Free Starter',
            price: 0,
            description: 'Perfect for getting started with English basics.',
            features: [
                '5 AI conversation minutes/day',
                'Basic vocabulary & grammar',
                'Access to community forum',
                'Limited daily lessons'
            ],
            cta: 'Start for Free',
            popular: false
        },
        {
            name: 'Pro Learner',
            price: 5,
            description: 'Accelerate your fluency with unlimited practice.',
            features: [
                'Unlimited AI conversations',
                'Advanced roleplay scenarios',
                'Detailed pronunciation analysis',
                'Personalized learning path',
                'Certificate of completion',
                'Ad-free experience'
            ],
            cta: 'Upgrade to Pro',
            popular: true
        },

    ];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header onGetStarted={onGetStarted} onSignIn={onSignIn} />

            <main className="flex-grow pt-32 pb-20 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-6">
                            Invest in Your Future
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                            Choose the plan that fits your goals. Upgrade, downgrade, or cancel anytime.
                        </p>


                    </div>

                    {/* Pricing Cards */}
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`relative bg-card rounded-[2rem] p-8 border-2 transition-all hover:-translate-y-2 ${plan.popular
                                    ? 'border-primary shadow-2xl shadow-primary/10 scale-105 z-10'
                                    : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-full shadow-lg">
                                        Most Popular
                                    </div>
                                )}

                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                                    <p className="text-muted-foreground text-sm h-10">{plan.description}</p>
                                </div>

                                <div className="mb-8">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-black text-foreground">${plan.price}</span>
                                        <span className="text-muted-foreground">/mo</span>
                                    </div>

                                </div>

                                <button
                                    onClick={() => {
                                        if (plan.name === 'Pro Learner' && isLoggedIn) {
                                            handleUpgrade();
                                        } else {
                                            onGetStarted();
                                        }
                                    }}
                                    className={`w-full py-4 rounded-xl font-bold mb-8 transition-all ${plan.popular
                                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20'
                                        : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
                                        }`}
                                >
                                    {plan.name === 'Pro Learner' && isLoggedIn ? 'Upgrade Now' : plan.cta}
                                </button>

                                <div className="space-y-4">
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                                            <Check size={18} className="text-primary mt-0.5 shrink-0" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* FAQ Preview */}
                    <div className="mt-24 max-w-3xl mx-auto text-center">
                        <h2 className="text-2xl font-bold text-foreground mb-8">Frequently Asked Questions</h2>
                        <div className="bg-card rounded-2xl p-8 border border-border text-left">
                            <div className="flex gap-4 items-start">
                                <HelpCircle className="text-primary shrink-0" />
                                <div>
                                    <h4 className="font-bold text-foreground mb-2">Can I switch plans later?</h4>
                                    <p className="text-muted-foreground">Yes, absolutely! You can upgrade or downgrade your plan at any time from your profile settings. Changes take effect at the start of the next billing cycle.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
