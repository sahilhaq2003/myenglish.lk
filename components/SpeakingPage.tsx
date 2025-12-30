import React from 'react';
import { Mic, Video, Headphones, MessageCircle, Award, TrendingUp, Clock, Users } from 'lucide-react';

interface SpeakingPageProps {
    onGetStarted: () => void;
}

export const SpeakingPage: React.FC<SpeakingPageProps> = ({ onGetStarted }) => {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-20 px-6 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-blue-950/20 dark:via-cyan-950/20 dark:to-teal-950/20">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-bold mb-6">
                        <Mic size={16} />
                        AI-Powered Speaking Practice
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-foreground mb-6 tracking-tight">
                        Master English Speaking<br />with AI Conversations
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                        Practice real conversations with AI personas, get instant feedback on pronunciation, and build confidence speaking English naturally.
                    </p>
                    <button
                        onClick={onGetStarted}
                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                    >
                        Start Speaking Practice
                    </button>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-black text-center mb-12">Speaking Practice Features</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <MessageCircle size={32} />,
                                title: 'Real Conversations',
                                description: 'Practice with AI personas in realistic scenarios like ordering coffee, job interviews, and casual chats.',
                                color: 'from-blue-500 to-cyan-500'
                            },
                            {
                                icon: <Mic size={32} />,
                                title: 'Pronunciation Feedback',
                                description: 'Get instant feedback on your pronunciation, intonation, and speaking clarity.',
                                color: 'from-cyan-500 to-teal-500'
                            },
                            {
                                icon: <Video size={32} />,
                                title: 'Video Practice',
                                description: 'Record yourself speaking and review your performance with AI analysis.',
                                color: 'from-teal-500 to-green-500'
                            },
                            {
                                icon: <Headphones size={32} />,
                                title: 'Listen & Repeat',
                                description: 'Hear native pronunciation and practice repeating phrases until perfect.',
                                color: 'from-green-500 to-emerald-500'
                            },
                            {
                                icon: <Award size={32} />,
                                title: 'Fluency Scoring',
                                description: 'Track your speaking fluency with detailed scores and progress metrics.',
                                color: 'from-purple-500 to-pink-500'
                            },
                            {
                                icon: <TrendingUp size={32} />,
                                title: 'Progress Tracking',
                                description: 'Monitor your improvement over time with detailed analytics and insights.',
                                color: 'from-orange-500 to-red-500'
                            }
                        ].map((feature, index) => (
                            <div key={index} className="bg-card rounded-3xl p-8 border border-border hover:shadow-xl transition-all group">
                                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Practice Scenarios */}
            <section className="py-20 px-6 bg-muted/30">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-black text-center mb-12">Practice Scenarios</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            { title: 'Everyday Conversations', scenarios: 'Shopping, Dining, Small Talk, Making Friends', level: 'Beginner' },
                            { title: 'Professional English', scenarios: 'Job Interviews, Meetings, Presentations, Networking', level: 'Intermediate' },
                            { title: 'Travel & Tourism', scenarios: 'Hotels, Airports, Directions, Emergency Situations', level: 'Beginner' },
                            { title: 'Academic English', scenarios: 'Discussions, Debates, Research Presentations', level: 'Advanced' }
                        ].map((category, index) => (
                            <div key={index} className="bg-card rounded-2xl p-6 border border-border">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold">{category.title}</h3>
                                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold">
                                        {category.level}
                                    </span>
                                </div>
                                <p className="text-muted-foreground">{category.scenarios}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        {[
                            { icon: <Users size={40} />, number: '50,000+', label: 'Active Speakers' },
                            { icon: <MessageCircle size={40} />, number: '1M+', label: 'Conversations' },
                            { icon: <Clock size={40} />, number: '24/7', label: 'AI Availability' }
                        ].map((stat, index) => (
                            <div key={index} className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-3xl p-8">
                                <div className="text-blue-600 dark:text-blue-400 mb-4 flex justify-center">{stat.icon}</div>
                                <div className="text-4xl font-black text-foreground mb-2">{stat.number}</div>
                                <div className="text-muted-foreground font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-black mb-6">Ready to Speak Confidently?</h2>
                    <p className="text-xl mb-8 opacity-90">
                        Start practicing with AI today and see improvement in just 7 days!
                    </p>
                    <button
                        onClick={onGetStarted}
                        className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold text-lg shadow-xl hover:scale-105 transition-all"
                    >
                        Begin Your Speaking Journey
                    </button>
                </div>
            </section>
        </div>
    );
};
