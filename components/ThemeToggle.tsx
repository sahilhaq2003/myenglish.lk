import React from 'react';
import { Moon, Sun, Laptop } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex items-center p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-inner">
            <button
                onClick={() => setTheme('light')}
                className={`p-1.5 rounded-full transition-all duration-300 ${theme === 'light'
                    ? 'bg-white text-orange-500 shadow-sm ring-1 ring-black/5 scale-100'
                    : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 scale-90 hover:scale-100'}`}
                title="Light mode"
            >
                <Sun size={16} strokeWidth={2.5} />
            </button>
            <button
                onClick={() => setTheme('system')}
                className={`p-1.5 rounded-full transition-all duration-300 ${theme === 'system'
                    ? 'bg-white dark:bg-zinc-600 text-blue-500 dark:text-blue-400 shadow-sm ring-1 ring-black/5 dark:ring-white/10 scale-100'
                    : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 scale-90 hover:scale-100'}`}
                title="System preference"
            >
                <Laptop size={16} strokeWidth={2.5} />
            </button>
            <button
                onClick={() => setTheme('dark')}
                className={`p-1.5 rounded-full transition-all duration-300 ${theme === 'dark'
                    ? 'bg-zinc-700 text-indigo-400 shadow-sm ring-1 ring-white/10 scale-100'
                    : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 scale-90 hover:scale-100'}`}
                title="Dark mode"
            >
                <Moon size={16} strokeWidth={2.5} />
            </button>
        </div>
    );
}
