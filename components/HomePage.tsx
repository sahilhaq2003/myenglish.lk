import React, { useState } from 'react';
import {
    GraduationCap, ArrowRight, BookOpen, Award, Calendar,
    Users, TrendingUp, Globe, Star, CheckCircle2, Play,
    Sparkles, Target, Zap, Shield, Clock, Trophy, Check, Search, Filter
} from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';

interface HomePageProps {
    onGetStarted: () => void;
    onExploreCourses: () => void;
    onSignIn: () => void;
}

export function HomePage({ onGetStarted, onExploreCourses, onSignIn }: HomePageProps) {
    const [isAnnualPricing, setIsAnnualPricing] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLevel, setSelectedLevel] = useState<string>('All');

    // Pricing plans
    const pricingPlans = [
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
            price: isAnnualPricing ? 9.99 : 14.99,
            description: 'Accelerate your fluency with unlimited practice.',
            features: [
                'Unlimited AI conversations',
                'Advanced roleplay scenarios',
                'Detailed pronunciation analysis',
                'Personalized learning path',
                'Certificate of completion',
                'Ad-free experience'
            ],
            cta: 'Start 7-Day Free Trial',
            popular: true
        },
        {
            name: 'Business',
            price: isAnnualPricing ? 29.99 : 39.99,
            description: 'For professionals and teams needing advanced skills.',
            features: [
                'Everything in Pro',
                'Business English modules',
                'Interview preparation',
                'Presentation coaching',
                'Team progress analytics',
                'Priority support'
            ],
            cta: 'Contact Sales',
            popular: false
        }
    ];

    // Featured courses
    const featuredCourses = [
        {
            id: '1',
            title: 'Complete English Grammar Mastery',
            description: 'Master all essential grammar rules from basics to advanced.',
            instructor: 'Dr. Sarah Johnson',
            rating: 4.9,
            reviews: 2341,
            students: 15234,
            duration: '12 weeks',
            level: 'Intermediate',
            category: 'Grammar',
            price: 'Premium',
            thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=600&fit=crop',
            lessons: 48,
        },
        {
            id: '2',
            title: 'IELTS 8+ Band Guaranteed',
            description: 'Comprehensive IELTS preparation with proven strategies.',
            instructor: 'Michael Chen',
            rating: 4.8,
            reviews: 1876,
            students: 8932,
            duration: '8 weeks',
            level: 'Advanced',
            category: 'Exam Prep',
            price: 99,
            thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop',
            lessons: 64,
        },
        {
            id: '3',
            title: 'Business English for Professionals',
            description: 'Master workplace communication and presentations.',
            instructor: 'Emma Williams',
            rating: 4.9,
            reviews: 3102,
            students: 12456,
            duration: '10 weeks',
            level: 'Intermediate',
            category: 'Business',
            price: 'Premium',
            thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=600&fit=crop',
            lessons: 40,
        },
        {
            id: '4',
            title: 'American Accent Training',
            description: 'Perfect your American pronunciation.',
            instructor: 'David Miller',
            rating: 4.7,
            reviews: 987,
            students: 5421,
            duration: '6 weeks',
            level: 'Intermediate',
            category: 'Speaking',
            price: 79,
            thumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop',
            lessons: 32,
        },
        {
            id: '5',
            title: 'Conversational English for Beginners',
            description: 'Build confidence in everyday conversations.',
            instructor: 'Lisa Anderson',
            rating: 4.8,
            reviews: 2156,
            students: 18790,
            duration: '8 weeks',
            level: 'Beginner',
            category: 'Speaking',
            price: 'Premium',
            thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop',
            lessons: 36,
        },
        {
            id: '6',
            title: 'Advanced Writing & Composition',
            description: 'Enhance your writing skills for academic and professional success.',
            instructor: 'Prof. Robert Lee',
            rating: 4.9,
            reviews: 1543,
            students: 9876,
            duration: '10 weeks',
            level: 'Advanced',
            category: 'Writing',
            price: 89,
            thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop',
            lessons: 45,
        },
    ];

    const filteredCourses = featuredCourses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
        return matchesSearch && matchesLevel;
    });

    // Check subscription status (moved to top level for UI)
    const subStatus = localStorage.getItem('myenglish_subscriptionStatus');
    const trialEnd = localStorage.getItem('myenglish_trialEndAt');
    const isPro = subStatus === 'pro';
    const isTrialActive = subStatus === 'trial' && trialEnd && new Date() < new Date(trialEnd);
    const isUnlocked = isPro || isTrialActive;

    const handleEnrollCourse = async (course: typeof featuredCourses[0]) => {
        // Check if user is logged in
        const isLoggedIn = localStorage.getItem('myenglish_token') === 'logged_in';
        if (!isLoggedIn) {
            onGetStarted();
            return;
        }

        const userEmail = localStorage.getItem('myenglish_userEmail');
        if (!userEmail) {
            alert('Please log in to enroll in courses');
            return;
        }

        // Restriction: Free users can ONLY enroll in 'English for Beginners'
        if (!isUnlocked && course.title !== 'English for Beginners') {
            alert("This is a Premium course. Please upgrade your plan to enroll.");
            onGetStarted(); // Redirect to pricing/signup
            return;
        }

        try {
            const response = await fetch('/api/enrollments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userEmail,
                    courseId: course.id,
                    courseTitle: course.title,
                    courseCategory: course.category,
                    courseLevel: course.level,
                    courseDescription: course.description,
                    courseThumbnail: course.thumbnail,
                    courseInstructor: course.instructor,
                    courseLessons: course.lessons,
                }),
            });

            const data = await response.json();

            if (response.status === 409) {
                alert('You are already enrolled in this course!');
                return;
            }

            if (!response.ok) {
                throw new Error(data.message || 'Failed to enroll in course');
            }

            alert(`Successfully enrolled in "${course.title}"! Check your dashboard to start learning.`);
        } catch (error) {
            console.error('Error enrolling in course:', error);
            alert('Failed to enroll in course. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-background relative flex flex-col">
            <Header onSignIn={onSignIn} onGetStarted={onGetStarted} />

            {/* Hero Section */}
            <main className="flex-grow">
                <section id="hero" className="relative flex items-center justify-center px-4 sm:px-6 pt-32 pb-20 overflow-hidden">
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
                                onClick={() => {
                                    const coursesSection = document.getElementById('courses');
                                    coursesSection?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="px-8 py-5 bg-card border-2 border-border hover:border-primary hover:bg-card/80 text-foreground rounded-2xl font-bold text-lg transition-all min-w-[240px]"
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

                {/* Key Features Grid */}
                <section id="features" className="py-24 px-4 sm:px-6">
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
                            <div className="bg-card rounded-2xl p-8 border border-border hover:shadow-xl transition-all">
                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                                    <Users size={28} className="text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-3">AI Speaking Partner</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Practice conversations 24/7 with intelligent AI personas. Get instant feedback and improve naturally.
                                </p>
                            </div>

                            <div className="bg-card rounded-2xl p-8 border border-border hover:shadow-xl transition-all">
                                <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-6">
                                    <TrendingUp size={28} className="text-secondary" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-3">Personalized Learning Path</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Adaptive curriculum based on your goals, level, and progress. Learn exactly what you need.
                                </p>
                            </div>

                            <div className="bg-card rounded-2xl p-8 border border-border hover:shadow-xl transition-all">
                                <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                                    <BookOpen size={28} className="text-accent" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-3">Expert-Led Courses</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Learn from certified teachers and industry professionals with proven teaching methods.
                                </p>
                            </div>

                            <div className="bg-card rounded-2xl p-8 border border-border hover:shadow-xl transition-all">
                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                                    <Award size={28} className="text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-3">Industry-Recognized Certificates</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Showcase your skills with LinkedIn-ready credentials and boost your career prospects.
                                </p>
                            </div>

                            <div className="bg-card rounded-2xl p-8 border border-border hover:shadow-xl transition-all">
                                <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-6">
                                    <Zap size={28} className="text-secondary" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-3">Real-Time Progress Analytics</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Track improvement across all skills with detailed insights and performance metrics.
                                </p>
                            </div>

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

                {/* Courses Section */}
                <section id="courses" className="py-24 px-4 sm:px-6 bg-muted/30">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-4">
                                Popular Courses
                            </h2>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                Expert-led courses designed to help you achieve your English learning goals
                            </p>
                        </div>

                        {/* Search and Filter */}
                        <div className="mb-12 max-w-4xl mx-auto">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search courses..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-card rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                                    />
                                </div>
                                <select
                                    value={selectedLevel}
                                    onChange={(e) => setSelectedLevel(e.target.value)}
                                    className="px-4 py-3 bg-card rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                                >
                                    <option value="All">All Levels</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>
                        </div>

                        {/* Course Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredCourses.map((course) => (
                                <div
                                    key={course.id}
                                    className="group bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer"
                                >
                                    {/* Thumbnail */}
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={course.thumbnail}
                                            alt={course.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute top-4 right-4 px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-bold shadow-lg">
                                            {course.level}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                                            {course.category}
                                        </div>

                                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                            {course.title}
                                        </h3>

                                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                            {course.description}
                                        </p>

                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                {course.instructor.charAt(0)}
                                            </div>
                                            <span className="text-sm text-muted-foreground">{course.instructor}</span>
                                        </div>

                                        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                                                <span className="font-bold text-foreground">{course.rating}</span>
                                                <span>({course.reviews.toLocaleString()})</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Users size={16} />
                                                <span>{course.students.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <BookOpen size={16} />
                                                <span>{course.lessons} lessons</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock size={16} />
                                                <span>{course.duration}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-border">
                                            <div>
                                                {course.price === 'Premium' ? (
                                                    <div>
                                                        <div className="text-xs text-muted-foreground">Included in</div>
                                                        <div className="text-lg font-bold text-primary">Premium</div>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <div className="text-xs text-muted-foreground">One-time</div>
                                                        <div className="text-2xl font-bold text-foreground">${course.price}</div>
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleEnrollCourse(course)}
                                                className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
                                            >
                                                Enroll Now
                                                <Play size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="py-24 px-4 sm:px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-6">
                                Choose Your Plan
                            </h2>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                                Flexible pricing for every learning goal. Start free, upgrade anytime.
                            </p>

                            {/* Billing Toggle */}
                            <div className="flex items-center justify-center gap-4 mb-8">
                                <span className={`text-sm font-bold ${!isAnnualPricing ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
                                <button
                                    onClick={() => setIsAnnualPricing(!isAnnualPricing)}
                                    className="relative w-14 h-8 bg-primary/20 rounded-full transition-colors focus:outline-none"
                                >
                                    <div className={`absolute top-1 left-1 w-6 h-6 bg-primary rounded-full transition-transform ${isAnnualPricing ? 'translate-x-6' : ''}`} />
                                </button>
                                <div className="flex items-center gap-2">
                                    <span className={`text-sm font-bold ${isAnnualPricing ? 'text-foreground' : 'text-muted-foreground'}`}>Yearly</span>
                                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">Save 20%</span>
                                </div>
                            </div>
                        </div>

                        {/* Pricing Cards */}
                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {pricingPlans.map((plan) => (
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
                                        {isAnnualPricing && plan.price > 0 && (
                                            <p className="text-xs text-muted-foreground mt-2">Billed ${Math.round(plan.price * 12)} yearly</p>
                                        )}
                                    </div>

                                    <button
                                        onClick={onGetStarted}
                                        className={`w-full py-4 rounded-xl font-bold mb-8 transition-all ${plan.popular
                                            ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20'
                                            : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
                                            }`}
                                    >
                                        {plan.cta}
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
                    </div>
                </section>

                {/* Final CTA Section */}
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
            </main>
            <Footer />
        </div>
    );
}
