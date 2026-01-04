import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Award, Clock, BookOpen, Target, ChevronRight, Loader2 } from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';

interface ProgressData {
    course_progress: Array<{
        course_id: string;
        course_title: string;
        completion_percentage: number;
        lessons_completed: number;
        lessons_total: number;
        last_activity_at: string;
    }>;
    recent_activity: Array<{
        lesson_id: string;
        lesson_title: string;
        module_title: string;
        status: string;
        last_accessed_at: string;
        completion_percentage: number;
    }>;
    statistics: {
        total_lessons_started: number;
        lessons_completed: number;
        total_time_spent: number;
        average_quiz_score: number | null;
    };
}

export function LearningProgressPage() {
    const navigate = useNavigate();
    const [progress, setProgress] = useState<ProgressData | null>(null);
    const [loading, setLoading] = useState(true);
    const userEmail = localStorage.getItem('myenglish_userEmail');

    useEffect(() => {
        if (!userEmail) {
            navigate('/login');
            return;
        }
        fetchProgress();
    }, []);

    const fetchProgress = async () => {
        try {
            const response = await fetch(`/api/learning/progress?user_email=${userEmail}`);
            const data = await response.json();
            setProgress(data);
        } catch (error) {
            console.error('Error fetching progress:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    const stats = progress?.statistics || {
        total_lessons_started: 0,
        lessons_completed: 0,
        total_time_spent: 0,
        average_quiz_score: null
    };

    const completionRate = stats.total_lessons_started > 0
        ? Math.round((stats.lessons_completed / stats.total_lessons_started) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 flex flex-col">
            <Header
                onGetStarted={() => navigate('/assessment')}
                onSignIn={() => navigate('/login')}
                onExploreCourses={() => navigate('/courses')}
            />

            <main className="flex-grow pt-28 pb-20 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="mb-12">
                        <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Your Learning Progress
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Track your journey and celebrate your achievements
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {/* Lessons Started */}
                        <div className="bg-white dark:bg-zinc-900 border border-border rounded-[2rem] p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                                    <BookOpen className="text-indigo-600 dark:text-indigo-400" size={24} />
                                </div>
                                <TrendingUp className="text-green-500" size={20} />
                            </div>
                            <div className="text-3xl font-black mb-1">{stats.total_lessons_started}</div>
                            <div className="text-sm text-muted-foreground">Lessons Started</div>
                        </div>

                        {/* Lessons Completed */}
                        <div className="bg-white dark:bg-zinc-900 border border-border rounded-[2rem] p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <Award className="text-green-600 dark:text-green-400" size={24} />
                                </div>
                            </div>
                            <div className="text-3xl font-black mb-1">{stats.lessons_completed}</div>
                            <div className="text-sm text-muted-foreground">Lessons Completed</div>
                        </div>

                        {/* Time Spent */}
                        <div className="bg-white dark:bg-zinc-900 border border-border rounded-[2rem] p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                    <Clock className="text-purple-600 dark:text-purple-400" size={24} />
                                </div>
                            </div>
                            <div className="text-3xl font-black mb-1">
                                {Math.floor(stats.total_time_spent / 60)}h {stats.total_time_spent % 60}m
                            </div>
                            <div className="text-sm text-muted-foreground">Time Learning</div>
                        </div>

                        {/* Completion Rate */}
                        <div className="bg-white dark:bg-zinc-900 border border-border rounded-[2rem] p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                    <Target className="text-orange-600 dark:text-orange-400" size={24} />
                                </div>
                            </div>
                            <div className="text-3xl font-black mb-1">{completionRate}%</div>
                            <div className="text-sm text-muted-foreground">Completion Rate</div>
                        </div>
                    </div>

                    {/* Course Progress */}
                    <div className="grid lg:grid-cols-2 gap-8 mb-12">
                        <div>
                            <h2 className="text-2xl font-black mb-6">Enrolled Courses</h2>
                            {progress?.course_progress && progress.course_progress.length > 0 ? (
                                <div className="space-y-4">
                                    {progress.course_progress.map(course => (
                                        <div
                                            key={course.course_id}
                                            className="bg-white dark:bg-zinc-900 border border-border rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                            onClick={() => navigate(`/learning/course/${course.course_id}`)}
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="font-bold text-lg mb-1">{course.course_title}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {course.lessons_completed} / {course.lessons_total} lessons
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                                        {course.completion_percentage.toFixed(0)}%
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {formatDate(course.last_activity_at)}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full rounded-full transition-all duration-500"
                                                    style={{ width: `${course.completion_percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white dark:bg-zinc-900 border border-border rounded-[2rem] p-12 text-center">
                                    <BookOpen className="mx-auto mb-4 text-muted-foreground opacity-50" size={48} />
                                    <h3 className="font-bold mb-2">No courses yet</h3>
                                    <p className="text-sm text-muted-foreground mb-6">
                                        Start your learning journey today!
                                    </p>
                                    <button
                                        onClick={() => navigate('/courses')}
                                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all"
                                    >
                                        Browse Courses
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Recent Activity */}
                        <div>
                            <h2 className="text-2xl font-black mb-6">Recent Activity</h2>
                            {progress?.recent_activity && progress.recent_activity.length > 0 ? (
                                <div className="space-y-3">
                                    {progress.recent_activity.map((activity, index) => (
                                        <div
                                            key={index}
                                            className="bg-white dark:bg-zinc-900 border border-border rounded-2xl p-4 hover:shadow-md transition-shadow cursor-pointer"
                                            onClick={() => navigate(`/learning/lesson/${activity.lesson_id}`)}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-bold mb-1 line-clamp-1">
                                                        {activity.lesson_title}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground mb-2">
                                                        {activity.module_title}
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activity.status === 'completed'
                                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                            }`}>
                                                            {activity.status === 'completed' ? 'Completed' : 'In Progress'}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {formatDate(activity.last_accessed_at)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <ChevronRight className="flex-shrink-0 text-muted-foreground" size={20} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white dark:bg-zinc-900 border border-border rounded-[2rem] p-12 text-center">
                                    <Clock className="mx-auto mb-4 text-muted-foreground opacity-50" size={48} />
                                    <h3 className="font-bold mb-2">No activity yet</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Start a lesson to see your progress here
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Achievement Section */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[2.5rem] p-10 text-white">
                        <div className="max-w-2xl">
                            <Award className="mb-4" size={48} />
                            <h2 className="text-3xl font-black mb-4">Keep Going!</h2>
                            <p className="text-indigo-100 text-lg mb-6">
                                You've completed {stats.lessons_completed} lessons and spent {Math.floor(stats.total_time_spent / 60)} hours learning.
                                {completionRate >= 50
                                    ? " You're doing amazing! Keep up the great work! 🎉"
                                    : " Every step counts towards mastery! 💪"}
                            </p>
                            <button
                                onClick={() => navigate('/courses')}
                                className="px-8 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:scale-105 transition-transform shadow-xl"
                            >
                                Continue Learning
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
