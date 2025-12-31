import React, { useState, useEffect } from 'react';
import { User, Mail, Settings, ChevronLeft, Loader2, Save, Trash2, AlertTriangle, Calendar, Award, BookOpen, Clock, CheckCircle2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

interface ProfileData {
    first_name: string;
    birthday: string;
    username: string; // Keeping as Login Display Name or Last Name based on backend
    email: string;
    bio: string;
    phone: string;
    location: string;
    avatar_url: string;
    created_at: string;
    current_level?: string;
    learning_goal?: string;
    daily_goal?: number;
}

export function ProfilePage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

    const displayToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    const [profile, setProfile] = useState<ProfileData>({
        first_name: '',
        birthday: '',
        username: '',
        email: '',
        bio: '',
        phone: '',
        location: '',
        avatar_url: '',
        created_at: '',
        current_level: 'Not assessed yet',
        learning_goal: 'Professional Communication',
        daily_goal: 20
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const email = localStorage.getItem('myenglish_userEmail');
            if (!email) {
                navigate('/login');
                return;
            }

            console.log('Fetching profile for email:', email);
            const response = await fetch(`http://localhost:3001/api/profile?email=${email}`);

            if (response.status === 404) {
                // User exists in local storage but not in DB (e.g. DB reset)
                // We should probably log them out or let them simple 're-create' by updating? 
                // For now, let's just keep the form empty but populate the email from local storage so they can at least delete or re-save.
                console.log('User not found in database, setting email only');
                setProfile(prev => ({ ...prev, email: email }));
                setLoading(false);
                return;
            }

            const data = await response.json();
            console.log('Fetched profile data from DB:', data);

            if (response.ok) {
                // Robust date parsing
                let formattedBirthday = '';
                if (data.birthday) {
                    try {
                        // Handle MySQL date string or JS Date object
                        const d = new Date(data.birthday);
                        if (!isNaN(d.getTime())) {
                            formattedBirthday = d.toISOString().split('T')[0];
                            console.log('Formatted birthday:', formattedBirthday, 'from raw:', data.birthday);
                        }
                    } catch (e) {
                        console.warn('Date parsing failed:', e);
                    }
                } else {
                    console.log('No birthday data received from database');
                }

                const profileData = {
                    first_name: data.first_name || '',
                    username: data.username || '',
                    email: data.email || email,
                    birthday: formattedBirthday,
                    bio: data.bio || '',
                    phone: data.phone || '',
                    location: data.location || '',
                    avatar_url: data.avatar_url || '',
                    created_at: data.created_at || new Date().toISOString(),
                    current_level: data.current_level || 'Not assessed yet',
                    learning_goal: data.learning_goal || 'Professional Communication',
                    daily_goal: data.daily_goal || 20
                };
                
                console.log('Setting profile state with:', profileData);
                setProfile(profileData);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        setSaving(true);
        // Ensure we have an email, even if profile was empty
        const emailToUpdate = profile.email || localStorage.getItem('myenglish_userEmail');

        if (!emailToUpdate) {
            displayToast('Error: No email found. Please log in again.', 'error');
            setSaving(false);
            navigate('/login');
            return;
        }

        // Prepare data to send - ensure all fields are included
        const profileToSave = {
            email: emailToUpdate,
            first_name: profile.first_name || '',
            username: profile.username || '',
            birthday: profile.birthday || null,
            bio: profile.bio || '',
            phone: profile.phone || '',
            location: profile.location || '',
            current_level: profile.current_level || 'Not assessed yet',
            learning_goal: profile.learning_goal || 'Professional Communication',
            daily_goal: profile.daily_goal || 20
        };

        console.log('Saving profile data:', profileToSave);
        console.log('Birthday value being sent:', profile.birthday);

        try {
            const response = await fetch('http://localhost:3001/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileToSave)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Profile update response:', result);
                
                // Update local storage with Full Name for better display in Sidebar/Header
                const displayName = profile.first_name
                    ? `${profile.first_name} ${profile.username || ''}`.trim()
                    : profile.username || 'User';

                localStorage.setItem('myenglish_userName', displayName);

                // Refetch profile from database to ensure we have the latest data
                await fetchProfile();

                // Show success toast
                displayToast('Profile updated successfully! All changes have been saved.');
            } else {
                const errorData = await response.json();
                console.error('Profile update failed:', errorData);
                displayToast(`Failed to update profile: ${errorData.message || 'Unknown error'}`, 'error');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            displayToast('Network error: Could not connect to server. Please check if the server is running.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmation.toLowerCase() !== 'delete') return;

        setDeleteLoading(true);

        const emailToDelete = profile.email || localStorage.getItem('myenglish_userEmail');
        if (!emailToDelete) {
            alert("Cannot identify account to delete. Please log in again.");
            navigate('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/profile', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailToDelete })
            });

            // Check content type to avoid parsing HTML as JSON
            const contentType = response.headers.get("content-type");
            let data;
            if (contentType && contentType.indexOf("application/json") !== -1) {
                data = await response.json();
            } else {
                data = { message: await response.text() };
            }

            if (response.ok) {
                localStorage.clear();
                alert('Account deleted successfully');
                navigate('/');
            } else if (response.status === 404) {
                // User already deleted from DB, just clean up frontend
                localStorage.clear();
                alert('Account already deleted or does not exist. You have been logged out.');
                navigate('/');
            } else {
                alert(`Failed to delete account: ${data.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('An error occurred while trying to delete the account. Please try again.');
        } finally {
            setDeleteLoading(false);
            setShowDeleteModal(false);
        }
    };

    const learningGoals = [
        'Professional Communication',
        'Academic English',
        'Travel & Culture',
        'Exam Preparation (IELTS/TOEFL)',
        'Daily Conversation'
    ];

    if (loading) {
        return (
            <div className="h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 flex flex-col font-sans">
            <Header
                onGetStarted={() => navigate('/assessment')}
                onSignIn={() => navigate('/login')}
                onExploreCourses={() => navigate('/courses')}
            />

            <main className="flex-grow pt-28 pb-20 px-4 sm:px-6">
                <div className="max-w-5xl mx-auto space-y-8">

                    {/* Header Card */}
                    <div className="bg-white dark:bg-zinc-900 border border-border rounded-[2rem] p-8 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-10" />

                        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 pt-4">
                            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-zinc-800 shadow-xl overflow-hidden bg-white">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${profile.username || 'User'}&background=random&size=256`}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex-1 text-center md:text-left space-y-2 pt-2">
                                <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
                                    <div>
                                        <h1 className="text-3xl font-black text-foreground tracking-tight">{profile.first_name} {profile.username}</h1>
                                        <p className="text-muted-foreground font-medium flex items-center justify-center md:justify-start gap-2">
                                            <Mail size={16} /> {profile.email}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-bold border border-indigo-100 dark:border-indigo-800">
                                            {profile.current_level || 'Beginner'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <Calendar size={14} />
                                        <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <Award size={14} />
                                        <span>Daily Goal: {profile.daily_goal}m</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Settings Column */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Personal Info */}
                            <div className="bg-white dark:bg-zinc-900 border border-border rounded-[2rem] p-8 shadow-sm">
                                <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-foreground">
                                    <User className="text-indigo-500" size={22} />
                                    Personal Details
                                </h3>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">First Name</label>
                                        <input
                                            type="text"
                                            value={profile.first_name}
                                            onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                                            className="w-full bg-muted/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl px-5 py-3.5 outline-none transition-all font-medium"
                                            placeholder="Your first name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Last Name</label>
                                        <input
                                            type="text"
                                            value={profile.username}
                                            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                            className="w-full bg-muted/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl px-5 py-3.5 outline-none transition-all font-medium"
                                            placeholder="Your last name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Birthday</label>
                                        <input
                                            type="date"
                                            value={profile.birthday}
                                            onChange={(e) => setProfile({ ...profile, birthday: e.target.value })}
                                            className="w-full bg-muted/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl px-5 py-3.5 outline-none transition-all font-medium text-foreground"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Email</label>
                                        <input
                                            type="email"
                                            value={profile.email}
                                            disabled
                                            className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-3.5 outline-none text-gray-600 dark:text-gray-400 cursor-not-allowed font-medium"
                                        />
                                    </div>

                                    <div className="col-span-full space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Bio</label>
                                        <textarea
                                            value={profile.bio || ''}
                                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                            className="w-full bg-muted/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl px-5 py-3.5 outline-none transition-all font-medium min-h-[100px] resize-none"
                                            placeholder="Tell us a bit about yourself..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="flex justify-end">
                                <button
                                    onClick={handleUpdate}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-10 py-4 bg-gray-900 dark:bg-zinc-100 hover:bg-black dark:hover:bg-white text-white dark:text-gray-900 rounded-[1.2rem] font-bold text-lg shadow-xl shadow-gray-200 dark:shadow-none transition-all hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                                    Save Changes
                                </button>
                            </div>
                        </div>

                        {/* Sidebar Column */}
                        <div className="space-y-8">
                            {/* Learning Preferences */}
                            <div className="bg-white dark:bg-zinc-900 border border-border rounded-[2rem] p-8 shadow-sm h-fit">
                                <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-foreground">
                                    <BookOpen className="text-indigo-500" size={22} />
                                    Learning Goals
                                </h3>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Main Goal</label>
                                        <div className="relative">
                                            <select
                                                value={profile.learning_goal}
                                                onChange={(e) => setProfile({ ...profile, learning_goal: e.target.value })}
                                                className="w-full bg-muted/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl px-5 py-3.5 outline-none transition-all font-medium appearance-none cursor-pointer"
                                            >
                                                {learningGoals.map(goal => (
                                                    <option key={goal} value={goal}>{goal}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                                <ChevronLeft className="-rotate-90" size={16} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Daily Practice</label>
                                            <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md text-sm">{profile.daily_goal} min</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="5"
                                            max="60"
                                            step="5"
                                            value={profile.daily_goal}
                                            onChange={(e) => setProfile({ ...profile, daily_goal: parseInt(e.target.value) })}
                                            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                        />
                                        <div className="flex justify-between text-xs text-muted-foreground font-medium px-1">
                                            <span>5m</span>
                                            <span>30m</span>
                                            <span>60m</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Danger Zone */}
                            <div className="bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-[2rem] p-8 shadow-sm">
                                <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-red-600">
                                    <AlertTriangle size={22} />
                                    Danger Zone
                                </h3>
                                <p className="text-sm text-red-600/80 mb-6 leading-relaxed">
                                    Once you delete your account, there is no going back. Please be certain.
                                </p>
                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="w-full py-3 bg-white dark:bg-red-950 border border-red-200 dark:border-red-900 text-red-600 font-bold rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={18} />
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-border shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle size={32} />
                        </div>

                        <h2 className="text-2xl font-black text-center mb-2">Delete Account?</h2>
                        <p className="text-center text-muted-foreground mb-8">
                            This action cannot be undone. To verify, please type <span className="font-bold text-foreground">delete</span> below.
                        </p>

                        <div className="space-y-4">
                            <input
                                type="text"
                                value={deleteConfirmation}
                                onChange={(e) => setDeleteConfirmation(e.target.value)}
                                placeholder="Type 'delete' to confirm"
                                className="w-full text-center bg-secondary/30 border border-border focus:border-red-500 rounded-xl px-4 py-3 outline-none font-bold"
                            />

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 py-3 bg-secondary hover:bg-muted text-foreground font-bold rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={deleteConfirmation.toLowerCase() !== 'delete' || deleteLoading}
                                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {deleteLoading ? <Loader2 className="animate-spin" size={18} /> : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
                    <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border-2 min-w-[320px] max-w-md ${
                        toastType === 'success'
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    }`}>
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                            toastType === 'success'
                                ? 'bg-green-100 dark:bg-green-900/40'
                                : 'bg-red-100 dark:bg-red-900/40'
                        }`}>
                            {toastType === 'success' ? (
                                <CheckCircle2 size={24} className="text-green-600 dark:text-green-400" />
                            ) : (
                                <AlertTriangle size={24} className="text-red-600 dark:text-red-400" />
                            )}
                        </div>
                        <div className="flex-1">
                            <p className={`font-bold text-sm ${
                                toastType === 'success'
                                    ? 'text-green-900 dark:text-green-100'
                                    : 'text-red-900 dark:text-red-100'
                            }`}>
                                {toastType === 'success' ? 'Success!' : 'Error'}
                            </p>
                            <p className={`text-sm ${
                                toastType === 'success'
                                    ? 'text-green-700 dark:text-green-300'
                                    : 'text-red-700 dark:text-red-300'
                            }`}>
                                {toastMessage}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowToast(false)}
                            className={`flex-shrink-0 p-1 rounded-lg transition-colors ${
                                toastType === 'success'
                                    ? 'hover:bg-green-100 dark:hover:bg-green-900/40 text-green-700 dark:text-green-300'
                                    : 'hover:bg-red-100 dark:hover:bg-red-900/40 text-red-700 dark:text-red-300'
                            }`}
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
