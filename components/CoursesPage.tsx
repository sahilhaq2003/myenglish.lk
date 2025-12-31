import React, { useState } from 'react';
import {
    Search, Filter, Star, Users, Clock, BookOpen,
    CheckCircle2, Play, Award, TrendingUp
} from 'lucide-react';

import { Header } from './Header';
import { Footer } from './Footer';

interface Course {
    id: string;
    title: string;
    description: string;
    instructor: string;
    instructorImage?: string;
    rating: number;
    reviews: number;
    students: number;
    duration: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    category: string;
    price: number | 'Premium';
    thumbnail: string;
    lessons: number;
    certificate: boolean;
}

interface CoursesPageProps {
    onEnroll?: (courseId: string) => void;
    onCourseClick?: (courseId: string) => void;
    onSignIn: () => void;
    onGetStarted: () => void;
}

export function CoursesPage({ onEnroll, onCourseClick, onSignIn, onGetStarted }: CoursesPageProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLevel, setSelectedLevel] = useState<string>('All');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [sortBy, setSortBy] = useState('popular');

    // ... existing course data ...

    // Mock course data
    const courses: Course[] = [
        {
            id: '1',
            title: 'Complete English Grammar Mastery',
            description: 'Master all essential grammar rules from basics to advanced with interactive exercises and real-world examples.',
            instructor: 'Dr. Sarah Johnson',
            rating: 4.9,
            reviews: 2341,
            students: 15234,
            duration: '12 weeks',
            level: 'Intermediate',
            category: 'Grammar',
            price: 'Premium',
            thumbnail: '📚',
            lessons: 48,
            certificate: true,
        },
        {
            id: '2',
            title: 'IELTS 8+ Band Guaranteed',
            description: 'Comprehensive IELTS preparation with proven strategies, 50+ practice tests, and expert feedback.',
            instructor: 'Michael Chen',
            rating: 4.8,
            reviews: 1876,
            students: 8932,
            duration: '8 weeks',
            level: 'Advanced',
            category: 'Exam Prep',
            price: 99,
            thumbnail: '🎯',
            lessons: 64,
            certificate: true,
        },
        // ... (rest of courses)
        {
            id: '3',
            title: 'Business English for Professionals',
            description: 'Master workplace communication, presentations, emails, and meetings for career success.',
            instructor: 'Emma Williams',
            rating: 4.9,
            reviews: 3102,
            students: 12456,
            duration: '10 weeks',
            level: 'Intermediate',
            category: 'Business English',
            price: 'Premium',
            thumbnail: '💼',
            lessons: 40,
            certificate: true,
        },
        {
            id: '4',
            title: 'American Accent Training',
            description: 'Perfect your American pronunciation with phonetics, intonation, and speaking practice.',
            instructor: 'David Miller',
            rating: 4.7,
            reviews: 987,
            students: 5621,
            duration: '6 weeks',
            level: 'Intermediate',
            category: 'Speaking',
            price: 'Premium',
            thumbnail: '🗣️',
            lessons: 32,
            certificate: true,
        },
        {
            id: '5',
            title: 'English for Beginners',
            description: 'Start your English journey with foundational vocabulary, grammar, and conversation skills.',
            instructor: 'Lisa Anderson',
            rating: 4.8,
            reviews: 4521,
            students: 23456,
            duration: '16 weeks',
            level: 'Beginner',
            category: 'General English',
            price: 'Premium',
            thumbnail: '🌱',
            lessons: 56,
            certificate: true,
        },
        {
            id: '6',
            title: 'TOEFL 110+ Mastery',
            description: 'Achieve top TOEFL scores with comprehensive iBT preparation and practice tests.',
            instructor: 'Prof. James Lee',
            rating: 4.9,
            reviews: 1234,
            students: 6789,
            duration: '10 weeks',
            level: 'Advanced',
            category: 'Exam Prep',
            price: 99,
            thumbnail: '📝',
            lessons: 52,
            certificate: true,
        },
    ];

    const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
    const categories = ['All', 'Grammar', 'Speaking', 'Exam Prep', 'Business English', 'General English'];

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
        const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
        return matchesSearch && matchesLevel && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header onSignIn={onSignIn} onGetStarted={onGetStarted} />

            <main className="flex-grow py-20 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Page Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-4">
                            Explore Our Courses
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Expert-designed curriculum for every level and goal
                        </p>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-card rounded-2xl p-6 shadow-lg border border-border mb-8">
                        {/* Search Bar */}
                        <div className="relative mb-6">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                            <input
                                type="text"
                                placeholder="Search courses, skills, topics..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-muted rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                            />
                        </div>

                        {/* Filters */}
                        <div className="grid md:grid-cols-3 gap-4">
                            {/* Level Filter */}
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">Level</label>
                                <select
                                    value={selectedLevel}
                                    onChange={(e) => setSelectedLevel(e.target.value)}
                                    className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                                >
                                    {levels.map(level => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">Category</label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Sort By */}
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">Sort By</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                                >
                                    <option value="popular">Most Popular</option>
                                    <option value="rating">Highest Rated</option>
                                    <option value="newest">Newest</option>
                                    <option value="duration">Duration</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mb-6">
                        <p className="text-muted-foreground">
                            Showing <span className="font-bold text-foreground">{filteredCourses.length}</span> courses
                        </p>
                    </div>

                    {/* Course Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCourses.map((course) => (
                            <div
                                key={course.id}
                                className="group bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer"
                                onClick={() => onCourseClick?.(course.id)}
                            >
                                {/* Thumbnail */}
                                <div className="relative h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                                    <div className="text-7xl">{course.thumbnail}</div>
                                    <div className="absolute top-4 right-4 px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-bold">
                                        {course.level}
                                    </div>
                                    {course.certificate && (
                                        <div className="absolute top-4 left-4 p-2 bg-card rounded-full shadow-lg">
                                            <Award size={20} className="text-accent" />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {/* Category Badge */}
                                    <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                                        {course.category}
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                        {course.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                        {course.description}
                                    </p>

                                    {/* Instructor */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xs font-bold">
                                            {course.instructor.charAt(0)}
                                        </div>
                                        <span className="text-sm text-muted-foreground">{course.instructor}</span>
                                    </div>

                                    {/* Stats */}
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

                                    {/* Course Info */}
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

                                    {/* Features */}
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <CheckCircle2 size={16} className="text-secondary" />
                                            <span>Certificate included</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <CheckCircle2 size={16} className="text-secondary" />
                                            <span>Lifetime access</span>
                                        </div>
                                    </div>

                                    {/* Price and CTA */}
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
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEnroll?.(course.id);
                                            }}
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

                    {/* No Results */}
                    {filteredCourses.length === 0 && (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-2xl font-bold text-foreground mb-2">No courses found</h3>
                            <p className="text-muted-foreground mb-6">
                                Try adjusting your filters or search query
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedLevel('All');
                                    setSelectedCategory('All');
                                }}
                                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
