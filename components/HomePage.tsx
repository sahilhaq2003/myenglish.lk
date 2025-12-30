import React from 'react';
import {
    GraduationCap, ArrowRight, BookOpen, Award, Calendar,
    Users, TrendingUp, Globe, Star, CheckCircle2, Play,
    Sparkles, Target, Zap, Shield, Clock, Trophy
} from 'lucide-react';

interface HomePageProps {
    onGetStarted: () => void;
    onExploreCourses: () => void;
}

export function HomePage({ onGetStarted, onExploreCourses }: HomePageProps) {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-20 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />

                {/* Floating Elements */}
                <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-xl animate-pulse delay-1000" />

                <div className="relative z-10 max-w-6xl mx-auto text-center">
                    {/* Logo/Icon */}
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-tr from-primary to-secondary rounded-3xl shadow-2xl mb-8 transform hover:scale-110 transition-transform duration-500">
                        <GraduationCap size={56} className="text-white" />
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 tracking-tight">
                        <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                            Master English,
                        </span>
                        <br />
                        <span className="text-foreground">Unlock Opportunities</span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
                        Learn English faster with AI-powered lessons, real-time conversation practice, and expert guidance.
                        <span className="text-foreground font-semibold"> From beginner to fluent.</span>
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                        <button
                            onClick={onGetStarted}
                            className="group px-8 py-5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center gap-3 min-w-[240px] justify-center"
                        >
                            Start Free Trial
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={onExploreCourses}
                            className="px-8 py-5 bg-secondary border-2 border-border hover:bg-muted text-secondary-foreground rounded-2xl font-bold text-lg transition-all min-w-[240px]"
                        >
                            Explore Courses
                        </button>
                    </div>

                    {/* Trust Badge */}
                    <div className="flex items-center justify-center gap-2 text-muted-foreground/70">
                        <Shield size={16} />
                        <span className="text-sm font-medium">Privacy-first English learning • No credit card required</span>
                    </div>
                </div>
            </section>

            {/* Trust Bar */}
            <section className="py-12 bg-muted/50 border-y border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div className="space-y-2">
                            <div className="text-4xl font-black text-primary">50,000+</div>
                            <div className="text-sm text-muted-foreground font-medium">Active Learners</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-4xl font-black text-secondary">95%</div>
                            <div className="text-sm text-muted-foreground font-medium">Success Rate</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-4xl font-black text-accent">4.9★</div>
                            <div className="text-sm text-muted-foreground font-medium">Average Rating</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-4xl font-black text-primary">24/7</div>
                            <div className="text-sm text-muted-foreground font-medium">AI Practice</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Learning Paths Section */}
            <section className="py-24 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-4">
                            Choose Your Learning Journey
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Personalized paths designed for your goals and current level
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Beginner Path */}
                        <div className="group bg-card hover:bg-card/80 rounded-3xl p-8 border-2 border-border hover:border-primary transition-all hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Sparkles size={32} className="text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-3">Beginner Path</h3>
                            <p className="text-muted-foreground mb-4">Start from scratch and build a strong foundation</p>
                            <div className="space-y-2 mb-6">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock size={16} />
                                    <span>3-6 months</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Target size={16} />
                                    <span>Level: A1-A2</span>
                                </div>
                            </div>
                            <button className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all">
                                Begin Journey
                            </button>
                        </div>

                        {/* Professional Path */}
                        <div className="group bg-card hover:bg-card/80 rounded-3xl p-8 border-2 border-border hover:border-primary transition-all hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <TrendingUp size={32} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-3">Professional English</h3>
                            <p className="text-muted-foreground mb-4">Advance your career with business communication</p>
                            <div className="space-y-2 mb-6">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock size={16} />
                                    <span>2-4 months</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Target size={16} />
                                    <span>Level: B2-C1</span>
                                </div>
                            </div>
                            <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all">
                                Boost Career
                            </button>
                        </div>

                        {/* Exam Prep Path */}
                        <div className="group bg-card hover:bg-card/80 rounded-3xl p-8 border-2 border-border hover:border-primary transition-all hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
                            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Trophy size={32} className="text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-3">Exam Preparation</h3>
                            <p className="text-muted-foreground mb-4">Ace IELTS, TOEFL, PTE with proven strategies</p>
                            <div className="space-y-2 mb-6">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock size={16} />
                                    <span>1-3 months</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Target size={16} />
                                    <span>Level: B1-C1</span>
                                </div>
                            </div>
                            <button className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all">
                                Start Prep
                            </button>
                        </div>

                        {/* Business Path */}
                        <div className="group bg-card hover:bg-card/80 rounded-3xl p-8 border-2 border-border hover:border-primary transition-all hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
                            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Globe size={32} className="text-orange-600 dark:text-orange-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-3">Business Communication</h3>
                            <p className="text-muted-foreground mb-4">Lead with confidence in global settings</p>
                            <div className="space-y-2 mb-6">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock size={16} />
                                    <span>2-3 months</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Target size={16} />
                                    <span>Level: B2-C2</span>
                                </div>
                            </div>
                            <button className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition-all">
                                Master Business English
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Features Grid */}
            <section className="py-24 px-4 sm:px-6 bg-muted/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-4">
                            Why Choose MyEnglish.lk?
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Everything you need to master English in one powerful platform
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-card rounded-2xl p-8 border border-border hover:shadow-xl transition-all">
                            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                                <Users size={28} className="text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-3">AI Speaking Partner</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Practice conversations 24/7 with intelligent AI personas. Get instant feedback and improve naturally.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-card rounded-2xl p-8 border border-border hover:shadow-xl transition-all">
                            <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-6">
                                <TrendingUp size={28} className="text-secondary" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-3">Personalized Learning Path</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Adaptive curriculum based on your goals, level, and progress. Learn exactly what you need.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-card rounded-2xl p-8 border border-border hover:shadow-xl transition-all">
                            <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                                <BookOpen size={28} className="text-accent" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-3">Expert-Led Courses</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Learn from certified teachers and industry professionals with proven teaching methods.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-card rounded-2xl p-8 border border-border hover:shadow-xl transition-all">
                            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                                <Award size={28} className="text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-3">Industry-Recognized Certificates</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Showcase your skills with LinkedIn-ready credentials and boost your career prospects.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="bg-card rounded-2xl p-8 border border-border hover:shadow-xl transition-all">
                            <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-6">
                                <Zap size={28} className="text-secondary" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-3">Real-Time Progress Analytics</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Track improvement across all skills with detailed insights and performance metrics.
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div className="bg-card rounded-2xl p-8 border border-border hover:shadow-xl transition-all">
                            <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                                <Globe size={28} className="text-accent" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-3">Learn Anywhere, Anytime</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Mobile app with offline downloads and sync. Practice on your schedule, wherever you are.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Your journey to English fluency in three simple steps
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {/* Step 1 */}
                        <div className="relative text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full text-white text-3xl font-black mb-6 shadow-xl">
                                1
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-4">Assess & Personalize</h3>
                            <ul className="space-y-3 text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={20} className="text-primary mt-0.5 shrink-0" />
                                    <span>Take 5-minute skill assessment</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={20} className="text-primary mt-0.5 shrink-0" />
                                    <span>AI creates custom learning path</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={20} className="text-primary mt-0.5 shrink-0" />
                                    <span>Set your goals and schedule</span>
                                </li>
                            </ul>
                        </div>

                        {/* Step 2 */}
                        <div className="relative text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-secondary to-secondary/70 rounded-full text-white text-3xl font-black mb-6 shadow-xl">
                                2
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-4">Learn & Practice</h3>
                            <ul className="space-y-3 text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={20} className="text-secondary mt-0.5 shrink-0" />
                                    <span>Interactive video lessons</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={20} className="text-secondary mt-0.5 shrink-0" />
                                    <span>AI conversation practice</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={20} className="text-secondary mt-0.5 shrink-0" />
                                    <span>Real-time feedback & support</span>
                                </li>
                            </ul>
                        </div>

                        {/* Step 3 */}
                        <div className="relative text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent to-accent/70 rounded-full text-white text-3xl font-black mb-6 shadow-xl">
                                3
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-4">Achieve & Certify</h3>
                            <ul className="space-y-3 text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={20} className="text-accent mt-0.5 shrink-0" />
                                    <span>Track measurable progress</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={20} className="text-accent mt-0.5 shrink-0" />
                                    <span>Earn certificates</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={20} className="text-accent mt-0.5 shrink-0" />
                                    <span>Unlock career opportunities</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4 sm:px-6 bg-gradient-to-br from-primary via-primary/90 to-secondary">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <h2 className="text-4xl sm:text-5xl font-black mb-6">
                        Ready to Transform Your English?
                    </h2>
                    <p className="text-xl mb-10 opacity-90">
                        Join 50,000+ learners who are already achieving their goals
                    </p>
                    <button
                        onClick={onGetStarted}
                        className="px-10 py-5 bg-white text-primary rounded-2xl font-bold text-xl shadow-2xl hover:scale-105 transition-all inline-flex items-center gap-3"
                    >
                        Start Your Free Trial
                        <ArrowRight size={24} />
                    </button>
                    <p className="mt-6 text-sm opacity-75">
                        No credit card required • 7-day free trial • Cancel anytime
                    </p>
                </div>
            </section>
        </div>
    );
}
