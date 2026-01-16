import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Play, CheckCircle2, Lock, ChevronRight, Loader2, ArrowLeft, TrendingUp, Award } from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';

interface Module {
    id: string;
    title: string;
    description: string;
    order_index: number;
    lessons_count: number;
    total_minutes: number;
}

interface Course {
    id: string;
    title: string;
    description: string;
    level: string;
    thumbnail_url?: string;
    price?: number;
    instructor_name?: string;
    lessons_count?: number;
    modules: Module[];
    user_progress?: {
        completion_percentage: number;
        lessons_completed: number;
        lessons_total: number;
    };
}

export function CourseDetailPage() {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedModule, setExpandedModule] = useState<string | null>(null);
    const [moduleLessons, setModuleLessons] = useState<{ [key: string]: any[] }>({});
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [checkingEnrollment, setCheckingEnrollment] = useState(true);
    const userEmail = localStorage.getItem('myenglish_userEmail');
    const [isUnlocked, setIsUnlocked] = useState(false);

    useEffect(() => {
        if (courseId) {
            fetchCourseDetails();
            if (userEmail) {
                checkEnrollment();
            } else {
                setCheckingEnrollment(false);
            }
        }

        // Check subscription status
        const status = localStorage.getItem('myenglish_subscriptionStatus');
        const trialEnd = localStorage.getItem('myenglish_trialEndAt');

        let unlocked = false;
        const now = new Date();

        if (status === 'pro') {
            unlocked = true;
        } else if (status === 'trial' && trialEnd) {
            if (now < new Date(trialEnd)) unlocked = true;
        }
        setIsUnlocked(unlocked);

    }, [courseId, userEmail]);

    const checkEnrollment = async () => {
        try {
            const response = await fetch(`/api/enrollments?email=${userEmail}`);
            const data = await response.json();
            const enrolled = data.some((e: any) => e.course_id === courseId || e.learning_course_id === courseId);
            setIsEnrolled(enrolled);
        } catch (error) {
            console.error('Error checking enrollment:', error);
        } finally {
            setCheckingEnrollment(false);
        }
    };

    const handleEnroll = async () => {
        if (!userEmail) {
            navigate('/login');
            return;
        }

        if (!course) return;

        // Restrict free users to only "English for Beginners"
        if (!isUnlocked && course.title !== 'English for Beginners') {
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
                    coursePrice: course.price || 0,
                    courseCategory: 'General',
                    courseLevel: course.level,
                    courseDescription: course.description,
                    courseThumbnail: course.thumbnail_url,
                    courseInstructor: course.instructor_name || 'AI Tutor',
                    courseLessons: course.lessons_count || 0
                })
            });

            if (response.ok) {
                setIsEnrolled(true);
                alert(`Successfully enrolled in "${course.title}"!`);
            } else {
                throw new Error('Enrollment failed');
            }
        } catch (error) {
            console.error('Error enrolling:', error);
            alert('Failed to enroll. Please try again.');
        }
    };

    const fetchCourseDetails = async () => {
        try {
            const url = userEmail
                ? `/api/learning/courses/${courseId}?user_email=${userEmail}`
                : `/api/learning/courses/${courseId}`;

            const response = await fetch(url);
            const data = await response.json();
            setCourse(data);
        } catch (error) {
            console.error('Error fetching course:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchModuleLessons = async (moduleId: string) => {
        if (moduleLessons[moduleId]) {
            setExpandedModule(expandedModule === moduleId ? null : moduleId);
            return;
        }

        try {
            const url = userEmail
                ? `/api/learning/modules/${moduleId}/lessons?user_email=${userEmail}`
                : `/api/learning/modules/${moduleId}/lessons`;

            const response = await fetch(url);
            const lessons = await response.json();

            setModuleLessons(prev => ({ ...prev, [moduleId]: lessons }));
            setExpandedModule(moduleId);
        } catch (error) {
            console.error('Error fetching lessons:', error);
        }
    };

    const startLesson = (lessonId: string) => {
        // Strictly block premium content for non-Pro users
        if (!isUnlocked && course?.title !== 'English for Beginners') {
            alert("This is a Premium course. Please upgrade to Pro to access this content.");
            navigate('/pricing');
            return;
        }

        // General enrollment check
        if (!isEnrolled && !isUnlocked) {
            alert("Please enroll in this course or upgrade to access the lessons.");
            return;
        }
        navigate(`/learning/lesson/${lessonId}`);
    };

    const getStatusIcon = (status: string) => {
        if (!isEnrolled && !isUnlocked) return <Lock className="text-gray-400" size={16} />;

        switch (status) {
            case 'completed':
                return <CheckCircle2 className="text-green-500" size={20} />;
            case 'in_progress':
                return <Play className="text-indigo-500" size={20} />;
            default:
                return <Play className="text-gray-400" size={16} />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Course not found</h2>
                    <button onClick={() => navigate('/courses')} className="text-primary hover:underline">
                        ← Back to courses
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 flex flex-col">
            <Header
                onGetStarted={() => navigate('/assessment')}
                onSignIn={() => navigate('/login')}
                onExploreCourses={() => navigate('/courses')}
            />

            <main className="flex-grow pt-28 pb-20 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">

                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/courses')}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 font-medium transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to Courses
                    </button>

                    {/* Course Header */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[2.5rem] p-10 text-white mb-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                        <div className="relative z-10">
                            <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-sm font-bold mb-4">
                                {course.level}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-black mb-4">{course.title}</h1>
                            <p className="text-indigo-100 text-lg mb-8 max-w-3xl">
                                {course.description}
                            </p>

                            {!isEnrolled && !checkingEnrollment && (
                                !isUnlocked && course.title !== 'English for Beginners' ? (
                                    <button
                                        onClick={() => navigate('/pricing')}
                                        className="px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl font-bold text-lg shadow-xl hover:scale-105 transition-all flex items-center gap-2 mb-8"
                                    >
                                        Unlock Premium <ArrowLeft className="rotate-180" size={20} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleEnroll}
                                        className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg shadow-xl hover:bg-indigo-50 transition-all flex items-center gap-2 mb-8"
                                    >
                                        Enroll Now <ArrowLeft className="rotate-180" size={20} />
                                    </button>
                                )
                            )}

                            {/* Progress Bar */}
                            {course.user_progress && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-bold">Your Progress</span>
                                        <span className="font-bold">
                                            {course.user_progress.lessons_completed} / {course.user_progress.lessons_total} lessons
                                        </span>
                                    </div>
                                    <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="bg-white h-full rounded-full transition-all duration-500"
                                            style={{ width: `${course.user_progress.completion_percentage}%` }}
                                        />
                                    </div>
                                    <div className="text-sm font-bold">
                                        {(Number(course.user_progress.completion_percentage) || 0).toFixed(0)}% Complete
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Course Stats */}
                    <div className="grid sm:grid-cols-3 gap-4 mb-12">
                        <div className="bg-white dark:bg-zinc-900 border border-border rounded-2xl p-6 text-center">
                            <BookOpen className="mx-auto mb-3 text-indigo-600" size={32} />
                            <div className="text-2xl font-bold mb-1">{course.modules?.length || 0}</div>
                            <div className="text-sm text-muted-foreground">Modules</div>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 border border-border rounded-2xl p-6 text-center">
                            <TrendingUp className="mx-auto mb-3 text-purple-600" size={32} />
                            <div className="text-2xl font-bold mb-1">
                                {course.modules?.reduce((acc, m) => acc + m.lessons_count, 0) || 0}
                            </div>
                            <div className="text-sm text-muted-foreground">Lessons</div>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 border border-border rounded-2xl p-6 text-center">
                            <Award className="mx-auto mb-3 text-green-600" size={32} />
                            <div className="text-2xl font-bold mb-1">
                                {(Number(course.user_progress?.completion_percentage) || 0).toFixed(0)}%
                            </div>
                            <div className="text-sm text-muted-foreground">Completed</div>
                        </div>
                    </div>

                    {/* Learning Path - Modules */}
                    <div className="space-y-6">
                        <h2 className="text-3xl font-black mb-6">Learning Path</h2>

                        {course.modules && course.modules.length > 0 ? (
                            course.modules
                                .sort((a, b) => a.order_index - b.order_index)
                                .map((module, index) => (
                                    <div
                                        key={module.id}
                                        className="bg-white dark:bg-zinc-900 border border-border rounded-[2rem] overflow-hidden shadow-sm"
                                    >
                                        {/* Module Header */}
                                        <button
                                            onClick={() => fetchModuleLessons(module.id)}
                                            className="w-full p-6 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-left"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-xl font-bold mb-1">{module.title}</h3>
                                                <p className="text-sm text-muted-foreground line-clamp-1">
                                                    {module.description}
                                                </p>
                                                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <BookOpen size={12} />
                                                        {module.lessons_count} lessons
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={12} />
                                                        {module.total_minutes} min
                                                    </span>
                                                </div>
                                            </div>
                                            <ChevronRight
                                                className={`flex-shrink-0 transition-transform ${expandedModule === module.id ? 'rotate-90' : ''
                                                    }`}
                                                size={24}
                                            />
                                        </button>

                                        {/* Lessons List */}
                                        {expandedModule === module.id && moduleLessons[module.id] && (
                                            <div className="border-t border-border bg-gray-50/50 dark:bg-zinc-950/50">
                                                {moduleLessons[module.id].map((lesson: any, lessonIndex: number) => (
                                                    <div
                                                        key={lesson.id}
                                                        className="border-b border-border last:border-b-0 hover:bg-white dark:hover:bg-zinc-900 transition-colors"
                                                    >
                                                        <button
                                                            onClick={() => startLesson(lesson.id)}
                                                            className="w-full p-4 flex items-center gap-4 text-left"
                                                        >
                                                            <div className="flex-shrink-0">
                                                                {getStatusIcon(lesson.user_progress?.status)}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="font-bold mb-1">
                                                                    {lessonIndex + 1}. {lesson.title}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground flex items-center gap-3">
                                                                    <span className="flex items-center gap-1">
                                                                        <Clock size={12} />
                                                                        {lesson.estimated_minutes} min
                                                                    </span>
                                                                    <span className="capitalize">
                                                                        {lesson.lesson_type}
                                                                    </span>
                                                                    {lesson.user_progress?.completion_percentage > 0 && (
                                                                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                                                                            {lesson.user_progress.completion_percentage}%
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <ChevronRight className="flex-shrink-0 text-muted-foreground" size={20} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                No modules available yet
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
