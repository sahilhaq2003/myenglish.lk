import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, GraduationCap, Users, ChevronRight, Loader2, Star, TrendingUp, Search, Play, Check, Sparkles } from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';

interface Course {
    id: string;
    title: string;
    description: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    thumbnail_url: string;
    price: number;
    duration_weeks: number;
    instructor_name: string;
    modules_count: number;
    lessons_count: number;
    category?: string; // Optional as it might not be in DB response directly
}

// Map course IDs to high-quality images (matching HomePage)
const COURSE_IMAGES: Record<string, string> = {
    'course_beginner_english': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=600&fit=crop',
    'course_ielts_prep': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop',
    'course_business_english': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=600&fit=crop',
    'course_american_accent': 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop',
    'course_conversational_beginners': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop',
    'course_advanced_writing': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop'
};

const COURSE_CATEGORIES: Record<string, string> = {
    'course_beginner_english': 'Grammar',
    'course_ielts_prep': 'Exam Prep',
    'course_business_english': 'Business',
    'course_american_accent': 'Speaking',
    'course_conversational_beginners': 'Speaking',
    'course_advanced_writing': 'Writing'
};

export function CoursesPage() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState<Course[]>([]);
    const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const userEmail = localStorage.getItem('myenglish_userEmail');

    useEffect(() => {
        fetchCourses();
        if (userEmail) {
            fetchEnrolledCourses();
        }
    }, [userEmail]);

    const fetchCourses = async () => {
        try {
            const response = await fetch('/api/learning/courses');
            const data = await response.json();

            // Enrich data with images and categories
            const enrichedData = data.map((course: any) => ({
                ...course,
                thumbnail_url: COURSE_IMAGES[course.id] || course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
                category: COURSE_CATEGORIES[course.id] || 'General English'
            }));

            setCourses(enrichedData);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchEnrolledCourses = async () => {
        try {
            const response = await fetch(`/api/enrollments?email=${userEmail}`);
            const data = await response.json();
            // Store mapped learning_course_id
            setEnrolledCourses(data.map((e: any) => e.learning_course_id || e.course_id));
        } catch (error) {
            console.error('Error fetching enrollments:', error);
        }
    };

    const handleEnroll = async (course: Course) => {
        if (!userEmail) {
            navigate('/login');
            return;
        }

        // Check subscription status
        const subStatus = localStorage.getItem('myenglish_subscriptionStatus');
        const trialEnd = localStorage.getItem('myenglish_trialEndAt');

        const isPro = subStatus === 'pro';
        const isTrialActive = subStatus === 'trial' && trialEnd && new Date() < new Date(trialEnd);
        const isUnlocked = isPro || isTrialActive;

        // Ensure price is treated as a number
        const price = Number(course.price);

        if (price > 0 && !isUnlocked) {
            alert("This is a Premium course. Please upgrade your plan to enroll.");
            navigate('/pricing');
            return;
        }

        try {
            const response = await fetch('/api/enrollments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userEmail: userEmail,
                    courseId: course.id,
                    courseTitle: course.title,
                    coursePrice: course.price,
                    courseCategory: course.category,
                    courseLevel: course.level,
                    courseDescription: course.description,
                    courseThumbnail: course.thumbnail_url,
                    courseInstructor: course.instructor_name,
                    courseLessons: course.lessons_count
                })
            });

            if (response.status === 409) {
                alert('You are already enrolled in this course!');
                return;
            }

            if (response.ok) {
                setEnrolledCourses(prev => [...prev, course.id]);
                alert(`Successfully enrolled in "${course.title}"!`);
                navigate(`/learning/course/${course.id}`);
            } else {
                const data = await response.json();
                throw new Error(data.message || 'Enrollment failed');
            }
        } catch (error) {
            console.error('Error enrolling:', error);
            alert('Failed to enroll. Please try again.');
        }
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'Beginner': return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300';
            case 'Intermediate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300';
            case 'Advanced': return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const filteredCourses = courses.filter(c => {
        const matchesLevel = filter === 'all' || c.level.toLowerCase() === filter;
        const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesLevel && matchesSearch;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header
                onGetStarted={() => navigate('/assessment')}
                onSignIn={() => navigate('/login')}
                onExploreCourses={() => { }}
            />

            <main className="flex-grow pt-32 pb-20 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">

                    {/* Hero Section */}
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold text-sm mb-4">
                            <Sparkles size={16} />
                            <span>AI-Powered Curriculum</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
                            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Premium Courses</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Unlock your potential with expert-led courses and AI tutors that adapt to your unique learning style.
                        </p>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between bg-card p-4 rounded-2xl border border-border shadow-sm">

                        {/* Search Bar */}
                        <div className="relative w-full md:w-96 group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-indigo-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-zinc-800 border-transparent focus:bg-background border-2 focus:border-indigo-500 rounded-xl transition-all outline-none"
                                placeholder="Search for courses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                            {['all', 'beginner', 'intermediate', 'advanced'].map(level => (
                                <button
                                    key={level}
                                    onClick={() => setFilter(level as any)}
                                    className={`px-6 py-2.5 rounded-xl font-bold capitalize transition-all whitespace-nowrap ${filter === level
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 scale-105'
                                        : 'bg-background hover:bg-secondary border border-border text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    {level === 'all' ? 'All Levels' : level}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Courses Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCourses.map(course => {
                            const isEnrolled = enrolledCourses.includes(course.id);

                            return (
                                <div
                                    key={course.id}
                                    className="group bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full"
                                >
                                    {/* Course Image */}
                                    <div className="h-56 relative overflow-hidden">
                                        <img
                                            src={course.thumbnail_url}
                                            alt={course.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-lg ${getLevelColor(course.level)} bg-opacity-90`}>
                                                {course.level}
                                            </span>
                                        </div>

                                        <div className="absolute bottom-4 left-4 right-4">
                                            <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1">
                                                {course.category}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1 text-yellow-400">
                                                    <Star size={16} fill="currentColor" />
                                                    <span className="text-white font-bold">4.9</span>
                                                    <span className="text-white/70 text-xs">(2.4k)</span>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                    {/* Course Content */}
                                    <div className="p-6 flex-grow flex flex-col space-y-4">
                                        <div className="flex-grow">
                                            <h3 className="text-xl font-black mb-2 line-clamp-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                {course.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                                {course.description}
                                            </p>
                                        </div>

                                        {/* Instructor */}
                                        <div className="flex items-center gap-3 py-3 border-y border-border/50">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-background">
                                                {course.instructor_name.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs text-muted-foreground">Instructor</span>
                                                <span className="text-sm font-bold">{course.instructor_name}</span>
                                            </div>
                                        </div>

                                        {/* Course Meta */}
                                        <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                                            <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-zinc-800 px-2.5 py-1.5 rounded-lg">
                                                <BookOpen size={14} className="text-indigo-500" />
                                                <span>{course.lessons_count || 12} Lessons</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-zinc-800 px-2.5 py-1.5 rounded-lg">
                                                <Clock size={14} className="text-purple-500" />
                                                <span>{course.duration_weeks} Weeks</span>
                                            </div>
                                        </div>

                                        {/* CTA Button */}
                                        <div className="pt-2">
                                            {isEnrolled ? (
                                                <button
                                                    onClick={() => navigate(`/learning/course/${course.id}`)}
                                                    className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-600/20 active:scale-95"
                                                >
                                                    <Check size={18} />
                                                    Continue Learning
                                                    <ChevronRight size={18} />
                                                </button>
                                            ) : (
                                                <div className="space-y-3">
                                                    <button
                                                        onClick={() => handleEnroll(course)}
                                                        className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${Number(course.price) > 0 && !(localStorage.getItem('myenglish_subscriptionStatus') === 'pro' || (localStorage.getItem('myenglish_subscriptionStatus') === 'trial' && localStorage.getItem('myenglish_trialEndAt') && new Date() < new Date(localStorage.getItem('myenglish_trialEndAt') || '')))
                                                                ? 'bg-slate-800 text-white hover:bg-slate-900 shadow-slate-900/20'
                                                                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30'
                                                            }`}
                                                    >
                                                        {Number(course.price) > 0 && !(localStorage.getItem('myenglish_subscriptionStatus') === 'pro' || (localStorage.getItem('myenglish_subscriptionStatus') === 'trial' && localStorage.getItem('myenglish_trialEndAt') && new Date() < new Date(localStorage.getItem('myenglish_trialEndAt') || '')))
                                                            ? <><Users size={18} /> Unlock Premium</>
                                                            : <><Play size={18} className="fill-current" /> Enroll Now</>
                                                        }
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/learning/course/${course.id}`)}
                                                        className="w-full py-3.5 bg-white dark:bg-zinc-800 text-foreground border border-border hover:bg-gray-50 dark:hover:bg-zinc-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:border-indigo-200"
                                                    >
                                                        <BookOpen size={18} />
                                                        View Content
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Empty State */}
                    {filteredCourses.length === 0 && (
                        <div className="text-center py-20 bg-card rounded-[3rem] border border-border mt-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-6">
                                <Search size={32} className="text-muted-foreground opacity-50" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">No courses found</h3>
                            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                                We couldn't find any courses matching "{searchQuery}" with the selected filter.
                            </p>
                            <button
                                onClick={() => { setFilter('all'); setSearchQuery(''); }}
                                className="text-primary font-bold hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

